import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const T = {
  ro: {
    nav_login: 'Autentificare', nav_register: 'Înregistrare',
    hero_title: 'CÂȘTIGĂ PENTRU', hero_title2: 'FIECARE CLIENT', hero_title3: 'RECOMANDAT',
    hero_sub: 'Program unic care îți permite să obții câștiguri de până la 20% de la clienți, alături de o cotă de venit pe viață.',
    hero_cta: 'ÎNCEPEȚI', hero_cta2: 'Cum funcționează',
    s1: '500K+', s1l: 'Jucători', s2: '100K+', s2l: 'Parteneri', s3: '$2,000+', s3l: 'Câștig mediu/lună',
    how_title: 'CUM FUNCȚIONEAZĂ',
    h1t: 'Înregistrare gratuită', h1d: 'Creați contul în 2 minute. Fără costuri, fără contracte complicate.',
    h2t: 'Primiți codul unic', h2d: 'Generăm un cod promoțional personalizat pentru audiența dvs.',
    h3t: 'Promovați', h3d: 'Postați pe TikTok, Instagram, YouTube sau Telegram cu codul dvs.',
    h4t: 'Primiți bani', h4d: '20% din tot ce generează urmăritorii dvs. Plăți săptămânale garantate.',
    why_title: 'DE CE WIN PARTNERS',
    w1t: '20% Comision fix', w1d: 'Cel mai mare comision din piață.',
    w2t: 'Statistici zilnice', w2d: 'Dashboard complet cu toate datele.',
    w3t: 'Cod personalizat', w3d: 'Codul tău cu numele tău.',
    w4t: 'Referrali', w4d: 'Câștigă 3% din bloggerii invitați.',
    w5t: 'Suport 24/7', w5d: 'Manager personal pe WhatsApp.',
    w6t: 'Plăți rapide', w6d: 'Bitcoin, Skrill, Neteller.',
    cta_title: 'GATA SĂ ÎNCEPEȚI?',
    cta_sub: 'Alăturați-vă sute de bloggeri care câștigă lunar.',
    cta_btn: 'CREAȚI CONT GRATUIT',
    footer: '© 2026 WinPartners. Toate drepturile rezervate.',
    terms: 'Termeni și Condiții', privacy: 'Confidențialitate', contact: 'Contact',
  },
  ru: {
    nav_login: 'Войти', nav_register: 'Регистрация',
    hero_title: 'ЗАРАБАТЫВАЙ НА', hero_title2: 'КАЖДОМ КЛИЕНТЕ', hero_title3: 'КОТОРОГО ПРИВЕЛ',
    hero_sub: 'Уникальная программа позволяет получать до 20% от клиентов с пожизненной долей дохода.',
    hero_cta: 'НАЧАТЬ', hero_cta2: 'Как это работает',
    s1: '500К+', s1l: 'Игроков', s2: '100К+', s2l: 'Партнеров', s3: '$2,000+', s3l: 'Средний доход/мес',
    how_title: 'КАК ЭТО РАБОТАЕТ',
    h1t: 'Бесплатная регистрация', h1d: 'Создайте аккаунт за 2 минуты.',
    h2t: 'Получите уникальный код', h2d: 'Персональный промокод для вашей аудитории.',
    h3t: 'Продвигайте', h3d: 'Публикуйте в TikTok, Instagram, YouTube, Telegram.',
    h4t: 'Получайте деньги', h4d: '20% от всего что зарабатывают ваши подписчики.',
    why_title: 'ПОЧЕМУ WIN PARTNERS',
    w1t: '20% Фиксированная комиссия', w1d: 'Самая высокая в рынке.',
    w2t: 'Ежедневная статистика', w2d: 'Полный дашборд со всеми данными.',
    w3t: 'Персональный код', w3d: 'Ваш код с вашим именем.',
    w4t: 'Рефералы', w4d: 'Зарабатывай 3% от приглашенных.',
    w5t: 'Поддержка 24/7', w5d: 'Личный менеджер в WhatsApp.',
    w6t: 'Быстрые выплаты', w6d: 'Bitcoin, Skrill, Neteller.',
    cta_title: 'ГОТОВЫ НАЧАТЬ?',
    cta_sub: 'Присоединяйтесь к сотням блогеров, которые зарабатывают ежемесячно.',
    cta_btn: 'СОЗДАТЬ БЕСПЛАТНЫЙ АККАУНТ',
    footer: '© 2026 WinPartners. Все права защищены.',
    terms: 'Условия использования', privacy: 'Конфиденциальность', contact: 'Контакты',
  },
  en: {
    nav_login: 'Login', nav_register: 'Register',
    hero_title: 'EARN FOR EVERY', hero_title2: 'CLIENT YOU', hero_title3: 'RECOMMEND',
    hero_sub: 'Unique program allowing you to earn up to 20% from clients with a lifetime revenue share.',
    hero_cta: 'GET STARTED', hero_cta2: 'How it works',
    s1: '500K+', s1l: 'Players', s2: '100K+', s2l: 'Partners', s3: '$2,000+', s3l: 'Avg earnings/month',
    how_title: 'HOW IT WORKS',
    h1t: 'Free registration', h1d: 'Create your account in 2 minutes.',
    h2t: 'Get your unique code', h2d: 'Personalized promo code for your audience.',
    h3t: 'Promote', h3d: 'Post on TikTok, Instagram, YouTube or Telegram.',
    h4t: 'Get paid', h4d: '20% of everything your followers generate.',
    why_title: 'WHY WIN PARTNERS',
    w1t: '20% Fixed commission', w1d: 'Highest commission in the market.',
    w2t: 'Daily statistics', w2d: 'Full dashboard with all data.',
    w3t: 'Personalized code', w3d: 'Your code with your name.',
    w4t: 'Referrals', w4d: 'Earn 3% from bloggers you invite.',
    w5t: 'Support 24/7', w5d: 'Personal manager on WhatsApp.',
    w6t: 'Fast payments', w6d: 'Bitcoin, Skrill, Neteller.',
    cta_title: 'READY TO START?',
    cta_sub: 'Join hundreds of bloggers earning monthly.',
    cta_btn: 'CREATE FREE ACCOUNT',
    footer: '© 2026 WinPartners. All rights reserved.',
    terms: 'Terms & Conditions', privacy: 'Privacy Policy', contact: 'Contact',
  }
}

const HEX = ({x,y,size=80,opacity=0.15,color='#f5a623'}) => {
  const h = size * Math.sqrt(3) / 2
  const pts = [
    [x, y-size], [x+h, y-size/2], [x+h, y+size/2],
    [x, y+size], [x-h, y+size/2], [x-h, y-size/2]
  ].map(p=>p.join(',')).join(' ')
  return <polygon points={pts} fill="none" stroke={color} strokeWidth="1" opacity={opacity}/>
}

export default function Landing() {
  const [lang, setLang] = useState('ro')
  const navigate = useNavigate()
  const t = T[lang]

  return (
    <div style={{background:'#0a0a0f',minHeight:'100vh',color:'#fff',fontFamily:"'Inter',sans-serif"}}>
      {/* NAV */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,background:'rgba(10,10,15,0.95)',borderBottom:'1px solid rgba(245,166,35,0.15)',padding:'0 2rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:64}}>
        <div style={{fontSize:22,fontWeight:900,letterSpacing:'-0.02em'}}>
          <span style={{color:'#fff'}}>WIN</span><span style={{color:'#f5a623'}}>PARTNERS</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          {['ro','ru','en'].map(l=>(
            <button key={l} onClick={()=>setLang(l)} style={{padding:'3px 9px',fontSize:11,fontWeight:700,cursor:'pointer',border:'1px solid rgba(245,166,35,0.3)',borderRadius:4,background:lang===l?'rgba(245,166,35,0.2)':'none',color:lang===l?'#f5a623':'rgba(255,255,255,0.4)',letterSpacing:'.05em'}}>{l.toUpperCase()}</button>
          ))}
          <button onClick={()=>navigate('/dashboard')} style={{padding:'7px 18px',fontSize:13,fontWeight:600,cursor:'pointer',border:'1px solid rgba(255,255,255,0.2)',borderRadius:6,background:'none',color:'#e2e8f0'}}>{t.nav_login}</button>
          <button onClick={()=>navigate('/register')} style={{padding:'7px 18px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:'#f5a623',color:'#000'}}>{t.nav_register}</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',position:'relative',overflow:'hidden',padding:'80px 4rem 2rem'}}>
        <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}} preserveAspectRatio="xMidYMid slice">
          <HEX x={900} y={300} size={180} opacity={0.12} color="#f5a623"/>
          <HEX x={1050} y={180} size={120} opacity={0.08} color="#f5a623"/>
          <HEX x={800} y={480} size={100} opacity={0.06} color="#f5a623"/>
          <HEX x={150} y={600} size={140} opacity={0.05} color="#f5a623"/>
          <HEX x={1150} y={500} size={90} opacity={0.1} color="#f5a623"/>
        </svg>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 70% 80% at 70% 50%,rgba(245,166,35,0.08) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{position:'relative',zIndex:1,maxWidth:620}}>
          <div style={{fontSize:'clamp(2.8rem,5vw,5rem)',fontWeight:900,lineHeight:1,letterSpacing:'-0.02em',textTransform:'uppercase',marginBottom:20}}>
            <div style={{color:'#fff'}}>{t.hero_title}</div>
            <div style={{color:'#f5a623'}}>{t.hero_title2}</div>
            <div style={{color:'#fff'}}>{t.hero_title3}</div>
          </div>
          <p style={{fontSize:16,color:'rgba(255,255,255,0.6)',lineHeight:1.7,maxWidth:480,marginBottom:36}}>{t.hero_sub}</p>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <button onClick={()=>navigate('/register')} style={{padding:'14px 36px',fontSize:15,fontWeight:800,cursor:'pointer',border:'none',borderRadius:6,background:'#f5a623',color:'#000',textTransform:'uppercase',letterSpacing:'.05em'}}>{t.hero_cta}</button>
            <button style={{padding:'14px 28px',fontSize:14,fontWeight:600,cursor:'pointer',border:'1px solid rgba(255,255,255,0.2)',borderRadius:6,background:'none',color:'rgba(255,255,255,0.7)'}}>{t.hero_cta2}</button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{background:'rgba(245,166,35,0.05)',borderTop:'1px solid rgba(245,166,35,0.15)',borderBottom:'1px solid rgba(245,166,35,0.15)',padding:'2rem 4rem'}}>
        <div style={{maxWidth:900,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24,textAlign:'center'}}>
          {[[t.s1,t.s1l],[t.s2,t.s2l],[t.s3,t.s3l]].map(([v,l])=>(
            <div key={l}>
              <div style={{fontSize:42,fontWeight:900,color:'#f5a623',lineHeight:1}}>{v}</div>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.45)',textTransform:'uppercase',letterSpacing:'.1em',marginTop:4}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW */}
      <div style={{maxWidth:1100,margin:'0 auto',padding:'5rem 2rem'}}>
        <h2 style={{fontSize:'clamp(1.6rem,3vw,2.4rem)',fontWeight:900,textAlign:'center',marginBottom:'3rem',textTransform:'uppercase',letterSpacing:'.05em',color:'#fff'}}>
          {t.how_title}
        </h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:24}}>
          {[[t.h1t,t.h1d,'01'],[t.h2t,t.h2d,'02'],[t.h3t,t.h3d,'03'],[t.h4t,t.h4d,'04']].map(([title,desc,num])=>(
            <div key={num} style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(245,166,35,0.15)',borderRadius:12,padding:'1.5rem',position:'relative',overflow:'hidden'}}>
              <div style={{fontSize:56,fontWeight:900,color:'rgba(245,166,35,0.1)',position:'absolute',top:8,right:12,lineHeight:1}}>{num}</div>
              <div style={{width:36,height:36,borderRadius:8,background:'rgba(245,166,35,0.15)',border:'1px solid rgba(245,166,35,0.3)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12,fontSize:16,color:'#f5a623',fontWeight:900}}>{num}</div>
              <div style={{fontSize:15,fontWeight:700,color:'#fff',marginBottom:8}}>{title}</div>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.6}}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* WHY */}
      <div style={{background:'rgba(0,0,0,0.3)',padding:'5rem 2rem'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <h2 style={{fontSize:'clamp(1.6rem,3vw,2.4rem)',fontWeight:900,textAlign:'center',marginBottom:'3rem',textTransform:'uppercase',letterSpacing:'.05em',color:'#fff'}}>{t.why_title}</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20}}>
            {[
              ['💰',t.w1t,t.w1d],['📊',t.w2t,t.w2d],['🎯',t.w3t,t.w3d],
              ['👥',t.w4t,t.w4d],['💬',t.w5t,t.w5d],['⚡',t.w6t,t.w6d]
            ].map(([icon,title,desc])=>(
              <div key={title} style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(245,166,35,0.12)',borderRadius:12,padding:'1.25rem',display:'flex',gap:14,alignItems:'flex-start'}}>
                <div style={{width:44,height:44,borderRadius:10,background:'rgba(245,166,35,0.12)',border:'1px solid rgba(245,166,35,0.25)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:20}}>{icon}</div>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:'#fff',marginBottom:4}}>{title}</div>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.45)',lineHeight:1.5}}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{padding:'5rem 2rem',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 60% 80% at 50% 50%,rgba(245,166,35,0.08) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{position:'relative',zIndex:1}}>
          <h2 style={{fontSize:'clamp(2rem,4vw,3rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.03em',marginBottom:12}}>{t.cta_title}</h2>
          <p style={{fontSize:16,color:'rgba(255,255,255,0.5)',marginBottom:32}}>{t.cta_sub}</p>
          <button onClick={()=>navigate('/register')} style={{padding:'16px 48px',fontSize:15,fontWeight:800,cursor:'pointer',border:'none',borderRadius:6,background:'#f5a623',color:'#000',textTransform:'uppercase',letterSpacing:'.05em'}}>{t.cta_btn}</button>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{background:'rgba(0,0,0,0.5)',borderTop:'1px solid rgba(245,166,35,0.1)',padding:'2rem',textAlign:'center'}}>
        <div style={{fontSize:18,fontWeight:900,marginBottom:12}}><span style={{color:'#fff'}}>WIN</span><span style={{color:'#f5a623'}}>PARTNERS</span></div>
        <div style={{display:'flex',gap:20,justifyContent:'center',marginBottom:12}}>
          {[t.terms,t.privacy,t.contact].map(l=><span key={l} style={{fontSize:12,color:'rgba(255,255,255,0.35)',cursor:'pointer'}}>{l}</span>)}
        </div>
        <div style={{fontSize:12,color:'rgba(255,255,255,0.2)'}}>{t.footer}</div>
      </footer>
    </div>
  )
}
