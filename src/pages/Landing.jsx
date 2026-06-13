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
    s1v:'25%', s1l:'Comision Revenue Share', s2v:'48h', s2l:'Procesare plăți', s3v:'24/7', s3l:'Suport dedicat',
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
    cta_title:'DEVINO PARTENER OFICIAL', cta_sub:'Acces la Melbet, 1xBet, Mostbet și alte cazinouri de top — dintr-un singur loc.', cta_btn:'APLICĂ ACUM',
    f_copy:'© 2026 WinPartners. Toate drepturile rezervate.',
  },
  ru: {
    nav_login:'Войти', nav_reg:'Регистрация',
    h1:'ПОДКЛЮЧАЙТЕСЬ И', h2:'ЗАРАБАТЫВАЙТЕ НА', h3:'КАЖДОМ ПРИВЛЕЧЕННОМ КЛИЕНТЕ',
    hsub:'Официальная партнёрская программа Melbet — зарабатывайте 25% Revenue Share от потерь рекомендованных игроков, пожизненно.',
    hbtn:'НАЧАТЬ СЕЙЧАС', hbtn2:'Как это работает',
    trust1:'Гарантированные выплаты', trust2:'SSL Защита', trust3:'Поддержка 24/7', trust4:'Проверенные партнеры',
    s1v:'25%', s1l:'Комиссия Revenue Share', s2v:'48h', s2l:'Обработка выплат', s3v:'24/7', s3l:'Личный менеджер',
    ben_title:'ПОЧЕМУ WINPARTNERS',
    b1t:'Комиссия 20% RevShare', b1d:'Получайте 20% от чистого дохода привлеченных игроков пожизненно.',
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
    cta_title:'ГОТОВЫ ЗАРАБАТЫВАТЬ?', cta_sub:'Присоединяйтесь к тысячам партнеров, которые зарабатывают ежедневно.', cta_btn:'БЕСПЛАТНАЯ РЕГИСТРАЦИЯ',
    f_copy:'© 2026 WinPartners. Все права защищены.',
  },
  en: {
    nav_login:'Login', nav_reg:'Register',
    h1:'CONNECT AND', h2:'EARN FOR EVERY', h3:'CLIENT YOU RECOMMEND',
    hsub:'Unique program allowing you to earn up to 20% from clients with a lifetime revenue share.',
    hbtn:'GET STARTED', hbtn2:'How it works',
    trust1:'Guaranteed payments', trust2:'SSL Secured', trust3:'24/7 Support', trust4:'Verified partners',
    s1v:'25%', s1l:'Revenue Share commission', s2v:'48h', s2l:'Payment processing', s3v:'24/7', s3l:'Dedicated support',
    ben_title:'WHY WINPARTNERS',
    b1t:'20% RevShare Commission', b1d:'Receive 20% of net revenue from referred players for life.',
    b2t:'Daily statistics', b2d:'Full dashboard with clicks, registrations, deposits and commissions.',
    b3t:'Personalized code', b3d:'Unique code with your name. Players enter it at registration.',
    b4t:'Weekly payments', b4d:'Bitcoin, Skrill, Neteller, Visa. Processing within 48 hours.',
    b5t:'Referrals 3%', b5d:'Earn 3% from commissions of bloggers you invite.',
    b6t:'Dedicated manager', b6d:'Personal manager 24/7 on WhatsApp and Telegram.',
    how_title:'HOW IT WORKS',
    hw1:'Free registration', hw2:'Get your unique code', hw3:'Promote on social media', hw4:'Get paid',
    test_title:'WHY BLOGGERS CHOOSE WINPARTNERS',
    t1n:'Direct access', t1p:'To official Melbet, 1xBet, Mostbet programs', t1t:'No need to negotiate separately with each casino. WinPartners gives you instant access to all affiliate programs with the best commissions already negotiated.',
    t2n:'Single dashboard', t2p:'All casinos in one place', t2t:'Unified statistics, one withdrawal point, one manager. No more managing 5 separate accounts at 5 different casinos.',
    t3n:'Full transparency', t3p:'Every player, every commission', t3t:'You know exactly how many players you brought, to which casino, how much they deposited and how much you earn. Data updated daily.',
    cas_title:'CASINO PARTNERS',
    cta_title:'READY TO EARN?', cta_sub:'Join thousands of partners earning daily with WinPartners.', cta_btn:'FREE REGISTRATION',
    f_copy:'© 2026 WinPartners. All rights reserved.',
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
          <svg width="32" height="32" viewBox="0 0 32 32">
            <polygon points="16,2 30,9 30,23 16,30 2,23 2,9" fill={gold} opacity="0.15" stroke={gold} strokeWidth="1.5"/>
            <text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="900" fill={gold}>W</text>
          </svg>
          <span style={{fontSize:18,fontWeight:900,letterSpacing:'.02em'}}><span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span></span>
        </div>

        {/* Desktop nav links */}
        {!isMobile && (
          <div style={{display:'flex',gap:20}}>
            {[['about',lang==='ru'?'О нас':'Despre noi'],['benefits',lang==='ru'?'Преимущества':'Beneficii'],['instructions',lang==='ru'?'Инструкции':'Instrucțiuni'],['faq','FAQ'],['contact',lang==='ru'?'Контакты':'Contact']].map(([path,label])=>(
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
            {[['about',lang==='ru'?'О нас':'Despre noi'],['benefits',lang==='ru'?'Преимущества':'Beneficii'],['instructions',lang==='ru'?'Инструкции':'Instrucțiuni'],['faq','FAQ'],['contact',lang==='ru'?'Контакты':'Contact']].map(([path,label])=>(
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
            <span style={{fontSize:12,color:gold,fontWeight:600,letterSpacing:'.05em'}}>PROGRAM OFICIAL DE AFILIERE · MELBET · 1XBET · MOSTBET</span>
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
      <div style={{background:'rgba(0,0,0,0.5)',borderTop:`1px solid rgba(245,166,35,0.12)`,borderBottom:`1px solid rgba(245,166,35,0.12)`,padding:'3rem 2rem'}}>
        <div style={{maxWidth:900,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:0}}>
          {[[t.s1v,t.s1l],[t.s2v,t.s2l],[t.s3v,t.s3l]].map(([v,l],i)=>(
            <div key={l} style={{textAlign:'center',padding:'1rem',borderLeft:i>0?`1px solid rgba(245,166,35,0.1)`:'none'}}>
              <div style={{fontSize:48,fontWeight:900,color:gold,lineHeight:1,marginBottom:6}}>{v}</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'.1em'}}>{l}</div>
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

      {/* HOW IT WORKS */}
      <div style={{background:'rgba(0,0,0,0.3)',padding:'5rem 2rem',borderTop:`1px solid rgba(245,166,35,0.08)`}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <h2 style={{fontSize:'clamp(1.6rem,3vw,2.4rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.08em'}}>{t.how_title}</h2>
            <div style={{width:60,height:3,background:gold,margin:'12px auto 0',borderRadius:2}}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:0,position:'relative'}}>
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
      <footer style={{background:'#050508',borderTop:`1px solid rgba(245,166,35,0.1)`,padding:'3rem 3rem 2rem'}}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr auto auto auto',gap:48,marginBottom:32,flexWrap:'wrap'}}>
            <div>
              <div style={{fontSize:20,fontWeight:900,marginBottom:12}}><span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span></div>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.3)',lineHeight:1.7,maxWidth:260}}>Platformă profesională de afiliere pentru bloggeri și influenceri din toată lumea.</div>
              <div style={{display:'flex',gap:8,marginTop:16}}>
                {['🔒 SSL','✓ Licențiat','⭐ 4.9/5'].map(b=><span key={b} style={{fontSize:11,color:'rgba(255,255,255,0.35)',background:'rgba(255,255,255,0.05)',padding:'3px 8px',borderRadius:4}}>{b}</span>)}
              </div>
            </div>
            {[
              ['Program',['about','Despre noi'],['benefits','Beneficii'],['instructions','Instrucțiuni'],['faq','FAQ']],
              ['Companie',['about','Despre noi'],['contact','Contacte'],['terms','Termeni'],['terms','Confidențialitate']],
              ['Contact',['','support@winpartners.partners'],['','Telegram: @winpartners'],['','WhatsApp disponibil'],['','Program: 24/7']],
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
