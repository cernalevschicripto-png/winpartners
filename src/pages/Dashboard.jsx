import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const gold = '#f5a623'
const bg = '#0b0b18'
const bgCard = '#13132a'
const bgSide = '#0f0f22'
const bdr = 'rgba(255,255,255,0.07)'

const D = {
  name:'Ion Popescu', username:'ionpopescu', platform:'TikTok',
  promoCode:'IONPOPESCU_WIN', refCode:'REF_ION2026', affId:'WP-4438301',
  commission:20, email:'ion@gmail.com', phone:'+37360484777',
  country:'Moldova', lang:'Română', messenger:'WhatsApp',
  payMethod:'Bitcoin', payAddress:'bc1qxxxxxxxxxxxxxxxxxx',
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
    {dt:'01.06.2026',am:920,mt:'Bitcoin',venituri:4600,sold:0,st:'Plătit'},
    {dt:'01.05.2026',am:780,mt:'Bitcoin',venituri:3900,sold:0,st:'Plătit'},
  ],
  links:[
    {id:1,camp:'English',subid:'',page:'/live',link:'https://melbet.com/go/WP4438301',shown:true},
  ],
  commStructure:[
    {val:'USD',struct:'Revenue Share',group:'RS25% REF3%',start:'2026-06-02',desc:'Procent comision: 25%; Comision negativ: Da; Administrator: 0%',end:''},
    {val:'USD',struct:'Refferal',group:'RS25% REF3%',start:'2026-06-02',desc:'Nivelul 1|3%; Comision negativ: Da; (2019-07-24)',end:''},
  ],
}

const MENU = [
  {id:'main',label:'Pagina principală',section:'MENIU PRINCIPAL'},
  {id:'sites',label:'Site-uri',section:''},
  {id:'comm',label:'Structura comisionului',section:''},
  {id:'pays',label:'Istoricul plăților',section:''},
  {id:'account',label:'Cont',section:''},
  {id:'contact',label:'Contacte',section:''},
  {id:'links',label:'Link-uri Afiliați',section:'COOKIE-URI DE DIRECȚIONARE/PUBLICITATE'},
  {id:'promo',label:'Coduri Promoționale',section:''},
  {id:'media',label:'Media',section:''},
  {id:'summary',label:'Rezumat',section:'RAPOARTE'},
  {id:'report',label:'Raport complet',section:''},
  {id:'mkttools',label:'Instrumente de marketing',section:''},
  {id:'players',label:'Raport despre jucători',section:''},
  {id:'subaff',label:'Raport despre sub-afiliați',section:''},
]

function LineChart({data,field,color,h=60}) {
  const vals=data.map(d=>d[field]), max=Math.max(...vals,1)
  const W=400,H=h
  const pts=data.map((d,i)=>[(i/(data.length-1))*W, H-((d[field]/max)*(H-8))-4])
  const path=pts.map((p,i)=>(i===0?`M${p[0]},${p[1]}`:`L${p[0]},${p[1]}`)).join(' ')
  const area=`${path} L${W},${H} L0,${H} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:h,overflow:'visible'}}>
      <defs>
        <linearGradient id={`g${field}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.01"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#g${field})`}/>
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill={color} stroke={bgCard} strokeWidth="1"/>)}
    </svg>
  )
}

export default function Dashboard() {
  const [page,setPage]=useState('main')
  const [period,setPeriod]=useState('1 lună')
  const [currency,setCurrency]=useState('USD')
  const [copied,setCopied]=useState('')
  const [showPay,setShowPay]=useState(false)
  const [showCode,setShowCode]=useState(false)
  const [payAddr,setPayAddr]=useState('')
  const [payMethod,setPayMethod]=useState('Bitcoin')
  const [codeText,setCodeText]=useState('')
  const [paySent,setPaySent]=useState(false)
  const [codeSent,setCodeSent]=useState(false)
  const [payTab,setPayTab]=useState('history')
  const [linkTab,setLinkTab]=useState('created')
  const [subId,setSubId]=useState('')
  const [linkCamp,setLinkCamp]=useState('English')
  const [linkPage,setLinkPage]=useState('/live')
  const nav=useNavigate()

  const copy=(t,k)=>{navigator.clipboard.writeText(t).then(()=>{setCopied(k);setTimeout(()=>setCopied(''),2000)})}
  const refLink=`https://winpartners.partners/register?ref=${D.refCode}`

  const s={
    inp:{padding:'6px 10px',fontSize:12,border:`1px solid ${bdr}`,borderRadius:4,background:'rgba(255,255,255,0.04)',color:'#e2e8f0',outline:'none'},
    btn:(bg='#f5a623',c='#000')=>({padding:'7px 16px',fontSize:12,fontWeight:700,cursor:'pointer',border:'none',borderRadius:4,background:bg,color:c}),
    btnOut:(c=gold)=>({padding:'6px 14px',fontSize:12,fontWeight:600,cursor:'pointer',border:`1px solid ${c}`,borderRadius:4,background:'none',color:c}),
    TH:{textAlign:'left',padding:'8px 12px',color:'rgba(255,255,255,0.3)',fontWeight:500,borderBottom:`1px solid ${bdr}`,fontSize:11,whiteSpace:'nowrap'},
    TD:{padding:'7px 12px',borderBottom:`1px solid rgba(255,255,255,0.03)`,color:'#c9d1d9',fontSize:12},
    card:{background:bgCard,border:`1px solid ${bdr}`,borderRadius:6,padding:'14px'},
    label:{fontSize:10,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:3,display:'block'},
    filterRow:{display:'flex',alignItems:'center',gap:10,background:bgCard,borderRadius:6,padding:'10px 14px',border:`1px solid ${bdr}`,marginBottom:12,flexWrap:'wrap'},
  }

  const totCl=D.daily.reduce((a,r)=>a+r.cl,0)
  const totRg=D.daily.reduce((a,r)=>a+r.rg,0)
  const totDp=D.daily.reduce((a,r)=>a+r.dp,0)
  const totRv=D.daily.reduce((a,r)=>a+r.rv,0)
  const totComm=Math.round(totRv*D.commission/100)

  return (
    <div style={{background:bg,minHeight:'100vh',color:'#fff',fontFamily:'"Inter",-apple-system,sans-serif',display:'flex',flexDirection:'column',fontSize:13}}>

      {/* TOP BAR */}
      <div style={{background:bgSide,borderBottom:`1px solid ${bdr}`,height:50,display:'flex',alignItems:'center',padding:'0 1rem',gap:10,flexShrink:0,zIndex:10}}>
        <div style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',marginRight:4}} onClick={()=>nav('/')}>
          <svg width="22" height="22" viewBox="0 0 22 22">
            <polygon points="11,2 20,6.5 20,15.5 11,20 2,15.5 2,6.5" fill={gold} opacity=".12" stroke={gold} strokeWidth="1.2"/>
            <text x="11" y="15" textAnchor="middle" fontSize="9" fontWeight="900" fill={gold}>W</text>
          </svg>
          <span style={{fontSize:14,fontWeight:800}}><span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span></span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(245,166,35,0.07)',border:`1px solid rgba(245,166,35,0.15)`,borderRadius:4,padding:'3px 9px',fontSize:11}}>
          <span style={{color:'rgba(255,255,255,0.3)'}}>Aff ID:</span>
          <span style={{fontWeight:700,color:gold,fontFamily:'monospace'}}>{D.affId}</span>
        </div>
        <div style={{flex:1}}/>
        <button style={{...s.btn('rgba(245,166,35,0.12)',gold),border:`1px solid rgba(245,166,35,0.2)`,fontSize:11}}>↻ ACTUALIZARE STATISTICI</button>
        <div style={{display:'flex',alignItems:'center',gap:8,borderLeft:`1px solid ${bdr}`,paddingLeft:10}}>
          <div style={{width:26,height:26,borderRadius:'50%',background:`linear-gradient(135deg,${gold},#c97d00)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#000'}}>{D.name[0]}</div>
          <div style={{lineHeight:1.2}}>
            <div style={{fontSize:12,fontWeight:600}}>{D.name}</div>
            <div style={{fontSize:10,color:'rgba(255,255,255,0.3)'}}>@{D.username}</div>
          </div>
          <button style={{...s.btnOut('rgba(255,255,255,0.3)'),fontSize:11,padding:'4px 10px'}} onClick={()=>nav('/')}>Logout</button>
        </div>
      </div>

      <div style={{display:'flex',flex:1,overflow:'hidden'}}>

        {/* SIDEBAR */}
        <div style={{width:200,background:bgSide,borderRight:`1px solid ${bdr}`,flexShrink:0,overflowY:'auto',paddingBottom:20}}>
          {MENU.map((m,i)=>(
            <div key={m.id}>
              {m.section&&<div style={{padding:m.id==='main'?'10px 12px 3px':'12px 12px 3px',fontSize:9,color:'rgba(255,255,255,0.2)',textTransform:'uppercase',letterSpacing:'.12em',fontWeight:600}}>{m.section}</div>}
              <div onClick={()=>setPage(m.id)} style={{padding:'8px 12px 8px 14px',cursor:'pointer',fontSize:12,color:page===m.id?gold:'rgba(255,255,255,0.5)',background:page===m.id?'rgba(245,166,35,0.08)':'none',borderLeft:page===m.id?`2px solid ${gold}`:'2px solid transparent',transition:'all .12s'}}>
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* CONTENT */}
        <div style={{flex:1,overflowY:'auto',padding:'1.25rem',minWidth:0}}>

          {/* PAGE TITLE */}
          <div style={{fontSize:15,fontWeight:700,color:'#fff',marginBottom:'1rem',paddingBottom:'0.625rem',borderBottom:`1px solid ${bdr}`}}>
            {MENU.find(m=>m.id===page)?.label||'Dashboard'}
          </div>

          {/* === PAGINA PRINCIPALA === */}
          {page==='main'&&(
            <div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:0,background:bgCard,borderRadius:6,overflow:'hidden',border:`1px solid ${bdr}`,marginBottom:'1rem'}}>
                {[['DISPONIBIL PENTRU RETRAGERE','$'+D.bal.available,'#10b981','#10b981'],['IERI','$'+D.bal.yesterday,'#3b82f6','#3b82f6'],['LUNA CURENTĂ','$'+D.bal.month,'#f59e0b','#f59e0b'],['30 DE ZILE','$'+D.bal.days30,'#8b5cf6','#8b5cf6'],['TOTAL','$'+D.bal.total,'#10b981','#10b981']].map(([l,v,c,bc],i)=>(
                  <div key={l} style={{padding:'12px 14px',borderLeft:i>0?`1px solid ${bdr}`:'none',borderBottom:`3px solid ${bc}`,textAlign:'center'}}>
                    <div style={{fontSize:20,fontWeight:800,color:c,marginBottom:4}}>{v}</div>
                    <div style={{fontSize:9,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'.06em',lineHeight:1.3}}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{...s.filterRow}}>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Perioada</span>
                <select style={{...s.inp,width:100}} value={period} onChange={e=>setPeriod(e.target.value)}>{['1 zi','7 zile','1 lună','3 luni','6 luni','1 an'].map(p=><option key={p} style={{background:'#1a1a2e'}}>{p}</option>)}</select>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Valută</span>
                <select style={{...s.inp,width:70}} value={currency} onChange={e=>setCurrency(e.target.value)}>{['USD','EUR','MDL'].map(c=><option key={c} style={{background:'#1a1a2e'}}>{c}</option>)}</select>
                <button style={s.btn()}>APLICAȚI</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:'1rem'}}>
                {[{title:'Statistici conversii',items:[{f:'cl',c:'#3b82f6',l:'Vizualizări'},{f:'rg',c:'#10b981',l:'Clickuri'},{f:'dp',c:'#8b5cf6',l:'Linkuri directe'}]},{title:'Statistici înregistrare',items:[{f:'rg',c:'#ef4444',l:'Înregistrări'},{f:'dp',c:'#10b981',l:'Depunători noi'},{f:'rv',c:gold,l:'Suma comisionului'}]}].map(ch=>(
                  <div key={ch.title} style={{...s.card}}>
                    <div style={{fontSize:13,fontWeight:600,marginBottom:'0.75rem',color:'rgba(255,255,255,0.75)'}}>{ch.title}</div>
                    {ch.items.map(it=>(
                      <div key={it.f} style={{marginBottom:'0.5rem'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:3}}>
                          <span style={{fontSize:10,color:'rgba(255,255,255,0.3)'}}>• {it.l}: 0</span>
                          <div style={{display:'flex',gap:4}}>{['1 s','1 I','Toate'].map(f=><span key={f} style={{fontSize:9,color:'rgba(255,255,255,0.2)',padding:'1px 5px',borderRadius:2,border:`1px solid rgba(255,255,255,0.08)`,cursor:'pointer'}}>{f}</span>)}</div>
                        </div>
                        <LineChart data={D.daily} field={it.f} color={it.c} h={55}/>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{...s.card,overflow:'hidden'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.75rem'}}>
                  <span style={{fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.7)'}}>Sumarul statisticilor</span>
                  <select style={{...s.inp}}><option style={{background:'#1a1a2e'}}>Ieri</option></select>
                </div>
                <div style={{overflow:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',minWidth:900}}>
                    <thead><tr>{['Valută','Vizualizări','Clickuri','Linkuri directe','Înregistrări','Depunători noi','Profitul companiei (total)','RP','CPA','Suma comisionului'].map(h=><th key={h} style={s.TH}>{h}</th>)}</tr></thead>
                    <tbody>
                      <tr>{[currency,'0',totCl,'0',totRg,totDp,'$'+totRv,'0','0'].map((v,i)=><td key={i} style={s.TD}>{v}</td>)}<td style={{...s.TD,color:gold,fontWeight:700}}>${totComm}</td></tr>
                      <tr><td colSpan={10} style={{...s.TD,fontStyle:'italic',color:'rgba(255,255,255,0.2)',fontSize:11}}>Fără informații pentru perioada selectată</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* === STRUCTURA COMISIONULUI === */}
          {page==='comm'&&(
            <div>
              <div style={{marginBottom:'0.75rem'}}>
                <select style={{...s.inp,padding:'5px 10px'}}><option style={{background:'#1a1a2e'}}>6 articole selectate</option></select>
              </div>
              <div style={{...s.card,overflow:'hidden'}}>
                <div style={{overflow:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse'}}>
                    <thead><tr>{['Valută','Structura comisionului','Numele grupei de comisionare','Data de început','Descriere','Dată de sfârșit'].map(h=><th key={h} style={{...s.TH,cursor:'pointer'}}>{h} ↕</th>)}</tr></thead>
                    <tbody>{D.commStructure.map((r,i)=>(
                      <tr key={i} style={{background:i%2===0?'none':'rgba(255,255,255,0.01)'}}>
                        <td style={s.TD}>{r.val}</td>
                        <td style={s.TD}>{r.struct}</td>
                        <td style={s.TD}>{r.group}</td>
                        <td style={s.TD}>{r.start}</td>
                        <td style={{...s.TD,maxWidth:400,color:'rgba(255,255,255,0.5)'}}>{r.desc}</td>
                        <td style={s.TD}>{r.end||'—'}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
                <div style={{padding:'8px 0',fontSize:11,color:'rgba(255,255,255,0.2)'}}>Înregistrări de la 1 la {D.commStructure.length} ({D.commStructure.length} înregistrări în total)</div>
              </div>
            </div>
          )}

          {/* === ISTORICUL PLATILOR === */}
          {page==='pays'&&(
            <div>
              <div style={{...s.filterRow}}>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Valută</span>
                <select style={s.inp}><option style={{background:'#1a1a2e'}}>USD</option></select>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Perioada</span>
                <select style={s.inp}><option style={{background:'#1a1a2e'}}>Perioada exactă</option></select>
                <input type="date" style={{...s.inp}} defaultValue="2026-06-13"/>
                <span style={{color:'rgba(255,255,255,0.3)'}}>→</span>
                <input type="date" style={{...s.inp}} defaultValue="2026-06-13"/>
                <button style={s.btn()}>GENERAȚI RAPORT</button>
              </div>
              <div style={{display:'flex',gap:0,marginBottom:'0.75rem',borderBottom:`1px solid ${bdr}`}}>
                {['Statusul solicitărilor','Istoricul plăților'].map((t,i)=>(
                  <button key={t} onClick={()=>setPayTab(i===0?'status':'history')} style={{padding:'8px 16px',fontSize:12,cursor:'pointer',border:'none',background:payTab===(i===0?'status':'history')?bgCard:'rgba(255,255,255,0.05)',color:payTab===(i===0?'status':'history')?'#fff':'rgba(255,255,255,0.4)',borderBottom:payTab===(i===0?'status':'history')?`2px solid ${gold}`:'2px solid transparent',fontWeight:payTab===(i===0?'status':'history')?600:400}}>{t}</button>
                ))}
                <div style={{flex:1}}/>
                <button style={{...s.btn('#ef444422','#ef4444'),border:`1px solid rgba(239,68,68,0.3)`,marginBottom:4,fontSize:11}}>EXPORT ▼</button>
              </div>
              <div style={{marginBottom:'0.75rem'}}>
                <select style={{...s.inp,padding:'5px 10px'}}><option style={{background:'#1a1a2e'}}>6 articole selectate</option></select>
              </div>
              <div style={{...s.card,overflow:'hidden',marginBottom:'1rem'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>{['Valută','Data','Plata','Venituri','Sold','Status'].map(h=><th key={h} style={{...s.TH,cursor:'pointer'}}>{h} ↕</th>)}</tr></thead>
                  <tbody>
                    {payTab==='history'&&D.pays.map((p,i)=>(
                      <tr key={i}>
                        <td style={s.TD}>USD</td>
                        <td style={s.TD}>{p.dt}</td>
                        <td style={{...s.TD,color:'#10b981',fontWeight:600}}>${p.am}</td>
                        <td style={s.TD}>${p.venituri}</td>
                        <td style={s.TD}>${p.sold}</td>
                        <td style={s.TD}><span style={{background:'rgba(16,185,129,0.1)',color:'#10b981',padding:'2px 8px',borderRadius:3,fontSize:10,fontWeight:600,border:'1px solid rgba(16,185,129,0.2)'}}>{p.st}</span></td>
                      </tr>
                    ))}
                    {payTab==='status'&&<tr><td colSpan={6} style={{...s.TD,textAlign:'center',color:'rgba(255,255,255,0.2)',padding:'24px'}}>Fără solicitări active</td></tr>}
                  </tbody>
                </table>
                <div style={{padding:'8px 0',fontSize:11,color:'rgba(255,255,255,0.2)'}}>Înregistrări de la 1 la {D.pays.length} ({D.pays.length} înregistrări în total)</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div style={{...s.card,fontSize:12,color:'rgba(255,255,255,0.5)',lineHeight:1.8}}>
                  <p style={{marginBottom:6}}>Pentru a primi plata, vă rugăm să contactați managerul dumneavoastră. Acest lucru nu va fi necesar de fiecare dată; plata automată va fi setată.</p>
                  <p><strong style={{color:'#fff'}}>Suma minimă de plată este de $30 pe săptămână</strong></p>
                  <button style={{...s.btn(),marginTop:12}} onClick={()=>setShowPay(true)}>Solicită plată → ${D.bal.available}</button>
                </div>
                <div style={{...s.card,fontSize:12,color:'rgba(255,255,255,0.5)',lineHeight:1.8}}>
                  <p>Îi puteți contacta pe managerii noștri utilizând <span style={{color:gold,cursor:'pointer'}}>datele de contact</span>, disponibile pe site-ul Program de Afiliere.</p>
                </div>
              </div>
            </div>
          )}

          {/* === CONT === */}
          {page==='account'&&(
            <div>
              <div style={{fontSize:12,marginBottom:'1rem',color:'rgba(255,255,255,0.5)'}}>Utilizator: <span style={{color:gold,fontWeight:600}}>{D.username}</span></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:'1rem'}}>
                <div style={s.card}>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:12,color:'rgba(255,255,255,0.8)'}}>Informații de contact</div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
                    <div><label style={s.label}>Prenume *</label><input style={{...s.inp,width:'100%'}} defaultValue={D.name.split(' ')[0]}/></div>
                    <div><label style={s.label}>Prenume *</label><input style={{...s.inp,width:'100%'}} defaultValue={D.name.split(' ')[1]}/></div>
                  </div>
                  <div style={{marginBottom:8}}><label style={s.label}>Număr de telefon</label><input style={{...s.inp,width:'100%'}} defaultValue={D.phone}/></div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
                    <div><label style={s.label}>Messenger</label><select style={{...s.inp,width:'100%'}}><option style={{background:'#1a1a2e'}}>WhatsApp</option></select></div>
                    <div><label style={s.label}>Număr de telefon</label><input style={{...s.inp,width:'100%'}} defaultValue={D.phone}/></div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
                    <div><label style={s.label}>Țară</label><select style={{...s.inp,width:'100%'}}><option style={{background:'#1a1a2e'}}>{D.country}</option></select></div>
                    <div><label style={s.label}>Limbă notificări</label><select style={{...s.inp,width:'100%'}}><option style={{background:'#1a1a2e'}}>{D.lang}</option></select></div>
                  </div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,0.3)',marginBottom:10}}>pentru a modifica datele de contact, vă rugăm să contactați managerul dvs.</div>
                  <button style={s.btn()}>SALVAȚI MODIFICĂRILE</button>
                </div>
                <div style={s.card}>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:12,color:'rgba(255,255,255,0.8)'}}>Detaliile plății</div>
                  <div style={{marginBottom:8}}><label style={s.label}>Metoda de plată preferată :</label><input style={{...s.inp,width:'100%'}} defaultValue={D.payMethod} readOnly/></div>
                  <div style={{marginBottom:12}}><label style={s.label}>Numărul portofelului</label><input style={{...s.inp,width:'100%'}} defaultValue={D.payAddress}/></div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,0.3)'}}>* pentru a modifica detaliile de plată, vă rugăm să contactați Asistența Pentru Parteneri.</div>
                  <div style={{marginTop:16,borderTop:`1px solid ${bdr}`,paddingTop:12}}>
                    <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>Abonamente</div>
                    <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:11,color:'rgba(255,255,255,0.5)'}}>
                      <input type="checkbox" defaultChecked/> Informațiile companiei
                    </label>
                  </div>
                </div>
                <div style={s.card}>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:12,color:'rgba(255,255,255,0.8)'}}>Modificați parola</div>
                  <div style={{marginBottom:8}}><label style={s.label}>Parola veche</label><input type="password" style={{...s.inp,width:'100%'}} placeholder="••••••••"/></div>
                  <div style={{marginBottom:8}}><label style={s.label}>Parolă nouă</label><input type="password" style={{...s.inp,width:'100%'}} placeholder="••••••••"/></div>
                  <div style={{marginBottom:12}}><label style={s.label}>Reintroduceți noua parolă</label><input type="password" style={{...s.inp,width:'100%'}} placeholder="••••••••"/></div>
                  <button style={s.btn()}>MODIFICAȚI PAROLA</button>
                  <div style={{marginTop:16,borderTop:`1px solid ${bdr}`,paddingTop:12}}>
                    <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>Gestionarea autentificării cu doi factori</div>
                    <div style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Google Authenticator activat: Nu</div>
                  </div>
                  <div style={{marginTop:12,borderTop:`1px solid ${bdr}`,paddingTop:12}}>
                    <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>Confirmarea adresei de e-mail</div>
                    <div style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Email: {D.email}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* === LINK-URI AFILIATI === */}
          {page==='links'&&(
            <div>
              <div style={{...s.filterRow}}>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Site web</span>
                <select style={{...s.inp,width:200}}><option style={{background:'#1a1a2e'}}>winpartners.partners</option></select>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Valută</span>
                <select style={s.inp}><option style={{background:'#1a1a2e'}}>USD</option></select>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Campanie</span>
                <select style={{...s.inp,width:120}} value={linkCamp} onChange={e=>setLinkCamp(e.target.value)}><option style={{background:'#1a1a2e'}}>English</option><option style={{background:'#1a1a2e'}}>Romanian</option><option style={{background:'#1a1a2e'}}>Russian</option></select>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Pagină de destinație</span>
                <input style={{...s.inp,width:80}} value={linkPage} onChange={e=>setLinkPage(e.target.value)} placeholder="/live"/>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Sub ID</span>
                <input style={{...s.inp,width:100}} value={subId} onChange={e=>setSubId(e.target.value)} placeholder="SubID"/>
                <button style={s.btn()}>GENERARE LINK</button>
              </div>
              <div style={{display:'flex',gap:0,marginBottom:'0.75rem',borderBottom:`1px solid ${bdr}`}}>
                {['Link-uri create','Link-uri ascunse'].map((t,i)=>(
                  <button key={t} onClick={()=>setLinkTab(i===0?'created':'hidden')} style={{padding:'7px 14px',fontSize:12,cursor:'pointer',border:'none',background:linkTab===(i===0?'created':'hidden')?bgCard:'rgba(255,255,255,0.04)',color:linkTab===(i===0?'created':'hidden')?'#fff':'rgba(255,255,255,0.4)',borderBottom:linkTab===(i===0?'created':'hidden')?`2px solid ${gold}`:'2px solid transparent',fontWeight:linkTab===(i===0?'created':'hidden')?600:400}}>{t}</button>
                ))}
              </div>
              <div style={{marginBottom:'0.75rem'}}>
                <select style={{...s.inp,padding:'5px 10px'}}><option style={{background:'#1a1a2e'}}>8 articole selectate</option></select>
              </div>
              <div style={{...s.card,overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>{['Nr.','Site web','Arată/Ascunde','Pagină de destinație','SubID','Campanie','Link generat','Valută'].map(h=><th key={h} style={{...s.TH,cursor:'pointer'}}>{h} ↕</th>)}</tr></thead>
                  <tbody>
                    {D.links.map((l,i)=>(
                      <tr key={i}>
                        <td style={s.TD}>{l.id}</td>
                        <td style={s.TD}>winpartners.partners</td>
                        <td style={s.TD}><span style={{background:'rgba(16,185,129,0.1)',color:'#10b981',padding:'2px 6px',borderRadius:3,fontSize:10,border:'1px solid rgba(16,185,129,0.2)'}}>Arată</span></td>
                        <td style={s.TD}>{l.page}</td>
                        <td style={s.TD}>{l.subid||'—'}</td>
                        <td style={s.TD}>{l.camp}</td>
                        <td style={{...s.TD,fontFamily:'monospace',fontSize:10,color:'rgba(255,255,255,0.5)'}}>
                          {l.link}
                          <button style={{...s.btnOut(gold),padding:'2px 8px',fontSize:10,marginLeft:6}} onClick={()=>copy(l.link,'link'+i)}>{copied==='link'+i?'✓':'Copiează'}</button>
                        </td>
                        <td style={s.TD}>USD</td>
                      </tr>
                    ))}
                    {linkTab==='hidden'&&<tr><td colSpan={8} style={{...s.TD,textAlign:'center',color:'rgba(255,255,255,0.2)',padding:'20px'}}>Fără informații</td></tr>}
                  </tbody>
                </table>
                <div style={{padding:'8px 0',fontSize:11,color:'rgba(255,255,255,0.2)'}}>Înregistrări de la 1 la {D.links.length}</div>
              </div>
            </div>
          )}

          {/* === CODURI PROMO === */}
          {page==='promo'&&(
            <div>
              <div style={{...s.filterRow}}>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Site web</span>
                <select style={{...s.inp,width:200}}><option style={{background:'#1a1a2e'}}>winpartners.partners</option></select>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Valută</span>
                <select style={s.inp}><option style={{background:'#1a1a2e'}}>USD</option></select>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Campanie</span>
                <select style={{...s.inp,width:120}}><option style={{background:'#1a1a2e'}}>English</option></select>
                <button style={s.btn()}>GENERAȚI COD PROMOȚIONAL</button>
              </div>
              <div style={{marginBottom:'0.75rem'}}>
                <select style={{...s.inp,padding:'5px 10px'}}><option style={{background:'#1a1a2e'}}>5 articole selectate</option></select>
              </div>
              <div style={{...s.card,overflow:'hidden',marginBottom:'1.25rem'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>{['ID','Site web','Valută','Cod promoțional','BTAG',''].map(h=><th key={h} style={{...s.TH,cursor:'pointer'}}>{h}{h?' ↕':''}</th>)}</tr></thead>
                  <tbody>
                    <tr>
                      <td style={s.TD}>11035387</td>
                      <td style={s.TD}>winpartners.partners</td>
                      <td style={s.TD}>USD</td>
                      <td style={{...s.TD,fontWeight:700,color:gold,fontFamily:'monospace'}}>{D.promoCode.toLowerCase()}</td>
                      <td style={{...s.TD,fontFamily:'monospace',fontSize:10,color:'rgba(255,255,255,0.35)'}}>d_5666408m_2170c_{D.promoCode.toLowerCase()}</td>
                      <td style={s.TD}>
                        <button style={{...s.btnOut(gold),padding:'3px 8px',fontSize:10}} onClick={()=>copy(D.promoCode,'promo')}>{copied==='promo'?'✓ Copiat':'Copiază'}</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div style={{padding:'8px 0',fontSize:11,color:'rgba(255,255,255,0.2)'}}>Înregistrări de la 1 la 1 (1 înregistrare în total)</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div style={{...s.card}}>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>Pentru ce sunt codurile promoționale?</div>
                  <p style={{fontSize:12,color:'rgba(255,255,255,0.45)',lineHeight:1.7,marginBottom:8}}>Clienții pot introduce codul promoțional în timp ce se înregistrează pe site, care îi leagă automat de dumneavoastră. Nu este necesar ca noii clienți să urmeze un link afiliat la site.</p>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:6}}>Cum să obțineți un cod promoțional?</div>
                  <p style={{fontSize:12,color:'rgba(255,255,255,0.45)',lineHeight:1.7,marginBottom:8}}>Selectați o monedă și o campanie și faceți click pe «Generare Cod Promoțional». Pot fi generate mai multe coduri promoționale. Dacă doriți un cod promoțional personal, vă rugăm să <span style={{color:gold,cursor:'pointer'}} onClick={()=>setShowCode(true)}>contactați Echipa de Asistență pentru Parteneri</span>.</p>
                </div>
                <div style={s.card}>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>Un bonus de înregistrare folosind un cod promoțional</div>
                  <p style={{fontSize:12,color:'rgba(255,255,255,0.45)',lineHeight:1.7,marginBottom:10}}>Discutați cu managerul dumneavoastră pentru a afla mai multe despre bonusurile acordate atunci când jucătorii dumneavoastră se înregistrează utilizând un cod promoțional.</p>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:6}}>Avantajele utilizării unui cod promoțional</div>
                  <ul style={{fontSize:12,color:'rgba(255,255,255,0.45)',lineHeight:1.8,paddingLeft:16}}>
                    <li>Un cod promoțional poate fi utilizat atunci când este imposibil să plasați un link de referal sau o reclamă</li>
                    <li>Atunci când un client folosește un cod promoțional pentru a se înscrie, acesta este legat de dvs. automat</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* === MEDIA === */}
          {page==='media'&&(
            <div>
              <div style={{...s.filterRow,flexWrap:'wrap'}}>
                {[['Valută','select',['USD','EUR']],['Tip media','select',['Banner','Video','Text']],['Limbă','select',['Română','Rusă','Engleză']],['Nume media','text',''],['Site web','select',['winpartners.partners']],['Lățime','number','100'],['Înălțime','number','100'],['Campanie','select',['English','Romanian']]].map(([l,type,opts],i)=>(
                  <div key={l} style={{display:'flex',alignItems:'center',gap:4}}>
                    <span style={{fontSize:11,color:'rgba(255,255,255,0.4)',whiteSpace:'nowrap'}}>{l}</span>
                    {type==='select'?<select style={{...s.inp,width:130}}>{opts.map(o=><option key={o} style={{background:'#1a1a2e'}}>{o||'Selectare...'}</option>)}</select>:
                    <input type={type} style={{...s.inp,width:80}} placeholder={opts}/>}
                  </div>
                ))}
                <button style={s.btn()}>CĂUTARE</button>
              </div>
              <div style={{...s.card,textAlign:'center',padding:'3rem',color:'rgba(255,255,255,0.2)',fontSize:12}}>
                Niciun material media disponibil pentru filtrele selectate.<br/>Contactați managerul pentru materiale de promovare personalizate.
              </div>
            </div>
          )}

          {/* === REZUMAT / RAPORT COMPLET === */}
          {(page==='summary'||page==='report')&&(
            <div>
              <div style={{...s.filterRow,flexWrap:'wrap'}}>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Valută</span>
                <select style={s.inp}><option style={{background:'#1a1a2e'}}>USD</option></select>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Site web</span>
                <select style={{...s.inp,width:160}}><option style={{background:'#1a1a2e'}}>Toate</option></select>
                {page==='summary'&&<><span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>ID instrument de marketing</span><input style={{...s.inp,width:120}} placeholder=""/></>}
                <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Perioada</span>
                <select style={{...s.inp,width:130}}><option style={{background:'#1a1a2e'}}>Perioada exactă</option></select>
                <input type="date" style={s.inp} defaultValue="2026-06-13"/>
                <span style={{color:'rgba(255,255,255,0.3)'}}>→</span>
                <input type="date" style={s.inp} defaultValue="2026-06-13"/>
                <button style={s.btn()}>GENERAȚI RAPORT</button>
              </div>
              <div style={{...s.card,overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse',minWidth:600}}>
                  <thead><tr>{(page==='summary'?['Vizualizări','Clickuri','Linkuri directe','Click-uri/Vizualizări','Înregistrări','Raportul înregistrărilor/clickuri','Înregistrări cu depuneri','Suma totală a noii depuneri','Depunători noi','Conturi cu depuneri','Suma tuturor depunerilor','Venituri','Numărul de depuneri','Jucători activi','Media profitului per jucător','Suma bonusului','Total comision RS','CPA','Suma comisionului','Comisionul sub-afiliatilor']:['Data','Valută','Clickuri','Înregistrări','Depunători noi','Venituri','Suma comisionului']).map(h=><th key={h} style={{...s.TH,cursor:'pointer'}}>{h}</th>)}</tr></thead>
                  <tbody>
                    {page==='report'&&D.daily.map(r=>(
                      <tr key={r.d} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseOut={e=>e.currentTarget.style.background='none'}>
                        <td style={s.TD}>{r.d}</td>
                        <td style={s.TD}>USD</td>
                        <td style={s.TD}>{r.cl}</td>
                        <td style={s.TD}>{r.rg}</td>
                        <td style={s.TD}>{r.dp}</td>
                        <td style={s.TD}>${r.rv}</td>
                        <td style={{...s.TD,color:r.rv>0?gold:'rgba(255,255,255,0.2)',fontWeight:700}}>{r.rv>0?'$'+Math.round(r.rv*0.2):'—'}</td>
                      </tr>
                    ))}
                    {page==='summary'&&<tr>{['0','0','0','0','0','0','0','$0','0','0','$0','$0','0','0','$0','$0','$0','0','$'+totComm,'$0'].map((v,i)=><td key={i} style={{...s.TD,color:i===18?gold:'inherit',fontWeight:i===18?700:400}}>{v}</td>)}</tr>}
                    <tr><td colSpan={20} style={{...s.TD,fontStyle:'italic',color:'rgba(255,255,255,0.2)',fontSize:11,textAlign:'center',padding:'16px'}}>Fără informații pentru perioada selectată</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* === RAPORT JUCATORI === */}
          {page==='players'&&(
            <div>
              <div style={{...s.filterRow,flexWrap:'wrap'}}>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Valută</span>
                <select style={s.inp}><option style={{background:'#1a1a2e'}}>USD</option></select>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Site web</span>
                <select style={{...s.inp,width:160}}><option style={{background:'#1a1a2e'}}>Toate</option></select>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Jucător</span>
                <input style={{...s.inp,width:120}} placeholder="ID jucător"/>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Perioada</span>
                <select style={{...s.inp}}><option style={{background:'#1a1a2e'}}>1 lună</option></select>
                <button style={s.btn()}>GENERAȚI RAPORT</button>
              </div>
              <div style={{...s.card,overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>{['Jucător','Data înregistrării','Prima depunere','Numărul de depuneri','Suma depunerilor','Venituri','Comisionul meu'].map(h=><th key={h} style={s.TH}>{h}</th>)}</tr></thead>
                  <tbody><tr><td colSpan={7} style={{...s.TD,textAlign:'center',color:'rgba(255,255,255,0.2)',padding:'24px'}}>Fără informații pentru perioada selectată</td></tr></tbody>
                </table>
              </div>
            </div>
          )}

          {/* === SUB-AFILIATI === */}
          {page==='subaff'&&(
            <div>
              <div style={{background:'rgba(16,185,129,0.05)',border:'1px solid rgba(16,185,129,0.15)',borderRadius:6,padding:'12px 14px',marginBottom:'1rem'}}>
                <div style={{fontSize:12,fontWeight:600,color:'#10b981',marginBottom:5}}>Câștigă 3% din comisioanele bloggerilor pe care îi inviți — pe viață!</div>
                <div style={{fontFamily:'monospace',fontSize:11,color:gold,background:'rgba(0,0,0,0.3)',padding:'5px 10px',borderRadius:4,marginBottom:8,wordBreak:'break-all',display:'inline-block'}}>{refLink}</div>
                <div>
                  <button style={{...s.btn(),fontSize:11,padding:'5px 12px'}} onClick={()=>copy(refLink,'ref')}>{copied==='ref'?'✓ Copiat!':'Copiează linkul de referral'}</button>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:'1rem'}}>
                {[['Bloggeri invitați',D.refs.length,'#3b82f6'],['Total câștigat','$'+D.refs.reduce((s,r)=>s+r.cm,0).toFixed(2),'#10b981'],['Comision','3%',gold]].map(([l,v,c])=>(
                  <div key={l} style={{...s.card,textAlign:'center'}}>
                    <div style={{fontSize:9,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:5}}>{l}</div>
                    <div style={{fontSize:20,fontWeight:800,color:c}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{...s.filterRow}}>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Valută</span>
                <select style={s.inp}><option style={{background:'#1a1a2e'}}>USD</option></select>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Perioada</span>
                <select style={s.inp}><option style={{background:'#1a1a2e'}}>1 lună</option></select>
                <button style={s.btn()}>GENERAȚI RAPORT</button>
              </div>
              <div style={{...s.card,overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>{['Blogger','Platformă','Data înregistrării','Înregistrări aduse','Câștigurile lui','Comisionul meu (3%)'].map(h=><th key={h} style={s.TH}>{h}</th>)}</tr></thead>
                  <tbody>{D.refs.map(r=>(
                    <tr key={r.name} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseOut={e=>e.currentTarget.style.background='none'}>
                      <td style={{...s.TD,fontWeight:600}}>{r.name}</td>
                      <td style={s.TD}>{r.pl}</td>
                      <td style={{...s.TD,color:'rgba(255,255,255,0.35)'}}>{r.dt}</td>
                      <td style={s.TD}>{r.rg}</td>
                      <td style={s.TD}>${r.rv}</td>
                      <td style={{...s.TD,color:'#10b981',fontWeight:600}}>${r.cm.toFixed(2)}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {/* === CONTACTE === */}
          {page==='contact'&&(
            <div style={{...s.card,maxWidth:440}}>
              {[['Email','support@winpartners.partners'],['Telegram','@winpartners_support'],['WhatsApp','+373 XX XXX XXX'],['Program','24/7, 365 zile/an']].map(([l,v])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                  <span style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>{l}</span>
                  <span style={{fontSize:12,color:gold}}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {/* === INSTRUMENTE MARKETING === */}
          {page==='mkttools'&&(
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
              {[['📊','Raport complet','Statistici detaliate per zi, campanie și link'],['👥','Raport jucători','Activitatea fiecărui jucător adus de dvs.'],['🌐','Sub-afiliați','Gestionați și monitorizați bloggerii invitați'],['🔗','Link-uri Afiliați','Generați și gestionați linkuri de tracking'],['🎟','Coduri Promo','Coduri personalizate pentru promovare'],['📐','Banere Media','Materiale grafice pentru promovare online']].map(([icon,t,d])=>(
                <div key={t} style={{...s.card,cursor:'pointer'}} onClick={()=>setPage(t.includes('Raport complet')?'report':t.includes('jucători')?'players':t.includes('Sub')?'subaff':t.includes('Link')?'links':t.includes('Promo')?'promo':'media')}>
                  <div style={{fontSize:24,marginBottom:8}}>{icon}</div>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>{t}</div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',lineHeight:1.5}}>{d}</div>
                </div>
              ))}
            </div>
          )}

          {/* === SITES === */}
          {page==='sites'&&(
            <div style={{...s.card}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>Site-urile dumneavoastră înregistrate</div>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead><tr>{['Site web','Status','Data adăugării'].map(h=><th key={h} style={s.TH}>{h}</th>)}</tr></thead>
                <tbody>
                  <tr>
                    <td style={s.TD}>winpartners.partners</td>
                    <td style={s.TD}><span style={{background:'rgba(16,185,129,0.1)',color:'#10b981',padding:'2px 8px',borderRadius:3,fontSize:10,fontWeight:600,border:'1px solid rgba(16,185,129,0.2)'}}>Activ</span></td>
                    <td style={s.TD}>2026-06-13</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>

      {/* PAY MODAL */}
      {showPay&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:'1rem'}} onClick={()=>setShowPay(false)}>
          <div style={{background:'#13132a',border:`1px solid rgba(245,166,35,0.2)`,borderRadius:10,padding:'1.5rem',width:'100%',maxWidth:380}} onClick={e=>e.stopPropagation()}>
            {paySent?(
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:36,marginBottom:10}}>✅</div>
                <h3 style={{fontWeight:700,marginBottom:6,fontSize:15}}>Cerere trimisă!</h3>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:12,marginBottom:14}}>Plata va fi procesată în 48 ore.</p>
                <button style={s.btn()} onClick={()=>{setShowPay(false);setPaySent(false)}}>Închide</button>
              </div>
            ):(
              <>
                <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>Solicită plată</div>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:12,marginBottom:12}}>Disponibil: <strong style={{color:gold}}>${D.bal.available}</strong> · Minimum $30</p>
                <label style={s.label}>Metodă de plată</label>
                <select style={{...s.inp,width:'100%',marginBottom:10}} value={payMethod} onChange={e=>setPayMethod(e.target.value)}>{['Bitcoin','Skrill','Neteller','PAYEER','Transfer bancar'].map(m=><option key={m} style={{background:'#1a1a2e'}}>{m}</option>)}</select>
                <label style={s.label}>Adresa {payMethod}</label>
                <input style={{...s.inp,width:'100%',marginBottom:12}} placeholder={payMethod==='Bitcoin'?'bc1q...':'Cont/email'} value={payAddr} onChange={e=>setPayAddr(e.target.value)}/>
                <button style={{...s.btn(),width:'100%',padding:'9px'}} onClick={()=>payAddr&&setPaySent(true)}>Trimite cererea</button>
                <button style={{...s.btnOut('rgba(255,255,255,0.3)'),width:'100%',padding:'8px',marginTop:6}} onClick={()=>setShowPay(false)}>Anulează</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* CODE MODAL */}
      {showCode&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:'1rem'}} onClick={()=>setShowCode(false)}>
          <div style={{background:'#13132a',border:`1px solid rgba(245,166,35,0.2)`,borderRadius:10,padding:'1.5rem',width:'100%',maxWidth:360}} onClick={e=>e.stopPropagation()}>
            {codeSent?(
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:36,marginBottom:10}}>✅</div>
                <h3 style={{fontWeight:700,marginBottom:6,fontSize:15}}>Cerere trimisă!</h3>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:12,marginBottom:14}}>Codul personalizat va fi activat în 24-48 ore.</p>
                <button style={s.btn()} onClick={()=>{setShowCode(false);setCodeSent(false)}}>Închide</button>
              </div>
            ):(
              <>
                <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>Cere cod personalizat</div>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:12,marginBottom:12}}>Procesare în 24-48 ore. Discutați cu managerul pentru bonusuri speciale.</p>
                <label style={s.label}>Codul dorit (ex: IONEL, VLAD20)</label>
                <input style={{...s.inp,width:'100%',marginBottom:12,textTransform:'uppercase',fontFamily:'monospace',fontSize:13,fontWeight:700}} placeholder="IONEL" value={codeText} onChange={e=>setCodeText(e.target.value.toUpperCase())}/>
                <button style={{...s.btn(),width:'100%',padding:'9px'}} onClick={()=>codeText&&setCodeSent(true)}>Trimite</button>
                <button style={{...s.btnOut('rgba(255,255,255,0.3)'),width:'100%',padding:'8px',marginTop:6}} onClick={()=>setShowCode(false)}>Anulează</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
