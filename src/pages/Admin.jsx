import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { _p } from '../cfg.js'
import {
  getBloggers, setBlogger, updateBloggerFields, subscribeBloggers,
  getCasinoStats, setCasinoStats,
  getPromoCodes, addPromoCode, subscribePromoCodes,
  getApplications, updateApplication, subscribeApplications,
  getNotifications, markRead, addNotification, subscribeNotifications,
  getCustomRequests, updateCustomRequest, subscribeCustomRequests,
  seedDatabase, isFirebaseEnabled,
} from '../db.js'

const gold = '#f5a623'
const PASS = _p

const CASINOS_LIST = [
  { id: 'melbet',    name: 'Melbet',    color: '#f5a623' },
  { id: 'winbet',    name: '1xBet',     color: '#3b82f6' },
  { id: 'spinmax',   name: 'Mostbet',   color: '#10b981' },
  { id: 'luckydeal', name: 'WinBet',    color: '#e63946' },
]

export default function Admin() {
  const [pass, setPass] = useState('')
  const [auth, setAuth] = useState(false)
  const [tab, setTab] = useState('bloggers')
  const [loading, setLoading] = useState(false)
  const [seedStatus, setSeedStatus] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  // Date din Firebase
  const [bloggers, setBloggers]         = useState([])
  const [promoCodes, setPromoCodes]     = useState({ melbet:[], winbet:[], spinmax:[], luckydeal:[] })
  const [applications, setApplications] = useState([])
  const [notifications, setNotifications] = useState([])
  const [customRequests, setCustomRequests] = useState([])

  // UI state
  const [editId, setEditId]     = useState(null)
  const [editData, setEditData] = useState({})
  const [showAdd, setShowAdd]   = useState(false)
  const [newB, setNewB]         = useState({ name:'', username:'', platform:'TikTok', country:'Moldova', phone:'', email:'', pass:'', commission:20 })
  const [payModal, setPayModal] = useState(null)
  const [payAmount, setPayAmount] = useState('')
  const [payments, setPayments] = useState([])
  const [selectedCasino, setSelectedCasino] = useState('melbet')
  const [newCodeInput, setNewCodeInput] = useState('')
  const [addCodeMode, setAddCodeMode] = useState(false)
  const [updateBlogger, setUpdateBlogger] = useState(null)
  const [showNotifPanel, setShowNotifPanel] = useState(false)
  const [casinoStatsEdit, setCasinoStatsEdit] = useState({})

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
    ]
    return () => unsubs.forEach(fn => fn && fn())
  }, [auth])

  // Când selectăm blogger pentru update — încărcăm stats
  useEffect(() => {
    if (!updateBlogger) return
    getCasinoStats(updateBlogger.username).then(setCasinoStatsEdit)
  }, [updateBlogger])

  const inp = { width:'100%', padding:'8px 12px', fontSize:13, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, background:'rgba(255,255,255,0.05)', color:'#e2e8f0', outline:'none', boxSizing:'border-box' }
  const th = { padding:'10px 14px', textAlign:'left', fontSize:11, color:'rgba(255,255,255,0.35)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.07em', background:'rgba(0,0,0,0.2)', whiteSpace:'nowrap' }
  const td = { padding:'10px 14px', fontSize:13, color:'rgba(255,255,255,0.75)', borderBottom:'1px solid rgba(255,255,255,0.04)', verticalAlign:'middle' }

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
              onKeyDown={e => e.key==='Enter' && pass===PASS && setAuth(true)}
            />
            <button
              style={{ width:'100%', padding:'10px', fontSize:14, fontWeight:700, cursor:'pointer', border:'none', borderRadius:6, background:gold, color:'#000' }}
              onClick={() => pass===PASS ? setAuth(true) : alert('Parolă incorectă!')}
            >INTRĂ</button>
          </div>
        </div>
      </div>
    )
  }

  const totalRevenue = bloggers.reduce((s,b) => s+(b.revenue||0), 0)
  const totalPaid    = bloggers.reduce((s,b) => s+(b.paid||0), 0)
  const totalPending = bloggers.reduce((s,b) => s+((b.revenue||0)*((b.commission||20)/100)-(b.paid||0)), 0)
  const unreadCount  = notifications.filter(n => !n.read).length
  const pendingApps  = applications.filter(a => a.status==='pending').length

  const saveEdit = async () => {
    await setBlogger(editData)
    setEditId(null)
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
    const newPaid = (payModal.paid||0) + amt
    await updateBloggerFields(payModal.username, { paid: newPaid })
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
    await updateApplication(app._key, 'approved')
    // Adaugă blogger în sistem
    const blogger = {
      id: app.username, name: app.name, username: app.username,
      platform: app.platform, country: app.country||'Moldova',
      phone: app.phone||'', email: app.email||'',
      status:'active', commission:25,
      clicks:0, regs:0, deposits:0, revenue:0, paid:0,
      pass: app.username + '2026',
      payMethod: app.payMethod||'Bitcoin', payAddress: app.payAddress||'',
    }
    await setBlogger(blogger)
    await addNotification({ type:'new_blogger', blogger: app.name, detail:'Cerere aprobată · parolă: '+blogger.pass })
    // Refresh imediat
    getApplications().then(setApplications)
    getBloggers().then(setBloggers)
  }

  const saveCasinoStats = async (casinoId) => {
    if (!updateBlogger) return
    const commPct = { melbet:25, winbet:25, spinmax:25, luckydeal:20 }[casinoId] || 25
    const s = casinoStatsEdit[casinoId] || {}
    if (!s.commission && s.revenue) s.commission = Math.round(s.revenue * commPct / 100)
    await setCasinoStats(updateBlogger.username, casinoId, s)
    await addNotification({ type:'stats_update', blogger: updateBlogger.username, detail: CASINOS_LIST.find(c=>c.id===casinoId)?.name + ' · statistici actualizate' })
    alert('✅ Salvat în Firebase!')
  }

  const runSeed = async () => {
    setSeedStatus('Se inițializează...')
    const result = await seedDatabase()
    setSeedStatus(result === 'seeded_ok' ? '✅ Date inițiale setate cu succes!' : '⚠️ Baza de date era deja inițializată')
    setTimeout(() => setSeedStatus(''), 4000)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0f', fontFamily:'Inter,sans-serif', color:'#e2e8f0', padding: isMobile ? '0.75rem' : '1.5rem', overflowX:'hidden' }}>
      {/* HEADER */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem', flexWrap:'wrap', gap:8 }}>
        <div style={{ fontSize: isMobile ? 16 : 20, fontWeight:900, color:'#fff' }}>
          WIN<span style={{ color:gold }}>PARTNERS</span>
          {!isMobile && <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginLeft:12, fontWeight:400 }}>Admin Panel · Firebase Sync</span>}
        </div>
        <div style={{ display:'flex', gap: isMobile ? 6 : 12, alignItems:'center' }}>
          {seedStatus && <span style={{ fontSize:11, color:'#10b981' }}>{seedStatus}</span>}
          {!isMobile && <button onClick={runSeed} style={{ padding:'6px 14px', fontSize:12, cursor:'pointer', border:'1px solid rgba(245,166,35,0.3)', borderRadius:6, background:'none', color:gold }}>
            🌱 Seed DB
          </button>}
          <button onClick={() => setShowNotifPanel(p => !p)} style={{ position:'relative', padding:'6px 12px', fontSize:12, cursor:'pointer', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, background:'none', color:'#e2e8f0' }}>
            🔔 {unreadCount > 0 && <span style={{ background:'#ef4444', color:'#fff', borderRadius:10, fontSize:10, padding:'1px 5px', position:'absolute', top:-6, right:-6 }}>{unreadCount}</span>}
          </button>
          {loading && <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>⏳</span>}
        </div>
      </div>

      {/* NOTIF PANEL */}
      {showNotifPanel && (
        <div style={{ position:'fixed', top: isMobile ? 0 : 60, right: isMobile ? 0 : 24, left: isMobile ? 0 : 'auto', width: isMobile ? '100%' : 380, maxHeight: isMobile ? '60vh' : 440, overflowY:'auto', background:'#0d0d1f', border:'1px solid rgba(245,166,35,0.2)', borderRadius: isMobile ? '0 0 12px 12px' : 12, padding:'1rem', zIndex:300 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <span style={{ fontWeight:700, fontSize:14 }}>Notificări</span>
            <button onClick={() => { notifications.forEach(n => !n.read && n._key && markRead(n._key)) }} style={{ fontSize:11, cursor:'pointer', border:'none', background:'none', color:gold }}>Marchează toate</button>
          </div>
          {notifications.length === 0 ? <p style={{ color:'rgba(255,255,255,0.3)', fontSize:13 }}>Nicio notificare</p> : notifications.slice(0,15).map(n => (
            <div key={n.id} onClick={() => n._key && markRead(n._key)} style={{ padding:'10px', borderRadius:8, marginBottom:6, background: n.read ? 'rgba(255,255,255,0.02)' : 'rgba(245,166,35,0.08)', border:'1px solid rgba(255,255,255,0.05)', cursor:'pointer' }}>
              <div style={{ fontSize:12, fontWeight:600, color: n.read ? 'rgba(255,255,255,0.5)' : '#fff' }}>{n.blogger} · {n.detail}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginTop:2 }}>{n.timestamp}</div>
            </div>
          ))}
        </div>
      )}

      {/* KPI CARDS */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:12, marginBottom:'1.5rem' }}>
        {[
          ['Bloggeri activi', bloggers.filter(b=>b.status==='active').length, '#10b981'],
          ['Venit total',     '$'+totalRevenue.toLocaleString(), gold],
          ['De plătit',       '$'+Math.round(totalPending).toLocaleString(), '#ef4444'],
          ['Coduri disponibile', Object.values(promoCodes).flat().filter(c=>c.status==='disponibil').length, '#a78bfa'],
          ['Aplicații noi',  pendingApps, '#3b82f6'],
        ].map(([l,v,c]) => (
          <div key={l} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(245,166,35,0.08)', borderRadius:12, padding:'1rem' }}>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:4 }}>{l}</div>
            <div style={{ fontSize:22, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={{ display:'flex', gap:0, borderBottom:'1px solid rgba(255,255,255,0.07)', marginBottom:'1.25rem', overflowX:'auto', WebkitOverflowScrolling:'touch', scrollbarWidth:'none' }}>
        {[
          ['applications','Aplicații (' + pendingApps + ')'],
          ['bloggers','Bloggeri'],
          ['promo','Promcoduri'],
          ['special','Coduri speciale'],
          ['update','Actualizare stats'],
          ['payments','Plăți'],
          ['notif','Notificări' + (unreadCount>0?' ('+unreadCount+')':'')],
        ].map(([id,lbl]) => (
          <button key={id} style={{ padding:'8px 12px', fontSize: isMobile ? 11 : 12, cursor:'pointer', border:'none', background:'none', color:tab===id?gold:'rgba(255,255,255,0.4)', borderBottom:tab===id?`2px solid ${gold}`:'2px solid transparent', marginBottom:-1, fontWeight:tab===id?700:400, whiteSpace:'nowrap', flexShrink:0 }}
            onClick={() => setTab(id)}>{lbl}</button>
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
                {applications.map(app => (
                  <div key={app.id} style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${app.status==='pending'?'rgba(59,130,246,0.3)':app.status==='approved'?'rgba(16,185,129,0.3)':'rgba(239,68,68,0.3)'}`, borderRadius:12, padding:'1.25rem' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                      <div>
                        <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>{app.name} <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>@{app.username}</span></div>
                        <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', display:'flex', gap:16, flexWrap:'wrap' }}>
                          <span>📱 {app.platform}</span>
                          <span>👥 {Number(app.followers||0).toLocaleString()} urmăritori</span>
                          <span>🌍 {app.country}</span>
                          <span>📧 {app.email}</span>
                          <span>📞 {app.phone}</span>
                        </div>
                        {app.aboutYou && <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:6, fontStyle:'italic' }}>"{app.aboutYou}"</div>}
                        <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:4 }}>{app.date}</div>
                      </div>
                      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                        <span style={{ background: app.status==='pending'?'#3b82f622':app.status==='approved'?'#10b98122':'#ef444422', color: app.status==='pending'?'#3b82f6':app.status==='approved'?'#10b981':'#ef4444', padding:'3px 10px', borderRadius:4, fontSize:11, fontWeight:700 }}>{app.status}</span>
                        {app.status==='pending' && (
                          <>
                            <button onClick={() => approveApp(app)} style={{ padding:'6px 14px', fontSize:12, fontWeight:700, cursor:'pointer', border:'none', borderRadius:6, background:'#10b981', color:'#fff' }}>✓ Aprobă</button>
                            <button onClick={() => updateApplication(app._key, 'rejected')} style={{ padding:'6px 14px', fontSize:12, fontWeight:700, cursor:'pointer', border:'none', borderRadius:6, background:'#ef4444', color:'#fff' }}>✗ Respinge</button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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

          <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(245,166,35,0.08)', borderRadius:12, overflow:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
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
                            <button onClick={()=>{setPayModal(b);setPayAmount(Math.max(0,Math.round((b.revenue||0)*((b.commission||20)/100)-(b.paid||0))).toString())}} style={{padding:'4px 10px',fontSize:11,cursor:'pointer',border:'1px solid rgba(16,185,129,0.3)',borderRadius:4,background:'none',color:'#10b981'}}>💰</button>
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
                <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, overflow:'auto' }}>
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
              <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:12,overflow:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                  <thead><tr>{['Data','Blogger','Casino','Cod solicitat','Status','Acțiuni'].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {customRequests.map(r => (
                      <tr key={r.id}>
                        <td style={{...td,fontSize:11,color:'rgba(255,255,255,0.4)'}}>{r.timestamp}</td>
                        <td style={td}>{r.blogger}</td>
                        <td style={td}>{r.casinoName}</td>
                        <td style={{...td,fontFamily:'monospace',color:gold,fontWeight:700}}>{r.requestedCode}</td>
                        <td style={td}><span style={{background:r.status==='pending'?'#f59e0b22':r.status==='approved'?'#10b98122':'#ef444422',color:r.status==='pending'?'#f59e0b':r.status==='approved'?'#10b981':'#ef4444',padding:'2px 8px',borderRadius:4,fontSize:11,fontWeight:700}}>{r.status}</span></td>
                        <td style={td}>
                          {r.status==='pending' && (
                            <div style={{display:'flex',gap:6}}>
                              <button onClick={()=>updateCustomRequest(r._key,'approved')} style={{padding:'4px 10px',fontSize:11,fontWeight:700,cursor:'pointer',border:'none',borderRadius:4,background:'#10b981',color:'#fff'}}>Aprobă</button>
                              <button onClick={()=>updateCustomRequest(r._key,'rejected')} style={{padding:'4px 10px',fontSize:11,fontWeight:700,cursor:'pointer',border:'none',borderRadius:4,background:'#ef4444',color:'#fff'}}>Respinge</button>
                            </div>
                          )}
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
                  const commPct = casino.id==='luckydeal'?20:25
                  return (
                    <div key={casino.id} style={{background:'rgba(255,255,255,0.02)',border:`1px solid ${casino.color}25`,borderRadius:12,padding:'1rem',borderLeft:`3px solid ${casino.color}`}}>
                      <div style={{fontSize:13,fontWeight:700,color:casino.color,marginBottom:12}}>{casino.name} · {commPct}% RevShare</div>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:10}}>
                        {[['Clickuri','clicks'],['Înregistrări','regs'],['Depunători','deposits'],['Venit net ($)','revenue'],['Comision ($)','commission']].map(([label,field]) => (
                          <div key={field}>
                            <div style={{fontSize:10,color:'rgba(255,255,255,0.35)',marginBottom:3,textTransform:'uppercase'}}>{label}</div>
                            <input style={inp} type="number" value={s[field]||0}
                              onChange={e => setCasinoStatsEdit(prev => ({...prev, [casino.id]:{ ...(prev[casino.id]||{}), [field]:+e.target.value }}))}
                            />
                          </div>
                        ))}
                      </div>
                      <div style={{marginTop:10,display:'flex',justifyContent:'flex-end'}}>
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
              {bloggers.filter(b => Math.round((b.revenue||0)*((b.commission||20)/100)-(b.paid||0))>0).map(b => {
                const datorat = Math.round((b.revenue||0)*((b.commission||20)/100)-(b.paid||0))
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
              {bloggers.filter(b => Math.round((b.revenue||0)*((b.commission||20)/100)-(b.paid||0))>0).length===0 && (
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

      {/* MODAL PLATĂ */}
      {payModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200}} onClick={()=>setPayModal(null)}>
          <div style={{background:'#0d0d1f',border:'1px solid rgba(255,255,255,0.1)',borderRadius:16,padding:'1.5rem',width: isMobile ? '90vw' : 380, maxWidth:'95vw'}} onClick={e=>e.stopPropagation()}>
            <h3 style={{color:'#fff',fontWeight:700,marginBottom:4}}>Procesează plată</h3>
            <p style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginBottom:4}}>Blogger: <strong style={{color:'#fff'}}>{payModal.name}</strong></p>
            <p style={{color:'rgba(255,255,255,0.4)',fontSize:12,marginBottom:16}}>Metodă: {payModal.payMethod||'Bitcoin'} · {payModal.payAddress||'adresă nesetată'}</p>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:4}}>Sumă ($)</div>
            <input style={{...inp,marginBottom:16}} type="number" value={payAmount} onChange={e=>setPayAmount(e.target.value)}/>
            <button style={{width:'100%',padding:'11px',fontSize:14,fontWeight:700,cursor:'pointer',border:'none',borderRadius:8,background:gold,color:'#000'}} onClick={processPay}>Confirmă plata</button>
            <button style={{width:'100%',padding:'9px',fontSize:13,cursor:'pointer',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,background:'none',color:'#94a3b8',marginTop:8}} onClick={()=>setPayModal(null)}>Anulează</button>
          </div>
        </div>
      )}
    </div>
  )
}
