import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const gold = '#f5a623'
const LANGS = ['ro','ru','en','tr','de','pt','pl']
const T = {
  ro:{ login:'Conectați-vă', reg:'Înregistrare', title:'DESPRE', title2:'WINPARTNERS', ready:'Gata să începi?', cta:'APLICĂ ACUM — GRATUIT',
    story_title:'DE CE EXISTĂ WINPARTNERS',
    story:'Problema cu programele de afiliere directe la cazinouri este că sunt complicate. Trebuie să te înregistrezi separat la Melbet, 1xBet, Mostbet — fiecare cu propriul panou, propriile rapoarte, propria metodă de plată.\n\nWinPartners rezolvă asta. Un singur cont. Un singur dashboard. Un singur manager care te cunoaște personal. Noi negociem direct cu cazinourile și îți dăm cele mai bune comisioane — 25% Revenue Share pe viață.',
    why_title:'DE CE NOI ȘI NU DIRECT LA MELBET',
    why:[['⚡','Acces rapid','La Melbet poți aștepta zile pentru aprobare. La noi — 24-48 ore și ești activ.'],['📊','Un singur dashboard','Toate statisticile, comisioanele, plățile — într-un singur loc.'],['🤝','Manager personal','Nu un chatbot. O persoană reală care îți răspunde pe Telegram.'],['💰','Comisioane mai mari','Negociem în bloc pentru toți partenerii noștri — tu beneficiezi de condiții mai bune.'],['🔒','Plăți garantate','Noi ne ocupăm de relația cu cazinoul. Tu primești banii săptămânal.'],['📱','Instrumente dedicate','Coduri promoționale personalizate, link-uri de tracking, statistici detaliate.']],
    how_title:'CUM FUNCȚIONEAZĂ CONCRET',
    how:[['01','Aplici pe WinPartners','Completezi formularul cu datele tale și profilul social. Analizăm cererea în 24-48 ore.'],['02','Primești codul tău Melbet','Codul este unic și legat de tine. Orice jucător care îl folosește devine al tău pe viață.'],['03','Promovezi la audiența ta','Postezi pe TikTok, Instagram, YouTube — cum știi tu mai bine.'],['04','Câștigi automat','Când jucătorii tăi pierd pe Melbet, tu primești 25% din pierderile lor. Săptămânal, în crypto.']],
    stats:[['25%','Comision RevShare'],['48h','Timp aprobare'],['24/7','Suport real'],['$0','Cost înregistrare']]},
  ru:{ login:'Войти', reg:'Регистрация', title:'О', title2:'WINPARTNERS', ready:'Готовы начать?', cta:'ПОДАТЬ ЗАЯВКУ — БЕСПЛАТНО',
    story_title:'ПОЧЕМУ СУЩЕСТВУЕТ WINPARTNERS',
    story:'Проблема с прямыми партнёрскими программами казино в том, что они сложные. Нужно регистрироваться отдельно в Melbet, 1xBet, Mostbet — у каждого свой кабинет, свои отчёты, свой способ оплаты.\n\nWinPartners решает это. Один аккаунт. Один дашборд. Один менеджер, который знает вас лично. Мы договариваемся с казино напрямую и даём вам лучшие условия — 25% Revenue Share пожизненно.',
    why_title:'ПОЧЕМУ МЫ, А НЕ НАПРЯМУЮ В MELBET',
    why:[['⚡','Быстрый старт','В Melbet можно ждать одобрения днями. У нас — 24-48 часов и вы активны.'],['📊','Единый дашборд','Вся статистика, все комиссии, все выплаты — в одном месте.'],['🤝','Личный менеджер','Не чат-бот. Живой человек, который отвечает в Telegram.'],['💰','Лучшие условия','Мы договариваемся оптом для всех партнёров — вы получаете лучшие условия.'],['🔒','Гарантированные выплаты','Мы управляем отношениями с казино. Вы получаете деньги еженедельно.'],['📱','Инструменты','Персональные промокоды, трекинг-ссылки, детальная статистика.']],
    how_title:'КАК ЭТО РАБОТАЕТ КОНКРЕТНО',
    how:[['01','Подаёшь заявку','Заполняешь форму с данными и профилем. Рассматриваем заявку за 24-48 часов.'],['02','Получаешь свой код Melbet','Код уникальный и привязан к тебе. Любой игрок — твой навсегда.'],['03','Продвигаешь своей аудитории','Постишь в TikTok, Instagram, YouTube — как умеешь.'],['04','Зарабатываешь автоматически','Когда твои игроки проигрывают в Melbet, ты получаешь 25% от их потерь. Еженедельно в крипто.']],
    stats:[['25%','RevShare комиссия'],['48h','Время одобрения'],['24/7','Живая поддержка'],['$0','Стоимость регистрации']]},
  en:{ login:'Login', reg:'Register', title:'ABOUT', title2:'WINPARTNERS', ready:'Ready to start?', cta:'APPLY NOW — FREE',
    story_title:'WHY WINPARTNERS EXISTS',
    story:"The problem with direct casino affiliate programs is complexity. You need to register separately at Melbet, 1xBet, Mostbet — each with its own dashboard, reports, and payment method.\n\nWinPartners solves this. One account. One dashboard. One personal manager who knows you. We negotiate directly with casinos and give you the best commissions — 25% Revenue Share for life.",
    why_title:'WHY US AND NOT DIRECTLY AT MELBET',
    why:[['⚡','Fast access',"At Melbet you can wait days for approval. With us — 24-48 hours and you're active."],['📊','Single dashboard','All statistics, commissions, payments — in one place.'],['🤝','Personal manager','Not a chatbot. A real person who replies on Telegram.'],['💰','Better commissions','We negotiate in bulk for all our partners — you get better terms.'],['🔒','Guaranteed payments','We manage the casino relationship. You get paid weekly, guaranteed.'],['📱','Dedicated tools','Custom promo codes, tracking links, detailed statistics.']],
    how_title:'HOW IT WORKS IN PRACTICE',
    how:[['01','Apply on WinPartners','Fill out the form with your details and social profile. We review in 24-48 hours.'],['02','Get your Melbet code','Your code is unique and tied to you. Any player who uses it is yours for life.'],['03','Promote to your audience','Post on TikTok, Instagram, YouTube — however you know best.'],['04','Earn automatically','When your players lose on Melbet, you receive 25% of their losses. Weekly, in crypto.']],
    stats:[['25%','RevShare commission'],['48h','Approval time'],['24/7','Real support'],['$0','Registration cost']]},
  tr:{ login:'Giriş', reg:'Kayıt', title:'HAKKINDA', title2:'WINPARTNERS', ready:'Başlamaya hazır mısınız?', cta:'BAŞVURUN — ÜCRETSİZ',
    story_title:'WINPARTNERS NEDEN VAR',
    story:"Doğrudan casino ortaklık programlarının sorunu karmaşıklıklarıdır. Melbet, 1xBet, Mostbet'e ayrı ayrı kaydolmanız gerekir — her birinin kendi paneli, raporları ve ödeme yöntemi vardır.\n\nWinPartners bunu çözer. Tek hesap. Tek panel. Sizi kişisel olarak tanıyan tek bir yönetici. Casinolarla doğrudan müzakere eder ve size en iyi koşulları sunarız — ömür boyu %25 Revenue Share.",
    why_title:'NEDEN BİZ, DOĞRUDAN MELBET DEĞİL',
    why:[['⚡','Hızlı erişim',"Melbet'te onay için günlerce bekleyebilirsiniz. Bizde — 24-48 saat ve aktifsiniz."],['📊','Tek panel','Tüm istatistikler, komisyonlar, ödemeler — tek bir yerde.'],['🤝','Kişisel yönetici',"Chatbot değil. Telegram'da cevap veren gerçek bir kişi."],['💰','Daha iyi komisyonlar','Tüm ortaklarımız için toplu müzakere ederiz — daha iyi koşullar elde edersiniz.'],['🔒','Garantili ödemeler','Casino ilişkisini biz yönetiriz. Haftalık olarak ödeme alırsınız.'],['📱','Özel araçlar','Kişisel promosyon kodları, takip bağlantıları, detaylı istatistikler.']],
    how_title:'NASIL ÇALIŞIR',
    how:[["01","WinPartners'a başvurun","Verileriniz ve sosyal profilinizle formu doldurun. 24-48 saat içinde inceleriz."],["02","Melbet kodunuzu alın","Kodunuz benzersiz ve size bağlıdır. Kullanan her oyuncu sonsuza dek sizindir."],["03","Kitlenize tanıtın","TikTok, Instagram, YouTube'da paylaşın — en iyi bildiğiniz şekilde."],["04","Otomatik kazanın","Oyuncularınız Melbet'te kaybettiğinde, kayıplarının %25'ini alırsınız. Haftalık, kripto olarak."]],
    stats:[['%25','RevShare Komisyon'],['48s','Onay süresi'],['7/24','Gerçek destek'],['$0','Kayıt maliyeti']]},
  de:{ login:'Anmelden', reg:'Registrieren', title:'ÜBER', title2:'WINPARTNERS', ready:'Bereit anzufangen?', cta:'JETZT BEWERBEN — KOSTENLOS',
    story_title:'WARUM WINPARTNERS EXISTIERT',
    story:"Das Problem mit direkten Casino-Partnerprogrammen ist ihre Komplexität. Sie müssen sich separat bei Melbet, 1xBet, Mostbet registrieren — jedes mit eigenem Dashboard, eigenen Berichten und eigenem Zahlungsweg.\n\nWinPartners löst das. Ein Konto. Ein Dashboard. Ein persönlicher Manager, der Sie kennt. Wir verhandeln direkt mit den Casinos und geben Ihnen die besten verfügbaren Provisionen — 25% Revenue Share lebenslang.",
    why_title:'WARUM WIR UND NICHT DIREKT BEI MELBET',
    why:[['⚡','Schneller Zugang','Bei Melbet können Sie tagelang auf die Genehmigung warten. Bei uns — 24-48 Stunden und Sie sind aktiv.'],['📊','Ein Dashboard','Alle Statistiken, Provisionen, Zahlungen — an einem Ort.'],['🤝','Persönlicher Manager','Kein Chatbot. Eine echte Person, die auf Telegram antwortet.'],['💰','Bessere Provisionen','Wir verhandeln gebündelt für alle unsere Partner — Sie erhalten bessere Konditionen.'],['🔒','Garantierte Zahlungen','Wir verwalten die Casino-Beziehung. Sie werden wöchentlich bezahlt.'],['📱','Dedizierte Tools','Individuelle Promo-Codes, Tracking-Links, detaillierte Statistiken.']],
    how_title:'WIE ES KONKRET FUNKTIONIERT',
    how:[['01','Bei WinPartners bewerben','Füllen Sie das Formular mit Ihren Daten und Ihrem sozialen Profil aus. Wir prüfen in 24-48 Stunden.'],['02','Ihren Melbet-Code erhalten','Ihr Code ist einzigartig und mit Ihnen verknüpft. Jeder Spieler, der ihn verwendet, gehört für immer zu Ihnen.'],['03','Für Ihr Publikum bewerben','Posten Sie auf TikTok, Instagram, YouTube — wie Sie es am besten wissen.'],['04','Automatisch verdienen','Wenn Ihre Spieler bei Melbet verlieren, erhalten Sie 25% ihrer Verluste. Wöchentlich in Krypto.']],
    stats:[['25%','RevShare Provision'],['48h','Genehmigungszeit'],['24/7','Echte Unterstützung'],['$0','Registrierungskosten']]},
  pt:{ login:'Entrar', reg:'Registrar', title:'SOBRE', title2:'WINPARTNERS', ready:'Pronto para começar?', cta:'CANDIDATAR-SE — GRÁTIS',
    story_title:'POR QUE O WINPARTNERS EXISTE',
    story:"O problema com os programas de afiliados diretos de casino é a complexidade. Você precisa se registrar separadamente no Melbet, 1xBet, Mostbet — cada um com seu próprio painel, relatórios e método de pagamento.\n\nO WinPartners resolve isso. Uma conta. Um painel. Um gerente pessoal que o conhece. Negociamos diretamente com os casinos e oferecemos as melhores comissões — 25% Revenue Share para sempre.",
    why_title:'POR QUE NÓS E NÃO DIRETAMENTE NO MELBET',
    why:[['⚡','Acesso rápido','No Melbet você pode esperar dias pela aprovação. Conosco — 24-48 horas e você está ativo.'],['📊','Painel único','Todas as estatísticas, comissões, pagamentos — em um só lugar.'],['🤝','Gerente pessoal','Não um chatbot. Uma pessoa real que responde no Telegram.'],['💰','Melhores comissões','Negociamos em bloco para todos os nossos parceiros — você obtém melhores condições.'],['🔒','Pagamentos garantidos','Gerenciamos o relacionamento com o casino. Você recebe semanalmente.'],['📱','Ferramentas dedicadas','Códigos promocionais personalizados, links de rastreamento, estatísticas detalhadas.']],
    how_title:'COMO FUNCIONA NA PRÁTICA',
    how:[['01','Candidatar-se no WinPartners','Preencha o formulário com seus dados e perfil social. Analisamos em 24-48 horas.'],['02','Receber o seu código Melbet','O código é único e vinculado a você. Qualquer jogador que o usar é seu para sempre.'],['03','Promover para o seu público','Publique no TikTok, Instagram, YouTube — como você sabe melhor.'],['04','Ganhar automaticamente','Quando seus jogadores perdem no Melbet, você recebe 25% das perdas deles. Semanalmente, em cripto.']],
    stats:[['25%','Comissão RevShare'],['48h','Tempo de aprovação'],['24/7','Suporte real'],['$0','Custo de registo']]},
  pl:{ login:'Zaloguj się', reg:'Rejestracja', title:'O', title2:'WINPARTNERS', ready:'Gotowy do startu?', cta:'APLIKUJ TERAZ — BEZPŁATNIE',
    story_title:'DLACZEGO WINPARTNERS ISTNIEJE',
    story:"Problem z bezpośrednimi programami partnerskimi kasyn polega na ich złożoności. Musisz rejestrować się osobno w Melbet, 1xBet, Mostbet — każde z własnym panelem, raportami i metodą płatności.\n\nWinPartners to rozwiązuje. Jedno konto. Jeden panel. Jeden osobisty menedżer, który Cię zna. Negocjujemy bezpośrednio z kasynami i dajemy Ci najlepsze dostępne prowizje — 25% Revenue Share dożywotnio.",
    why_title:'DLACZEGO MY, A NIE BEZPOŚREDNIO W MELBET',
    why:[['⚡','Szybki dostęp','W Melbet możesz czekać na zatwierdzenie dniami. U nas — 24-48 godzin i jesteś aktywny.'],['📊','Jeden panel','Wszystkie statystyki, prowizje, płatności — w jednym miejscu.'],['🤝','Osobisty menedżer','Nie chatbot. Prawdziwa osoba, która odpowiada na Telegramie.'],['💰','Lepsze prowizje','Negocjujemy zbiorczo dla wszystkich partnerów — otrzymujesz lepsze warunki.'],['🔒','Gwarantowane wypłaty','Zarządzamy relacją z kasynem. Otrzymujesz płatność co tydzień.'],['📱','Dedykowane narzędzia','Niestandardowe kody promo, linki śledzące, szczegółowe statystyki.']],
    how_title:'JAK TO DZIAŁA W PRAKTYCE',
    how:[['01','Złóż wniosek w WinPartners','Wypełnij formularz ze swoimi danymi i profilem społecznościowym. Sprawdzamy w 24-48 godzin.'],['02','Odbierz swój kod Melbet','Twój kod jest unikalny i powiązany z Tobą. Każdy gracz, który go użyje, jest Twój na zawsze.'],['03','Promuj dla swojej publiczności','Publikuj na TikTok, Instagram, YouTube — jak najlepiej umiesz.'],['04','Zarabiaj automatycznie','Gdy Twoi gracze przegrywają w Melbet, otrzymujesz 25% ich strat. Co tydzień, w krypto.']],
    stats:[['25%','Prowizja RevShare'],['48h','Czas zatwierdzenia'],['24/7','Prawdziwe wsparcie'],['$0','Koszt rejestracji']]},
}
export default function About() {
  const nav = useNavigate()
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
      <div style={{background:'linear-gradient(135deg,rgba(245,166,35,0.06) 0%,transparent 60%)',padding:'4rem 1.25rem 3rem',textAlign:'center',borderBottom:'1px solid rgba(245,166,35,0.08)'}}>
        <h1 style={{fontSize:'clamp(2.2rem,5vw,4rem)',fontWeight:900,letterSpacing:'-0.01em',lineHeight:1.05,marginBottom:20}}>{t.title} <span style={{color:gold}}>{t.title2}</span></h1>
        <div style={{display:'flex',gap:0,justifyContent:'center',flexWrap:'wrap',maxWidth:600,margin:'0 auto'}}>
          {t.stats.map(([v,l],i)=>(<div key={l} style={{padding:'1rem 1.5rem',borderLeft:i>0?'1px solid rgba(245,166,35,0.12)':'none',textAlign:'center'}}><div style={{fontSize:'clamp(1.6rem,3vw,2.4rem)',fontWeight:900,color:gold,lineHeight:1}}>{v}</div><div style={{fontSize:11,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'.08em',marginTop:4}}>{l}</div></div>))}
        </div>
      </div>
      <div style={{maxWidth:860,margin:'0 auto',padding:'3rem 1.25rem'}}>
        <div style={{marginBottom:'3.5rem'}}>
          <h2 style={{fontSize:'clamp(1.3rem,2.5vw,1.8rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.06em',color:gold,marginBottom:20}}>{t.story_title}</h2>
          {t.story.split('\n\n').map((p,i)=>(<p key={i} style={{fontSize:15,color:'rgba(255,255,255,0.65)',lineHeight:1.85,marginBottom:16}}>{p}</p>))}
        </div>
        <div style={{marginBottom:'3.5rem'}}>
          <h2 style={{fontSize:'clamp(1.3rem,2.5vw,1.8rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:24}}>{t.why_title}</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:14}}>
            {t.why.map(([icon,title,desc])=>(<div key={title} style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(245,166,35,0.1)',borderRadius:12,padding:'1.25rem',display:'flex',gap:14}}><span style={{fontSize:22,flexShrink:0,marginTop:2}}>{icon}</span><div><div style={{fontSize:14,fontWeight:700,color:'#fff',marginBottom:5}}>{title}</div><div style={{fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.6}}>{desc}</div></div></div>))}
          </div>
        </div>
        <div style={{marginBottom:'3.5rem'}}>
          <h2 style={{fontSize:'clamp(1.3rem,2.5vw,1.8rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:24}}>{t.how_title}</h2>
          <div style={{display:'flex',flexDirection:'column',gap:0}}>
            {t.how.map(([num,title,desc],i)=>(<div key={num} style={{display:'flex',gap:20,paddingBottom:i<3?28:0,position:'relative'}}>{i<3&&<div style={{position:'absolute',left:20,top:44,bottom:0,width:2,background:'rgba(245,166,35,0.15)'}}/>}<div style={{width:40,height:40,borderRadius:'50%',background:'rgba(245,166,35,0.1)',border:`2px solid ${gold}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:900,color:gold,flexShrink:0}}>{num}</div><div style={{paddingTop:8}}><div style={{fontSize:15,fontWeight:700,color:'#fff',marginBottom:5}}>{title}</div><div style={{fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.6}}>{desc}</div></div></div>))}
          </div>
        </div>
        <div style={{textAlign:'center',padding:'2.5rem',background:'rgba(245,166,35,0.05)',border:'1px solid rgba(245,166,35,0.2)',borderRadius:20}}>
          <div style={{fontSize:13,color:'rgba(255,255,255,0.4)',marginBottom:16,textTransform:'uppercase',letterSpacing:'.1em'}}>{t.ready}</div>
          <button onClick={()=>nav('/register')} style={{padding:'16px 40px',fontSize:15,fontWeight:800,cursor:'pointer',border:`2px solid ${gold}`,borderRadius:8,background:gold,color:'#000',textTransform:'uppercase',letterSpacing:'.05em',boxShadow:'0 8px 32px rgba(245,166,35,0.3)'}}>{t.cta}</button>
        </div>
      </div>
    </div>
  )
}
