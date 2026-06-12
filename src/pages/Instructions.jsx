import { useNavigate } from 'react-router-dom'

export default function Instructions() {
  const nav = useNavigate()
  const gold = '#f5a623'
  const steps = [
    {n:'01',t:'Înregistrați-vă',d:'Completați formularul de înregistrare cu datele dvs. Procesul durează 2 minute și este complet gratuit. Nu sunt necesare contracte sau investiții inițiale.'},
    {n:'02',t:'Așteptați aprobarea',d:'Contul dvs. va fi verificat de echipa noastră în maxim 24 ore. Veți primi un email de confirmare cu datele de acces.'},
    {n:'03',t:'Obțineți codul promoțional',d:'După aprobare, primiți automat un cod promoțional unic. Puteți solicita și un cod personalizat cu numele dvs. din dashboard.'},
    {n:'04',t:'Obțineți linkurile de afiliat',d:'Din secțiunea "Linkuri" generați linkuri unice cu SubID pentru fiecare campanie sau platformă socială.'},
    {n:'05',t:'Promovați pe rețele sociale',d:'Distribuiți codul și linkurile pe TikTok, Instagram, YouTube, Telegram, Facebook sau alte platforme. Includeți codul în videoclipuri, bio și descrieri.'},
    {n:'06',t:'Monitorizați statisticile',d:'Verificați zilnic dashboard-ul pentru a vedea câți jucători ați adus, câți au depus și cât câștigați. Statisticile se actualizează zilnic.'},
    {n:'07',t:'Solicitați plata',d:'Când soldul dvs. depășește $30, puteți solicita plata. Plățile se procesează de 2 ori pe săptămână prin metoda preferată.'},
    {n:'08',t:'Invitați alți bloggeri',d:'Distribuiți linkul dvs. de referral altor bloggeri. Câștigați 3% din comisioanele lor pe viață fără niciun efort suplimentar.'},
  ]
  return (
    <div style={{background:'#0a0a0f',minHeight:'100vh',color:'#fff',fontFamily:"'Inter',sans-serif"}}>
      <nav style={{background:'rgba(10,10,15,0.97)',borderBottom:'1px solid rgba(245,166,35,0.12)',padding:'0 3rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:64}}>
        <div onClick={()=>nav('/')} style={{fontSize:20,fontWeight:900,cursor:'pointer'}}><span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span></div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>nav('/dashboard')} style={{padding:'7px 18px',fontSize:13,cursor:'pointer',border:'1px solid rgba(255,255,255,0.15)',borderRadius:4,background:'none',color:'#e2e8f0'}}>Login</button>
          <button onClick={()=>nav('/register')} style={{padding:'7px 18px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:4,background:gold,color:'#000'}}>Înregistrare</button>
        </div>
      </nav>
      <div style={{maxWidth:900,margin:'0 auto',padding:'4rem 2rem'}}>
        <h1 style={{fontSize:'clamp(2rem,4vw,3rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:8}}>INSTRUCȚIUNI <span style={{color:gold}}>PAS CU PAS</span></h1>
        <p style={{fontSize:15,color:'rgba(255,255,255,0.5)',marginBottom:48}}>Cum să începeți să câștigați cu WinPartners</p>
        <div style={{display:'flex',flexDirection:'column',gap:0}}>
          {steps.map((s,i)=>(
            <div key={i} style={{display:'flex',gap:24,padding:'1.5rem 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
              <div style={{width:56,height:56,borderRadius:'50%',background:'rgba(245,166,35,0.1)',border:`2px solid ${gold}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:900,color:gold,flexShrink:0}}>{s.n}</div>
              <div style={{paddingTop:8}}>
                <div style={{fontSize:17,fontWeight:700,color:'#fff',marginBottom:6}}>{s.t}</div>
                <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.7}}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',marginTop:48}}>
          <button onClick={()=>nav('/register')} style={{padding:'16px 48px',fontSize:15,fontWeight:800,cursor:'pointer',border:'none',borderRadius:4,background:gold,color:'#000',textTransform:'uppercase'}}>ÎNREGISTRARE GRATUITĂ</button>
        </div>
      </div>
    </div>
  )
}
