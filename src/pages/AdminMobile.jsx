import { useState, useEffect } from 'react'
import { _p } from '../cfg.js'
import {
  getBloggers, setBlogger, updateBloggerFields, deleteBlogger,
  getApplications, updateApplication, deleteApplication,
  getPromoCodes, addPromoCode,
  getCasinoStats, setCasinoStats,
  addNotification,
  subscribeApplications, subscribeBloggers, subscribeNotifications,
  getNotifications, markRead,
  subscribeAllConversations, subscribeConversation, sendMessage, markConversationRead, deleteConversation,
} from '../db.js'

const gold = '#f5a623'
const bg = '#0a0a0f'
const card = '#13131f'
const bdr = 'rgba(255,255,255,0.07)'
const green = '#10b981'
const red = '#ef4444'

const CASINOS = [
  { id:'melbet',     name:'Melbet',        color:gold },
  { id:'xbet',       name:'1xBet',         color:'#1565c0' },
  { id:'mostbet',    name:'Mostbet',       color:green },
  { id:'spinbetter', name:'SpinBetter',    color:'#7c3aed' },
  { id:'betwinner', name:'BetWinner', color:'#84cc16' },
]

// ── Butoane mari pentru touch ──
const Btn = ({ label, color='#333', textColor='#fff', onClick, small }) => (
  <button onClick={onClick} style={{
    width: small ? 'auto' : '100%',
    padding: small ? '8px 16px' : '14px',
    background: color, color: textColor,
    border: 'none', borderRadius: 10,
    fontSize: small ? 13 : 15, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'Inter,sans-serif',
    WebkitTapHighlightColor: 'transparent',
  }}>{label}</button>
)

const Card = ({ children, style }) => (
  <div style={{ background: card, border: `1px solid ${bdr}`, borderRadius: 14, padding: '14px', marginBottom: 10, ...style }}>
    {children}
  </div>
)

const Badge = ({ text, color }) => (
  <span style={{ background: color + '22', color, padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{text}</span>
)

const Input = ({ value, onChange, placeholder, type='text' }) => (
  <input
    type={type} value={value} onChange={onChange} placeholder={placeholder}
    style={{
      width: '100%', padding: '11px 12px', fontSize: 14,
      background: 'rgba(255,255,255,0.05)', border: `1px solid ${bdr}`,
      borderRadius: 8, color: '#e2e8f0', outline: 'none',
      fontFamily: 'Inter,sans-serif', boxSizing: 'border-box',
    }}
  />
)

// ════════════════════════════════════════════════
export default function AdminMobile() {
  const [auth, setAuth] = useState(false)
  const [pass, setPass] = useState('')
  const [passErr, setPassErr] = useState(false)
  const [tab, setTab] = useState('home')
  const [toast, setToast] = useState('')

  // Date
  const [apps, setApps] = useState([])
  const [bloggers, setBloggers] = useState([])
  const [notifications, setNotifications] = useState([])
  const [promoCodes, setPromoCodes] = useState({ melbet:[], xbet:[], mostbet:[], spinbetter:[], betwinner:[] })

  // UI state
  const [selBlogger, setSelBlogger] = useState(null)
  const [selCasino, setSelCasino] = useState('melbet')
  const [statsForm, setStatsForm] = useState({ clicks:'', regs:'', deposits:'', revenue:'', commission:'' })
  const [newCode, setNewCode] = useState('')
  const [selCodeCasino, setSelCodeCasino] = useState('melbet')
  // Chat
  const [conversations, setConversations] = useState([])
  const [chatBlogger, setChatBlogger] = useState(null)
  const [chatMsgs, setChatMsgs] = useState([])
  const [chatInput, setChatInput] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  useEffect(() => {
    if (!auth) return
    const u1 = subscribeApplications(setApps)
    const u2 = subscribeBloggers(setBloggers)
    const u3 = subscribeNotifications(setNotifications)
    const u4 = subscribeAllConversations(setConversations)
    getPromoCodes().then(setPromoCodes)
    return () => { u1?.(); u2?.(); u3?.(); u4?.() }
  }, [auth])

  useEffect(() => {
    if (!chatBlogger) { setChatMsgs([]); return }
    const unsub = subscribeConversation(chatBlogger, setChatMsgs)
    return unsub
  }, [chatBlogger])
  useEffect(() => {
    if (chatBlogger && chatMsgs.some(m => m.from === 'blogger' && !m.read)) {
      markConversationRead(chatBlogger, 'admin')
    }
  }, [chatBlogger, chatMsgs])
  const chatUnread = conversations.reduce((s,c) => s+(c.unread||0), 0)
  const sendChatReply = async () => {
    const t = chatInput.trim()
    if (!t || !chatBlogger) return
    setChatInput('')
    setChatMsgs(prev => [...prev, { from:'admin', text:t, ts:Date.now(), read:false, _key:'tmp'+Date.now() }])
    await sendMessage(chatBlogger, 'admin', t)
  }

  // Login
  if (!auth) return (
    <div style={{ minHeight:'100vh', background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter,sans-serif', padding:24 }}>
      <div style={{ width:'100%', maxWidth:340 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:28, fontWeight:900, color:'#fff', letterSpacing:1 }}>WIN<span style={{color:gold}}>PARTNERS</span></div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginTop:4 }}>Admin Mobile</div>
        </div>
        <Card>
          <div style={{ marginBottom:12 }}>
            <Input
              type="password" value={pass}
              onChange={e => { setPass(e.target.value); setPassErr(false) }}
              placeholder="Parola admin"
            />
            {passErr && <div style={{ color:red, fontSize:12, marginTop:6 }}>Parolă incorectă</div>}
          </div>
          <Btn label="INTRĂ" color={gold} textColor="#000"
            onClick={() => {
              if (pass === _p) { setAuth(true) }
              else { setPassErr(true); setPass('') }
            }}
          />
        </Card>
      </div>
    </div>
  )

  const pendingApps = apps.filter(a => a.status === 'pending')
  const unread = notifications.filter(n => !n.read).length
  const totalCodes = Object.values(promoCodes).flat().filter(c => c.status === 'available').length

  // ── Aprobă cerere ──
  const approveApp = async (app) => {
    await updateApplication(app._key, 'approved')
    const blogger = {
      id: app.username, name: app.name, username: app.username,
      platform: app.platform, country: app.country || 'Moldova',
      phone: app.phone || '', email: app.email || '',
      status: 'active', commission: 25,
      clicks:0, regs:0, deposits:0, revenue:0, paid:0,
      pass: app.username + '2026',
      payMethod: app.payMethod || 'Bitcoin', payAddress: app.payAddress || '',
    }
    // Referral: păstrăm legătura de invitație dacă există cod
    const _ref = (app.refCode || app.inviteCode || '').trim()
    if (_ref) blogger.invitedBy = _ref
    await setBlogger(blogger)
    await addNotification({ type:'new_blogger', blogger: app.name, detail: 'Aprobat · parolă: ' + blogger.pass })
    showToast('✅ ' + app.name + ' aprobat!')
  }

  const rejectApp = async (app) => {
    await updateApplication(app._key, 'rejected')
    showToast('❌ ' + app.name + ' respins')
  }

  const deleteBloggerFn = async (b) => {
    if (!confirm(`Ștergi definitiv "${b.name}" (@${b.username})? Acțiunea nu poate fi anulată.`)) return
    setBloggers(prev => prev.filter(x => x.username !== b.username))
    const ok = await deleteBlogger(b.username)
    showToast(ok ? '🗑 ' + b.name + ' șters' : '⚠️ Ștergere eșuată')
  }

  // ── Salvează stats ──
  const saveStats = async () => {
    if (!selBlogger) return
    const commPct = { melbet:25, xbet:40, mostbet:60, spinbetter:50, betwinner:25, onewin:50, vavada:50, parimatch:45 }[selCasino] || 25
    const s = {
      clicks: Number(statsForm.clicks) || 0,
      regs: Number(statsForm.regs) || 0,
      deposits: Number(statsForm.deposits) || 0,
      revenue: Number(statsForm.revenue) || 0,
      commission: Number(statsForm.commission) || Math.round((Number(statsForm.revenue)||0) * commPct / 100),
    }
    await setCasinoStats(selBlogger.username, selCasino, s)
    // Sursă unică de adevăr: comisionul total al bloggerului = suma comisioanelor pe toate cazinourile
    const allStats = (await getCasinoStats(selBlogger.username)) || {}
    const merged = { ...allStats, [selCasino]: s }
    const earned = Math.round(Object.values(merged).reduce((a,cs)=>a+(Number(cs&&cs.commission)||0),0))
    const revenueTotal = Math.round(Object.values(merged).reduce((a,cs)=>a+(Number(cs&&cs.revenue)||0),0))
    await updateBloggerFields(selBlogger.username, { earned, revenue: revenueTotal })
    setSelBlogger({ ...selBlogger, earned, revenue: revenueTotal })
    setBloggers(prev => prev.map(b => b.username===selBlogger.username ? { ...b, earned, revenue: revenueTotal } : b))
    await addNotification({ type:'stats_update', blogger: selBlogger.username, detail: CASINOS.find(c=>c.id===selCasino)?.name + ' actualizat' })
    showToast('✅ Stats salvate în Firebase!')
  }

  // ── Adaugă cod ──
  const addCode = async () => {
    if (!newCode.trim()) return
    const existing = promoCodes[selCodeCasino] || []
    if (existing.find(c => c.code === newCode.trim())) { showToast('⚠️ Codul există deja'); return }
    const updated = { ...promoCodes, [selCodeCasino]: [...existing, { code: newCode.trim(), status:'available', blogger:'', assignedAt:'' }] }
    await addPromoCode(selCodeCasino, newCode.trim())
    setPromoCodes(updated)
    setNewCode('')
    showToast('✅ Cod adăugat!')
  }

  // ════ TABS ════
  const TABS = [
    { id:'home', icon:'🏠', label:'Acasă' },
    { id:'apps', icon:'📋', label:'Cereri', badge: pendingApps.length },
    { id:'stats', icon:'📊', label:'Stats' },
    { id:'codes', icon:'🎟️', label:'Coduri' },
    { id:'chat', icon:'💬', label:'Mesaje', badge: chatUnread },
    { id:'notif', icon:'🔔', label:'Notif', badge: unread },
  ]

  return (
    <div style={{ minHeight:'100vh', background:bg, fontFamily:'Inter,sans-serif', color:'#e2e8f0', paddingBottom:70 }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position:'fixed', top:16, left:16, right:16, zIndex:999,
          background:'#1e1e30', border:`1px solid ${gold}44`,
          borderRadius:12, padding:'12px 16px',
          fontSize:14, fontWeight:600, color:'#fff', textAlign:'center',
          boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
        }}>{toast}</div>
      )}

      {/* Content */}
      <div style={{ padding:'16px 14px 0' }}>

        {/* ── HOME ── */}
        {tab === 'home' && <>
          <div style={{ fontSize:18, fontWeight:900, color:'#fff', marginBottom:16 }}>
            WIN<span style={{color:gold}}>PARTNERS</span>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginLeft:8, fontWeight:400 }}>Admin</span>
          </div>

          {/* Stats cards */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
            {[
              { label:'Bloggeri activi', value: bloggers.filter(b=>b.status==='active').length, color:green },
              { label:'Cereri noi', value: pendingApps.length, color: pendingApps.length > 0 ? gold : 'rgba(255,255,255,0.4)' },
              { label:'Coduri disponibile', value: totalCodes, color:'#3b82f6' },
              { label:'Notificări', value: unread, color: unread > 0 ? red : 'rgba(255,255,255,0.4)' },
            ].map(s => (
              <Card key={s.label} style={{ marginBottom:0 }}>
                <div style={{ fontSize:28, fontWeight:900, color:s.color }}>{s.value}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:2 }}>{s.label}</div>
              </Card>
            ))}
          </div>

          {/* Bloggeri lista */}
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>Bloggeri</div>
          {bloggers.map(b => (
            <Card key={b.username}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:15 }}>{b.name}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>@{b.username} · {b.platform}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <Badge text={b.status} color={b.status==='active' ? green : gold} />
                  <button onClick={() => deleteBloggerFn(b)} style={{ padding:'4px 9px', fontSize:13, cursor:'pointer', border:'1px solid rgba(239,68,68,0.4)', borderRadius:6, background:'transparent', color:'#ef4444' }}>🗑</button>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6, marginTop:10 }}>
                {[
                  { l:'Regs', v: b.regs || 0 },
                  { l:'Venit', v: '$'+(b.revenue||0) },
                  { l:'Parolă', v: b.pass || '-' },
                ].map(s => (
                  <div key={s.l} style={{ background:'rgba(255,255,255,0.03)', borderRadius:8, padding:'6px 8px', textAlign:'center' }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{s.v}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </>}

        {/* ── CERERI ── */}
        {tab === 'apps' && <>
          <div style={{ fontSize:16, fontWeight:900, color:'#fff', marginBottom:14 }}>
            Cereri de înregistrare
            {pendingApps.length > 0 && <Badge text={pendingApps.length + ' noi'} color={gold} />}
          </div>

          {apps.length === 0 && (
            <Card><div style={{ textAlign:'center', color:'rgba(255,255,255,0.3)', padding:'20px 0' }}>Nicio cerere încă</div></Card>
          )}

          {apps.map(app => (
            <Card key={app.id} style={{ borderColor: app.status==='pending' ? gold+'44' : app.status==='approved' ? green+'44' : red+'44' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:15 }}>{app.name}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>@{app.username}</div>
                </div>
                <Badge
                  text={app.status}
                  color={app.status==='pending' ? gold : app.status==='approved' ? green : red}
                />
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:10 }}>
                {[
                  { l:'Platformă', v: app.platform },
                  { l:'Urmăritori', v: Number(app.followers||0).toLocaleString() },
                  { l:'Țară', v: app.country || 'Moldova' },
                  { l:'Plată', v: app.payMethod || '-' },
                ].map(s => (
                  <div key={s.l} style={{ fontSize:12 }}>
                    <span style={{ color:'rgba(255,255,255,0.3)' }}>{s.l}: </span>
                    <span style={{ color:'#fff', fontWeight:600 }}>{s.v}</span>
                  </div>
                ))}
              </div>

              {(() => {
                const raw = (app.profileLink || '').trim()
                const href = raw && !/^https?:\/\//i.test(raw) ? 'https://' + raw : raw
                return href
                  ? <a href={href} target="_blank" rel="noopener noreferrer" style={{ display:'block', background:gold+'18', border:`1px solid ${gold}55`, borderRadius:8, padding:'10px 12px', marginBottom:8, textDecoration:'none', color:gold, fontWeight:700, fontSize:13, wordBreak:'break-all' }}>🔗 Deschide profilul {app.platform} ↗<div style={{ fontSize:11, fontWeight:400, color:'rgba(255,255,255,0.5)', marginTop:2 }}>{raw}</div></a>
                  : <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'10px 12px', marginBottom:8, color:'#f87171', fontSize:12 }}>⚠️ Fără link de profil — verifică pe Telegram</div>
              })()}
              {app.email && <div style={{ fontSize:12, marginBottom:4 }}>📧 <a href={`mailto:${app.email}`} style={{ color:'#60a5fa', textDecoration:'none' }}>{app.email}</a></div>}
              {app.phone && <div style={{ fontSize:12, marginBottom:4 }}>✈️ <a href={app.phone.trim().startsWith('@') ? 'https://t.me/'+app.phone.trim().slice(1) : app.phone} target="_blank" rel="noopener noreferrer" style={{ color:'#60a5fa', textDecoration:'none' }}>{app.phone} ↗</a></div>}
              {app.aboutYou && <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontStyle:'italic', marginBottom:10 }}>"{app.aboutYou}"</div>}

              {app.status === 'pending' && (
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:4 }}>
                  <Btn label="✓ Aprobă" color={green} onClick={() => approveApp(app)} />
                  <Btn label="✗ Respinge" color={red} onClick={() => rejectApp(app)} />
                </div>
              )}
              <Btn label="🗑 Șterge cererea" color={red} onClick={() => { if(window.confirm('Ștergi cererea lui '+app.name+'?')){ setApps(prev=>prev.filter(a=>a._key!==app._key)); deleteApplication(app._key) } }} />
            </Card>
          ))}
        </>}

        {/* ── STATS ── */}
        {tab === 'stats' && <>
          <div style={{ fontSize:16, fontWeight:900, color:'#fff', marginBottom:14 }}>Actualizare statistici</div>

          {/* Selectează blogger */}
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', marginBottom:6 }}>Blogger</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:14 }}>
            {bloggers.map(b => (
              <button key={b.username} onClick={() => setSelBlogger(b)} style={{
                padding:'8px 14px', fontSize:13, fontWeight:600, cursor:'pointer',
                border:`2px solid ${selBlogger?.username === b.username ? gold : bdr}`,
                borderRadius:20, background: selBlogger?.username === b.username ? gold+'22' : 'transparent',
                color: selBlogger?.username === b.username ? gold : 'rgba(255,255,255,0.6)',
                fontFamily:'Inter,sans-serif',
              }}>{b.name}</button>
            ))}
          </div>

          {/* Selectează cazinou */}
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', marginBottom:6 }}>Cazinou</div>
          <div style={{ display:'flex', gap:8, marginBottom:14, overflowX:'auto', paddingBottom:4 }}>
            {CASINOS.map(c => (
              <button key={c.id} onClick={() => setSelCasino(c.id)} style={{
                padding:'8px 14px', fontSize:13, fontWeight:600, cursor:'pointer', flexShrink:0,
                border:`2px solid ${selCasino === c.id ? c.color : bdr}`,
                borderRadius:20, background: selCasino === c.id ? c.color+'22' : 'transparent',
                color: selCasino === c.id ? c.color : 'rgba(255,255,255,0.6)',
                fontFamily:'Inter,sans-serif',
              }}>{c.name}</button>
            ))}
          </div>

          {selBlogger ? <>
            <Card style={{ borderColor: CASINOS.find(c=>c.id===selCasino)?.color + '44' }}>
              <div style={{ fontSize:13, fontWeight:700, color: CASINOS.find(c=>c.id===selCasino)?.color, marginBottom:12 }}>
                {selBlogger.name} · {CASINOS.find(c=>c.id===selCasino)?.name}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
                {[
                  { key:'clicks', label:'Clickuri' },
                  { key:'regs', label:'Înregistrări' },
                  { key:'deposits', label:'Depunători' },
                  { key:'revenue', label:'Venit net ($)' },
                ].map(f => (
                  <div key={f.key}>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>{f.label}</div>
                    <Input
                      type="number" value={statsForm[f.key]}
                      onChange={e => setStatsForm(p => ({...p, [f.key]: e.target.value}))}
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom:10 }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>Comision ($) — auto 25% dacă gol</div>
                <Input
                  type="number" value={statsForm.commission}
                  onChange={e => setStatsForm(p => ({...p, commission: e.target.value}))}
                  placeholder={Math.round((Number(statsForm.revenue)||0)*(({melbet:25,xbet:40,mostbet:60,spinbetter:50,betwinner:25,onewin:50,vavada:50,parimatch:45}[selCasino]||25)/100)) || '0'}
                />
              </div>
              <Btn label="💾 Salvează în Firebase" color={gold} textColor="#000" onClick={saveStats} />
            </Card>
          </> : (
            <Card><div style={{ color:'rgba(255,255,255,0.3)', textAlign:'center', padding:'16px 0' }}>Selectează un blogger mai sus</div></Card>
          )}
        </>}

        {/* ── CODURI ── */}
        {tab === 'codes' && <>
          <div style={{ fontSize:16, fontWeight:900, color:'#fff', marginBottom:14 }}>Promcoduri</div>

          {/* Rezumat */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
            {CASINOS.map(c => {
              const codes = promoCodes[c.id] || []
              const avail = codes.filter(x => x.status==='available').length
              return (
                <Card key={c.id} style={{ marginBottom:0 }}>
                  <div style={{ fontSize:22, fontWeight:900, color:c.color }}>{avail}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>{c.name} disponibile</div>
                </Card>
              )
            })}
          </div>

          {/* Adaugă cod nou */}
          <Card>
            <div style={{ fontSize:13, fontWeight:700, color:gold, marginBottom:10 }}>+ Adaugă cod nou</div>
            <div style={{ display:'flex', gap:8, marginBottom:10, overflowX:'auto', paddingBottom:4 }}>
              {CASINOS.map(c => (
                <button key={c.id} onClick={() => setSelCodeCasino(c.id)} style={{
                  padding:'6px 12px', fontSize:12, fontWeight:600, cursor:'pointer', flexShrink:0,
                  border:`2px solid ${selCodeCasino===c.id ? c.color : bdr}`,
                  borderRadius:20, background: selCodeCasino===c.id ? c.color+'22' : 'transparent',
                  color: selCodeCasino===c.id ? c.color : 'rgba(255,255,255,0.5)',
                  fontFamily:'Inter,sans-serif',
                }}>{c.name}</button>
              ))}
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <div style={{ flex:1 }}>
                <Input value={newCode} onChange={e => setNewCode(e.target.value)} placeholder="ex: ml_123456" />
              </div>
              <button onClick={addCode} style={{
                padding:'11px 16px', background:gold, color:'#000',
                border:'none', borderRadius:8, fontWeight:700, fontSize:14, cursor:'pointer',
                fontFamily:'Inter,sans-serif', whiteSpace:'nowrap',
              }}>Adaugă</button>
            </div>
          </Card>

          {/* Lista coduri per casino selectat */}
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', marginBottom:8 }}>
            {CASINOS.find(c=>c.id===selCodeCasino)?.name} — toate codurile
          </div>
          {(promoCodes[selCodeCasino] || []).map((c, i) => (
            <Card key={i} style={{ marginBottom:6, padding:'10px 12px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontFamily:'monospace', fontSize:14, color:'#fff' }}>{c.code}</span>
                <Badge text={c.status==='available' ? '✓ liber' : c.blogger || 'folosit'} color={c.status==='available' ? green : 'rgba(255,255,255,0.3)'} />
              </div>
              {c.blogger && <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:4 }}>→ {c.blogger} · {c.assignedAt}</div>}
            </Card>
          ))}
        </>}

        {/* ── MESAJE (chat) ── */}
        {tab === 'chat' && <>
          {!chatBlogger ? (
            <>
              <div style={{ fontSize:18, fontWeight:800, color:'#fff', marginBottom:14 }}>Mesaje</div>
              {conversations.length===0
                ? <div style={{textAlign:'center',color:'rgba(255,255,255,0.3)',fontSize:13,padding:30}}>Nicio conversație încă</div>
                : conversations.map(c=>{
                    const b = bloggers.find(x=>x.username===c.username)
                    return (
                      <div key={c.username} onClick={()=>setChatBlogger(c.username)} style={{background:card,border:`1px solid ${bdr}`,borderRadius:12,padding:'12px 14px',marginBottom:8,cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',gap:10}}>
                        <div style={{minWidth:0,flex:1}}>
                          <div style={{fontSize:14,fontWeight:700,color:'#fff'}}>{b?.name||c.username}</div>
                          <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginTop:2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.last.from==='admin'?'Tu: ':''}{c.last.text}</div>
                        </div>
                        {c.unread>0 && <span style={{background:red,color:'#fff',fontSize:11,fontWeight:700,minWidth:20,height:20,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 6px',flexShrink:0}}>{c.unread}</span>}
                      </div>
                    )
                  })
              }
            </>
          ) : (
            <div style={{display:'flex',flexDirection:'column',height:'calc(100vh - 160px)'}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                <button onClick={()=>setChatBlogger(null)} style={{background:'none',border:'none',color:gold,fontSize:22,cursor:'pointer',padding:0}}>←</button>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:'#fff'}}>{bloggers.find(x=>x.username===chatBlogger)?.name||chatBlogger}</div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>@{chatBlogger}</div>
                </div>
                <button onClick={()=>{ if(!window.confirm('Ștergi toată conversația cu @'+chatBlogger+'?')) return; deleteConversation(chatBlogger); setChatBlogger(null) }} title="Șterge conversația" style={{marginLeft:'auto',background:'none',border:'1px solid rgba(239,68,68,0.3)',borderRadius:6,color:'#ef4444',fontSize:13,cursor:'pointer',padding:'4px 10px'}}>🗑</button>
              </div>
              <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:8,paddingBottom:8}}>
                {chatMsgs.length===0
                  ? <div style={{margin:'auto',color:'rgba(255,255,255,0.3)',fontSize:13}}>Niciun mesaj încă</div>
                  : chatMsgs.map(m=>(
                    <div key={m._key||m.ts} style={{alignSelf:m.from==='admin'?'flex-end':'flex-start',maxWidth:'82%'}}>
                      <div style={{padding:'9px 13px',borderRadius:12,fontSize:13,lineHeight:1.5,wordBreak:'break-word',background:m.from==='admin'?gold:'rgba(255,255,255,0.08)',color:m.from==='admin'?'#1a1a2e':'#fff',borderBottomRightRadius:m.from==='admin'?3:12,borderBottomLeftRadius:m.from==='admin'?12:3}}>{m.text}</div>
                      <div style={{fontSize:10,color:'rgba(255,255,255,0.3)',marginTop:2,textAlign:m.from==='admin'?'right':'left'}}>{m.from==='admin'?'Tu':'Blogger'}{m.timestamp?(' · '+m.timestamp):''}</div>
                    </div>
                  ))
                }
              </div>
              <div style={{display:'flex',gap:8,paddingTop:8}}>
                <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();sendChatReply()}}}
                  placeholder="Scrie un răspuns..." style={{flex:1,padding:'11px 14px',fontSize:14,border:`1px solid ${bdr}`,borderRadius:20,outline:'none',fontFamily:'inherit',background:card,color:'#fff',boxSizing:'border-box'}}/>
                <button onClick={sendChatReply} disabled={!chatInput.trim()} style={{padding:'11px 16px',fontSize:16,fontWeight:700,border:'none',borderRadius:20,cursor:'pointer',background:gold,color:'#1a1a2e',opacity:chatInput.trim()?1:0.5,flexShrink:0}}>➤</button>
              </div>
            </div>
          )}
        </>}

        {/* ── NOTIFICĂRI ── */}
        {tab === 'notif' && <>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div style={{ fontSize:16, fontWeight:900, color:'#fff' }}>Notificări</div>
            {unread > 0 && (
              <button onClick={() => notifications.forEach(n => n._key && !n.read && markRead(n._key))} style={{
                fontSize:12, color:gold, background:'none', border:`1px solid ${gold}44`,
                borderRadius:20, padding:'4px 12px', cursor:'pointer', fontFamily:'Inter,sans-serif',
              }}>Marchează toate citite</button>
            )}
          </div>

          {notifications.length === 0 && (
            <Card><div style={{ textAlign:'center', color:'rgba(255,255,255,0.3)', padding:'20px 0' }}>Nicio notificare</div></Card>
          )}

          {notifications.map((n, i) => (
            <Card key={i} style={{
              borderColor: n.read ? bdr : gold+'55',
              background: n.read ? card : '#1a1a2e',
              marginBottom:8,
            }} onClick={() => n._key && markRead(n._key)}>
              <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                <span style={{ fontSize:20 }}>
                  {n.type==='new_blogger' ? '👤' : n.type==='stats_update' ? '📊' : n.type==='custom_request' ? '✨' : '🔔'}
                </span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:n.read ? 400 : 700, color: n.read ? 'rgba(255,255,255,0.6)' : '#fff' }}>
                    {n.blogger || n.type}
                  </div>
                  {n.detail && <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:2 }}>{n.detail}</div>}
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', marginTop:4 }}>{n.timestamp}</div>
                </div>
                {!n.read && <div style={{ width:8, height:8, borderRadius:'50%', background:gold, flexShrink:0, marginTop:4 }} />}
              </div>
            </Card>
          ))}
        </>}

      </div>

      {/* Bottom Nav */}
      <div style={{
        position:'fixed', bottom:0, left:0, right:0,
        background:'#0d0d1f', borderTop:`1px solid ${bdr}`,
        display:'flex', zIndex:100, paddingBottom:'env(safe-area-inset-bottom)',
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex:1, padding:'10px 0 8px', border:'none',
            background: tab===t.id ? gold+'11' : 'transparent',
            borderTop: `2px solid ${tab===t.id ? gold : 'transparent'}`,
            cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:2,
            WebkitTapHighlightColor:'transparent', position:'relative',
          }}>
            <span style={{ fontSize:20 }}>{t.icon}</span>
            <span style={{ fontSize:9, color: tab===t.id ? gold : 'rgba(255,255,255,0.35)', fontFamily:'Inter,sans-serif', fontWeight:600 }}>
              {t.label}
            </span>
            {t.badge > 0 && (
              <div style={{
                position:'absolute', top:6, right:'25%',
                background:red, color:'#fff', borderRadius:10,
                fontSize:9, fontWeight:700, padding:'1px 5px', minWidth:16, textAlign:'center',
              }}>{t.badge}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
