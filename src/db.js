// ============================================================
// WinPartners — Storage cu fallback inteligent
// Încearcă Firebase, cade pe localStorage dacă nu e configurat
// ============================================================

const FB_URL = import.meta.env.VITE_FB_URL || ''
const USE_FIREBASE = FB_URL && FB_URL !== 'PLACEHOLDER_DB_URL' && FB_URL.includes('firebasedatabase')

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
  winbet:{}, spinmax:{}, luckydeal:{},
}

const INIT_CASINO_STATS = {
  ionpopescu: { melbet:{clicks:1247,regs:89,deposits:34,revenue:1840,commission:460}, winbet:{clicks:0,regs:0,deposits:0,revenue:0,commission:0}, spinmax:{clicks:0,regs:0,deposits:0,revenue:0,commission:0}, luckydeal:{clicks:0,regs:0,deposits:0,revenue:0,commission:0} },
  alexmarin:  { melbet:{clicks:856,regs:52,deposits:18,revenue:1120,commission:280}, winbet:{clicks:0,regs:0,deposits:0,revenue:0,commission:0}, spinmax:{clicks:0,regs:0,deposits:0,revenue:0,commission:0}, luckydeal:{clicks:0,regs:0,deposits:0,revenue:0,commission:0} },
  vladgaming:  { melbet:{clicks:234,regs:12,deposits:3,revenue:180,commission:45}, winbet:{clicks:0,regs:0,deposits:0,revenue:0,commission:0}, spinmax:{clicks:0,regs:0,deposits:0,revenue:0,commission:0}, luckydeal:{clicks:0,regs:0,deposits:0,revenue:0,commission:0} },
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
export async function loginBlogger(username, pass) {
  if (USE_FIREBASE) {
    const blogger = await fbGet(`bloggers/${username}`)
    if (!blogger || blogger.pass !== pass) return null
    return blogger
  } else {
    const bloggers = lsGet('wp_bloggers', INIT_BLOGGERS)
    const blogger = bloggers[username]
    if (!blogger || blogger.pass !== pass) return null
    return blogger
  }
}

// ─── BLOGGERS ────────────────────────────────────────────────
export async function getBloggers() {
  if (USE_FIREBASE) {
    const data = await fbGet('bloggers')
    return data ? Object.values(data) : Object.values(INIT_BLOGGERS)
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

export function subscribeBloggers(callback, interval = 5000) {
  getBloggers().then(callback)
  if (!USE_FIREBASE) return () => {}
  const id = setInterval(() => getBloggers().then(callback), interval)
  return () => clearInterval(id)
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

export async function updateCustomRequest(key, status) {
  if (USE_FIREBASE) return fbPatch(`customRequests/${key}`, { status })
  const all = lsGet('wp_custom_requests', [])
  const updated = all.map(r => (String(r.id) === String(key) ? { ...r, status } : r))
  lsSet('wp_custom_requests', updated)
}

export function subscribeCustomRequests(callback, interval = 5000) {
  getCustomRequests().then(callback)
  const id = setInterval(() => getCustomRequests().then(callback), interval)
  return () => clearInterval(id)
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
