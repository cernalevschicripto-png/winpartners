import { useNavigate } from 'react-router-dom'
export default function Terms() {
  const nav = useNavigate()
  const gold = '#f5a623'
  return (
    <div style={{background:'#0a0a0f',minHeight:'100vh',color:'#fff',fontFamily:"'Inter',sans-serif"}}>
      <nav style={{background:'rgba(10,10,15,0.97)',borderBottom:'1px solid rgba(245,166,35,0.12)',padding:'0 3rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:64}}>
        <div onClick={()=>nav('/')} style={{fontSize:20,fontWeight:900,cursor:'pointer'}}><span>WIN</span><span style={{color:gold}}>PARTNERS</span></div>
        <button onClick={()=>nav('/')} style={{padding:'7px 18px',fontSize:13,cursor:'pointer',border:'1px solid rgba(255,255,255,0.15)',borderRadius:4,background:'none',color:'#e2e8f0'}}>← Înapoi</button>
      </nav>
      <div style={{maxWidth:800,margin:'0 auto',padding:'4rem 2rem'}}>
        <h1 style={{fontSize:32,fontWeight:900,textTransform:'uppercase',marginBottom:8}}>TERMENI ȘI <span style={{color:gold}}>CONDIȚII</span></h1>
        <p style={{color:'rgba(255,255,255,0.4)',marginBottom:40,fontSize:13}}>Ultima actualizare: Iunie 2026</p>
        {[
          ['1. Acceptarea termenilor','Prin înregistrarea pe platforma WinPartners, confirmați că ați citit, înțeles și acceptat toți termenii și condițiile prezentate în acest document.'],
          ['2. Eligibilitate','Programul de afiliere WinPartners este deschis persoanelor cu vârsta de 18 ani sau mai mult. Participanții trebuie să respecte legile locale privind jocurile de noroc.'],
          ['3. Comisioane','Partenerii primesc 20% din veniturile nete generate de jucătorii recomandați. Comisionul se calculează lunar și se plătește săptămânal pentru solduri ce depășesc $30.'],
          ['4. Cod promoțional','Fiecare partener primește un cod unic. Este interzisă utilizarea codului în moduri frauduloase sau înșelătoare. WinPartners își rezervă dreptul de a anula coduri utilizate necorespunzător.'],
          ['5. Plăți','Plățile se efectuează prin metodele disponibile în platforma. Minimum de retragere: $30. Procesare în 2-5 zile lucrătoare.'],
          ['6. Terminare','WinPartners poate suspenda sau termina orice cont de partener care încalcă acești termeni, cu notificare prealabilă unde este posibil.'],
        ].map(([t,d])=>(
          <div key={t} style={{marginBottom:32}}>
            <h3 style={{fontSize:17,fontWeight:700,color:gold,marginBottom:8}}>{t}</h3>
            <p style={{fontSize:14,color:'rgba(255,255,255,0.6)',lineHeight:1.8}}>{d}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
