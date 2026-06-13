import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const gold = '#f5a623'
const bg = '#f0f2f5'
const bgCard = '#ffffff'
const bgSide = '#1e1e30'
const bgHeader = '#1e1e30'
const bdr = 'rgba(0,0,0,0.1)'
const txt = '#1a1a2e'
const txtSub = '#6b7280'

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
  links:[{id:1,camp:'English',subid:'',page:'/live',link:'https://melbet.com/go/WP4438301',shown:true}],
  commStructure:[
    {val:'USD',struct:'Revenue Share',group:'RS25% REF3%',start:'2026-06-02',desc:'Procent comision: 25%; Comision negativ: Da; Administrator: 0%',end:''},
    {val:'USD',struct:'Refferal',group:'RS25% REF3%',start:'2026-06-02',desc:'Nivelul 1|3%; Comision negativ: Da; (2019-07-24)',end:''},
  ],
}

const ICONS = {
  main: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  sites: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  comm: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  pays: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  account: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  contact: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  links: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  promo: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>,
  media: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  summary: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  report: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  mkttools: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>,
  players: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  subaff: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 01-9 9"/></svg>,
}

const MENU = [
  {id:'main',label:'Pagina principală',section:'MENIU PRINCIPAL'},
  {id:'sites',label:'Site-uri',section:''},
  {id:'comm',label:'Structura comisionului',section:''},
  {id:'pays',label:'Istoricul plăților',section:''},
  {id:'account',label:'Cont',section:''},
  {id:'contact',label:'Contacte',section:''},
  {id:'links',label:'Link-uri Afiliați',section:'COOKIE-URI DE DIRECȚIONARE'},
  {id:'promo',label:'Coduri Promoționale',section:''},
  {id:'media',label:'Media',section:''},
  {id:'summary',label:'Rezumat',section:'RAPOARTE'},
  {id:'report',label:'Raport complet',section:''},
  {id:'mkttools',label:'Instrumente de marketing',section:''},
  {id:'players',label:'Raport despre jucători',section:''},
  {id:'subaff',label:'Raport despre sub-afiliați',section:''},
]

function LineChart({data,field,color,h=60}) {
  const vals=data.map(d=>d[field]),max=Math.max(...vals,1)
  const W=400,H=h
  const pts=data.map((d,i)=>[(i/(data.length-1))*W,H-((d[field]/max)*(H-8))-4])
  const path=pts.map((p,i)=>(i===0?`M${p[0]},${p[1]}`:`L${p[0]},${p[1]}`)).join(' ')
  const area=`${path} L${W},${H} L0,${H} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:h,overflow:'visible'}}>
      <defs>
        <linearGradient id={`g${field}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.01"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#g${field})`}/>
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill={color} stroke="#fff" strokeWidth="1.5"/>)}
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

  const totCl=D.daily.reduce((a,r)=>a+r.cl,0)
  const totRg=D.daily.reduce((a,r)=>a+r.rg,0)
  const totDp=D.daily.reduce((a,r)=>a+r.dp,0)
  const totRv=D.daily.reduce((a,r)=>a+r.rv,0)
  const totComm=Math.round(totRv*D.commission/100)

  // Styles
  const inp = {padding:'6px 10px',fontSize:13,border:`1px solid ${bdr}`,borderRadius:4,background:'#fff',color:txt,outline:'none',fontFamily:'inherit'}
  const btnPrimary = {padding:'7px 18px',fontSize:13,fontWeight:600,cursor:'pointer',border:'none',borderRadius:20,background:gold,color:'#000',fontFamily:'inherit'}
  const btnOutline = (c=gold)=>({padding:'6px 14px',fontSize:12,fontWeight:600,cursor:'pointer',border:`1px solid ${c}`,borderRadius:4,background:'none',color:c,fontFamily:'inherit'})
  const TH = {textAlign:'left',padding:'10px 14px',color:txtSub,fontWeight:500,borderBottom:`1px solid ${bdr}`,fontSize:12,whiteSpace:'nowrap',background:'#f9fafb'}
  const TD = {padding:'9px 14px',borderBottom:`1px solid #f3f4f6`,color:txt,fontSize:13}
  const card = {background:bgCard,border:`1px solid ${bdr}`,borderRadius:8,padding:'16px',boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}
  const label = {fontSize:11,color:txtSub,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4,display:'block',fontWeight:500}
  const filterRow = {display:'flex',alignItems:'center',gap:10,background:bgCard,borderRadius:8,padding:'12px 16px',border:`1px solid ${bdr}`,marginBottom:12,flexWrap:'wrap',boxShadow:'0 1px 3px rgba(0,0,0,0.04)'}
  const pageTitle = {fontSize:18,fontWeight:700,color:txt,marginBottom:'1.25rem',paddingBottom:'0.75rem',borderBottom:`1px solid ${bdr}`}

  const tabActive = {padding:'8px 20px',fontSize:13,cursor:'pointer',border:'none',background:gold,color:'#000',fontWeight:700,fontFamily:'inherit',borderRadius:'4px 4px 0 0'}
  const tabInactive = {padding:'8px 20px',fontSize:13,cursor:'pointer',border:`1px solid ${bdr}`,borderBottom:'none',background:bgCard,color:txtSub,fontWeight:400,fontFamily:'inherit',borderRadius:'4px 4px 0 0'}

  return (
    <div style={{background:bg,minHeight:'100vh',color:txt,fontFamily:'"Inter",-apple-system,sans-serif',display:'flex',flexDirection:'column',fontSize:13}}>

      {/* TOP HEADER - dark like Melbet */}
      <div style={{background:bgHeader,height:52,display:'flex',alignItems:'center',padding:'0 1.5rem',gap:12,flexShrink:0,zIndex:10,boxShadow:'0 2px 8px rgba(0,0,0,0.2)'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',marginRight:12,minWidth:160}} onClick={()=>nav('/')}>
          <div style={{background:gold,borderRadius:4,width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:14,color:'#000',letterSpacing:'-1px'}}>W</div>
          <div style={{lineHeight:1}}>
            <div style={{fontSize:14,fontWeight:800,color:'#fff',letterSpacing:'.02em'}}>WIN<span style={{color:gold}}>PARTNERS</span></div>
            <div style={{fontSize:9,color:'rgba(255,255,255,0.3)',fontWeight:500,letterSpacing:'.08em'}}>CASINO AFFILIATE</div>
          </div>
        </div>
        {/* Badge inline items like Melbet */}
        <div style={{display:'flex',alignItems:'center',gap:6,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:4,padding:'4px 10px'}}>
          <span style={{fontSize:10,color:'rgba(255,255,255,0.4)'}}>Aff ID:</span>
          <span style={{fontSize:12,fontWeight:700,color:gold,fontFamily:'monospace'}}>{D.affId}</span>
        </div>
        <div style={{flex:1}}/>
        <div style={{display:'flex',alignItems:'center',gap:6,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:4,padding:'5px 12px'}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span style={{fontSize:10,color:'rgba(255,255,255,0.6)',fontWeight:600,letterSpacing:'.05em'}}>WINPARTNERS</span>
          <span style={{fontSize:10,color:gold,fontWeight:700}}>2 ANI</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:5,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:4,padding:'5px 10px'}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
          <span style={{fontSize:10,color:'rgba(255,255,255,0.6)'}}>App Android</span>
        </div>
        <button style={{...btnPrimary,fontSize:11,padding:'6px 14px',borderRadius:4,display:'flex',alignItems:'center',gap:5}}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
          ACTUALIZARE STATISTICI
        </button>
        <div style={{display:'flex',alignItems:'center',gap:8,borderLeft:'1px solid rgba(255,255,255,0.1)',paddingLeft:12}}>
          <div style={{width:28,height:28,borderRadius:'50%',background:`linear-gradient(135deg,${gold},#c97d00)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#000'}}>{D.name[0]}</div>
          <div style={{lineHeight:1.2}}>
            <div style={{fontSize:12,fontWeight:600,color:'#fff'}}>{D.name}</div>
            <div style={{fontSize:10,color:'rgba(255,255,255,0.4)'}}>@{D.username}</div>
          </div>
          <button style={{...btnOutline('rgba(255,255,255,0.35)'),color:'rgba(255,255,255,0.6)',fontSize:11,padding:'4px 10px',borderRadius:4}} onClick={()=>nav('/')}>Logout</button>
        </div>
      </div>

      <div style={{display:'flex',flex:1,overflow:'hidden'}}>

        {/* SIDEBAR - dark like Melbet */}
        <div style={{width:220,background:bgSide,flexShrink:0,overflowY:'auto',paddingBottom:20,borderRight:'1px solid rgba(255,255,255,0.05)'}}>
          {MENU.map((m)=>(
            <div key={m.id}>
              {m.section&&<div style={{padding:'16px 14px 5px',fontSize:9,color:'rgba(255,255,255,0.22)',textTransform:'uppercase',letterSpacing:'.14em',fontWeight:600,borderTop:m.id!=='main'?'1px solid rgba(255,255,255,0.05)':'none',marginTop:m.id!=='main'?8:0}}>{m.section}</div>}
              <div onClick={()=>setPage(m.id)} style={{display:'flex',alignItems:'center',gap:9,padding:'9px 14px 9px 16px',cursor:'pointer',fontSize:13,color:page===m.id?gold:'rgba(255,255,255,0.55)',background:page===m.id?'rgba(245,166,35,0.08)':'none',borderLeft:page===m.id?`3px solid ${gold}`:'3px solid transparent',transition:'all .12s',userSelect:'none'}}>
                <span style={{opacity:page===m.id?1:0.6,display:'flex',alignItems:'center'}}>{ICONS[m.id]}</span>
                <span style={{fontSize:13}}>{m.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN CONTENT - light white background like Melbet */}
        <div style={{flex:1,overflowY:'auto',padding:'1.5rem',minWidth:0}}>

          {/* PAGE TITLE */}
          <div style={pageTitle}>{MENU.find(m=>m.id===page)?.label||'Dashboard'}</div>

          {/* === PAGINA PRINCIPALA === */}
          {page==='main'&&(
            <div>
              {/* Balance cards */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:0,background:bgCard,borderRadius:8,overflow:'hidden',border:`1px solid ${bdr}`,marginBottom:'1.25rem',boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
                {[
                  {l:'DISPONIBIL PENTRU RETRAGERE',v:'$'+D.bal.available,c:'#10b981',bc:'#10b981',icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,info:true},
                  {l:'IERI',v:'$'+D.bal.yesterday,c:'#3b82f6',bc:'#3b82f6',icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8"><polyline points="13 2 13 9 20 9"/><path d="M21 15.5a9 9 0 11-9-9 9 9 0 019 9z"/></svg>},
                  {l:'LUNA CURENTĂ',v:'$'+D.bal.month,c:'#f59e0b',bc:'#f59e0b',icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>},
                  {l:'30 DE ZILE',v:'$'+D.bal.days30,c:'#ef4444',bc:'#ef4444',icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>},
                  {l:'TOTAL',v:'$'+D.bal.total,c:'#10b981',bc:'#10b981',icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8"><polyline points="20 6 9 17 4 12"/></svg>},
                ].map((it,i)=>(
                  <div key={it.l} style={{padding:'16px',borderLeft:i>0?`1px solid ${bdr}`:'none',borderBottom:`3px solid ${it.bc}`,textAlign:'center',position:'relative'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:5,marginBottom:4}}>
                      {it.icon}
                      {it.info&&<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={txtSub} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
                    </div>
                    <div style={{fontSize:22,fontWeight:800,color:it.c,marginBottom:4}}>{it.v}</div>
                    <div style={{fontSize:9,color:txtSub,textTransform:'uppercase',letterSpacing:'.06em',lineHeight:1.3}}>{it.l}</div>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div style={filterRow}>
                <span style={{fontSize:13,color:txtSub}}>Perioada</span>
                <select style={{...inp,width:110}} value={period} onChange={e=>setPeriod(e.target.value)}>
                  {['1 zi','7 zile','1 lună','3 luni','6 luni','1 an'].map(p=><option key={p}>{p}</option>)}
                </select>
                <span style={{fontSize:13,color:txtSub}}>Valută</span>
                <select style={{...inp,width:75}} value={currency} onChange={e=>setCurrency(e.target.value)}>
                  {['USD','EUR','MDL'].map(c=><option key={c}>{c}</option>)}
                </select>
                <button style={btnPrimary}>APLICAȚI</button>
              </div>

              {/* Charts */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:'1.25rem'}}>
                {[
                  {title:'Statistici conversii',items:[{f:'cl',c:'#3b82f6',l:'Vizualizări'},{f:'rg',c:'#6366f1',l:'Clickuri'},{f:'dp',c:'#06b6d4',l:'Linkuri directe'}]},
                  {title:'Statistici înregistrare',items:[{f:'rg',c:'#ef4444',l:'Înregistrări'},{f:'dp',c:'#10b981',l:'Depunători noi'},{f:'rv',c:gold,l:'Suma comisionului'}]},
                ].map(ch=>(
                  <div key={ch.title} style={{...card}}>
                    <div style={{fontSize:14,fontWeight:600,marginBottom:'1rem',color:txt}}>{ch.title}</div>
                    {ch.items.map(it=>(
                      <div key={it.f} style={{marginBottom:'0.75rem'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                          <span style={{fontSize:11,color:txtSub,display:'flex',alignItems:'center',gap:5}}>
                            <span style={{width:8,height:8,borderRadius:'50%',background:it.c,display:'inline-block'}}/>
                            {it.l}: 0
                          </span>
                          <div style={{display:'flex',gap:3}}>
                            {['1 s','1 I','Toate'].map(f=><span key={f} style={{fontSize:10,color:txtSub,padding:'1px 6px',borderRadius:3,border:`1px solid ${bdr}`,cursor:'pointer',background:'#f9fafb'}}>{f}</span>)}
                          </div>
                        </div>
                        <LineChart data={D.daily} field={it.f} color={it.c} h={55}/>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Summary table */}
              <div style={{...card,padding:0,overflow:'hidden'}}>
                <div style={{padding:'12px 16px',borderBottom:`1px solid ${bdr}`,display:'flex',justifyContent:'space-between',alignItems:'center',background:'#fafafa'}}>
                  <span style={{fontSize:13,fontWeight:600,color:txt}}>Sumarul statisticilor</span>
                  <select style={{...inp,fontSize:12}}>
                    <option>Ieri</option><option>Azi</option><option>Săptămâna</option>
                  </select>
                </div>
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',minWidth:900}}>
                    <thead><tr>
                      {['Valută','Vizualizări','Clickuri','Linkuri directe','Înregistrări','Depunători noi','Profitul companiei','RP','CPA','Suma comisionului'].map(h=><th key={h} style={TH}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      <tr>
                        {[currency,'0',totCl,'0',totRg,totDp,'$'+totRv,'0','0'].map((v,i)=><td key={i} style={TD}>{v}</td>)}
                        <td style={{...TD,color:'#10b981',fontWeight:700}}>${totComm}</td>
                      </tr>
                      <tr style={{background:'#fafafa'}}>
                        <td colSpan={10} style={{...TD,fontStyle:'italic',color:txtSub,fontSize:11,textAlign:'center'}}>Fără informații pentru perioada selectată</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* === STRUCTURA COMISIONULUI === */}
          {page==='comm'&&(
            <div>
              <div style={{marginBottom:'0.75rem'}}><select style={{...inp,fontSize:12,padding:'6px 12px'}}><option>6 articole selectate ▼</option></select></div>
              <div style={{...card,padding:0,overflow:'hidden'}}>
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse'}}>
                    <thead><tr>{['Valută ↕','Structura comisionului ↕','Numele grupei ↕','Data de început ↕','Descriere ↕','Dată de sfârșit ↕'].map(h=><th key={h} style={{...TH,cursor:'pointer'}}>{h}</th>)}</tr></thead>
                    <tbody>{D.commStructure.map((r,i)=>(
                      <tr key={i} style={{background:i%2===0?'#fff':'#fafafa'}}>
                        <td style={TD}>{r.val}</td>
                        <td style={TD}>{r.struct}</td>
                        <td style={TD}>{r.group}</td>
                        <td style={TD}>{r.start}</td>
                        <td style={{...TD,color:txtSub,maxWidth:300,fontSize:12}}>{r.desc}</td>
                        <td style={TD}>{r.end||'—'}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
                <div style={{padding:'10px 16px',fontSize:12,color:txtSub,borderTop:`1px solid ${bdr}`,background:'#fafafa'}}>Înregistrări de la 1 la {D.commStructure.length} ({D.commStructure.length} înregistrări în total)</div>
              </div>
            </div>
          )}

          {/* === ISTORICUL PLATILOR === */}
          {page==='pays'&&(
            <div>
              <div style={filterRow}>
                <span style={{fontSize:13,color:txtSub}}>Valută</span>
                <select style={inp}><option>USD</option></select>
                <span style={{fontSize:13,color:txtSub}}>Perioada</span>
                <select style={inp}><option>Perioada exactă</option></select>
                <input type="date" style={inp} defaultValue="2026-06-13"/>
                <span style={{color:txtSub}}>→</span>
                <input type="date" style={inp} defaultValue="2026-06-13"/>
                <button style={btnPrimary}>GENERAȚI RAPORT</button>
              </div>
              <div style={{display:'flex',gap:0,marginBottom:'1rem',borderBottom:`2px solid ${bdr}`}}>
                {['Statusul solicitărilor','Istoricul plăților'].map((t,i)=>(
                  <button key={t} onClick={()=>setPayTab(i===0?'status':'history')} style={payTab===(i===0?'status':'history')?tabActive:tabInactive}>{t}</button>
                ))}
                <div style={{flex:1}}/>
                <button style={{...btnOutline('#ef4444'),marginBottom:2,fontSize:12}}>EXPORT ▼</button>
              </div>
              <div style={{marginBottom:'0.75rem'}}><select style={{...inp,fontSize:12}}><option>6 articole selectate ▼</option></select></div>
              <div style={{...card,padding:0,overflow:'hidden',marginBottom:'1.25rem'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>{['Valută ↕','Data ↕','Plata ↕','Venituri ↕','Sold ↕','Status ↕'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>
                    {payTab==='history'&&D.pays.map((p,i)=>(
                      <tr key={i} style={{background:i%2===0?'#fff':'#fafafa'}}>
                        <td style={TD}>USD</td>
                        <td style={TD}>{p.dt}</td>
                        <td style={{...TD,color:'#10b981',fontWeight:600}}>${p.am}</td>
                        <td style={TD}>${p.venituri}</td>
                        <td style={TD}>${p.sold}</td>
                        <td style={TD}><span style={{background:'#d1fae5',color:'#065f46',padding:'2px 8px',borderRadius:12,fontSize:11,fontWeight:600}}>{p.st}</span></td>
                      </tr>
                    ))}
                    {payTab==='status'&&<tr><td colSpan={6} style={{...TD,textAlign:'center',color:txtSub,padding:'24px',fontStyle:'italic'}}>Fără solicitări active</td></tr>}
                  </tbody>
                </table>
                <div style={{padding:'10px 16px',fontSize:12,color:txtSub,borderTop:`1px solid ${bdr}`,background:'#fafafa'}}>Înregistrări de la 1 la {D.pays.length}</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div style={card}>
                  <p style={{fontSize:13,color:txtSub,lineHeight:1.7,marginBottom:8}}>Pentru a primi plata, vă rugăm să contactați managerul dumneavoastră. Plata automată va fi setată ulterior.</p>
                  <p style={{fontSize:13,fontWeight:600,color:txt,marginBottom:12}}>Suma minimă de plată este de $30 pe săptămână</p>
                  <button style={btnPrimary} onClick={()=>setShowPay(true)}>Solicită plată → ${D.bal.available}</button>
                </div>
                <div style={card}>
                  <p style={{fontSize:13,color:txtSub,lineHeight:1.7}}>Contactați managerii noștri prin <span style={{color:gold,cursor:'pointer',fontWeight:600}}>datele de contact</span> disponibile pe site.</p>
                </div>
              </div>
            </div>
          )}

          {/* === CONT === */}
          {page==='account'&&(
            <div>
              <div style={{fontSize:13,marginBottom:'1rem',color:txtSub}}>Utilizator: <span style={{color:gold,fontWeight:600}}>@{D.username}</span></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
                <div style={card}>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:14,color:txt,paddingBottom:8,borderBottom:`1px solid ${bdr}`}}>Informații de contact</div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
                    <div><label style={label}>Prenume *</label><input style={{...inp,width:'100%',boxSizing:'border-box'}} defaultValue="Ion"/></div>
                    <div><label style={label}>Prenume *</label><input style={{...inp,width:'100%',boxSizing:'border-box'}} defaultValue="Popescu"/></div>
                  </div>
                  <div style={{marginBottom:8}}><label style={label}>Număr de telefon</label><input style={{...inp,width:'100%',boxSizing:'border-box'}} defaultValue={D.phone}/></div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
                    <div><label style={label}>Messenger</label><select style={{...inp,width:'100%',boxSizing:'border-box'}}><option>WhatsApp</option></select></div>
                    <div><label style={label}>Număr telefon</label><input style={{...inp,width:'100%',boxSizing:'border-box'}} defaultValue={D.phone}/></div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
                    <div><label style={label}>Țară</label><select style={{...inp,width:'100%',boxSizing:'border-box'}}><option>Moldova</option></select></div>
                    <div><label style={label}>Limbă notificări</label><select style={{...inp,width:'100%',boxSizing:'border-box'}}><option>Română</option></select></div>
                  </div>
                  <div style={{fontSize:11,color:txtSub,marginBottom:10}}>pentru a modifica datele de contact, contactați managerul dvs.</div>
                  <button style={btnPrimary}>SALVAȚI MODIFICĂRILE</button>
                </div>
                <div style={card}>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:14,color:txt,paddingBottom:8,borderBottom:`1px solid ${bdr}`}}>Detaliile plății</div>
                  <div style={{marginBottom:8}}><label style={label}>Metoda de plată preferată</label><input style={{...inp,width:'100%',boxSizing:'border-box'}} defaultValue="Bitcoin" readOnly/></div>
                  <div style={{marginBottom:12}}><label style={label}>Numărul portofelului</label><input style={{...inp,width:'100%',boxSizing:'border-box',fontFamily:'monospace',fontSize:11}} defaultValue={D.payAddress}/></div>
                  <div style={{fontSize:11,color:txtSub,marginBottom:16}}>* pentru a modifica detaliile de plată, contactați Asistența Pentru Parteneri.</div>
                  <div style={{borderTop:`1px solid ${bdr}`,paddingTop:12}}>
                    <div style={{fontSize:13,fontWeight:600,color:txt,marginBottom:8}}>Abonamente</div>
                    <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:13,color:txtSub}}>
                      <input type="checkbox" defaultChecked style={{accentColor:gold}}/> Informațiile companiei
                    </label>
                  </div>
                </div>
                <div style={card}>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:14,color:txt,paddingBottom:8,borderBottom:`1px solid ${bdr}`}}>Modificați parola</div>
                  <div style={{marginBottom:8}}><label style={label}>Parola veche</label><input type="password" style={{...inp,width:'100%',boxSizing:'border-box'}} placeholder="••••••••"/></div>
                  <div style={{marginBottom:8}}><label style={label}>Parolă nouă</label><input type="password" style={{...inp,width:'100%',boxSizing:'border-box'}} placeholder="••••••••"/></div>
                  <div style={{marginBottom:12}}><label style={label}>Reintroduceți noua parolă</label><input type="password" style={{...inp,width:'100%',boxSizing:'border-box'}} placeholder="••••••••"/></div>
                  <button style={btnPrimary}>MODIFICAȚI PAROLA</button>
                  <div style={{borderTop:`1px solid ${bdr}`,paddingTop:12,marginTop:16}}>
                    <div style={{fontSize:13,fontWeight:600,color:txt,marginBottom:6}}>Gestionarea autentificării cu doi factori</div>
                    <div style={{fontSize:12,color:txtSub}}>Google Authenticator activat: <span style={{color:'#ef4444',fontWeight:600}}>Nu</span></div>
                  </div>
                  <div style={{borderTop:`1px solid ${bdr}`,paddingTop:12,marginTop:12}}>
                    <div style={{fontSize:13,fontWeight:600,color:txt,marginBottom:4}}>Confirmarea adresei de e-mail</div>
                    <div style={{fontSize:12,color:txtSub}}>Email: {D.email}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* === LINK-URI === */}
          {page==='links'&&(
            <div>
              <div style={filterRow}>
                <span style={{fontSize:13,color:txtSub}}>Site web</span>
                <select style={{...inp,width:190}}><option>winpartners.partners</option></select>
                <span style={{fontSize:13,color:txtSub}}>Valută</span>
                <select style={inp}><option>USD</option></select>
                <span style={{fontSize:13,color:txtSub}}>Campanie</span>
                <select style={{...inp,width:120}} value={linkCamp} onChange={e=>setLinkCamp(e.target.value)}><option>English</option><option>Romanian</option><option>Russian</option></select>
                <span style={{fontSize:13,color:txtSub}}>Pagină destinație</span>
                <input style={{...inp,width:70}} value={linkPage} onChange={e=>setLinkPage(e.target.value)}/>
                <span style={{fontSize:13,color:txtSub}}>Sub ID</span>
                <input style={{...inp,width:90}} value={subId} onChange={e=>setSubId(e.target.value)} placeholder="SubID"/>
                <button style={btnPrimary}>GENERARE LINK</button>
              </div>
              <div style={{display:'flex',gap:0,marginBottom:'1rem',borderBottom:`2px solid ${bdr}`}}>
                {['Link-uri create','Link-uri ascunse'].map((t,i)=>(
                  <button key={t} onClick={()=>setLinkTab(i===0?'created':'hidden')} style={linkTab===(i===0?'created':'hidden')?tabActive:tabInactive}>{t}</button>
                ))}
              </div>
              <div style={{marginBottom:'0.75rem'}}><select style={{...inp,fontSize:12}}><option>8 articole selectate ▼</option></select></div>
              <div style={{...card,padding:0,overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>{['Nr. ↕','Site web ↕','Arată/Ascunde ↕','Pagină destinație ↕','SubID ↕','Campanie ↕','Link generat ↕','Valută ↕'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>
                    {linkTab==='created'&&D.links.map((l,i)=>(
                      <tr key={i} style={{background:i%2===0?'#fff':'#fafafa'}}>
                        <td style={TD}>{l.id}</td>
                        <td style={TD}>winpartners.partners</td>
                        <td style={TD}><span style={{background:'#d1fae5',color:'#065f46',padding:'2px 8px',borderRadius:12,fontSize:11,fontWeight:600}}>Arată</span></td>
                        <td style={TD}>{l.page}</td>
                        <td style={TD}>{l.subid||'—'}</td>
                        <td style={TD}>{l.camp}</td>
                        <td style={{...TD,fontFamily:'monospace',fontSize:11,color:txtSub}}>
                          {l.link}
                          <button style={{...btnOutline(gold),padding:'2px 8px',fontSize:10,marginLeft:6}} onClick={()=>copy(l.link,'lnk'+i)}>{copied==='lnk'+i?'✓':'Copiează'}</button>
                        </td>
                        <td style={TD}>USD</td>
                      </tr>
                    ))}
                    {linkTab==='hidden'&&<tr><td colSpan={8} style={{...TD,textAlign:'center',color:txtSub,padding:'24px',fontStyle:'italic'}}>Fără informații</td></tr>}
                  </tbody>
                </table>
                <div style={{padding:'10px 16px',fontSize:12,color:txtSub,borderTop:`1px solid ${bdr}`,background:'#fafafa'}}>Înregistrări de la 1 la {D.links.length}</div>
              </div>
            </div>
          )}

          {/* === CODURI PROMO === */}
          {page==='promo'&&(
            <div>
              <div style={filterRow}>
                <span style={{fontSize:13,color:txtSub}}>Site web</span>
                <select style={{...inp,width:190}}><option>winpartners.partners</option></select>
                <span style={{fontSize:13,color:txtSub}}>Valută</span>
                <select style={inp}><option>USD</option></select>
                <span style={{fontSize:13,color:txtSub}}>Campanie</span>
                <select style={{...inp,width:120}}><option>English</option></select>
                <button style={btnPrimary}>GENERAȚI COD PROMOȚIONAL</button>
              </div>
              <div style={{marginBottom:'0.75rem'}}><select style={{...inp,fontSize:12}}><option>5 articole selectate ▼</option></select></div>
              <div style={{...card,padding:0,overflow:'hidden',marginBottom:'1.25rem'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>{['ID ↕','Site web ↕','Valută ↕','Cod promoțional ↕','BTAG ↕',''].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>
                    <tr>
                      <td style={TD}>11035387</td>
                      <td style={TD}>winpartners.partners</td>
                      <td style={TD}>USD</td>
                      <td style={{...TD,fontWeight:700,color:'#1a1a2e',fontFamily:'monospace',fontSize:14}}>{D.promoCode.toLowerCase()}</td>
                      <td style={{...TD,fontFamily:'monospace',fontSize:10,color:txtSub}}>d_5666408m_2170c_{D.promoCode.toLowerCase()}</td>
                      <td style={TD}>
                        <button style={{...btnOutline(gold),padding:'4px 10px',fontSize:11}} onClick={()=>copy(D.promoCode,'promo')}>{copied==='promo'?'✓ Copiat':'Copiează'}</button>
                        <button style={{...btnOutline('#6366f1'),padding:'4px 10px',fontSize:11,marginLeft:6}} onClick={()=>setShowCode(true)}>Personalizat</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div style={{padding:'10px 16px',fontSize:12,color:txtSub,borderTop:`1px solid ${bdr}`,background:'#fafafa'}}>Înregistrări de la 1 la 1 (1 înregistrare în total)</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <div style={card}>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:8,color:txt}}>Pentru ce sunt codurile promoționale?</div>
                  <p style={{fontSize:13,color:txtSub,lineHeight:1.7,marginBottom:10}}>Clienții pot introduce codul promoțional în timp ce se înregistrează pe site, care îi leagă automat de dumneavoastră. Nu este necesar ca noii clienți să urmeze un link afiliat la site.</p>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:6,color:txt}}>Cum să obțineți un cod promoțional?</div>
                  <p style={{fontSize:13,color:txtSub,lineHeight:1.7}}>Selectați o monedă și o campanie și faceți click pe «Generare Cod Promoțional». Dacă doriți un cod personalizat, <span style={{color:gold,cursor:'pointer',fontWeight:600}} onClick={()=>setShowCode(true)}>contactați Echipa de Asistență</span>.</p>
                </div>
                <div style={card}>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:8,color:txt}}>Un bonus de înregistrare folosind un cod promoțional</div>
                  <p style={{fontSize:13,color:txtSub,lineHeight:1.7,marginBottom:10}}>Discutați cu managerul dumneavoastră pentru a afla mai multe despre bonusurile acordate jucătorilor care se înregistrează cu codul promoțional.</p>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:6,color:txt}}>Avantajele utilizării unui cod promoțional</div>
                  <ul style={{fontSize:13,color:txtSub,lineHeight:1.8,paddingLeft:18}}>
                    <li>Utilizat când nu puteți plasa un link de afiliat</li>
                    <li>Clientul este legat de dvs. automat la înregistrare</li>
                    <li>Funcționează pe toate platformele sociale</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* === MEDIA === */}
          {page==='media'&&(
            <div>
              <div style={filterRow}>
                {[['Valută','select',['USD']],['Tip media','select',['Banner','Video']],['Limbă','select',['Română','Rusă','Engleză']],['Lățime','number','100'],['Înălțime','number','100'],['Campanie','select',['English']]].map(([l,type,opts])=>(
                  <div key={l} style={{display:'flex',alignItems:'center',gap:5}}>
                    <span style={{fontSize:13,color:txtSub,whiteSpace:'nowrap'}}>{l}</span>
                    {type==='select'?<select style={inp}><option>Selectare...</option></select>:<input type="number" style={{...inp,width:70}} placeholder={opts}/>}
                  </div>
                ))}
                <button style={btnPrimary}>CĂUTARE</button>
              </div>
              <div style={{...card,textAlign:'center',padding:'3rem',color:txtSub,fontSize:13}}>
                Niciun material media disponibil.<br/>Contactați managerul pentru materiale de promovare personalizate.
              </div>
            </div>
          )}

          {/* === REZUMAT + RAPORT COMPLET === */}
          {(page==='summary'||page==='report')&&(
            <div>
              <div style={filterRow}>
                <span style={{fontSize:13,color:txtSub}}>Valută</span>
                <select style={inp}><option>USD</option></select>
                <span style={{fontSize:13,color:txtSub}}>Site web</span>
                <select style={{...inp,width:150}}><option>Toate</option></select>
                {page==='summary'&&<><span style={{fontSize:13,color:txtSub}}>ID instrument</span><input style={{...inp,width:120}} placeholder=""/></>}
                <span style={{fontSize:13,color:txtSub}}>Perioada</span>
                <select style={{...inp,width:130}}><option>Perioada exactă</option></select>
                <input type="date" style={inp} defaultValue="2026-06-13"/>
                <span style={{color:txtSub}}>→</span>
                <input type="date" style={inp} defaultValue="2026-06-13"/>
                <button style={btnPrimary}>GENERAȚI RAPORT</button>
              </div>
              <div style={{...card,padding:0,overflow:'hidden'}}>
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',minWidth:600}}>
                    <thead><tr>
                      {(page==='summary'
                        ?['Vizualizări','Clickuri','Linkuri directe','Click/Vizualizări','Înregistrări','Înreg./Clickuri','Înreg. cu depuneri','Suma noilor depuneri','Depunători noi','Conturi cu depuneri','Suma depuneri','Venituri','Nr. depuneri','Jucători activi','Media profit/jucător','Suma bonus','Total comision RS','CPA','Suma comisionului','Comision sub-afiliați']
                        :['Data','Valută','Clickuri','Înregistrări','Depunători noi','Venituri','Suma comisionului']
                      ).map(h=><th key={h} style={TH}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {page==='report'&&D.daily.map((r,i)=>(
                        <tr key={r.d} style={{background:i%2===0?'#fff':'#fafafa'}}>
                          <td style={TD}>{r.d}</td><td style={TD}>USD</td>
                          <td style={TD}>{r.cl}</td><td style={TD}>{r.rg}</td>
                          <td style={TD}>{r.dp}</td><td style={TD}>${r.rv}</td>
                          <td style={{...TD,color:'#10b981',fontWeight:700}}>{r.rv>0?'$'+Math.round(r.rv*.2):'—'}</td>
                        </tr>
                      ))}
                      {page==='summary'&&<tr>{['0','0','0','0','0','0','0','$0','0','0','$0','$0','0','0','$0','$0','$0','0','$'+totComm,'$0'].map((v,i)=><td key={i} style={{...TD,color:i===18?'#10b981':txt,fontWeight:i===18?700:400}}>{v}</td>)}</tr>}
                      <tr style={{background:'#fafafa'}}><td colSpan={20} style={{...TD,fontStyle:'italic',color:txtSub,textAlign:'center',padding:'16px'}}>Fără informații pentru perioada selectată</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* === RAPORT JUCATORI === */}
          {page==='players'&&(
            <div>
              <div style={filterRow}>
                <span style={{fontSize:13,color:txtSub}}>Valută</span><select style={inp}><option>USD</option></select>
                <span style={{fontSize:13,color:txtSub}}>Site web</span><select style={{...inp,width:150}}><option>Toate</option></select>
                <span style={{fontSize:13,color:txtSub}}>Jucător</span><input style={{...inp,width:120}} placeholder="ID jucător"/>
                <span style={{fontSize:13,color:txtSub}}>Perioada</span><select style={inp}><option>1 lună</option></select>
                <button style={btnPrimary}>GENERAȚI RAPORT</button>
              </div>
              <div style={{...card,padding:0,overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>{['Jucător','Data înregistrării','Prima depunere','Numărul de depuneri','Suma depunerilor','Venituri','Comisionul meu'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody><tr><td colSpan={7} style={{...TD,textAlign:'center',color:txtSub,padding:'24px',fontStyle:'italic'}}>Fără informații pentru perioada selectată</td></tr></tbody>
                </table>
              </div>
            </div>
          )}

          {/* === SUB-AFILIATI === */}
          {page==='subaff'&&(
            <div>
              <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:8,padding:'14px 16px',marginBottom:'1.25rem'}}>
                <div style={{fontSize:13,fontWeight:600,color:'#065f46',marginBottom:5}}>💰 Câștigă 3% din comisioanele bloggerilor pe care îi inviți — pe viață!</div>
                <div style={{fontFamily:'monospace',fontSize:12,color:'#047857',background:'rgba(0,0,0,0.04)',padding:'6px 10px',borderRadius:4,marginBottom:8,wordBreak:'break-all'}}>{refLink}</div>
                <button style={btnPrimary} onClick={()=>copy(refLink,'ref')}>{copied==='ref'?'✓ Copiat!':'Copiează linkul de referral'}</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:'1.25rem'}}>
                {[['Bloggeri invitați',D.refs.length,'#3b82f6'],['Total câștigat','$'+D.refs.reduce((s,r)=>s+r.cm,0).toFixed(2),'#10b981'],['Comision referral','3%',gold]].map(([l,v,c])=>(
                  <div key={l} style={{...card,textAlign:'center'}}>
                    <div style={{fontSize:11,color:txtSub,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:5}}>{l}</div>
                    <div style={{fontSize:24,fontWeight:800,color:c}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={filterRow}>
                <span style={{fontSize:13,color:txtSub}}>Valută</span><select style={inp}><option>USD</option></select>
                <span style={{fontSize:13,color:txtSub}}>Perioada</span><select style={inp}><option>1 lună</option></select>
                <button style={btnPrimary}>GENERAȚI RAPORT</button>
              </div>
              <div style={{...card,padding:0,overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>{['Blogger','Platformă','Data înregistrării','Înregistrări aduse','Câștigurile lui','Comisionul meu (3%)'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>{D.refs.map((r,i)=>(
                    <tr key={r.name} style={{background:i%2===0?'#fff':'#fafafa'}}>
                      <td style={{...TD,fontWeight:600}}>{r.name}</td>
                      <td style={TD}>{r.pl}</td>
                      <td style={{...TD,color:txtSub}}>{r.dt}</td>
                      <td style={TD}>{r.rg}</td>
                      <td style={TD}>${r.rv}</td>
                      <td style={{...TD,color:'#10b981',fontWeight:600}}>${r.cm.toFixed(2)}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {/* === INSTRUMENTE MARKETING === */}
          {page==='mkttools'&&(
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
              {[['📊','Raport complet','Statistici detaliate per zi','report'],['👥','Raport jucători','Activitatea fiecărui jucător','players'],['🌿','Sub-afiliați','Gestionați bloggerii invitați','subaff'],['🔗','Link-uri Afiliați','Linkuri de tracking personalizate','links'],['🎟','Coduri Promo','Coduri personalizate pentru promovare','promo'],['📢','Media','Bannere și materiale grafice','media']].map(([icon,t,d,dest])=>(
                <div key={t} style={{...card,cursor:'pointer',transition:'box-shadow .15s,transform .15s'}} onClick={()=>setPage(dest)}
                  onMouseOver={e=>{e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.12)';e.currentTarget.style.transform='translateY(-2px)'}}
                  onMouseOut={e=>{e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,0.06)';e.currentTarget.style.transform='none'}}>
                  <div style={{fontSize:28,marginBottom:10}}>{icon}</div>
                  <div style={{fontSize:14,fontWeight:700,color:txt,marginBottom:4}}>{t}</div>
                  <div style={{fontSize:12,color:txtSub,lineHeight:1.5}}>{d}</div>
                </div>
              ))}
            </div>
          )}

          {/* === CONTACTE === */}
          {page==='contact'&&(
            <div style={{...card,maxWidth:440}}>
              {[['Email','support@winpartners.partners'],['Telegram','@winpartners_support'],['WhatsApp','+373 XX XXX XXX'],['Program','24/7, 365 zile/an']].map(([l,v])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:`1px solid ${bdr}`}}>
                  <span style={{fontSize:13,color:txtSub,fontWeight:500}}>{l}</span>
                  <span style={{fontSize:13,color:gold,fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {/* === SITES === */}
          {page==='sites'&&(
            <div style={{...card,padding:0,overflow:'hidden'}}>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead><tr>{['Site web','Status','Data adăugării'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                <tbody>
                  <tr>
                    <td style={TD}>winpartners.partners</td>
                    <td style={TD}><span style={{background:'#d1fae5',color:'#065f46',padding:'2px 10px',borderRadius:12,fontSize:11,fontWeight:600}}>Activ</span></td>
                    <td style={TD}>2026-06-13</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>

      {/* PAY MODAL */}
      {showPay&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:'1rem'}} onClick={()=>setShowPay(false)}>
          <div style={{...card,width:'100%',maxWidth:380,boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}} onClick={e=>e.stopPropagation()}>
            {paySent?(
              <div style={{textAlign:'center',padding:'1rem'}}>
                <div style={{fontSize:40,marginBottom:10}}>✅</div>
                <h3 style={{fontWeight:700,marginBottom:6,fontSize:16,color:txt}}>Cerere trimisă!</h3>
                <p style={{color:txtSub,fontSize:13,marginBottom:16}}>Plata va fi procesată în 48 ore.</p>
                <button style={btnPrimary} onClick={()=>{setShowPay(false);setPaySent(false)}}>Închide</button>
              </div>
            ):(
              <>
                <div style={{fontSize:15,fontWeight:700,color:txt,marginBottom:4}}>Solicită plată</div>
                <p style={{color:txtSub,fontSize:13,marginBottom:14}}>Disponibil: <strong style={{color:'#10b981'}}>${D.bal.available}</strong> · Minimum $30</p>
                <label style={label}>Metodă de plată</label>
                <select style={{...inp,width:'100%',boxSizing:'border-box',marginBottom:10}} value={payMethod} onChange={e=>setPayMethod(e.target.value)}>{['Bitcoin','Skrill','Neteller','PAYEER','Transfer bancar'].map(m=><option key={m}>{m}</option>)}</select>
                <label style={label}>Adresa {payMethod}</label>
                <input style={{...inp,width:'100%',boxSizing:'border-box',marginBottom:14}} placeholder={payMethod==='Bitcoin'?'bc1q...':'Cont/email'} value={payAddr} onChange={e=>setPayAddr(e.target.value)}/>
                <button style={{...btnPrimary,width:'100%',padding:'10px',fontSize:14,borderRadius:6}} onClick={()=>payAddr&&setPaySent(true)}>Trimite cererea</button>
                <button style={{width:'100%',padding:'9px',fontSize:13,cursor:'pointer',border:`1px solid ${bdr}`,borderRadius:6,background:'none',color:txtSub,marginTop:8,fontFamily:'inherit'}} onClick={()=>setShowPay(false)}>Anulează</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* CODE MODAL */}
      {showCode&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:'1rem'}} onClick={()=>setShowCode(false)}>
          <div style={{...card,width:'100%',maxWidth:360,boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}} onClick={e=>e.stopPropagation()}>
            {codeSent?(
              <div style={{textAlign:'center',padding:'1rem'}}>
                <div style={{fontSize:40,marginBottom:10}}>✅</div>
                <h3 style={{fontWeight:700,marginBottom:6,fontSize:16,color:txt}}>Cerere trimisă!</h3>
                <p style={{color:txtSub,fontSize:13,marginBottom:16}}>Codul personalizat va fi activat în 24-48 ore.</p>
                <button style={btnPrimary} onClick={()=>{setShowCode(false);setCodeSent(false)}}>Închide</button>
              </div>
            ):(
              <>
                <div style={{fontSize:15,fontWeight:700,color:txt,marginBottom:4}}>Cere cod personalizat</div>
                <p style={{color:txtSub,fontSize:13,marginBottom:14}}>Procesare în 24-48 ore. Discutați cu managerul pentru bonusuri speciale.</p>
                <label style={label}>Codul dorit (ex: IONEL, VLAD20)</label>
                <input style={{...inp,width:'100%',boxSizing:'border-box',marginBottom:14,textTransform:'uppercase',fontFamily:'monospace',fontSize:14,fontWeight:700}} placeholder="IONEL" value={codeText} onChange={e=>setCodeText(e.target.value.toUpperCase())}/>
                <button style={{...btnPrimary,width:'100%',padding:'10px',fontSize:14,borderRadius:6}} onClick={()=>codeText&&setCodeSent(true)}>Trimite</button>
                <button style={{width:'100%',padding:'9px',fontSize:13,cursor:'pointer',border:`1px solid ${bdr}`,borderRadius:6,background:'none',color:txtSub,marginTop:8,fontFamily:'inherit'}} onClick={()=>setShowCode(false)}>Anulează</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
