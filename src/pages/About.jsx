import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const gold = '#f5a623'
const dark = '#0a0a0f'

export default function About() {
  const nav = useNavigate()
  const [lang, setLang] = useState('ro')

  const T = {
    ro: {
      title: 'DESPRE', title2: 'WINPARTNERS',
      story_title: 'DE CE EXISTĂ WINPARTNERS',
      story: 'Problema cu programele de afiliere directe la cazinouri este că sunt complicate. Trebuie să te înregistrezi separat la Melbet, 1xBet, Mostbet — fiecare cu propriul panou, propriile rapoarte, propria metodă de plată. Și dacă vrei să schimbi ceva, trebuie să contactezi 5 manageri diferiți.\n\nWinPartners rezolvă asta. Un singur cont. Un singur dashboard. Un singur manager care te cunoaște personal. Noi negociem direct cu cazinourile pentru tine și îți dăm cele mai bune comisioane disponibile — 25% Revenue Share pe viață.',
      why_title: 'DE CE NOI ȘI NU DIRECT LA MELBET',
      why: [
        ['⚡', 'Acces instant', 'La Melbet poți aștepta zile pentru aprobare. La noi — 24-48 ore și ești activ.'],
        ['📊', 'Un singur dashboard', 'Toate statisticile, toate comisioanele, toate plățile — într-un singur loc.'],
        ['🤝', 'Manager personal', 'Nu un chatbot. O persoană reală care îți răspunde pe Telegram.'],
        ['💰', 'Comisioane mai mari', 'Negociem în bloc pentru toți partenerii noștri — tu beneficiezi de condiții mai bune.'],
        ['🔒', 'Plăți garantate', 'Noi ne ocupăm de relația cu cazinoul. Tu primești banii săptămânal, garantat.'],
        ['📱', 'Instrumente dedicate', 'Coduri promoționale personalizate, link-uri de tracking, statistici detaliate.'],
      ],
      how_title: 'CUM FUNCȚIONEAZĂ CONCRET',
      how: [
        ['01', 'Aplici pe WinPartners', 'Completezi formularul cu datele tale și profilul social. Analizăm cererea în 24-48 ore.'],
        ['02', 'Primești codul tău Melbet', 'Codul este unic și legat de tine. Orice jucător care îl folosește devine al tău pe viață.'],
        ['03', 'Promovezi la audiența ta', 'Postezi pe TikTok, Instagram, YouTube — cum știi tu mai bine. Noi nu îți spunem ce să faci.'],
        ['04', 'Câștigi automat', 'Când jucătorii tăi pierd pe Melbet, tu primești 25% din pierderile lor. Săptămânal, în crypto.'],
      ],
      stats: [['25%', 'Comision RevShare'], ['48h', 'Timp aprobare'], ['24/7', 'Suport real'], ['$0', 'Cost înregistrare']],
      cta: 'APLICĂ ACUM — GRATUIT',
      login: 'Conectați-vă', reg: 'Înregistrare',
    },
    ru: {
      title: 'О', title2: 'WINPARTNERS',
      story_title: 'ПОЧЕМУ СУЩЕСТВУЕТ WINPARTNERS',
      story: 'Проблема с прямыми партнёрскими программами казино в том, что они сложные. Нужно регистрироваться отдельно в Melbet, 1xBet, Mostbet — у каждого свой кабинет, свои отчёты, свой способ оплаты.\n\nWinPartners решает это. Один аккаунт. Один дашборд. Один менеджер, который знает вас лично. Мы договариваемся с казино напрямую и даём вам лучшие условия — 25% Revenue Share пожизненно.',
      why_title: 'ПОЧЕМУ МЫ, А НЕ НАПРЯМУЮ В MELBET',
      why: [
        ['⚡', 'Быстрый старт', 'В Melbet можно ждать одобрения днями. У нас — 24-48 часов и вы активны.'],
        ['📊', 'Единый дашборд', 'Вся статистика, все комиссии, все выплаты — в одном месте.'],
        ['🤝', 'Личный менеджер', 'Не чат-бот. Живой человек, который отвечает в Telegram.'],
        ['💰', 'Лучшие условия', 'Мы договариваемся оптом для всех партнёров — вы получаете лучшие условия.'],
        ['🔒', 'Гарантированные выплаты', 'Мы управляем отношениями с казино. Вы получаете деньги еженедельно.'],
        ['📱', 'Инструменты', 'Персональные промокоды, трекинг-ссылки, детальная статистика.'],
      ],
      how_title: 'КАК ЭТО РАБОТАЕТ КОНКРЕТНО',
      how: [
        ['01', 'Подаёшь заявку', 'Заполняешь форму с данными и профилем. Рассматриваем заявку за 24-48 часов.'],
        ['02', 'Получаешь свой код Melbet', 'Код уникальный и привязан к тебе. Любой игрок, который его использует — твой навсегда.'],
        ['03', 'Продвигаешь своей аудитории', 'Постишь в TikTok, Instagram, YouTube — как умеешь. Мы не диктуем.'],
        ['04', 'Зарабатываешь автоматически', 'Когда твои игроки проигрывают в Melbet, ты получаешь 25% от их потерь. Еженедельно в крипто.'],
      ],
      stats: [['25%', 'RevShare комиссия'], ['48h', 'Время одобрения'], ['24/7', 'Живая поддержка'], ['$0', 'Стоимость регистрации']],
      cta: 'ПОДАТЬ ЗАЯВКУ — БЕСПЛАТНО',
      login: 'Войти', reg: 'Регистрация',
    },
    en: {
      title: 'ABOUT', title2: 'WINPARTNERS',
      story_title: 'WHY WINPARTNERS EXISTS',
      story: 'The problem with direct casino affiliate programs is complexity. You need to register separately at Melbet, 1xBet, Mostbet — each with its own dashboard, reports, and payment method.\n\nWinPartners solves this. One account. One dashboard. One personal manager who knows you. We negotiate directly with casinos on your behalf and give you the best commissions available — 25% Revenue Share for life.',
      why_title: 'WHY US AND NOT DIRECTLY AT MELBET',
      why: [
        ['⚡', 'Instant access', 'At Melbet you can wait days for approval. With us — 24-48 hours and you\'re active.'],
        ['📊', 'Single dashboard', 'All statistics, commissions, payments — in one place.'],
        ['🤝', 'Personal manager', 'Not a chatbot. A real person who replies on Telegram.'],
        ['💰', 'Better commissions', 'We negotiate in bulk for all our partners — you get better terms.'],
        ['🔒', 'Guaranteed payments', 'We manage the casino relationship. You get paid weekly, guaranteed.'],
        ['📱', 'Dedicated tools', 'Custom promo codes, tracking links, detailed statistics.'],
      ],
      how_title: 'HOW IT WORKS IN PRACTICE',
      how: [
        ['01', 'Apply on WinPartners', 'Fill out the form with your details and social profile. We review in 24-48 hours.'],
        ['02', 'Get your Melbet code', 'Your code is unique and tied to you. Any player who uses it is yours for life.'],
        ['03', 'Promote to your audience', 'Post on TikTok, Instagram, YouTube — however you know best.'],
        ['04', 'Earn automatically', 'When your players lose on Melbet, you receive 25% of their losses. Weekly, in crypto.'],
      ],
      stats: [['25%', 'RevShare commission'], ['48h', 'Approval time'], ['24/7', 'Real support'], ['$0', 'Registration cost']],
      cta: 'APPLY NOW — FREE',
      login: 'Login', reg: 'Register',
    },
  }
  const t = T[lang]

  return (
    <div style={{background:dark,minHeight:'100vh',color:'#fff',fontFamily:"'Inter',sans-serif"}}>
      {/* NAV */}
      <nav style={{background:'rgba(10,10,15,0.97)',borderBottom:'1px solid rgba(245,166,35,0.12)',padding:'0 1.25rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:60,position:'sticky',top:0,zIndex:50}}>
        <div onClick={()=>nav('/')} style={{fontSize:20,fontWeight:900,cursor:'pointer'}}>
          <span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          {['ro','ru','en'].map(l=>(
            <button key={l} onClick={()=>setLang(l)} style={{padding:'3px 8px',fontSize:11,fontWeight:700,cursor:'pointer',border:`1px solid ${lang===l?gold:'rgba(255,255,255,0.15)'}`,borderRadius:4,background:lang===l?gold:'none',color:lang===l?'#000':'rgba(255,255,255,0.6)',textTransform:'uppercase'}}>{l}</button>
          ))}
          <button onClick={()=>nav('/register')} style={{marginLeft:8,padding:'7px 16px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:gold,color:'#000'}}>{t.reg}</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{background:'linear-gradient(135deg,rgba(245,166,35,0.06) 0%,transparent 60%)',padding:'4rem 1.25rem 3rem',textAlign:'center',borderBottom:'1px solid rgba(245,166,35,0.08)'}}>
        <h1 style={{fontSize:'clamp(2.2rem,5vw,4rem)',fontWeight:900,letterSpacing:'-0.01em',lineHeight:1.05,marginBottom:20}}>
          {t.title} <span style={{color:gold}}>{t.title2}</span>
        </h1>
        {/* Stats */}
        <div style={{display:'flex',gap:0,justifyContent:'center',flexWrap:'wrap',maxWidth:600,margin:'0 auto'}}>
          {t.stats.map(([v,l],i)=>(
            <div key={l} style={{padding:'1rem 1.5rem',borderLeft:i>0?'1px solid rgba(245,166,35,0.12)':'none',textAlign:'center'}}>
              <div style={{fontSize:'clamp(1.6rem,3vw,2.4rem)',fontWeight:900,color:gold,lineHeight:1}}>{v}</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'.08em',marginTop:4}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{maxWidth:860,margin:'0 auto',padding:'3rem 1.25rem'}}>

        {/* STORY */}
        <div style={{marginBottom:'3.5rem'}}>
          <h2 style={{fontSize:'clamp(1.3rem,2.5vw,1.8rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.06em',color:gold,marginBottom:20}}>{t.story_title}</h2>
          {t.story.split('\n\n').map((p,i)=>(
            <p key={i} style={{fontSize:15,color:'rgba(255,255,255,0.65)',lineHeight:1.85,marginBottom:16}}>{p}</p>
          ))}
        </div>

        {/* WHY US */}
        <div style={{marginBottom:'3.5rem'}}>
          <h2 style={{fontSize:'clamp(1.3rem,2.5vw,1.8rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:24}}>{t.why_title}</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:14}}>
            {t.why.map(([icon,title,desc])=>(
              <div key={title} style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(245,166,35,0.1)',borderRadius:12,padding:'1.25rem',display:'flex',gap:14}}>
                <span style={{fontSize:22,flexShrink:0,marginTop:2}}>{icon}</span>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:'#fff',marginBottom:5}}>{title}</div>
                  <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.6}}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div style={{marginBottom:'3.5rem'}}>
          <h2 style={{fontSize:'clamp(1.3rem,2.5vw,1.8rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:24}}>{t.how_title}</h2>
          <div style={{display:'flex',flexDirection:'column',gap:0}}>
            {t.how.map(([num,title,desc],i)=>(
              <div key={num} style={{display:'flex',gap:20,paddingBottom:i<3?28:0,position:'relative'}}>
                {i<3&&<div style={{position:'absolute',left:20,top:44,bottom:0,width:2,background:'rgba(245,166,35,0.15)'}}/>}
                <div style={{width:40,height:40,borderRadius:'50%',background:`rgba(245,166,35,0.1)`,border:`2px solid ${gold}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:900,color:gold,flexShrink:0}}>{num}</div>
                <div style={{paddingTop:8}}>
                  <div style={{fontSize:15,fontWeight:700,color:'#fff',marginBottom:5}}>{title}</div>
                  <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.6}}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{textAlign:'center',padding:'2.5rem',background:'rgba(245,166,35,0.05)',border:'1px solid rgba(245,166,35,0.2)',borderRadius:20}}>
          <div style={{fontSize:13,color:'rgba(255,255,255,0.4)',marginBottom:16,textTransform:'uppercase',letterSpacing:'.1em'}}>Gata să începi?</div>
          <button onClick={()=>nav('/register')} style={{padding:'16px 40px',fontSize:15,fontWeight:800,cursor:'pointer',border:`2px solid ${gold}`,borderRadius:8,background:gold,color:'#000',textTransform:'uppercase',letterSpacing:'.05em',boxShadow:`0 8px 32px rgba(245,166,35,0.3)`}}>
            {t.cta}
          </button>
        </div>

      </div>
    </div>
  )
}
