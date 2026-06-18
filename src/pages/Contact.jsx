import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const gold = '#f5a623'
const LANGS = ['ro','ru','en','tr','de','pt','pl']
const FORMSPREE = 'https://formspree.io/f/mnjyoylo'
const T = {
  ro:{ login:'Conectați-vă', reg:'Înregistrare', title:'Contacte', sub:'Suntem disponibili 24/7 pentru partenerii noștri. Scrie-ne pe Telegram pentru răspuns instant.', mgr:'Manager WinPartners', online:'Online acum · răspunde în maxim 2 ore', tg:'✈️ Scrie pe Telegram acum', prog:'PROGRAM', progVal:'24/7, 365 zile/an', resp:'RĂSPUNS', respVal:'Maxim 2 ore', formTitle:'Trimite un mesaj', lName:'Numele tău *', phName:'Ion Popescu', lEmail:'Email *', phEmail:'ion@gmail.com', lSubject:'Subiect', phSubject:'ex: Întrebare despre comisioane', lMsg:'Mesaj *', phMsg:'Scrie mesajul tău aici...', send:'TRIMITE MESAJ →', sending:'⏳ SE TRIMITE...', sentTitle:'Mesaj trimis!', sentSub:'Te vom contacta în maxim 24 ore pe emailul tău.', sentTg:'Pentru răspuns instant scrie pe', errMsg:'⚠ Eroare la trimitere. Contactează-ne pe', orWrite:'Sau scrie direct pe', orWrite2:'pentru răspuns instant' },
  ru:{ login:'Войти', reg:'Регистрация', title:'Контакты', sub:'Мы доступны 24/7 для наших партнёров. Напишите нам в Telegram для мгновенного ответа.', mgr:'Менеджер WinPartners', online:'Онлайн сейчас · отвечает за 2 часа', tg:'✈️ Написать в Telegram', prog:'РЕЖИМ РАБОТЫ', progVal:'24/7, 365 дней/год', resp:'ОТВЕТ', respVal:'Максимум 2 часа', formTitle:'Отправить сообщение', lName:'Ваше имя *', phName:'Иван Иванов', lEmail:'Email *', phEmail:'ivan@mail.ru', lSubject:'Тема', phSubject:'напр: Вопрос о комиссиях', lMsg:'Сообщение *', phMsg:'Напишите ваше сообщение здесь...', send:'ОТПРАВИТЬ →', sending:'⏳ ОТПРАВКА...', sentTitle:'Сообщение отправлено!', sentSub:'Мы свяжемся с вами в течение 24 часов на ваш email.', sentTg:'Для мгновенного ответа напишите в', errMsg:'⚠ Ошибка при отправке. Свяжитесь с нами напрямую в', orWrite:'Или напишите напрямую на', orWrite2:'для мгновенного ответа' },
  en:{ login:'Login', reg:'Register', title:'Contact', sub:'We are available 24/7 for our partners. Write to us on Telegram for an instant reply.', mgr:'WinPartners Manager', online:'Online now · replies within 2 hours', tg:'✈️ Write on Telegram now', prog:'HOURS', progVal:'24/7, 365 days/year', resp:'RESPONSE', respVal:'Maximum 2 hours', formTitle:'Send a message', lName:'Your name *', phName:'John Smith', lEmail:'Email *', phEmail:'john@gmail.com', lSubject:'Subject', phSubject:'e.g. Question about commissions', lMsg:'Message *', phMsg:'Write your message here...', send:'SEND MESSAGE →', sending:'⏳ SENDING...', sentTitle:'Message sent!', sentSub:'We will contact you within 24 hours at your email.', sentTg:'For an instant reply, write on', errMsg:'⚠ Error sending. Contact us directly on', orWrite:'Or write directly to', orWrite2:'for an instant reply' },
  tr:{ login:'Giriş', reg:'Kayıt', title:'İletişim', sub:'Ortaklarımız için 7/24 erişilebiliriz. Anında yanıt için Telegram üzerinden bize yazın.', mgr:'WinPartners Yöneticisi', online:'Şu an çevrimiçi · 2 saat içinde yanıtlar', tg:'✈️ Telegram üzerinden şimdi yaz', prog:'ÇALIŞMA SAATLERİ', progVal:'7/24, 365 gün/yıl', resp:'YANIT', respVal:'Maksimum 2 saat', formTitle:'Mesaj gönder', lName:'Adınız *', phName:'Ahmet Yılmaz', lEmail:'E-posta *', phEmail:'ahmet@gmail.com', lSubject:'Konu', phSubject:'örn: Komisyonlar hakkında soru', lMsg:'Mesaj *', phMsg:'Mesajınızı buraya yazın...', send:'MESAJ GÖNDER →', sending:'⏳ GÖNDERİLİYOR...', sentTitle:'Mesaj gönderildi!', sentSub:'E-postanıza 24 saat içinde ulaşacağız.', sentTg:'Anında yanıt için', errMsg:'⚠ Gönderme hatası. Bize doğrudan ulaşın', orWrite:'Ya da doğrudan yazın', orWrite2:'anında yanıt için' },
  de:{ login:'Anmelden', reg:'Registrieren', title:'Kontakt', sub:'Wir sind 24/7 für unsere Partner verfügbar. Schreiben Sie uns auf Telegram für eine sofortige Antwort.', mgr:'WinPartners Manager', online:'Jetzt online · antwortet innerhalb von 2 Stunden', tg:'✈️ Jetzt auf Telegram schreiben', prog:'ÖFFNUNGSZEITEN', progVal:'24/7, 365 Tage/Jahr', resp:'ANTWORT', respVal:'Maximal 2 Stunden', formTitle:'Nachricht senden', lName:'Ihr Name *', phName:'Max Mustermann', lEmail:'E-Mail *', phEmail:'max@gmail.com', lSubject:'Betreff', phSubject:'z.B. Frage zu Provisionen', lMsg:'Nachricht *', phMsg:'Schreiben Sie Ihre Nachricht hier...', send:'NACHRICHT SENDEN →', sending:'⏳ WIRD GESENDET...', sentTitle:'Nachricht gesendet!', sentSub:'Wir werden Sie innerhalb von 24 Stunden per E-Mail kontaktieren.', sentTg:'Für eine sofortige Antwort schreiben Sie auf', errMsg:'⚠ Sendefehler. Kontaktieren Sie uns direkt auf', orWrite:'Oder schreiben Sie direkt an', orWrite2:'für eine sofortige Antwort' },
  pt:{ login:'Entrar', reg:'Registrar', title:'Contacto', sub:'Estamos disponíveis 24/7 para os nossos parceiros. Escreva-nos no Telegram para uma resposta imediata.', mgr:'Gerente WinPartners', online:'Online agora · responde em 2 horas', tg:'✈️ Escrever no Telegram agora', prog:'HORÁRIO', progVal:'24/7, 365 dias/ano', resp:'RESPOSTA', respVal:'Máximo 2 horas', formTitle:'Enviar mensagem', lName:'O seu nome *', phName:'João Silva', lEmail:'Email *', phEmail:'joao@gmail.com', lSubject:'Assunto', phSubject:'ex: Questão sobre comissões', lMsg:'Mensagem *', phMsg:'Escreva a sua mensagem aqui...', send:'ENVIAR MENSAGEM →', sending:'⏳ A ENVIAR...', sentTitle:'Mensagem enviada!', sentSub:'Entraremos em contacto em 24 horas no seu email.', sentTg:'Para resposta imediata escreva em', errMsg:'⚠ Erro ao enviar. Contacte-nos diretamente em', orWrite:'Ou escreva diretamente para', orWrite2:'para resposta imediata' },
  pl:{ login:'Zaloguj się', reg:'Rejestracja', title:'Kontakt', sub:'Jesteśmy dostępni 24/7 dla naszych partnerów. Napisz do nas na Telegramie, aby uzyskać natychmiastową odpowiedź.', mgr:'Menedżer WinPartners', online:'Online teraz · odpowiada w ciągu 2 godzin', tg:'✈️ Napisz na Telegramie teraz', prog:'GODZINY PRACY', progVal:'24/7, 365 dni/rok', resp:'ODPOWIEDŹ', respVal:'Maksymalnie 2 godziny', formTitle:'Wyślij wiadomość', lName:'Twoje imię *', phName:'Jan Kowalski', lEmail:'Email *', phEmail:'jan@gmail.com', lSubject:'Temat', phSubject:'np. Pytanie o prowizje', lMsg:'Wiadomość *', phMsg:'Napisz swoją wiadomość tutaj...', send:'WYŚLIJ WIADOMOŚĆ →', sending:'⏳ WYSYŁANIE...', sentTitle:'Wiadomość wysłana!', sentSub:'Skontaktujemy się z Tobą w ciągu 24 godzin na Twój email.', sentTg:'Dla natychmiastowej odpowiedzi napisz na', errMsg:'⚠ Błąd wysyłania. Skontaktuj się z nami bezpośrednio na', orWrite:'Lub napisz bezpośrednio do', orWrite2:'dla natychmiastowej odpowiedzi' },
}
export default function Contact() {
  const nav = useNavigate()
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 700)
  const [lang, setLang] = useState(() => { const s = localStorage.getItem('wp_lang'); return LANGS.includes(s) ? s : 'ro' })
  // Auto-detect limba după locație (doar dacă nu a ales manual)
  useEffect(() => {
    if (localStorage.getItem('wp_lang')) return
    const countryToLang = {
      MD:'ro', RO:'ro',
      RU:'ru', BY:'ru', KZ:'ru', UA:'ru', UZ:'ru',
      TR:'tr',
      DE:'de', AT:'de', CH:'de',
      PT:'pt', BR:'pt',
      PL:'pl',
    }
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => { const l = countryToLang[d.country_code]; if (l) setLang(l) })
      .catch(() => {})
  }, [])
  const t = T[lang] || T.ro
  const setL = l => { setLang(l); localStorage.setItem('wp_lang', l) }
  const [form, setForm] = useState({name:'',email:'',subject:'',message:''})
  const [status, setStatus] = useState('idle')
  const set = k => e => setForm(f => ({...f, [k]: e.target.value}))
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 700)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  const send = async () => {
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    try {
      const res = await fetch(FORMSPREE, { method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body: JSON.stringify({_subject:'💬 WinPartners — '+form.name, name:form.name, email:form.email, subject:form.subject||'—', message:form.message, lang}) })
      setStatus(res.ok ? 'sent' : 'error')
    } catch(e) { setStatus('error') }
  }
  const inp = {width:'100%',padding:'11px 14px',fontSize:14,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,background:'rgba(255,255,255,0.05)',color:'#e2e8f0',outline:'none',boxSizing:'border-box',fontFamily:'inherit'}
  const lbl = {fontSize:11,color:'rgba(255,255,255,0.4)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em',display:'block',marginBottom:5}
  return (
    <div style={{background:'#0a0a0f',minHeight:'100vh',color:'#fff',fontFamily:"'Inter',sans-serif",overflowX:'hidden'}}>
            <nav style={{background:'rgba(10,10,15,0.97)',borderBottom:'1px solid rgba(245,166,35,0.12)',padding:'0 0.75rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:52,position:'sticky',top:0,zIndex:50,gap:8}}>
        <div onClick={()=>nav('/')} style={{fontSize:16,fontWeight:900,cursor:'pointer',flexShrink:0,whiteSpace:'nowrap'}}><span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span></div>
        <div style={{display:'flex',gap:4,alignItems:'center',minWidth:0}}>
          <div style={{display:'flex',gap:3,overflowX:'auto',scrollbarWidth:'none',WebkitOverflowScrolling:'touch'}}>
            {LANGS.map(l=>(<button key={l} onClick={()=>setL(l)} style={{padding:'3px 5px',fontSize:10,fontWeight:700,cursor:'pointer',border:`1px solid ${lang===l?gold:'rgba(255,255,255,0.15)'}`,borderRadius:4,background:lang===l?'rgba(245,166,35,0.15)':'none',color:lang===l?gold:'rgba(255,255,255,0.4)',flexShrink:0}}>{l.toUpperCase()}</button>))}
          </div>
          <button onClick={()=>nav('/register')} style={{padding:'5px 10px',fontSize:11,fontWeight:700,cursor:'pointer',border:'none',borderRadius:4,background:gold,color:'#000',flexShrink:0,whiteSpace:'nowrap'}}>{t.reg}</button>
        </div>
      </nav>
      <div style={{maxWidth:1000,margin:'0 auto',padding:'3rem 1.5rem',display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:48,alignItems:'start'}}>
        <div>
          <h1 style={{fontSize:isMobile?24:36,fontWeight:900,textTransform:'uppercase',marginBottom:12}}>{t.title}</h1>
          <p style={{color:'rgba(255,255,255,0.45)',fontSize:14,lineHeight:1.7,marginBottom:32}}>{t.sub}</p>
          <div style={{background:'rgba(245,166,35,0.06)',border:'1px solid rgba(245,166,35,0.15)',borderRadius:14,padding:'1.5rem',marginBottom:24}}>
            <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:16}}>
              <div style={{width:52,height:52,borderRadius:'50%',background:'rgba(245,166,35,0.15)',border:`2px solid ${gold}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0}}>👤</div>
              <div>
                <div style={{fontWeight:700,fontSize:15}}>{t.mgr}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginTop:2,display:'flex',alignItems:'center',gap:6}}><span style={{width:7,height:7,borderRadius:'50%',background:'#10b981',display:'inline-block'}}/>{t.online}</div>
              </div>
            </div>
            <a href="https://t.me/winpartners_manager" target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'11px',borderRadius:8,background:'#229ED9',color:'#fff',textDecoration:'none',fontWeight:700,fontSize:14,width:'100%',boxSizing:'border-box'}}>{t.tg}</a>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {[['✈️','TELEGRAM','@winpartners_manager','https://t.me/winpartners_manager'],['✉️','EMAIL','support@winpartners.pro','mailto:support@winpartners.pro'],['🕐',t.prog,t.progVal,null],['⚡',t.resp,t.respVal,null]].map(([icon,label,val,href])=>(
              <div key={label} style={{display:'flex',alignItems:'center',gap:14,padding:'12px 14px',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10}}>
                <div style={{fontSize:20,flexShrink:0}}>{icon}</div>
                <div><div style={{fontSize:10,color:'rgba(255,255,255,0.35)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:2}}>{label}</div>{href?<a href={href} style={{fontSize:13,fontWeight:600,color:gold,textDecoration:'none'}}>{val}</a>:<div style={{fontSize:13,fontWeight:600}}>{val}</div>}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 style={{fontSize:20,fontWeight:700,marginBottom:24}}>{t.formTitle}</h2>
          {status==='sent'?(
            <div style={{textAlign:'center',padding:'3rem 2rem',background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:14}}>
              <div style={{fontSize:48,marginBottom:16}}>✅</div>
              <div style={{fontSize:18,fontWeight:700,marginBottom:8}}>{t.sentTitle}</div>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.45)',lineHeight:1.7}}>{t.sentSub}<br/>{t.sentTg} <a href="https://t.me/winpartners_manager" style={{color:gold}}>Telegram</a>.</div>
            </div>
          ):(
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:12}}>
                <div><label style={lbl}>{t.lName}</label><input style={inp} placeholder={t.phName} value={form.name} onChange={set('name')}/></div>
                <div><label style={lbl}>{t.lEmail}</label><input style={inp} type="email" placeholder={t.phEmail} value={form.email} onChange={set('email')}/></div>
              </div>
              <div><label style={lbl}>{t.lSubject}</label><input style={inp} placeholder={t.phSubject} value={form.subject} onChange={set('subject')}/></div>
              <div><label style={lbl}>{t.lMsg}</label><textarea style={{...inp,height:140,resize:'vertical'}} placeholder={t.phMsg} value={form.message} onChange={set('message')}/></div>
              {status==='error'&&<div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:6,padding:'10px 14px',fontSize:13,color:'#ef4444'}}>{t.errMsg} <a href="https://t.me/winpartners_manager" style={{color:gold}}>Telegram</a>.</div>}
              <button onClick={send} disabled={status==='sending'} style={{padding:'13px',fontSize:14,fontWeight:700,cursor:status==='sending'?'wait':'pointer',border:'none',borderRadius:8,background:gold,color:'#000',textTransform:'uppercase',letterSpacing:'.05em',fontFamily:'inherit',opacity:status==='sending'?0.7:1}}>{status==='sending'?t.sending:t.send}</button>
              <p style={{textAlign:'center',fontSize:11,color:'rgba(255,255,255,0.2)',margin:0}}>{t.orWrite} <a href="https://t.me/winpartners_manager" style={{color:gold}}>@winpartners_manager</a> {t.orWrite2}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
