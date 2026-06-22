import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const gold='#f5a623'
const LANGS=['ro','ru','en','tr','de','pt','pl']
const CMAP={MD:'ro',RO:'ro',RU:'ru',BY:'ru',KZ:'ru',UA:'ru',UZ:'ru',AM:'ru',AZ:'ru',GE:'ru',TJ:'ru',TM:'ru',KG:'ru',TR:'tr',DE:'de',AT:'de',CH:'de',PT:'pt',BR:'pt',PL:'pl'}
const FORMSPREE='https://formspree.io/f/mnjyoylo'
function useLang(){const[lang,setLang]=useState(()=>{const s=localStorage.getItem('wp_lang');return LANGS.includes(s)?s:'ro'});useEffect(()=>{if(localStorage.getItem('wp_lang'))return;const d=async()=>{try{const r=await fetch('https://ipapi.co/json/',{signal:AbortSignal.timeout(3000)});const j=await r.json();const l=CMAP[j.country_code];if(l){setLang(l);localStorage.setItem('wp_lang',l)}}catch{try{const r2=await fetch('https://api.country.is/',{signal:AbortSignal.timeout(3000)});const j2=await r2.json();const l2=CMAP[j2.country];if(l2){setLang(l2);localStorage.setItem('wp_lang',l2)}}catch{}}};d()},[]);return[lang,l=>{setLang(l);localStorage.setItem('wp_lang',l)}]}
function Nav({lang,setL,t,nav}){return(<nav style={{background:'rgba(10,10,15,0.97)',borderBottom:'1px solid rgba(245,166,35,0.12)',padding:'0 1.25rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:60,position:'sticky',top:0,zIndex:100,backdropFilter:'blur(12px)'}}><div onClick={()=>nav('/')} style={{cursor:'pointer',display:'flex',alignItems:'center',gap:8}}><img src="/icons/logo.png" width="26" height="26" alt="W" style={{borderRadius:3}}/><span style={{fontSize:16,fontWeight:900}}><span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span></span></div><div style={{display:'flex',alignItems:'center',gap:4,minWidth:0}}><div style={{display:'flex',gap:2,background:'rgba(255,255,255,0.04)',borderRadius:6,padding:'2px 3px',border:'1px solid rgba(255,255,255,0.07)',overflowX:'auto',scrollbarWidth:'none',flexShrink:1}}>{LANGS.map(l=>(<button key={l} onClick={()=>setL(l)} style={{padding:'3px 5px',fontSize:10,fontWeight:700,cursor:'pointer',border:`1px solid ${lang===l?gold:'transparent'}`,borderRadius:4,background:lang===l?gold:'transparent',color:lang===l?'#000':'rgba(255,255,255,0.45)',flexShrink:0}}>{l.toUpperCase()}</button>))}</div><button onClick={()=>nav('/register')} style={{padding:'5px 10px',fontSize:11,fontWeight:800,cursor:'pointer',border:'none',borderRadius:5,background:gold,color:'#000',textTransform:'uppercase',flexShrink:0,whiteSpace:'nowrap'}}>{t.reg}</button></div></nav>)}
function Footer({nav}){return(<footer style={{background:'#050508',borderTop:'1px solid rgba(245,166,35,0.08)',padding:'1.75rem 1.25rem'}}><div style={{maxWidth:900,margin:'0 auto',display:'flex',flexDirection:'column',alignItems:'center',gap:12,textAlign:'center'}}><div style={{fontSize:16,fontWeight:900}}><span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span></div><div style={{display:'flex',gap:16,flexWrap:'wrap',justifyContent:'center'}}>{[['/',''],['/about','About'],['/benefits','Benefits'],['/faq','FAQ'],['/contact','Contact']].map(([p,l])=>(<span key={p} onClick={()=>nav(p)} style={{fontSize:12,color:'rgba(255,255,255,0.3)',cursor:'pointer'}} onMouseOver={e=>e.target.style.color=gold} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.3)'}>{l||'Home'}</span>))}</div><div style={{fontSize:11,color:'rgba(255,255,255,0.15)'}}>© 2026 WinPartners</div></div></footer>)}
const T={
  ro:{login:'Conectați-vă',reg:'Înregistrare',title:'Contacte',sub:'Suntem disponibili 24/7 pentru partenerii noștri. Scrie-ne pe Telegram pentru răspuns instant.',mgr:'Manager WinPartners',online:'Online acum · răspunde în maxim 2 ore',tg:'✈️ Scrie pe Telegram acum',prog:'PROGRAM',progVal:'24/7, 365 zile/an',resp:'RĂSPUNS',respVal:'Maxim 2 ore',formTitle:'Trimite un mesaj',lName:'Numele tău *',phName:'Nume Prenume',lEmail:'Email *',phEmail:'email@exemplu.com',lSubject:'Subiect',phSubject:'ex: Întrebare despre comisioane',lMsg:'Mesaj *',phMsg:'Scrie mesajul tău aici...',send:'TRIMITE MESAJ →',sending:'⏳ SE TRIMITE...',sentTitle:'Mesaj trimis!',sentSub:'Te vom contacta în maxim 24 ore pe emailul tău.',sentTg:'Pentru răspuns instant scrie pe',errMsg:'⚠ Eroare la trimitere. Contactează-ne pe',orWrite:'Sau scrie direct pe',orWrite2:'pentru răspuns instant'},
  ru:{login:'Войти',reg:'Регистрация',title:'Контакты',sub:'Мы доступны 24/7 для наших партнёров. Напишите нам в Telegram для мгновенного ответа.',mgr:'Менеджер WinPartners',online:'Онлайн сейчас · отвечает за 2 часа',tg:'✈️ Написать в Telegram',prog:'РЕЖИМ РАБОТЫ',progVal:'24/7, 365 дней/год',resp:'ОТВЕТ',respVal:'Максимум 2 часа',formTitle:'Отправить сообщение',lName:'Ваше имя *',phName:'Иван Иванов',lEmail:'Email *',phEmail:'email@primer.ru',lSubject:'Тема',phSubject:'напр: Вопрос о комиссиях',lMsg:'Сообщение *',phMsg:'Напишите ваше сообщение здесь...',send:'ОТПРАВИТЬ →',sending:'⏳ ОТПРАВКА...',sentTitle:'Сообщение отправлено!',sentSub:'Мы свяжемся с вами в течение 24 часов на ваш email.',sentTg:'Для мгновенного ответа напишите в',errMsg:'⚠ Ошибка при отправке. Свяжитесь с нами напрямую в',orWrite:'Или напишите напрямую на',orWrite2:'для мгновенного ответа'},
  en:{login:'Login',reg:'Register',title:'Contact',sub:'We are available 24/7 for our partners. Write to us on Telegram for an instant reply.',mgr:'WinPartners Manager',online:'Online now · replies within 2 hours',tg:'✈️ Write on Telegram now',prog:'HOURS',progVal:'24/7, 365 days/year',resp:'RESPONSE',respVal:'Maximum 2 hours',formTitle:'Send a message',lName:'Your name *',phName:'John Smith',lEmail:'Email *',phEmail:'email@example.com',lSubject:'Subject',phSubject:'e.g. Question about commissions',lMsg:'Message *',phMsg:'Write your message here...',send:'SEND MESSAGE →',sending:'⏳ SENDING...',sentTitle:'Message sent!',sentSub:'We will contact you within 24 hours at your email.',sentTg:'For an instant reply, write on',errMsg:'⚠ Error sending. Contact us directly on',orWrite:'Or write directly to',orWrite2:'for an instant reply'},
  tr:{login:'Giriş',reg:'Kayıt',title:'İletişim',sub:'Ortaklarımız için 7/24 erişilebiliriz. Anında yanıt için Telegram üzerinden bize yazın.',mgr:'WinPartners Yöneticisi',online:'Şu an çevrimiçi · 2 saat içinde yanıtlar',tg:'✈️ Telegram üzerinden şimdi yaz',prog:'ÇALIŞMA SAATLERİ',progVal:'7/24, 365 gün/yıl',resp:'YANIT',respVal:'Maksimum 2 saat',formTitle:'Mesaj gönder',lName:'Adınız *',phName:'Ahmet Yılmaz',lEmail:'E-posta *',phEmail:'email@ornek.com',lSubject:'Konu',phSubject:'örn: Komisyonlar hakkında soru',lMsg:'Mesaj *',phMsg:'Mesajınızı buraya yazın...',send:'MESAJ GÖNDER →',sending:'⏳ GÖNDERİLİYOR...',sentTitle:'Mesaj gönderildi!',sentSub:'E-postanıza 24 saat içinde ulaşacağız.',sentTg:'Anında yanıt için',errMsg:'⚠ Gönderme hatası. Bize doğrudan ulaşın',orWrite:'Ya da doğrudan yazın',orWrite2:'anında yanıt için'},
  de:{login:'Anmelden',reg:'Registrieren',title:'Kontakt',sub:'Wir sind 24/7 für unsere Partner verfügbar. Schreiben Sie uns auf Telegram für eine sofortige Antwort.',mgr:'WinPartners Manager',online:'Jetzt online · antwortet innerhalb von 2 Stunden',tg:'✈️ Jetzt auf Telegram schreiben',prog:'ÖFFNUNGSZEITEN',progVal:'24/7, 365 Tage/Jahr',resp:'ANTWORT',respVal:'Maximal 2 Stunden',formTitle:'Nachricht senden',lName:'Ihr Name *',phName:'Max Mustermann',lEmail:'E-Mail *',phEmail:'email@beispiel.de',lSubject:'Betreff',phSubject:'z.B. Frage zu Provisionen',lMsg:'Nachricht *',phMsg:'Schreiben Sie Ihre Nachricht hier...',send:'NACHRICHT SENDEN →',sending:'⏳ WIRD GESENDET...',sentTitle:'Nachricht gesendet!',sentSub:'Wir werden Sie innerhalb von 24 Stunden per E-Mail kontaktieren.',sentTg:'Für eine sofortige Antwort schreiben Sie auf',errMsg:'⚠ Sendefehler. Kontaktieren Sie uns direkt auf',orWrite:'Oder schreiben Sie direkt an',orWrite2:'für eine sofortige Antwort'},
  pt:{login:'Entrar',reg:'Registrar',title:'Contacto',sub:'Estamos disponíveis 24/7 para os nossos parceiros. Escreva-nos no Telegram para uma resposta imediata.',mgr:'Gerente WinPartners',online:'Online agora · responde em 2 horas',tg:'✈️ Escrever no Telegram agora',prog:'HORÁRIO',progVal:'24/7, 365 dias/ano',resp:'RESPOSTA',respVal:'Máximo 2 horas',formTitle:'Enviar mensagem',lName:'O seu nome *',phName:'João Silva',lEmail:'Email *',phEmail:'email@exemplo.com',lSubject:'Assunto',phSubject:'ex: Questão sobre comissões',lMsg:'Mensagem *',phMsg:'Escreva a sua mensagem aqui...',send:'ENVIAR MENSAGEM →',sending:'⏳ A ENVIAR...',sentTitle:'Mensagem enviada!',sentSub:'Entraremos em contacto em 24 horas no seu email.',sentTg:'Para resposta imediata escreva em',errMsg:'⚠ Erro ao enviar. Contacte-nos diretamente em',orWrite:'Ou escreva diretamente para',orWrite2:'para resposta imediata'},
  pl:{login:'Zaloguj się',reg:'Rejestracja',title:'Kontakt',sub:'Jesteśmy dostępni 24/7 dla naszych partnerów. Napisz do nas na Telegramie, aby uzyskać natychmiastową odpowiedź.',mgr:'Menedżer WinPartners',online:'Online teraz · odpowiada w ciągu 2 godzin',tg:'✈️ Napisz na Telegramie teraz',prog:'GODZINY PRACY',progVal:'24/7, 365 dni/rok',resp:'ODPOWIEDŹ',respVal:'Maksymalnie 2 godziny',formTitle:'Wyślij wiadomość',lName:'Twoje imię *',phName:'Jan Kowalski',lEmail:'Email *',phEmail:'email@przyklad.com',lSubject:'Temat',phSubject:'np. Pytanie o prowizje',lMsg:'Wiadomość *',phMsg:'Napisz swoją wiadomość tutaj...',send:'WYŚLIJ WIADOMOŚĆ →',sending:'⏳ WYSYŁANIE...',sentTitle:'Wiadomość wysłana!',sentSub:'Skontaktujemy się z Tobą w ciągu 24 godzin na Twój email.',sentTg:'Dla natychmiastowej odpowiedzi napisz na',errMsg:'⚠ Błąd wysyłania. Skontaktuj się z nami bezpośrednio na',orWrite:'Lub napisz bezpośrednio do',orWrite2:'dla natychmiastowej odpowiedzi'},
}
const inp={width:'100%',padding:'10px 13px',fontSize:14,border:'1px solid rgba(255,255,255,0.09)',borderRadius:6,background:'rgba(255,255,255,0.04)',color:'#e2e8f0',outline:'none',boxSizing:'border-box',fontFamily:'inherit',transition:'border-color .15s'}
const lbl={fontSize:11,color:'rgba(255,255,255,0.4)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em',display:'block',marginBottom:5}
export default function Contact(){
  const nav=useNavigate()
  const[lang,setL]=useLang()
  const t=T[lang]||T.ro
  const[isMobile,setIsMobile]=useState(window.innerWidth<700)
  const[form,setForm]=useState({name:'',email:'',subject:'',message:''})
  const[status,setStatus]=useState('idle')
  useEffect(()=>{const fn=()=>setIsMobile(window.innerWidth<700);window.addEventListener('resize',fn);return()=>window.removeEventListener('resize',fn)},[])
  const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}))
  const send=async()=>{
    if(!form.name||!form.email||!form.message)return
    setStatus('sending')
    try{const res=await fetch(FORMSPREE,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({_subject:'💬 WinPartners — '+form.name,name:form.name,email:form.email,subject:form.subject||'—',message:form.message,lang})});setStatus(res.ok?'sent':'error')}catch(e){setStatus('error')}
  }
  const focusStyle=e=>e.target.style.borderColor='rgba(245,166,35,0.4)'
  const blurStyle=e=>e.target.style.borderColor='rgba(255,255,255,0.09)'
  return(
    <div style={{background:'#0a0a0f',minHeight:'100vh',color:'#fff',fontFamily:"'Inter',sans-serif",overflowX:'hidden',display:'flex',flexDirection:'column'}}>
      <Nav lang={lang} setL={setL} t={t} nav={nav}/>
      <div style={{background:'linear-gradient(135deg,rgba(245,166,35,0.06) 0%,transparent 60%)',borderBottom:'1px solid rgba(245,166,35,0.08)',padding:isMobile?'2rem 1.25rem 1.5rem':'3rem 2rem 2.5rem',textAlign:'center'}}>
        <h1 style={{fontSize:'clamp(1.8rem,4vw,3rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.02em',marginBottom:8}}>{t.title}</h1>
        <div style={{width:36,height:3,background:gold,margin:'0 auto 12px',borderRadius:2}}/>
        <p style={{fontSize:14,color:'rgba(255,255,255,0.4)',maxWidth:480,margin:'0 auto',lineHeight:1.7}}>{t.sub}</p>
      </div>
      <div style={{maxWidth:1000,margin:'0 auto',padding:isMobile?'1.75rem 1.25rem':'3rem 2rem',flex:1,display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:isMobile?28:52,alignItems:'start'}}>
        {/* LEFT */}
        <div>
          <div style={{background:'rgba(245,166,35,0.04)',border:'1px solid rgba(245,166,35,0.14)',borderRadius:14,padding:'1.5rem',marginBottom:18}}>
            <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:16}}>
              <div style={{width:56,height:56,borderRadius:'50%',background:'rgba(245,166,35,0.1)',border:`2px solid ${gold}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <div style={{fontWeight:700,fontSize:15,color:'#fff'}}>{t.mgr}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginTop:3,display:'flex',alignItems:'center',gap:6}}>
                  <span style={{width:7,height:7,borderRadius:'50%',background:'#10b981',display:'inline-block',boxShadow:'0 0 5px #10b981'}}/>
                  {t.online}
                </div>
              </div>
            </div>
            <a href="https://t.me/winpartners_manager" target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'11px',borderRadius:8,background:'#229ED9',color:'#fff',textDecoration:'none',fontWeight:700,fontSize:14,boxShadow:'0 4px 16px rgba(34,158,217,0.25)',transition:'box-shadow .15s'}} onMouseOver={e=>e.currentTarget.style.boxShadow='0 6px 24px rgba(34,158,217,0.4)'} onMouseOut={e=>e.currentTarget.style.boxShadow='0 4px 16px rgba(34,158,217,0.25)'}>{t.tg}</a>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {[
              [()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,'TELEGRAM','@winpartners_manager','https://t.me/winpartners_manager'],
              [()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,'EMAIL','support@winpartners.pro','mailto:support@winpartners.pro'],
              [()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,t.prog,t.progVal,null],
              [()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,t.resp,t.respVal,null],
            ].map(([Icon,label,val,href],i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 13px',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:9}}>
                <Icon/>
                <div>
                  <div style={{fontSize:10,color:'rgba(255,255,255,0.3)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:2}}>{label}</div>
                  {href?<a href={href} style={{fontSize:13,fontWeight:600,color:gold,textDecoration:'none'}}>{val}</a>:<div style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,0.7)'}}>{val}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* RIGHT — Form */}
        <div>
          <h2 style={{fontSize:18,fontWeight:700,marginBottom:20,color:'rgba(255,255,255,0.9)'}}>{t.formTitle}</h2>
          {status==='sent'?(
            <div style={{textAlign:'center',padding:'3rem 2rem',background:'rgba(16,185,129,0.05)',border:'1px solid rgba(16,185,129,0.18)',borderRadius:14}}>
              <div style={{width:56,height:56,borderRadius:'50%',background:'rgba(16,185,129,0.1)',border:'2px solid rgba(16,185,129,0.3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div style={{fontSize:18,fontWeight:700,marginBottom:8}}>{t.sentTitle}</div>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.45)',lineHeight:1.7}}>{t.sentSub}<br/>{t.sentTg} <a href="https://t.me/winpartners_manager" style={{color:gold}}>Telegram</a>.</div>
            </div>
          ):(
            <div style={{display:'flex',flexDirection:'column',gap:13}}>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:11}}>
                <div><label style={lbl}>{t.lName}</label><input style={inp} placeholder={t.phName} value={form.name} onChange={set('name')} onFocus={focusStyle} onBlur={blurStyle}/></div>
                <div><label style={lbl}>{t.lEmail}</label><input style={inp} type="email" placeholder={t.phEmail} value={form.email} onChange={set('email')} onFocus={focusStyle} onBlur={blurStyle}/></div>
              </div>
              <div><label style={lbl}>{t.lSubject}</label><input style={inp} placeholder={t.phSubject} value={form.subject} onChange={set('subject')} onFocus={focusStyle} onBlur={blurStyle}/></div>
              <div><label style={lbl}>{t.lMsg}</label><textarea style={{...inp,height:130,resize:'vertical'}} placeholder={t.phMsg} value={form.message} onChange={set('message')} onFocus={focusStyle} onBlur={blurStyle}/></div>
              {status==='error'&&<div style={{background:'rgba(239,68,68,0.07)',border:'1px solid rgba(239,68,68,0.18)',borderRadius:6,padding:'10px 13px',fontSize:13,color:'#ef4444'}}>{t.errMsg} <a href="https://t.me/winpartners_manager" style={{color:gold}}>Telegram</a>.</div>}
              <button onClick={send} disabled={status==='sending'} style={{padding:'12px',fontSize:14,fontWeight:700,cursor:status==='sending'?'wait':'pointer',border:'none',borderRadius:7,background:gold,color:'#000',textTransform:'uppercase',letterSpacing:'.05em',fontFamily:'inherit',opacity:status==='sending'?0.7:1,boxShadow:'0 4px 20px rgba(245,166,35,0.22)',transition:'box-shadow .15s,transform .1s'}} onMouseOver={e=>{if(status!=='sending'){e.currentTarget.style.boxShadow='0 6px 28px rgba(245,166,35,0.38)';e.currentTarget.style.transform='translateY(-1px)'}}} onMouseOut={e=>{e.currentTarget.style.boxShadow='0 4px 20px rgba(245,166,35,0.22)';e.currentTarget.style.transform='none'}}>{status==='sending'?t.sending:t.send}</button>
              <p style={{textAlign:'center',fontSize:11,color:'rgba(255,255,255,0.2)',margin:0}}>{t.orWrite} <a href="https://t.me/winpartners_manager" style={{color:gold}}>@winpartners_manager</a> {t.orWrite2}</p>
            </div>
          )}
        </div>
      </div>
      <Footer nav={nav}/>
    </div>
  )
}
