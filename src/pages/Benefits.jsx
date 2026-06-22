import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const gold = '#f5a623'
const LANGS = ['ro','ru','en','tr','de','pt','pl']
const T = {
  ro:{ login:'Conectați-vă', reg:'Înregistrare', start:'ÎNCEPEȚI ACUM', title:'BENEFICIILE', title2:'PROGRAMULUI', sub:'Tot ce ai nevoie pentru a câștiga din audiența ta',
    items:[['💰','Comision RevShare 25%','Primiți 25% din pierderile nete ale jucătorilor recomandați pe toată durata activității lor. Fără limită de timp, fără reduceri.'],['📊','Statistici zilnice','Rapoarte complete cu clickuri, înregistrări, depunători și comisioane. Actualizate zilnic.'],['🎯','Cod promoțional unic','Cod personalizat legat de dvs. pe viață. Orice jucător care îl folosește rămâne al dvs. permanent.'],['⚡','Plăți săptămânale','Plăți garantate săptămânal prin Bitcoin, USDT, Ethereum, Binance Pay, Skrill sau Neteller. Minim $30.'],['👥','Program referrali 3%','Invitați alți bloggeri și câștigați 3% din comisioanele lor pe viață.'],['💬','Manager personal 24/7','Manager dedicat disponibil permanent pe WhatsApp și Telegram.'],['🌍','Acoperire internațională','Cazinouri disponibile în Moldova, România, Rusia, Ucraina, Kazakhstan și alte țări.'],['📱','Materiale de marketing','Bannere, linkuri și coduri gata de utilizat pentru toate platformele sociale.'],['🔒','Transparență totală','Statistici actualizate zilnic. Vedeți exact câți jucători ați adus și cât câștigați.']]},
  ru:{ login:'Войти', reg:'Регистрация', start:'НАЧАТЬ СЕЙЧАС', title:'ПРЕИМУЩЕСТВА', title2:'ПРОГРАММЫ', sub:'Всё необходимое для заработка на вашей аудитории',
    items:[['💰','Комиссия RevShare 25%','Получайте 25% от чистых проигрышей привлечённых игроков на протяжении всего времени их активности.'],['📊','Ежедневная статистика','Полные отчёты с кликами, регистрациями, депозитчиками и комиссиями. Обновляется ежедневно.'],['🎯','Уникальный промокод','Персональный код привязан к вам навсегда. Любой игрок, использующий его, ваш навсегда.'],['⚡','Еженедельные выплаты','Гарантированные еженедельные выплаты через Bitcoin, USDT, Ethereum, Binance Pay, Skrill или Neteller. Минимум $30.'],['👥','Реферальная программа 3%','Приглашайте блогеров и зарабатывайте 3% от их комиссий пожизненно.'],['💬','Личный менеджер 24/7','Выделенный менеджер постоянно доступен в WhatsApp и Telegram.'],['🌍','Международное покрытие','Казино доступны в России, Украине, Казахстане, Молдове, Румынии и многих других странах.'],['📱','Маркетинговые материалы','Баннеры, ссылки и коды готовы к использованию на всех социальных платформах.'],['🔒','Полная прозрачность','Статистика обновляется ежедневно. Вы точно знаете, сколько игроков привлекли и сколько зарабатываете.']]},
  en:{ login:'Login', reg:'Register', start:'GET STARTED NOW', title:'PROGRAM', title2:'BENEFITS', sub:'Everything you need to earn from your audience',
    items:[['💰','25% RevShare Commission','Receive 25% of referred players net losses for the entire duration of their activity. Lifetime, no reductions.'],['📊','Daily statistics','Complete reports with clicks, registrations, depositors and commissions. Updated daily.'],['🎯','Unique promo code','Personalized code tied to you for life. Any player who uses it is yours permanently.'],['⚡','Weekly payments','Guaranteed weekly payments via Bitcoin, USDT, Ethereum, Binance Pay, Skrill or Neteller. Minimum $30.'],['👥','3% Referral program','Invite other bloggers and earn 3% of their commissions for life.'],['💬','Personal manager 24/7','Dedicated manager permanently available on WhatsApp and Telegram.'],['🌍','International coverage','Casinos available in Moldova, Romania, Russia, Ukraine, Kazakhstan and other countries.'],['📱','Marketing materials','Banners, links and codes ready to use on all social platforms.'],['🔒','Full transparency','Statistics updated daily. See exactly how many players you brought and how much you earn.']]},
  tr:{ login:'Giriş', reg:'Kayıt', start:'HEMEN BAŞLA', title:'PROGRAM', title2:'AVANTAJLARI', sub:'Kitlenizden kazanmak için ihtiyacınız olan her şey',
    items:[['💰','%25 RevShare Komisyon','Yönlendirilen oyuncuların net kayıplarının tüm aktiflik süreleri boyunca %25ini alırsınız. Ömür boyu, kesinti yok.'],['📊','Günlük istatistikler','Tıklamalar, kayıtlar, para yatıranlar ve komisyonlarla eksiksiz raporlar. Günlük güncellenir.'],['🎯','Benzersiz promosyon kodu','Size bağlı kişisel kod. Kullanan her oyuncu sonsuza dek sizindir.'],['⚡','Haftalık ödemeler','Bitcoin, USDT, Ethereum, Binance Pay, Skrill veya Neteller ile garantili haftalık ödemeler. Minimum $30.'],['👥','%3 Referans programı','Diğer bloggerleri davet edin ve ömür boyu komisyonlarının %3ünü kazanın.'],['💬','7/24 Kişisel yönetici','WhatsApp ve Telegramda sürekli erişilebilir özel yönetici.'],['🌍','Uluslararası kapsam','Moldavya, Romanya, Rusya, Ukrayna, Kazakistan ve diğer ülkelerde casinolar mevcut.'],['📱','Pazarlama materyalleri','Tüm sosyal platformlarda kullanıma hazır bannerlar, linkler ve kodlar.'],['🔒','Tam şeffaflık','İstatistikler günlük güncellenir. Kaç oyuncu getirdiğinizi ve ne kadar kazandığınızı tam olarak görürsünüz.']]},
  de:{ login:'Anmelden', reg:'Registrieren', start:'JETZT STARTEN', title:'PROGRAMM', title2:'VORTEILE', sub:'Alles was Sie brauchen um mit Ihrem Publikum zu verdienen',
    items:[['💰','25% RevShare Provision','Erhalten Sie 25% der Nettoverluste geworbener Spieler während ihrer gesamten Aktivität. Lebenslang, keine Kürzungen.'],['📊','Tägliche Statistiken','Vollständige Berichte mit Klicks, Registrierungen, Einzahlern und Provisionen. Täglich aktualisiert.'],['🎯','Einzigartiger Promo-Code','Personalisierter Code, der dauerhaft mit Ihnen verknüpft ist. Jeder Spieler der ihn nutzt gehört Ihnen für immer.'],['⚡','Wöchentliche Zahlungen','Garantierte wöchentliche Zahlungen per Bitcoin, USDT, Ethereum, Binance Pay, Skrill oder Neteller. Mindestens $30.'],['👥','3% Empfehlungsprogramm','Laden Sie andere Blogger ein und verdienen Sie lebenslang 3% ihrer Provisionen.'],['💬','Persönlicher Manager 24/7','Dedizierter Manager permanent verfügbar auf WhatsApp und Telegram.'],['🌍','Internationale Abdeckung','Casinos verfügbar in Moldawien, Rumänien, Russland, Ukraine, Kasachstan und anderen Ländern.'],['📱','Marketingmaterialien','Banner, Links und Codes einsatzbereit für alle sozialen Plattformen.'],['🔒','Volle Transparenz','Täglich aktualisierte Statistiken. Sehen Sie genau wie viele Spieler Sie gebracht haben und wie viel Sie verdienen.']]},
  pt:{ login:'Entrar', reg:'Registrar', start:'COMEÇAR AGORA', title:'BENEFÍCIOS', title2:'DO PROGRAMA', sub:'Tudo o que precisa para ganhar com o seu público',
    items:[['💰','Comissão RevShare 25%','Receba 25% das perdas líquidas dos jogadores indicados durante toda a sua atividade. Vitalícia, sem reduções.'],['📊','Estatísticas diárias','Relatórios completos com cliques, registos, depositantes e comissões. Atualizados diariamente.'],['🎯','Código promocional único','Código personalizado ligado a si permanentemente. Qualquer jogador que o use é seu para sempre.'],['⚡','Pagamentos semanais','Pagamentos semanais garantidos via Bitcoin, USDT, Ethereum, Binance Pay, Skrill ou Neteller. Mínimo $30.'],['👥','Programa de referência 3%','Convide outros bloggers e ganhe 3% das comissões deles para sempre.'],['💬','Gerente pessoal 24/7','Gerente dedicado permanentemente disponível no WhatsApp e Telegram.'],['🌍','Cobertura internacional','Casinos disponíveis na Moldávia, Roménia, Rússia, Ucrânia, Cazaquistão e outros países.'],['📱','Materiais de marketing','Banners, links e códigos prontos a usar em todas as plataformas sociais.'],['🔒','Transparência total','Estatísticas atualizadas diariamente. Veja exatamente quantos jogadores trouxe e quanto ganha.']]},
  pl:{ login:'Zaloguj się', reg:'Rejestracja', start:'ZACZNIJ TERAZ', title:'KORZYŚCI', title2:'PROGRAMU', sub:'Wszystko czego potrzebujesz aby zarabiać na swojej publiczności',
    items:[['💰','Prowizja RevShare 25%','Otrzymuj 25% strat netto poleconych graczy przez cały czas ich aktywności. Dożywotnio, bez redukcji.'],['📊','Codzienne statystyki','Pełne raporty z kliknięciami, rejestracjami, deponentami i prowizjami. Aktualizowane codziennie.'],['🎯','Unikalny kod promocyjny','Spersonalizowany kod powiązany z Tobą na stałe. Każdy gracz który go użyje jest Twój na zawsze.'],['⚡','Tygodniowe wypłaty','Gwarantowane tygodniowe wypłaty przez Bitcoin, USDT, Ethereum, Binance Pay, Skrill lub Neteller. Minimum $30.'],['👥','Program poleceń 3%','Zapraszaj innych blogerów i zarabiaj 3% ich prowizji dożywotnio.'],['💬','Osobisty menedżer 24/7','Dedykowany menedżer stale dostępny na WhatsApp i Telegramie.'],['🌍','Zasięg międzynarodowy','Kasyna dostępne w Mołdawii, Rumunii, Rosji, Ukrainie, Kazachstanie i innych krajach.'],['📱','Materiały marketingowe','Banery, linki i kody gotowe do użycia na wszystkich platformach społecznościowych.'],['🔒','Pełna przejrzystość','Statystyki aktualizowane codziennie. Widzisz dokładnie ilu graczy przyprowadziłeś i ile zarabiasz.']]},
}
export default function Benefits() {
  const nav = useNavigate()
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768)
  React.useEffect(()=>{ const fn=()=>setIsMobile(window.innerWidth<768); window.addEventListener('resize',fn); return()=>window.removeEventListener('resize',fn) },[])
  const [lang, setLang] = useState(() => { const s = localStorage.getItem('wp_lang'); return LANGS.includes(s) ? s : 'ro' })
  // Auto-detect limba după locație (doar dacă nu a ales manual)
  useEffect(() => {
    if (localStorage.getItem('wp_lang')) return
    const countryToLang = {
      MD:'ro', RO:'ro',
      RU:'ru', BY:'ru', KZ:'ru', UA:'ru', UZ:'ru', AM:'ru', AZ:'ru', GE:'ru', TJ:'ru', TM:'ru', KG:'ru',
      TR:'tr',
      DE:'de', AT:'de', CH:'de',
      PT:'pt', BR:'pt',
      PL:'pl',
    }
    const detect = async () => {
      try {
        // Încercăm 2 API-uri pentru robustețe
        const r = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) })
        const d = await r.json()
        const l = countryToLang[d.country_code]
        if (l) { setLang(l); localStorage.setItem('wp_lang', l) }
      } catch {
        try {
          const r2 = await fetch('https://api.country.is/', { signal: AbortSignal.timeout(3000) })
          const d2 = await r2.json()
          const l2 = countryToLang[d2.country]
          if (l2) { setLang(l2); localStorage.setItem('wp_lang', l2) }
        } catch { /* rămâne ro */ }
      }
    }
    detect()
  }, [])
  const t = T[lang] || T.ro
  const setL = l => { setLang(l); localStorage.setItem('wp_lang', l) }
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
      {/* Hero banner */}
      <div style={{background:'linear-gradient(135deg,rgba(245,166,35,0.07) 0%,rgba(245,166,35,0.02) 50%,transparent 100%)',borderBottom:'1px solid rgba(245,166,35,0.1)',padding:'3rem 1.25rem 2.5rem',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:400,height:400,background:'radial-gradient(ellipse,rgba(245,166,35,0.06) 0%,transparent 65%)',pointerEvents:'none'}}/>
        <div style={{position:'relative',zIndex:1}}>
          <h1 style={{fontSize:'clamp(2rem,4vw,3.2rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.04em',marginBottom:12}}>{t.title} <span style={{color:gold}}>{t.title2}</span></h1>
          <p style={{fontSize:15,color:'rgba(255,255,255,0.45)',maxWidth:560,margin:'0 auto'}}>{t.sub}</p>
        </div>
      </div>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'3rem 1.25rem'}}>
        <div style={{marginBottom:48}}/>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(auto-fit,minmax(280px,1fr))',gap:20}}>
          {t.items.map(([icon,title,desc])=>(
            <div key={title} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(245,166,35,0.12)',borderRadius:12,padding:'1.5rem',display:'flex',gap:16}}>
              <div style={{width:50,height:50,background:'rgba(245,166,35,0.1)',border:'1px solid rgba(245,166,35,0.25)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{icon}</div>
              <div><div style={{fontSize:15,fontWeight:700,color:'#fff',marginBottom:6}}>{title}</div><div style={{fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.6}}>{desc}</div></div>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',marginTop:48}}>
          <button onClick={()=>nav('/register')} style={{padding:'16px 48px',fontSize:15,fontWeight:800,cursor:'pointer',border:'none',borderRadius:8,background:gold,color:'#000',textTransform:'uppercase',letterSpacing:'.05em'}}>{t.start}</button>
        </div>
      </div>
    </div>
  )
}
