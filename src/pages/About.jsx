import { useNavigate } from 'react-router-dom'

const awards = [
  {year:'2024', title:'Best Affiliate Program', org:'SiGMA Awards'},
  {year:'2024', title:'Casino Live of the Year', org:'AFFPAPA Media'},
  {year:'2025', title:'Best Affiliate Program 2025', org:'SiGMA Europe'},
  {year:'2025', title:'Best Casino Operator', org:'Industry Awards'},
  {year:'2026', title:'Affiliate Company of the Year', org:'European iGaming Awards'},
  {year:'2026', title:'Best Affiliate Program 2026', org:'SiGMA South America'},
]

export default function About() {
  const nav = useNavigate()
  const gold = '#f5a623'
  return (
    <div style={{background:'#0a0a0f',minHeight:'100vh',color:'#fff',fontFamily:"'Inter',sans-serif"}}>
      <nav style={{background:'rgba(10,10,15,0.97)',borderBottom:'1px solid rgba(245,166,35,0.12)',padding:'0 3rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:64}}>
        <div onClick={()=>nav('/')} style={{fontSize:20,fontWeight:900,cursor:'pointer'}}><span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span></div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>nav('/dashboard')} style={{padding:'7px 18px',fontSize:13,cursor:'pointer',border:'1px solid rgba(255,255,255,0.15)',borderRadius:4,background:'none',color:'#e2e8f0'}}>Login</button>
          <button onClick={()=>nav('/register')} style={{padding:'7px 18px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:4,background:gold,color:'#000'}}>Înregistrare</button>
        </div>
      </nav>
      <div style={{maxWidth:1000,margin:'0 auto',padding:'4rem 2rem'}}>
        <h1 style={{fontSize:'clamp(2rem,4vw,3rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:16}}>DESPRE <span style={{color:gold}}>WIN PARTNERS</span></h1>
        <p style={{fontSize:16,color:'rgba(255,255,255,0.6)',lineHeight:1.8,maxWidth:700,marginBottom:48}}>
          WinPartners este o platformă profesională de afiliere pentru bloggeri și influenceri. Oferim acces la cele mai mari cazinouri online și cele mai competitive comisioane din industrie. Misiunea noastră este să ajutăm creatorii de conținut să monetizeze audiența lor în mod eficient și transparent.
        </p>
        <h2 style={{fontSize:22,fontWeight:800,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:32,color:gold}}>REALIZĂRILE NOASTRE</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16,marginBottom:48}}>
          {awards.map((a,i)=>(
            <div key={i} style={{background:'rgba(245,166,35,0.05)',border:'1px solid rgba(245,166,35,0.15)',borderRadius:10,padding:'1.25rem',display:'flex',gap:14,alignItems:'center'}}>
              <div style={{background:'rgba(245,166,35,0.15)',border:`1px solid ${gold}`,borderRadius:8,padding:'6px 12px',fontSize:14,fontWeight:800,color:gold,whiteSpace:'nowrap'}}>{a.year}</div>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:'#fff'}}>{a.title}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginTop:2}}>{a.org}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:20}}>
          {[['500K+','Parteneri activi'],['1M+','Jucători înregistrați'],['$10M+','Plătit partenerilor'],['40+','GEO-uri active']].map(([v,l])=>(
            <div key={l} style={{textAlign:'center',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(245,166,35,0.1)',borderRadius:10,padding:'1.5rem'}}>
              <div style={{fontSize:36,fontWeight:900,color:gold}}>{v}</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'.08em',marginTop:4}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
