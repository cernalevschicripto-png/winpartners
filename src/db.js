// ============================================================
// WinPartners — Firebase Realtime Database
// Folosește REST API (nu SDK) — zero dependențe npm
// CONFIG: pune valorile Firebase în .env sau direct jos
// ============================================================

const FB_URL  = import.meta.env.VITE_FB_URL  || 'PLACEHOLDER_DB_URL'
const FB_KEY  = import.meta.env.VITE_FB_KEY  || 'PLACEHOLDER_API_KEY'

// Helper: GET din Firebase
async function fbGet(path) {
  const res = await fetch(`${FB_URL}/${path}.json?auth=${FB_KEY}`)
  if (!res.ok) return null
  return res.json()
}

// Helper: SET (suprascrie)
async function fbSet(path, data) {
  const res = await fetch(`${FB_URL}/${path}.json?auth=${FB_KEY}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

// Helper: UPDATE (merge)
async function fbPatch(path, data) {
  const res = await fetch(`${FB_URL}/${path}.json?auth=${FB_KEY}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

// Helper: PUSH (adaugă cu cheie automată)
async function fbPush(path, data) {
  const res = await fetch(`${FB_URL}/${path}.json?auth=${FB_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

// Helper: DELETE
async function fbDelete(path) {
  await fetch(`${FB_URL}/${path}.json?auth=${FB_KEY}`, { method: 'DELETE' })
}

// Helper: obj→array cu chei
function toArr(obj) {
  if (!obj) return []
  return Object.entries(obj).map(([k, v]) => ({ ...v, _key: k }))
}

// ─── DATE INIȚIALE ───────────────────────────────────────────
export const SEED = {
  bloggers: {
    ionpopescu: { id:'ionpopescu', name:'Ion Popescu',  username:'ionpopescu',  platform:'TikTok',    country:'Moldova', phone:'+373601234', status:'active', commission:20, clicks:1247, regs:89, deposits:34, revenue:1840, paid:920,  email:'ion@gmail.com',  pass:'ion2026',  payMethod:'Bitcoin', payAddress:'bc1qxxx' },
    alexmarin:  { id:'alexmarin',  name:'Alex Marin',   username:'alexmarin',   platform:'Instagram', country:'România', phone:'+40721234',  status:'active', commission:20, clicks:856,  regs:52, deposits:18, revenue:1120, paid:560,  email:'alex@gmail.com', pass:'alex2026', payMethod:'Bitcoin', payAddress:'bc1qyyy' },
    vladgaming:  { id:'vladgaming',  name:'Vlad Gaming',  username:'vladgaming',  platform:'YouTube',   country:'Ucraina', phone:'+380671234', status:'pending',commission:20, clicks:234,  regs:12, deposits:3,  revenue:180,  paid:0,   email:'vlad@gmail.com', pass:'vlad2026', payMethod:'Skrill',  payAddress:'' },
  },
  casinoStats: {
    ionpopescu: { melbet:{ clicks:1247, regs:89, deposits:34, revenue:1840, commission:920 }, winbet:{clicks:0,regs:0,deposits:0,revenue:0,commission:0}, spinmax:{clicks:0,regs:0,deposits:0,revenue:0,commission:0}, luckydeal:{clicks:0,regs:0,deposits:0,revenue:0,commission:0} },
    alexmarin:  { melbet:{ clicks:856,  regs:52, deposits:18, revenue:1120, commission:560 }, winbet:{clicks:0,regs:0,deposits:0,revenue:0,commission:0}, spinmax:{clicks:0,regs:0,deposits:0,revenue:0,commission:0}, luckydeal:{clicks:0,regs:0,deposits:0,revenue:0,commission:0} },
    vladgaming:  { melbet:{clicks:0,regs:0,deposits:0,revenue:0,commission:0}, winbet:{clicks:0,regs:0,deposits:0,revenue:0,commission:0}, spinmax:{clicks:0,regs:0,deposits:0,revenue:0,commission:0}, luckydeal:{clicks:0,regs:0,deposits:0,revenue:0,commission:0} },
  },
  promoCodes: {
    melbet: {
      c0:{ code:'ml_2738117', status:'disponibil', bloggerUsername:null, generatedAt:null, melbetId:'11035387' },
      c1:{ code:'ml_2796938', status:'disponibil', bloggerUsername:null, generatedAt:null, melbetId:'11180407' },
      c2:{ code:'ml_2796939', status:'disponibil', bloggerUsername:null, generatedAt:null, melbetId:'11180417' },
      c3:{ code:'ml_2796940', status:'disponibil', bloggerUsername:null, generatedAt:null, melbetId:'11180418' },
      c4:{ code:'ml_2796941', status:'disponibil', bloggerUsername:null, generatedAt:null, melbetId:'11180419' },
      c5:{ code:'ml_2796942', status:'disponibil', bloggerUsername:null, generatedAt:null, melbetId:'11180420' },
      c6:{ code:'ml_2796943', status:'disponibil', bloggerUsername:null, generatedAt:null, melbetId:'11180421' },
      c7:{ code:'ml_2796944', status:'disponibil', bloggerUsername:null, generatedAt:null, melbetId:'11180422' },
      c8:{ code:'ml_2796945', status:'disponibil', bloggerUsername:null, generatedAt:null, melbetId:'11180423' },
      c9:{ code:'ml_2796946', status:'disponibil', bloggerUsername:null, generatedAt:null, melbetId:'11180424' },
    },
    winbet:{}, spinmax:{}, luckydeal:{},
  },
}

// ─── BLOGGERS ─────────────────────────────────────────────────
export async function getBloggers() {
  const data = await fbGet('bloggers')
  return data ? Object.values(data) : []
}

export async function setBlogger(blogger) {
  return fbSet(`bloggers/${blogger.username}`, blogger)
}

export async function updateBloggerFields(username, fields) {
  return fbPatch(`bloggers/${username}`, fields)
}

// Polling-based subscribe (Firebase REST nu are WebSockets)
export function subscribeBloggers(callback, interval = 5000) {
  getBloggers().then(callback)
  const id = setInterval(() => getBloggers().then(callback), interval)
  return () => clearInterval(id)
}

// ─── LOGIN ────────────────────────────────────────────────────
export async function loginBlogger(username, pass) {
  const blogger = await fbGet(`bloggers/${username}`)
  if (!blogger) return null
  if (blogger.pass !== pass) return null
  return blogger
}

// ─── CASINO STATS ─────────────────────────────────────────────
export async function getCasinoStats(username) {
  const data = await fbGet(`casinoStats/${username}`)
  return data || {}
}

export async function setCasinoStats(username, casinoId, stats) {
  return fbPatch(`casinoStats/${username}/${casinoId}`, stats)
}

export function subscribeCasinoStats(username, callback, interval = 5000) {
  getCasinoStats(username).then(callback)
  const id = setInterval(() => getCasinoStats(username).then(callback), interval)
  return () => clearInterval(id)
}

// ─── PROMO CODES ──────────────────────────────────────────────
export async function getPromoCodes() {
  const data = await fbGet('promoCodes')
  if (!data) return { melbet:[], winbet:[], spinmax:[], luckydeal:[] }
  const result = {}
  for (const [casinoId, raw] of Object.entries(data)) {
    result[casinoId] = raw ? Object.values(raw) : []
  }
  return result
}

export async function addPromoCode(casinoId, codeObj) {
  return fbPush(`promoCodes/${casinoId}`, codeObj)
}

export async function getNextAvailableCode(casinoId, username) {
  const data = await fbGet(`promoCodes/${casinoId}`)
  if (!data) return null
  const entries = Object.entries(data)
  // Dacă are deja cod atribuit
  const existing = entries.find(([, v]) => v.bloggerUsername === username && v.status === 'atribuit')
  if (existing) return existing[1]
  // Primul disponibil
  const next = entries.find(([, v]) => v.status === 'disponibil')
  if (!next) return null
  const [key, codeObj] = next
  const updated = { ...codeObj, status:'atribuit', bloggerUsername: username, generatedAt: new Date().toLocaleString('ro-RO') }
  await fbPatch(`promoCodes/${casinoId}/${key}`, updated)
  return updated
}

export function subscribePromoCodes(callback, interval = 5000) {
  getPromoCodes().then(callback)
  const id = setInterval(() => getPromoCodes().then(callback), interval)
  return () => clearInterval(id)
}

// ─── APPLICATIONS ─────────────────────────────────────────────
export async function addApplication(appData) {
  return fbPush('applications', { ...appData, id: Date.now(), status:'pending', date: new Date().toLocaleDateString('ro-RO') })
}

export async function getApplications() {
  const data = await fbGet('applications')
  return data ? toArr(data) : []
}

export async function updateApplication(key, status) {
  return fbPatch(`applications/${key}`, { status })
}

export function subscribeApplications(callback, interval = 5000) {
  getApplications().then(callback)
  const id = setInterval(() => getApplications().then(callback), interval)
  return () => clearInterval(id)
}

// ─── NOTIFICATIONS ────────────────────────────────────────────
export async function addNotification(notif) {
  return fbPush('notifications', { ...notif, id: Date.now(), read:false, timestamp: new Date().toLocaleString('ro-RO') })
}

export async function getNotifications() {
  const data = await fbGet('notifications')
  if (!data) return []
  return toArr(data).sort((a,b) => b.id - a.id)
}

export async function markRead(key) {
  return fbPatch(`notifications/${key}`, { read: true })
}

export function subscribeNotifications(callback, interval = 8000) {
  getNotifications().then(callback)
  const id = setInterval(() => getNotifications().then(callback), interval)
  return () => clearInterval(id)
}

// ─── CUSTOM REQUESTS ──────────────────────────────────────────
export async function addCustomRequest(reqData) {
  return fbPush('customRequests', { ...reqData, id: Date.now(), status:'pending', timestamp: new Date().toLocaleString('ro-RO') })
}

export async function getCustomRequests() {
  const data = await fbGet('customRequests')
  return data ? toArr(data) : []
}

export async function updateCustomRequest(key, status) {
  return fbPatch(`customRequests/${key}`, { status })
}

export function subscribeCustomRequests(callback, interval = 5000) {
  getCustomRequests().then(callback)
  const id = setInterval(() => getCustomRequests().then(callback), interval)
  return () => clearInterval(id)
}

// ─── SEED (rulează o singură dată din Admin) ──────────────────
export async function seedDatabase() {
  const seeded = await fbGet('seeded')
  if (seeded) return 'already_seeded'
  await fbSet('bloggers',     SEED.bloggers)
  await fbSet('casinoStats',  SEED.casinoStats)
  await fbSet('promoCodes',   SEED.promoCodes)
  await fbSet('applications', {})
  await fbSet('notifications',{})
  await fbSet('customRequests',{})
  await fbSet('seeded', true)
  return 'seeded_ok'
}
