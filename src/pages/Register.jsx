import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const T = {
  ro: { title:'Creează cont gratuit', sub:'Începe să câștigi în câteva minute', name:'Nume complet', username:'Username (va fi în codul tău)', email:'Email', phone:'Număr WhatsApp / Telegram', platform:'Platforma principală', followers:'Număr urmăritori aproximativ', country:'Țara', ref:'Cod de invitație (opțional)', btn:'Creează cont', login:'Ai deja cont?', loginLink:'Autentifică-te', terms:'Prin înregistrare accepți termenii și condițiile.' },
  ru: { title:'Создать бесплатный аккаунт', sub:'Начни зарабатывать за несколько минут', name:'Полное имя', username:'Имя пользователя (будет в твоем коде)', email:'Email', phone:'WhatsApp / Telegram', platform:'Основная платформа', followers:'Примерное число подписчиков', country:'Страна', ref:'Код приглашения (необязательно)', btn:'Создать аккаунт', login:'Уже есть аккаунт?', loginLink:'Войти', terms:'Регистрируясь, вы принимаете условия использования.' },
  en: { title:'Create free account', sub:'Start earning in minutes', name:'Full name', username:'Username (will be in your code)', email:'Email', phone:'WhatsApp / Telegram number', platform:'Main platform', followers:'Approximate followers count', country:'Country', ref:'Invite code (optional)', btn:'Create account', login:'Already have an account?', loginLink:'Login', terms:'By registering you accept the terms and conditions.' },
}

const PLATFORMS = ['TikTok','Instagram','YouTube','Telegram','Facebook','Twitter/X']
const COUNTRIES = ['Moldova','România','Ucraina','Rusia','Kazakhstan','Belarus','Georgia','Armenia','Azerbaijan','Altă țară']

export default function Register() {
  const [lang, setLang] = useState('ro')
  const [form, setForm] = useState({name:'',username:'',email:'',phone:'',platform:'TikTok',followers:'',country:'Moldova',ref:''})
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()
  const t = T[lang]
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}))

  const inp = {width:'100%',padding:'10px 14px',fontSize:14,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,background:'rgba(255,255,255,0.05)',color:'#e2e8f0',outline:'none'}
  const lbl = {fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:5,display:'block',fontWeight:500}

  if(submitted) return (
    <div style={{minHeight:'100vh',background:'#060612',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
      <div style={{textAlign:'center',maxWidth:480}}>
        <div style={{fontSize:64,marginBottom:16}}>🎉</div>
        <h2 style={{fontSize:28,fontWeight:800,color:'#fff',marginBottom:12}}>
          {lang==='ro'?'Cont creat cu succes!':lang==='ru'?'Аккаунт создан!':'Account created!'}
        </h2>
        <p style={{color:'rgba(255,255,255,0.5)',marginBottom:8,lineHeight:1.6}}>
          {lang==='ro'?`Bun venit, ${form.name}! Cererea ta a fost trimisă. Vei primi codul promoțional personalizat în maxim 24 ore pe ${form.phone}.`:
           lang==='ru'?`Добро пожаловать, ${form.name}! Ваша заявка отправлена. Вы получите персональный промокод в течение 24 часов на ${form.phone}.`:
           `Welcome, ${form.name}! Your application has been submitted. You'll receive your personalized promo code within 24 hours at ${form.phone}.`}
        </p>
        <div style={{background:'rgba(124,58,237,0.1)',border:'1px solid rgba(124,58,237,0.3)',borderRadius:12,padding:'1rem',marginTop:20,marginBottom:24}}>
          <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:4}}>
            {lang==='ro'?'Codul tău provizoriu:':lang==='ru'?'Ваш временный код:':'Your temporary code:'}
          </div>
          <div style={{fontSize:22,fontWeight:800,color:'#a78bfa',fontFamily:'monospace'}}>
            {form.username.toUpperCase()}_WIN
          </div>
        </div>
        <button onClick={()=>navigate('/dashboard')} style={{padding:'12px 32px',fontSize:14,fontWeight:700,cursor:'pointer',border:'none',borderRadius:10,background:'linear-gradient(135deg,#7c3aed,#5b21b6)',color:'#fff'}}>
          {lang==='ro'?'Mergi la dashboard':lang==='ru'?'Перейти в дашборд':'Go to dashboard'}
        </button>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#060612',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
      <div style={{width:'100%',maxWidth:480}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:32}}>
          <div onClick={()=>navigate('/')} style={{fontSize:20,fontWeight:800,color:'#fff',cursor:'pointer'}}>Win<span style={{color:'#7c3aed'}}>Partners</span></div>
          <div style={{display:'flex',gap:6}}>
            {['ro','ru','en'].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:'3px 8px',fontSize:11,cursor:'pointer',border:'1px solid rgba(255,255,255,0.15)',borderRadius:5,background:lang===l?'rgba(124,58,237,0.3)':'none',color:lang===l?'#a78bfa':'rgba(255,255,255,0.4)'}}>{l.toUpperCase()}</button>)}
          </div>
        </div>
        <h1 style={{fontSize:26,fontWeight:800,color:'#fff',marginBottom:6}}>{t.title}</h1>
        <p style={{color:'rgba(255,255,255,0.4)',marginBottom:28,fontSize:14}}>{t.sub}</p>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div><label style={lbl}>{t.name}</label><input style={inp} value={form.name} onChange={set('name')} placeholder="Ion Popescu"/></div>
            <div><label style={lbl}>{t.username}</label><input style={inp} value={form.username} onChange={set('username')} placeholder="ionpopescu"/></div>
          </div>
          <div><label style={lbl}>{t.email}</label><input style={inp} type="email" value={form.email} onChange={set('email')} placeholder="ion@gmail.com"/></div>
          <div><label style={lbl}>{t.phone}</label><input style={inp} value={form.phone} onChange={set('phone')} placeholder="+373 60 000 000"/></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div><label style={lbl}>{t.platform}</label>
              <select style={inp} value={form.platform} onChange={set('platform')}>
                {PLATFORMS.map(p=><option key={p} style={{background:'#1a1a2e'}}>{p}</option>)}
              </select>
            </div>
            <div><label style={lbl}>{t.followers}</label><input style={inp} value={form.followers} onChange={set('followers')} placeholder="10000"/></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div><label style={lbl}>{t.country}</label>
              <select style={inp} value={form.country} onChange={set('country')}>
                {COUNTRIES.map(c=><option key={c} style={{background:'#1a1a2e'}}>{c}</option>)}
              </select>
            </div>
            <div><label style={lbl}>{t.ref}</label><input style={inp} value={form.ref} onChange={set('ref')} placeholder="IONEL_WIN"/></div>
          </div>
          <button onClick={()=>form.name&&form.username&&form.email&&setSubmitted(true)} style={{padding:'13px',fontSize:15,fontWeight:700,cursor:'pointer',border:'none',borderRadius:10,background:'linear-gradient(135deg,#7c3aed,#5b21b6)',color:'#fff',marginTop:4}}>
            {t.btn} →
          </button>
          <p style={{textAlign:'center',fontSize:12,color:'rgba(255,255,255,0.3)'}}>{t.terms}</p>
          <p style={{textAlign:'center',fontSize:13,color:'rgba(255,255,255,0.4)'}}>
            {t.login} <span onClick={()=>navigate('/dashboard')} style={{color:'#a78bfa',cursor:'pointer'}}>{t.loginLink}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
