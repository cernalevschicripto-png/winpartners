import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const T = {
  ro: { title:'Creați cont gratuit', sub:'Începeți să câștigați în câteva minute', name:'Nume complet', username:'Username (va fi în codul dvs.)', email:'Adresa de email', phone:'Număr WhatsApp / Telegram', platform:'Platforma principală', followers:'Număr urmăritori aproximativ', country:'Țara', ref:'Cod de invitație (opțional)', btn:'CREAȚI CONT', login:'Aveți deja cont?', loginLink:'Autentificați-vă', terms:'Prin înregistrare acceptați termenii și condițiile.' },
  ru: { title:'Создать бесплатный аккаунт', sub:'Начните зарабатывать за несколько минут', name:'Полное имя', username:'Имя пользователя (будет в вашем коде)', email:'Адрес электронной почты', phone:'WhatsApp / Telegram', platform:'Основная платформа', followers:'Примерное число подписчиков', country:'Страна', ref:'Код приглашения (необязательно)', btn:'СОЗДАТЬ АККАУНТ', login:'Уже есть аккаунт?', loginLink:'Войти', terms:'Регистрируясь, вы принимаете условия использования.' },
  en: { title:'Create free account', sub:'Start earning in minutes', name:'Full name', username:'Username (will be in your code)', email:'Email address', phone:'WhatsApp / Telegram number', platform:'Main platform', followers:'Approximate followers count', country:'Country', ref:'Invite code (optional)', btn:'CREATE ACCOUNT', login:'Already have an account?', loginLink:'Login', terms:'By registering you accept the terms and conditions.' },
}

const PLATFORMS = ['TikTok','Instagram','YouTube','Telegram','Facebook','Twitter/X']
const COUNTRIES = ['Moldova','România','Ucraina','Rusia','Kazakhstan','Belarus','Georgia','Armenia','Azerbaijan','Altă țară']
const gold = '#f5a623'

export default function Register() {
  const [lang, setLang] = useState('ro')
  const [form, setForm] = useState({name:'',username:'',email:'',phone:'',platform:'TikTok',followers:'',country:'Moldova',ref:''})
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()
  const t = T[lang]
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}))

  const inp = {width:'100%',padding:'11px 14px',fontSize:14,border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,background:'rgba(255,255,255,0.05)',color:'#e2e8f0',outline:'none',boxSizing:'border-box',transition:'border-color .15s'}
  const lbl = {fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:5,display:'block',fontWeight:500,textTransform:'uppercase',letterSpacing:'.05em'}

  if(submitted) return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
      <div style={{textAlign:'center',maxWidth:500}}>
        <div style={{width:80,height:80,borderRadius:'50%',background:'rgba(245,166,35,0.15)',border:`2px solid ${gold}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:36,margin:'0 auto 24px'}}>✓</div>
        <h2 style={{fontSize:28,fontWeight:900,color:'#fff',marginBottom:12,textTransform:'uppercase'}}>
          {lang==='ro'?'Cont creat cu succes!':lang==='ru'?'Аккаунт создан!':'Account created!'}
        </h2>
        <p style={{color:'rgba(255,255,255,0.5)',marginBottom:24,lineHeight:1.7,fontSize:14}}>
          {lang==='ro'?`Bun venit, ${form.name}! Cererea a fost trimisă. Veți primi codul promoțional în maxim 24 ore pe ${form.phone}.`:
           lang==='ru'?`Добро пожаловать, ${form.name}! Заявка отправлена. Вы получите промокод в течение 24 часов на ${form.phone}.`:
           `Welcome, ${form.name}! Application submitted. You'll receive your promo code within 24 hours at ${form.phone}.`}
        </p>
        <div style={{background:'rgba(245,166,35,0.08)',border:`1px solid rgba(245,166,35,0.3)`,borderRadius:10,padding:'1.25rem',marginBottom:28}}>
          <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',marginBottom:6,textTransform:'uppercase',letterSpacing:'.08em'}}>
            {lang==='ro'?'Codul tău provizoriu:':lang==='ru'?'Ваш временный код:':'Your temporary code:'}
          </div>
          <div style={{fontSize:24,fontWeight:900,color:gold,fontFamily:'monospace',letterSpacing:'.1em'}}>
            {form.username.toUpperCase()}_WIN
          </div>
        </div>
        <button onClick={()=>navigate('/dashboard')} style={{padding:'13px 36px',fontSize:14,fontWeight:800,cursor:'pointer',border:'none',borderRadius:6,background:gold,color:'#000',textTransform:'uppercase',letterSpacing:'.05em'}}>
          {lang==='ro'?'MERGI LA DASHBOARD':lang==='ru'?'ПЕРЕЙТИ В ДАШБОРД':'GO TO DASHBOARD'}
        </button>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',display:'flex',flexDirection:'column'}}>
      <nav style={{background:'rgba(10,10,15,0.97)',borderBottom:'1px solid rgba(245,166,35,0.12)',padding:'0 3rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:64,flexShrink:0}}>
        <div onClick={()=>navigate('/')} style={{fontSize:20,fontWeight:900,cursor:'pointer'}}><span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span></div>
        <div style={{display:'flex',gap:6}}>
          {['ro','ru','en'].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:'3px 8px',fontSize:11,fontWeight:700,cursor:'pointer',border:`1px solid ${lang===l?gold:'rgba(255,255,255,0.15)'}`,borderRadius:4,background:lang===l?'rgba(245,166,35,0.15)':'none',color:lang===l?gold:'rgba(255,255,255,0.4)'}}>{l.toUpperCase()}</button>)}
        </div>
      </nav>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
        <div style={{width:'100%',maxWidth:520}}>
          <h1 style={{fontSize:28,fontWeight:900,color:'#fff',marginBottom:4,textTransform:'uppercase',letterSpacing:'.02em'}}>{t.title}</h1>
          <p style={{color:'rgba(255,255,255,0.4)',marginBottom:32,fontSize:14}}>{t.sub}</p>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
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
              <div><label style={lbl}>{t.followers}</label><input style={inp} type="number" value={form.followers} onChange={set('followers')} placeholder="10000"/></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div><label style={lbl}>{t.country}</label>
                <select style={inp} value={form.country} onChange={set('country')}>
                  {COUNTRIES.map(c=><option key={c} style={{background:'#1a1a2e'}}>{c}</option>)}
                </select>
              </div>
              <div><label style={lbl}>{t.ref}</label><input style={inp} value={form.ref} onChange={set('ref')} placeholder="IONEL_WIN"/></div>
            </div>
            <button onClick={()=>form.name&&form.username&&form.email&&setSubmitted(true)} style={{padding:'14px',fontSize:15,fontWeight:800,cursor:'pointer',border:'none',borderRadius:6,background:gold,color:'#000',marginTop:4,textTransform:'uppercase',letterSpacing:'.05em'}}>
              {t.btn} →
            </button>
            <p style={{textAlign:'center',fontSize:11,color:'rgba(255,255,255,0.25)'}}>{t.terms}</p>
            <p style={{textAlign:'center',fontSize:13,color:'rgba(255,255,255,0.4)'}}>
              {t.login} <span onClick={()=>navigate('/dashboard')} style={{color:gold,cursor:'pointer',fontWeight:600}}>{t.loginLink}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
