import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { _p } from '../cfg.js'
import {
  getBloggers, setBlogger, updateBloggerFields, deleteBlogger, subscribeBloggers,
  getCasinoStats, setCasinoStats,
  getPromoCodes, addPromoCode, subscribePromoCodes,
  getApplications, updateApplication, subscribeApplications, deleteApplication,
  getNotifications, markRead, addNotification, subscribeNotifications, deleteNotification, clearAllNotifications,
  getCustomRequests, updateCustomRequest, subscribeCustomRequests, deleteCustomRequest,
  getPayoutRequests, updatePayoutRequest, subscribePayoutRequests, deletePayoutRequest,
  subscribeAllConversations, subscribeConversation, sendMessage, markConversationRead, deleteConversation,
  seedDatabase, forceReseedDatabase, isFirebaseEnabled, firebaseDebug, sendTelegramNotif, sendWelcomeEmail, exportFullBackup,
  getReferralNetwork, REFERRAL_PERCENT, setBloggerReferrer,
} from '../db.js'

const gold = '#f5a623'
// Slate palette — lighter, modern admin look
const C = {
  bg:        '#1e2433',   // page background (slate-800-ish)
  panel:     '#2a3140',   // cards / panels
  panel2:    '#323a4d',   // raised / hover
  sidebar:   '#252b3a',   // left control bar
  border:    'rgba(255,255,255,0.10)',
  borderHi:  'rgba(245,166,35,0.35)',
  text:      '#e8ecf3',   // primary text
  textDim:   'rgba(232,236,243,0.55)',
  textFaint: 'rgba(232,236,243,0.35)',
  green:     '#22c55e',
  red:       '#ef4444',
  blue:      '#3b82f6',
  purple:    '#a78bfa',
}
const PASS = _p

const CASINOS_LIST = [
  { id: 'melbet',     name: 'Melbet',        color: '#f5a623' },
  { id: 'xbet',       name: '1xBet',         color: '#1565c0' },
  { id: 'mostbet',    name: 'Mostbet',       color: '#10b981' },
  { id: 'spinbetter', name: 'SpinBetter',    color: '#7c3aed' },
  { id: 'betwinner', name: 'BetWinner', color: '#84cc16' },
]

export default function Admin() {
  const [pass, setPass] = useState('')
  const [auth, setAuth] = useState(() => {
    try { return sessionStorage.getItem('wp_admin_auth') === '1' } catch { return false }
  })
  const [tab, setTab] = useState('bloggers')
  const [loading, setLoading] = useState(false)
  const [seedStatus, setSeedStatus] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  // Date din Firebase
  const [bloggers, setBloggers]         = useState([])
  const [promoCodes, setPromoCodes]     = useState({ melbet:[], xbet:[], mostbet:[], spinbetter:[], betwinner:[] })
  const [applications, setApplications] = useState([])
  const [notifications, setNotifications] = useState([])
  const [customRequests, setCustomRequests] = useState([])
  const [payoutRequests, setPayoutRequests] = useState([])
  const [affLinkEdit, setAffLinkEdit] = useState({})
  const [refNetwork, setRefNetwork] = useState([])

  // UI state
  const [editId, setEditId]     = useState(null)
  const [editData, setEditData] = useState({})
  const [showAdd, setShowAdd]   = useState(false)
  const [newB, setNewB]         = useState({ name:'', username:'', platform:'TikTok', country:'Moldova', phone:'', email:'', pass:'', commission:20 })
  const [payModal, setPayModal] = useState(null)
  const [payReqKey, setPayReqKey] = useState(null)
  const [payAmount, setPayAmount] = useState('')
  const [payments, setPayments] = useState([])
  const [selectedCasino, setSelectedCasino] = useState('melbet')
  const [newCodeInput, setNewCodeInput] = useState('')
  const [addCodeMode, setAddCodeMode] = useState(false)
  const [updateBlogger, setUpdateBlogger] = useState(null)
  const [casinoStatsEdit, setCasinoStatsEdit] = useState({})
  const [showNotifPanel, setShowNotifPanel] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  // Chat cu bloggerii
  const [conversations, setConversations] = useState([])
  const [chatBlogger, setChatBlogger] = useState(null)
  const [adminChatMsgs, setAdminChatMsgs] = useState([])
  const [adminChatInput, setAdminChatInput] = useState('')

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  // Subscriptions Firebase când e autentificat
  useEffect(() => {
    if (!auth) return
    setLoading(true)

    const unsubs = [
      subscribeBloggers(data => { setBloggers(data); setLoading(false) }),
      subscribePromoCodes(setPromoCodes),
      subscribeApplications(setApplications),
      subscribeNotifications(setNotifications),
      subscribeCustomRequests(setCustomRequests),
      subscribePayoutRequests(setPayoutRequests),
      subscribeAllConversations(setConversations),
    ]
    return () => unsubs.forEach(fn => fn && fn())
  }, [auth])

  // Rețeaua de referral — recalculată când se schimbă lista de bloggeri
  useEffect(() => {
    if (!auth) return
    getReferralNetwork().then(setRefNetwork)
  }, [auth, bloggers])

  // Conversația selectată în chat — subscribe + marchează citit
  useEffect(() => {
    if (!chatBlogger) { setAdminChatMsgs([]); return }
    const unsub = subscribeConversation(chatBlogger, setAdminChatMsgs)
    return unsub
  }, [chatBlogger])
  useEffect(() => {
    if (chatBlogger && adminChatMsgs.some(m => m.from === 'blogger' && !m.read)) {
      markConversationRead(chatBlogger, 'admin')
    }
  }, [chatBlogger, adminChatMsgs])
  const sendAdminMsg = async () => {
    const t = adminChatInput.trim()
    if (!t || !chatBlogger) return
    setAdminChatInput('')
    setAdminChatMsgs(prev => [...prev, { from:'admin', text:t, ts:Date.now(), read:false, _key:'tmp'+Date.now() }])
    await sendMessage(chatBlogger, 'admin', t)
  }

  // Când selectăm blogger pentru update — încărcăm stats
  useEffect(() => {
    if (!updateBlogger) return
    getCasinoStats(updateBlogger.username).then(setCasinoStatsEdit)
  }, [updateBlogger])

  const inp = { width:'100%', padding:'9px 12px', fontSize:13, border:`1px solid ${C.border}`, borderRadius:8, background:'rgba(255,255,255,0.06)', color:C.text, outline:'none', boxSizing:'border-box' }
  const th = { padding:'11px 14px', textAlign:'left', fontSize:11, color:C.textDim, fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', background:'rgba(255,255,255,0.04)', whiteSpace:'nowrap' }
  const td = { padding:'11px 14px', fontSize:13, color:C.text, borderBottom:`1px solid ${C.border}`, verticalAlign:'middle' }

  if (!auth) {
    return (
      <div style={{ minHeight:'100vh', background:'#0a0a0f', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter,sans-serif' }}>
        <div style={{ textAlign:'center', maxWidth:360, width:'100%', padding:'2rem' }}>
          <div style={{ fontSize:24, fontWeight:900, marginBottom:24, color:'#fff' }}>
            WIN<span style={{ color:gold }}>PARTNERS</span>
          </div>
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(245,166,35,0.15)', borderRadius:12, padding:'2rem' }}>
            <h2 style={{ fontSize:18, fontWeight:700, marginBottom:20, color:'#fff' }}>Acces Admin</h2>
            <input
              style={{ ...inp, marginBottom:12, textAlign:'center' }}
              type="password"
              placeholder="Parola admin"
              value={pass}
              onChange={e => setPass(e.target.value)}
              onKeyDown={e => { if(e.key==='Enter' && pass===PASS){ try{sessionStorage.setItem('wp_admin_auth','1')}catch{}; setAuth(true) } }}
            />
            <button
              style={{ width:'100%', padding:'10px', fontSize:14, fontWeight:700, cursor:'pointer', border:'none', borderRadius:6, background:gold, color:'#000' }}
              onClick={() => { if(pass===PASS) { try{sessionStorage.setItem('wp_admin_auth','1')}catch{}; setAuth(true) } else { setPass(''); document.querySelector('input')?.focus() } }}
            >INTRĂ</button>
          </div>
        </div>
      </div>
    )
  }

  // Comisionul de plată: dacă există suma pe cazinouri (earned) o folosim; altfel fallback pe vechiul calcul
  const earnedOf = (b) => (b.earned != null ? b.earned : (b.revenue||0)*((b.commission||25)/100))
  const refBonusOf = (u) => { const n = refNetwork.find(x => x.referrerUsername === (u||'').toLowerCase()); return n ? (Number(n.totalBonus)||0) : 0 }
  const payableOf = (b) => Math.max(0, Math.round(earnedOf(b) + refBonusOf(b.username) - (b.paid||0)))
  const totalRevenue = bloggers.reduce((s,b) => s+(b.revenue||0), 0)
  const totalPaid    = bloggers.reduce((s,b) => s+(b.paid||0), 0)
  const totalPending = bloggers.reduce((s,b) => s+payableOf(b), 0)
  const unreadCount  = notifications.filter(n => !n.read).length
  const chatUnread   = conversations.reduce((s,c) => s+(c.unread||0), 0)
  const pendingApps  = applications.filter(a => a.status==='pending').length

  const saveEdit = async () => {
    await setBlogger(editData)
    setEditId(null)
  }

  const deleteBloggerFn = async (b) => {
    if (!confirm(`Ștergi definitiv bloggerul "${b.name}" (@${b.username})?\n\nSe șterge contul din baza de date. Acțiunea NU poate fi anulată.`)) return
    setBloggers(prev => prev.filter(x => x.username !== b.username))
    const ok = await deleteBlogger(b.username)
    if (!ok) { alert('Ștergerea a eșuat. Reîncarcă pagina și încearcă din nou.'); return }
    await addNotification({ type:'blogger_deleted', blogger: b.name, detail: '@' + b.username + ' · șters de admin' }).catch(()=>{})
  }

  const addBloggerFn = async () => {
    if (!newB.name || !newB.username) return
    const blogger = { ...newB, id: newB.username, clicks:0, regs:0, deposits:0, revenue:0, paid:0, status:'active' }
    await setBlogger(blogger)
    await addNotification({ type:'new_blogger', blogger: newB.name, detail: newB.platform + ' · înregistrat manual de admin' })
    setNewB({ name:'', username:'', platform:'TikTok', country:'Moldova', phone:'', email:'', pass:'', commission:20 })
    setShowAdd(false)
  }

  const processPay = async () => {
    const amt = parseFloat(payAmount)
    if (!amt || !payModal) return
    const owed = payableOf(payModal)
    if (amt > owed && !window.confirm('Atenție: suma $'+amt+' depășește soldul datorat ($'+owed+'). Continui oricum?')) return
    const newPaid = (payModal.paid||0) + amt
    await updateBloggerFields(payModal.username, { paid: newPaid })
    if (payReqKey) { await updatePayoutRequest(payReqKey, 'paid'); setPayReqKey(null) }
    await addNotification({ type:'payment', blogger: payModal.name, detail: 'Plată procesată: $'+amt })
    setPayments(prev => [...prev, { date: new Date().toLocaleDateString('ro-RO'), name: payModal.name, amount: amt, id: Date.now() }])
    setPayModal(null)
    setPayAmount('')
  }

  const addCode = async () => {
    const trimmed = newCodeInput.trim()
    if (!trimmed) return
    await addPromoCode(selectedCasino, { code: trimmed, status:'disponibil', bloggerUsername:null, generatedAt:null })
    setNewCodeInput('')
    setAddCodeMode(false)
  }

  const approveApp = async (app) => {
    const _uname = (app.username||'').toLowerCase()
    if (bloggers.some(b => (b.username||'').toLowerCase() === _uname)) {
      window.alert('⚠️ Există deja un blogger activ cu username-ul @'+app.username+'.\nAprobare oprită — altfel contul existent ar fi suprascris (și-ar pierde soldul și parola).\nCere-i solicitantului alt username sau șterge întâi bloggerul existent.')
      return
    }
    setApplications(prev => prev.map(a => a._key === app._key ? { ...a, status: 'approved' } : a))
    await updateApplication(app._key, 'approved')
    const pass = app.password || (app.username + '2026')
    const blogger = {
      id: app.username, name: app.name, username: app.username,
      platform: app.platform, country: app.country||'Moldova',
      phone: app.phone||'', email: app.email||'',
      status:'active', commission:25,
      clicks:0, regs:0, deposits:0, revenue:0, paid:0,
      pass,
      payMethod: app.payMethod||'Bitcoin', payAddress: app.payAddress||'',
    }
    // Referral: dacă cererea a venit cu cod de invitație, păstrăm legătura pe blogger
    const _ref = (app.refCode || app.inviteCode || '').trim()
    if (_ref) blogger.invitedBy = _ref
    await setBlogger(blogger)
    // Trimite email de bun-venit (felicitări + credențiale + pași + Telegram) prin EmailJS
    let emailResult = { ok:false }
    try {
      emailResult = await sendWelcomeEmail(app.email, app.name, app.username, pass)
    } catch(e) { console.warn('Welcome email failed:', e) }
    await addNotification({
      type:'new_blogger',
      blogger: app.name,
      detail:`Aprobat · user: ${app.username} · pass: ${pass} · email ${emailResult.ok ? 'trimis ✅' : 'NEEXPEDIAT ⚠️'} la ${app.email||'N/A'}`
    })
    await sendTelegramNotif(
      `✅ <b>Blogger aprobat!</b>\n` +
      `👤 ${app.name} (@${app.username})\n` +
      `📱 ${app.platform} · ${app.country || '—'}\n` +
      `🔑 Parolă: <code>${pass}</code>\n` +
      `📧 Email: ${app.email || '—'} ${emailResult.ok ? '(bun-venit trimis ✅)' : '(email NEEXPEDIAT ⚠️ — anunță-l manual)'}`
    )
    getBloggers().then(setBloggers)
  }

  const saveCasinoStats = async (casinoId) => {
    if (!updateBlogger) return
    const commPct = { melbet:25, xbet:25, mostbet:25, spinbetter:25, betwinner:25, onewin:25, vavada:25, parimatch:25 }[casinoId] || 25
    const s = { ...(casinoStatsEdit[casinoId] || {}) }
    // plasă de siguranță: dacă există venit dar comisionul lipsește/0, îl calculăm din RevShare%
    if (s.revenue && !s.commission) s.commission = Math.round(s.revenue * commPct / 100)
    await setCasinoStats(updateBlogger.username, casinoId, s)
    // Sursă unică de adevăr: comisionul total al bloggerului = suma comisioanelor pe toate cazinourile
    const merged = { ...casinoStatsEdit, [casinoId]: s }
    setCasinoStatsEdit(merged)
    const earned = Math.round(Object.values(merged).reduce((acc,cs)=>acc+(Number(cs && cs.commission)||0),0))
    const revenueTotal = Math.round(Object.values(merged).reduce((acc,cs)=>acc+(Number(cs && cs.revenue)||0),0))
    await updateBloggerFields(updateBlogger.username, { earned, revenue: revenueTotal })
    setUpdateBlogger({ ...updateBlogger, earned, revenue: revenueTotal })
    setBloggers(prev => prev.map(b => b.username===updateBlogger.username ? { ...b, earned, revenue: revenueTotal } : b))
    await addNotification({ type:'stats_update', blogger: updateBlogger.username, detail: CASINOS_LIST.find(c=>c.id===casinoId)?.name + ' · statistici actualizate' })
    setSaveMsg('✅ Salvat!')
    setTimeout(() => setSaveMsg(''), 3000)
  }

  const runSeed = async () => {
    setSeedStatus('Se inițializează...')
    const result = await seedDatabase()
    setSeedStatus(result === 'seeded_ok' ? '✅ Date inițiale setate!' : '⚠️ Deja inițializată — apasă Force Reseed')
    setTimeout(() => setSeedStatus(''), 5000)
  }

  const runForceReseed = async () => {
    if (!window.confirm('Resetezi toată baza de date? Datele existente vor fi șterse!')) return
    setSeedStatus('⏳ Force reseed...')
    const result = await forceReseedDatabase()
    setSeedStatus(result.includes('ok') ? '✅ Baza de date resetată!' : '✅ LocalStorage reset!')
    setTimeout(() => setSeedStatus(''), 5000)
  }

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:'Inter,sans-serif', color:C.text, display:'flex', flexDirection: isMobile ? 'column' : 'row', overflowX:'hidden' }}>

      {/* ═══════ SIDEBAR / CONTROL BAR ═══════ */}
      {(() => {
        const NAV = [
          ['applications', '📥', 'Aplicații', pendingApps],
          ['bloggers',     '👥', 'Bloggeri', null],
          ['referrals',    '🔗', 'Invitați', null],
          ['update',       '📊', 'Actualizare stats', null],
          ['payments',     '💸', 'Plăți', null],
          ['payout-requests','🏦','Cereri plată', payoutRequests.filter(p=>p.status==='pending').length],
          ['promo',        '🎟', 'Promocoduri', null],
          ['special',      '✨', 'Coduri speciale', customRequests.filter(r=>r.status==='pending').length],
          ['chat',         '💬', 'Mesaje', chatUnread],
          ['notif',        '🔔', 'Notificări', unreadCount],
        ]
        return (
          <aside style={{
            background:C.sidebar,
            borderRight: isMobile ? 'none' : `1px solid ${C.border}`,
            borderBottom: isMobile ? `1px solid ${C.border}` : 'none',
            width: isMobile ? '100%' : 230,
            flexShrink:0,
            display:'flex',
            flexDirection: isMobile ? 'row' : 'column',
            alignItems: isMobile ? 'center' : 'stretch',
            padding: isMobile ? '0.5rem 0.75rem' : '1.25rem 0',
            gap: isMobile ? 6 : 0,
            overflowX: isMobile ? 'auto' : 'visible',
            position: isMobile ? 'sticky' : 'sticky',
            top:0, height: isMobile ? 'auto' : '100vh', zIndex:50,
          }}>
            {/* logo */}
            <div style={{ fontSize:18, fontWeight:900, color:'#fff', padding: isMobile ? '0 12px 0 4px' : '0 1.5rem', marginBottom: isMobile ? 0 : 24, whiteSpace:'nowrap', flexShrink:0 }}>
              WIN<span style={{ color:gold }}>P</span>
              {!isMobile && <span style={{ color:gold }}>ARTNERS</span>}
            </div>

            {/* nav */}
            <nav style={{ display:'flex', flexDirection: isMobile ? 'row' : 'column', gap: isMobile ? 6 : 2, flex: isMobile ? 'none' : 1, padding: isMobile ? 0 : '0 0.75rem' }}>
              {NAV.map(([id, icon, lbl, badge]) => {
                const active = tab === id
                return (
                  <button key={id} onClick={() => setTab(id)} style={{
                    display:'flex', alignItems:'center', gap:10,
                    padding: isMobile ? '8px 12px' : '10px 14px',
                    fontSize:13, fontWeight: active?700:500, cursor:'pointer',
                    border:'none', borderRadius:10,
                    background: active ? gold : 'transparent',
                    color: active ? '#1a1a2e' : C.textDim,
                    whiteSpace:'nowrap', flexShrink:0, textAlign:'left', width: isMobile ? 'auto' : '100%',
                    transition:'background .12s',
                  }}>
                    <span style={{ fontSize:15 }}>{icon}</span>
                    {!isMobile && <span style={{ flex:1 }}>{lbl}</span>}
                    {isMobile && <span>{lbl}</span>}
                    {badge>0 && <span style={{ background: active?'#1a1a2e':C.red, color:'#fff', fontSize:10, fontWeight:700, minWidth:18, height:18, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 5px' }}>{badge}</span>}
                  </button>
                )
              })}
            </nav>

            {/* bottom: db status + seed (desktop only) */}
            {!isMobile && (
              <div style={{ padding:'0 1.25rem', display:'flex', flexDirection:'column', gap:8, marginTop:12 }}>
                <span style={{ fontSize:11, padding:'5px 10px', borderRadius:6, fontWeight:600, textAlign:'center',
                  background: isFirebaseEnabled ? 'rgba(34,197,94,0.14)' : 'rgba(245,166,35,0.14)',
                  color: isFirebaseEnabled ? C.green : gold }}>
                  {isFirebaseEnabled ? '🔥 Firebase activ' : '💾 Local'}
                </span>
                <button onClick={async () => { const data = await exportFullBackup(); if(!data){ window.alert('Backup eșuat — verifică conexiunea Firebase.'); return } const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'}); const a2 = document.createElement('a'); a2.href = URL.createObjectURL(blob); a2.download = 'winpartners-backup-'+new Date().toISOString().slice(0,10)+'.json'; a2.click(); URL.revokeObjectURL(a2.href) }}
                  style={{ padding:'8px', fontSize:12, fontWeight:600, cursor:'pointer', border:'1px solid rgba(34,197,94,0.3)', borderRadius:8, background:'none', color:C.green }}>
                  💾 Backup date
                </button>
                <button onClick={() => { try{sessionStorage.removeItem('wp_admin_auth')}catch{}; setAuth(false); setPass('') }}
                  style={{ padding:'8px', fontSize:12, fontWeight:600, cursor:'pointer', border:`1px solid ${C.border}`, borderRadius:8, background:'none', color:C.textDim }}>
                  🔒 Logout
                </button>
              </div>
            )}
          </aside>
        )
      })()}

      {/* ═══════ MAIN CONTENT ═══════ */}
      <main style={{ flex:1, minWidth:0, padding: isMobile ? '1rem 0.75rem' : '1.5rem 2rem', overflowX:'hidden' }}>

      {/* top bar: page title + bell */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem', gap:12 }}>
        <h2 style={{ fontSize: isMobile?17:20, fontWeight:800, color:'#fff', margin:0 }}>
          {{applications:'Cereri de înregistrare', bloggers:'Bloggeri', referrals:'Bloggeri invitați (Referral)', update:'Actualizare statistici', payments:'Plăți', 'payout-requests':'Cereri de plată', promo:'Promocoduri', special:'Coduri speciale', chat:'Mesaje', notif:'Notificări'}[tab] || 'Admin'}
        </h2>
        <button onClick={() => setShowNotifPanel(p => !p)} style={{ position:'relative', padding:'8px 12px', fontSize:13, cursor:'pointer', border:`1px solid ${C.border}`, borderRadius:8, background:C.panel, color:C.text }}>
          🔔 {unreadCount > 0 && <span style={{ background:C.red, color:'#fff', borderRadius:10, fontSize:10, padding:'1px 5px', position:'absolute', top:-6, right:-6 }}>{unreadCount}</span>}
        </button>
      </div>

      {/* NOTIF PANEL */}
      {showNotifPanel && (
        <div style={{ position:'fixed', top: isMobile ? 0 : 60, right: isMobile ? 0 : 24, left: isMobile ? 0 : 'auto', width: isMobile ? '100%' : 380, maxHeight: isMobile ? '60vh' : 440, overflowY:'auto', background:C.panel, border:`1px solid ${C.borderHi}`, borderRadius: isMobile ? '0 0 12px 12px' : 12, padding:'1rem', zIndex:300, boxShadow:'0 12px 40px rgba(0,0,0,0.4)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <span style={{ fontWeight:700, fontSize:14 }}>Notificări</span>
            <div style={{display:'flex',gap:12}}><button onClick={() => { notifications.forEach(n => !n.read && n._key && markRead(n._key)) }} style={{ fontSize:11, cursor:'pointer', border:'none', background:'none', color:gold }}>Marchează toate</button><button onClick={() => { if(window.confirm('Ștergi toate notificările?')){ setNotifications([]); clearAllNotifications() } }} style={{ fontSize:11, cursor:'pointer', border:'none', background:'none', color:'#ef4444' }}>Șterge toate</button></div>
          </div>
          {notifications.length === 0 ? <p style={{ color:C.textDim, fontSize:13 }}>Nicio notificare</p> : notifications.slice(0,15).map(n => (
            <div key={n.id} onClick={() => n._key && markRead(n._key)} style={{ padding:'10px', borderRadius:8, marginBottom:6, background: n.read ? 'rgba(255,255,255,0.03)' : 'rgba(245,166,35,0.10)', border:`1px solid ${C.border}`, cursor:'pointer' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                <div style={{ fontSize:12, fontWeight:600, color: n.read ? C.textDim : '#fff' }}>{n.blogger} · {n.detail}</div>
                <button onClick={(e)=>{ e.stopPropagation(); setNotifications(prev=>prev.filter(x=>(x._key||x.id)!==(n._key||n.id))); deleteNotification(n._key||n.id) }} title="Șterge" style={{ background:'none', border:'none', color:'#ef4444', fontSize:14, cursor:'pointer', lineHeight:1, padding:0, flexShrink:0 }}>✕</button>
              </div>
              <div style={{ fontSize:10, color:C.textFaint, marginTop:2 }}>{n.timestamp}</div>
            </div>
          ))}
        </div>
      )}

      {/* KPI CARDS */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:12, marginBottom:'1.5rem' }}>
        {[
          ['Bloggeri activi', bloggers.filter(b=>b.status==='active').length, C.green],
          ['Venit total',     '$'+totalRevenue.toLocaleString(), gold],
          ['De plătit',       '$'+Math.round(totalPending).toLocaleString(), C.red],
          ['Coduri disponibile', Object.values(promoCodes).flat().filter(c=>c.status==='disponibil').length, C.purple],
          ['Aplicații noi',  pendingApps, C.blue],
        ].map(([l,v,c]) => (
          <div key={l} style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:14, padding:'1.1rem 1.25rem' }}>
            <div style={{ fontSize:10, color:C.textDim, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>{l}</div>
            <div style={{ fontSize:24, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* ── TAB: APLICAȚII ── */}
      {tab==='applications' && (
        <div>
          <h3 style={{ color:gold, marginBottom:'1rem', fontSize:16 }}>Cereri de înregistrare</h3>
          {applications.length === 0
            ? <div style={{ padding:40, textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:13 }}>Nicio cerere de înregistrare</div>
            : (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {applications.map(app => {
                  const stColor = app.status==='pending'?'#3b82f6':app.status==='approved'?'#10b981':'#ef4444'
                  const stLabel = app.status==='pending'?'În așteptare':app.status==='approved'?'Aprobat':'Respins'
                  // normalize the profile link (accept with/without https://)
                  const rawProfile = (app.profileLink || '').trim()
                  const profileHref = rawProfile && !/^https?:\/\//i.test(rawProfile) ? 'https://' + rawProfile : rawProfile
                  // normalize telegram handle → t.me link
                  const tg = (app.phone || '').trim()
                  const tgHref = tg.startsWith('@') ? 'https://t.me/' + tg.slice(1) : (/^https?:\/\//i.test(tg) ? tg : (tg ? 'https://t.me/' + tg.replace(/^@/,'') : ''))
                  const pIcon = { TikTok:'🎵', Instagram:'📸', YouTube:'▶️', Telegram:'✈️', Facebook:'👤' }[app.platform] || '📱'
                  const Field = ({ label, children }) => (
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'.5px', color:'rgba(255,255,255,0.3)', marginBottom:2 }}>{label}</div>
                      <div style={{ fontSize:13, color:'rgba(255,255,255,0.85)', wordBreak:'break-word' }}>{children}</div>
                    </div>
                  )
                  return (
                  <div key={app.id} style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${stColor}55`, borderLeft:`3px solid ${stColor}`, borderRadius:12, padding:'1.25rem' }}>
                    {/* header row: identity + status */}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:14 }}>
                      <div>
                        <div style={{ fontWeight:700, fontSize:16, color:'#fff' }}>{app.name} <span style={{ fontSize:12, color:gold, fontWeight:500 }}>@{app.username}</span></div>
                        <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:3 }}>Aplicat: {app.date}</div>
                      </div>
                      <span style={{ background:`${stColor}22`, color:stColor, padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:700, whiteSpace:'nowrap' }}>{stLabel}</span>
                    </div>

                    {/* PROFILE — the key verification action */}
                    {profileHref
                      ? <a href={profileHref} target="_blank" rel="noopener noreferrer"
                           style={{ display:'flex', alignItems:'center', gap:10, background:`${gold}14`, border:`1px solid ${gold}55`, borderRadius:10, padding:'12px 14px', marginBottom:14, textDecoration:'none', color:gold, fontWeight:700, fontSize:14 }}>
                          <span style={{ fontSize:20 }}>{pIcon}</span>
                          <span style={{ flex:1, minWidth:0 }}>
                            <span style={{ display:'block' }}>Deschide profilul {app.platform} ↗</span>
                            <span style={{ display:'block', fontSize:11, fontWeight:400, color:'rgba(255,255,255,0.5)', wordBreak:'break-all', marginTop:2 }}>{rawProfile}</span>
                          </span>
                        </a>
                      : <div style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:10, padding:'12px 14px', marginBottom:14, color:'#f87171', fontSize:13 }}>
                          ⚠️ Fără link de profil — nu poate fi verificat. Contactează-l pe Telegram înainte de aprobare.
                        </div>
                    }

                    {/* data grid */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'12px 18px', marginBottom: app.aboutYou ? 14 : 0 }}>
                      <Field label="Platformă">{pIcon} {app.platform}</Field>
                      <Field label="Urmăritori">👥 {Number(app.followers||0).toLocaleString()}</Field>
                      <Field label="Țară">🌍 {app.country || '—'}</Field>
                      <Field label="Email">
                        {app.email
                          ? <a href={`mailto:${app.email}`} style={{ color:'#60a5fa', textDecoration:'none' }}>{app.email}</a>
                          : '—'}
                      </Field>
                      <Field label="Telegram">
                        {tg
                          ? <a href={tgHref} target="_blank" rel="noopener noreferrer" style={{ color:'#60a5fa', textDecoration:'none' }}>{tg} ↗</a>
                          : '—'}
                      </Field>
                    </div>

                    {/* about */}
                    {app.aboutYou && (
                      <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:8, padding:'10px 12px', marginBottom:14 }}>
                        <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'.5px', color:'rgba(255,255,255,0.3)', marginBottom:4 }}>Despre el</div>
                        <div style={{ fontSize:13, color:'rgba(255,255,255,0.7)', fontStyle:'italic' }}>"{app.aboutYou}"</div>
                      </div>
                    )}

                    {/* actions */}
                    {app.status==='pending' && (
                      <div style={{ display:'flex', gap:10, borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:14 }}>
                        <button onClick={() => approveApp(app)} style={{ flex:1, padding:'10px', fontSize:13, fontWeight:700, cursor:'pointer', border:'none', borderRadius:8, background:'#10b981', color:'#fff' }}>✓ Aprobă</button>
                        <button onClick={() => { if(!confirm(`Respingi cererea lui ${app.name}?`)) return; setApplications(prev => prev.map(a => a._key === app._key ? { ...a, status: 'rejected' } : a)); updateApplication(app._key, 'rejected') }} style={{ flex:1, padding:'10px', fontSize:13, fontWeight:700, cursor:'pointer', border:'1px solid rgba(239,68,68,0.4)', borderRadius:8, background:'transparent', color:'#f87171' }}>✗ Respinge</button>
                      </div>
                    )}
                    <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:12, marginTop:4, textAlign:'right' }}>
                      <button onClick={() => { if(!window.confirm('Ștergi definitiv cererea lui '+app.name+'?')) return; setApplications(prev => prev.filter(a => a._key !== app._key)); deleteApplication(app._key) }} style={{ padding:'6px 12px', fontSize:12, cursor:'pointer', border:'1px solid rgba(239,68,68,0.3)', borderRadius:6, background:'none', color:'#ef4444' }}>🗑 Șterge cererea</button>
                    </div>
                  </div>
                  )
                })}
              </div>
            )
          }
        </div>
      )}

      {/* ── TAB: BLOGGERI ── */}
      {tab==='bloggers' && (
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
            <h3 style={{ color:gold, fontSize:16 }}>Bloggeri ({bloggers.length})</h3>
            <button onClick={() => setShowAdd(p=>!p)} style={{ padding:'8px 16px', fontSize:12, fontWeight:700, cursor:'pointer', border:'none', borderRadius:8, background:gold, color:'#000' }}>+ Adaugă blogger</button>
          </div>

          {showAdd && (
            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(245,166,35,0.2)', borderRadius:12, padding:'1.25rem', marginBottom:'1rem' }}>
              <h4 style={{ color:gold, marginBottom:12, fontSize:14 }}>Blogger nou</h4>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:10 }}>
                {[['Nume complet','name','text'],['Username','username','text'],['Email','email','email'],['Telefon','phone','text'],['Parolă','pass','text'],['Comision %','commission','number']].map(([lbl,k,type]) => (
                  <div key={k}>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', marginBottom:3, textTransform:'uppercase' }}>{lbl}</div>
                    <input style={inp} type={type} value={newB[k]} onChange={e => setNewB(p=>({...p,[k]:type==='number'?+e.target.value:e.target.value}))} />
                  </div>
                ))}
                <div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', marginBottom:3, textTransform:'uppercase' }}>Platformă</div>
                  <select style={inp} value={newB.platform} onChange={e => setNewB(p=>({...p,platform:e.target.value}))}>
                    {['TikTok','Instagram','YouTube','Telegram','Facebook'].map(pl => <option key={pl}>{pl}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display:'flex', gap:8, marginTop:12 }}>
                <button onClick={addBloggerFn} style={{ padding:'8px 20px', fontSize:13, fontWeight:700, cursor:'pointer', border:'none', borderRadius:6, background:gold, color:'#000' }}>Salvează în Firebase</button>
                <button onClick={() => setShowAdd(false)} style={{ padding:'8px 16px', fontSize:13, cursor:'pointer', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, background:'none', color:'#94a3b8' }}>Anulează</button>
              </div>
            </div>
          )}

          <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(245,166,35,0.08)', borderRadius:12, overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13, minWidth:650 }}>
              <thead>
                <tr>{['Blogger','Username','Platformă','Țară','Status','Regs','Venit','Comision','Parolă','Acțiuni'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {bloggers.map(b => (
                  <tr key={b.username} style={{ cursor:'pointer' }}>
                    {editId===b.username ? (
                      <>
                        <td style={td}><input style={{...inp,width:120}} value={editData.name} onChange={e=>setEditData(p=>({...p,name:e.target.value}))}/></td>
                        <td style={td}><span style={{color:'rgba(255,255,255,0.4)'}}>{b.username}</span></td>
                        <td style={td}><select style={{...inp,width:100}} value={editData.platform} onChange={e=>setEditData(p=>({...p,platform:e.target.value}))}>{['TikTok','Instagram','YouTube','Telegram','Facebook'].map(pl=><option key={pl}>{pl}</option>)}</select></td>
                        <td style={td}>{b.country}</td>
                        <td style={td}><select style={{...inp,width:90}} value={editData.status} onChange={e=>setEditData(p=>({...p,status:e.target.value}))}><option value="active">Active</option><option value="pending">Pending</option><option value="inactive">Inactive</option></select></td>
                        <td style={td}>{b.regs||0}</td>
                        <td style={td}>${(b.revenue||0).toLocaleString()}</td>
                        <td style={{...td,color:gold}}><input style={{...inp,width:60}} type="number" value={editData.commission} onChange={e=>setEditData(p=>({...p,commission:+e.target.value}))}/></td>
                        <td style={td}><input style={{...inp,width:100}} value={editData.pass||''} onChange={e=>setEditData(p=>({...p,pass:e.target.value}))}/></td>
                        <td style={td}>
                          <div style={{display:'flex',gap:6}}>
                            <button onClick={saveEdit} style={{padding:'4px 10px',fontSize:11,fontWeight:700,cursor:'pointer',border:'none',borderRadius:4,background:'#10b981',color:'#fff'}}>💾</button>
                            <button onClick={()=>setEditId(null)} style={{padding:'4px 10px',fontSize:11,cursor:'pointer',border:'1px solid rgba(255,255,255,0.1)',borderRadius:4,background:'none',color:'#94a3b8'}}>✕</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{...td,fontWeight:600,color:'#fff'}}>{b.name}</td>
                        <td style={{...td,color:'rgba(255,255,255,0.5)',fontFamily:'monospace'}}>@{b.username}</td>
                        <td style={td}>{b.platform}</td>
                        <td style={td}>{b.country}</td>
                        <td style={td}>
                          <span style={{background:b.status==='active'?'#10b98122':'#f59e0b22',color:b.status==='active'?'#10b981':'#f59e0b',padding:'2px 8px',borderRadius:4,fontSize:11,fontWeight:700}}>{b.status}</span>
                        </td>
                        <td style={td}>{b.regs||0}</td>
                        <td style={{...td,color:gold,fontWeight:600}}>${(b.revenue||0).toLocaleString()}</td>
                        <td style={{...td,color:'rgba(255,255,255,0.5)'}}>{b.commission||20}%</td>
                        <td style={{...td,fontFamily:'monospace',fontSize:11,color:'rgba(255,255,255,0.4)'}}>{b.pass||'—'}</td>
                        <td style={td}>
                          <div style={{display:'flex',gap:6}}>
                            <button onClick={()=>{setEditId(b.username);setEditData({...b})}} style={{padding:'4px 10px',fontSize:11,cursor:'pointer',border:'1px solid rgba(245,166,35,0.3)',borderRadius:4,background:'none',color:gold}}>✏️</button>
                            <button onClick={()=>{setPayModal(b);setPayAmount(payableOf(b).toString())}} style={{padding:'4px 10px',fontSize:11,cursor:'pointer',border:'1px solid rgba(16,185,129,0.3)',borderRadius:4,background:'none',color:'#10b981'}}>💰</button>
                            <button onClick={()=>deleteBloggerFn(b)} title="Șterge blogger" style={{padding:'4px 10px',fontSize:11,cursor:'pointer',border:'1px solid rgba(239,68,68,0.3)',borderRadius:4,background:'none',color:'#ef4444'}}>🗑</button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB: INVITAȚI (REFERRAL) ── */}
      {tab==='referrals' && (
        <div>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'14px 16px', marginBottom:16 }}>
            <p style={{ fontSize:13, color:C.text, margin:0, lineHeight:1.6 }}>
              Aici vezi cine pe cine a invitat prin linkul de referral. Bonusul este <strong style={{ color:gold }}>{REFERRAL_PERCENT}% din câștigul (earned) fiecărui invitat</strong>, plătit de admin suplimentar (nu se scade din ce primește invitatul).
            </p>
          </div>

          {refNetwork.length === 0 ? (
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'40px 20px', textAlign:'center' }}>
              <div style={{ fontSize:32, marginBottom:10 }}>🔗</div>
              <p style={{ color:C.textDim, fontSize:14, margin:0 }}>Niciun blogger invitat încă.</p>
              <p style={{ color:C.textDim, fontSize:12, marginTop:6 }}>Când cineva se înregistrează printr-un link <code>?ref=...</code> și e aprobat, apare aici.</p>
            </div>
          ) : (
            refNetwork.map(net => (
              <div key={net.referrerUsername} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, marginBottom:16, overflow:'hidden' }}>
                <div style={{ padding:'14px 16px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
                  <div>
                    <div style={{ fontSize:15, fontWeight:700, color:C.text }}>👤 {net.referrerName}</div>
                    <div style={{ fontSize:12, color:C.textDim }}>@{net.referrerUsername} · {net.invitees.length} invitat{net.invitees.length===1?'':'i'}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:11, color:C.textDim, textTransform:'uppercase', letterSpacing:'.05em' }}>Bonus total de plată</div>
                    <div style={{ fontSize:20, fontWeight:800, color:C.green }}>${net.totalBonus.toFixed(2)}</div>
                  </div>
                </div>
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13, minWidth:520 }}>
                    <thead><tr>
                      <th style={th}>Invitat</th>
                      <th style={th}>Status</th>
                      <th style={th}>Câștig (earned)</th>
                      <th style={th}>Bonus {REFERRAL_PERCENT}%</th>
                    </tr></thead>
                    <tbody>
                      {net.invitees.map(inv => (
                        <tr key={inv.username}>
                          <td style={td}>
                            <div style={{ fontWeight:600 }}>{inv.name}</div>
                            <div style={{ fontSize:11, color:C.textDim }}>@{inv.username}</div>
                          </td>
                          <td style={td}>
                            <span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:6, background: inv.status==='active'?'rgba(16,185,129,0.15)':'rgba(148,163,184,0.15)', color: inv.status==='active'?'#10b981':C.textDim }}>
                              {inv.status==='active'?'Activ':inv.status}
                            </span>
                          </td>
                          <td style={{ ...td, fontWeight:600 }}>${(inv.earned||0).toFixed(2)}</td>
                          <td style={{ ...td, color:C.green, fontWeight:700 }}>${(inv.bonus||0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── TAB: PROMCODURI ── */}
      {tab==='promo' && (
        <div>
          <div style={{ display:'flex', gap:8, marginBottom:'1.5rem', flexWrap:'wrap' }}>
            {CASINOS_LIST.map(casino => {
              const codes = promoCodes[casino.id] || []
              const disponibile = codes.filter(c => c.status==='disponibil').length
              return (
                <button key={casino.id}
                  onClick={() => { setSelectedCasino(casino.id); setAddCodeMode(false) }}
                  style={{ padding:'10px 18px', fontSize:13, fontWeight:600, cursor:'pointer', border:`2px solid ${selectedCasino===casino.id?casino.color:'rgba(255,255,255,0.1)'}`, borderRadius:8, background:selectedCasino===casino.id?casino.color+'22':'none', color:selectedCasino===casino.id?casino.color:'rgba(255,255,255,0.5)' }}>
                  {casino.name} <span style={{ background:'rgba(0,0,0,0.3)', borderRadius:10, padding:'1px 7px', fontSize:11, marginLeft:6 }}>{disponibile} disponibile</span>
                </button>
              )
            })}
          </div>

          {(() => {
            const casino = CASINOS_LIST.find(c=>c.id===selectedCasino)
            const codes = promoCodes[selectedCasino] || []
            return (
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
                  <h3 style={{ color:casino?.color||gold, fontSize:15 }}>{casino?.name} — {codes.length} coduri</h3>
                  <div style={{ display:'flex', gap:8 }}>
                    {addCodeMode ? (
                      <>
                        <input style={{...inp,width:200}} value={newCodeInput} onChange={e=>setNewCodeInput(e.target.value)} placeholder="ex: ml_123456" onKeyDown={e=>e.key==='Enter'&&addCode()} />
                        <button onClick={addCode} style={{padding:'6px 16px',fontSize:12,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:casino?.color||gold,color:'#000'}}>Adaugă</button>
                        <button onClick={()=>setAddCodeMode(false)} style={{padding:'6px 12px',fontSize:12,cursor:'pointer',border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,background:'none',color:'#94a3b8'}}>Anulează</button>
                      </>
                    ) : (
                      <button onClick={()=>setAddCodeMode(true)} style={{padding:'8px 16px',fontSize:12,fontWeight:700,cursor:'pointer',border:`1px solid ${casino?.color||gold}`,borderRadius:6,background:'none',color:casino?.color||gold}}>+ Adaugă cod</button>
                    )}
                  </div>
                </div>
                <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                    <thead><tr>{['Cod','Status','Blogger','Atribuit la'].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                    <tbody>
                      {codes.length === 0 ? (
                        <tr><td colSpan={4} style={{...td,textAlign:'center',color:'rgba(255,255,255,0.3)',padding:32}}>Niciun cod adăugat încă. Adaugă coduri din panoul {casino?.name}.</td></tr>
                      ) : codes.map((c,i) => (
                        <tr key={i}>
                          <td style={{...td,fontFamily:'monospace',fontWeight:700,color:'#fff'}}>{c.code}</td>
                          <td style={td}>
                            <span style={{background:c.status==='disponibil'?'#10b98122':c.status==='atribuit'?'#f59e0b22':'#3b82f622',color:c.status==='disponibil'?'#10b981':c.status==='atribuit'?'#f59e0b':'#3b82f6',padding:'2px 8px',borderRadius:4,fontSize:11,fontWeight:700}}>{c.status}</span>
                          </td>
                          <td style={{...td,color:'rgba(255,255,255,0.5)'}}>{c.bloggerUsername||'—'}</td>
                          <td style={{...td,color:'rgba(255,255,255,0.35)',fontSize:11}}>{c.generatedAt||'—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* ── TAB: CODURI SPECIALE ── */}
      {tab==='special' && (
        <div>
          <h3 style={{ color:gold, marginBottom:'1rem', fontSize:16 }}>Cereri coduri speciale</h3>
          {customRequests.length === 0
            ? <div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,0.3)',fontSize:13}}>Nicio cerere de cod special</div>
            : (
              <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:12,overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                  <thead><tr>{['Data','Blogger','Casino','Tip','Cod solicitat','Status','Acțiuni'].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {customRequests.map(r => (
                      <tr key={r.id}>
                        <td style={{...td,fontSize:11,color:'rgba(255,255,255,0.4)'}}>{r.timestamp}</td>
                        <td style={td}>{r.blogger}</td>
                        <td style={td}>{r.casinoName}</td>
                        <td style={td}>{(r.type==='casino_access'||r.requestedCode==='ACCES')
                          ? <span style={{background:'#3b82f622',color:'#3b82f6',padding:'2px 8px',borderRadius:4,fontSize:11,fontWeight:700}}>🔓 Acces cazino</span>
                          : r.type==='code_request'
                          ? <span style={{background:'#ef444422',color:'#ef4444',padding:'2px 8px',borderRadius:4,fontSize:11,fontWeight:700}}>🎟 Cerere cod (rezervă goală)</span>
                          : <span style={{background:'#f5a62322',color:'#f5a623',padding:'2px 8px',borderRadius:4,fontSize:11,fontWeight:700}}>✨ Cod personalizat</span>}</td>
                        <td style={{...td,fontFamily:'monospace',color:gold,fontWeight:700}}>{r.requestedCode}{r.approvedCode&&r.approvedCode!==r.requestedCode?(' → '+r.approvedCode):''}</td>
                        <td style={td}><span style={{background:r.status==='pending'?'#f59e0b22':r.status==='approved'?'#10b98122':'#ef444422',color:r.status==='pending'?'#f59e0b':r.status==='approved'?'#10b981':'#ef4444',padding:'2px 8px',borderRadius:4,fontSize:11,fontWeight:700}}>{r.status}</span></td>
                        <td style={td}>
                          {r.status==='pending' && (
                            <div style={{display:'flex',gap:6}}>
                              <button onClick={()=>{const isCustomName=!r.type&&r.requestedCode&&r.requestedCode!=='ACCES'&&r.requestedCode!=='REZERVĂ GOALĂ';if(isCustomName){const fc=(window.prompt('Cod final aprobat de cazinou (numele activ care apare la blogger):',r.requestedCode)||'').trim().toUpperCase();if(!fc)return;updateCustomRequest(r._key,'approved',{approvedCode:fc})}else{updateCustomRequest(r._key,'approved')}}} style={{padding:'4px 10px',fontSize:11,fontWeight:700,cursor:'pointer',border:'none',borderRadius:4,background:'#10b981',color:'#fff'}}>Aprobă</button>
                              <button onClick={()=>{if(window.confirm('Respingi cererea? Bloggerul va vedea că acest nume nu e disponibil.'))updateCustomRequest(r._key,'rejected')}} style={{padding:'4px 10px',fontSize:11,fontWeight:700,cursor:'pointer',border:'none',borderRadius:4,background:'#ef4444',color:'#fff'}}>Respinge</button>
                            </div>
                          )}
                          <button onClick={()=>{ if(window.confirm('Ștergi cererea de cod a lui '+r.blogger+'?')) deleteCustomRequest(r._key) }} title="Șterge cererea" style={{marginTop: r.status==='pending'?6:0, padding:'4px 10px', fontSize:11, cursor:'pointer', border:'1px solid rgba(239,68,68,0.3)', borderRadius:4, background:'none', color:'#ef4444'}}>🗑</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        </div>
      )}

      {/* ── TAB: MESAJE (chat cu bloggerii) ── */}
      {tab==='chat' && (
        <div>
          <h3 style={{ color:gold, marginBottom:'1rem', fontSize:16 }}>Mesaje cu bloggerii</h3>
          <div style={{display:'flex',gap:12,height:isMobile?'auto':520}}>
            {(!isMobile || !chatBlogger) && (
              <div style={{width:isMobile?'100%':280,flexShrink:0,background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:12,overflowY:'auto',maxHeight:isMobile?'60vh':520}}>
                {conversations.length===0
                  ? <div style={{padding:30,textAlign:'center',color:'rgba(255,255,255,0.3)',fontSize:13}}>Nicio conversație încă</div>
                  : conversations.map(c=>{
                      const b = bloggers.find(x=>x.username===c.username)
                      const sel = chatBlogger===c.username
                      return (
                        <div key={c.username} onClick={()=>setChatBlogger(c.username)} style={{padding:'12px 14px',cursor:'pointer',borderBottom:'1px solid rgba(255,255,255,0.05)',background:sel?'rgba(245,166,35,0.1)':'none',borderLeft:sel?`3px solid ${gold}`:'3px solid transparent'}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
                            <span style={{fontSize:13,fontWeight:700,color:sel?gold:'#fff'}}>{b?.name||c.username}</span>
                            {c.unread>0 && <span style={{background:'#ef4444',color:'#fff',fontSize:10,fontWeight:700,minWidth:18,height:18,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 5px'}}>{c.unread}</span>}
                          </div>
                          <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginTop:3,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.last.from==='admin'?'Tu: ':''}{c.last.text}</div>
                        </div>
                      )
                    })
                }
              </div>
            )}
            {(!isMobile || chatBlogger) && (
              <div style={{flex:1,display:'flex',flexDirection:'column',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:12,overflow:'hidden',minHeight:isMobile?440:undefined}}>
                {!chatBlogger ? (
                  <div style={{margin:'auto',color:'rgba(255,255,255,0.3)',fontSize:13,padding:30}}>Selectează o conversație din stânga</div>
                ) : (
                  <>
                    <div style={{padding:'12px 14px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',gap:10}}>
                      {isMobile && <button onClick={()=>setChatBlogger(null)} style={{background:'none',border:'none',color:gold,fontSize:18,cursor:'pointer',padding:0}}>←</button>}
                      <span style={{fontSize:14,fontWeight:700,color:'#fff'}}>{bloggers.find(x=>x.username===chatBlogger)?.name||chatBlogger}</span>
                      <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>@{chatBlogger}</span>
                      <button onClick={()=>{ if(!window.confirm('Ștergi toată conversația cu @'+chatBlogger+'?')) return; deleteConversation(chatBlogger); setChatBlogger(null) }} title="Șterge conversația" style={{marginLeft:'auto',padding:'4px 10px',fontSize:12,cursor:'pointer',border:'1px solid rgba(239,68,68,0.3)',borderRadius:6,background:'none',color:'#ef4444'}}>🗑</button>
                    </div>
                    <div style={{flex:1,overflowY:'auto',padding:'14px',display:'flex',flexDirection:'column',gap:9,minHeight:260,maxHeight:isMobile?'48vh':undefined}}>
                      {adminChatMsgs.length===0
                        ? <div style={{margin:'auto',color:'rgba(255,255,255,0.3)',fontSize:13}}>Niciun mesaj încă</div>
                        : adminChatMsgs.map(m=>(
                          <div key={m._key||m.ts} style={{alignSelf:m.from==='admin'?'flex-end':'flex-start',maxWidth:'80%'}}>
                            <div style={{padding:'8px 12px',borderRadius:12,fontSize:13,lineHeight:1.5,wordBreak:'break-word',background:m.from==='admin'?gold:'rgba(255,255,255,0.08)',color:m.from==='admin'?'#1a1a2e':'#fff',borderBottomRightRadius:m.from==='admin'?3:12,borderBottomLeftRadius:m.from==='admin'?12:3}}>{m.text}</div>
                            <div style={{fontSize:10,color:'rgba(255,255,255,0.3)',marginTop:2,textAlign:m.from==='admin'?'right':'left'}}>{m.from==='admin'?'Tu':'Blogger'}{m.timestamp?(' · '+m.timestamp):''}</div>
                          </div>
                        ))
                      }
                    </div>
                    <div style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.06)',display:'flex',gap:8}}>
                      <input value={adminChatInput} onChange={e=>setAdminChatInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendAdminMsg()}}}
                        placeholder="Scrie un răspuns..." style={{flex:1,padding:'10px 14px',fontSize:13,border:'1px solid rgba(255,255,255,0.1)',borderRadius:20,outline:'none',fontFamily:'inherit',background:'rgba(255,255,255,0.05)',color:'#fff',boxSizing:'border-box'}}/>
                      <button onClick={sendAdminMsg} disabled={!adminChatInput.trim()} style={{padding:'10px 18px',fontSize:13,fontWeight:700,border:'none',borderRadius:20,cursor:adminChatInput.trim()?'pointer':'default',background:gold,color:'#1a1a2e',opacity:adminChatInput.trim()?1:0.5,flexShrink:0}}>Trimite</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: ACTUALIZARE STATS ── */}
      {tab==='update' && (
        <div>
          <h3 style={{color:gold,marginBottom:'1rem',fontSize:16}}>Actualizare statistici per cazinou</h3>
          <div style={{display:'flex',gap:8,marginBottom:'1.5rem',flexWrap:'wrap'}}>
            {bloggers.map(b => (
              <button key={b.username} onClick={() => setUpdateBlogger(b)}
                style={{padding:'8px 16px',fontSize:13,fontWeight:600,cursor:'pointer',border:`1px solid ${updateBlogger?.username===b.username?gold:'rgba(255,255,255,0.1)'}`,borderRadius:8,background:updateBlogger?.username===b.username?'rgba(245,166,35,0.15)':'none',color:updateBlogger?.username===b.username?gold:'rgba(255,255,255,0.5)'}}>
                {b.name}
              </button>
            ))}
          </div>

          {updateBlogger ? (
            <div>
              <div style={{marginBottom:16,display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:36,height:36,borderRadius:'50%',background:'rgba(245,166,35,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:gold}}>{updateBlogger.name[0]}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:15}}>{updateBlogger.name}</div>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>@{updateBlogger.username} · {updateBlogger.platform}</div>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                {CASINOS_LIST.map(casino => {
                  const s = casinoStatsEdit[casino.id] || {clicks:0,regs:0,deposits:0,revenue:0,commission:0}
                  const commPct = { melbet:25, xbet:25, mostbet:25, spinbetter:25, betwinner:25, onewin:25, vavada:25, parimatch:25 }[casino.id] || 25
                  return (
                    <div key={casino.id} style={{background:'rgba(255,255,255,0.02)',border:`1px solid ${casino.color}25`,borderRadius:12,padding:'1rem',borderLeft:`3px solid ${casino.color}`}}>
                      <div style={{fontSize:13,fontWeight:700,color:casino.color,marginBottom:12}}>{casino.name} · {commPct}% RevShare{s.updatedAt ? <span style={{marginLeft:10,fontSize:11,fontWeight:400,color:(Date.now()-s.updatedAt>7*86400000)?'#ef4444':'rgba(255,255,255,0.35)'}}>· actualizat {new Date(s.updatedAt).toLocaleDateString('ro-RO')}{(Date.now()-s.updatedAt>7*86400000)?' ⚠️':''}</span> : <span style={{marginLeft:10,fontSize:11,fontWeight:400,color:'rgba(255,255,255,0.3)'}}>· neactualizat încă</span>}</div>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:10}}>
                        {[['Clickuri','clicks'],['Înregistrări','regs'],['Depunători','deposits'],['Venit net ($)','revenue'],['Comision ($)','commission']].map(([label,field]) => (
                          <div key={field}>
                            <div style={{fontSize:10,color:'rgba(255,255,255,0.35)',marginBottom:3,textTransform:'uppercase'}}>{label}{field==='commission' ? ` · auto ${commPct}%` : ''}</div>
                            <input style={inp} type="number" value={(s[field]===0||s[field]==null)?'':s[field]}
                              onChange={e => {
                                const val = e.target.value === '' ? 0 : +e.target.value
                                setCasinoStatsEdit(prev => {
                                  const cur = { ...(prev[casino.id]||{}), [field]: val }
                                  // când se schimbă venitul, recalculăm automat comisionul (RevShare%)
                                  if (field==='revenue') cur.commission = Math.round(val * commPct / 100)
                                  return { ...prev, [casino.id]: cur }
                                })
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <div style={{marginTop:10}}>
                        <div style={{fontSize:10,color:'rgba(255,255,255,0.35)',marginBottom:3,textTransform:'uppercase'}}>🔗 Link de afiliere ({casino.name}) — îl vede bloggerul pe site</div>
                        <input style={inp} type="text" placeholder={`https://${casino.id}.com/?ref=...`} value={s.affLink||''}
                          onChange={e => setCasinoStatsEdit(prev => ({...prev, [casino.id]:{ ...(prev[casino.id]||{}), affLink:e.target.value }}))}
                        />
                      </div>
                      <div style={{marginTop:10,display:'flex',justifyContent:'flex-end',alignItems:'center',gap:10}}>
                        {saveMsg && <span style={{fontSize:12,color:'#10b981',fontWeight:700}}>{saveMsg}</span>}
                        <button onClick={() => saveCasinoStats(casino.id)}
                          style={{padding:'7px 18px',fontSize:12,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:casino.color,color:'#000'}}>
                          💾 Salvează în Firebase
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,0.3)',fontSize:13,fontStyle:'italic'}}>Selectează un blogger din lista de sus</div>
          )}

          <div style={{marginTop:16,padding:'12px 16px',background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:8,fontSize:13,color:'#10b981'}}>
            ✓ Datele se salvează direct în Firebase — bloggerul vede actualizarea în maxim 5 secunde.
          </div>
        </div>
      )}

      {/* ── TAB: PLĂȚI ── */}
      {tab==='payments' && (
        <div>
          <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(245,166,35,0.1)',borderRadius:12,padding:'1.25rem',marginBottom:'1rem'}}>
            <p style={{fontWeight:700,marginBottom:12}}>Bloggeri cu sold de plătit</p>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {bloggers.filter(b => payableOf(b)>0).map(b => {
                const datorat = payableOf(b)
                return (
                  <div key={b.username} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                    <div>
                      <span style={{fontWeight:600}}>{b.name}</span>
                      <span style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginLeft:8}}>@{b.username}</span>
                      <span style={{fontSize:12,color:'rgba(255,255,255,0.3)',marginLeft:8}}>{b.payMethod||'Bitcoin'}</span>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:12}}>
                      <span style={{color:'#ef4444',fontWeight:700,fontSize:16}}>${datorat}</span>
                      <button onClick={() => {setPayModal(b);setPayAmount(datorat.toString())}} style={{padding:'6px 14px',fontSize:12,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:gold,color:'#000'}}>Procesează</button>
                    </div>
                  </div>
                )
              })}
              {bloggers.filter(b => payableOf(b)>0).length===0 && (
                <p style={{color:'rgba(255,255,255,0.3)',fontSize:13}}>Toți bloggerii sunt plătiți la zi ✓</p>
              )}
            </div>
          </div>
          <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(245,166,35,0.1)',borderRadius:12,padding:'1.25rem'}}>
            <p style={{fontWeight:700,marginBottom:12}}>Istoric plăți (sesiunea curentă)</p>
            {payments.length===0
              ? <p style={{color:'rgba(255,255,255,0.3)',fontSize:13}}>Nicio plată procesată încă</p>
              : (<table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}><thead><tr>{['Data','Blogger','Sumă'].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead><tbody>{[...payments].reverse().map(p=>(<tr key={p.id}><td style={td}>{p.date}</td><td style={td}>{p.name}</td><td style={{...td,color:'#10b981',fontWeight:600}}>${p.amount}</td></tr>))}</tbody></table>)
            }
          </div>
        </div>
      )}

      {/* ── TAB: NOTIFICĂRI ── */}
      {tab==='notif' && (
        <div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
            <h3 style={{color:gold,fontSize:16}}>Notificări ({notifications.length})</h3>
            <button onClick={()=>notifications.forEach(n=>!n.read&&n._key&&markRead(n._key))} style={{padding:'6px 14px',fontSize:12,cursor:'pointer',border:'1px solid rgba(245,166,35,0.3)',borderRadius:6,background:'none',color:gold}}>Marchează toate citite</button>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {notifications.length===0
              ? <div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,0.3)',fontSize:13}}>Nicio notificare</div>
              : notifications.map(n => (
                <div key={n.id} onClick={()=>n._key&&markRead(n._key)}
                  style={{padding:'12px 16px',borderRadius:10,background:n.read?'rgba(255,255,255,0.02)':'rgba(245,166,35,0.07)',border:`1px solid ${n.read?'rgba(255,255,255,0.05)':'rgba(245,166,35,0.15)'}`,cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <span style={{fontSize:13,fontWeight:n.read?400:600,color:n.read?'rgba(255,255,255,0.5)':'#fff'}}>{n.blogger} · {n.detail}</span>
                  </div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,0.3)',whiteSpace:'nowrap',marginLeft:16}}>{n.timestamp}</div>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* ── TAB: CERERI DE PLATĂ ── */}
      {tab==='payout-requests' && (
        <div>
          {payoutRequests.length === 0
            ? <div style={{ padding:40, textAlign:'center', color:C.textDim, fontSize:13, background:C.panel, borderRadius:14, border:`1px solid ${C.border}` }}>Nicio cerere de plată momentan</div>
            : (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[...payoutRequests].sort((a,b)=> (a.status==='pending'?-1:1) - (b.status==='pending'?-1:1)).map(r => {
                  const stColor = r.status==='pending'?gold : r.status==='paid'||r.status==='approved'?C.green : C.red
                  const stLabel = r.status==='pending'?'În așteptare' : r.status==='paid'?'Plătit' : r.status==='approved'?'Aprobat' : 'Respins'
                  return (
                    <div key={r.id} style={{ background:C.panel, border:`1px solid ${C.border}`, borderLeft:`3px solid ${stColor}`, borderRadius:14, padding:'1.25rem' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                        <div>
                          <div style={{ fontSize:15, fontWeight:700, color:'#fff' }}>{r.name} <span style={{ fontSize:12, color:gold, fontWeight:500 }}>@{r.username}</span></div>
                          <div style={{ display:'flex', gap:18, flexWrap:'wrap', marginTop:8 }}>
                            <div><div style={{ fontSize:10, textTransform:'uppercase', color:C.textFaint }}>Sumă cerută</div><div style={{ fontSize:20, fontWeight:800, color:gold }}>${Number(r.amount||0).toLocaleString()}</div></div>
                            <div><div style={{ fontSize:10, textTransform:'uppercase', color:C.textFaint }}>Metodă</div><div style={{ fontSize:14, color:C.text, marginTop:3 }}>{r.method || '—'}</div></div>
                            {r.detail && <div style={{ minWidth:0 }}><div style={{ fontSize:10, textTransform:'uppercase', color:C.textFaint }}>Adresă / detalii</div><div style={{ fontSize:13, color:C.text, marginTop:3, fontFamily:'monospace', wordBreak:'break-all' }}>{r.detail}</div></div>}
                          </div>
                          <div style={{ fontSize:11, color:C.textFaint, marginTop:8 }}>Cerut: {r.date}{r.resolvedAt && ` · Rezolvat: ${r.resolvedAt}`}</div>
                        </div>
                        <span style={{ background:`${stColor}22`, color:stColor, padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:700, whiteSpace:'nowrap' }}>{stLabel}</span>
                      </div>
                      {r.status==='pending' && (
                        <div style={{ display:'flex', gap:10, marginTop:14, borderTop:`1px solid ${C.border}`, paddingTop:14 }}>
                          <button onClick={() => { const b = bloggers.find(x=>x.username===r.username); if(b){ setPayModal(b); setPayAmount(String(r.amount||payableOf(b))); setPayReqKey(r._key) } else { window.alert('Bloggerul @'+r.username+' nu a fost găsit — plata nu poate fi procesată.') } }} style={{ flex:1, padding:'10px', fontSize:13, fontWeight:700, cursor:'pointer', border:'none', borderRadius:8, background:C.green, color:'#fff' }}>✓ Marchează plătit & procesează</button>
                          <button onClick={() => { if(confirm('Respingi cererea de plată?')) updatePayoutRequest(r._key, 'rejected') }} style={{ flex:1, padding:'10px', fontSize:13, fontWeight:700, cursor:'pointer', border:`1px solid rgba(239,68,68,0.4)`, borderRadius:8, background:'transparent', color:C.red }}>✗ Respinge</button>
                        </div>
                      )}
                      <div style={{ marginTop:14, borderTop:`1px solid ${C.border}`, paddingTop:12, textAlign:'right' }}>
                        <button onClick={() => { if(!window.confirm('Ștergi cererea de plată a lui '+r.name+'?')) return; deletePayoutRequest(r._key) }} style={{ padding:'6px 12px', fontSize:12, cursor:'pointer', border:'1px solid rgba(239,68,68,0.3)', borderRadius:6, background:'none', color:'#ef4444' }}>🗑 Șterge</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          }
        </div>
      )}

      {/* MODAL PLATĂ */}
      {payModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200}} onClick={()=>{setPayModal(null);setPayReqKey(null)}}>
          <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:16,padding:'1.5rem',width: isMobile ? '90vw' : 380, maxWidth:'95vw'}} onClick={e=>e.stopPropagation()}>
            <h3 style={{color:'#fff',fontWeight:700,marginBottom:4}}>Procesează plată</h3>
            <p style={{color:C.textDim,fontSize:13,marginBottom:4}}>Blogger: <strong style={{color:'#fff'}}>{payModal.name}</strong></p>
            <p style={{color:C.textDim,fontSize:12,marginBottom:16}}>Metodă: {payModal.payMethod||'Bitcoin'} · {payModal.payAddress||'adresă nesetată'}</p>
            <div style={{fontSize:12,color:C.textDim,marginBottom:4}}>Sumă ($)</div>
            <input style={{...inp,marginBottom:16}} type="number" value={payAmount} onChange={e=>setPayAmount(e.target.value)}/>
            <button style={{width:'100%',padding:'11px',fontSize:14,fontWeight:700,cursor:'pointer',border:'none',borderRadius:8,background:gold,color:'#000'}} onClick={processPay}>Confirmă plata</button>
            <button style={{width:'100%',padding:'9px',fontSize:13,cursor:'pointer',border:`1px solid ${C.border}`,borderRadius:8,background:'none',color:C.textDim,marginTop:8}} onClick={()=>{setPayModal(null);setPayReqKey(null)}}>Anulează</button>
          </div>
        </div>
      )}

      </main>
    </div>
  )
}
