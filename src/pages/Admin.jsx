import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { _p } from '../cfg.js'

const gold = '#f5a623'
const PASS = _p

const initBloggers = [
  {id:1,name:'Ion Popescu',username:'ionpopescu',platform:'TikTok',promoCode:'IONPOPESCU_WIN',country:'Moldova',phone:'+373601234',status:'active',clicks:1247,regs:89,deposits:34,revenue:1840,commission:20,paid:920},
  {id:2,name:'Alex Marin',username:'alexmarin',platform:'Instagram',promoCode:'ALEXMARIN_WIN',country:'România',phone:'+40721234',status:'active',clicks:856,regs:52,deposits:18,revenue:1120,commission:20,paid:560},
  {id:3,name:'Vlad Gaming',username:'vladgaming',platform:'YouTube',promoCode:'VLADGAMING_WIN',country:'Ucraina',phone:'+380671234',status:'pending',clicks:234,regs:12,deposits:3,revenue:180,commission:20,paid:0},
]

const CASINOS_LIST = [
  { id: 'melbet',    name: 'Melbet',    color: '#f5a623' },
  { id: 'winbet',    name: 'WinBet',    color: '#e63946' },
  { id: 'spinmax',   name: '1xBet',     color: '#3b82f6' },
  { id: 'luckydeal', name: 'Mostbet',   color: '#10b981' },
]

// Coduri REALE din Melbet Partners (generate 13.06.2026)
const initPromoCodes = {
  melbet: [
    {code:'ml_2738117', status:'disponibil', bloggerUsername:null, generatedAt:null, melbetId:'11035387'},
    {code:'ml_2796938', status:'disponibil', bloggerUsername:null, generatedAt:null, melbetId:'11180407'},
    {code:'ml_2796939', status:'disponibil', bloggerUsername:null, generatedAt:null, melbetId:'11180417'},
    {code:'ml_2796940', status:'disponibil', bloggerUsername:null, generatedAt:null, melbetId:'11180418'},
    {code:'ml_2796941', status:'disponibil', bloggerUsername:null, generatedAt:null, melbetId:'11180419'},
    {code:'ml_2796942', status:'disponibil', bloggerUsername:null, generatedAt:null, melbetId:'11180420'},
    {code:'ml_2796943', status:'disponibil', bloggerUsername:null, generatedAt:null, melbetId:'11180421'},
    {code:'ml_2796944', status:'disponibil', bloggerUsername:null, generatedAt:null, melbetId:'11180422'},
    {code:'ml_2796945', status:'disponibil', bloggerUsername:null, generatedAt:null, melbetId:'11180423'},
    {code:'ml_2796946', status:'disponibil', bloggerUsername:null, generatedAt:null, melbetId:'11180424'},
  ],
  winbet:    [],
  spinmax:   [],
  luckydeal: [],
}

export default function Admin() {
  const [pass, setPass] = useState('')
  const [auth, setAuth] = useState(false)
  const [tab, setTab] = useState('bloggers')
  const [bloggers, setBloggers] = useState(initBloggers)
  const [editId, setEditId] = useState(null)
  const [editData, setEditData] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [newB, setNewB] = useState({name:'',username:'',platform:'TikTok',promoCode:'',country:'Moldova',phone:'',commission:20})
  const [payModal, setPayModal] = useState(null)
  const [payAmount, setPayAmount] = useState('')
  const [promoCodes, setPromoCodes] = useState(initPromoCodes)
  const [selectedCasino, setSelectedCasino] = useState('winbet')
  const [newCodeInput, setNewCodeInput] = useState('')
  const [addCodeMode, setAddCodeMode] = useState(false)
  const [notifications, setNotifications] = useState([
    {id:1, type:'code_generated', blogger:'ionpopescu', casino:'WinBet Casino', code:'WIN004', timestamp:'02.06.2026 14:32', read:true},
    {id:2, type:'code_generated', blogger:'alexmarin', casino:'WinBet Casino', code:'WIN010', timestamp:'05.06.2026 09:15', read:true},
    {id:3, type:'code_generated', blogger:'ionpopescu', casino:'SpinMax Casino', code:'SPX007', timestamp:'03.06.2026 11:48', read:true},
    {id:4, type:'payment_request', blogger:'Alex Marin', detail:'Solicită plată $560', timestamp:'09.06.2026 16:22', read:false},
    {id:5, type:'new_blogger', blogger:'Vlad Gaming', detail:'Înregistrare nouă pe platformă', timestamp:'01.06.2026 08:05', read:false},
  ])
  const [showNotifPanel, setShowNotifPanel] = useState(false)
  const [payments, setPayments] = useState([])
  const [updateBlogger, setUpdateBlogger] = useState(null)
  const [requests, setRequests] = useState([
    {id:1,name:'Ion Popescu',type:'Cod personalizat',detail:'IONEL',date:'10.06.2026',status:'pending'},
    {id:2,name:'Alex Marin',type:'Plată',detail:'$560',date:'09.06.2026',status:'pending'},
  ])
  // Cereri coduri speciale din localStorage (trimise de bloggeri)
  const [customRequests, setCustomRequests] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wp_custom_requests') || '[]') } catch(e) { return [] }
  })
  // Coduri atribuite din localStorage
  const [assignedCodes, setAssignedCodes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wp_assigned_codes') || '{}') } catch(e) { return {} }
  })

  const approveCustomRequest = (reqId, approve) => {
    setCustomRequests(prev => {
      const updated = prev.map(r => r.id === reqId ? {...r, status: approve ? 'approved' : 'rejected'} : r)
      try { localStorage.setItem('wp_custom_requests', JSON.stringify(updated)) } catch(e) {}
      return updated
    })
    if (approve) {
      const req = customRequests.find(r => r.id === reqId)
      if (req) {
        // Adaugă notificare
        setNotifications(prev => [{
          id: Date.now(), type:'code_generated',
          blogger: req.blogger, casino: req.casinoName,
          code: req.requestedCode, timestamp: new Date().toLocaleString('ro-RO'), read:false
        }, ...prev])
      }
    }
  }

  const inp = {width:'100%',padding:'8px 12px',fontSize:13,border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,background:'rgba(255,255,255,0.05)',color:'#e2e8f0',outline:'none',boxSizing:'border-box'}

  if (!auth) {
    return (
      <div style={{minHeight:'100vh',background:'#0a0a0f',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif'}}>
        <div style={{textAlign:'center',maxWidth:360,width:'100%',padding:'2rem'}}>
          <div style={{fontSize:24,fontWeight:900,marginBottom:24,color:'#fff'}}>
            WIN<span style={{color:gold}}>PARTNERS</span>
          </div>
          <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(245,166,35,0.15)',borderRadius:12,padding:'2rem'}}>
            <h2 style={{fontSize:18,fontWeight:700,marginBottom:20,color:'#fff'}}>Acces Admin</h2>
            <input
              style={{...inp,marginBottom:12,textAlign:'center'}}
              type="password"
              placeholder="Parola admin"
              value={pass}
              onChange={e => setPass(e.target.value)}
              onKeyDown={e => e.key==='Enter' && pass===PASS && setAuth(true)}
            />
            <button
              style={{width:'100%',padding:'10px',fontSize:14,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:gold,color:'#000'}}
              onClick={() => pass===PASS ? setAuth(true) : alert('Parolă incorectă!')}
            >
              INTRĂ
            </button>
          </div>
        </div>
      </div>
    )
  }

  const totalRevenue = bloggers.reduce((s,b) => s+b.revenue, 0)
  const totalPaid = bloggers.reduce((s,b) => s+b.paid, 0)
  const totalPending = bloggers.reduce((s,b) => s+(b.revenue*(b.commission/100)-b.paid), 0)
  const activeBloggers = bloggers.filter(b => b.status==='active').length

  const saveEdit = () => {
    setBloggers(prev => prev.map(b => b.id===editId ? {...editData} : b))
    setEditId(null)
  }

  const addBlogger = () => {
    if (!newB.name || !newB.username) return
    setBloggers(prev => [...prev, {...newB, id:Date.now(), clicks:0, regs:0, deposits:0, revenue:0, paid:0, status:'active'}])
    setNewB({name:'',username:'',platform:'TikTok',promoCode:'',country:'Moldova',phone:'',commission:20})
    setShowAdd(false)
  }

  const processPay = () => {
    const amt = parseFloat(payAmount)
    if (!amt || !payModal) return
    setBloggers(prev => prev.map(b => b.id===payModal.id ? {...b, paid:b.paid+amt} : b))
    setPayments(prev => [...prev, {date:new Date().toLocaleDateString('ro-RO'), name:payModal.name, amount:amt, id:Date.now()}])
    setPayModal(null)
    setPayAmount('')
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => setNotifications(prev => prev.map(n => ({...n, read:true})))
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id===id ? {...n, read:true} : n))

  const exportCSV = (casinoId) => {
    const casino = CASINOS_LIST.find(c => c.id===casinoId)
    const codes = promoCodes[casinoId] || []
    const header = 'Cod,Status,Blogger,Data generarii'
    const rows = codes.map(e => `${e.code},${e.status},${e.bloggerUsername||''},${e.generatedAt||''}`)
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `promcoduri_${casino?.name?.replace(/ /g,'_')}_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const addNotificationEntry = (blogger, casino, code) => {
    const now = new Date()
    const ts = now.toLocaleDateString('ro-RO') + ' ' + now.toLocaleTimeString('ro-RO', {hour:'2-digit',minute:'2-digit'})
    setNotifications(prev => [{
      id: Date.now(),
      type: 'code_generated',
      blogger, casino, code,
      timestamp: ts,
      read: false
    }, ...prev])
  }

  const th = {textAlign:'left',padding:'9px 12px',color:'rgba(255,255,255,0.35)',fontWeight:400,borderBottom:'1px solid rgba(255,255,255,0.07)',fontSize:11,textTransform:'uppercase',letterSpacing:'.05em'}
  const td = {padding:'9px 12px',borderBottom:'1px solid rgba(255,255,255,0.04)',color:'#e2e8f0',fontSize:13}

  return (
    <div style={{background:'#0a0a0f',minHeight:'100vh',color:'#fff',fontFamily:'Inter,sans-serif'}}>
      <nav style={{background:'rgba(10,10,15,0.97)',borderBottom:'1px solid rgba(245,166,35,0.12)',padding:'0 2rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:60}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <span style={{fontSize:18,fontWeight:900}}>WIN<span style={{color:gold}}>PARTNERS</span></span>
          <span style={{fontSize:11,background:'rgba(245,166,35,0.15)',color:gold,padding:'2px 8px',borderRadius:4,fontWeight:700}}>ADMIN</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          {/* Notification Bell */}
          <div style={{position:'relative'}}>
            <button
              onClick={() => {setShowNotifPanel(p => !p); if(!showNotifPanel) markAllRead()}}
              style={{position:'relative',padding:'6px 10px',fontSize:13,cursor:'pointer',border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,background:'none',color:'#94a3b8',display:'flex',alignItems:'center',gap:6}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              {unreadCount > 0 && (
                <span style={{position:'absolute',top:-4,right:-4,background:'#ef4444',color:'#fff',borderRadius:10,fontSize:10,fontWeight:700,minWidth:16,height:16,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 4px'}}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Panel */}
            {showNotifPanel && (
              <div style={{position:'absolute',right:0,top:40,width:380,background:'#1a1a2e',border:'1px solid rgba(245,166,35,0.2)',borderRadius:12,boxShadow:'0 20px 60px rgba(0,0,0,0.5)',zIndex:100,overflow:'hidden'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                  <span style={{fontWeight:700,fontSize:14}}>Notificări</span>
                  <button onClick={markAllRead} style={{fontSize:11,color:'rgba(255,255,255,0.4)',cursor:'pointer',border:'none',background:'none'}}>Marchează toate citite</button>
                </div>
                <div style={{maxHeight:380,overflowY:'auto'}}>
                  {notifications.length === 0 ? (
                    <div style={{padding:'2rem',textAlign:'center',color:'rgba(255,255,255,0.3)',fontSize:13}}>Nu există notificări</div>
                  ) : notifications.map(n => (
                    <div key={n.id} onClick={() => markRead(n.id)}
                      style={{padding:'12px 16px',borderBottom:'1px solid rgba(255,255,255,0.04)',background:n.read?'transparent':'rgba(245,166,35,0.04)',cursor:'pointer',transition:'background .15s'}}>
                      <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
                        <div style={{width:32,height:32,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,
                          background:n.type==='code_generated'?'rgba(16,185,129,0.15)':n.type==='payment_request'?'rgba(245,166,35,0.15)':'rgba(59,130,246,0.15)'}}>
                          {n.type==='code_generated'?'🎟':n.type==='payment_request'?'💸':'👤'}
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          {n.type==='code_generated' && (
                            <>
                              <div style={{fontSize:13,color:'#e2e8f0',lineHeight:1.4}}>
                                <strong style={{color:'#93c5fd'}}>@{n.blogger}</strong> a generat codul <strong style={{color:'#10b981',fontFamily:'monospace'}}>{n.code}</strong> pentru {n.casino}
                              </div>
                            </>
                          )}
                          {n.type==='payment_request' && (
                            <div style={{fontSize:13,color:'#e2e8f0',lineHeight:1.4}}>
                              <strong style={{color:'#fbbf24'}}>{n.blogger}</strong>: {n.detail}
                            </div>
                          )}
                          {n.type==='new_blogger' && (
                            <div style={{fontSize:13,color:'#e2e8f0',lineHeight:1.4}}>
                              <strong style={{color:'#60a5fa'}}>{n.blogger}</strong>: {n.detail}
                            </div>
                          )}
                          <div style={{fontSize:11,color:'rgba(255,255,255,0.3)',marginTop:3}}>{n.timestamp}</div>
                        </div>
                        {!n.read && <div style={{width:7,height:7,borderRadius:'50%',background:'#ef4444',flexShrink:0,marginTop:4}}/>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button style={{padding:'6px 14px',fontSize:13,cursor:'pointer',border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,background:'none',color:'#94a3b8'}} onClick={() => setAuth(false)}>Logout</button>
        </div>
      </nav>

      <div style={{maxWidth:1200,margin:'0 auto',padding:'2rem 1.5rem'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:12,marginBottom:'1.5rem'}}>
          {[
            ['Bloggeri activi', activeBloggers, '#10b981'],
            ['Venit total', '$'+totalRevenue.toLocaleString(), gold],
            ['Plătit', '$'+totalPaid.toLocaleString(), '#f59e0b'],
            ['De plătit', '$'+Math.round(totalPending).toLocaleString(), '#ef4444'],
            ['Profit tău', '$'+Math.round(totalRevenue*0.05).toLocaleString(), gold],
            ['Coduri folosite', Object.values(promoCodes).flat().filter(c=>c.status==='folosit').length+' / '+Object.values(promoCodes).flat().length, '#a78bfa'],
          ].map(([l,v,c]) => (
            <div key={l} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(245,166,35,0.1)',borderRadius:12,padding:'1.25rem'}}>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>{l}</div>
              <div style={{fontSize:24,fontWeight:800,color:c}}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{display:'flex',gap:4,borderBottom:'1px solid rgba(255,255,255,0.07)',marginBottom:'1.5rem'}}>
          {[['bloggers','Bloggeri'],['promo','Promcoduri'],['special','Coduri speciale'],['update','Actualizare'],['requests','Cereri'],['payments','Plăți'],['notif','Notificări']].map(([id,lbl]) => (
            <button key={id} style={{padding:'8px 18px',fontSize:13,cursor:'pointer',border:'none',background:'none',color:tab===id?gold:'rgba(255,255,255,0.4)',borderBottom:tab===id?`2px solid ${gold}`:'2px solid transparent',marginBottom:-1,fontWeight:tab===id?700:400,display:'flex',alignItems:'center',gap:6}} onClick={() => setTab(id)}>
              {lbl}
              {id==='notif' && unreadCount>0 && <span style={{background:'#ef4444',color:'#fff',borderRadius:10,fontSize:10,fontWeight:700,padding:'1px 6px'}}>{unreadCount}</span>}
            </button>
          ))}
        </div>

        {tab==='promo' && (
          <div>
            {/* Casino selector */}
            <div style={{display:'flex',gap:8,marginBottom:'1.5rem',flexWrap:'wrap'}}>
              {CASINOS_LIST.map(casino => {
                const codes = promoCodes[casino.id] || []
                const disponibile = codes.filter(c => c.status==='disponibil').length
                const folosite = codes.filter(c => c.status==='folosit').length
                return (
                  <div key={casino.id}
                    onClick={() => { setSelectedCasino(casino.id); setAddCodeMode(false) }}
                    style={{flex:1,minWidth:200,background:selectedCasino===casino.id?'rgba(245,166,35,0.08)':'rgba(255,255,255,0.02)',border:selectedCasino===casino.id?`2px solid ${casino.color}`:'2px solid rgba(255,255,255,0.07)',borderRadius:12,padding:'1rem 1.25rem',cursor:'pointer',transition:'all .15s'}}>
                    <div style={{fontWeight:700,fontSize:15,marginBottom:6,color:selectedCasino===casino.id?casino.color:'#e2e8f0'}}>{casino.name}</div>
                    <div style={{display:'flex',gap:16}}>
                      <div><span style={{fontSize:22,fontWeight:800,color:'#10b981'}}>{disponibile}</span><div style={{fontSize:10,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'.06em'}}>Disponibile</div></div>
                      <div><span style={{fontSize:22,fontWeight:800,color:'#f59e0b'}}>{folosite}</span><div style={{fontSize:10,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'.06em'}}>Folosite</div></div>
                      <div><span style={{fontSize:22,fontWeight:800,color:'rgba(255,255,255,0.4)'}}>{codes.length}</span><div style={{fontSize:10,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'.06em'}}>Total</div></div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Selected casino codes table */}
            {selectedCasino && (() => {
              const casino = CASINOS_LIST.find(c => c.id===selectedCasino)
              const codes = promoCodes[selectedCasino] || []
              const addCodes = () => {
                if (!newCodeInput.trim()) return
                const newCodes = newCodeInput.split(/[,\n\s]+/).map(s => s.trim().toUpperCase()).filter(Boolean)
                setPromoCodes(prev => ({
                  ...prev,
                  [selectedCasino]: [...prev[selectedCasino], ...newCodes.map(code => ({code, status:'disponibil', bloggerUsername:null, generatedAt:null}))]
                }))
                setNewCodeInput('')
                setAddCodeMode(false)
              }
              const deleteCode = (code) => {
                setPromoCodes(prev => ({
                  ...prev,
                  [selectedCasino]: prev[selectedCasino].filter(c => c.code !== code)
                }))
              }
              const resetCode = (code) => {
                setPromoCodes(prev => ({
                  ...prev,
                  [selectedCasino]: prev[selectedCasino].map(c => c.code===code ? {...c, status:'disponibil', bloggerUsername:null, generatedAt:null} : c)
                }))
              }
              return (
                <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(245,166,35,0.1)',borderRadius:12,overflow:'hidden'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 1.25rem',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                    <div>
                      <span style={{fontWeight:700,fontSize:15,color:casino.color}}>{casino.name}</span>
                      <span style={{marginLeft:12,fontSize:12,color:'rgba(255,255,255,0.35)'}}>{codes.filter(c=>c.status==='disponibil').length} disponibile din {codes.length}</span>
                    </div>
                    <div style={{display:'flex',gap:8}}>
                    <button
                      onClick={() => exportCSV(selectedCasino)}
                      style={{padding:'6px 14px',fontSize:13,fontWeight:600,cursor:'pointer',border:'1px solid rgba(255,255,255,0.15)',borderRadius:6,background:'none',color:'#94a3b8',display:'flex',alignItems:'center',gap:6}}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Export CSV
                    </button>
                    <button
                      onClick={() => setAddCodeMode(m => !m)}
                      style={{padding:'6px 16px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:gold,color:'#000'}}>
                      + Adaugă coduri
                    </button>
                  </div>
                  </div>

                  {addCodeMode && (
                    <div style={{padding:'1rem 1.25rem',borderBottom:'1px solid rgba(255,255,255,0.07)',background:'rgba(245,166,35,0.04)'}}>
                      <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:8}}>
                        Introdu codurile (separate prin virgulă, spațiu sau linie nouă):
                      </div>
                      <textarea
                        style={{...inp,height:80,resize:'vertical',fontFamily:'monospace',fontSize:13,letterSpacing:1}}
                        placeholder={'WIN011, WIN012, WIN013\nsau câte unul pe linie'}
                        value={newCodeInput}
                        onChange={e => setNewCodeInput(e.target.value)}
                      />
                      <div style={{display:'flex',gap:8,marginTop:8}}>
                        <button onClick={addCodes} style={{padding:'6px 16px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:'#10b981',color:'#fff'}}>✓ Adaugă</button>
                        <button onClick={() => {setAddCodeMode(false);setNewCodeInput('')}} style={{padding:'6px 14px',fontSize:13,cursor:'pointer',border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,background:'none',color:'#94a3b8'}}>Anulează</button>
                      </div>
                    </div>
                  )}

                  <div style={{overflowX:'auto'}}>
                    <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                      <thead>
                        <tr>
                          {['Cod','Status','Blogger','Data generării','Acțiuni'].map(h => <th key={h} style={th}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {codes.length === 0 ? (
                          <tr><td colSpan={5} style={{...td,textAlign:'center',color:'rgba(255,255,255,0.25)',padding:'2rem'}}>Nu există coduri. Apasă "+ Adaugă coduri" pentru a adăuga.</td></tr>
                        ) : codes.map((entry, i) => (
                          <tr key={entry.code} style={{background:i%2===0?'rgba(255,255,255,0.01)':'transparent'}}>
                            <td style={td}>
                              <span style={{fontFamily:'monospace',fontWeight:700,fontSize:14,color:entry.status==='disponibil'?casino.color:'rgba(255,255,255,0.4)'}}>{entry.code}</span>
                            </td>
                            <td style={td}>
                              <span style={{
                                padding:'2px 10px',borderRadius:20,fontSize:11,fontWeight:600,
                                background:entry.status==='disponibil'?'#10b98122':'#f59e0b22',
                                color:entry.status==='disponibil'?'#10b981':'#f59e0b'
                              }}>
                                {entry.status==='disponibil' ? '✓ Disponibil' : '⟳ Folosit'}
                              </span>
                            </td>
                            <td style={td}>
                              {entry.bloggerUsername
                                ? <span style={{color:'#93c5fd'}}>@{entry.bloggerUsername}</span>
                                : <span style={{color:'rgba(255,255,255,0.2)'}}>—</span>}
                            </td>
                            <td style={td}>
                              {entry.generatedAt || <span style={{color:'rgba(255,255,255,0.2)'}}>—</span>}
                            </td>
                            <td style={td}>
                              <div style={{display:'flex',gap:6}}>
                                {entry.status==='folosit' && (
                                  <button onClick={() => resetCode(entry.code)}
                                    style={{padding:'3px 10px',fontSize:11,cursor:'pointer',border:'1px solid rgba(245,166,35,0.3)',borderRadius:4,background:'none',color:gold}}>
                                    Reset
                                  </button>
                                )}
                                <button onClick={() => deleteCode(entry.code)}
                                  style={{padding:'3px 10px',fontSize:11,cursor:'pointer',border:'1px solid rgba(239,68,68,0.3)',borderRadius:4,background:'none',color:'#ef4444'}}>
                                  Șterge
                                </button>
                              </div>
                            </td>
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

        {tab==='notif' && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.25rem'}}>
              <div>
                <span style={{fontSize:16,fontWeight:700,color:'#e2e8f0'}}>Jurnal activitate</span>
                <span style={{marginLeft:10,fontSize:12,color:'rgba(255,255,255,0.35)'}}>{notifications.length} evenimente</span>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={markAllRead} style={{padding:'6px 14px',fontSize:12,cursor:'pointer',border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,background:'none',color:'#94a3b8'}}>
                  ✓ Marchează toate citite
                </button>
                <button
                  onClick={() => {
                    const header = 'Tip,Blogger,Casino,Cod,Data'
                    const rows = notifications.map(n => `${n.type},${n.blogger||''},${n.casino||''},${n.code||n.detail||''},${n.timestamp}`)
                    const csv = [header,...rows].join('\n')
                    const blob = new Blob([csv],{type:'text/csv'})
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a'); a.href=url; a.download='activitate_admin.csv'; a.click()
                    URL.revokeObjectURL(url)
                  }}
                  style={{padding:'6px 14px',fontSize:12,cursor:'pointer',border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,background:'none',color:'#94a3b8',display:'flex',alignItems:'center',gap:5}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Export CSV
                </button>
              </div>
            </div>

            {/* Summary cards */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:'1.5rem'}}>
              {[
                ['Coduri generate', notifications.filter(n=>n.type==='code_generated').length, '#10b981'],
                ['Cereri plată', notifications.filter(n=>n.type==='payment_request').length, '#f5a623'],
                ['Bloggeri noi', notifications.filter(n=>n.type==='new_blogger').length, '#3b82f6'],
                ['Necitite', unreadCount, '#ef4444'],
              ].map(([lbl,val,col]) => (
                <div key={lbl} style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,padding:'1rem'}}>
                  <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>{lbl}</div>
                  <div style={{fontSize:28,fontWeight:800,color:col}}>{val}</div>
                </div>
              ))}
            </div>

            {/* Activity log table */}
            <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(245,166,35,0.1)',borderRadius:12,overflow:'hidden'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                <thead>
                  <tr>
                    {['Tip','Blogger','Detalii','Data','Status'].map(h => <th key={h} style={th}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {notifications.length===0 ? (
                    <tr><td colSpan={5} style={{...td,textAlign:'center',padding:'2rem',color:'rgba(255,255,255,0.25)'}}>Nu există activitate înregistrată</td></tr>
                  ) : notifications.map((n,i) => (
                    <tr key={n.id} onClick={() => markRead(n.id)} style={{background:n.read?i%2===0?'transparent':'rgba(255,255,255,0.01)':'rgba(245,166,35,0.03)',cursor:'pointer'}}>
                      <td style={td}>
                        <span style={{
                          padding:'2px 10px',borderRadius:20,fontSize:11,fontWeight:600,
                          background:n.type==='code_generated'?'rgba(16,185,129,0.15)':n.type==='payment_request'?'rgba(245,166,35,0.15)':'rgba(59,130,246,0.15)',
                          color:n.type==='code_generated'?'#10b981':n.type==='payment_request'?'#f5a623':'#60a5fa'
                        }}>
                          {n.type==='code_generated'?'🎟 Cod generat':n.type==='payment_request'?'💸 Cerere plată':'👤 Blogger nou'}
                        </span>
                      </td>
                      <td style={td}><span style={{color:'#93c5fd'}}>@{n.blogger}</span></td>
                      <td style={td}>
                        {n.type==='code_generated'
                          ? <span>Cod <strong style={{fontFamily:'monospace',color:'#10b981'}}>{n.code}</strong> — {n.casino}</span>
                          : <span style={{color:'rgba(255,255,255,0.6)'}}>{n.detail}</span>}
                      </td>
                      <td style={{...td,color:'rgba(255,255,255,0.4)',fontSize:12}}>{n.timestamp}</td>
                      <td style={td}>
                        {n.read
                          ? <span style={{fontSize:11,color:'rgba(255,255,255,0.25)'}}>Citit</span>
                          : <span style={{fontSize:11,color:'#ef4444',fontWeight:600}}>● Nou</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab==='bloggers' && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
              <span style={{fontSize:13,color:'rgba(255,255,255,0.5)'}}>{bloggers.length} bloggeri</span>
              <button style={{padding:'7px 16px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:gold,color:'#000'}} onClick={() => setShowAdd(s => !s)}>+ Adaugă</button>
            </div>

            {showAdd && (
              <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(245,166,35,0.1)',borderRadius:12,padding:'1.25rem',marginBottom:'1rem'}}>
                <p style={{fontWeight:700,marginBottom:12}}>Blogger nou</p>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:10}}>
                  <div>
                    <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:3}}>Nume</div>
                    <input style={inp} value={newB.name} onChange={e => setNewB(p => ({...p,name:e.target.value}))} placeholder="Ion Popescu"/>
                  </div>
                  <div>
                    <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:3}}>Username</div>
                    <input style={inp} value={newB.username} onChange={e => setNewB(p => ({...p,username:e.target.value}))} placeholder="ionpopescu"/>
                  </div>
                  <div>
                    <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:3}}>Telefon</div>
                    <input style={inp} value={newB.phone} onChange={e => setNewB(p => ({...p,phone:e.target.value}))} placeholder="+373.."/>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:12}}>
                  <div>
                    <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:3}}>Platformă</div>
                    <select style={inp} value={newB.platform} onChange={e => setNewB(p => ({...p,platform:e.target.value}))}>
                      {['TikTok','Instagram','YouTube','Telegram'].map(pl => <option key={pl} style={{background:'#1a1a2e'}}>{pl}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:3}}>Cod promo</div>
                    <input style={inp} value={newB.promoCode} onChange={e => setNewB(p => ({...p,promoCode:e.target.value.toUpperCase()}))} placeholder="IONEL_WIN"/>
                  </div>
                  <div>
                    <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:3}}>Comision %</div>
                    <input style={inp} type="number" value={newB.commission} onChange={e => setNewB(p => ({...p,commission:+e.target.value}))}/>
                  </div>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button style={{padding:'7px 16px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:gold,color:'#000'}} onClick={addBlogger}>Salvează</button>
                  <button style={{padding:'7px 16px',fontSize:13,cursor:'pointer',border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,background:'none',color:'#94a3b8'}} onClick={() => setShowAdd(false)}>Anulează</button>
                </div>
              </div>
            )}

            <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(245,166,35,0.1)',borderRadius:12,overflow:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                <thead>
                  <tr>
                    {['Nume','Platformă','Cod Promo','Status','Clicks','Înreg.','Venit','Plătit','Datorat','Acțiuni'].map(h => <th key={h} style={th}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {bloggers.map(b => {
                    const datorat = Math.round(b.revenue*(b.commission/100)-b.paid)
                    const pc = {TikTok:'#3b82f6',Instagram:'#f59e0b',YouTube:'#ef4444',Telegram:'#10b981'}[b.platform] || gold
                    if (editId===b.id) {
                      return (
                        <tr key={b.id}>
                          <td style={td} colSpan={4}>
                            <input style={{...inp,width:150}} value={editData.name} onChange={e => setEditData(p => ({...p,name:e.target.value}))}/>
                          </td>
                          <td style={td}><input style={{...inp,width:70}} type="number" value={editData.clicks} onChange={e => setEditData(p => ({...p,clicks:+e.target.value}))}/></td>
                          <td style={td}><input style={{...inp,width:60}} type="number" value={editData.regs} onChange={e => setEditData(p => ({...p,regs:+e.target.value}))}/></td>
                          <td style={td}><input style={{...inp,width:80}} type="number" value={editData.revenue} onChange={e => setEditData(p => ({...p,revenue:+e.target.value}))}/></td>
                          <td style={td}>${editData.paid}</td>
                          <td style={td}>${Math.round(editData.revenue*(editData.commission/100)-editData.paid)}</td>
                          <td style={td}>
                            <button style={{padding:'4px 10px',fontSize:11,fontWeight:700,cursor:'pointer',border:'none',borderRadius:4,background:'#10b981',color:'#fff'}} onClick={saveEdit}>✓ Salvează</button>
                          </td>
                        </tr>
                      )
                    }
                    return (
                      <tr key={b.id}>
                        <td style={td}>
                          <div style={{fontWeight:600}}>{b.name}</div>
                          <div style={{fontSize:11,color:'rgba(255,255,255,0.35)'}}>@{b.username}</div>
                        </td>
                        <td style={td}>
                          <span style={{background:pc+'22',color:pc,padding:'2px 8px',borderRadius:4,fontSize:11,fontWeight:600}}>{b.platform}</span>
                        </td>
                        <td style={td}>
                          <span style={{fontFamily:'monospace',color:gold,fontSize:12}}>{b.promoCode}</span>
                        </td>
                        <td style={td}>
                          <span style={{background:b.status==='active'?'#10b98122':'#64748b22',color:b.status==='active'?'#10b981':'#64748b',padding:'2px 8px',borderRadius:4,fontSize:11,fontWeight:600}}>{b.status}</span>
                        </td>
                        <td style={td}>{b.clicks.toLocaleString()}</td>
                        <td style={td}>{b.regs}</td>
                        <td style={td}>${b.revenue.toLocaleString()}</td>
                        <td style={{...td,color:'#10b981'}}>${b.paid}</td>
                        <td style={{...td,color:datorat>0?'#ef4444':'#10b981',fontWeight:600}}>${datorat}</td>
                        <td style={td}>
                          <div style={{display:'flex',gap:6}}>
                            <button style={{padding:'4px 10px',fontSize:11,fontWeight:700,cursor:'pointer',border:'none',borderRadius:4,background:gold,color:'#000'}} onClick={() => { setEditId(b.id); setEditData({...b}) }}>Edit</button>
                            {datorat>0 && <button style={{padding:'4px 10px',fontSize:11,fontWeight:700,cursor:'pointer',border:'none',borderRadius:4,background:'#10b981',color:'#fff'}} onClick={() => { setPayModal(b); setPayAmount(datorat.toString()) }}>Plată</button>}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab==='special' && (
          <div>
            <div style={{marginBottom:16,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <h3 style={{fontSize:16,fontWeight:700,color:'#e2e8f0',margin:0}}>Cereri coduri personalizate</h3>
              <span style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>{customRequests.length} total</span>
            </div>

            {/* Coduri atribuite automat */}
            <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(245,166,35,0.1)',borderRadius:12,overflow:'hidden',marginBottom:20}}>
              <div style={{padding:'12px 16px',borderBottom:'1px solid rgba(255,255,255,0.05)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span style={{fontWeight:700,fontSize:14,color:'#e2e8f0'}}>Coduri atribuite automat</span>
                <span style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>{Object.keys(assignedCodes).length} coduri</span>
              </div>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                  <thead><tr style={{background:'rgba(0,0,0,0.2)'}}>
                    {['Cod','Blogger','Casino'].map(h=><th key={h} style={{padding:'8px 12px',textAlign:'left',color:'rgba(255,255,255,0.5)',fontWeight:600,fontSize:11,textTransform:'uppercase',letterSpacing:'.05em'}}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {Object.entries(assignedCodes).length === 0 ? (
                      <tr><td colSpan={3} style={{padding:'20px',textAlign:'center',color:'rgba(255,255,255,0.3)',fontStyle:'italic'}}>Niciun cod atribuit încă</td></tr>
                    ) : Object.entries(assignedCodes).map(([code, username], i) => (
                      <tr key={code} style={{borderTop:'1px solid rgba(255,255,255,0.04)',background:i%2===0?'transparent':'rgba(255,255,255,0.01)'}}>
                        <td style={{padding:'10px 12px',fontFamily:'monospace',fontWeight:700,color:gold}}>{code}</td>
                        <td style={{padding:'10px 12px',color:'#e2e8f0'}}>@{username}</td>
                        <td style={{padding:'10px 12px',color:'rgba(255,255,255,0.5)',fontSize:12}}>
                          {code.startsWith('WIN')?'WinBet Casino':code.startsWith('SPX')?'SpinMax Casino':'LuckyDeal Casino'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cereri coduri speciale */}
            <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(245,166,35,0.1)',borderRadius:12,overflow:'hidden'}}>
              <div style={{padding:'12px 16px',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                <span style={{fontWeight:700,fontSize:14,color:'#e2e8f0'}}>Cereri coduri speciale (de la bloggeri)</span>
              </div>
              {customRequests.length === 0 ? (
                <div style={{padding:'32px',textAlign:'center',color:'rgba(255,255,255,0.3)',fontStyle:'italic'}}>
                  Niciun blogger nu a solicitat cod special încă
                </div>
              ) : (
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                    <thead><tr style={{background:'rgba(0,0,0,0.2)'}}>
                      {['Blogger','Cod solicitat','Casino','Data','Status','Acțiuni'].map(h=>(
                        <th key={h} style={{padding:'8px 12px',textAlign:'left',color:'rgba(255,255,255,0.5)',fontWeight:600,fontSize:11,textTransform:'uppercase',letterSpacing:'.05em'}}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {customRequests.map((r,i) => (
                        <tr key={r.id} style={{borderTop:'1px solid rgba(255,255,255,0.04)',background:i%2===0?'transparent':'rgba(255,255,255,0.01)'}}>
                          <td style={{padding:'10px 12px',color:'#e2e8f0',fontWeight:600}}>@{r.blogger}</td>
                          <td style={{padding:'10px 12px',fontFamily:'monospace',fontWeight:700,color:gold,fontSize:14}}>{r.requestedCode}</td>
                          <td style={{padding:'10px 12px',color:'rgba(255,255,255,0.7)'}}>{r.casinoName}</td>
                          <td style={{padding:'10px 12px',color:'rgba(255,255,255,0.4)',fontSize:12}}>{r.date}</td>
                          <td style={{padding:'10px 12px'}}>
                            <span style={{padding:'3px 10px',borderRadius:12,fontSize:11,fontWeight:600,
                              background: r.status==='approved'?'rgba(16,185,129,0.15)': r.status==='rejected'?'rgba(239,68,68,0.15)':'rgba(245,166,35,0.15)',
                              color: r.status==='approved'?'#10b981': r.status==='rejected'?'#ef4444':gold}}>
                              {r.status==='approved'?'✓ Aprobat': r.status==='rejected'?'✗ Respins':'⏳ În așteptare'}
                            </span>
                          </td>
                          <td style={{padding:'10px 12px'}}>
                            {r.status==='pending' && (
                              <div style={{display:'flex',gap:6}}>
                                <button onClick={()=>approveCustomRequest(r.id,true)}
                                  style={{padding:'4px 12px',fontSize:12,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:'#10b981',color:'#fff'}}>
                                  ✓ Aprobă
                                </button>
                                <button onClick={()=>approveCustomRequest(r.id,false)}
                                  style={{padding:'4px 12px',fontSize:12,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:'#ef4444',color:'#fff'}}>
                                  ✗ Respinge
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {tab==='update' && (
          <div>
            <p style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginBottom:'1rem'}}>
              Introduci manual statisticile din Melbet/1xBet/etc. Bloggerul vede imediat în dashboard.
            </p>

            {/* Selector blogger */}
            <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:'1.5rem',flexWrap:'wrap'}}>
              <span style={{fontSize:13,color:'rgba(255,255,255,0.5)'}}>Blogger:</span>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {bloggers.map(b => (
                  <button key={b.id}
                    onClick={() => setUpdateBlogger(b)}
                    style={{padding:'6px 14px',fontSize:13,fontWeight:600,cursor:'pointer',border:`1px solid ${updateBlogger?.id===b.id?gold:'rgba(255,255,255,0.1)'}`,borderRadius:6,background:updateBlogger?.id===b.id?'rgba(245,166,35,0.15)':'none',color:updateBlogger?.id===b.id?gold:'rgba(255,255,255,0.5)'}}>
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            {updateBlogger && (() => {
              const b = updateBlogger
              // Citim statisticile curente din localStorage
              const statsKey = 'wp_casino_stats_' + b.username
              const currentStats = (() => {
                try { return JSON.parse(localStorage.getItem(statsKey) || '{}') } catch(e) { return {} }
              })()
              const casinos = [
                { id:'winbet', name:'WinBet Casino', color:'#f5a623' },
                { id:'spinmax', name:'SpinMax Casino', color:'#3b82f6' },
                { id:'luckydeal', name:'LuckyDeal Casino', color:'#10b981' },
              ]
              return (
                <div>
                  <div style={{marginBottom:16,display:'flex',alignItems:'center',gap:12}}>
                    <div style={{width:36,height:36,borderRadius:'50%',background:'rgba(245,166,35,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:gold}}>{b.name[0]}</div>
                    <div>
                      <div style={{fontWeight:700,fontSize:15}}>{b.name}</div>
                      <div style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>@{b.username} · {b.platform}</div>
                    </div>
                  </div>

                  {/* Per casino */}
                  <div style={{display:'flex',flexDirection:'column',gap:14}}>
                    {casinos.map(casino => {
                      const s = currentStats[casino.id] || { clicks:0, regs:0, deposits:0, revenue:0, commission:0 }
                      // Calculăm comisionul automat
                      const commPct = casino.id==='winbet'?25:casino.id==='spinmax'?30:20
                      return (
                        <div key={casino.id} style={{background:'rgba(255,255,255,0.02)',border:`1px solid ${casino.color}25`,borderRadius:12,padding:'1rem',borderLeft:`3px solid ${casino.color}`}}>
                          <div style={{fontSize:13,fontWeight:700,color:casino.color,marginBottom:12}}>{casino.name} · {commPct}% RevShare</div>
                          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10}}>
                            {[['Clickuri','clicks'],['Înregistrări','regs'],['Depunători','deposits'],['Venit net ($)','revenue'],['Comision ($)','commission']].map(([label,field]) => (
                              <div key={field}>
                                <div style={{fontSize:10,color:'rgba(255,255,255,0.35)',marginBottom:3,textTransform:'uppercase',letterSpacing:'.05em'}}>{label}</div>
                                <input style={{...inp,fontFamily:field==='revenue'||field==='commission'?'monospace':'inherit'}}
                                  type="number" defaultValue={s[field]||0}
                                  id={`stat_${b.username}_${casino.id}_${field}`}
                                />
                              </div>
                            ))}
                          </div>
                          <div style={{marginTop:10,display:'flex',justifyContent:'flex-end'}}>
                            <button
                              onClick={() => {
                                const newStats = { ...currentStats }
                                if (!newStats[casino.id]) newStats[casino.id] = {}
                                ;['clicks','regs','deposits','revenue','commission'].forEach(f => {
                                  const el = document.getElementById('stat_'+b.username+'_'+casino.id+'_'+f)
                                  if (el) newStats[casino.id][f] = +el.value
                                })
                                // Auto-calculează comisionul dacă nu e completat manual
                                if (!newStats[casino.id].commission && newStats[casino.id].revenue) {
                                  newStats[casino.id].commission = Math.round(newStats[casino.id].revenue * commPct / 100)
                                }
                                localStorage.setItem(statsKey, JSON.stringify(newStats))
                                // Adaugă notificare
                                setNotifications(prev => [{
                                  id: Date.now(), type:'code_generated',
                                  blogger: b.username, casino: casino.name,
                                  code: 'Statistici actualizate', timestamp: new Date().toLocaleString('ro-RO'), read:false
                                }, ...prev])
                                alert('✅ Statistici salvate pentru ' + b.name + ' · ' + casino.name)
                              }}
                              style={{padding:'7px 18px',fontSize:12,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:casino.color,color:'#000'}}>
                              💾 Salvează {casino.name}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}

            {!updateBlogger && (
              <div style={{padding:'32px',textAlign:'center',color:'rgba(255,255,255,0.3)',fontSize:13,fontStyle:'italic'}}>
                Selectează un blogger din lista de sus pentru a actualiza statisticile
              </div>
            )}

            <div style={{marginTop:16,padding:'12px 16px',background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:8,fontSize:13,color:'#10b981'}}>
              ✓ După salvare, bloggerul vede instantaneu statisticile actualizate în dashboard-ul lui pe secțiunea Cazinouri Partenere.
            </div>
          </div>
        )}

        {tab==='requests' && (
          <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(245,166,35,0.1)',borderRadius:12,overflow:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
              <thead>
                <tr>{['Data','Blogger','Tip','Detalii','Status','Acțiuni'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r.id}>
                    <td style={td}>{r.date}</td>
                    <td style={td}>{r.name}</td>
                    <td style={td}>{r.type}</td>
                    <td style={{...td,color:gold,fontFamily:'monospace'}}>{r.detail}</td>
                    <td style={td}>
                      <span style={{background:r.status==='pending'?'#f59e0b22':r.status==='approved'?'#10b98122':'#ef444422',color:r.status==='pending'?'#f59e0b':r.status==='approved'?'#10b981':'#ef4444',padding:'2px 8px',borderRadius:4,fontSize:11,fontWeight:600}}>{r.status}</span>
                    </td>
                    <td style={td}>
                      {r.status==='pending' && (
                        <div style={{display:'flex',gap:6}}>
                          <button style={{padding:'4px 10px',fontSize:11,fontWeight:700,cursor:'pointer',border:'none',borderRadius:4,background:'#10b981',color:'#fff'}} onClick={() => setRequests(prev => prev.map(req => req.id===r.id?{...req,status:'approved'}:req))}>Aprobă</button>
                          <button style={{padding:'4px 10px',fontSize:11,fontWeight:700,cursor:'pointer',border:'none',borderRadius:4,background:'#ef4444',color:'#fff'}} onClick={() => setRequests(prev => prev.map(req => req.id===r.id?{...req,status:'rejected'}:req))}>Respinge</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab==='payments' && (
          <div>
            <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(245,166,35,0.1)',borderRadius:12,padding:'1.25rem',marginBottom:'1rem'}}>
              <p style={{fontWeight:700,marginBottom:12}}>Bloggeri cu sold de plătit</p>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {bloggers.filter(b => Math.round(b.revenue*(b.commission/100)-b.paid)>0).map(b => {
                  const datorat = Math.round(b.revenue*(b.commission/100)-b.paid)
                  return (
                    <div key={b.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                      <div>
                        <span style={{fontWeight:600}}>{b.name}</span>
                        <span style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginLeft:8}}>@{b.username}</span>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:12}}>
                        <span style={{color:'#ef4444',fontWeight:700,fontSize:16}}>${datorat}</span>
                        <button style={{padding:'6px 14px',fontSize:12,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:gold,color:'#000'}} onClick={() => { setPayModal(b); setPayAmount(datorat.toString()) }}>Procesează</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(245,166,35,0.1)',borderRadius:12,padding:'1.25rem'}}>
              <p style={{fontWeight:700,marginBottom:12}}>Istoric plăți</p>
              {payments.length===0
                ? <p style={{color:'rgba(255,255,255,0.3)',fontSize:13}}>Nicio plată procesată încă</p>
                : (
                  <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                    <thead><tr>{['Data','Blogger','Sumă'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
                    <tbody>{[...payments].reverse().map(p => (
                      <tr key={p.id}>
                        <td style={td}>{p.date}</td>
                        <td style={td}>{p.name}</td>
                        <td style={{...td,color:'#10b981',fontWeight:600}}>${p.amount}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                )
              }
            </div>
          </div>
        )}
      </div>

      {payModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200}} onClick={() => setPayModal(null)}>
          <div style={{background:'#0d0d1f',border:'1px solid rgba(255,255,255,0.1)',borderRadius:16,padding:'1.5rem',width:380}} onClick={e => e.stopPropagation()}>
            <h3 style={{color:'#fff',fontWeight:700,marginBottom:4}}>Procesează plată</h3>
            <p style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginBottom:16}}>Blogger: <strong style={{color:'#fff'}}>{payModal.name}</strong></p>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:4}}>Sumă ($)</div>
            <input style={{...inp,marginBottom:12}} type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)}/>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:4}}>Metodă</div>
            <select style={{...inp,marginBottom:16}}>
              <option>Bitcoin</option>
              <option>Skrill</option>
              <option>Neteller</option>
              <option>Transfer bancar</option>
            </select>
            <button style={{width:'100%',padding:'11px',fontSize:14,fontWeight:700,cursor:'pointer',border:'none',borderRadius:8,background:gold,color:'#000'}} onClick={processPay}>Confirmă plata</button>
            <button style={{width:'100%',padding:'9px',fontSize:13,cursor:'pointer',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,background:'none',color:'#94a3b8',marginTop:8}} onClick={() => setPayModal(null)}>Anulează</button>
          </div>
        </div>
      )}
    </div>
  )
}
