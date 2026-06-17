import { useNavigate } from 'react-router-dom'
export default function Terms() {
  const nav = useNavigate()
  const gold = '#f5a623'
  return (
    <div style={{background:'#0a0a0f',minHeight:'100vh',color:'#fff',fontFamily:"'Inter',sans-serif"}}>
      <nav style={{background:'rgba(10,10,15,0.97)',borderBottom:'1px solid rgba(245,166,35,0.12)',padding:'0 1rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:60}}>
        <div onClick={()=>nav('/')} style={{fontSize:20,fontWeight:900,cursor:'pointer'}}><span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span></div>
        <button onClick={()=>nav(-1)} style={{padding:'7px 18px',fontSize:13,cursor:'pointer',border:'1px solid rgba(255,255,255,0.15)',borderRadius:4,background:'none',color:'#e2e8f0'}}>← Înapoi</button>
      </nav>
      <div style={{maxWidth:800,margin:'0 auto',padding:'2rem 1rem'}}>
        <h1 style={{fontSize:32,fontWeight:900,textTransform:'uppercase',marginBottom:8}}>TERMENI ȘI <span style={{color:gold}}>CONDIȚII</span></h1>
        <p style={{color:'rgba(255,255,255,0.4)',marginBottom:40,fontSize:13}}>Ultima actualizare: Iunie 2026</p>
        {[
          ['1. Acceptarea termenilor','Prin înregistrarea pe platforma WinPartners, confirmați că ați citit, înțeles și acceptat toți termenii și condițiile prezentate în acest document. Dacă nu sunteți de acord cu acești termeni, nu utilizați platforma.'],
          ['2. Eligibilitate','Programul de afiliere WinPartners este deschis persoanelor cu vârsta de minimum 18 ani. Participanții sunt responsabili să respecte legile locale privind jocurile de noroc și publicitatea acestora în jurisdicția lor.'],
          ['3. Comisioane','Partenerii primesc 25% Revenue Share din pierderile nete ale jucătorilor recomandați, pe toată durata activității acestora. Comisionul se calculează lunar și se plătește săptămânal pentru solduri ce depășesc $30.'],
          ['4. Cod promoțional','Fiecare partener primește unul sau mai multe coduri promoționale unice. Este interzisă utilizarea codurilor în mod fraudulos, înșelător sau prin metode de spam. WinPartners poate anula coduri utilizate necorespunzător și poate suspenda contul asociat.'],
          ['5. Plăți','Comisioanele se plătesc săptămânal, cu un sold minim de $30. Metodele acceptate: Bitcoin, USDT (TRC20/ERC20), Ethereum, Binance Pay, Skrill, Neteller. Plățile se procesează în 24-48 ore lucrătoare de la solicitare.'],
          ['6. Conduita partenerului','Partenerii nu pot promova serviciile WinPartners prin spam, publicitate înșelătoare, conținut destinat minorilor sau metode care încalcă politicile platformelor sociale. Nerespectarea acestor reguli duce la suspendarea imediată a contului.'],
          ['7. Confidențialitate','Datele personale ale partenerilor sunt stocate și procesate în conformitate cu regulamentul GDPR. Nu vindem și nu distribuim date personale terților fără consimțământul explicit al titularului.'],
          ['8. Modificarea termenilor','WinPartners își rezervă dreptul de a modifica acești termeni cu notificare prealabilă de minimum 7 zile. Continuarea utilizării platformei după modificări constituie acceptarea noilor termeni.'],
          ['9. Terminare','WinPartners poate suspenda sau închide orice cont care încalcă acești termeni. Soldurile neachitate la momentul terminării vor fi plătite în termen de 30 de zile, dacă nu există dispute.'],
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
