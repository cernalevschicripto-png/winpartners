import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const gold = '#f5a623'
const dark = '#0a0a0f'

const T = {
  ro: {
    nav_login:'Conectați-vă', nav_reg:'Înregistrare',
    h1:'CONECTAȚI-VĂ ȘI', h2:'CÂȘTIGAȚI PENTRU', h3:'FIECARE CLIENT RECOMANDAT',
    hsub:'Program oficial de afiliere Melbet — câștigați 25% Revenue Share din pierderile jucătorilor recomandați, pe viață.',
    hbtn:'ÎNCEPEȚI ACUM', hbtn2:'Cum funcționează',
    trust1:'Plăți garantate', trust2:'SSL Securizat', trust3:'Suport 24/7', trust4:'Parteneri verificați',
    s1v:'25%', s1l:'Comision Revenue Share', s2v:'+3%', s2l:'Bonus referral bloggeri', s3v:'48h', s3l:'Procesare plăți', s4v:'$30', s4l:'Plată minimă/săptămână',
    hex1v:'6', hex1l:'Cazinouri partenere', hex2v:'10K+', hex2l:'Jucători activi', hex3v:'$2K+', hex3l:'Câștig mediu/lună',
    mgr_title:'MANAGERUL TĂU PERSONAL', mgr_name:'Manager WinPartners', mgr_role:'Parteneriat & Suport', mgr_text:'Îmi ocup personal de contul tău — de la primul cod până la prima plată. Scrie-mi direct pe Telegram.',mgr_btn:'Scrie pe Telegram',
    mgr_verify:'Verifică că vorbești cu managerul oficial',
    ben_title:'DE CE WINPARTNERS',
    b1t:'Comision 25% RevShare', b1d:'Primiți 25% din pierderile nete ale jucătorilor recomandați pe viață.',
    b2t:'Statistici zilnice', b2d:'Dashboard complet cu clickuri, înregistrări, depuneri și comisioane.',
    b3t:'Cod personalizat', b3d:'Cod unic cu numele dvs. Jucătorii îl introduc la înregistrare.',
    b4t:'Plăți săptămânale', b4d:'Bitcoin, Skrill, Neteller, Visa. Procesare în 48 ore.',
    b5t:'Referrali 3%', b5d:'Câștigați 3% din comisioanele bloggerilor pe care îi invitați.',
    b6t:'Manager dedicat', b6d:'Manager personal 24/7 pe WhatsApp și Telegram.',
    how_title:'CUM FUNCȚIONEAZĂ',
    hw1:'Aplici pentru acces', hw2:'Primești codul Melbet', hw3:'Promovezi pe rețele', hw4:'Primești bani',
    test_title:'DE CE BLOGGERII ALEG WINPARTNERS',
    t1n:'Acces direct', t1p:'La programele oficiale Melbet, 1xBet, Mostbet', t1t:'Nu mai trebuie să negociezi separat cu fiecare cazinou. WinPartners îți dă acces imediat la toate programele de afiliere, cu comisioanele cele mai bune negociate deja.',
    t2n:'Un singur dashboard', t2p:'Toate cazinouriile într-un loc', t2t:'Statistici unificate, un singur loc de retragere, un singur manager. Nu mai gestionezi 5 conturi separate la 5 cazinouri diferite.',
    t3n:'Transparență totală', t3p:'Fiecare jucător, fiecare comision', t3t:'Știi exact câți jucători ai adus, la ce cazinou, cât au depus și cât câștigi. Date live, actualizate zilnic direct din sistemele cazinourilor.',
    cas_title:'CAZINOURI PARTENERE',
    badge:'PROGRAM OFICIAL DE AFILIERE · MELBET · 1XBET · MOSTBET',
    cta_title:'DEVINO PARTENER OFICIAL', cta_sub:'Acces la Melbet, 1xBet, Mostbet și alte cazinouri de top — dintr-un singur loc.', cta_btn:'APLICĂ ACUM',
    f_copy:'© 2026 WinPartners. Toate drepturile rezervate.',
    f_lic:'✓ Licențiat', f_ssl:'🔒 SSL', f_rating:'⭐ 4.9/5',
  },
  ru: {
    nav_login:'Войти', nav_reg:'Регистрация',
    h1:'ПОДКЛЮЧАЙТЕСЬ И', h2:'ЗАРАБАТЫВАЙТЕ НА', h3:'КАЖДОМ ПРИВЛЕЧЕННОМ КЛИЕНТЕ',
    hsub:'Официальная партнёрская программа Melbet — зарабатывайте 25% Revenue Share от потерь рекомендованных игроков, пожизненно.',
    hbtn:'НАЧАТЬ СЕЙЧАС', hbtn2:'Как это работает',
    trust1:'Гарантированные выплаты', trust2:'SSL Защита', trust3:'Поддержка 24/7', trust4:'Проверенные партнеры',
    s1v:'25%', s1l:'Комиссия Revenue Share', s2v:'+3%', s2l:'Реферальный бонус', s3v:'48h', s3l:'Обработка выплат', s4v:'$30', s4l:'Мин. выплата/неделя',
    hex1v:'6', hex1l:'Казино-партнеров', hex2v:'10K+', hex2l:'Активных игроков', hex3v:'$2K+', hex3l:'Средний доход/мес',
    mgr_title:'ВАШ ЛИЧНЫЙ МЕНЕДЖЕР', mgr_name:'Менеджер WinPartners', mgr_role:'Партнёрство и поддержка', mgr_text:'Я лично веду ваш аккаунт — от первого кода до первой выплаты. Пишите мне напрямую в Telegram.',mgr_btn:'Написать в Telegram',
    mgr_verify:'Проверьте, что вы общаетесь с официальным менеджером',
    ben_title:'ПОЧЕМУ WINPARTNERS',
    b1t:'Комиссия 25% RevShare', b1d:'Получайте 25% от чистого дохода привлеченных игроков пожизненно.',
    b2t:'Ежедневная статистика', b2d:'Полный дашборд с кликами, регистрациями, депозитами и комиссиями.',
    b3t:'Персональный код', b3d:'Уникальный код с вашим именем. Игроки вводят его при регистрации.',
    b4t:'Еженедельные выплаты', b4d:'Bitcoin, Skrill, Neteller, Visa. Обработка в течение 48 часов.',
    b5t:'Рефералы 3%', b5d:'Зарабатывайте 3% от комиссий блогеров, которых вы пригласили.',
    b6t:'Личный менеджер', b6d:'Персональный менеджер 24/7 в WhatsApp и Telegram.',
    how_title:'КАК ЭТО РАБОТАЕТ',
    hw1:'Подаёшь заявку', hw2:'Получаешь код Melbet', hw3:'Продвигаешь в сетях', hw4:'Получаешь деньги',
    test_title:'ПОЧЕМУ БЛОГЕРЫ ВЫБИРАЮТ WINPARTNERS',
    t1n:'Прямой доступ', t1p:'К официальным программам Melbet, 1xBet, Mostbet', t1t:'Не нужно отдельно договариваться с каждым казино. WinPartners даёт мгновенный доступ ко всем партнёрским программам с лучшими комиссиями.',
    t2n:'Единый дашборд', t2p:'Все казино в одном месте', t2t:'Единая статистика, одно место для вывода, один менеджер. Не нужно управлять 5 отдельными аккаунтами в 5 разных казино.',
    t3n:'Полная прозрачность', t3p:'Каждый игрок, каждая комиссия', t3t:'Вы точно знаете, сколько игроков привели, в каком казино, сколько они внесли и сколько вы зарабатываете. Данные обновляются ежедневно.',
    cas_title:'КАЗИНО-ПАРТНЕРЫ',
    badge:'ОФИЦИАЛЬНАЯ ПАРТНЁРСКАЯ ПРОГРАММА · MELBET · 1XBET · MOSTBET',
    cta_title:'СТАТЬ ОФИЦИАЛЬНЫМ ПАРТНЁРОМ', cta_sub:'Доступ к Melbet, 1xBet, Mostbet и другим топ-казино — из одного места.', cta_btn:'ПОДАТЬ ЗАЯВКУ',
    f_copy:'© 2026 WinPartners. Все права защищены.',
    f_lic:'✓ Лицензировано', f_ssl:'🔒 SSL', f_rating:'⭐ 4.9/5',
  },
  en: {
    nav_login:'Login', nav_reg:'Register',
    h1:'CONNECT AND', h2:'EARN FOR EVERY', h3:'CLIENT YOU RECOMMEND',
    hsub:'Official Melbet affiliate program — earn 25% Revenue Share from referred players\' losses, for life.',
    hbtn:'GET STARTED', hbtn2:'How it works',
    trust1:'Guaranteed payments', trust2:'SSL Secured', trust3:'24/7 Support', trust4:'Verified partners',
    s1v:'25%', s1l:'Revenue Share commission', s2v:'+3%', s2l:'Blogger referral bonus', s3v:'48h', s3l:'Payment processing', s4v:'$30', s4l:'Min. payout/week',
    hex1v:'6', hex1l:'Casino partners', hex2v:'10K+', hex2l:'Active players', hex3v:'$2K+', hex3l:'Avg monthly income',
    mgr_title:'YOUR PERSONAL MANAGER', mgr_name:'WinPartners Manager', mgr_role:'Partnership & Support', mgr_text:'I personally manage your account — from your first code to your first payment. Message me directly on Telegram.',mgr_btn:'Message on Telegram',
    mgr_verify:'Verify you are speaking with the official manager',
    ben_title:'WHY WINPARTNERS',
    b1t:'25% RevShare Commission', b1d:'Receive 25% of net revenue from referred players for life.',
    b2t:'Daily statistics', b2d:'Full dashboard with clicks, registrations, deposits and commissions.',
    b3t:'Personalized code', b3d:'Unique code with your name. Players enter it at registration.',
    b4t:'Weekly payments', b4d:'Bitcoin, Skrill, Neteller, Visa. Processing within 48 hours.',
    b5t:'Referrals 3%', b5d:'Earn 3% from commissions of bloggers you invite.',
    b6t:'Dedicated manager', b6d:'Personal manager 24/7 on WhatsApp and Telegram.',
    how_title:'HOW IT WORKS',
    hw1:'Apply for access', hw2:'Get your Melbet code', hw3:'Promote on social media', hw4:'Get paid',
    test_title:'WHY BLOGGERS CHOOSE WINPARTNERS',
    t1n:'Direct access', t1p:'To official Melbet, 1xBet, Mostbet programs', t1t:'No need to negotiate separately with each casino. WinPartners gives you instant access to all affiliate programs with the best commissions already negotiated.',
    t2n:'Single dashboard', t2p:'All casinos in one place', t2t:'Unified statistics, one withdrawal point, one manager. No more managing 5 separate accounts at 5 different casinos.',
    t3n:'Full transparency', t3p:'Every player, every commission', t3t:'You know exactly how many players you brought, to which casino, how much they deposited and how much you earn. Data updated daily.',
    cas_title:'CASINO PARTNERS',
    badge:'OFFICIAL AFFILIATE PROGRAM · MELBET · 1XBET · MOSTBET',
    cta_title:'BECOME AN OFFICIAL PARTNER', cta_sub:'Access Melbet, 1xBet, Mostbet and other top casinos — from one place.', cta_btn:'APPLY NOW',
    f_copy:'© 2026 WinPartners. All rights reserved.',
    f_lic:'✓ Licensed', f_ssl:'🔒 SSL', f_rating:'⭐ 4.9/5',
  }
}

const Avatar = ({letter, color}) => (
  <div style={{width:48,height:48,borderRadius:'50%',background:color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontWeight:800,color:'#fff',flexShrink:0}}>{letter}</div>
)

const StarRating = () => (
  <div style={{display:'flex',gap:2,marginBottom:8}}>
    {[...Array(5)].map((_,i)=><span key={i} style={{color:gold,fontSize:14}}>★</span>)}
  </div>
)

// ── Calculator câștig ──────────────────────────────────────
function CalcSection({ isMobile, lang, navigate, gold }) {
  const [followers, setFollowers] = useState(10000)
  const [postsPerWeek, setPostsPerWeek] = useState(3)

  // Formula: urmăritori × 0.003% conversie × 0.4 depun × pierd $120/lună × 25% comision
  const players     = Math.round(followers * postsPerWeek * 0.0003)
  const depositors  = Math.round(players * 0.4)
  const monthlyRev  = Math.round(depositors * 120 * 0.25)
  const yearlyRev   = monthlyRev * 12

  const labels = {
    ro: { title:'CALCULEAZĂ CÂȘTIGUL TĂU', sub:'Introdu datele tale și vezi cât poți câștiga lunar',
          fol:'Număr urmăritori', posts:'Postări/săptămână cu Melbet',
          play:'Jucători estimați/lună', dep:'Depunători activi',
          earn:'Câștig lunar estimat', year:'Câștig anual',
          cta:'Aplică acum și începe să câștigi', note:'Estimare bazată pe conversie medie industrie. Rezultatele reale pot varia.' },
    ru: { title:'РАССЧИТАЙ СВОЙ ЗАРАБОТОК', sub:'Введи данные и узнай сколько можешь зарабатывать',
          fol:'Количество подписчиков', posts:'Постов/неделю о Melbet',
          play:'Игроков в месяц', dep:'Активных вкладчиков',
          earn:'Доход в месяц', year:'Доход в год',
          cta:'Подать заявку и начать зарабатывать', note:'Оценка на основе средней конверсии по отрасли.' },
    en: { title:'CALCULATE YOUR EARNINGS', sub:'Enter your data and see how much you can earn monthly',
          fol:'Number of followers', posts:'Posts/week about Melbet',
          play:'Estimated players/month', dep:'Active depositors',
          earn:'Estimated monthly earnings', year:'Yearly earnings',
          cta:'Apply now and start earning', note:'Estimate based on industry average conversion. Actual results may vary.' },
  }
  const L = labels[lang] || labels.ro

  const fmt = (n) => n >= 1000 ? (n/1000).toFixed(1).replace('.0','') + 'K' : n

  return (
    <div style={{background:'rgba(0,0,0,0.5)',padding:isMobile?'3rem 1.25rem':'5rem 2rem',borderTop:`1px solid rgba(245,166,35,0.08)`}}>
      <div style={{maxWidth:780,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
          <h2 style={{fontSize:'clamp(1.4rem,3vw,2.2rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:8}}>{L.title}</h2>
          <div style={{width:60,height:3,background:gold,margin:'0 auto 12px',borderRadius:2}}/>
          <p style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>{L.sub}</p>
        </div>

        {/* Sliders */}
        <div style={{background:'rgba(245,166,35,0.04)',border:`1px solid rgba(245,166,35,0.15)`,borderRadius:20,padding:isMobile?'1.5rem':'2.5rem',marginBottom:24}}>
          {/* Slider urmăritori */}
          <div style={{marginBottom:28}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
              <span style={{fontSize:13,color:'rgba(255,255,255,0.6)',fontWeight:600}}>{L.fol}</span>
              <span style={{fontSize:18,fontWeight:900,color:gold}}>{fmt(followers)}</span>
            </div>
            <input type="range" min="1000" max="500000" step="1000" value={followers}
              onChange={e=>setFollowers(Number(e.target.value))}
              style={{width:'100%',accentColor:gold,cursor:'pointer',height:4}}
            />
            <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
              <span style={{fontSize:11,color:'rgba(255,255,255,0.25)'}}>1K</span>
              <span style={{fontSize:11,color:'rgba(255,255,255,0.25)'}}>500K</span>
            </div>
          </div>
          {/* Slider postări */}
          <div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
              <span style={{fontSize:13,color:'rgba(255,255,255,0.6)',fontWeight:600}}>{L.posts}</span>
              <span style={{fontSize:18,fontWeight:900,color:gold}}>{postsPerWeek}</span>
            </div>
            <input type="range" min="1" max="7" step="1" value={postsPerWeek}
              onChange={e=>setPostsPerWeek(Number(e.target.value))}
              style={{width:'100%',accentColor:gold,cursor:'pointer',height:4}}
            />
            <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
              <span style={{fontSize:11,color:'rgba(255,255,255,0.25)'}}>1</span>
              <span style={{fontSize:11,color:'rgba(255,255,255,0.25)'}}>7</span>
            </div>
          </div>
        </div>

        {/* Rezultate */}
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(4,1fr)',gap:12,marginBottom:24}}>
          {[
            [L.play, fmt(players), 'rgba(255,255,255,0.6)'],
            [L.dep, fmt(depositors), '#3b82f6'],
            [L.earn, '$'+monthlyRev, gold],
            [L.year, '$'+yearlyRev, '#10b981'],
          ].map(([label, val, color]) => (
            <div key={label} style={{background:'rgba(255,255,255,0.03)',border:`1px solid ${color}33`,borderRadius:12,padding:'1rem',textAlign:'center'}}>
              <div style={{fontSize:isMobile?20:26,fontWeight:900,color,lineHeight:1,marginBottom:4}}>{val}</div>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'.06em'}}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{textAlign:'center'}}>
          <button onClick={()=>navigate('/register')} style={{padding:isMobile?'13px 32px':'16px 48px',fontSize:15,fontWeight:800,cursor:'pointer',border:`2px solid ${gold}`,borderRadius:8,background:gold,color:'#000',textTransform:'uppercase',letterSpacing:'.05em',boxShadow:`0 8px 32px rgba(245,166,35,0.3)`,marginBottom:12}}>
            {L.cta}
          </button>
          <div style={{fontSize:11,color:'rgba(255,255,255,0.2)'}}>{L.note}</div>
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  const [lang, setLang] = useState('ro')
  const navigate = useNavigate()
  const t = T[lang]
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const benefits = [
    ['💰',t.b1t,t.b1d],['📊',t.b2t,t.b2d],['🎯',t.b3t,t.b3d],
    ['⚡',t.b4t,t.b4d],['👥',t.b5t,t.b5d],['💬',t.b6t,t.b6d]
  ]

  const casinos = [
    {name:'Melbet',color:'#f5a623',icon:'M'},
    {name:'1xBet',color:'#0066cc',icon:'1'},
    {name:'Mostbet',color:'#e63946',icon:'M'},
    {name:'Pin-Up',color:'#ff6b9d',icon:'P'},
    {name:'Betway',color:'#00a651',icon:'B'},
    {name:'22Bet',color:'#ff4500',icon:'2'},
  ]

  return (
    <div style={{background:dark,minHeight:'100vh',color:'#fff',fontFamily:"'Inter',sans-serif",overflowX:'hidden'}}>

      {/* NAV */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,background:'rgba(10,10,15,0.98)',borderBottom:'1px solid rgba(245,166,35,0.15)',padding:'0 1.25rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:64,backdropFilter:'blur(10px)'}}>
        {/* LOGO */}
        <div onClick={()=>navigate('/')} style={{cursor:'pointer',display:'flex',alignItems:'center',gap:8}}>
          <img src="/icons/logo.png" width="32" height="32" alt="WinPartners" style={{borderRadius:4}}/>
          <span style={{fontSize:18,fontWeight:900,letterSpacing:'.02em'}}><span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span></span>
        </div>

        {/* Desktop nav links */}
        {!isMobile && (
          <div style={{display:'flex',gap:20}}>
            {[
              ['about', lang==='ru'?'О нас':lang==='en'?'About':'Despre noi'],
              ['benefits', lang==='ru'?'Преимущества':lang==='en'?'Benefits':'Beneficii'],
              ['instructions', lang==='ru'?'Инструкции':lang==='en'?'How it works':'Instrucțiuni'],
              ['faq','FAQ'],
              ['contact', lang==='ru'?'Контакты':lang==='en'?'Contact':'Contact']
            ].map(([path,label])=>(
              <span key={path} onClick={()=>navigate('/'+path)} style={{fontSize:13,color:'rgba(255,255,255,0.55)',cursor:'pointer',fontWeight:500}} onMouseOver={e=>e.target.style.color=gold} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.55)'}>{label}</span>
            ))}
          </div>
        )}

        {/* Right side */}
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          {/* Lang switcher */}
          {['ro','ru','en'].map(l=>(
            <button key={l} onClick={()=>setLang(l)} style={{padding:'3px 7px',fontSize:11,fontWeight:700,cursor:'pointer',border:`1px solid ${lang===l?gold:'rgba(255,255,255,0.15)'}`,borderRadius:4,background:lang===l?'rgba(245,166,35,0.15)':'none',color:lang===l?gold:'rgba(255,255,255,0.4)'}}>{l.toUpperCase()}</button>
          ))}
          {!isMobile && <>
            <button onClick={()=>navigate('/dashboard')} style={{marginLeft:4,padding:'7px 16px',fontSize:13,fontWeight:600,cursor:'pointer',border:'1px solid rgba(255,255,255,0.15)',borderRadius:4,background:'none',color:'#e2e8f0'}}>{t.nav_login}</button>
            <button onClick={()=>navigate('/register')} style={{padding:'7px 16px',fontSize:13,fontWeight:800,cursor:'pointer',border:'none',borderRadius:4,background:gold,color:'#000',textTransform:'uppercase',letterSpacing:'.03em'}}>{t.nav_reg}</button>
          </>}
          {/* Hamburger */}
          {isMobile && (
            <button onClick={()=>setMenuOpen(o=>!o)} style={{background:'none',border:'none',cursor:'pointer',padding:8,color:'#fff',display:'flex',flexDirection:'column',gap:5}}>
              <span style={{display:'block',width:22,height:2,background:menuOpen?gold:'#fff',transition:'all .2s',transform:menuOpen?'rotate(45deg) translate(5px,5px)':'none'}}/>
              <span style={{display:'block',width:22,height:2,background:'#fff',opacity:menuOpen?0:1,transition:'all .2s'}}/>
              <span style={{display:'block',width:22,height:2,background:menuOpen?gold:'#fff',transition:'all .2s',transform:menuOpen?'rotate(-45deg) translate(5px,-5px)':'none'}}/>
            </button>
          )}
        </div>

        {/* Mobile dropdown menu */}
        {isMobile && menuOpen && (
          <div style={{position:'absolute',top:64,left:0,right:0,background:'rgba(10,10,15,0.98)',borderBottom:'1px solid rgba(245,166,35,0.15)',padding:'1rem',display:'flex',flexDirection:'column',gap:12,zIndex:200}}>
            {[
              ['about', lang==='ru'?'О нас':lang==='en'?'About':'Despre noi'],
              ['benefits', lang==='ru'?'Преимущества':lang==='en'?'Benefits':'Beneficii'],
              ['instructions', lang==='ru'?'Инструкции':lang==='en'?'How it works':'Instrucțiuni'],
              ['faq','FAQ'],
              ['contact', lang==='ru'?'Контакты':lang==='en'?'Contact':'Contact']
            ].map(([path,label])=>(
              <span key={path} onClick={()=>{navigate('/'+path);setMenuOpen(false)}} style={{fontSize:15,color:'rgba(255,255,255,0.8)',cursor:'pointer',fontWeight:500,padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>{label}</span>
            ))}
            <div style={{display:'flex',gap:8,marginTop:4}}>
              <button onClick={()=>{navigate('/dashboard');setMenuOpen(false)}} style={{flex:1,padding:'10px',fontSize:13,fontWeight:600,cursor:'pointer',border:'1px solid rgba(255,255,255,0.15)',borderRadius:6,background:'none',color:'#e2e8f0'}}>{t.nav_login}</button>
              <button onClick={()=>{navigate('/register');setMenuOpen(false)}} style={{flex:1,padding:'10px',fontSize:13,fontWeight:800,cursor:'pointer',border:'none',borderRadius:6,background:gold,color:'#000',textTransform:'uppercase'}}>{t.nav_reg}</button>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',position:'relative',overflow:'hidden',paddingTop:64}}>
        {/* Animated hex bg */}
        <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}} preserveAspectRatio="xMidYMid slice">
          {[...Array(6)].map((_,i)=>[...Array(5)].map((_,j)=>{
            const x=i*170+(j%2)*85, y=j*148-40
            return <polygon key={`${i}-${j}`} points={`${x+80},${y} ${x+155},${y+42} ${x+155},${y+126} ${x+80},${y+168} ${x+5},${y+126} ${x+5},${y+42}`} fill="none" stroke={gold} strokeWidth="0.4" opacity="0.12"/>
          }))}
        </svg>
        <div style={{position:'absolute',right:'-5%',top:'10%',width:'55%',height:'80%',background:`radial-gradient(ellipse at center, rgba(245,166,35,0.1) 0%, transparent 65%)`,pointerEvents:'none'}}/>
        
        <div style={{position:'relative',zIndex:1,padding:isMobile?'0 1.25rem':'0 4rem',maxWidth:680}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(245,166,35,0.1)',border:`1px solid rgba(245,166,35,0.25)`,borderRadius:20,padding:'6px 16px',marginBottom:24}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'#10b981',display:'inline-block'}}/>
            <span style={{fontSize:12,color:gold,fontWeight:600,letterSpacing:'.05em'}}>{t.badge}</span>
          </div>
          <div style={{fontSize:'clamp(2.2rem,4vw,4rem)',fontWeight:900,lineHeight:1.05,letterSpacing:'-0.01em',textTransform:'uppercase',marginBottom:20}}>
            <div style={{color:'#fff'}}>{t.h1}</div>
            <div style={{color:'#fff'}}>{t.h2}</div>
            <div style={{color:gold,textShadow:`0 0 40px rgba(245,166,35,0.3)`}}>{t.h3}</div>
          </div>
          <p style={{fontSize:16,color:'rgba(255,255,255,0.6)',lineHeight:1.7,maxWidth:500,marginBottom:36}}>{t.hsub}</p>
          <div style={{display:'flex',gap:12,marginBottom:48,flexWrap:'wrap'}}>
            <button onClick={()=>navigate('/register')} style={{padding:'14px 36px',fontSize:15,fontWeight:800,cursor:'pointer',border:`2px solid ${gold}`,borderRadius:6,background:gold,color:'#000',textTransform:'uppercase',letterSpacing:'.05em',boxShadow:`0 8px 32px rgba(245,166,35,0.3)`}}>{t.hbtn}</button>
            <button onClick={()=>navigate('/instructions')} style={{padding:'14px 28px',fontSize:14,fontWeight:600,cursor:'pointer',border:'1px solid rgba(255,255,255,0.2)',borderRadius:6,background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.7)'}}>{t.hbtn2}</button>
          </div>
          {/* Trust badges */}
          <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
            {[['🔒',t.trust2],['💳',t.trust1],['💬',t.trust3],['👥',t.trust4]].map(([icon,label])=>(
              <div key={label} style={{display:'flex',alignItems:'center',gap:6}}>
                <span style={{fontSize:14}}>{icon}</span>
                <span style={{fontSize:12,color:'rgba(255,255,255,0.4)',fontWeight:500}}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{background:'rgba(0,0,0,0.5)',borderTop:`1px solid rgba(245,166,35,0.12)`,borderBottom:`1px solid rgba(245,166,35,0.12)`,padding:'2rem 1rem'}}>
        <div style={{maxWidth:1000,margin:'0 auto',display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:0}}>
          {[[t.s1v,t.s1l,'#f5a623'],[t.s2v,t.s2l,'#10b981'],[t.s3v,t.s3l,'rgba(255,255,255,0.7)'],[t.s4v,t.s4l,'#a78bfa']].map(([v,l,c],i)=>(
            <div key={l} style={{textAlign:'center',padding:'1rem 0.5rem',borderLeft:(!isMobile&&i>0)||( isMobile&&i%2===1)?`1px solid rgba(245,166,35,0.1)`:'none',borderTop:isMobile&&i>=2?`1px solid rgba(245,166,35,0.1)`:'none'}}>
              <div style={{fontSize:isMobile?22:38,fontWeight:900,color:c,lineHeight:1,marginBottom:6}}>{v}</div>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'.08em'}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HEXAGON STATS */}
      <div style={{background:'linear-gradient(180deg,rgba(0,0,0,0.7) 0%,rgba(10,10,15,0.9) 100%)',padding:isMobile?'1.5rem 0.25rem':'4.5rem 2rem',borderBottom:`1px solid rgba(245,166,35,0.08)`}}>
        <div style={{maxWidth:860,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:isMobile?4:0}}>
          {[[t.hex1v,t.hex1l,gold],[t.hex2v,t.hex2l,'#10b981'],[t.hex3v,t.hex3l,'#a78bfa']].map(([v,l,c],idx)=>(
            <div key={l} style={{textAlign:'center',position:'relative',padding:'0 2px'}}>
              <div style={{position:'relative',width:isMobile?'100%':200,height:isMobile?'auto':180,margin:'0 auto'}}>
                <svg viewBox="0 0 200 180" style={{width:'100%',height:'100%'}}>
                  <defs>
                    <linearGradient id={`hgrad${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={c} stopOpacity="0.3"/>
                      <stop offset="100%" stopColor={c} stopOpacity="0.05"/>
                    </linearGradient>
                    <filter id={`glow${idx}`}>
                      <feGaussianBlur stdDeviation="3" result="blur"/>
                      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                  </defs>
                  <polygon points="100,8 188,54 188,126 100,172 12,126 12,54" fill={`url(#hgrad${idx})`} stroke={c} strokeWidth="1.5"/>
                  <polygon points="100,22 174,63 174,117 100,158 26,117 26,63" fill="none" stroke={c} strokeWidth="0.5" opacity="0.4"/>
                </svg>
                <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-52%)',textAlign:'center',pointerEvents:'none'}}>
                  <div style={{fontSize:isMobile?16:38,fontWeight:900,color:c,lineHeight:1,textShadow:`0 0 20px ${c}88`}}>{v}</div>
                  <div style={{fontSize:10,color:'rgba(255,255,255,0.55)',marginTop:5,textTransform:'uppercase',letterSpacing:'.1em',fontWeight:700,maxWidth:90,margin:'5px auto 0'}}>{l}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BENEFITS */}
      <div style={{maxWidth:1200,margin:'0 auto',padding:'5rem 2rem'}}>
        <div style={{textAlign:'center',marginBottom:'3rem'}}>
          <h2 style={{fontSize:'clamp(1.6rem,3vw,2.4rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.08em'}}>{t.ben_title}</h2>
          <div style={{width:60,height:3,background:gold,margin:'12px auto 0',borderRadius:2}}/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:20}}>
          {benefits.map(([icon,title,desc])=>(
            <div key={title} style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(245,166,35,0.1)',borderRadius:12,padding:'1.5rem',display:'flex',gap:16,transition:'border-color .2s',cursor:'default'}} onMouseOver={e=>e.currentTarget.style.borderColor='rgba(245,166,35,0.35)'} onMouseOut={e=>e.currentTarget.style.borderColor='rgba(245,166,35,0.1)'}>
              <div style={{width:50,height:50,background:'rgba(245,166,35,0.1)',border:`1px solid rgba(245,166,35,0.2)`,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{icon}</div>
              <div>
                <div style={{fontSize:15,fontWeight:700,color:'#fff',marginBottom:6}}>{title}</div>
                <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.6}}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MANAGER PERSONAL */}
      <div style={{background:'rgba(0,0,0,0.5)',padding:isMobile?'3rem 1.25rem':'5rem 2rem',borderTop:`1px solid rgba(245,166,35,0.08)`,borderBottom:`1px solid rgba(245,166,35,0.08)`}}>
        <div style={{maxWidth:800,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
            <h2 style={{fontSize:'clamp(1.4rem,3vw,2.2rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.08em'}}>{t.mgr_title}</h2>
            <div style={{width:60,height:3,background:gold,margin:'12px auto 0',borderRadius:2}}/>
          </div>
          <div style={{background:'rgba(245,166,35,0.05)',border:`1px solid rgba(245,166,35,0.2)`,borderRadius:20,padding:isMobile?'1.5rem':'2.5rem',display:'flex',gap:isMobile?16:32,alignItems:'center',flexDirection:isMobile?'column':'row'}}>
            {/* Avatar */}
            <div style={{flexShrink:0,textAlign:'center'}}>
              <div style={{width:isMobile?88:108,height:isMobile?88:108,borderRadius:'50%',background:'linear-gradient(135deg,#1a1a2e,#0f0f1a)',border:`3px solid ${gold}`,overflow:'hidden',margin:isMobile?'0 auto':'0',flexShrink:0}}>
                <svg viewBox="0 0 108 108" style={{width:'100%',height:'100%'}}>
                  <rect width="108" height="108" fill="url(#avatarBg)"/>
                  <defs>
                    <radialGradient id="avatarBg" cx="50%" cy="40%" r="60%">
                      <stop offset="0%" stopColor="#1e1e35"/>
                      <stop offset="100%" stopColor="#0a0a15"/>
                    </radialGradient>
                  </defs>
                  {/* Body */}
                  <ellipse cx="54" cy="95" rx="30" ry="20" fill="rgba(245,166,35,0.15)"/>
                  <ellipse cx="54" cy="92" rx="22" ry="16" fill="#f5a623" opacity="0.9"/>
                  {/* Head */}
                  <circle cx="54" cy="42" r="20" fill="#f5a623" opacity="0.95"/>
                  {/* Face shading */}
                  <circle cx="54" cy="44" r="18" fill="rgba(0,0,0,0.08)"/>
                  {/* Eyes */}
                  <circle cx="47" cy="40" r="3" fill="#1a1000"/>
                  <circle cx="61" cy="40" r="3" fill="#1a1000"/>
                  <circle cx="48" cy="39" r="1" fill="rgba(255,255,255,0.5)"/>
                  <circle cx="62" cy="39" r="1" fill="rgba(255,255,255,0.5)"/>
                  {/* Smile */}
                  <path d="M46,48 Q54,55 62,48" stroke="#1a1000" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  {/* Suit collar */}
                  <path d="M38,88 L50,72 L54,78 L58,72 L70,88" fill="#0d0d20" opacity="0.9"/>
                  <path d="M50,72 L54,82 L58,72" fill={gold} opacity="0.6"/>
                  {/* Win badge */}
                  <circle cx="82" cy="26" r="12" fill={gold}/>
                  <text x="82" y="31" textAnchor="middle" fontSize="9" fontWeight="900" fill="#000">W</text>
                </svg>
              </div>
              <div style={{marginTop:10,display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:'#10b981',boxShadow:'0 0 8px #10b981'}}/>
                <span style={{fontSize:11,color:'#10b981',fontWeight:700}}>Online acum</span>
              </div>
            </div>
            {/* Content */}
            <div style={{flex:1}}>
              <div style={{fontSize:isMobile?17:20,fontWeight:900,color:'#fff',marginBottom:3}}>{t.mgr_name}</div>
              <div style={{fontSize:13,color:gold,fontWeight:600,marginBottom:14,letterSpacing:'.05em'}}>{t.mgr_role}</div>
              <p style={{fontSize:14,color:'rgba(255,255,255,0.65)',lineHeight:1.75,marginBottom:20}}>{t.mgr_text}</p>
              <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                <a href="https://t.me/winpartners_support" target="_blank" rel="noreferrer" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'11px 22px',background:gold,color:'#000',border:'none',borderRadius:8,fontSize:14,fontWeight:700,cursor:'pointer',textDecoration:'none'}}>
                  <span>✈️</span> {t.mgr_btn}
                </a>
                <div style={{display:'flex',alignItems:'center',gap:6,padding:'11px 16px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8}}>
                  <span style={{fontSize:12}}>🔒</span>
                  <span style={{fontSize:12,color:'rgba(255,255,255,0.5)'}}>{t.mgr_verify}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{background:'rgba(0,0,0,0.3)',padding:'5rem 2rem',borderTop:`1px solid rgba(245,166,35,0.08)`}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <h2 style={{fontSize:'clamp(1.6rem,3vw,2.4rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.08em'}}>{t.how_title}</h2>
            <div style={{width:60,height:3,background:gold,margin:'12px auto 0',borderRadius:2}}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:0,position:'relative'}}>
            <div style={{position:'absolute',top:28,left:'12.5%',right:'12.5%',height:2,background:`linear-gradient(90deg,${gold},rgba(245,166,35,0.3))`,zIndex:0}}/>
            {[[t.hw1,'01'],[t.hw2,'02'],[t.hw3,'03'],[t.hw4,'04']].map(([title,num])=>(
              <div key={num} style={{textAlign:'center',padding:'1.5rem',position:'relative',zIndex:1}}>
                <div style={{width:56,height:56,borderRadius:'50%',background:dark,border:`2px solid ${gold}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:900,color:gold,margin:'0 auto 16px',boxShadow:`0 0 20px rgba(245,166,35,0.2)`}}>{num}</div>
                <div style={{fontSize:14,fontWeight:700,color:'#fff'}}>{title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CASINO PARTNERS */}
      <div style={{maxWidth:1100,margin:'0 auto',padding:'5rem 2rem'}}>
        <div style={{textAlign:'center',marginBottom:'3rem'}}>
          <h2 style={{fontSize:'clamp(1.6rem,3vw,2.4rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.08em'}}>{t.cas_title}</h2>
          <div style={{width:60,height:3,background:gold,margin:'12px auto 0',borderRadius:2}}/>
        </div>
        <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
          {casinos.map(c=>(
            <div key={c.name} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'1rem 1.5rem',display:'flex',alignItems:'center',gap:10,minWidth:140,transition:'border-color .2s'}} onMouseOver={e=>e.currentTarget.style.borderColor=`rgba(245,166,35,0.3)`} onMouseOut={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}>
              <div style={{width:36,height:36,borderRadius:8,background:c.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:900,color:'#fff'}}>{c.icon}</div>
              <span style={{fontSize:16,fontWeight:700,color:'#fff'}}>{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{background:'rgba(0,0,0,0.4)',padding:'5rem 2rem',borderTop:`1px solid rgba(245,166,35,0.08)`}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <h2 style={{fontSize:'clamp(1.6rem,3vw,2.4rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.08em'}}>{t.test_title}</h2>
            <div style={{width:60,height:3,background:gold,margin:'12px auto 0',borderRadius:2}}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20}}>
            {[
              [t.t1n, t.t1p, t.t1t, '🔗'],
              [t.t2n, t.t2p, t.t2t, '📊'],
              [t.t3n, t.t3p, t.t3t, '✅'],
            ].map(([name, platform, text, icon])=>(
              <div key={name} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(245,166,35,0.12)',borderRadius:14,padding:'1.75rem'}}>
                <div style={{fontSize:32,marginBottom:14}}>{icon}</div>
                <div style={{fontSize:16,fontWeight:800,color:'#fff',marginBottom:6}}>{name}</div>
                <div style={{fontSize:12,color:gold,fontWeight:600,marginBottom:14,textTransform:'uppercase',letterSpacing:'.06em'}}>{platform}</div>
                <p style={{fontSize:13,color:'rgba(255,255,255,0.6)',lineHeight:1.8,margin:0}}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CALCULATOR CÂȘTIG */}
      <CalcSection isMobile={isMobile} lang={lang} navigate={navigate} gold={gold} />

      {/* CTA */}
      <div style={{padding:'5rem 2rem',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse 70% 80% at 50% 50%, rgba(245,166,35,0.08) 0%, transparent 70%)`,pointerEvents:'none'}}/>
        <div style={{position:'relative',zIndex:1}}>
          <h2 style={{fontSize:'clamp(2rem,4vw,3rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.03em',marginBottom:12}}>{t.cta_title}</h2>
          <p style={{fontSize:16,color:'rgba(255,255,255,0.5)',marginBottom:36}}>{t.cta_sub}</p>
          <button onClick={()=>navigate('/register')} style={{padding:'18px 56px',fontSize:16,fontWeight:800,cursor:'pointer',border:`2px solid ${gold}`,borderRadius:6,background:gold,color:'#000',textTransform:'uppercase',letterSpacing:'.05em',boxShadow:`0 8px 40px rgba(245,166,35,0.3)`}}>{t.cta_btn}</button>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{background:'#050508',borderTop:`1px solid rgba(245,166,35,0.1)`,padding:isMobile?'2rem 1.25rem 1.5rem':'3rem 3rem 2rem'}}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'1fr auto auto auto',gap:isMobile?20:48,marginBottom:24}}>
            <div style={{gridColumn:isMobile?'1 / -1':'auto'}}>
              <div style={{fontSize:20,fontWeight:900,marginBottom:12}}><span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span></div>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.3)',lineHeight:1.7,maxWidth:260}}>{lang==='ru'?'Профессиональная партнёрская платформа для блогеров и инфлюенсеров.':lang==='en'?'Professional affiliate platform for bloggers and influencers worldwide.':'Platformă profesională de afiliere pentru bloggeri și influenceri.'}</div>
              <div style={{display:'flex',gap:8,marginTop:16,flexWrap:'wrap'}}>
                {[t.f_ssl, t.f_lic, t.f_rating].map(b=><span key={b} style={{fontSize:11,color:'rgba(255,255,255,0.35)',background:'rgba(255,255,255,0.05)',padding:'3px 8px',borderRadius:4}}>{b}</span>)}
              </div>
            </div>
            {[
              [lang==='ru'?'Программа':lang==='en'?'Program':'Program',
                ['about',lang==='ru'?'О нас':lang==='en'?'About':'Despre noi'],
                ['benefits',lang==='ru'?'Преимущества':lang==='en'?'Benefits':'Beneficii'],
                ['instructions',lang==='ru'?'Инструкции':lang==='en'?'How it works':'Instrucțiuni'],
                ['faq','FAQ']],
              [lang==='ru'?'Компания':lang==='en'?'Company':'Companie',
                ['about',lang==='ru'?'О нас':lang==='en'?'About':'Despre noi'],
                ['contact',lang==='ru'?'Контакты':lang==='en'?'Contact':'Contact'],
                ['terms',lang==='ru'?'Условия':lang==='en'?'Terms':'Termeni'],
                ['terms',lang==='ru'?'Конфиденциальность':lang==='en'?'Privacy':'Confidențialitate']],
              ['Contact',
                ['','support@winpartners.partners'],
                ['','Telegram: @winpartners_support'],
                ['',lang==='ru'?'WhatsApp доступен':lang==='en'?'WhatsApp available':'WhatsApp disponibil'],
                ['','24/7']],
            ].map(([title,...links])=>(
              <div key={title}>
                <div style={{fontSize:12,fontWeight:700,color:gold,textTransform:'uppercase',letterSpacing:'.1em',marginBottom:12}}>{title}</div>
                {links.map(([path,label])=>(
                  <div key={label} onClick={path?()=>navigate('/'+path):undefined} style={{fontSize:13,color:'rgba(255,255,255,0.4)',marginBottom:8,cursor:path?'pointer':'default',transition:'color .15s'}} onMouseOver={e=>path&&(e.target.style.color=gold)} onMouseOut={e=>path&&(e.target.style.color='rgba(255,255,255,0.4)')}>{label}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:20,textAlign:'center',fontSize:12,color:'rgba(255,255,255,0.2)'}}>{t.f_copy}</div>
        </div>
      </footer>
    </div>
  )
}
