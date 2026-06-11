import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const mockData = {
  name: 'Ion Popescu',
  username: 'ionpopescu',
  promoCode: 'IONPOPESCU_WIN',
  platform: 'TikTok',
  stats: {
    clicks: 1247,
    registrations: 89,
    activeUsers: 34,
    earnings: 1840,
    pendingPayout: 920,
    thisMonth: 620,
  },
  daily: [
    {date:'03.06',clicks:145,regs:12,earn:180},
    {date:'04.06',clicks:198,regs:18,earn:260},
    {date:'05.06',clicks:167,regs:14,earn:210},
    {date:'06.06',clicks:223,regs:21,earn:310},
    {date:'07.06',clicks:189,regs:16,earn:240},
    {date:'08.06',clicks:201,regs:19,earn:285},
    {date:'09.06',clicks:124,regs:11,earn:155},
  ],
  referrals: [
    {name:'@alex_md',platform:'Instagram',regs:23,earn:180,status:'activ'},
    {name:'@vlad_gaming',platform:'YouTube',regs:45,earn:340,status:'activ'},
    {name:'@marina_ro',platform:'TikTok',regs:12,earn:90,status:'activ'},
  ],
  payments: [
    {date:'01.06.2026',amount:920,method:'Bitcoin',status:'plătit'},
    {date:'01.05.2026',amount:780,method:'Bitcoin',status:'plătit'},
  ]
}

export default function Dashboard() {
  const [tab, setTab] = useState('overview')
  const [copied, setCopied] = useState(false)
  const [showPayReq, setShowPayReq] = useState(false)
  const [showCodeReq, setShowCodeReq] = useState(false)
  const navigate = useNavigate()
  const d = mockData

  const copy = (text) => {
    navigator.clipboard.writeText(text).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000)})
  }

  const c = {
    wrap: {minHeight:'100vh',background:'#060612'},
    nav: {background:'rgba(10,10,24,0.95)',borderBottom:'1px solid rgba(255,255,255,0.07)',padding:'0 2rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:60},
    logo: {fontSize:18,fontWeight:800,color:'#fff'},
    logoS: {color:'#7c3aed'},
    user: {display:'flex',alignItems:'center',gap:10},
    avatar: {width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#5b21b6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#fff'},
    userName: {fontSize:13,color:'rgba(255,255,255,0.7)',fontWeight:500},
    logoutBtn: {padding:'5px 12px',fontSize:12,cursor:'pointer',border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,background:'none',color:'rgba(255,255,255,0.4)'},
    main: {maxWidth:1000,margin:'0 auto',padding:'2rem 1.5rem'},
    codeBox: {background:'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(91,33,182,0.1))',border:'1px solid rgba(124,58,237,0.25)',borderRadius:16,padding:'1.5rem',marginBottom:'1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12},
    codeLabel: {fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:4,textTransform:'uppercase',letterSpacing:'.08em'},
    codeValue: {fontSize:24,fontWeight:800,color:'#a78bfa',fontFamily:'monospace',letterSpacing:'.05em'},
    copyBtn: {padding:'8px 16px',fontSize:13,fontWeight:600,cursor:'pointer',border:'none',borderRadius:8,background:copied?'#10b981':'rgba(124,58,237,0.4)',color:'#fff',transition:'background .2s'},
    reqBtn: {padding:'8px 16px',fontSize:13,fontWeight:600,cursor:'pointer',border:'1px solid rgba(124,58,237,0.4)',borderRadius:8,background:'none',color:'#a78bfa'},
    tabs: {display:'flex',gap:4,marginBottom:'1.5rem',borderBottom:'1px solid rgba(255,255,255,0.07)',paddingBottom:0},
    tab: (active) => ({padding:'8px 16px',fontSize:13,cursor:'pointer',border:'none',background:'none',color:active?'#a78bfa':'rgba(255,255,255,0.4)',borderBottom:active?'2px solid #7c3aed':'2px solid transparent',marginBottom:-1,fontWeight:active?600:400}),
    grid4: {display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12,marginBottom:'1.5rem'},
    card: {background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:'1.25rem'},
    cardLabel: {fontSize:11,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6},
    cardVal: {fontSize:26,fontWeight:800,color:'#fff'},
    cardValGreen: {fontSize:26,fontWeight:800,color:'#10b981'},
    cardValPurple: {fontSize:26,fontWeight:800,color:'#a78bfa'},
    table: {width:'100%',borderCollapse:'collapse',fontSize:13},
    th: {textAlign:'left',padding:'10px 12px',color:'rgba(255,255,255,0.35)',fontWeight:400,borderBottom:'1px solid rgba(255,255,255,0.07)',fontSize:11,textTransform:'uppercase',letterSpacing:'.05em'},
    td: {padding:'10px 12px',borderBottom:'1px solid rgba(255,255,255,0.04)',color:'#e2e8f0'},
    tableWrap: {background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,overflow:'auto'},
    modal: {position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:'1rem'},
    modalBox: {background:'#0d0d1f',border:'1px solid rgba(255,255,255,0.1)',borderRadius:16,padding:'1.5rem',width:'100%',maxWidth:420},
    inp: {width:'100%',padding:'9px 12px',fontSize:13,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,background:'rgba(255,255,255,0.05)',color:'#e2e8f0',marginBottom:10,outline:'none'},
    submitBtn: {width:'100%',padding:'11px',fontSize:14,fontWeight:700,cursor:'pointer',border:'none',borderRadius:8,background:'linear-gradient(135deg,#7c3aed,#5b21b6)',color:'#fff'},
    cancelBtn: {width:'100%',padding:'9px',fontSize:13,cursor:'pointer',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,background:'none',color:'rgba(255,255,255,0.4)',marginTop:8},
  }

  const refLink = `https://winpartners.io/register?ref=${d.username}`

  return (
    <div style={c.wrap}>
      <nav style={c.nav}>
        <div style={c.logo} onClick={()=>navigate('/')} className="pointer">Win<span style={c.logoS}>Partners</span></div>
        <div style={c.user}>
          <div style={c.avatar}>{d.name[0]}</div>
          <span style={c.userName}>{d.name}</span>
          <button style={c.logoutBtn} onClick={()=>navigate('/')}>Logout</button>
        </div>
      </nav>

      <div style={c.main}>
        <div style={c.codeBox}>
          <div>
            <div style={c.codeLabel}>Codul tău promoțional</div>
            <div style={c.codeValue}>{d.promoCode}</div>
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <button style={c.copyBtn} onClick={()=>copy(d.promoCode)}>{copied?'✓ Copiat!':'Copiază codul'}</button>
            <button style={c.reqBtn} onClick={()=>setShowCodeReq(true)}>Cere cod personalizat</button>
          </div>
        </div>

        <div style={c.codeBox}>
          <div>
            <div style={c.codeLabel}>Link-ul tău de referral</div>
            <div style={{fontSize:13,color:'#a78bfa',fontFamily:'monospace',wordBreak:'break-all'}}>{refLink}</div>
          </div>
          <button style={c.copyBtn} onClick={()=>copy(refLink)}>Copiază link</button>
        </div>

        <div style={c.tabs}>
          {[['overview','Overview'],['stats','Statistici'],['referrals','Referrali'],['payments','Plăți']].map(([id,lbl])=>(
            <button key={id} style={c.tab(tab===id)} onClick={()=>setTab(id)}>{lbl}</button>
          ))}
        </div>

        {tab==='overview' && (
          <div>
            <div style={c.grid4}>
              <div style={c.card}><div style={c.cardLabel}>Click-uri total</div><div style={c.cardVal}>{d.stats.clicks.toLocaleString()}</div></div>
              <div style={c.card}><div style={c.cardLabel}>Înregistrări</div><div style={c.cardVal}>{d.stats.registrations}</div></div>
              <div style={c.card}><div style={c.cardLabel}>Câștiguri totale</div><div style={c.cardValGreen}>${d.stats.earnings}</div></div>
              <div style={c.card}><div style={c.cardLabel}>De primit</div><div style={c.cardValPurple}>${d.stats.pendingPayout}</div></div>
            </div>
            <div style={{...c.tableWrap,marginBottom:'1rem'}}>
              <table style={c.table}>
                <thead><tr><th style={c.th}>Data</th><th style={c.th}>Click-uri</th><th style={c.th}>Înregistrări</th><th style={c.th}>Câștiguri</th></tr></thead>
                <tbody>{d.daily.map(r=><tr key={r.date}><td style={c.td}>{r.date}</td><td style={c.td}>{r.clicks}</td><td style={c.td}>{r.regs}</td><td style={{...c.td,color:'#10b981',fontWeight:600}}>${r.earn}</td></tr>)}</tbody>
              </table>
            </div>
            <div style={{textAlign:'center'}}>
              <button onClick={()=>setShowPayReq(true)} style={{padding:'12px 32px',fontSize:14,fontWeight:700,cursor:'pointer',border:'none',borderRadius:10,background:'linear-gradient(135deg,#7c3aed,#5b21b6)',color:'#fff'}}>
                Solicită plată → ${d.stats.pendingPayout}
              </button>
            </div>
          </div>
        )}

        {tab==='stats' && (
          <div style={c.tableWrap}>
            <table style={c.table}>
              <thead><tr><th style={c.th}>Data</th><th style={c.th}>Click-uri</th><th style={c.th}>Înregistrări</th><th style={c.th}>Câștiguri</th></tr></thead>
              <tbody>{d.daily.map(r=><tr key={r.date}><td style={c.td}>{r.date}</td><td style={c.td}>{r.clicks}</td><td style={c.td}>{r.regs}</td><td style={{...c.td,color:'#10b981',fontWeight:600}}>${r.earn}</td></tr>)}</tbody>
            </table>
          </div>
        )}

        {tab==='referrals' && (
          <div>
            <div style={{...c.card,marginBottom:'1rem'}}>
              <div style={c.cardLabel}>Câștiguri din referrali (3%)</div>
              <div style={c.cardValPurple}>${d.referrals.reduce((s,r)=>s+Math.round(r.earn*0.03),0)}</div>
            </div>
            <div style={c.tableWrap}>
              <table style={c.table}>
                <thead><tr><th style={c.th}>Blogger</th><th style={c.th}>Platformă</th><th style={c.th}>Înregistrări</th><th style={c.th}>Câștigurile lui</th><th style={c.th}>Comisionul tău (3%)</th></tr></thead>
                <tbody>{d.referrals.map(r=><tr key={r.name}>
                  <td style={c.td}>{r.name}</td>
                  <td style={c.td}>{r.platform}</td>
                  <td style={c.td}>{r.regs}</td>
                  <td style={c.td}>${r.earn}</td>
                  <td style={{...c.td,color:'#a78bfa',fontWeight:600}}>${Math.round(r.earn*0.03)}</td>
                </tr>)}</tbody>
              </table>
            </div>
          </div>
        )}

        {tab==='payments' && (
          <div style={c.tableWrap}>
            <table style={c.table}>
              <thead><tr><th style={c.th}>Data</th><th style={c.th}>Sumă</th><th style={c.th}>Metodă</th><th style={c.th}>Status</th></tr></thead>
              <tbody>{d.payments.map((p,i)=><tr key={i}>
                <td style={c.td}>{p.date}</td>
                <td style={{...c.td,fontWeight:600,color:'#10b981'}}>${p.amount}</td>
                <td style={c.td}>{p.method}</td>
                <td style={c.td}><span style={{background:'#10b98122',color:'#10b981',padding:'2px 8px',borderRadius:5,fontSize:11,fontWeight:600}}>{p.status}</span></td>
              </tr>)}</tbody>
            </table>
          </div>
        )}
      </div>

      {showPayReq && (
        <div style={c.modal} onClick={()=>setShowPayReq(false)}>
          <div style={c.modalBox} onClick={e=>e.stopPropagation()}>
            <h3 style={{color:'#fff',fontWeight:700,marginBottom:4}}>Solicită plată</h3>
            <p style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginBottom:16}}>Suma disponibilă: <strong style={{color:'#a78bfa'}}>${d.stats.pendingPayout}</strong></p>
            <input style={c.inp} placeholder="Adresa Bitcoin / Skrill / Neteller" defaultValue=""/>
            <input style={c.inp} placeholder="Suma solicitată ($)" defaultValue={d.stats.pendingPayout}/>
            <button style={c.submitBtn} onClick={()=>setShowPayReq(false)}>Trimite cererea</button>
            <button style={c.cancelBtn} onClick={()=>setShowPayReq(false)}>Anulează</button>
          </div>
        </div>
      )}

      {showCodeReq && (
        <div style={c.modal} onClick={()=>setShowCodeReq(false)}>
          <div style={c.modalBox} onClick={e=>e.stopPropagation()}>
            <h3 style={{color:'#fff',fontWeight:700,marginBottom:4}}>Cere cod personalizat</h3>
            <p style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginBottom:16}}>Codurile personalizate se procesează în 24-48 ore.</p>
            <input style={c.inp} placeholder="Codul dorit (ex: IONEL, VLAD20)" defaultValue=""/>
            <input style={c.inp} placeholder="Motivul cererii (opțional)" defaultValue=""/>
            <button style={c.submitBtn} onClick={()=>setShowCodeReq(false)}>Trimite cererea</button>
            <button style={c.cancelBtn} onClick={()=>setShowCodeReq(false)}>Anulează</button>
          </div>
        </div>
      )}
    </div>
  )
}
