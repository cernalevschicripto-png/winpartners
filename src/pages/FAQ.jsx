import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const faqs = [
  {q:'Cât costă înregistrarea?',a:'Înregistrarea este complet gratuită. Nu există costuri ascunse, taxe de aderare sau investiții minime.'},
  {q:'Cât timp durează aprobarea contului?',a:'Contul dvs. va fi verificat și aprobat în maxim 24 ore lucrătoare de la înregistrare.'},
  {q:'Care este comisionul meu?',a:'Primiți 25% din pierderile jucătorilor pe care îi recomandați. Este un comision pe viață — câștigați cât timp jucătorul rămâne activ pe Melbet.'},
  {q:'Când și cum primesc plata?',a:'Plățile se procesează de 2 ori pe săptămână. Suma minimă pentru retragere este $30. Plătim prin Bitcoin, Skrill, Neteller, PAYEER, Visa, Mastercard sau transfer bancar.'},
  {q:'Pot solicita un cod promoțional personalizat?',a:'Da! Din dashboard puteți trimite o cerere pentru un cod personalizat cu numele dvs. (ex: IONEL, VLAD20). Cererea se procesează în 24-48 ore.'},
  {q:'Cum funcționează programul de referrali?',a:'Când invitați alt blogger în program folosind linkul dvs. de referral, câștigați 3% din toate comisioanele lui pe viață.'},
  {q:'Pe ce platforme pot promova?',a:'Puteți promova pe orice platformă: TikTok, Instagram, YouTube, Telegram, Facebook, Twitter, site-uri web, blog-uri etc.'},
  {q:'Când se actualizează statisticile?',a:'Statisticile se actualizează zilnic, direct din sistemele Melbet. Puteți vedea clickuri, înregistrări, depunători și comisioane per zi.'},
  {q:'Ce se întâmplă dacă un jucător pierde bani?',a:'Primiți 25% din pierderile nete ale jucătorilor. Cu cât joacă mai mult, cu atât câștigați mai mult.'},
  {q:'Pot să am mai multe coduri promoționale?',a:'Da, puteți genera mai multe coduri pentru campanii sau platforme diferite. Statisticile fiecărui cod sunt urmărite separat în dashboard.'},
]

export default function FAQ() {
  const [open, setOpen] = useState(null)
  const nav = useNavigate()
  const gold = '#f5a623'
  return (
    <div style={{background:'#0a0a0f',minHeight:'100vh',color:'#fff',fontFamily:"'Inter',sans-serif"}}>
      <nav style={{background:'rgba(10,10,15,0.97)',borderBottom:'1px solid rgba(245,166,35,0.12)',padding:'0 1rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:60,flexWrap:'wrap'}}>
        <div onClick={()=>nav('/')} style={{fontSize:20,fontWeight:900,cursor:'pointer'}}><span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span></div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>nav('/dashboard')} style={{padding:'7px 18px',fontSize:13,cursor:'pointer',border:'1px solid rgba(255,255,255,0.15)',borderRadius:4,background:'none',color:'#e2e8f0'}}>Login</button>
          <button onClick={()=>nav('/register')} style={{padding:'7px 18px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:4,background:gold,color:'#000'}}>Înregistrare</button>
        </div>
      </nav>
      <div style={{maxWidth:800,margin:'0 auto',padding:'2rem 1rem'}}>
        <h1 style={{fontSize:'clamp(2rem,4vw,3rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:8}}>ÎNTREBĂRI <span style={{color:gold}}>FRECVENTE</span></h1>
        <p style={{fontSize:15,color:'rgba(255,255,255,0.5)',marginBottom:48}}>Răspunsuri la cele mai comune întrebări</p>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {faqs.map((f,i)=>(
            <div key={i} style={{background:'rgba(255,255,255,0.03)',border:`1px solid ${open===i?'rgba(245,166,35,0.3)':'rgba(255,255,255,0.07)'}`,borderRadius:10,overflow:'hidden',cursor:'pointer'}} onClick={()=>setOpen(open===i?null:i)}>
              <div style={{padding:'1.1rem 1.25rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:15,fontWeight:600,color:open===i?gold:'#fff'}}>{f.q}</span>
                <span style={{fontSize:20,color:open===i?gold:'rgba(255,255,255,0.3)',transition:'transform .2s',transform:open===i?'rotate(45deg)':'none'}}>+</span>
              </div>
              {open===i && <div style={{padding:'0 1.25rem 1.1rem',fontSize:14,color:'rgba(255,255,255,0.6)',lineHeight:1.7,borderTop:'1px solid rgba(245,166,35,0.1)'}}>{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
