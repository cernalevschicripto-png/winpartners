// ============================================================
// WinPartners — Storage cu fallback inteligent
// Încearcă Firebase, cade pe localStorage dacă nu e configurat
// ============================================================

const FB_URL = import.meta.env.VITE_FB_URL || ''
const USE_FIREBASE = FB_URL && FB_URL !== 'PLACEHOLDER_DB_URL' && (FB_URL.includes('firebasedatabase') || FB_URL.includes('firebaseio'))

// ─── FIREBASE REST HELPERS ───────────────────────────────────
async function fbGet(path) {
  try {
    const url = `${FB_URL}/${path}.json`
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

async function fbSet(path, data) {
  try {
    const url = `${FB_URL}/${path}.json`
    const res = await fetch(url, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data), signal: AbortSignal.timeout(5000) })
    return res.ok ? res.json() : null
  } catch { return null }
}

async function fbPatch(path, data) {
  try {
    const url = `${FB_URL}/${path}.json`
    const res = await fetch(url, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data), signal: AbortSignal.timeout(5000) })
    return res.ok ? res.json() : null
  } catch { return null }
}

async function fbPush(path, data) {
  try {
    const url = `${FB_URL}/${path}.json`
    const res = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data), signal: AbortSignal.timeout(5000) })
    return res.ok ? res.json() : null
  } catch { return null }
}

async function fbDelete(path) {
  try {
    const url = `${FB_URL}/${path}.json`
    const res = await fetch(url, { method:'DELETE', signal: AbortSignal.timeout(5000) })
    return res.ok
  } catch { return false }
}

function toArr(obj) {
  if (!obj || typeof obj !== 'object') return []
  return Object.entries(obj).map(([k, v]) => ({ ...v, _key: k }))
}

// ─── LOCALSTORAGE HELPERS (fallback) ─────────────────────────
function lsGet(key, def = null) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def } catch { return def }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

// ─── DATE INIȚIALE ───────────────────────────────────────────
const INIT_BLOGGERS = {
  ionpopescu: { id:'ionpopescu', name:'Ion Popescu', username:'ionpopescu', platform:'TikTok', country:'Moldova', phone:'+373601234', status:'active', commission:25, clicks:1247, regs:89, deposits:34, revenue:1840, paid:230, email:'ion@gmail.com', pass:'ion2026', payMethod:'Bitcoin', payAddress:'bc1qxxx' },
  alexmarin:  { id:'alexmarin',  name:'Alex Marin',  username:'alexmarin',  platform:'Instagram', country:'România', phone:'+40721234', status:'active', commission:25, clicks:856, regs:52, deposits:18, revenue:1120, paid:140, email:'alex@gmail.com', pass:'alex2026', payMethod:'Bitcoin', payAddress:'bc1qyyy' },
  vladgaming:  { id:'vladgaming',  name:'Vlad Gaming',  username:'vladgaming',  platform:'YouTube', country:'Ucraina', phone:'+380671234', status:'pending', commission:25, clicks:234, regs:12, deposits:3, revenue:180, paid:0, email:'vlad@gmail.com', pass:'vlad2026', payMethod:'Skrill', payAddress:'' },
}

const INIT_PROMO = {
  melbet: {
    c0:{code:'ml_2738117',status:'disponibil',bloggerUsername:null,generatedAt:null,melbetId:'11035387'},
    c1:{code:'ml_2796938',status:'disponibil',bloggerUsername:null,generatedAt:null,melbetId:'11180407'},
    c2:{code:'ml_2796939',status:'disponibil',bloggerUsername:null,generatedAt:null,melbetId:'11180417'},
    c3:{code:'ml_2796940',status:'disponibil',bloggerUsername:null,generatedAt:null,melbetId:'11180418'},
    c4:{code:'ml_2796941',status:'disponibil',bloggerUsername:null,generatedAt:null,melbetId:'11180419'},
    c5:{code:'ml_2796942',status:'disponibil',bloggerUsername:null,generatedAt:null,melbetId:'11180420'},
    c6:{code:'ml_2796943',status:'disponibil',bloggerUsername:null,generatedAt:null,melbetId:'11180421'},
    c7:{code:'ml_2796944',status:'disponibil',bloggerUsername:null,generatedAt:null,melbetId:'11180422'},
    c8:{code:'ml_2796945',status:'disponibil',bloggerUsername:null,generatedAt:null,melbetId:'11180423'},
    c9:{code:'ml_2796946',status:'disponibil',bloggerUsername:null,generatedAt:null,melbetId:'11180424'},
  },
  xbet:{}, mostbet:{}, spinbetter:{}, betwinner:{},
}

const INIT_CASINO_STATS = {
  ionpopescu: { melbet:{clicks:1247,regs:89,deposits:34,revenue:1840,commission:460}, xbet:{clicks:0,regs:0,deposits:0,revenue:0,commission:0}, mostbet:{clicks:0,regs:0,deposits:0,revenue:0,commission:0}, spinbetter:{clicks:0,regs:0,deposits:0,revenue:0,commission:0}, betwinner:{clicks:0,regs:0,deposits:0,revenue:0,commission:0} },
  alexmarin:  { melbet:{clicks:856,regs:52,deposits:18,revenue:1120,commission:280}, xbet:{clicks:0,regs:0,deposits:0,revenue:0,commission:0}, mostbet:{clicks:0,regs:0,deposits:0,revenue:0,commission:0}, spinbetter:{clicks:0,regs:0,deposits:0,revenue:0,commission:0}, betwinner:{clicks:0,regs:0,deposits:0,revenue:0,commission:0} },
  vladgaming:  { melbet:{clicks:234,regs:12,deposits:3,revenue:180,commission:45}, xbet:{clicks:0,regs:0,deposits:0,revenue:0,commission:0}, mostbet:{clicks:0,regs:0,deposits:0,revenue:0,commission:0}, spinbetter:{clicks:0,regs:0,deposits:0,revenue:0,commission:0}, betwinner:{clicks:0,regs:0,deposits:0,revenue:0,commission:0} },
}

// ─── SEED automat la prima rulare ────────────────────────────
async function autoSeed() {
  if (USE_FIREBASE) {
    const seeded = await fbGet('seeded')
    if (seeded) return
    await fbSet('bloggers', INIT_BLOGGERS)
    await fbSet('casinoStats', INIT_CASINO_STATS)
    await fbSet('promoCodes', INIT_PROMO)
    await fbSet('seeded', true)
  } else {
    if (lsGet('wp_seeded')) return
    lsSet('wp_bloggers', INIT_BLOGGERS)
    lsSet('wp_casino_stats', INIT_CASINO_STATS)
    lsSet('wp_promo', INIT_PROMO)
    lsSet('wp_seeded', true)
  }
}
// Rulează automat la import
autoSeed()

// ─── LOGIN ────────────────────────────────────────────────────
export async function loginBlogger(identifier, pass) {
  const id = (identifier || '').trim().toLowerCase()
  if (!id) return null
  if (USE_FIREBASE) {
    let blogger = null
    if (id.includes('@')) {
      const all = await fbGet('bloggers') || {}
      blogger = Object.values(all).find(b => (b.email || '').toLowerCase() === id) || null
    } else {
      blogger = await fbGet(`bloggers/${id}`)
    }
    if (!blogger || blogger.pass !== pass) return null
    return blogger
  } else {
    const bloggers = lsGet('wp_bloggers', INIT_BLOGGERS)
    let blogger = null
    if (id.includes('@')) {
      blogger = Object.values(bloggers).find(b => (b.email || '').toLowerCase() === id) || null
    } else {
      blogger = bloggers[id]
    }
    if (!blogger || blogger.pass !== pass) return null
    return blogger
  }
}

// ─── RESETARE PAROLA PRIN EMAIL ──────────────────────────────
export async function sendResetEmail(toEmail, resetLink, username) {
  const SID = import.meta.env.VITE_EMAILJS_SERVICE || 'service_ljyjtom'
  const TID = import.meta.env.VITE_EMAILJS_TEMPLATE || 'template_2sldrzn'
  const PUB = import.meta.env.VITE_EMAILJS_PUBLIC || 'slTZStxmHvt80W3cp'
  if (!SID || !TID || !PUB) return { ok:false, reason:'not_configured' }
  const message = `We received a request to reset the password for your WinPartners account.\n\nTo set a new password, please open the link below (valid for 1 hour):\n${resetLink}\n\nIf you did not request a password reset, you can safely ignore this email — your account remains secure.\n\nBest regards,\nThe WinPartners Team`
  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ service_id:SID, template_id:TID, user_id:PUB,
        template_params:{ email:toEmail, to_email:toEmail, name:username||'user', username:username||'', reset_link:resetLink, subject:'Reset your WinPartners password', message } })
    })
    return { ok: res.ok }
  } catch(e) { return { ok:false, reason:'error' } }
}

// Email de bun-venit la aprobarea bloggerului (felicitări + credențiale + pași + Telegram)
export async function sendWelcomeEmail(toEmail, name, username, pass) {
  const SID = import.meta.env.VITE_EMAILJS_SERVICE || 'service_ljyjtom'
  const TID = import.meta.env.VITE_EMAILJS_TEMPLATE || 'template_2sldrzn'
  const PUB = import.meta.env.VITE_EMAILJS_PUBLIC || 'slTZStxmHvt80W3cp'
  if (!toEmail || !SID || !TID || !PUB) return { ok:false, reason:'not_configured' }
  const message =
    `Dear ${name},\n\n` +
    `Congratulations — your WinPartners affiliate application has been approved. Your account is now active and you can begin earning right away.\n\n` +
    `Your login details:\n` +
    `• Portal: https://winpartners.pro/login\n` +
    `• Username: ${username}\n` +
    `• Password: the one you chose during registration\n\n` +
    `Getting started:\n` +
    `1. Sign in to your dashboard at https://winpartners.pro/login\n` +
    `2. Select a casino brand and generate your unique promo code and referral link\n` +
    `3. Share your code and start earning — commissions begin at 25% lifetime revenue share on every player you refer, with higher rates available on select brands\n\n` +
    `Your earnings accumulate automatically and are paid out weekly. You can track your performance and request withdrawals directly from your dashboard at any time.\n\n` +
    `Should you need any assistance, our team is here to help:\n` +
    `• Telegram: https://t.me/winpartners_manager\n` +
    `• Email: supportwinpartners@gmail.com\n\n` +
    `We look forward to a successful partnership.\n\n` +
    `Best regards,\n` +
    `The WinPartners Team\n` +
    `winpartners.pro`
  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ service_id:SID, template_id:TID, user_id:PUB,
        template_params:{ email:toEmail, to_email:toEmail, name:name||'Partner', username:username||'', reset_link:'https://winpartners.pro/login', subject:'Your WinPartners application has been approved', message } })
    })
    return { ok: res.ok }
  } catch(e) { return { ok:false, reason:'error' } }
}

export async function requestPasswordReset(email) {
  const e = (email||'').trim().toLowerCase()
  if (!e) return { ok:false, reason:'empty' }
  const bloggers = (USE_FIREBASE ? await fbGet('bloggers') : lsGet('wp_bloggers', INIT_BLOGGERS)) || {}
  const entry = Object.values(bloggers).find(b => (b.email||'').toLowerCase() === e)
  if (!entry) return { ok:false, reason:'not_found' }
  const token = 'rt' + Date.now().toString(36) + Math.random().toString(36).slice(2,10)
  const rec = { username: entry.username, email: entry.email, expires: Date.now() + 3600000 }
  if (USE_FIREBASE) await fbSet(`passwordResets/${token}`, rec)
  else { const all = lsGet('wp_resets', {}); all[token] = rec; lsSet('wp_resets', all) }
  return { ok:true, token, username: entry.username, email: entry.email }
}

export async function applyPasswordReset(token, newPass) {
  if (!token || !newPass || newPass.length < 6) return { ok:false, reason:'invalid_input' }
  let rec
  if (USE_FIREBASE) rec = await fbGet(`passwordResets/${token}`)
  else rec = (lsGet('wp_resets', {}))[token]
  if (!rec) return { ok:false, reason:'invalid_token' }
  if (rec.expires < Date.now()) return { ok:false, reason:'expired' }
  if (USE_FIREBASE) {
    const blogger = await fbGet(`bloggers/${rec.username}`)
    if (!blogger) return { ok:false, reason:'no_user' }
    blogger.pass = newPass
    await fbSet(`bloggers/${rec.username}`, blogger)
    await fbSet(`passwordResets/${token}`, null)
  } else {
    const all = lsGet('wp_bloggers', INIT_BLOGGERS)
    if (!all[rec.username]) return { ok:false, reason:'no_user' }
    all[rec.username].pass = newPass; lsSet('wp_bloggers', all)
    const r = lsGet('wp_resets', {}); delete r[token]; lsSet('wp_resets', r)
  }
  return { ok:true, username: rec.username }
}

// ─── BLOGGERS ────────────────────────────────────────────────
export async function getBloggers() {
  if (USE_FIREBASE) {
    const data = await fbGet('bloggers')
    // Firebase e sursa de adevăr: dacă răspunde (chiar și gol), returnăm exact ce e acolo.
    // Nu mai cădem pe demo când lista e goală — altfel bloggerii șterși ar reapărea.
    return data ? Object.values(data) : []
  }
  const data = lsGet('wp_bloggers', INIT_BLOGGERS)
  return Object.values(data)
}

export async function setBlogger(blogger) {
  if (USE_FIREBASE) return fbSet(`bloggers/${blogger.username}`, blogger)
  const all = lsGet('wp_bloggers', INIT_BLOGGERS)
  all[blogger.username] = blogger
  lsSet('wp_bloggers', all)
}

export async function updateBloggerFields(username, fields) {
  if (USE_FIREBASE) return fbPatch(`bloggers/${username}`, fields)
  const all = lsGet('wp_bloggers', INIT_BLOGGERS)
  if (all[username]) all[username] = { ...all[username], ...fields }
  lsSet('wp_bloggers', all)
}

export async function deleteBlogger(username) {
  if (!username) return false
  if (USE_FIREBASE) return fbDelete(`bloggers/${username}`)
  const all = lsGet('wp_bloggers', INIT_BLOGGERS)
  delete all[username]
  lsSet('wp_bloggers', all)
  return true
}

export function subscribeBloggers(callback, interval = 5000) {
  getBloggers().then(callback)
  if (!USE_FIREBASE) return () => {}
  const id = setInterval(() => getBloggers().then(callback), interval)
  return () => clearInterval(id)
}

// ─── REFERRAL / SUB-AFILIERE (bonus 10% din earned-ul invitatului) ───
export const REFERRAL_PERCENT = 10

// Setează legătura de invitație pe un blogger (cine l-a invitat)
export async function setBloggerReferrer(username, referrerCode) {
  if (!username || !referrerCode) return false
  const code = String(referrerCode).trim()
  if (USE_FIREBASE) { await fbPatch(`bloggers/${username}`, { invitedBy: code }); return true }
  const all = lsGet('wp_bloggers', INIT_BLOGGERS)
  if (all[username]) { all[username].invitedBy = code; lsSet('wp_bloggers', all) }
  return true
}

// Normalizează un cod de invitație (REF_GRIGORE -> grigore) ca să-l putem lega de username
export function normalizeRefToUsername(refCode) {
  if (!refCode) return ''
  let s = String(refCode).trim()
  if (s.toUpperCase().startsWith('REF_')) s = s.slice(4)
  return s.toLowerCase()
}

// Construiește rețeaua de referral: pentru fiecare invitator, lista invitaților + bonusul 10% acumulat
export async function getReferralNetwork() {
  const bloggers = await getBloggers()
  // index username -> blogger
  const byUser = {}
  bloggers.forEach(b => { if (b.username) byUser[b.username.toLowerCase()] = b })

  const network = {} // referrerUsername -> { referrer, invitees:[], totalBonus }
  bloggers.forEach(b => {
    if (!b.invitedBy) return
    const refUser = normalizeRefToUsername(b.invitedBy)
    if (!refUser || refUser === (b.username||'').toLowerCase()) return // nu se poate invita singur
    if (!network[refUser]) {
      network[refUser] = { referrerUsername: refUser, referrerName: (byUser[refUser]?.name) || refUser, invitees: [], totalBonus: 0 }
    }
    const earned = Number(b.earned) || 0
    const bonus = Math.round((earned * REFERRAL_PERCENT / 100) * 100) / 100
    network[refUser].invitees.push({ username: b.username, name: b.name||b.username, earned, bonus, status: b.status||'active', platform: b.platform||'', regDate: b.date||b.regDate||'', regs: Number(b.regs)||0, invitedByRaw: b.invitedBy })
    network[refUser].totalBonus = Math.round((network[refUser].totalBonus + bonus) * 100) / 100
  })
  return Object.values(network)
}

// Bonusul de referral pentru UN blogger anume (cât a câștigat din invitați)
export async function getMyReferralEarnings(username) {
  if (!username) return { invitees: [], totalBonus: 0 }
  const net = await getReferralNetwork()
  const mine = net.find(n => n.referrerUsername === username.toLowerCase())
  return mine || { invitees: [], totalBonus: 0 }
}

// ─── CASINO STATS ─────────────────────────────────────────────
export async function getCasinoStats(username) {
  if (USE_FIREBASE) {
    const data = await fbGet(`casinoStats/${username}`)
    return data || INIT_CASINO_STATS[username] || {}
  }
  const all = lsGet('wp_casino_stats', INIT_CASINO_STATS)
  return all[username] || {}
}

export async function setCasinoStats(username, casinoId, stats) {
  if (USE_FIREBASE) return fbPatch(`casinoStats/${username}/${casinoId}`, stats)
  const all = lsGet('wp_casino_stats', INIT_CASINO_STATS)
  if (!all[username]) all[username] = {}
  all[username][casinoId] = { ...(all[username][casinoId] || {}), ...stats }
  lsSet('wp_casino_stats', all)
}

export function subscribeCasinoStats(username, callback, interval = 5000) {
  getCasinoStats(username).then(callback)
  if (!USE_FIREBASE) return () => {}
  const id = setInterval(() => getCasinoStats(username).then(callback), interval)
  return () => clearInterval(id)
}

// ─── PROMO CODES ──────────────────────────────────────────────
async function getRawPromoCodes() {
  if (USE_FIREBASE) {
    const data = await fbGet('promoCodes')
    return data || INIT_PROMO
  }
  return lsGet('wp_promo', INIT_PROMO)
}

async function saveRawPromoCodes(data) {
  if (USE_FIREBASE) return fbSet('promoCodes', data)
  lsSet('wp_promo', data)
}

export async function getPromoCodes() {
  const raw = await getRawPromoCodes()
  const result = {}
  for (const [casinoId, obj] of Object.entries(raw)) {
    result[casinoId] = obj ? Object.values(obj) : []
  }
  return result
}

export async function addPromoCode(casinoId, codeObj) {
  const raw = await getRawPromoCodes()
  if (!raw[casinoId]) raw[casinoId] = {}
  const key = 'c' + Date.now()
  raw[casinoId][key] = codeObj
  await saveRawPromoCodes(raw)
}

export async function getNextAvailableCode(casinoId, username) {
  const raw = await getRawPromoCodes()
  const casino = raw[casinoId] || {}
  const entries = Object.entries(casino)
  // Dacă are deja cod atribuit — îl returnăm
  const existing = entries.find(([, v]) => v.bloggerUsername === username && v.status === 'atribuit')
  if (existing) return existing[1]
  // Primul disponibil
  const next = entries.find(([, v]) => v.status === 'disponibil')
  if (!next) return null
  const [key, codeObj] = next
  const updated = { ...codeObj, status:'atribuit', bloggerUsername:username, generatedAt:new Date().toLocaleString('ro-RO') }
  raw[casinoId][key] = updated
  await saveRawPromoCodes(raw)
  return updated
}

export function subscribePromoCodes(callback, interval = 5000) {
  getPromoCodes().then(callback)
  if (!USE_FIREBASE) return () => {}
  const id = setInterval(() => getPromoCodes().then(callback), interval)
  return () => clearInterval(id)
}

// ─── APPLICATIONS ─────────────────────────────────────────────
export async function addApplication(appData) {
  const data = { ...appData, id:Date.now(), status:'pending', date:new Date().toLocaleDateString('ro-RO') }
  if (USE_FIREBASE) return fbPush('applications', data)
  const all = lsGet('wp_applications', [])
  all.push(data)
  lsSet('wp_applications', all)
}

export async function getApplications() {
  if (USE_FIREBASE) {
    const data = await fbGet('applications')
    return data ? toArr(data) : []
  }
  return lsGet('wp_applications', [])
}

export async function updateApplication(key, status) {
  if (USE_FIREBASE) return fbPatch(`applications/${key}`, { status })
  const all = lsGet('wp_applications', [])
  const updated = all.map(a => (String(a.id) === String(key) ? { ...a, status } : a))
  lsSet('wp_applications', updated)
}

export function subscribeApplications(callback, interval = 2000) {
  getApplications().then(callback)
  const id = setInterval(() => getApplications().then(callback), interval)
  return () => clearInterval(id)
}

// ─── CERERI DE PLATĂ (payout requests) ───────────────────────
export async function requestPayout(payload) {
  // payload: { username, name, amount, method, detail }
  const data = { ...payload, id:Date.now(), status:'pending', date:new Date().toLocaleString('ro-RO') }
  if (USE_FIREBASE) return fbPush('payoutRequests', data)
  const all = lsGet('wp_payouts', [])
  all.push(data)
  lsSet('wp_payouts', all)
  return data
}

export async function getPayoutRequests() {
  if (USE_FIREBASE) return toArr(await fbGet('payoutRequests'))
  return lsGet('wp_payouts', [])
}

export async function updatePayoutRequest(key, status) {
  if (USE_FIREBASE) return fbPatch(`payoutRequests/${key}`, { status, resolvedAt:new Date().toLocaleString('ro-RO') })
  const all = lsGet('wp_payouts', [])
  const upd = all.map(p => p.id == key ? { ...p, status } : p)
  lsSet('wp_payouts', upd)
}

export function subscribePayoutRequests(callback, interval = 3000) {
  getPayoutRequests().then(callback)
  const id = setInterval(() => getPayoutRequests().then(callback), interval)
  return () => clearInterval(id)
}

// has this blogger already got a pending payout request?
export async function getMyPayoutRequests(username) {
  const all = await getPayoutRequests()
  return all.filter(p => p.username === username)
}


// ─── NOTIFICATIONS ────────────────────────────────────────────
export async function addNotification(notif) {
  const data = { ...notif, id:Date.now(), read:false, timestamp:new Date().toLocaleString('ro-RO') }
  if (USE_FIREBASE) return fbPush('notifications', data)
  const all = lsGet('wp_notifications', [])
  all.unshift(data)
  lsSet('wp_notifications', all.slice(0, 100))
}

export async function getNotifications() {
  if (USE_FIREBASE) {
    const data = await fbGet('notifications')
    return data ? toArr(data).sort((a,b) => b.id-a.id) : []
  }
  return lsGet('wp_notifications', [])
}

export async function markRead(key) {
  if (USE_FIREBASE) return fbPatch(`notifications/${key}`, { read:true })
  const all = lsGet('wp_notifications', [])
  const updated = all.map(n => (String(n.id) === String(key) ? { ...n, read:true } : n))
  lsSet('wp_notifications', updated)
}

export function subscribeNotifications(callback, interval = 8000) {
  getNotifications().then(callback)
  const id = setInterval(() => getNotifications().then(callback), interval)
  return () => clearInterval(id)
}

// ─── CUSTOM REQUESTS ──────────────────────────────────────────
export async function addCustomRequest(reqData) {
  const data = { ...reqData, id:Date.now(), status:'pending', timestamp:new Date().toLocaleString('ro-RO') }
  if (USE_FIREBASE) return fbPush('customRequests', data)
  const all = lsGet('wp_custom_requests', [])
  all.push(data)
  lsSet('wp_custom_requests', all)
}

export async function getCustomRequests() {
  if (USE_FIREBASE) {
    const data = await fbGet('customRequests')
    return data ? toArr(data) : []
  }
  return lsGet('wp_custom_requests', [])
}

export async function updateCustomRequest(key, status, extra = {}) {
  if (USE_FIREBASE) return fbPatch(`customRequests/${key}`, { status, ...extra })
  const all = lsGet('wp_custom_requests', [])
  const updated = all.map(r => (String(r.id) === String(key) ? { ...r, status, ...extra } : r))
  lsSet('wp_custom_requests', updated)
}

export function subscribeCustomRequests(callback, interval = 5000) {
  getCustomRequests().then(callback)
  const id = setInterval(() => getCustomRequests().then(callback), interval)
  return () => clearInterval(id)
}

// ─── DELETE (curățare panou admin) ────────────────────────────
export async function deleteApplication(key) {
  if (!key) return
  if (USE_FIREBASE) return fbDelete(`applications/${key}`)
  const all = lsGet('wp_applications', [])
  lsSet('wp_applications', all.filter(x => String(x.id)!==String(key) && String(x._key)!==String(key)))
}
export async function deletePayoutRequest(key) {
  if (!key) return
  if (USE_FIREBASE) return fbDelete(`payoutRequests/${key}`)
  const all = lsGet('wp_payouts', [])
  lsSet('wp_payouts', all.filter(x => String(x.id)!==String(key) && String(x._key)!==String(key)))
}
export async function deleteCustomRequest(key) {
  if (!key) return
  if (USE_FIREBASE) return fbDelete(`customRequests/${key}`)
  const all = lsGet('wp_custom_requests', [])
  lsSet('wp_custom_requests', all.filter(x => String(x.id)!==String(key) && String(x._key)!==String(key)))
}
export async function deleteNotification(key) {
  if (!key) return
  if (USE_FIREBASE) return fbDelete(`notifications/${key}`)
  const all = lsGet('wp_notifications', [])
  lsSet('wp_notifications', all.filter(x => String(x.id)!==String(key) && String(x._key)!==String(key)))
}
export async function clearAllNotifications() {
  if (USE_FIREBASE) return fbSet('notifications', null)
  lsSet('wp_notifications', [])
}
export async function deleteConversation(username) {
  if (!username) return
  if (USE_FIREBASE) return fbDelete(`messages/${username}`)
  lsSet('wp_msgs_' + username, [])
}

// ─── SEED MANUAL (din Admin) ──────────────────────────────────
export async function seedDatabase() {
  if (USE_FIREBASE) {
    const seeded = await fbGet('seeded')
    if (seeded) return 'already_seeded'
    await fbSet('bloggers', INIT_BLOGGERS)
    await fbSet('casinoStats', INIT_CASINO_STATS)
    await fbSet('promoCodes', INIT_PROMO)
    await fbSet('applications', {})
    await fbSet('notifications', {})
    await fbSet('customRequests', {})
    await fbSet('seeded', true)
    return 'seeded_ok'
  } else {
    lsSet('wp_bloggers', INIT_BLOGGERS)
    lsSet('wp_casino_stats', INIT_CASINO_STATS)
    lsSet('wp_promo', INIT_PROMO)
    lsSet('wp_applications', [])
    lsSet('wp_notifications', [])
    lsSet('wp_custom_requests', [])
    lsSet('wp_seeded', true)
    return 'seeded_ls'
  }
}

export const isFirebaseEnabled = USE_FIREBASE
export const firebaseDebug = USE_FIREBASE ? FB_URL.slice(0,40) : 'NOT_CONFIGURED'


// ─── TELEGRAM NOTIFICATIONS ──────────────────────────────────
const TG_TOKEN = import.meta.env.VITE_TG_TOKEN || ''
const TG_CHAT  = import.meta.env.VITE_TG_CHAT  || ''

export async function sendTelegramNotif(text) {
  if (!TG_TOKEN || !TG_CHAT) return
  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT, text, parse_mode: 'HTML' }),
      signal: AbortSignal.timeout(5000)
    })
  } catch(e) {}
}
// ─── FORCE RESEED (resetează seeded și repopulează) ───────────
export async function forceReseedDatabase() {
  if (USE_FIREBASE) {
    await fbSet('seeded', null)
    await fbSet('bloggers', INIT_BLOGGERS)
    await fbSet('casinoStats', INIT_CASINO_STATS)
    await fbSet('promoCodes', INIT_PROMO)
    await fbSet('applications', {})
    await fbSet('notifications', {})
    await fbSet('customRequests', {})
    await fbSet('seeded', true)
    return 'force_seeded_ok'
  } else {
    lsSet('wp_bloggers', INIT_BLOGGERS)
    lsSet('wp_casino_stats', INIT_CASINO_STATS)
    lsSet('wp_promo', INIT_PROMO)
    lsSet('wp_applications', [])
    lsSet('wp_notifications', [])
    lsSet('wp_custom_requests', [])
    lsSet('wp_seeded', true)
    return 'force_seeded_ls'
  }
}

// ─── MESSAGES (chat blogger ↔ manager) ────────────────────────
// Structura: messages/{username}/{key} = { from:'blogger'|'admin', text, ts, read, timestamp }
// read = dacă destinatarul a văzut mesajul
export async function sendMessage(username, from, text) {
  const data = { from, text, ts: Date.now(), read: false, timestamp: new Date().toLocaleString('ro-RO') }
  if (USE_FIREBASE) return fbPush(`messages/${username}`, data)
  const k = 'wp_msgs_' + username
  const all = lsGet(k, [])
  all.push({ ...data, _key: 'm' + data.ts })
  lsSet(k, all)
}

export async function getConversation(username) {
  if (USE_FIREBASE) {
    const data = await fbGet(`messages/${username}`)
    return data ? toArr(data).sort((a, b) => a.ts - b.ts) : []
  }
  return lsGet('wp_msgs_' + username, []).slice().sort((a, b) => a.ts - b.ts)
}

export function subscribeConversation(username, callback, interval = 4000) {
  if (!username) return () => {}
  getConversation(username).then(callback)
  const id = setInterval(() => getConversation(username).then(callback), interval)
  return () => clearInterval(id)
}

// Marchează citite mesajele de la celălalt rol. viewerRole = cine citește ('admin' sau 'blogger')
export async function markConversationRead(username, viewerRole) {
  const otherRole = viewerRole === 'admin' ? 'blogger' : 'admin'
  if (USE_FIREBASE) {
    const data = await fbGet(`messages/${username}`)
    if (!data) return
    for (const [key, msg] of Object.entries(data)) {
      if (msg && msg.from === otherRole && !msg.read) {
        await fbPatch(`messages/${username}/${key}`, { read: true })
      }
    }
    return
  }
  const k = 'wp_msgs_' + username
  const all = lsGet(k, []).map(m => (m.from === otherRole ? { ...m, read: true } : m))
  lsSet(k, all)
}

// Pentru admin: toate conversațiile cu rezumat (ultim mesaj + necitite de la blogger)
export async function getAllConversations() {
  const convos = []
  if (USE_FIREBASE) {
    const raw = (await fbGet('messages')) || {}
    for (const [username, msgsObj] of Object.entries(raw)) {
      const msgs = toArr(msgsObj).sort((a, b) => a.ts - b.ts)
      if (!msgs.length) continue
      const last = msgs[msgs.length - 1]
      convos.push({ username, last, unread: msgs.filter(m => m.from === 'blogger' && !m.read).length, count: msgs.length, lastTs: last.ts })
    }
  } else {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (!k || !k.startsWith('wp_msgs_')) continue
        const msgs = lsGet(k, []).slice().sort((a, b) => a.ts - b.ts)
        if (!msgs.length) continue
        const username = k.replace('wp_msgs_', '')
        const last = msgs[msgs.length - 1]
        convos.push({ username, last, unread: msgs.filter(m => m.from === 'blogger' && !m.read).length, count: msgs.length, lastTs: last.ts })
      }
    } catch (e) {}
  }
  return convos.sort((a, b) => b.lastTs - a.lastTs)
}

export function subscribeAllConversations(callback, interval = 5000) {
  getAllConversations().then(callback)
  const id = setInterval(() => getAllConversations().then(callback), interval)
  return () => clearInterval(id)
}
