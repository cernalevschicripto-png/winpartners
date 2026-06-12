import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const gold = '#f5a623'

const d = {
  name:'Ion Popescu', username:'ionpopescu', platform:'TikTok',
  promoCode:'IONPOPESCU_WIN', refCode:'REF_ION2026',
  commission:20, affId:'WP-4438301',
  balance:{available:448,yesterday:56,thisMonth:248,last30:368,total:368},
  stats:{clicks:1247,regs:89,depositors:34,revenue:1840,paid:920},
  daily:[
    {date:'06.06',clicks:145,regs:12,dep:4,rev:280},
    {date:'07.06',clicks:198,regs:18,dep:6,rev:340},
    {date:'08.06',clicks:167,regs:14,dep:5,rev:210},
    {date:'09.06',clicks:223,regs:21,dep:8,rev:410},
    {date:'10.06',clicks:189,regs:16,dep:6,rev:320},
    {date:'11.06',clicks:201,regs:19,dep:7,rev:280},
    {date:'12.06',clicks:124,regs:11,dep:4,rev:0},
  ],
  referrals:[
    {name:'@alex_md',platform:'Instagram',regs:23,rev:180,comm:5.4,date:'05.06.2026'},
    {name:'@vlad_gaming',platform:'YouTube',regs:45,rev:340,comm:10.2,date:'02.06.2026'},
    {name:'@marina_ro',platform:'TikTok',regs:12,rev:90,comm:2.7,date:'08.06.2026'},
  ],
  payments:[
    {date:'01.06.2026',amount:920,method:'Bitcoin',status:'plătit'},
    {date:'01.05.2026',amount:780,method:'Bitcoin',status:'plătit'},
  ],
  links:[
    {id:1,name:'Link principal',url:'https://winpartners.partners/go/ION2026',clicks:892,regs:67},
    {id:2,name:'TikTok campaign',url:'https://winpartners.partners/go/ION_TT',clicks:355,regs:22},
  ]
}

const MENU = [
  {id:'main',icon:'🏠',label:'Pagina principală'},
  {id:'links',icon:'🔗',label:'Link-uri Afiliați'},
  {id:'promo',icon:'🎟',label:'Coduri Promoționale'},
  {id:'stats',icon:'📊',label:'Statistici'},
  {id:'report',icon:'📋',label:'Raport complet'},
  {id:'players',icon:'👥',label:'Raport jucători'},
  {id:'subaff',icon:'🌐',label:'Sub-afiliați'},
  {id:'payments',icon:'💳',label:'Istoricul plăților'},
  {id:'account',icon:'👤',label:'Cont'},
  {id:'contact',icon:'✉',label:'Contacte'},
]

// Simple bar chart component
const BarChart = ({data, field, color, label}) => {
  const max = Math.max(...data.map(d => d[field]), 1)
  return (
    <div>
      <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:8}}>{label}</div>
      <div style={{display:'flex',alignItems:'flex-end',gap:4,height:80}}>
        {data.map(r => (
          <div key={r.date} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
            <div style={{width:'100%',background:r[field]>0?color:'rgba(255,255,255,0.05)',borderRadius:'2px 2px 0 0',height:Math.max(r[field]/max*70,2)+'px',transition:'height .3s'}}/>
            <div style={{fontSize:9,color:'rgba(255,255,255,0.3)',transform:'rotate(-45deg)',transformOrigin:'center',marginTop:2}}>{r.date}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [page, setPage] = useState('main')
  const [period, setPeriod] = useState('1luna')
  const [currency, setCurrency] = useState('USD')
  const [copied, setCopied] = useState('')
  const [showPay, setShowPay] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [payAddr, setPayAddr] = useState('')
  const [payMethod, setPayMethod] = useState('Bitcoin')
  const [codeText, setCodeText] = useState('')
  const [paySent, setPaySent] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [sideOpen, setSideOpen] = useState(true)
  const nav = useNavigate()

  const copy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(()=>setCopied(''),2000) })
  }

  const inp = {width:'100%',padding:'8px 12px',fontSize:13,border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,background:'rgba(255,255,255,0.05)',color:'#e2e8f0',outline:'none',boxSizing:'border-box'}
  const th = {textAlign:'left',padding:'8px 12px',color:'rgba(255,255,255,0.35)',fontWeight:400,borderBottom:'1px solid rgba(255,255,255,0.07)',fontSize:11,textTransform:'uppercase',letterSpacing:'.05em'}
  const td = {padding:'8px 12px',borderBottom:'1px solid rgba(255,255,255,0.04)',color:'#e2e8f0',fontSize:13}

  const refLink = `https://winpartners.partners/register?ref=${d.refCode}`

  return (
    <div style={{background:'#070710',minHeight:'100vh',color:'#fff',fontFamily:'Inter,sans-serif',display:'flex',flexDirection:'column'}}>

      {/* TOP NAV */}
      <div style={{background:'#0d0d20',borderBottom:'1px solid rgba(255,255,255,0.08)',height:56,display:'flex',alignItems:'center',padding:'0 1.5rem',gap:16,flexShrink:0,zIndex:10}}>
        <button style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer',fontSize:18,padding:4}} onClick={()=>setSideOpen(s=>!s)}>☰</button>
        <div style={{fontSize:18,fontWeight:900,cursor:'pointer'}} onClick={()=>nav('/')}>WIN<span style={{color:gold}}>PARTNERS</span></div>
        <div style={{flex:1}}/>
        <div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(245,166,35,0.1)',border:'1px solid rgba(245,166,35,0.2)',borderRadius:6,padding:'4px 12px'}}>
          <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Aff ID:</span>
          <span style={{fontSize:13,fontWeight:700,color:gold,fontFamily:'monospace'}}>{d.affId}</span>
        </div>
        <button style={{background:'rgba(245,166,35,0.15)',border:'1px solid rgba(245,166,35,0.3)',borderRadius:6,padding:'6px 14px',fontSize:12,fontWeight:700,color:gold,cursor:'pointer'}} onClick={()=>{}}>↻ ACTUALIZARE</button>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:30,height:30,borderRadius:'50%',background:`linear-gradient(135deg,${gold},#e08600)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'#000'}}>{d.name[0]}</div>
          <div style={{fontSize:12}}>
            <div style={{fontWeight:600}}>{d.name}</div>
            <div style={{color:'rgba(255,255,255,0.4)',fontSize:10}}>@{d.username}</div>
          </div>
        </div>
        <button style={{background:'none',border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,padding:'5px 12px',fontSize:12,color:'#94a3b8',cursor:'pointer'}} onClick={()=>nav('/')}>Logout</button>
      </div>

      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {/* SIDEBAR */}
        {sideOpen && (
          <div style={{width:220,background:'#0d0d20',borderRight:'1px solid rgba(255,255,255,0.06)',flexShrink:0,overflowY:'auto',paddingTop:8}}>
            <div style={{padding:'8px 16px',fontSize:10,color:'rgba(255,255,255,0.25)',textTransform:'uppercase',letterSpacing:'.1em',marginTop:8}}>MENIU PRINCIPAL</div>
            {MENU.map(m => (
              <div key={m.id} onClick={()=>setPage(m.id)} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 16px',cursor:'pointer',background:page===m.id?'rgba(245,166,35,0.1)':'none',borderLeft:page===m.id?`3px solid ${gold}`:'3px solid transparent',color:page===m.id?gold:'rgba(255,255,255,0.55)',fontSize:13,transition:'all .15s'}}>
                <span style={{fontSize:15}}>{m.icon}</span>
                <span>{m.label}</span>
              </div>
            ))}
            <div style={{padding:'8px 16px',fontSize:10,color:'rgba(255,255,255,0.25)',textTransform:'uppercase',letterSpacing:'.1em',marginTop:16}}>RAPOARTE</div>
            {[{id:'rezumat',icon:'📈',label:'Rezumat'},{id:'complet',icon:'📄',label:'Raport complet'}].map(m=>(
              <div key={m.id} onClick={()=>setPage(m.id)} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 16px',cursor:'pointer',background:page===m.id?'rgba(245,166,35,0.1)':'none',borderLeft:page===m.id?`3px solid ${gold}`:'3px solid transparent',color:page===m.id?gold:'rgba(255,255,255,0.55)',fontSize:13}}>
                <span style={{fontSize:15}}>{m.icon}</span>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* MAIN CONTENT */}
        <div style={{flex:1,overflowY:'auto',padding:'1.5rem'}}>

          {/* PAGINA PRINCIPALA */}
          {page==='main' && (
            <div>
              <h2 style={{fontSize:18,fontWeight:700,marginBottom:'1.5rem'}}>Pagina principală</h2>

              {/* Balance cards */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:1,background:'rgba(255,255,255,0.06)',borderRadius:10,overflow:'hidden',marginBottom:'1.5rem'}}>
                {[
                  ['DISPONIBIL RETRAGERE','$'+d.balance.available,'#10b981','💰'],
                  ['IERI','$'+d.balance.yesterday,'#3b82f6','⚡'],
                  ['LUNA CURENTĂ','$'+d.balance.thisMonth,'#f59e0b','📅'],
                  ['30 ZILE','$'+d.balance.last30,'#8b5cf6','🗓'],
                  ['TOTAL','$'+d.balance.total,'#10b981','✓'],
                ].map(([l,v,c,icon]) => (
                  <div key={l} style={{background:'#0d0d20',padding:'1rem',textAlign:'center'}}>
                    <div style={{fontSize:24,fontWeight:900,color:c,marginBottom:4}}>{v}</div>
                    <div style={{fontSize:10,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'.06em'}}>{icon} {l}</div>
                  </div>
                ))}
              </div>

              {/* Period filter */}
              <div style={{display:'flex',gap:12,marginBottom:'1.5rem',alignItems:'center'}}>
                <div style={{fontSize:13,color:'rgba(255,255,255,0.5)'}}>Perioada:</div>
                <select style={{...inp,width:'auto',padding:'6px 12px'}} value={period} onChange={e=>setPeriod(e.target.value)}>
                  {['1 zi','7 zile','1 lună','3 luni','6 luni','1 an'].map(p=><option key={p} style={{background:'#1a1a2e'}}>{p}</option>)}
                </select>
                <div style={{fontSize:13,color:'rgba(255,255,255,0.5)'}}>Valută:</div>
                <select style={{...inp,width:'auto',padding:'6px 12px'}} value={currency} onChange={e=>setCurrency(e.target.value)}>
                  {['USD','EUR','MDL'].map(c=><option key={c} style={{background:'#1a1a2e'}}>{c}</option>)}
                </select>
                <button style={{padding:'6px 16px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:gold,color:'#000'}}>APLICĂ</button>
              </div>

              {/* Charts */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:'1.5rem'}}>
                <div style={{background:'#0d0d20',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:'1.25rem'}}>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:'1rem'}}>Statistici conversii</div>
                  <BarChart data={d.daily} field="clicks" color="#3b82f6" label="Click-uri"/>
                  <div style={{marginTop:12}}>
                    <BarChart data={d.daily} field="regs" color="#10b981" label="Înregistrări"/>
                  </div>
                </div>
                <div style={{background:'#0d0d20',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:'1.25rem'}}>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:'1rem'}}>Statistici înregistrare</div>
                  <BarChart data={d.daily} field="dep" color="#ef4444" label="Depunători noi"/>
                  <div style={{marginTop:12}}>
                    <BarChart data={d.daily} field="rev" color={gold} label="Venit net ($)"/>
                  </div>
                </div>
              </div>

              {/* Summary table */}
              <div style={{background:'#0d0d20',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,overflow:'hidden'}}>
                <div style={{padding:'12px 16px',borderBottom:'1px solid rgba(255,255,255,0.06)',fontSize:13,fontWeight:700}}>Sumarul statisticilor</div>
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse'}}>
                    <thead><tr>
                      {['Valută','Vizualizări','Clickuri','Linkuri directe','Înregistrări','Depunători noi','Profitul companiei','Suma comisionului'].map(h=><th key={h} style={th}>{h}</th>)}
                    </tr></thead>
                    <tbody><tr>
                      <td style={td}>USD</td>
                      <td style={td}>—</td>
                      <td style={td}>{d.stats.clicks.toLocaleString()}</td>
                      <td style={td}>—</td>
                      <td style={td}>{d.stats.regs}</td>
                      <td style={td}>{d.stats.depositors}</td>
                      <td style={td}>${d.stats.revenue.toLocaleString()}</td>
                      <td style={{...td,color:gold,fontWeight:700}}>${Math.round(d.stats.revenue*d.commission/100).toLocaleString()}</td>
                    </tr></tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* LINK-URI AFILIATI */}
          {page==='links' && (
            <div>
              <h2 style={{fontSize:18,fontWeight:700,marginBottom:'1.5rem'}}>Link-uri Afiliați</h2>
              <div style={{background:'#0d0d20',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:'1.25rem',marginBottom:'1rem'}}>
                <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>Generează link nou</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:10,alignItems:'end'}}>
                  <div>
                    <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:4}}>Nume campanie</div>
                    <input style={inp} placeholder="ex: TikTok Iunie"/>
                  </div>
                  <div>
                    <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:4}}>Cazinourl</div>
                    <select style={inp}>
                      <option style={{background:'#1a1a2e'}}>Melbet</option>
                      <option style={{background:'#1a1a2e'}}>1xBet</option>
                    </select>
                  </div>
                  <button style={{padding:'8px 16px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:gold,color:'#000',whiteSpace:'nowrap'}}>Generează</button>
                </div>
              </div>
              <div style={{background:'#0d0d20',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>{['Nume','Link','Click-uri','Înregistrări','Acțiuni'].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                  <tbody>{d.links.map(l=>(
                    <tr key={l.id}>
                      <td style={{...td,fontWeight:600}}>{l.name}</td>
                      <td style={{...td,fontFamily:'monospace',fontSize:11,color:'rgba(255,255,255,0.5)'}}>{l.url}</td>
                      <td style={td}>{l.clicks}</td>
                      <td style={td}>{l.regs}</td>
                      <td style={td}>
                        <button style={{padding:'4px 10px',fontSize:11,fontWeight:700,cursor:'pointer',border:'none',borderRadius:4,background:copied===l.id?'#10b981':gold,color:'#000'}} onClick={()=>copy(l.url,l.id)}>{copied===l.id?'✓ Copiat':'Copiază'}</button>
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {/* CODURI PROMOTIONALE */}
          {page==='promo' && (
            <div>
              <h2 style={{fontSize:18,fontWeight:700,marginBottom:'1.5rem'}}>Coduri Promoționale</h2>
              <div style={{background:'rgba(245,166,35,0.08)',border:'1px solid rgba(245,166,35,0.2)',borderRadius:10,padding:'1.5rem',marginBottom:'1.5rem'}}>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:6,textTransform:'uppercase',letterSpacing:'.08em'}}>Codul tău activ</div>
                <div style={{fontSize:32,fontWeight:900,color:gold,fontFamily:'monospace',letterSpacing:'.05em',marginBottom:12}}>{d.promoCode}</div>
                <div style={{display:'flex',gap:8}}>
                  <button style={{padding:'8px 16px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:copied==='promo'?'#10b981':gold,color:'#000'}} onClick={()=>copy(d.promoCode,'promo')}>{copied==='promo'?'✓ Copiat!':'Copiază codul'}</button>
                  <button style={{padding:'8px 16px',fontSize:13,fontWeight:600,cursor:'pointer',border:`1px solid ${gold}`,borderRadius:6,background:'none',color:gold}} onClick={()=>setShowCode(true)}>Cere cod personalizat</button>
                </div>
              </div>
              <div style={{background:'#0d0d20',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:'1.25rem'}}>
                <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>Ce este codul promoțional?</div>
                <p style={{fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.7}}>Clienții pot introduce codul promoțional în timp ce se înregistrează pe site, care îi leagă automat de tine. Nu este necesar ca noii clienți să urmeze un link afiliat la site. Distribuie codul pe TikTok, Instagram, YouTube sau Telegram — în videoclipuri, bio și descrieri.</p>
              </div>
            </div>
          )}

          {/* STATISTICI */}
          {page==='stats' && (
            <div>
              <h2 style={{fontSize:18,fontWeight:700,marginBottom:'1.5rem'}}>Statistici detaliate</h2>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:'1.5rem'}}>
                {[['Ieri',d.daily[d.daily.length-1]],['Ultima săptămână',{clicks:1258,regs:101,dep:36,rev:1560}],['Luna curentă',{clicks:1247,regs:89,dep:34,rev:1840}]].map(([period,data])=>(
                  <div key={period} style={{background:'#0d0d20',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:'1.25rem'}}>
                    <div style={{fontSize:12,fontWeight:700,color:gold,marginBottom:12,textTransform:'uppercase',letterSpacing:'.05em'}}>{period}</div>
                    {[['Click-uri',data.clicks],['Înregistrări',data.regs],['Depunători',data.dep],['Venit net','$'+data.rev],['Comisionul meu','$'+Math.round(data.rev*0.2)]].map(([l,v])=>(
                      <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                        <span style={{fontSize:12,color:'rgba(255,255,255,0.5)'}}>{l}</span>
                        <span style={{fontSize:12,fontWeight:600,color:'#fff'}}>{v}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{background:'#0d0d20',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>{['Data','Click-uri','Înregistrări','Depunători noi','Venit net','Comisionul meu (20%)'].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                  <tbody>{d.daily.map(r=>(
                    <tr key={r.date}>
                      <td style={td}>{r.date}</td>
                      <td style={td}>{r.clicks}</td>
                      <td style={td}>{r.regs}</td>
                      <td style={td}>{r.dep}</td>
                      <td style={td}>${r.rev}</td>
                      <td style={{...td,color:r.rev>0?gold:'rgba(255,255,255,0.3)',fontWeight:700}}>{r.rev>0?'$'+Math.round(r.rev*0.2):'—'}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-AFILIATI */}
          {page==='subaff' && (
            <div>
              <h2 style={{fontSize:18,fontWeight:700,marginBottom:'1.5rem'}}>Sub-afiliați (Referrali)</h2>
              <div style={{background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:10,padding:'1.25rem',marginBottom:'1.5rem'}}>
                <div style={{fontSize:13,fontWeight:700,color:'#10b981',marginBottom:8}}>💰 Câștigă 3% din câștigurile bloggerilor pe care îi inviți!</div>
                <p style={{fontSize:13,color:'rgba(255,255,255,0.6)',lineHeight:1.7,marginBottom:12}}>Distribuie linkul tău de referral. Când un blogger se înregistrează prin linkul tău și începe să câștige, tu primești automat 3% din comisioanele lui — pe viață, fără niciun efort.</p>
                <div style={{background:'rgba(0,0,0,0.3)',borderRadius:8,padding:'8px 12px',fontFamily:'monospace',fontSize:12,color:gold,marginBottom:8,wordBreak:'break-all'}}>{refLink}</div>
                <button style={{padding:'7px 16px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:copied==='ref'?'#10b981':gold,color:'#000'}} onClick={()=>copy(refLink,'ref')}>{copied==='ref'?'✓ Copiat!':'Copiează linkul de referral'}</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:'1.5rem'}}>
                {[['Bloggeri invitați',d.referrals.length,'#3b82f6'],['Total câștigat','$'+d.referrals.reduce((s,r)=>s+r.comm,0).toFixed(2),'#10b981'],['Comision','3%',gold]].map(([l,v,c])=>(
                  <div key={l} style={{background:'#0d0d20',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:'1.25rem',textAlign:'center'}}>
                    <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>{l}</div>
                    <div style={{fontSize:26,fontWeight:800,color:c}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{background:'#0d0d20',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>{['Blogger','Platformă','Data','Înregistrări','Câștigurile lui','Comisionul meu (3%)'].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                  <tbody>{d.referrals.map(r=>(
                    <tr key={r.name}>
                      <td style={{...td,fontWeight:600}}>{r.name}</td>
                      <td style={td}>{r.platform}</td>
                      <td style={{...td,color:'rgba(255,255,255,0.4)'}}>{r.date}</td>
                      <td style={td}>{r.regs}</td>
                      <td style={td}>${r.rev}</td>
                      <td style={{...td,color:'#10b981',fontWeight:700}}>${r.comm.toFixed(2)}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {/* ISTORICUL PLATILOR */}
          {page==='payments' && (
            <div>
              <h2 style={{fontSize:18,fontWeight:700,marginBottom:'1.5rem'}}>Istoricul plăților</h2>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:'1.5rem'}}>
                {[['Total câștigat','$'+Math.round(d.stats.revenue*d.commission/100),gold],['Total plătit','$'+d.stats.paid,'#10b981'],['Disponibil','$'+d.balance.available,'#f59e0b']].map(([l,v,c])=>(
                  <div key={l} style={{background:'#0d0d20',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:'1.25rem',textAlign:'center'}}>
                    <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>{l}</div>
                    <div style={{fontSize:28,fontWeight:800,color:c}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
                <button onClick={()=>setShowPay(true)} style={{padding:'13px 36px',fontSize:15,fontWeight:700,cursor:'pointer',border:'none',borderRadius:8,background:gold,color:'#000'}}>
                  Solicită plată → ${d.balance.available}
                </button>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.3)',marginTop:6}}>Minimum $30 · Bitcoin, Skrill, Neteller, Visa · 48 ore</div>
              </div>
              <div style={{background:'#0d0d20',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>{['Data','Sumă','Metodă','Status'].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                  <tbody>{d.payments.map((p,i)=>(
                    <tr key={i}>
                      <td style={td}>{p.date}</td>
                      <td style={{...td,fontWeight:600,color:'#10b981'}}>${p.amount}</td>
                      <td style={td}>{p.method}</td>
                      <td style={td}><span style={{background:'#10b98122',color:'#10b981',padding:'2px 8px',borderRadius:4,fontSize:11,fontWeight:600}}>{p.status}</span></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {/* CONT */}
          {page==='account' && (
            <div>
              <h2 style={{fontSize:18,fontWeight:700,marginBottom:'1.5rem'}}>Contul meu</h2>
              <div style={{background:'#0d0d20',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:'1.5rem',maxWidth:500}}>
                {[['Nume complet',d.name],['Username','@'+d.username],['Platformă principală',d.platform],['Cod promoțional',d.promoCode],['ID Afiliat',d.affId],['Comision','20% RevShare']].map(([l,v])=>(
                  <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                    <span style={{fontSize:13,color:'rgba(255,255,255,0.5)'}}>{l}</span>
                    <span style={{fontSize:13,fontWeight:600,color:'#fff'}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTACT */}
          {page==='contact' && (
            <div>
              <h2 style={{fontSize:18,fontWeight:700,marginBottom:'1.5rem'}}>Contacte</h2>
              <div style={{background:'#0d0d20',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:'1.5rem',maxWidth:500}}>
                {[['📧 Email','support@winpartners.partners'],['💬 Telegram','@winpartners_support'],['📱 WhatsApp','+373 XX XXX XXX'],['🕐 Program','24/7, 365 zile/an']].map(([l,v])=>(
                  <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                    <span style={{fontSize:13,color:'rgba(255,255,255,0.5)'}}>{l}</span>
                    <span style={{fontSize:13,color:gold}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DEFAULT pages */}
          {!['main','links','promo','stats','subaff','payments','account','contact'].includes(page) && (
            <div style={{textAlign:'center',padding:'4rem',color:'rgba(255,255,255,0.3)'}}>
              <div style={{fontSize:48,marginBottom:16}}>📊</div>
              <div style={{fontSize:16,fontWeight:600,marginBottom:8,color:'rgba(255,255,255,0.5)'}}>Secțiune în construcție</div>
              <div style={{fontSize:13}}>Această secțiune va fi disponibilă curând.</div>
            </div>
          )}

        </div>
      </div>

      {/* PAY MODAL */}
      {showPay && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200}} onClick={()=>setShowPay(false)}>
          <div style={{background:'#0d0d20',border:'1px solid rgba(245,166,35,0.2)',borderRadius:16,padding:'1.5rem',width:'100%',maxWidth:400}} onClick={e=>e.stopPropagation()}>
            {paySent ? (
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:48,marginBottom:12}}>✅</div>
                <h3 style={{color:'#fff',fontWeight:700,marginBottom:8}}>Cerere trimisă!</h3>
                <p style={{color:'rgba(255,255,255,0.5)',fontSize:13,marginBottom:20}}>Plata va fi procesată în 48 ore.</p>
                <button style={{padding:'10px 24px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:gold,color:'#000'}} onClick={()=>{setShowPay(false);setPaySent(false)}}>Închide</button>
              </div>
            ) : (
              <>
                <h3 style={{color:'#fff',fontWeight:700,marginBottom:4}}>Solicită plată</h3>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginBottom:16}}>Disponibil: <strong style={{color:gold}}>${d.balance.available}</strong></p>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:4}}>Metodă</div>
                <select style={{...inp,marginBottom:12}} value={payMethod} onChange={e=>setPayMethod(e.target.value)}>
                  {['Bitcoin','Skrill','Neteller','PAYEER','Transfer bancar'].map(m=><option key={m} style={{background:'#1a1a2e'}}>{m}</option>)}
                </select>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:4}}>Adresa {payMethod}</div>
                <input style={{...inp,marginBottom:16}} placeholder={payMethod==='Bitcoin'?'bc1q...':'Cont/email'} value={payAddr} onChange={e=>setPayAddr(e.target.value)}/>
                <button style={{width:'100%',padding:'12px',fontSize:14,fontWeight:700,cursor:'pointer',border:'none',borderRadius:8,background:gold,color:'#000'}} onClick={()=>payAddr&&setPaySent(true)}>Trimite cererea</button>
                <button style={{width:'100%',padding:'10px',fontSize:13,cursor:'pointer',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,background:'none',color:'#94a3b8',marginTop:8}} onClick={()=>setShowPay(false)}>Anulează</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* CODE MODAL */}
      {showCode && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200}} onClick={()=>setShowCode(false)}>
          <div style={{background:'#0d0d20',border:'1px solid rgba(245,166,35,0.2)',borderRadius:16,padding:'1.5rem',width:'100%',maxWidth:380}} onClick={e=>e.stopPropagation()}>
            {codeSent ? (
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:48,marginBottom:12}}>✅</div>
                <h3 style={{color:'#fff',fontWeight:700,marginBottom:8}}>Cerere trimisă!</h3>
                <p style={{color:'rgba(255,255,255,0.5)',fontSize:13,marginBottom:20}}>Codul personalizat va fi activat în 24-48 ore.</p>
                <button style={{padding:'10px 24px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:gold,color:'#000'}} onClick={()=>{setShowCode(false);setCodeSent(false)}}>Închide</button>
              </div>
            ) : (
              <>
                <h3 style={{color:'#fff',fontWeight:700,marginBottom:4}}>Cere cod personalizat</h3>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginBottom:16}}>Procesare în 24-48 ore.</p>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:4}}>Codul dorit</div>
                <input style={{...inp,marginBottom:16,textTransform:'uppercase',fontFamily:'monospace',fontSize:15,fontWeight:700}} placeholder="ex: IONEL" value={codeText} onChange={e=>setCodeText(e.target.value.toUpperCase())}/>
                <button style={{width:'100%',padding:'12px',fontSize:14,fontWeight:700,cursor:'pointer',border:'none',borderRadius:8,background:gold,color:'#000'}} onClick={()=>codeText&&setCodeSent(true)}>Trimite</button>
                <button style={{width:'100%',padding:'10px',fontSize:13,cursor:'pointer',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,background:'none',color:'#94a3b8',marginTop:8}} onClick={()=>setShowCode(false)}>Anulează</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
