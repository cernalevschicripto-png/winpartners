import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const gold = '#f5a623'
const LANGS = ['ro','ru','en','tr','de','pt','pl']
const COUNTRY_MAP = {MD:'ro',RO:'ro',RU:'ru',BY:'ru',KZ:'ru',UA:'ru',UZ:'ru',AM:'ru',AZ:'ru',GE:'ru',TJ:'ru',TM:'ru',KG:'ru',TR:'tr',DE:'de',AT:'de',CH:'de',PT:'pt',BR:'pt',PL:'pl'}

function useLang() {
  const [lang, setLang] = useState(() => { const s = localStorage.getItem('wp_lang'); return LANGS.includes(s) ? s : 'ro' })
  useEffect(() => {
    if (localStorage.getItem('wp_lang')) return
    const detect = async () => {
      try { const r = await fetch('https://ipapi.co/json/',{signal:AbortSignal.timeout(3000)}); const d = await r.json(); const _c=d.country_code;const l=(_c&&_c.length===2)?(COUNTRY_MAP[_c]||'en'):null; if(l){setLang(l);localStorage.setItem('wp_lang',l)} } catch {
        try { const r2 = await fetch('https://api.country.is/',{signal:AbortSignal.timeout(3000)}); const d2 = await r2.json(); const _c2=d2.country;const l2=(_c2&&_c2.length===2)?(COUNTRY_MAP[_c2]||'en'):null; if(l2){setLang(l2);localStorage.setItem('wp_lang',l2)} } catch {}
      }
    }
    detect()
  }, [])
  const setL = l => { setLang(l); localStorage.setItem('wp_lang', l) }
  return [lang, setL]
}

function PageNav({ lang, setL, t, nav }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const isMobile = window.innerWidth < 768
  return (
    <nav style={{background:'rgba(10,10,15,0.97)',borderBottom:'1px solid rgba(245,166,35,0.12)',padding:'0 1.25rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:60,position:'sticky',top:0,zIndex:100,backdropFilter:'blur(12px)'}}>
      <div onClick={()=>nav('/')} style={{cursor:'pointer',display:'flex',alignItems:'center',gap:8}}>
        <img src="/icons/logo.png" width="26" height="26" alt="W" style={{borderRadius:3}}/>
        <span style={{fontSize:16,fontWeight:900}}><span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span></span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:4,minWidth:0,overflowX:'auto',scrollbarWidth:'none'}}>
        <div style={{display:'flex',gap:2,background:'rgba(255,255,255,0.04)',borderRadius:6,padding:'2px 3px',border:'1px solid rgba(255,255,255,0.07)'}}>
          {LANGS.map(l=>(
            <button key={l} onClick={()=>setL(l)} style={{padding:'3px 7px',fontSize:10,fontWeight:700,cursor:'pointer',border:`1px solid ${lang===l?gold:'transparent'}`,borderRadius:4,background:lang===l?gold:'transparent',color:lang===l?'#000':'rgba(255,255,255,0.45)',transition:'all .15s'}}>{l.toUpperCase()}</button>
          ))}
        </div>
        <button onClick={()=>nav('/dashboard')} style={{padding:'6px 12px',fontSize:12,fontWeight:600,cursor:'pointer',border:'1px solid rgba(255,255,255,0.12)',borderRadius:5,background:'transparent',color:'rgba(255,255,255,0.6)'}}>{t.login}</button>
        <button onClick={()=>nav('/login')} style={{padding:'6px 14px',fontSize:12,fontWeight:800,cursor:'pointer',border:'1.5px solid '+gold,borderRadius:5,background:'rgba(245,166,35,0.15)',color:gold,letterSpacing:'.03em',whiteSpace:'nowrap'}}>{t.login}</button><button onClick={()=>nav('/register')} style={{padding:'6px 14px',fontSize:12,fontWeight:800,cursor:'pointer',border:'none',borderRadius:5,background:gold,color:'#000',textTransform:'uppercase',letterSpacing:'.03em'}}>{t.reg}</button>
      </div>
    </nav>
  )
}

function PageFooter({ nav, t }) {
  return (
    <footer style={{background:'#050508',borderTop:'1px solid rgba(245,166,35,0.08)',padding:'2rem 1.25rem',marginTop:'auto'}}>
      <div style={{maxWidth:900,margin:'0 auto',display:'flex',flexDirection:'column',alignItems:'center',gap:16,textAlign:'center'}}>
        <div style={{fontSize:16,fontWeight:900}}><span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span></div>
        <div style={{display:'flex',gap:20,flexWrap:'wrap',justifyContent:'center'}}>
          {[['/',t.home],['about',t.nav_about],['benefits',t.nav_ben],['faq','FAQ'],['contact',t.nav_contact]].map(([path,label])=>(
            <span key={path} onClick={()=>nav('/'+path)} style={{fontSize:12,color:'rgba(255,255,255,0.35)',cursor:'pointer',transition:'color .15s'}} onMouseOver={e=>e.target.style.color=gold} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.35)'}>{label}</span>
          ))}
        </div>
        <div style={{fontSize:11,color:'rgba(255,255,255,0.15)'}}>© 2026 WinPartners. All rights reserved.</div>
      </div>
    </footer>
  )
}

const T = {
  ro:{ login:'Conectați-vă', reg:'Înregistrare', home:'Acasă', nav_about:'Despre', nav_ben:'Beneficii', nav_contact:'Contact',
    title:'DESPRE', title2:'WINPARTNERS', ready:'Gata să începi?', cta:'APLICĂ ACUM — GRATUIT',
    story_title:'DE CE EXISTĂ WINPARTNERS',
    story:'Problema cu programele de afiliere directe la cazinouri este că sunt complicate. Trebuie să te înregistrezi separat la Melbet, 1xBet, Mostbet — fiecare cu propriul panou, propriile rapoarte, propria metodă de plată.\n\nWinPartners rezolvă asta. Un singur cont. Un singur dashboard. Un singur manager care te cunoaște personal. Noi negociem direct cu cazinourile și îți dăm cele mai bune comisioane — 25% Revenue Share pe viață.',
    why_title:'DE CE NOI ȘI NU DIRECT LA CAZINOURI',
    why:[['Acces rapid','La cazinourile direct poți aștepta zile pentru aprobare. La noi — 24-48 ore și ești activ.','#f5a623'],['Un singur dashboard','Toate statisticile, comisioanele, plățile — într-un singur loc.','#60a5fa'],['Manager personal','Nu un chatbot. O persoană reală care îți răspunde pe Telegram.','#10b981'],['Comisioane mai mari','Negociem în bloc pentru toți partenerii noștri — tu beneficiezi de condiții mai bune.','#a78bfa'],['Plăți garantate','Noi ne ocupăm de relația cu cazinoul. Tu primești banii săptămânal.','#f59e0b'],['Instrumente dedicate','Coduri promoționale personalizate, link-uri de tracking, statistici detaliate.','#34d399']],
    how_title:'CUM FUNCȚIONEAZĂ CONCRET',
    how:[['01','Aplici pe WinPartners','Completezi formularul cu datele tale și profilul social. Analizăm cererea în 24-48 ore.'],['02','Primești codul tău Melbet','Codul este unic și legat de tine. Orice jucător care îl folosește devine al tău pe viață.'],['03','Promovezi la audiența ta','Postezi pe TikTok, Instagram, YouTube — cum știi tu mai bine.'],['04','Câștigi automat','Când jucătorii tăi pierd pe Melbet, tu primești 25% din pierderile lor. Săptămânal, în crypto.']],
    stats:[['5','Cazinouri partenere'],['25%','RevShare garantat'],['24/7','Suport real'],['$0','Cost înregistrare']]},
  ru:{ login:'Войти', reg:'Регистрация', home:'Главная', nav_about:'О нас', nav_ben:'Преимущества', nav_contact:'Контакты',
    title:'О', title2:'WINPARTNERS', ready:'Готовы начать?', cta:'ПОДАТЬ ЗАЯВКУ — БЕСПЛАТНО',
    story_title:'ПОЧЕМУ СУЩЕСТВУЕТ WINPARTNERS',
    story:'Проблема с прямыми партнёрскими программами казино в том, что они сложные. Нужно регистрироваться отдельно в Melbet, 1xBet, Mostbet — у каждого свой кабинет, свои отчёты, свой способ оплаты.\n\nWinPartners решает это. Один аккаунт. Один дашборд. Один менеджер, который знает вас лично. Мы договариваемся с казино напрямую и даём вам лучшие условия — 25% Revenue Share пожизненно.',
    why_title:'ПОЧЕМУ МЫ, А НЕ НАПРЯМУЮ В КАЗИНО',
    why:[['Быстрый старт','В Melbet можно ждать одобрения днями. У нас — 24-48 часов и вы активны.','#f5a623'],['Единый дашборд','Вся статистика, все комиссии, все выплаты — в одном месте.','#60a5fa'],['Личный менеджер','Не чат-бот. Живой человек, который отвечает в Telegram.','#10b981'],['Лучшие условия','Мы договариваемся оптом для всех партнёров — вы получаете лучшие условия.','#a78bfa'],['Гарантированные выплаты','Мы управляем отношениями с казино. Вы получаете деньги еженедельно.','#f59e0b'],['Инструменты','Персональные промокоды, трекинг-ссылки, детальная статистика.','#34d399']],
    how_title:'КАК ЭТО РАБОТАЕТ КОНКРЕТНО',
    how:[['01','Подаёшь заявку','Заполняешь форму с данными и профилем. Рассматриваем заявку за 24-48 часов.'],['02','Получаешь свой код Melbet','Код уникальный и привязан к тебе. Любой игрок — твой навсегда.'],['03','Продвигаешь своей аудитории','Постишь в TikTok, Instagram, YouTube — как умеешь.'],['04','Зарабатываешь автоматически','Когда твои игроки проигрывают в Melbet, ты получаешь 25% от их потерь. Еженедельно в крипто.']],
    stats:[['25%','RevShare комиссия'],['48h','Время одобрения'],['24/7','Живая поддержка'],['$0','Стоимость регистрации']]},
  en:{ login:'Login', reg:'Register', home:'Home', nav_about:'About', nav_ben:'Benefits', nav_contact:'Contact',
    title:'ABOUT', title2:'WINPARTNERS', ready:'Ready to start?', cta:'APPLY NOW — FREE',
    story_title:'WHY WINPARTNERS EXISTS',
    story:"The problem with direct casino affiliate programs is complexity. You need to register separately at Melbet, 1xBet, Mostbet — each with its own dashboard, reports, and payment method.\n\nWinPartners solves this. One account. One dashboard. One personal manager who knows you. We negotiate directly with casinos and give you the best commissions — 25% Revenue Share for life.",
    why_title:'WHY US AND NOT DIRECTLY AT THE CASINOS',
    why:[['Fast access',"At Melbet you can wait days for approval. With us — 24-48 hours and you're active.",'#f5a623'],['Single dashboard','All statistics, commissions, payments — in one place.','#60a5fa'],['Personal manager','Not a chatbot. A real person who replies on Telegram.','#10b981'],['Better commissions','We negotiate in bulk for all our partners — you get better terms.','#a78bfa'],['Guaranteed payments','We manage the casino relationship. You get paid weekly, guaranteed.','#f59e0b'],['Dedicated tools','Custom promo codes, tracking links, detailed statistics.','#34d399']],
    how_title:'HOW IT WORKS IN PRACTICE',
    how:[['01','Apply on WinPartners','Fill out the form with your details and social profile. We review in 24-48 hours.'],['02','Get your Melbet code','Your code is unique and tied to you. Any player who uses it is yours for life.'],['03','Promote to your audience','Post on TikTok, Instagram, YouTube — however you know best.'],['04','Earn automatically',"When your players lose on Melbet, you receive 25% of their losses. Weekly, in crypto."]],
    stats:[['25%','RevShare commission'],['48h','Approval time'],['24/7','Real support'],['$0','Registration cost']]},
  tr:{ login:'Giriş', reg:'Kayıt', home:'Ana Sayfa', nav_about:'Hakkında', nav_ben:'Avantajlar', nav_contact:'İletişim',
    title:'HAKKINDA', title2:'WINPARTNERS', ready:'Başlamaya hazır mısınız?', cta:'BAŞVURUN — ÜCRETSİZ',
    story_title:'WINPARTNERS NEDEN VAR',
    story:"Doğrudan casino ortaklık programlarının sorunu karmaşıklıklarıdır. Melbet, 1xBet, Mostbet'e ayrı ayrı kaydolmanız gerekir.\n\nWinPartners bunu çözer. Tek hesap. Tek panel. Sizi kişisel olarak tanıyan tek bir yönetici. Casinolarla doğrudan müzakere eder ve size en iyi koşulları sunarız — ömür boyu %25 Revenue Share.",
    why_title:'NEDEN BİZ',
    why:[['Hızlı erişim',"Melbet'te onay için günlerce bekleyebilirsiniz. Bizde — 24-48 saat.",'#f5a623'],['Tek panel','Tüm istatistikler, komisyonlar, ödemeler — tek bir yerde.','#60a5fa'],['Kişisel yönetici',"Chatbot değil. Telegram'da cevap veren gerçek bir kişi.",'#10b981'],['Daha iyi komisyonlar','Tüm ortaklarımız için toplu müzakere ederiz.','#a78bfa'],['Garantili ödemeler','Casino ilişkisini biz yönetiriz. Haftalık olarak ödeme alırsınız.','#f59e0b'],['Özel araçlar','Kişisel promosyon kodları, takip bağlantıları, detaylı istatistikler.','#34d399']],
    how_title:'NASIL ÇALIŞIR',
    how:[["01","WinPartners'a başvurun","Verileriniz ve sosyal profilinizle formu doldurun. 24-48 saat içinde inceleriz."],["02","Melbet kodunuzu alın","Kodunuz benzersiz ve size bağlıdır. Kullanan her oyuncu sonsuza dek sizindir."],["03","Kitlenize tanıtın","TikTok, Instagram, YouTube'da paylaşın."],["04","Otomatik kazanın","Oyuncularınız Melbet'te kaybettiğinde, kayıplarının %25'ini alırsınız. Haftalık, kripto olarak."]],
    stats:[['%25','RevShare Komisyon'],['48s','Onay süresi'],['7/24','Gerçek destek'],['$0','Kayıt maliyeti']]},
  de:{ login:'Anmelden', reg:'Registrieren', home:'Startseite', nav_about:'Über uns', nav_ben:'Vorteile', nav_contact:'Kontakt',
    title:'ÜBER', title2:'WINPARTNERS', ready:'Bereit anzufangen?', cta:'JETZT BEWERBEN — KOSTENLOS',
    story_title:'WARUM WINPARTNERS EXISTIERT',
    story:"Das Problem mit direkten Casino-Partnerprogrammen ist ihre Komplexität. Sie müssen sich separat bei Melbet, 1xBet, Mostbet registrieren.\n\nWinPartners löst das. Ein Konto. Ein Dashboard. Ein persönlicher Manager, der Sie kennt. Wir verhandeln direkt mit den Casinos — 25% Revenue Share lebenslang.",
    why_title:'WARUM WIR',
    why:[['Schneller Zugang','Bei Melbet können Sie tagelang auf die Genehmigung warten. Bei uns — 24-48 Stunden.','#f5a623'],['Ein Dashboard','Alle Statistiken, Provisionen, Zahlungen — an einem Ort.','#60a5fa'],['Persönlicher Manager','Kein Chatbot. Eine echte Person, die auf Telegram antwortet.','#10b981'],['Bessere Provisionen','Wir verhandeln gebündelt für alle unsere Partner.','#a78bfa'],['Garantierte Zahlungen','Wir verwalten die Casino-Beziehung. Sie werden wöchentlich bezahlt.','#f59e0b'],['Dedizierte Tools','Individuelle Promo-Codes, Tracking-Links, detaillierte Statistiken.','#34d399']],
    how_title:'WIE ES KONKRET FUNKTIONIERT',
    how:[['01','Bei WinPartners bewerben','Füllen Sie das Formular mit Ihren Daten aus. Wir prüfen in 24-48 Stunden.'],['02','Ihren Melbet-Code erhalten','Ihr Code ist einzigartig. Jeder Spieler, der ihn verwendet, gehört für immer zu Ihnen.'],['03','Für Ihr Publikum bewerben','Posten Sie auf TikTok, Instagram, YouTube.'],['04','Automatisch verdienen','Wenn Ihre Spieler bei Melbet verlieren, erhalten Sie 25% ihrer Verluste. Wöchentlich in Krypto.']],
    stats:[['25%','RevShare Provision'],['48h','Genehmigungszeit'],['24/7','Echte Unterstützung'],['$0','Registrierungskosten']]},
  pt:{ login:'Entrar', reg:'Registrar', home:'Início', nav_about:'Sobre', nav_ben:'Benefícios', nav_contact:'Contacto',
    title:'SOBRE', title2:'WINPARTNERS', ready:'Pronto para começar?', cta:'CANDIDATAR-SE — GRÁTIS',
    story_title:'POR QUE O WINPARTNERS EXISTE',
    story:"O problema com os programas de afiliados diretos de casino é a complexidade. Você precisa se registrar separadamente no Melbet, 1xBet, Mostbet.\n\nO WinPartners resolve isso. Uma conta. Um painel. Um gerente pessoal que o conhece. Negociamos diretamente com os casinos — 25% Revenue Share para sempre.",
    why_title:'POR QUE NÓS',
    why:[['Acesso rápido','No Melbet você pode esperar dias pela aprovação. Conosco — 24-48 horas.','#f5a623'],['Painel único','Todas as estatísticas, comissões, pagamentos — em um só lugar.','#60a5fa'],['Gerente pessoal','Não um chatbot. Uma pessoa real que responde no Telegram.','#10b981'],['Melhores comissões','Negociamos em bloco para todos os nossos parceiros.','#a78bfa'],['Pagamentos garantidos','Gerenciamos o relacionamento com o casino. Você recebe semanalmente.','#f59e0b'],['Ferramentas dedicadas','Códigos promocionais personalizados, links de rastreamento, estatísticas detalhadas.','#34d399']],
    how_title:'COMO FUNCIONA NA PRÁTICA',
    how:[['01','Candidatar-se no WinPartners','Preencha o formulário com seus dados e perfil social. Analisamos em 24-48 horas.'],['02','Receber o seu código Melbet','O código é único e vinculado a você. Qualquer jogador que o usar é seu para sempre.'],['03','Promover para o seu público','Publique no TikTok, Instagram, YouTube.'],['04','Ganhar automaticamente','Quando seus jogadores perdem no Melbet, você recebe 25% das perdas deles. Semanalmente, em cripto.']],
    stats:[['25%','Comissão RevShare'],['48h','Tempo de aprovação'],['24/7','Suporte real'],['$0','Custo de registo']]},
  pl:{ login:'Zaloguj się', reg:'Rejestracja', home:'Strona główna', nav_about:'O nas', nav_ben:'Korzyści', nav_contact:'Kontakt',
    title:'O', title2:'WINPARTNERS', ready:'Gotowy do startu?', cta:'APLIKUJ TERAZ — BEZPŁATNIE',
    story_title:'DLACZEGO WINPARTNERS ISTNIEJE',
    story:"Problem z bezpośrednimi programami partnerskimi kasyn polega na ich złożoności. Musisz rejestrować się osobno w Melbet, 1xBet, Mostbet.\n\nWinPartners to rozwiązuje. Jedno konto. Jeden panel. Jeden osobisty menedżer, który Cię zna. Negocjujemy bezpośrednio z kasynami — 25% Revenue Share dożywotnio.",
    why_title:'DLACZEGO MY',
    why:[['Szybki dostęp','W Melbet możesz czekać na zatwierdzenie dniami. U nas — 24-48 godzin.','#f5a623'],['Jeden panel','Wszystkie statystyki, prowizje, płatności — w jednym miejscu.','#60a5fa'],['Osobisty menedżer','Nie chatbot. Prawdziwa osoba, która odpowiada na Telegramie.','#10b981'],['Lepsze prowizje','Negocjujemy zbiorczo dla wszystkich partnerów.','#a78bfa'],['Gwarantowane wypłaty','Zarządzamy relacją z kasynem. Otrzymujesz płatność co tydzień.','#f59e0b'],['Dedykowane narzędzia','Niestandardowe kody promo, linki śledzące, szczegółowe statystyki.','#34d399']],
    how_title:'JAK TO DZIAŁA W PRAKTYCE',
    how:[['01','Złóż wniosek w WinPartners','Wypełnij formularz ze swoimi danymi i profilem społecznościowym. Sprawdzamy w 24-48 godzin.'],['02','Odbierz swój kod Melbet','Twój kod jest unikalny i powiązany z Tobą. Każdy gracz, który go użyje, jest Twój na zawsze.'],['03','Promuj dla swojej publiczności','Publikuj na TikTok, Instagram, YouTube.'],['04','Zarabiaj automatycznie','Gdy Twoi gracze przegrywają w Melbet, otrzymujesz 25% ich strat. Co tydzień, w krypto.']],
    stats:[['25%','Prowizja RevShare'],['48h','Czas zatwierdzenia'],['24/7','Prawdziwe wsparcie'],['$0','Koszt rejestracji']]},
}

const WHY_ICONS = [
  () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
]

export default function About() {
  const nav = useNavigate()
  const [lang, setL] = useLang()
  const t = T[lang] || T.ro
  const isMobile = window.innerWidth < 768

  return (
    <div style={{background:'#0a0a0f',minHeight:'100vh',color:'#fff',fontFamily:"'Inter',sans-serif",overflowX:'hidden',display:'flex',flexDirection:'column'}}>
      <PageNav lang={lang} setL={setL} t={t} nav={nav}/>

      {/* Hero */}
      <div style={{background:'linear-gradient(135deg,rgba(245,166,35,0.07) 0%,transparent 65%)',borderBottom:'1px solid rgba(245,166,35,0.08)',padding:isMobile?'2.5rem 1.25rem 2rem':'4rem 2rem 3rem',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:500,height:500,background:'radial-gradient(ellipse,rgba(245,166,35,0.05) 0%,transparent 65%)',pointerEvents:'none'}}/>
        <div style={{position:'relative',zIndex:1}}>
          <h1 style={{fontSize:'clamp(2rem,4.5vw,3.5rem)',fontWeight:900,letterSpacing:'.02em',lineHeight:1.05,marginBottom:16}}>
            {t.title} <span style={{color:gold}}>{t.title2}</span>
          </h1>
          <div style={{width:40,height:3,background:gold,margin:'0 auto 20px',borderRadius:2}}/>
          <div style={{display:'flex',gap:0,justifyContent:'center',flexWrap:'wrap',maxWidth:560,margin:'0 auto'}}>
            {t.stats.map(([v,l],i)=>(
              <div key={l} style={{padding:isMobile?'.75rem 1rem':'1rem 1.75rem',borderLeft:i>0?'1px solid rgba(245,166,35,0.1)':'none',textAlign:'center'}}>
                <div style={{fontSize:isMobile?22:32,fontWeight:900,color:gold,lineHeight:1}}>{v}</div>
                <div style={{fontSize:10,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'.08em',marginTop:4}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:880,margin:'0 auto',padding:isMobile?'2rem 1.25rem':'3.5rem 2rem',flex:1}}>

        {/* Story */}
        <div style={{marginBottom:'3rem'}}>
          <h2 style={{fontSize:'clamp(1.2rem,2.5vw,1.7rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.06em',color:gold,marginBottom:20}}>{t.story_title}</h2>
          {t.story.split('\n\n').map((p,i)=>(
            <p key={i} style={{fontSize:15,color:'rgba(255,255,255,0.6)',lineHeight:1.85,marginBottom:14}}>{p}</p>
          ))}
        </div>

        {/* Why us */}
        <div style={{marginBottom:'3rem'}}>
          <h2 style={{fontSize:'clamp(1.2rem,2.5vw,1.7rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:20}}>{t.why_title}</h2>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(auto-fit,minmax(260px,1fr))',gap:14}}>
            {t.why.map(([title,desc,color],i)=>{
              const Icon = WHY_ICONS[i]
              return (
                <div key={title} style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.07)',borderLeft:`3px solid ${color}40`,borderRadius:12,padding:'1.25rem',display:'flex',gap:14,transition:'border-color .2s'}} onMouseOver={e=>e.currentTarget.style.borderLeftColor=`${color}80`} onMouseOut={e=>e.currentTarget.style.borderLeftColor=`${color}40`}>
                  <div style={{width:44,height:44,background:`${color}12`,border:`1px solid ${color}25`,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color}}>
                    <Icon/>
                  </div>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,color:'rgba(255,255,255,0.9)',marginBottom:5}}>{title}</div>
                    <div style={{fontSize:13,color:'rgba(255,255,255,0.45)',lineHeight:1.65}}>{desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* How it works */}
        <div style={{marginBottom:'3rem'}}>
          <h2 style={{fontSize:'clamp(1.2rem,2.5vw,1.7rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:24}}>{t.how_title}</h2>
          <div style={{display:'flex',flexDirection:'column',gap:0}}>
            {t.how.map(([num,title,desc],i)=>(
              <div key={num} style={{display:'flex',gap:20,paddingBottom:i<3?24:0,position:'relative'}}>
                {i<3 && <div style={{position:'absolute',left:18,top:40,bottom:0,width:2,background:`linear-gradient(180deg,rgba(245,166,35,0.3),rgba(245,166,35,0.05))`}}/>}
                <div style={{width:38,height:38,borderRadius:'50%',background:'rgba(245,166,35,0.08)',border:`2px solid ${gold}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:gold,flexShrink:0,boxShadow:'0 0 16px rgba(245,166,35,0.12)'}}>{num}</div>
                <div style={{paddingTop:6}}>
                  <div style={{fontSize:15,fontWeight:700,color:'rgba(255,255,255,0.9)',marginBottom:5}}>{title}</div>
                  <div style={{fontSize:13,color:'rgba(255,255,255,0.45)',lineHeight:1.65}}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{textAlign:'center',padding:'2.5rem',background:'rgba(245,166,35,0.04)',border:'1px solid rgba(245,166,35,0.15)',borderRadius:16}}>
          <p style={{fontSize:13,color:'rgba(255,255,255,0.35)',marginBottom:16,textTransform:'uppercase',letterSpacing:'.08em'}}>{t.ready}</p>
          <button onClick={()=>nav('/register')} style={{padding:'14px 40px',fontSize:14,fontWeight:800,cursor:'pointer',border:'none',borderRadius:7,background:gold,color:'#000',textTransform:'uppercase',letterSpacing:'.05em',boxShadow:'0 6px 28px rgba(245,166,35,0.28)',transition:'box-shadow .15s,transform .1s'}} onMouseOver={e=>{e.currentTarget.style.boxShadow='0 10px 36px rgba(245,166,35,0.4)';e.currentTarget.style.transform='translateY(-1px)'}} onMouseOut={e=>{e.currentTarget.style.boxShadow='0 6px 28px rgba(245,166,35,0.28)';e.currentTarget.style.transform='none'}}>{t.cta}</button>
        </div>
      </div>

      <PageFooter nav={nav} t={t}/>
    </div>
  )
}
