import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const gold = '#f5a623'
const bg = '#0b0b18'
const bgCard = '#13132a'
const bgSide = '#0f0f22'
const border = 'rgba(255,255,255,0.07)'

const BLOGGER = {
  name:'Ion Popescu', username:'ionpopescu', platform:'TikTok',
  promoCode:'IONPOPESCU_WIN', refCode:'REF_ION2026', affId:'WP-4438301',
  commission:20,
  bal:{available:448,yesterday:56,month:248,days30:368,total:368},
  daily:[
    {d:'06.06',cl:145,rg:12,dp:4,rv:280},
    {d:'07.06',cl:198,rg:18,dp:6,rv:340},
    {d:'08.06',cl:167,rg:14,dp:5,rv:210},
    {d:'09.06',cl:223,rg:21,dp:8,rv:410},
    {d:'10.06',cl:189,rg:16,dp:6,rv:320},
    {d:'11.06',cl:201,rg:19,dp:7,rv:280},
    {d:'12.06',cl:124,rg:11,dp:4,rv:0},
  ],
  refs:[
    {name:'@alex_md',pl:'Instagram',rg:23,rv:180,cm:5.4,dt:'05.06.2026'},
    {name:'@vlad_gaming',pl:'YouTube',rg:45,rv:340,cm:10.2,dt:'02.06.2026'},
    {name:'@marina_ro',pl:'TikTok',rg:12,rv:90,cm:2.7,dt:'08.06.2026'},
  ],
  pays:[
    {dt:'01.06.2026',am:920,mt:'Bitcoin',st:'Plătit'},
    {dt:'01.05.2026',am:780,mt:'Bitcoin',st:'Plătit'},
  ],
}

const MENU_ITEMS = [
  {id:'main',   label:'Pagina principală'},
  {id:'sites',  label:'Site-uri'},
  {id:'comm',   label:'Structura comisionului'},
  {id:'pays',   label:'Istoricul plăților'},
  {id:'account',label:'Cont'},
  {id:'contact',label:'Contacte'},
  {id:'links',  label:'Link-uri Afiliați'},
  {id:'promo',  label:'Coduri Promoționale'},
  {id:'media',  label:'Media'},
  {id:'summary',label:'Rezumat'},
  {id:'report', label:'Raport complet'},
  {id:'mkttools',label:'Instrumente de marketing'},
  {id:'players',label:'Raport despre jucători'},
  {id:'subaff', label:'Raport despre sub-afiliați'},
]

// Line chart SVG
function LineChart({data, field, color, h=80}) {
  if (!data.length) return null
  const vals = data.map(d => d[field])
  const max = Math.max(...vals, 1)
  const min = 0
  const W = 300, H = h
  const pts = data.map((d,i) => [
    (i/(data.length-1))*W,
    H - ((d[field]-min)/(max-min))*(H-8) - 4
  ])
  const path = pts.map((p,i) => (i===0?`M${p[0]},${p[1]}`:`L${p[0]},${p[1]}`)).join(' ')
  const area = `${path} L${W},${H} L0,${H} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:h}}>
      <defs>
        <linearGradient id={`g${field}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#g${field})`}/>
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      {pts.map((p,i) => <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill={color}/>)}
    </svg>
  )
}

export default function Dashboard() {
  const [page, setPage] = useState('main')
  const [period, setPeriod] = useState('1 lună')
  const [currency, setCurrency] = useState('USD')
  const [copied, setCopied] = useState('')
  const [showPay, setShowPay] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [payAddr, setPayAddr] = useState('')
  const [payMethod, setPayMethod] = useState('Bitcoin')
  const [codeText, setCodeText] = useState('')
  const [paySent, setPaySent] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const nav = useNavigate()
  const D = BLOGGER

  const copy = (t,k) => { navigator.clipboard.writeText(t).then(()=>{setCopied(k);setTimeout(()=>setCopied(''),2000)}) }
  const refLink = `https://winpartners.partners/register?ref=${D.refCode}`

  const inp = {width:'100%',padding:'7px 10px',fontSize:12,border:`1px solid ${border}`,borderRadius:5,background:'rgba(255,255,255,0.04)',color:'#e2e8f0',outline:'none',boxSizing:'border-box'}
  const TH = {textAlign:'left',padding:'8px 14px',color:'rgba(255,255,255,0.3)',fontWeight:400,borderBottom:`1px solid ${border}`,fontSize:11,textTransform:'uppercase',letterSpacing:'.06em',whiteSpace:'nowrap'}
  const TD = {padding:'8px 14px',borderBottom:`1px solid rgba(255,255,255,0.03)`,color:'#d1d5db',fontSize:12}

  const Section = ({title, children}) => (
    <div>
      <h2 style={{fontSize:16,fontWeight:700,color:'#fff',marginBottom:'1.25rem',paddingBottom:'0.75rem',borderBottom:`1px solid ${border}`}}>{title}</h2>
      {children}
    </div>
  )

  return (
    <div style={{background:bg,minHeight:'100vh',color:'#fff',fontFamily:'"Inter",-apple-system,sans-serif',display:'flex',flexDirection:'column',fontSize:13}}>

      {/* TOP BAR */}
      <div style={{background:bgSide,borderBottom:`1px solid ${border}`,height:52,display:'flex',alignItems:'center',padding:'0 1.25rem',gap:12,flexShrink:0,zIndex:10}}>
        {/* Logo */}
        <div style={{display:'flex',alignItems:'center',gap:8,marginRight:8,cursor:'pointer'}} onClick={()=>nav('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" fill={gold} opacity=".15" stroke={gold} strokeWidth="1.2"/>
            <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="900" fill={gold}>W</text>
          </svg>
          <span style={{fontSize:15,fontWeight:800,letterSpacing:'.02em'}}><span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span></span>
        </div>

        {/* Badges */}
        <div style={{display:'flex',alignItems:'center',gap:6,background:'rgba(245,166,35,0.08)',border:`1px solid rgba(245,166,35,0.18)`,borderRadius:5,padding:'3px 10px'}}>
          <span style={{fontSize:10,color:'rgba(255,255,255,0.35)'}}>Aff ID:</span>
          <span style={{fontSize:12,fontWeight:700,color:gold,fontFamily:'monospace'}}>{D.affId}</span>
        </div>

        <div style={{flex:1}}/>

        <button style={{background:`rgba(245,166,35,0.12)`,border:`1px solid rgba(245,166,35,0.25)`,borderRadius:5,padding:'5px 12px',fontSize:11,fontWeight:700,color:gold,cursor:'pointer',display:'flex',alignItems:'center',gap:5}}>
          ↻ ACTUALIZARE STATISTICI
        </button>

        {/* User */}
        <div style={{display:'flex',alignItems:'center',gap:8,borderLeft:`1px solid ${border}`,paddingLeft:12}}>
          <div style={{width:28,height:28,borderRadius:'50%',background:`linear-gradient(135deg,${gold},#c97d00)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#000'}}>{D.name[0]}</div>
          <div>
            <div style={{fontSize:12,fontWeight:600,color:'#fff',lineHeight:1.2}}>{D.name}</div>
            <div style={{fontSize:10,color:'rgba(255,255,255,0.35)'}}>@{D.username}</div>
          </div>
          <button style={{background:'none',border:`1px solid ${border}`,borderRadius:5,padding:'4px 10px',fontSize:11,color:'rgba(255,255,255,0.4)',cursor:'pointer',marginLeft:4}} onClick={()=>nav('/')}>Logout</button>
        </div>
      </div>

      <div style={{display:'flex',flex:1,overflow:'hidden'}}>

        {/* SIDEBAR */}
        <div style={{width:206,background:bgSide,borderRight:`1px solid ${border}`,flexShrink:0,overflowY:'auto',paddingBottom:24}}>
          <div style={{padding:'12px 14px 4px',fontSize:9,color:'rgba(255,255,255,0.2)',textTransform:'uppercase',letterSpacing:'.12em',fontWeight:600}}>MENIU PRINCIPAL</div>
          {MENU_ITEMS.slice(0,6).map(m=>(
            <div key={m.id} onClick={()=>setPage(m.id)} style={{padding:'9px 14px 9px 16px',cursor:'pointer',fontSize:12,color:page===m.id?gold:'rgba(255,255,255,0.5)',background:page===m.id?'rgba(245,166,35,0.08)':'none',borderLeft:page===m.id?`2px solid ${gold}`:'2px solid transparent',transition:'all .12s',display:'flex',alignItems:'center',gap:8}}>
              {m.label}
            </div>
          ))}
          <div style={{padding:'12px 14px 4px',fontSize:9,color:'rgba(255,255,255,0.2)',textTransform:'uppercase',letterSpacing:'.12em',fontWeight:600,marginTop:4}}>COOKIE-URI</div>
          {MENU_ITEMS.slice(6,9).map(m=>(
            <div key={m.id} onClick={()=>setPage(m.id)} style={{padding:'9px 14px 9px 16px',cursor:'pointer',fontSize:12,color:page===m.id?gold:'rgba(255,255,255,0.5)',background:page===m.id?'rgba(245,166,35,0.08)':'none',borderLeft:page===m.id?`2px solid ${gold}`:'2px solid transparent',transition:'all .12s'}}>
              {m.label}
            </div>
          ))}
          <div style={{padding:'12px 14px 4px',fontSize:9,color:'rgba(255,255,255,0.2)',textTransform:'uppercase',letterSpacing:'.12em',fontWeight:600,marginTop:4}}>RAPOARTE</div>
          {MENU_ITEMS.slice(9).map(m=>(
            <div key={m.id} onClick={()=>setPage(m.id)} style={{padding:'9px 14px 9px 16px',cursor:'pointer',fontSize:12,color:page===m.id?gold:'rgba(255,255,255,0.5)',background:page===m.id?'rgba(245,166,35,0.08)':'none',borderLeft:page===m.id?`2px solid ${gold}`:'2px solid transparent',transition:'all .12s'}}>
              {m.label}
            </div>
          ))}
        </div>

        {/* CONTENT */}
        <div style={{flex:1,overflowY:'auto',padding:'1.5rem',minWidth:0}}>

          {/* PAGINA PRINCIPALA */}
          {page==='main' && (
            <div>
              <div style={{fontSize:16,fontWeight:700,marginBottom:'1.25rem',color:'#fff'}}>Pagina principală</div>

              {/* Balance row */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:0,background:bgCard,borderRadius:8,overflow:'hidden',border:`1px solid ${border}`,marginBottom:'1.25rem'}}>
                {[
                  {l:'DISPONIBIL PENTRU RETRAGERE',v:'$'+D.bal.available,c:'#10b981',bdr:'#10b981'},
                  {l:'IERI',v:'$'+D.bal.yesterday,c:'#3b82f6',bdr:'#3b82f6'},
                  {l:'LUNA CURENTĂ',v:'$'+D.bal.month,c:'#f59e0b',bdr:'#f59e0b'},
                  {l:'30 DE ZILE',v:'$'+D.bal.days30,c:'#8b5cf6',bdr:'#8b5cf6'},
                  {l:'TOTAL',v:'$'+D.bal.total,c:'#10b981',bdr:'#10b981'},
                ].map((it,i) => (
                  <div key={it.l} style={{padding:'14px 16px',borderLeft:i>0?`1px solid ${border}`:'none',borderBottom:`3px solid ${it.bdr}`,textAlign:'center'}}>
                    <div style={{fontSize:22,fontWeight:800,color:it.c,marginBottom:4}}>{it.v}</div>
                    <div style={{fontSize:9,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'.07em',lineHeight:1.3}}>{it.l}</div>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'1.25rem',background:bgCard,borderRadius:8,padding:'10px 14px',border:`1px solid ${border}`}}>
                <span style={{fontSize:12,color:'rgba(255,255,255,0.4)',whiteSpace:'nowrap'}}>Perioada</span>
                <select style={{...inp,width:110}} value={period} onChange={e=>setPeriod(e.target.value)}>
                  {['1 zi','7 zile','1 lună','3 luni','6 luni','1 an'].map(p=><option key={p} style={{background:'#1a1a2e'}}>{p}</option>)}
                </select>
                <span style={{fontSize:12,color:'rgba(255,255,255,0.4)',whiteSpace:'nowrap'}}>Valută</span>
                <select style={{...inp,width:80}} value={currency} onChange={e=>setCurrency(e.target.value)}>
                  {['USD','EUR','MDL'].map(c=><option key={c} style={{background:'#1a1a2e'}}>{c}</option>)}
                </select>
                <button style={{padding:'6px 16px',fontSize:12,fontWeight:700,cursor:'pointer',border:'none',borderRadius:5,background:gold,color:'#000',whiteSpace:'nowrap'}}>APLICAȚI</button>
              </div>

              {/* Charts */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:'1.25rem'}}>
                {[
                  {title:'Statistici conversii',items:[{field:'cl',color:'#3b82f6',label:'Vizualizări / Clickuri'},{field:'rg',color:'#10b981',label:'Linkuri directe'}]},
                  {title:'Statistici înregistrare',items:[{field:'dp',color:'#ef4444',label:'Înregistrări / Depunători noi'},{field:'rv',color:gold,label:'Suma comisionului'}]},
                ].map(chart=>(
                  <div key={chart.title} style={{background:bgCard,border:`1px solid ${border}`,borderRadius:8,padding:'14px'}}>
                    <div style={{fontSize:13,fontWeight:600,marginBottom:12,color:'rgba(255,255,255,0.8)'}}>{chart.title}</div>
                    {chart.items.map(it=>(
                      <div key={it.field} style={{marginBottom:8}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                          <span style={{fontSize:10,color:'rgba(255,255,255,0.3)'}}>{it.label}</span>
                          <div style={{display:'flex',gap:8}}>
                            {['1 s','1 I','Toate'].map(f=><span key={f} style={{fontSize:9,color:'rgba(255,255,255,0.25)',cursor:'pointer',padding:'1px 5px',borderRadius:3,border:'1px solid rgba(255,255,255,0.1)'}}>{f}</span>)}
                          </div>
                        </div>
                        <LineChart data={D.daily} field={it.field} color={it.color} h={60}/>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Summary table */}
              <div style={{background:bgCard,border:`1px solid ${border}`,borderRadius:8,overflow:'hidden'}}>
                <div style={{padding:'10px 14px',borderBottom:`1px solid ${border}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.7)'}}>Sumarul statisticilor</span>
                  <div style={{display:'flex',gap:6}}>
                    <span style={{fontSize:10,color:'rgba(255,255,255,0.25)',padding:'2px 8px',borderRadius:3,border:`1px solid ${border}`,cursor:'pointer'}}>Ieri</span>
                  </div>
                </div>
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',minWidth:700}}>
                    <thead><tr>
                      {['Valută','Vizualizări','Clickuri','Linkuri directe','Înregistrări','Depunători noi','Profitul companiei (total)','RP','CPA','Suma comisionului'].map(h=><th key={h} style={TH}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      <tr>
                        <td style={TD}>USD</td>
                        <td style={TD}>0</td>
                        <td style={TD}>{D.daily.reduce((s,r)=>s+r.cl,0).toLocaleString()}</td>
                        <td style={TD}>0</td>
                        <td style={TD}>{D.daily.reduce((s,r)=>s+r.rg,0)}</td>
                        <td style={TD}>{D.daily.reduce((s,r)=>s+r.dp,0)}</td>
                        <td style={TD}>${D.daily.reduce((s,r)=>s+r.rv,0).toLocaleString()}</td>
                        <td style={TD}>0</td>
                        <td style={TD}>0</td>
                        <td style={{...TD,color:gold,fontWeight:700}}>${Math.round(D.daily.reduce((s,r)=>s+r.rv,0)*0.2)}</td>
                      </tr>
                      <tr style={{background:'rgba(255,255,255,0.02)'}}>
                        <td style={{...TD,fontStyle:'italic',color:'rgba(255,255,255,0.2)'}} colSpan={10}>Fără informații pentru perioada selectată</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* LINK-URI */}
          {page==='links' && (
            <Section title="Link-uri Afiliați">
              <div style={{background:bgCard,border:`1px solid ${border}`,borderRadius:8,padding:'14px',marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:600,marginBottom:10,color:'rgba(255,255,255,0.7)'}}>Generează link nou</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:10,alignItems:'end'}}>
                  <div><div style={{fontSize:10,color:'rgba(255,255,255,0.35)',marginBottom:3}}>Nume campanie</div><input style={inp} placeholder="ex: TikTok Iunie 2026"/></div>
                  <div><div style={{fontSize:10,color:'rgba(255,255,255,0.35)',marginBottom:3}}>Cazinourl</div>
                    <select style={inp}><option style={{background:'#1a1a2e'}}>Melbet</option><option style={{background:'#1a1a2e'}}>1xBet</option></select>
                  </div>
                  <button style={{padding:'7px 14px',fontSize:12,fontWeight:700,cursor:'pointer',border:'none',borderRadius:5,background:gold,color:'#000'}}>Generează</button>
                </div>
              </div>
              <div style={{background:bgCard,border:`1px solid ${border}`,borderRadius:8,overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>{['Campanie','Link','Click-uri','Înregistrări','Acțiuni'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>
                    {[{name:'Link principal',url:`https://wp.to/${D.username}`,cl:892,rg:67},{name:'TikTok campaign',url:`https://wp.to/${D.username}_tt`,cl:355,rg:22}].map((l,i)=>(
                      <tr key={i}>
                        <td style={{...TD,fontWeight:600}}>{l.name}</td>
                        <td style={{...TD,fontFamily:'monospace',fontSize:11,color:'rgba(255,255,255,0.4)'}}>{l.url}</td>
                        <td style={TD}>{l.cl}</td>
                        <td style={TD}>{l.rg}</td>
                        <td style={TD}><button style={{padding:'4px 10px',fontSize:11,fontWeight:600,cursor:'pointer',border:`1px solid rgba(245,166,35,0.3)`,borderRadius:4,background:'rgba(245,166,35,0.08)',color:gold}} onClick={()=>copy(l.url,'l'+i)}>{copied==='l'+i?'✓ Copiat':'Copiează'}</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {/* CODURI PROMO */}
          {page==='promo' && (
            <Section title="Coduri Promoționale">
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                <div style={{background:bgCard,border:`1px solid rgba(245,166,35,0.2)`,borderRadius:8,padding:'16px'}}>
                  <div style={{fontSize:10,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>Codul tău activ</div>
                  <div style={{fontSize:26,fontWeight:900,color:gold,fontFamily:'monospace',letterSpacing:'.05em',marginBottom:12}}>{D.promoCode}</div>
                  <div style={{display:'flex',gap:8}}>
                    <button style={{padding:'6px 14px',fontSize:12,fontWeight:600,cursor:'pointer',border:'none',borderRadius:5,background:copied==='promo'?'#10b981':gold,color:'#000'}} onClick={()=>copy(D.promoCode,'promo')}>{copied==='promo'?'✓ Copiat!':'Copiează codul'}</button>
                    <button style={{padding:'6px 14px',fontSize:12,fontWeight:600,cursor:'pointer',border:`1px solid rgba(245,166,35,0.3)`,borderRadius:5,background:'none',color:gold}} onClick={()=>setShowCode(true)}>Cere cod personalizat</button>
                  </div>
                </div>
                <div style={{background:bgCard,border:`1px solid ${border}`,borderRadius:8,padding:'16px'}}>
                  <div style={{fontSize:12,fontWeight:600,marginBottom:8,color:'rgba(255,255,255,0.7)'}}>Pentru ce sunt codurile promoționale?</div>
                  <p style={{fontSize:12,color:'rgba(255,255,255,0.4)',lineHeight:1.7}}>Clienții pot introduce codul promoțional în timp ce se înregistrează pe site. Nu este necesar ca noii clienți să urmeze un link afiliat la site.</p>
                </div>
              </div>
              <div style={{background:bgCard,border:`1px solid ${border}`,borderRadius:8,overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>{['ID','Site web','Valută','Cod promoțional','BTAG'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>
                    <tr>
                      <td style={TD}>11035387</td>
                      <td style={{...TD,color:'rgba(255,255,255,0.4)'}}>winpartners.partners</td>
                      <td style={TD}>USD</td>
                      <td style={{...TD,fontFamily:'monospace',color:gold,fontWeight:600}}>{D.promoCode.toLowerCase()}</td>
                      <td style={{...TD,fontFamily:'monospace',fontSize:10,color:'rgba(255,255,255,0.3)'}}>d_5666408m_2170c_{D.promoCode.toLowerCase()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {/* STATISTICI */}
          {page==='stats' && (
            <Section title="Statistici">
              <div style={{display:'flex',gap:10,marginBottom:12,alignItems:'center',background:bgCard,borderRadius:8,padding:'10px 14px',border:`1px solid ${border}`}}>
                <span style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>Perioada</span>
                <select style={{...inp,width:110}}><option style={{background:'#1a1a2e'}}>1 lună</option></select>
                <span style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>Valută</span>
                <select style={{...inp,width:80}}><option style={{background:'#1a1a2e'}}>USD</option></select>
                <button style={{padding:'6px 14px',fontSize:12,fontWeight:700,cursor:'pointer',border:'none',borderRadius:5,background:gold,color:'#000'}}>APLICAȚI</button>
              </div>
              <div style={{background:bgCard,border:`1px solid ${border}`,borderRadius:8,overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse',minWidth:700}}>
                  <thead><tr>{['Data','Click-uri','Înregistrări','Depunători noi','Venit net ($)','Comisionul meu (20%)'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>
                    {D.daily.map(r=>(
                      <tr key={r.d} style={{transition:'background .1s'}} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseOut={e=>e.currentTarget.style.background='none'}>
                        <td style={TD}>{r.d}</td>
                        <td style={TD}>{r.cl}</td>
                        <td style={TD}>{r.rg}</td>
                        <td style={TD}>{r.dp}</td>
                        <td style={TD}>${r.rv}</td>
                        <td style={{...TD,color:r.rv>0?gold:'rgba(255,255,255,0.2)',fontWeight:r.rv>0?700:400}}>{r.rv>0?'$'+Math.round(r.rv*0.2):'—'}</td>
                      </tr>
                    ))}
                    <tr style={{background:'rgba(245,166,35,0.05)',borderTop:`1px solid rgba(245,166,35,0.1)`}}>
                      <td style={{...TD,fontWeight:700,color:'rgba(255,255,255,0.7)'}}>TOTAL</td>
                      <td style={{...TD,fontWeight:600}}>{D.daily.reduce((s,r)=>s+r.cl,0)}</td>
                      <td style={{...TD,fontWeight:600}}>{D.daily.reduce((s,r)=>s+r.rg,0)}</td>
                      <td style={{...TD,fontWeight:600}}>{D.daily.reduce((s,r)=>s+r.dp,0)}</td>
                      <td style={{...TD,fontWeight:600}}>${D.daily.reduce((s,r)=>s+r.rv,0)}</td>
                      <td style={{...TD,color:gold,fontWeight:700}}>${Math.round(D.daily.reduce((s,r)=>s+r.rv,0)*0.2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {/* SUB-AFILIATI */}
          {page==='subaff' && (
            <Section title="Raport despre sub-afiliați">
              <div style={{background:'rgba(16,185,129,0.05)',border:'1px solid rgba(16,185,129,0.15)',borderRadius:8,padding:'14px',marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:600,color:'#10b981',marginBottom:6}}>Câștigă 3% din comisioanele bloggerilor pe care îi inviți!</div>
                <p style={{fontSize:12,color:'rgba(255,255,255,0.5)',lineHeight:1.7,marginBottom:10}}>Distribuie linkul tău de referral. Când un blogger se înregistrează și câștigă, tu primești automat 3% din comisioanele lui — pe viață.</p>
                <div style={{fontFamily:'monospace',fontSize:11,color:gold,background:'rgba(0,0,0,0.3)',padding:'6px 10px',borderRadius:5,marginBottom:8,wordBreak:'break-all'}}>{refLink}</div>
                <button style={{padding:'6px 14px',fontSize:12,fontWeight:600,cursor:'pointer',border:'none',borderRadius:5,background:copied==='ref'?'#10b981':gold,color:'#000'}} onClick={()=>copy(refLink,'ref')}>{copied==='ref'?'✓ Copiat!':'Copiează linkul'}</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:12}}>
                {[['Bloggeri invitați',D.refs.length,'#3b82f6'],['Total câștigat','$'+D.refs.reduce((s,r)=>s+r.cm,0).toFixed(2),'#10b981'],['Comision referral','3%',gold]].map(([l,v,c])=>(
                  <div key={l} style={{background:bgCard,border:`1px solid ${border}`,borderRadius:8,padding:'14px',textAlign:'center'}}>
                    <div style={{fontSize:9,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:5}}>{l}</div>
                    <div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{background:bgCard,border:`1px solid ${border}`,borderRadius:8,overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>{['Blogger','Platformă','Data','Înregistrări','Câștigurile lui','Comisionul meu (3%)'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>{D.refs.map(r=>(
                    <tr key={r.name} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseOut={e=>e.currentTarget.style.background='none'}>
                      <td style={{...TD,fontWeight:600}}>{r.name}</td>
                      <td style={TD}>{r.pl}</td>
                      <td style={{...TD,color:'rgba(255,255,255,0.35)'}}>{r.dt}</td>
                      <td style={TD}>{r.rg}</td>
                      <td style={TD}>${r.rv}</td>
                      <td style={{...TD,color:'#10b981',fontWeight:600}}>${r.cm.toFixed(2)}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </Section>
          )}

          {/* ISTORICUL PLATILOR */}
          {page==='pays' && (
            <Section title="Istoricul plăților">
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:12}}>
                {[['Total câștigat','$'+Math.round(D.daily.reduce((s,r)=>s+r.rv,0)*0.2),gold],['Total plătit','$'+D.bal.available+'+ '+D.pays.reduce((s,p)=>s+p.am,0),'#10b981'],['Disponibil','$'+D.bal.available,'#f59e0b']].map(([l,v,c])=>(
                  <div key={l} style={{background:bgCard,border:`1px solid ${border}`,borderRadius:8,padding:'14px',textAlign:'center'}}>
                    <div style={{fontSize:9,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:5}}>{l}</div>
                    <div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{textAlign:'center',marginBottom:12}}>
                <button onClick={()=>setShowPay(true)} style={{padding:'10px 28px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:gold,color:'#000'}}>
                  Solicită plată → ${D.bal.available}
                </button>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.25)',marginTop:5}}>Minimum $30 · Bitcoin, Skrill, Neteller, Visa · 48 ore</div>
              </div>
              <div style={{background:bgCard,border:`1px solid ${border}`,borderRadius:8,overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>{['Data','Sumă','Metodă','Status'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>{D.pays.map((p,i)=>(
                    <tr key={i} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseOut={e=>e.currentTarget.style.background='none'}>
                      <td style={TD}>{p.dt}</td>
                      <td style={{...TD,fontWeight:600,color:'#10b981'}}>${p.am}</td>
                      <td style={TD}>{p.mt}</td>
                      <td style={TD}><span style={{background:'rgba(16,185,129,0.12)',color:'#10b981',padding:'2px 8px',borderRadius:3,fontSize:10,fontWeight:600,border:'1px solid rgba(16,185,129,0.2)'}}>{p.st}</span></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </Section>
          )}

          {/* CONT */}
          {page==='account' && (
            <Section title="Contul meu">
              <div style={{background:bgCard,border:`1px solid ${border}`,borderRadius:8,padding:'16px',maxWidth:480}}>
                {[['Nume complet',D.name],['Username','@'+D.username],['Platformă',D.platform],['Cod promoțional',D.promoCode],['ID Afiliat',D.affId],['Comision','20% RevShare']].map(([l,v])=>(
                  <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                    <span style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>{l}</span>
                    <span style={{fontSize:12,fontWeight:600,color:'#fff'}}>{v}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* CONTACT */}
          {page==='contact' && (
            <Section title="Contacte">
              <div style={{background:bgCard,border:`1px solid ${border}`,borderRadius:8,padding:'16px',maxWidth:440}}>
                {[['Email','support@winpartners.partners'],['Telegram','@winpartners_support'],['WhatsApp','+373 XX XXX XXX'],['Program','24/7, 365 zile/an']].map(([l,v])=>(
                  <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                    <span style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>{l}</span>
                    <span style={{fontSize:12,color:gold}}>{v}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* ALTE PAGINI */}
          {!['main','links','promo','stats','subaff','pays','account','contact'].includes(page) && (
            <Section title={MENU_ITEMS.find(m=>m.id===page)?.label||'Secțiune'}>
              <div style={{background:bgCard,border:`1px solid ${border}`,borderRadius:8,padding:'3rem',textAlign:'center',color:'rgba(255,255,255,0.2)',fontSize:13}}>
                Această secțiune va fi disponibilă curând.
              </div>
            </Section>
          )}

        </div>
      </div>

      {/* PAY MODAL */}
      {showPay && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:'1rem'}} onClick={()=>setShowPay(false)}>
          <div style={{background:'#13132a',border:`1px solid rgba(245,166,35,0.2)`,borderRadius:12,padding:'1.5rem',width:'100%',maxWidth:380}} onClick={e=>e.stopPropagation()}>
            {paySent ? (
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:40,marginBottom:10}}>✅</div>
                <h3 style={{color:'#fff',fontWeight:700,marginBottom:6,fontSize:16}}>Cerere trimisă!</h3>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:12,marginBottom:16}}>Plata va fi procesată în 48 ore lucrătoare.</p>
                <button style={{padding:'8px 20px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:gold,color:'#000'}} onClick={()=>{setShowPay(false);setPaySent(false)}}>Închide</button>
              </div>
            ) : (
              <>
                <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>Solicită plată</div>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:12,marginBottom:14}}>Disponibil: <strong style={{color:gold}}>${D.bal.available}</strong></p>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',marginBottom:3}}>Metodă de plată</div>
                <select style={{...inp,marginBottom:10}} value={payMethod} onChange={e=>setPayMethod(e.target.value)}>
                  {['Bitcoin','Skrill','Neteller','PAYEER','Transfer bancar'].map(m=><option key={m} style={{background:'#1a1a2e'}}>{m}</option>)}
                </select>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',marginBottom:3}}>Adresa / contul {payMethod}</div>
                <input style={{...inp,marginBottom:14}} placeholder={payMethod==='Bitcoin'?'bc1q...':'Cont/email'} value={payAddr} onChange={e=>setPayAddr(e.target.value)}/>
                <button style={{width:'100%',padding:'10px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:gold,color:'#000'}} onClick={()=>payAddr&&setPaySent(true)}>Trimite cererea</button>
                <button style={{width:'100%',padding:'8px',fontSize:12,cursor:'pointer',border:`1px solid ${border}`,borderRadius:6,background:'none',color:'rgba(255,255,255,0.35)',marginTop:6}} onClick={()=>setShowPay(false)}>Anulează</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* CODE MODAL */}
      {showCode && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:'1rem'}} onClick={()=>setShowCode(false)}>
          <div style={{background:'#13132a',border:`1px solid rgba(245,166,35,0.2)`,borderRadius:12,padding:'1.5rem',width:'100%',maxWidth:360}} onClick={e=>e.stopPropagation()}>
            {codeSent ? (
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:40,marginBottom:10}}>✅</div>
                <h3 style={{color:'#fff',fontWeight:700,marginBottom:6,fontSize:16}}>Cerere trimisă!</h3>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:12,marginBottom:16}}>Codul personalizat va fi activat în 24-48 ore.</p>
                <button style={{padding:'8px 20px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:gold,color:'#000'}} onClick={()=>{setShowCode(false);setCodeSent(false)}}>Închide</button>
              </div>
            ) : (
              <>
                <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>Cere cod personalizat</div>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:12,marginBottom:14}}>Procesare în 24-48 ore. Discutați cu managerul pentru bonusuri speciale.</p>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',marginBottom:3}}>Codul dorit (ex: IONEL, VLAD20)</div>
                <input style={{...inp,marginBottom:14,textTransform:'uppercase',fontFamily:'monospace',fontSize:14,fontWeight:700}} placeholder="IONEL" value={codeText} onChange={e=>setCodeText(e.target.value.toUpperCase())}/>
                <button style={{width:'100%',padding:'10px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:gold,color:'#000'}} onClick={()=>codeText&&setCodeSent(true)}>Trimite</button>
                <button style={{width:'100%',padding:'8px',fontSize:12,cursor:'pointer',border:`1px solid ${border}`,borderRadius:6,background:'none',color:'rgba(255,255,255,0.35)',marginTop:6}} onClick={()=>setShowCode(false)}>Anulează</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
