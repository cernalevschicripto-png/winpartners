import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { addApplication } from '../db.js'

const gold = '#f5a623'
const PLATFORMS = ['TikTok','Instagram','YouTube','Telegram','Facebook','Twitter/X','Altele']
const COUNTRIES = ['Moldova','România','Ucraina','Rusia','Kazakhstan','Belarus','Georgia','Armenia','Azerbaijan','Altă țară']

// Salvează cererea în Firebase Realtime Database + email notificare
async function saveApplication(data) {
  // Firebase — sincronizare în timp real cu Admin
  await addApplication(data)
  // Email notificare (opțional, nu blochează)
  try {
    await fetch('https://formspree.io/f/mnjyoylo', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify({
        _subject: '🆕 Cerere nouă afiliere — ' + data.name + ' (' + data.platform + ' · ' + Number(data.followers||0).toLocaleString() + ' urmăritori)',
        nume: data.name,
        username: '@' + data.username,
        email: data.email,
        telefon: data.phone,
        tara: data.country,
        platforma: data.platform,
        urmaritori: data.followers,
        profil: data.profileLink,
        despre: data.aboutYou || '—',
        metoda_plata: data.payMethod,
        adresa_plata: data.payAddress || 'necompletată',
        cod_invitatie: data.refCode || '—',
        data: new Date().toLocaleString('ro-RO'),
      })
    })
  } catch(e) { /* email opțional */ }
}

export default function Register() {
  const [searchParams] = useSearchParams()
  const refCode = searchParams.get('ref') || ''
  const inviteCode = searchParams.get('invite') || ''

  const [lang, setLang] = useState('ro')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [step, setStep] = useState(1) // 1=formular, 2=confirmare trimisă
  const [form, setForm] = useState({
    name: '', username: '', email: '', phone: '',
    platform: 'TikTok', followers: '', country: 'Moldova',
    profileLink: '', aboutYou: '',
    refCode: refCode || inviteCode,
    payMethod: 'Bitcoin (BTC)', payAddress: '',
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  const validate = () => {
    const e = {}
    if (!form.name.trim() || form.name.trim().length < 2) e.name = true
    if (!form.username.trim() || form.username.trim().length < 3) e.username = true
    if (!form.email.includes('@') || !form.email.includes('.')) e.email = true
    if (!form.phone.trim() || form.phone.trim().length < 6) e.phone = true
    if (!form.profileLink.trim()) e.profileLink = true
    if (!form.followers || +form.followers < 100) e.followers = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) return
    await saveApplication(form)
    setStep(2)
  }

  const inp = { width:'100%', padding:'11px 14px', fontSize:14, border:'1px solid rgba(255,255,255,0.12)', borderRadius:6, background:'rgba(255,255,255,0.05)', color:'#e2e8f0', outline:'none', boxSizing:'border-box' }
  const inpErr = { ...inp, borderColor: '#ef4444' }
  const lbl = { fontSize:11, color:'rgba(255,255,255,0.45)', marginBottom:5, display:'block', fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em' }

  // PASUL 2 — Confirmare
  if (step === 2) return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem',fontFamily:'Inter,sans-serif'}}>
      <div style={{textAlign:'center',maxWidth:520,width:'100%'}}>
        {/* Icon */}
        <div style={{width:88,height:88,borderRadius:'50%',background:'rgba(245,166,35,0.1)',border:`2px solid ${gold}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:isMobile?28:40,margin:'0 auto 28px'}}>
          📬
        </div>

        <h2 style={{fontSize:26,fontWeight:900,color:'#fff',marginBottom:12,textTransform:'uppercase'}}>
          Cererea a fost trimisă!
        </h2>

        <p style={{color:'rgba(255,255,255,0.55)',marginBottom:28,lineHeight:1.8,fontSize:14}}>
          Mulțumim, <strong style={{color:'#fff'}}>{form.name}</strong>! Cererea ta de afiliere a fost primită și va fi analizată de echipa noastră.
        </p>

        {/* Timeline de așteptare */}
        <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(245,166,35,0.15)',borderRadius:12,padding:'1.5rem',marginBottom:24,textAlign:'left'}}>
          <div style={{fontSize:12,color:gold,fontWeight:700,marginBottom:16,textTransform:'uppercase',letterSpacing:'.08em'}}>Ce urmează:</div>
          {[
            ['📬', 'Acum', 'Cererea ta a fost înregistrată și trimisă echipei noastre'],
            ['🔍', '24-48 ore', 'Echipa noastră analizează profilul tău'],
            ['✅', 'După aprobare', 'Primești email cu datele de acces și codul tău Melbet'],
            ['🚀', 'Start', 'Intri în dashboard și începi să câștigați'],
          ].map(([icon, time, text]) => (
            <div key={time} style={{display:'flex',gap:12,marginBottom:12,alignItems:'flex-start'}}>
              <span style={{fontSize:18,flexShrink:0}}>{icon}</span>
              <div>
                <div style={{fontSize:11,color:gold,fontWeight:700,marginBottom:2}}>{time}</div>
                <div style={{fontSize:13,color:'rgba(255,255,255,0.6)',lineHeight:1.5}}>{text}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{background:'rgba(59,130,246,0.08)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:8,padding:'12px 16px',marginBottom:24,fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.6}}>
          💬 Ai întrebări? Contactează-ne pe <strong style={{color:gold}}>WhatsApp sau Telegram @winpartners</strong>
        </div>

        <button onClick={() => navigate('/')} style={{padding:'12px 32px',fontSize:14,fontWeight:700,cursor:'pointer',border:`1px solid rgba(255,255,255,0.15)`,borderRadius:6,background:'none',color:'rgba(255,255,255,0.6)',fontFamily:'inherit'}}>
          ← Înapoi la pagina principală
        </button>
      </div>
    </div>
  )

  // PASUL 1 — Formular
  return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',fontFamily:'Inter,sans-serif',overflowX:'hidden'}}>
      {/* Nav */}
      <nav style={{background:'rgba(10,10,15,0.97)',borderBottom:'1px solid rgba(245,166,35,0.12)',padding:'0 1rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:56,position:'sticky',top:0,zIndex:50}}>
        <div onClick={() => navigate('/')} style={{fontSize:18,fontWeight:900,cursor:'pointer',display:'flex',alignItems:'center',gap:8}}>
          <img src="/icons/logo.png" width="24" height="24" alt="W" style={{borderRadius:3}}/>
          <span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span>
        </div>
        {!isMobile && (
          <div style={{display:'flex',gap:5}}>
            {['ro','ru','en'].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{padding:'3px 7px',fontSize:10,fontWeight:700,cursor:'pointer',border:`1px solid ${lang===l?gold:'rgba(255,255,255,0.15)'}`,borderRadius:4,background:lang===l?'rgba(245,166,35,0.15)':'none',color:lang===l?gold:'rgba(255,255,255,0.4)'}}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </nav>

      <div style={{maxWidth:600,margin:'0 auto',padding:isMobile?'1.5rem 1rem':'3rem 1.5rem'}}>

        {/* Header */}
        <div style={{marginBottom:32}}>
          {(refCode || inviteCode) && (
            <div style={{background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:8,padding:'10px 14px',marginBottom:20,fontSize:13,color:'#10b981',display:'flex',alignItems:'center',gap:8}}>
              ✓ Ai fost invitat cu codul <strong style={{fontFamily:'monospace'}}>{refCode || inviteCode}</strong>. Cererea ta va fi procesată prioritar.
            </div>
          )}
          <h1 style={{fontSize:isMobile?22:28,fontWeight:900,color:'#fff',marginBottom:8,textTransform:'uppercase'}}>
            {lang==='ru'?'Подать заявку на партнёрство':lang==='en'?'Apply for Partnership':'Aplică pentru parteneriat'}
          </h1>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:14,lineHeight:1.6}}>
            {lang==='ru'?'Заполните форму. Наша команда рассмотрит ваш профиль и свяжется с вами в течение 24-48 часов.':lang==='en'?'Fill in the form. Our team will review your profile and contact you within 24-48 hours.':'Completează formularul. Echipa noastră va analiza profilul tău și te va contacta în '}
            {lang==='ro'&&<strong style={{color:'#fff'}}>24-48 de ore</strong>}
            {lang==='ro'&&'.'}
          </p>
        </div>

        {/* Formular */}
        <div style={{display:'flex',flexDirection:'column',gap:18}}>

          {/* Secțiunea 1 — Date personale */}
          <div style={{fontSize:11,color:gold,fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em',borderBottom:'1px solid rgba(245,166,35,0.15)',paddingBottom:8}}>
            1. Date personale
          </div>

          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:14}}>
            <div>
              <label style={lbl}>Nume complet *</label>
              <input style={errors.name?inpErr:inp} value={form.name} onChange={set('name')} placeholder="Ion Popescu"/>
            </div>
            <div>
              <label style={lbl}>Username dorit *</label>
              <input style={errors.username?inpErr:inp} value={form.username} onChange={set('username')} placeholder="ionpopescu" onInput={e=>e.target.value=e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,'')}/>
            </div>
          </div>

          <div>
            <label style={lbl}>Email *</label>
            <input style={errors.email?inpErr:inp} type="email" value={form.email} onChange={set('email')} placeholder="email@exemplu.com"/>
          </div>

          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:14}}>
            <div>
              <label style={lbl}>WhatsApp / Telegram *</label>
              <input style={errors.phone?inpErr:inp} value={form.phone} onChange={set('phone')} placeholder="+373 60 000 000"/>
            </div>
            <div>
              <label style={lbl}>Țara</label>
              <select style={inp} value={form.country} onChange={set('country')}>
                {COUNTRIES.map(c => <option key={c} style={{background:'#1a1a2e'}}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Secțiunea 2 — Profil social */}
          <div style={{fontSize:11,color:gold,fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em',borderBottom:'1px solid rgba(245,166,35,0.15)',paddingBottom:8,marginTop:8}}>
            2. Profilul tău social
          </div>

          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:14}}>
            <div>
              <label style={lbl}>Platforma principală</label>
              <select style={inp} value={form.platform} onChange={set('platform')}>
                {PLATFORMS.map(p => <option key={p} style={{background:'#1a1a2e'}}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Număr urmăritori *</label>
              <input style={errors.followers?inpErr:inp} type="number" value={form.followers} onChange={set('followers')} onInput={set('followers')} placeholder="10000" min="100"/>
            </div>
          </div>

          <div>
            <label style={lbl}>Link profil (TikTok/Instagram/YouTube) *</label>
            <input style={errors.profileLink?inpErr:inp} value={form.profileLink} onChange={set('profileLink')} placeholder="https://tiktok.com/@ionpopescu"/>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.3)',marginTop:4}}>Profilul tău trebuie să fie public și activ</div>
          </div>

          <div>
            <label style={lbl}>De ce vrei să te alături WinPartners?</label>
            <textarea style={{...inp,minHeight:80,resize:'vertical'}} value={form.aboutYou} onChange={set('aboutYou')} placeholder="Descrie pe scurt audiența ta și cum planifici să promovezi..."/>
          </div>

          {/* Secțiunea 3 — Plăți */}
          <div style={{fontSize:11,color:gold,fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em',borderBottom:'1px solid rgba(245,166,35,0.15)',paddingBottom:8,marginTop:8}}>
            3. Metoda de plată a comisioanelor
          </div>

          <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(245,166,35,0.1)',borderRadius:8,padding:'14px'}}>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:14,lineHeight:1.6}}>
              Comisioanele tale vor fi plătite săptămânal, minim $30. Poți modifica metoda de plată oricând din contul tău.
            </div>
            <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:14}}>
              <div>
                <label style={lbl}>Metoda preferată</label>
                <select style={inp} value={form.payMethod} onChange={set('payMethod')}>
                  {['Bitcoin (BTC)','USDT (TRC20)','USDT (ERC20)','Ethereum (ETH)','Binance Pay','Skrill','Neteller'].map(m => (
                    <option key={m} style={{background:'#1a1a2e'}}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={lbl}>Adresa portofelului</label>
                <input style={inp} value={form.payAddress} onChange={set('payAddress')} placeholder="bc1q... sau adresa ta"/>
              </div>
            </div>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.25)',marginTop:10}}>
              Poți lăsa adresa goală acum și o completezi după aprobare din dashboard.
            </div>
          </div>

          {/* Cod invitație */}
          <div>
            <label style={lbl}>Cod de invitație (dacă ai)</label>
            <input style={inp} value={form.refCode} onChange={set('refCode')} placeholder="ex: REF_ION2026"/>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.3)',marginTop:4}}>Cererile cu cod de invitație sunt procesate prioritar</div>
          </div>

          {/* Erori */}
          {Object.keys(errors).length > 0 && (
            <div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:6,padding:'10px 14px',fontSize:13,color:'#ef4444'}}>
              ⚠ Verifică câmpurile marcate: username minim 3 caractere, email valid, minim 100 urmăritori
            </div>
          )}

          {/* Submit */}
          <button onClick={submit} style={{padding:'15px',fontSize:15,fontWeight:800,cursor:'pointer',border:'none',borderRadius:8,background:gold,color:'#000',marginTop:4,textTransform:'uppercase',letterSpacing:'.05em',fontFamily:'inherit'}}>
            TRIMITE CEREREA →
          </button>

          <p style={{textAlign:'center',fontSize:11,color:'rgba(255,255,255,0.2)',lineHeight:1.6}}>
            Prin trimiterea cererii, confirmi că informațiile sunt reale și ești de acord cu <span style={{color:gold,cursor:'pointer'}} onClick={()=>navigate('/terms')}>termenii și condițiile</span> WinPartners.
          </p>

          <p style={{textAlign:'center',fontSize:13,color:'rgba(255,255,255,0.35)'}}>
            Ai deja cont? <span onClick={() => navigate('/dashboard')} style={{color:gold,cursor:'pointer',fontWeight:600}}>Conectați-vă</span>
          </p>
        </div>
      </div>
    </div>
  )
}
