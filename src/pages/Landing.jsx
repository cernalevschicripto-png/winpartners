import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const T = {
  ro: {
    nav_login:'Conectați-vă', nav_reg:'Înregistrare',
    h1:'CONECTAȚI-VĂ ȘI', h2:'CÂȘTIGAȚI PENTRU', h3:'FIECARE CLIENT RECOMANDAT',
    hsub:'Acest program unic vă permite să obțineți câștiguri de până la 20% de la clienți, alături de o cotă de venit pe viață.',
    hbtn:'ÎNCEPEȚI',
    s1v:'1M+', s1l:'Jucători înregistrați',
    s2v:'100K+', s2l:'Parteneri activi',
    s3v:'$2,000+', s3l:'Câștig mediu/lună',
    ben_title:'BENEFICIILE PROGRAMULUI',
    b1t:'Comision RevShare 20%', b1d:'Primiți 20% din veniturile nete generate de jucătorii recomandați pe toată durata activității lor.',
    b2t:'Statistici în timp real', b2d:'Acces la rapoarte detaliate: vizualizări, clickuri, înregistrări, depuneri și comisioane.',
    b3t:'Cod promoțional unic', b3d:'Fiecare partener primește un cod personalizat pentru promovare pe rețelele sociale.',
    b4t:'Plăți săptămânale', b4d:'Plăți garantate în fiecare săptămână prin Bitcoin, Skrill, Neteller sau transfer bancar.',
    b5t:'Program de referrali', b5d:'Câștigați 3% din comisioanele partenerilor pe care îi invitați în program.',
    b6t:'Manager personal', b6d:'Fiecare partener are un manager dedicat disponibil 24/7 pe WhatsApp și Telegram.',
    how_title:'CUM FUNCȚIONEAZĂ',
    hw1t:'Înregistrare', hw1d:'Completați formularul de înregistrare în 2 minute. Procesul este gratuit.',
    hw2t:'Obțineți instrumentele', hw2d:'Primiți codul promoțional, linkuri de afiliat și materiale de marketing.',
    hw3t:'Promovați', hw3d:'Distribuiți codul pe TikTok, Instagram, YouTube, Telegram sau alte platforme.',
    hw4t:'Câștigați', hw4d:'Primiți 20% din veniturile generate. Plăți automate săptămânal.',
    mod_title:'MODELE DE COMISION',
    m1t:'Revenue Share', m1d:'20% din veniturile nete pe viață', m1b:'Popular',
    m2t:'CPA', m2d:'Plată fixă per jucător activ', m2b:'',
    m3t:'Hybrid', m3d:'Combinație RevShare + CPA', m3b:'',
    cta_title:'DEVENIȚI PARTENER ACUM',
    cta_sub:'Alăturați-vă mii de parteneri care câștigă zilnic cu WinPartners.',
    cta_btn:'ÎNREGISTRARE GRATUITĂ',
    f_about:'Despre noi', f_terms:'Termeni și Condiții', f_privacy:'Politica de Confidențialitate',
    f_cookie:'Politica Cookie', f_contact:'Contacte', f_news:'Știri',
    f_copy:'© 2012-2026 "WinPartners". Toate drepturile rezervate.',
  },
  ru: {
    nav_login:'Войти', nav_reg:'Регистрация',
    h1:'ПОДКЛЮЧАЙТЕСЬ И', h2:'ЗАРАБАТЫВАЙТЕ НА', h3:'КАЖДОМ ПРИВЛЕЧЕННОМ КЛИЕНТЕ',
    hsub:'Эта уникальная программа позволяет получать до 20% от клиентов с пожизненной долей дохода.',
    hbtn:'НАЧАТЬ',
    s1v:'1M+', s1l:'Зарегистрированных игроков',
    s2v:'100К+', s2l:'Активных партнеров',
    s3v:'$2,000+', s3l:'Средний доход/мес',
    ben_title:'ПРЕИМУЩЕСТВА ПРОГРАММЫ',
    b1t:'Комиссия RevShare 20%', b1d:'Получайте 20% от чистого дохода привлеченных игроков на протяжении всей их активности.',
    b2t:'Статистика в реальном времени', b2d:'Доступ к подробным отчетам: просмотры, клики, регистрации, депозиты и комиссии.',
    b3t:'Уникальный промокод', b3d:'Каждый партнер получает персонализированный код для продвижения в социальных сетях.',
    b4t:'Еженедельные выплаты', b4d:'Гарантированные выплаты каждую неделю через Bitcoin, Skrill, Neteller или банковский перевод.',
    b5t:'Реферальная программа', b5d:'Зарабатывайте 3% от комиссий партнеров, которых вы пригласили в программу.',
    b6t:'Личный менеджер', b6d:'Каждый партнер имеет выделенного менеджера, доступного 24/7 в WhatsApp и Telegram.',
    how_title:'КАК ЭТО РАБОТАЕТ',
    hw1t:'Регистрация', hw1d:'Заполните форму регистрации за 2 минуты. Процесс бесплатный.',
    hw2t:'Получите инструменты', hw2d:'Получите промокод, партнерские ссылки и маркетинговые материалы.',
    hw3t:'Продвигайте', hw3d:'Делитесь кодом в TikTok, Instagram, YouTube, Telegram или других платформах.',
    hw4t:'Зарабатывайте', hw4d:'Получайте 20% от полученных доходов. Автоматические выплаты каждую неделю.',
    mod_title:'МОДЕЛИ КОМИССИЙ',
    m1t:'Revenue Share', m1d:'20% от чистого дохода пожизненно', m1b:'Популярно',
    m2t:'CPA', m2d:'Фиксированная оплата за активного игрока', m2b:'',
    m3t:'Hybrid', m3d:'Комбинация RevShare + CPA', m3b:'',
    cta_title:'СТАНЬ ПАРТНЕРОМ СЕЙЧАС',
    cta_sub:'Присоединяйтесь к тысячам партнеров, которые зарабатывают ежедневно с WinPartners.',
    cta_btn:'БЕСПЛАТНАЯ РЕГИСТРАЦИЯ',
    f_about:'О нас', f_terms:'Условия использования', f_privacy:'Политика конфиденциальности',
    f_cookie:'Политика Cookie', f_contact:'Контакты', f_news:'Новости',
    f_copy:'© 2012-2026 "WinPartners". Все права защищены.',
  },
  en: {
    nav_login:'Login', nav_reg:'Register',
    h1:'CONNECT AND', h2:'EARN FOR EVERY', h3:'CLIENT YOU RECOMMEND',
    hsub:'This unique program allows you to earn up to 20% from clients with a lifetime revenue share.',
    hbtn:'GET STARTED',
    s1v:'1M+', s1l:'Registered players',
    s2v:'100K+', s2l:'Active partners',
    s3v:'$2,000+', s3l:'Average earnings/month',
    ben_title:'PROGRAM BENEFITS',
    b1t:'RevShare Commission 20%', b1d:'Receive 20% of net revenue from referred players for the duration of their activity.',
    b2t:'Real-time statistics', b2d:'Access to detailed reports: views, clicks, registrations, deposits and commissions.',
    b3t:'Unique promo code', b3d:'Each partner receives a personalized code for promotion on social networks.',
    b4t:'Weekly payments', b4d:'Guaranteed payments every week via Bitcoin, Skrill, Neteller or bank transfer.',
    b5t:'Referral program', b5d:'Earn 3% from commissions of partners you invite to the program.',
    b6t:'Personal manager', b6d:'Each partner has a dedicated manager available 24/7 on WhatsApp and Telegram.',
    how_title:'HOW IT WORKS',
    hw1t:'Registration', hw1d:'Complete the registration form in 2 minutes. The process is free.',
    hw2t:'Get your tools', hw2d:'Receive your promo code, affiliate links and marketing materials.',
    hw3t:'Promote', hw3d:'Share the code on TikTok, Instagram, YouTube, Telegram or other platforms.',
    hw4t:'Earn', hw4d:'Receive 20% of generated revenue. Automatic weekly payments.',
    mod_title:'COMMISSION MODELS',
    m1t:'Revenue Share', m1d:'20% of net revenue for life', m1b:'Popular',
    m2t:'CPA', m2d:'Fixed payment per active player', m2b:'',
    m3t:'Hybrid', m3d:'Combination RevShare + CPA', m3b:'',
    cta_title:'BECOME A PARTNER NOW',
    cta_sub:'Join thousands of partners earning daily with WinPartners.',
    cta_btn:'FREE REGISTRATION',
    f_about:'About us', f_terms:'Terms & Conditions', f_privacy:'Privacy Policy',
    f_cookie:'Cookie Policy', f_contact:'Contacts', f_news:'News',
    f_copy:'© 2012-2026 "WinPartners". All rights reserved.',
  }
}

// SVG Hexagon shape for stats
const HexStat = ({value, label}) => (
  <div style={{display:'flex',flexDirection:'column',alignItems:'center',position:'relative'}}>
    <svg width="180" height="200" viewBox="0 0 180 200">
      <polygon points="90,5 170,47 170,153 90,195 10,153 10,47" fill="none" stroke="#f5a623" strokeWidth="1.5" opacity="0.6"/>
      <polygon points="90,15 160,53 160,147 90,185 20,147 20,53" fill="rgba(245,166,35,0.06)" stroke="#f5a623" strokeWidth="0.5" opacity="0.3"/>
    </svg>
    <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',textAlign:'center'}}>
      <div style={{fontSize:36,fontWeight:900,color:'#f5a623',lineHeight:1}}>{value}</div>
      <div style={{fontSize:11,color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:'.08em',marginTop:4,maxWidth:100,lineHeight:1.3}}>{label}</div>
    </div>
  </div>
)

export default function Landing() {
  const [lang, setLang] = useState('ro')
  const navigate = useNavigate()
  const t = T[lang]

  const gold = '#f5a623'
  const dark = '#0a0a0f'
  const card = {background:'rgba(255,255,255,0.03)',border:'1px solid rgba(245,166,35,0.12)',borderRadius:12,padding:'1.5rem'}

  return (
    <div style={{background:dark,minHeight:'100vh',color:'#fff',fontFamily:"'Inter',sans-serif"}}>

      {/* NAV */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,background:'rgba(10,10,15,0.97)',borderBottom:'1px solid rgba(245,166,35,0.12)',padding:'0 3rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:64}}>
        <div style={{fontSize:20,fontWeight:900,letterSpacing:'0.05em'}}>
          <span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          {['ro','ru','en'].map(l=>(
            <button key={l} onClick={()=>setLang(l)} style={{padding:'3px 8px',fontSize:11,fontWeight:700,cursor:'pointer',border:`1px solid ${lang===l?gold:'rgba(255,255,255,0.15)'}`,borderRadius:4,background:lang===l?'rgba(245,166,35,0.15)':'none',color:lang===l?gold:'rgba(255,255,255,0.4)'}}>{l.toUpperCase()}</button>
          ))}
          <button onClick={()=>navigate('/dashboard')} style={{marginLeft:8,padding:'8px 20px',fontSize:13,fontWeight:600,cursor:'pointer',border:'1px solid rgba(255,255,255,0.15)',borderRadius:4,background:'none',color:'#e2e8f0'}}>{t.nav_login}</button>
          <button onClick={()=>navigate('/register')} style={{padding:'8px 20px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:4,background:gold,color:'#000',textTransform:'uppercase',letterSpacing:'.03em'}}>{t.nav_reg}</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',position:'relative',overflow:'hidden',background:`linear-gradient(135deg, ${dark} 0%, #0f0a00 100%)`}}>
        {/* Hex pattern bg */}
        <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',opacity:0.15}} preserveAspectRatio="xMidYMid slice">
          {[...Array(8)].map((_,i)=>[...Array(6)].map((_,j)=>{
            const x = i*160 + (j%2)*80
            const y = j*140
            return <polygon key={`${i}-${j}`} points={`${x+80},${y} ${x+155},${y+42} ${x+155},${y+126} ${x+80},${y+168} ${x+5},${y+126} ${x+5},${y+42}`} fill="none" stroke={gold} strokeWidth="0.5"/>
          }))}
        </svg>
        <div style={{position:'absolute',right:0,top:0,bottom:0,width:'55%',background:`radial-gradient(ellipse at 70% 50%, rgba(245,166,35,0.12) 0%, transparent 60%)`,pointerEvents:'none'}}/>
        
        <div style={{position:'relative',zIndex:1,padding:'100px 4rem 4rem',maxWidth:700}}>
          <div style={{fontSize:'clamp(2.5rem,4.5vw,4.2rem)',fontWeight:900,lineHeight:1.05,letterSpacing:'-0.01em',textTransform:'uppercase',marginBottom:24}}>
            <div style={{color:'#fff'}}>{t.h1}</div>
            <div style={{color:'#fff'}}>{t.h2}</div>
            <div style={{color:gold}}>{t.h3}</div>
          </div>
          <p style={{fontSize:16,color:'rgba(255,255,255,0.6)',lineHeight:1.7,maxWidth:500,marginBottom:40}}>{t.hsub}</p>
          <button onClick={()=>navigate('/register')} style={{padding:'16px 48px',fontSize:16,fontWeight:800,cursor:'pointer',border:`2px solid ${gold}`,borderRadius:4,background:gold,color:'#000',textTransform:'uppercase',letterSpacing:'.05em',display:'inline-block'}}>
            {t.hbtn}
          </button>
        </div>
      </div>

      {/* STATS HEXAGONS */}
      <div style={{background:'#080808',padding:'4rem 2rem',borderTop:'1px solid rgba(245,166,35,0.1)',borderBottom:'1px solid rgba(245,166,35,0.1)'}}>
        <div style={{maxWidth:900,margin:'0 auto',display:'flex',justifyContent:'center',gap:40,flexWrap:'wrap'}}>
          <HexStat value={t.s1v} label={t.s1l}/>
          <HexStat value={t.s2v} label={t.s2l}/>
          <HexStat value={t.s3v} label={t.s3l}/>
        </div>
      </div>

      {/* BENEFITS */}
      <div style={{maxWidth:1200,margin:'0 auto',padding:'5rem 2rem'}}>
        <h2 style={{fontSize:'clamp(1.4rem,2.5vw,2rem)',fontWeight:900,textAlign:'center',marginBottom:'3rem',textTransform:'uppercase',letterSpacing:'.1em',color:'#fff',borderBottom:'2px solid rgba(245,166,35,0.2)',paddingBottom:'1rem'}}>
          {t.ben_title}
        </h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:20}}>
          {[
            ['💰',t.b1t,t.b1d],['📊',t.b2t,t.b2d],['🎯',t.b3t,t.b3d],
            ['⚡',t.b4t,t.b4d],['👥',t.b5t,t.b5d],['💬',t.b6t,t.b6d]
          ].map(([icon,title,desc])=>(
            <div key={title} style={{...card,display:'flex',gap:16,alignItems:'flex-start'}}>
              <div style={{width:48,height:48,background:'rgba(245,166,35,0.1)',border:`1px solid rgba(245,166,35,0.25)`,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{icon}</div>
              <div>
                <div style={{fontSize:15,fontWeight:700,color:'#fff',marginBottom:6}}>{title}</div>
                <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.6}}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{background:'rgba(0,0,0,0.4)',padding:'5rem 2rem',borderTop:'1px solid rgba(245,166,35,0.08)'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <h2 style={{fontSize:'clamp(1.4rem,2.5vw,2rem)',fontWeight:900,textAlign:'center',marginBottom:'3rem',textTransform:'uppercase',letterSpacing:'.1em'}}>{t.how_title}</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:0,position:'relative'}}>
            {[[t.hw1t,t.hw1d,'1'],[t.hw2t,t.hw2d,'2'],[t.hw3t,t.hw3d,'3'],[t.hw4t,t.hw4d,'4']].map(([title,desc,num],i)=>(
              <div key={num} style={{padding:'2rem',borderLeft:i>0?'1px solid rgba(245,166,35,0.1)':'none',position:'relative'}}>
                <div style={{width:52,height:52,borderRadius:'50%',background:'rgba(245,166,35,0.12)',border:`2px solid ${gold}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontWeight:900,color:gold,marginBottom:16}}>{num}</div>
                <div style={{fontSize:16,fontWeight:700,color:'#fff',marginBottom:8}}>{title}</div>
                <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.6}}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COMMISSION MODELS */}
      <div style={{maxWidth:1000,margin:'0 auto',padding:'5rem 2rem'}}>
        <h2 style={{fontSize:'clamp(1.4rem,2.5vw,2rem)',fontWeight:900,textAlign:'center',marginBottom:'3rem',textTransform:'uppercase',letterSpacing:'.1em'}}>{t.mod_title}</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:20}}>
          {[[t.m1t,t.m1d,t.m1b,true],[t.m2t,t.m2d,t.m2b,false],[t.m3t,t.m3d,t.m3b,false]].map(([title,desc,badge,featured])=>(
            <div key={title} style={{...card,border:`1px solid ${featured?gold:'rgba(245,166,35,0.12)'}`,background:featured?'rgba(245,166,35,0.06)':card.background,textAlign:'center',padding:'2rem',position:'relative'}}>
              {badge && <div style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:gold,color:'#000',fontSize:11,fontWeight:800,padding:'3px 14px',borderRadius:20,textTransform:'uppercase',letterSpacing:'.05em'}}>{badge}</div>}
              <div style={{fontSize:22,fontWeight:900,color:featured?gold:'#fff',marginBottom:8}}>{title}</div>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.5}}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{background:`linear-gradient(135deg, #0f0800 0%, #1a0f00 100%)`,padding:'5rem 2rem',textAlign:'center',borderTop:'1px solid rgba(245,166,35,0.15)',borderBottom:'1px solid rgba(245,166,35,0.15)'}}>
        <h2 style={{fontSize:'clamp(1.8rem,3.5vw,3rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.03em',marginBottom:12}}>{t.cta_title}</h2>
        <p style={{fontSize:16,color:'rgba(255,255,255,0.5)',marginBottom:36}}>{t.cta_sub}</p>
        <button onClick={()=>navigate('/register')} style={{padding:'18px 56px',fontSize:16,fontWeight:800,cursor:'pointer',border:`2px solid ${gold}`,borderRadius:4,background:gold,color:'#000',textTransform:'uppercase',letterSpacing:'.05em'}}>{t.cta_btn}</button>
      </div>

      {/* FOOTER */}
      <footer style={{background:'#050505',padding:'3rem 3rem 2rem',borderTop:'1px solid rgba(245,166,35,0.08)'}}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:24,marginBottom:32}}>
            <div>
              <div style={{fontSize:22,fontWeight:900,letterSpacing:'.05em',marginBottom:8}}><span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span></div>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.3)',maxWidth:280,lineHeight:1.6}}>Platformă profesională de afiliere pentru bloggeri și influenceri din toată lumea.</div>
            </div>
            <div style={{display:'flex',gap:40,flexWrap:'wrap'}}>
              {[[t.f_about,t.f_news,t.f_contact],[t.f_terms,t.f_privacy,t.f_cookie]].map((col,i)=>(
                <div key={i} style={{display:'flex',flexDirection:'column',gap:10}}>
                  {col.map(l=><span key={l} style={{fontSize:13,color:'rgba(255,255,255,0.4)',cursor:'pointer',transition:'color .15s'}} onMouseOver={e=>e.target.style.color=gold} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.4)'}>{l}</span>)}
                </div>
              ))}
            </div>
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:20,textAlign:'center',fontSize:12,color:'rgba(255,255,255,0.2)'}}>{t.f_copy}</div>
        </div>
      </footer>
    </div>
  )
}
