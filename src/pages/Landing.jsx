import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const T = {
  ro: {
    nav_login: 'Autentificare',
    nav_register: 'Înregistrare',
    hero_badge: 'Platforma #1 pentru bloggeri',
    hero_title: 'Câștigă bani din',
    hero_title2: 'audiența ta',
    hero_sub: 'Promovează cele mai mari cazinouri și primești 20% din câștiguri. Fără experiență necesară.',
    hero_cta: 'Începe gratuit',
    hero_cta2: 'Cum funcționează',
    stat1: 'Bloggeri activi',
    stat2: 'Plătit total',
    stat3: 'Cazinouri partenere',
    stat4: 'Comision mediu/lună',
    how_title: 'Cum funcționează',
    how1_t: 'Înregistrare gratuită',
    how1_d: 'Creează contul în 2 minute. Fără costuri, fără contracte complicate.',
    how2_t: 'Primești codul tău unic',
    how2_d: 'Îți generăm un cod promoțional personalizat pentru audiența ta.',
    how3_t: 'Promovezi pe rețelele tale',
    how3_d: 'Postezi pe TikTok, Instagram, YouTube sau Telegram cu codul tău.',
    how4_t: 'Primești bani',
    how4_d: '20% din tot ce generează urmăritorii tăi. Plăți săptămânale garantate.',
    why_title: 'De ce WinPartners',
    why1_t: '20% comision fix',
    why1_d: 'Cel mai mare comision din piață. Tu aduci audiența, noi plătim corect.',
    why2_t: 'Statistici în timp real',
    why2_d: 'Dashboard complet cu click-uri, înregistrări și câștiguri zilnice.',
    why3_t: 'Cod personalizat',
    why3_d: 'Codul tău cu numele tău — mai ușor de promovat și de reținut.',
    why4_t: 'Invită alți bloggeri',
    why4_d: 'Câștigă 3% din comisioanele bloggerilor pe care îi aduci tu.',
    why5_t: 'Suport dedicat',
    why5_d: 'Manager personal disponibil 24/7 pe WhatsApp sau Telegram.',
    why6_t: 'Plăți rapide',
    why6_d: 'Bitcoin, Skrill, Neteller sau transfer bancar. Procesare în 48h.',
    cta_title: 'Gata să începi?',
    cta_sub: 'Alătură-te a sute de bloggeri care câștigă lunar din WinPartners.',
    cta_btn: 'Creează cont gratuit',
    footer: '© 2026 WinPartners. Toate drepturile rezervate.',
  },
  ru: {
    nav_login: 'Войти',
    nav_register: 'Регистрация',
    hero_badge: 'Платформа #1 для блогеров',
    hero_title: 'Зарабатывай на своей',
    hero_title2: 'аудитории',
    hero_sub: 'Продвигай крупнейшие казино и получай 20% с доходов. Опыт не нужен.',
    hero_cta: 'Начать бесплатно',
    hero_cta2: 'Как это работает',
    stat1: 'Активных блогеров',
    stat2: 'Всего выплачено',
    stat3: 'Казино-партнеров',
    stat4: 'Средняя комиссия/мес',
    how_title: 'Как это работает',
    how1_t: 'Бесплатная регистрация',
    how1_d: 'Создай аккаунт за 2 минуты. Без затрат и сложных договоров.',
    how2_t: 'Получи свой уникальный код',
    how2_d: 'Мы генерируем персональный промокод для твоей аудитории.',
    how3_t: 'Продвигай в своих сетях',
    how3_d: 'Публикуй в TikTok, Instagram, YouTube или Telegram со своим кодом.',
    how4_t: 'Получай деньги',
    how4_d: '20% от всего, что зарабатывают твои подписчики. Еженедельные выплаты.',
    why_title: 'Почему WinPartners',
    why1_t: '20% фиксированная комиссия',
    why1_d: 'Самая высокая комиссия на рынке. Ты приводишь аудиторию — мы платим честно.',
    why2_t: 'Статистика в реальном времени',
    why2_d: 'Полный дашборд с кликами, регистрациями и ежедневными доходами.',
    why3_t: 'Персональный код',
    why3_d: 'Твой код с твоим именем — легче продвигать и запомнить.',
    why4_t: 'Приглашай блогеров',
    why4_d: 'Зарабатывай 3% с комиссий блогеров, которых ты привел.',
    why5_t: 'Личный менеджер',
    why5_d: 'Поддержка 24/7 в WhatsApp или Telegram.',
    why6_t: 'Быстрые выплаты',
    why6_d: 'Bitcoin, Skrill, Neteller или банковский перевод. Обработка за 48ч.',
    cta_title: 'Готов начать?',
    cta_sub: 'Присоединяйся к сотням блогеров, которые ежемесячно зарабатывают с WinPartners.',
    cta_btn: 'Создать бесплатный аккаунт',
    footer: '© 2026 WinPartners. Все права защищены.',
  },
  en: {
    nav_login: 'Login',
    nav_register: 'Register',
    hero_badge: 'The #1 platform for bloggers',
    hero_title: 'Earn money from',
    hero_title2: 'your audience',
    hero_sub: 'Promote top casinos and earn 20% of profits. No experience needed.',
    hero_cta: 'Start for free',
    hero_cta2: 'How it works',
    stat1: 'Active bloggers',
    stat2: 'Total paid out',
    stat3: 'Casino partners',
    stat4: 'Avg commission/month',
    how_title: 'How it works',
    how1_t: 'Free registration',
    how1_d: 'Create your account in 2 minutes. No costs, no complicated contracts.',
    how2_t: 'Get your unique code',
    how2_d: 'We generate a personalized promo code for your audience.',
    how3_t: 'Promote on your channels',
    how3_d: 'Post on TikTok, Instagram, YouTube or Telegram with your code.',
    how4_t: 'Get paid',
    how4_d: '20% of everything your followers generate. Weekly guaranteed payments.',
    why_title: 'Why WinPartners',
    why1_t: '20% fixed commission',
    why1_d: 'Highest commission in the market. You bring the audience, we pay fairly.',
    why2_t: 'Real-time statistics',
    why2_d: 'Full dashboard with clicks, registrations and daily earnings.',
    why3_t: 'Personalized code',
    why3_d: 'Your code with your name — easier to promote and remember.',
    why4_t: 'Invite other bloggers',
    why4_d: 'Earn 3% from commissions of bloggers you refer.',
    why5_t: 'Dedicated support',
    why5_d: 'Personal manager available 24/7 on WhatsApp or Telegram.',
    why6_t: 'Fast payments',
    why6_d: 'Bitcoin, Skrill, Neteller or bank transfer. Processing in 48h.',
    cta_title: 'Ready to start?',
    cta_sub: 'Join hundreds of bloggers earning monthly with WinPartners.',
    cta_btn: 'Create free account',
    footer: '© 2026 WinPartners. All rights reserved.',
  }
}

const s = {
  nav: {position:'fixed',top:0,left:0,right:0,zIndex:100,background:'rgba(6,6,18,0.85)',backdropFilter:'blur(12px)',borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'0 2rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:64},
  logo: {fontSize:20,fontWeight:800,color:'#fff',letterSpacing:'-0.02em'},
  logoSpan: {color:'#7c3aed'},
  navRight: {display:'flex',alignItems:'center',gap:12},
  langBtn: (active) => ({padding:'4px 10px',fontSize:12,fontWeight:500,cursor:'pointer',border:'1px solid rgba(255,255,255,0.15)',borderRadius:6,background:active?'rgba(124,58,237,0.3)':'none',color:active?'#a78bfa':'rgba(255,255,255,0.5)',transition:'all .15s'}),
  btnOutline: {padding:'8px 18px',fontSize:13,fontWeight:600,cursor:'pointer',border:'1px solid rgba(255,255,255,0.2)',borderRadius:8,background:'none',color:'#e2e8f0'},
  btnPrimary: {padding:'8px 18px',fontSize:13,fontWeight:600,cursor:'pointer',border:'none',borderRadius:8,background:'linear-gradient(135deg,#7c3aed,#5b21b6)',color:'#fff'},
  hero: {minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'100px 2rem 4rem',position:'relative',overflow:'hidden'},
  heroBg: {position:'absolute',inset:0,background:'radial-gradient(ellipse 80% 60% at 50% 0%,rgba(124,58,237,0.15) 0%,transparent 70%)',pointerEvents:'none'},
  badge: {display:'inline-flex',alignItems:'center',gap:6,background:'rgba(124,58,237,0.15)',border:'1px solid rgba(124,58,237,0.3)',borderRadius:20,padding:'6px 14px',fontSize:12,fontWeight:600,color:'#a78bfa',marginBottom:24},
  h1: {fontSize:'clamp(2.5rem,6vw,4.5rem)',fontWeight:800,lineHeight:1.05,letterSpacing:'-0.03em',color:'#fff',marginBottom:8},
  h1Accent: {background:'linear-gradient(135deg,#7c3aed,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'},
  heroSub: {fontSize:'clamp(1rem,2vw,1.2rem)',color:'rgba(255,255,255,0.55)',maxWidth:520,margin:'0 auto 36px',lineHeight:1.6},
  heroBtns: {display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:60},
  btnHero: {padding:'14px 32px',fontSize:15,fontWeight:700,cursor:'pointer',border:'none',borderRadius:10,background:'linear-gradient(135deg,#7c3aed,#5b21b6)',color:'#fff',boxShadow:'0 8px 32px rgba(124,58,237,0.4)'},
  btnHero2: {padding:'14px 32px',fontSize:15,fontWeight:600,cursor:'pointer',border:'1px solid rgba(255,255,255,0.15)',borderRadius:10,background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.8)'},
  stats: {display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:1,background:'rgba(255,255,255,0.06)',borderRadius:16,overflow:'hidden',maxWidth:700,margin:'0 auto',border:'1px solid rgba(255,255,255,0.08)'},
  statItem: {padding:'20px',textAlign:'center',background:'rgba(6,6,18,0.8)'},
  statVal: {fontSize:28,fontWeight:800,color:'#a78bfa',marginBottom:4},
  statLbl: {fontSize:11,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'.08em'},
  section: {maxWidth:1100,margin:'0 auto',padding:'5rem 2rem'},
  sectionTitle: {fontSize:'clamp(1.8rem,4vw,2.8rem)',fontWeight:800,textAlign:'center',marginBottom:'3rem',color:'#fff',letterSpacing:'-0.02em'},
  howGrid: {display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:24},
  howCard: {background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:'1.5rem',position:'relative'},
  howNum: {fontSize:48,fontWeight:800,color:'rgba(124,58,237,0.2)',position:'absolute',top:12,right:16,lineHeight:1},
  howTitle: {fontSize:16,fontWeight:700,color:'#fff',marginBottom:8},
  howDesc: {fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.6},
  whyGrid: {display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20},
  whyCard: {background:'rgba(124,58,237,0.06)',border:'1px solid rgba(124,58,237,0.15)',borderRadius:16,padding:'1.5rem',display:'flex',gap:14,alignItems:'flex-start'},
  whyIcon: {width:40,height:40,borderRadius:10,background:'rgba(124,58,237,0.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:18},
  whyTitle: {fontSize:15,fontWeight:700,color:'#fff',marginBottom:4},
  whyDesc: {fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.6},
  ctaSection: {background:'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(91,33,182,0.1))',border:'1px solid rgba(124,58,237,0.2)',borderRadius:24,margin:'0 2rem 4rem',padding:'4rem 2rem',textAlign:'center'},
  ctaTitle: {fontSize:'clamp(1.8rem,4vw,2.5rem)',fontWeight:800,color:'#fff',marginBottom:12,letterSpacing:'-0.02em'},
  ctaSub: {fontSize:16,color:'rgba(255,255,255,0.5)',marginBottom:32},
  btnCtaLarge: {padding:'16px 40px',fontSize:16,fontWeight:700,cursor:'pointer',border:'none',borderRadius:12,background:'linear-gradient(135deg,#7c3aed,#5b21b6)',color:'#fff',boxShadow:'0 8px 32px rgba(124,58,237,0.4)'},
  footer: {textAlign:'center',padding:'2rem',color:'rgba(255,255,255,0.3)',fontSize:13,borderTop:'1px solid rgba(255,255,255,0.06)'},
}

const LANGS = ['ro','ru','en']

export default function Landing() {
  const [lang, setLang] = useState('ro')
  const navigate = useNavigate()
  const t = T[lang]

  const why = [
    {icon:'💰',t:t.why1_t,d:t.why1_d},
    {icon:'📊',t:t.why2_t,d:t.why2_d},
    {icon:'🎯',t:t.why3_t,d:t.why3_d},
    {icon:'👥',t:t.why4_t,d:t.why4_d},
    {icon:'💬',t:t.why5_t,d:t.why5_d},
    {icon:'⚡',t:t.why6_t,d:t.why6_d},
  ]

  return (
    <div style={{background:'#060612',minHeight:'100vh'}}>
      <nav style={s.nav}>
        <div style={s.logo}>Win<span style={s.logoSpan}>Partners</span></div>
        <div style={s.navRight}>
          {LANGS.map(l=><button key={l} style={s.langBtn(lang===l)} onClick={()=>setLang(l)}>{l.toUpperCase()}</button>)}
          <button style={s.btnOutline} onClick={()=>navigate('/dashboard')}>{t.nav_login}</button>
          <button style={s.btnPrimary} onClick={()=>navigate('/register')}>{t.nav_register}</button>
        </div>
      </nav>

      <div style={s.hero}>
        <div style={s.heroBg}/>
        <div style={{position:'relative',zIndex:1,width:'100%'}}>
          <div style={s.badge}>🏆 {t.hero_badge}</div>
          <h1 style={s.h1}>
            {t.hero_title}<br/>
            <span style={s.h1Accent}>{t.hero_title2}</span>
          </h1>
          <p style={s.heroSub}>{t.hero_sub}</p>
          <div style={s.heroBtns}>
            <button style={s.btnHero} onClick={()=>navigate('/register')}>{t.hero_cta} →</button>
            <button style={s.btnHero2}>{t.hero_cta2}</button>
          </div>
          <div style={s.stats}>
            {[['500+',t.stat1],['$120K+',t.stat2],['3',t.stat3],['$800',t.stat4]].map(([v,l])=>(
              <div key={l} style={s.statItem}>
                <div style={s.statVal}>{v}</div>
                <div style={s.statLbl}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.section}>
        <h2 style={s.sectionTitle}>{t.how_title}</h2>
        <div style={s.howGrid}>
          {[
            [t.how1_t,t.how1_d,'1'],
            [t.how2_t,t.how2_d,'2'],
            [t.how3_t,t.how3_d,'3'],
            [t.how4_t,t.how4_d,'4'],
          ].map(([title,desc,num])=>(
            <div key={num} style={s.howCard}>
              <div style={s.howNum}>{num}</div>
              <div style={s.howTitle}>{title}</div>
              <div style={s.howDesc}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.section}>
        <h2 style={s.sectionTitle}>{t.why_title}</h2>
        <div style={s.whyGrid}>
          {why.map((w,i)=>(
            <div key={i} style={s.whyCard}>
              <div style={s.whyIcon}>{w.icon}</div>
              <div>
                <div style={s.whyTitle}>{w.t}</div>
                <div style={s.whyDesc}>{w.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.ctaSection}>
        <h2 style={s.ctaTitle}>{t.cta_title}</h2>
        <p style={s.ctaSub}>{t.cta_sub}</p>
        <button style={s.btnCtaLarge} onClick={()=>navigate('/register')}>{t.cta_btn} →</button>
      </div>

      <footer style={s.footer}>{t.footer}</footer>
    </div>
  )
}
