import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const gold = '#f5a623'
const dark = '#0a0a0f'

const PASS = 'winadmin2026'

const initBloggers = [
  {id:1, name:'Ion Popescu', username:'ionpopescu', platform:'TikTok', promoCode:'IONPOPESCU_WIN', country:'Moldova', phone:'+373601234', status:'active', clicks:1247, regs:89, deposits:34, revenue:1840, commission:20, paid:920},
  {id:2, name:'Alex Marin', username:'alexmarin', platform:'Instagram', promoCode:'ALEXMARIN_WIN', country:'România', phone:'+40721234', status:'active', clicks:856, regs:52, deposits:18, revenue:1120, commission:20, paid:560},
  {id:3, name:'Vlad Gaming', username:'vladgaming', platform:'YouTube', promoCode:'VLADGAMING_WIN', country:'Ucraina', phone:'+380671234', status:'pending', clicks:234, regs:12, deposits:3, revenue:180, commission:20, paid:0},
]

const inp = {width:'100%',padding:'8px 12px',fontSize:13,border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,background:'rgba(255,255,255,0.05)',color:'#e2e8f0',outline:'none',boxSizing:'border-box'}
const btn = (bg,c='#000') => ({padding:'7px 16px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:bg,color:c})

export default function Admin() {
  const [pass, setPass] = useState('')
  const [auth, setAuth] = useState(false)
  const [tab, setTab] = useState('bloggers')
  const [bloggers, setBloggers] = useState(initBloggers)
  const [editId, setEditId] = useState(null)
  const [editData, setEditData] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [newBlogger, setNewBlogger] = useState({name:'',username:'',platform:'TikTok',promoCode:'',country:'Moldova',phone:'',commission:20})
  const [payModal, setPayModal] = useState(null)
  const [payAmount, setPayAmount] = useState('')
  const [payments, setPayments] = useState([])
  const [requests, setRequests] = useState([
    {id:1,name:'Ion Popescu',type:'Cod personalizat',detail:'IONEL',date:'10.06.2026',status:'pending'},
    {id:2,name:'Alex Marin',type:'Plată',detail:'$560',date:'09.06.2026',status:'pending'},
  ])
  const nav = useNavigate()

  if(!auth) return (
    <div style={{minHeight:'100vh',background:dark,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center',maxWidth:360,width:'100%',padding:'2rem'}}>
        <div style={{fontSize:24,fontWeight:900,marginBottom:24}}><span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span></div>
        <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(245,166,35,0.15)',borderRadius:12,padding:'2rem'}}>
          <h2 style={{fontSize:18,fontWeight:700,marginBottom:20,color:'#fff'}}>🔐 Acces Admin</h2>
          <input style={{...inp,marginBottom:12,textAlign:'center',letterSpacing:'.1em'}} type="password" placeholder="Parola admin" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&pass===PASS&&setAuth(true)}/>
          <button style={{...btn(gold),width:'100%',padding:'10px'}} onClick={()=>pass===PASS?setAuth(true):alert('Parolă incorectă!')}>INTRĂ</button>
        </div>
        <div style={{marginTop:16,fontSize:12,color:'rgba(255,255,255,0.2)'}}>Pagină secretă — nu distribui linkul</div>
      </div>
    </div>
  )

  const totalRevenue = bloggers.reduce((s,b)=>s+b.revenue,0)
  const totalPaid = bloggers.reduce((s,b)=>s+b.paid,0)
  const totalPending = bloggers.reduce((s,b)=>s+(b.revenue*(b.commission/100)-b.paid),0)
  const activeBloggers = bloggers.filter(b=>b.status==='active').length

  const startEdit = (b) => { setEditId(b.id); setEditData({...b}) }
  const saveEdit = () => { setBloggers(prev=>prev.map(b=>b.id===editId?{...editData}:b)); setEditId(null) }
  const addBlogger = () => {
    if(!newBlogger.name||!newBlogger.username) return
    setBloggers(prev=>[...prev,{...newBlogger,id:Date.now(),clicks:0,regs:0,deposits:0,revenue:0,paid:0,status:'active'}])
    setNewBlogger({name:'',username:'',platform:'TikTok',promoCode:'',country:'Moldova',phone:'',commission:20})
    setShowAdd(false)
  }
  const processPay = () => {
    const amt = parseFloat(payAmount)
    if(!amt||!payModal) return
    setBloggers(prev=>prev.map(b=>b.id===payModal.id?{...b,paid:b.paid+amt}:b))
    setPayments(prev=>[...prev,{date:new Date().toLocaleDateString('ro-RO'),name:payModal.name,amount:amt,id:Date.now()}])
    setPayModal(null); setPayAmount('')
  }
  const approveReq = (id) => setRequests(prev=>prev.map(r=>r.id===id?{...r,status:'approved'}:r))
  const rejectReq = (id) => setRequests(prev=>prev.map(r=>r.id===id?{...r,status:'rejected'}:r))

  const tabStyle = (t) => ({padding:'8px 18px',fontSize:13,cursor:'pointer',border:'none',background:'none',color:tab===t?gold:'rgba(255,255,255,0.4)',borderBottom:tab===t?`2px solid ${gold}`:'2px solid transparent',marginBottom:-1,fontWeight:tab===t?700:400})
  const card = {background:'rgba(255,255,255,0.03)',border:'1px solid rgba(245,166,35,0.1)',borderRadius:12,padding:'1.25rem'}
  const th = {textAlign:'left',padding:'9px 12px',color:'rgba(255,255,255,0.35)',fontWeight:400,borderBottom:'1px solid rgba(255,255,255,0.07)',fontSize:11,textTransform:'uppercase',letterSpacing:'.05em'}
  const td = {padding:'9px 12px',borderBottom:'1px solid rgba(255,255,255,0.04)',color:'#e2e8f0',fontSize:13}

  return (
    <div style={{background:dark,minHeight:'100vh',color:'#fff',fontFamily:"'Inter',sans-serif"}}>
      <nav style={{background:'rgba(10,10,15,0.97)',borderBottom:'1px solid rgba(245,166,35,0.12)',padding:'0 2rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:60}}>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <div style={{fontSize:18,fontWeight:900}}><span>WIN</span><span style={{color:gold}}>PARTNERS</span></div>
          <span style={{fontSize:11,background:'rgba(245,166,35,0.15)',color:gold,padding:'2px 8px',borderRadius:4,fontWeight:700}}>ADMIN</span>
        </div>
        <button style={btn('rgba(255,255,255,0.08)','#94a3b8')} onClick={()=>setAuth(false)}>Logout</button>
      </nav>

      <div style={{maxWidth:1200,margin:'0 auto',padding:'2rem 1.5rem'}}>
        {/* STATS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12,marginBottom:'1.5rem'}}>
          {[
            ['Bloggeri activi',activeBloggers,'#10b981'],
            ['Venit total (Melbet)','$'+totalRevenue.toLocaleString(),gold],
            ['Plătit bloggeri','$'+totalPaid.toLocaleString(),'#f59e0b'],
            ['De plătit','$'+Math.round(totalPending).toLocaleString(),'#ef4444'],
            ['Profit tău','$'+Math.round(totalRevenue-totalPaid-totalRevenue*(80/100)).toLocaleString(),gold],
          ].map(([l,v,c])=>(
            <div key={l} style={card}>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>{l}</div>
              <div style={{fontSize:24,fontWeight:800,color:c}}>{v}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{display:'flex',gap:4,borderBottom:'1px solid rgba(255,255,255,0.07)',marginBottom:'1.5rem'}}>
          {[['bloggers','Bloggeri'],['update','Actualizare statistici'],['requests','Cereri ('+requests.filter(r=>r.status==='pending').length+')'],['payments','Plăți']].map(([id,lbl])=>(
            <button key={id} style={tabStyle(id)} onClick={()=>setTab(id)}>{lbl}</button>
          ))}
        </div>

        {/* BLOGGERS */}
        {tab==='bloggers' && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
              <span style={{fontSize:13,color:'rgba(255,255,255,0.5)'}}>{bloggers.length} bloggeri înregistrați</span>
              <button style={btn(gold)} onClick={()=>setShowAdd(s=>!s)}>+ Adaugă blogger</button>
            </div>
            {showAdd && (
              <div style={{...card,marginBottom:'1rem'}}>
                <p style={{fontWeight:700,marginBottom:12}}>Blogger nou</p>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:10}}>
                  {[['Nume','name','Ion Popescu'],['Username','username','ionpopescu'],['Telefon','phone','+373..']].map(([l,k,ph])=>(
                    <div key={k}><div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:3}}>{l}</div><input style={inp} value={newBlogger[k]} onChange={e=>setNewBlogger(p=>({...p,[k]:e.target.value}))} placeholder={ph}/></div>
                  ))}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:12}}>
                  <div><div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:3}}>Platformă</div>
                    <select style={inp} value={newBlogger.platform} onChange={e=>setNewBlogger(p=>({...p,platform:e.target.value}))}>
                      {['TikTok','Instagram','YouTube','Telegram'].map(p=><option key={p} style={{background:'#1a1a2e'}}>{p}</option>)}
                    </select>
                  </div>
                  <div><div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:3}}>Cod promo</div><input style={inp} value={newBlogger.promoCode} onChange={e=>setNewBlogger(p=>({...p,promoCode:e.target.value.toUpperCase()}))} placeholder="IONEL_WIN"/></div>
                  <div><div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:3}}>Comision %</div><input style={inp} type="number" value={newBlogger.commission} onChange={e=>setNewBlogger(p=>({...p,commission:+e.target.value}))}/></div>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button style={btn(gold)} onClick={addBlogger}>Salvează</button>
                  <button style={btn('rgba(255,255,255,0.08)','#94a3b8')} onClick={()=>setShowAdd(false)}>Anulează</button>
                </div>
              </div>
            )}
            <div style={{...card,overflow:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                <thead><tr>
                  {['Nume','Platformă','Cod Promo','Status','Click-uri','Înreg.','Venit','Comision','Plătit','Datorat','Acțiuni'].map(h=><th key={h} style={th}>{h}</th>)}
                </tr></thead>
                <tbody>{bloggers.map(b=>{
                  const datorat = Math.round(b.revenue*(b.commission/100)-b.paid)
                  const pc = {TikTok:'#3b82f6',Instagram:'#f59e0b',YouTube:'#ef4444',Telegram:'#10b981'}[b.platform]||gold
                  return editId===b.id ? (
                    <tr key={b.id}>
                      <td style={td} colSpan={4}><input style={{...inp,width:120}} value={editData.name} onChange={e=>setEditData(p=>({...p,name:e.target.value}))}/></td>
                      <td style={td}><input style={{...inp,width:70}} type="number" value={editData.clicks} onChange={e=>setEditData(p=>({...p,clicks:+e.target.value}))}/></td>
                      <td style={td}><input style={{...inp,width:60}} type="number" value={editData.regs} onChange={e=>setEditData(p=>({...p,regs:+e.target.value}))}/></td>
                      <td style={td}><input style={{...inp,width:80}} type="number" value={editData.revenue} onChange={e=>setEditData(p=>({...p,revenue:+e.target.value}))}/></td>
                      <td style={td}>{editData.commission}%</td>
                      <td style={td}>${editData.paid}</td>
                      <td style={td}>${Math.round(editData.revenue*(editData.commission/100)-editData.paid)}</td>
                      <td style={td}><button style={btn('#10b981')} onClick={saveEdit}>✓</button></td>
                    </tr>
                  ) : (
                    <tr key={b.id}>
                      <td style={td}><div style={{fontWeight:600}}>{b.name}</div><div style={{fontSize:11,color:'rgba(255,255,255,0.35)'}}>@{b.username}</div></td>
                      <td style={td}><span style={{background:pc+'22',color:pc,padding:'2px 8px',borderRadius:4,fontSize:11,fontWeight:600}}>{b.platform}</span></td>
                      <td style={td}><span style={{fontFamily:'monospace',color:gold,fontSize:12}}>{b.promoCode}</span></td>
                      <td style={td}><span style={{background:b.status==='active'?'#10b98122':'#64748b22',color:b.status==='active'?'#10b981':'#64748b',padding:'2px 8px',borderRadius:4,fontSize:11,fontWeight:600}}>{b.status}</span></td>
                      <td style={td}>{b.clicks.toLocaleString()}</td>
                      <td style={td}>{b.regs}</td>
                      <td style={td}>${b.revenue.toLocaleString()}</td>
                      <td style={td}>{b.commission}%</td>
                      <td style={{...td,color:'#10b981'}}>${b.paid}</td>
                      <td style={{...td,color:datorat>0?'#ef4444':'#10b981',fontWeight:600}}>${datorat}</td>
                      <td style={td}>
                        <div style={{display:'flex',gap:6'}}>
                          <button style={{...btn(gold),padding:'4px 10px',fontSize:11}} onClick={()=>startEdit(b)}>Edit</button>
                          {datorat>0&&<button style={{...btn('#10b981'),padding:'4px 10px',fontSize:11}} onClick={()=>{setPayModal(b);setPayAmount(datorat.toString())}}>Plătește</button>}
                        </div>
                      </td>
                    </tr>
                  )
                })}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* UPDATE STATS */}
        {tab==='update' && (
          <div>
            <p style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginBottom:'1rem'}}>Actualizează statisticile zilnic din datele Melbet Partners. Toate câmpurile sunt editabile.</p>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {bloggers.filter(b=>b.status==='active').map(b=>(
                <div key={b.id} style={{...card,display:'grid',gridTemplateColumns:'200px 1fr',gap:16,alignItems:'center'}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:15}}>{b.name}</div>
                    <div style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>{b.platform} · <span style={{color:gold,fontFamily:'monospace'}}>{b.promoCode}</span></div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
                    {[['Click-uri','clicks'],['Înregistrări','regs'],['Depunători','deposits'],['Venit net ($)','revenue']].map(([label,field])=>(
                      <div key={field}>
                        <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',marginBottom:3,textTransform:'uppercase',letterSpacing:'.05em'}}>{label}</div>
                        <input style={inp} type="number" value={b[field]} onChange={e=>setBloggers(prev=>prev.map(bl=>bl.id===b.id?{...bl,[field]:+e.target.value}:bl))}/>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{marginTop:16,padding:'12px 16px',background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:8,fontSize:13,color:'#10b981'}}>
              ✓ Modificările se salvează automat. Bloggerii vor vedea statisticile actualizate în dashboard-ul lor.
            </div>
          </div>
        )}

        {/* REQUESTS */}
        {tab==='requests' && (
          <div style={card}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
              <thead><tr>{['Data','Blogger','Tip cerere','Detalii','Status','Acțiuni'].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
              <tbody>{requests.map(r=>(
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
                        <button style={{...btn('#10b981'),padding:'4px 10px',fontSize:11}} onClick={()=>approveReq(r.id)}>Aprobă</button>
                        <button style={{...btn('#ef4444'),padding:'4px 10px',fontSize:11}} onClick={()=>rejectReq(r.id)}>Respinge</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {/* PAYMENTS */}
        {tab==='payments' && (
          <div>
            <div style={{...card,marginBottom:'1rem'}}>
              <p style={{fontWeight:700,marginBottom:12}}>Bloggeri cu sold de plătit</p>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {bloggers.filter(b=>Math.round(b.revenue*(b.commission/100)-b.paid)>0).map(b=>{
                  const datorat=Math.round(b.revenue*(b.commission/100)-b.paid)
                  return (
                    <div key={b.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                      <div>
                        <span style={{fontWeight:600}}>{b.name}</span>
                        <span style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginLeft:8}}>@{b.username}</span>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:12}}>
                        <span style={{color:'#ef4444',fontWeight:700,fontSize:16}}>${datorat}</span>
                        <button style={{...btn(gold),padding:'6px 14px',fontSize:12}} onClick={()=>{setPayModal(b);setPayAmount(datorat.toString())}}>Procesează plată</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div style={card}>
              <p style={{fontWeight:700,marginBottom:12}}>Istoric plăți procesate</p>
              {payments.length===0 ? <p style={{color:'rgba(255,255,255,0.3)',fontSize:13}}>Nicio plată procesată încă</p> : (
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                  <thead><tr>{['Data','Blogger','Sumă'].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                  <tbody>{[...payments].reverse().map(p=>(
                    <tr key={p.id}><td style={td}>{p.date}</td><td style={td}>{p.name}</td><td style={{...td,color:'#10b981',fontWeight:600}}>${p.amount}</td></tr>
                  ))}</tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>

      {/* PAY MODAL */}
      {payModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200}} onClick={()=>setPayModal(null)}>
          <div style={{background:'#0d0d1f',border:'1px solid rgba(255,255,255,0.1)',borderRadius:16,padding:'1.5rem',width:380}} onClick={e=>e.stopPropagation()}>
            <h3 style={{color:'#fff',fontWeight:700,marginBottom:4}}>Procesează plată</h3>
            <p style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginBottom:16}}>Blogger: <strong style={{color:'#fff'}}>{payModal.name}</strong></p>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:4}}>Sumă ($)</div>
            <input style={{...inp,marginBottom:12}} type="number" value={payAmount} onChange={e=>setPayAmount(e.target.value)}/>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:4}}>Metodă plată</div>
            <select style={{...inp,marginBottom:16}}><option>Bitcoin</option><option>Skrill</option><option>Neteller</option><option>Transfer bancar</option></select>
            <button style={{...btn(gold),width:'100%',padding:'11px'}} onClick={processPay}>Confirmă plata</button>
            <button style={{...btn('rgba(255,255,255,0.05)','#94a3b8'),width:'100%',padding:'9px',marginTop:8}} onClick={()=>setPayModal(null)}>Anulează</button>
          </div>
        </div>
      )}
    </div>
  )
}
