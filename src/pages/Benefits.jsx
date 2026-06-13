import { useNavigate } from 'react-router-dom'

export default function Benefits() {
  const nav = useNavigate()
  const gold = '#f5a623'
  const benefits = [
    {icon:'💰',t:'Comision RevShare 25%',d:'Primiți 25% din veniturile nete generate de jucătorii recomandați pe toată durata activității lor. Fără limită de timp, fără reduceri.'},
    {icon:'📊',t:'Statistici detaliate',d:'Rapoarte complete cu vizualizări, clickuri, înregistrări, depunători noi, profit al companiei și suma comisionului dvs.'},
    {icon:'🎯',t:'Cod promoțional unic',d:'Fiecare partener primește un cod personalizat. Jucătorii îl introduc la înregistrare și sunt legați automat de dvs.'},
    {icon:'⚡',t:'Plăți săptămânale',d:'Plăți garantate de două ori pe săptămână prin Bitcoin, Skrill, Neteller, PAYEER, Visa, Mastercard sau transfer bancar.'},
    {icon:'👥',t:'Program referrali 3%',d:'Invitați alți bloggeri în program și câștigați 3% din comisioanele lor pe viață. Cu cât mai mulți parteneri, cu atât mai mult câștigați.'},
    {icon:'💬',t:'Manager personal 24/7',d:'Fiecare partener are un manager dedicat disponibil permanent pe WhatsApp și Telegram pentru suport și optimizare.'},
    {icon:'🌍',t:'40+ GEO-uri',d:'Promovați în peste 40 de țări. Cazinouri disponibile în Moldova, România, Ucraina, Rusia, Kazakhstan și multe altele.'},
    {icon:'📱',t:'Materiale de marketing',d:'Bannere, linkuri, videoclipuri și alte materiale de promovare gata de utilizat pentru toate platformele sociale.'},
    {icon:'🔒',t:'Transparență totală',d:'Statistici actualizate zilnic. Nicio manipulare, nicio întârziere. Vedeți exact câți jucători ați adus și cât câștigați.'},
  ]
  return (
    <div style={{background:'#0a0a0f',minHeight:'100vh',color:'#fff',fontFamily:"'Inter',sans-serif"}}>
      <nav style={{background:'rgba(10,10,15,0.97)',borderBottom:'1px solid rgba(245,166,35,0.12)',padding:'0 1rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:60,flexWrap:'wrap'}}>
        <div onClick={()=>nav('/')} style={{fontSize:20,fontWeight:900,cursor:'pointer'}}><span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span></div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>nav('/dashboard')} style={{padding:'7px 18px',fontSize:13,cursor:'pointer',border:'1px solid rgba(255,255,255,0.15)',borderRadius:4,background:'none',color:'#e2e8f0'}}>Login</button>
          <button onClick={()=>nav('/register')} style={{padding:'7px 18px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:4,background:gold,color:'#000'}}>Înregistrare</button>
        </div>
      </nav>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'2rem 1rem'}}>
        <h1 style={{fontSize:'clamp(2rem,4vw,3rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:8}}>BENEFICIILE <span style={{color:gold}}>PROGRAMULUI</span></h1>
        <p style={{fontSize:15,color:'rgba(255,255,255,0.5)',marginBottom:48}}>Tot ce ai nevoie pentru a câștiga din audiența ta</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:20}}>
          {benefits.map((b,i)=>(
            <div key={i} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(245,166,35,0.12)',borderRadius:12,padding:'1.5rem',display:'flex',gap:16}}>
              <div style={{width:50,height:50,background:'rgba(245,166,35,0.1)',border:'1px solid rgba(245,166,35,0.25)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{b.icon}</div>
              <div>
                <div style={{fontSize:15,fontWeight:700,color:'#fff',marginBottom:6}}>{b.t}</div>
                <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.6}}>{b.d}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',marginTop:48}}>
          <button onClick={()=>nav('/register')} style={{padding:'16px 48px',fontSize:15,fontWeight:800,cursor:'pointer',border:'none',borderRadius:4,background:gold,color:'#000',textTransform:'uppercase',letterSpacing:'.05em'}}>ÎNCEPEȚI ACUM</button>
        </div>
      </div>
    </div>
  )
}
