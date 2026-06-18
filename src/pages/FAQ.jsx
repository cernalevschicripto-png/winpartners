import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const gold = '#f5a623'
const LANGS = ['ro','ru','en','tr','de','pt','pl']

const T = {
  ro:{ login:'Conectați-vă', reg:'Înregistrare', title:'ÎNTREBĂRI', title2:'FRECVENTE', sub:'Răspunsuri la cele mai comune întrebări',
    faqs:[
      ['Cât costă înregistrarea?','Înregistrarea este complet gratuită. Nu există costuri ascunse, taxe de aderare sau investiții minime.'],
      ['Cât timp durează aprobarea?','Contul dvs. va fi verificat și aprobat în maxim 24-48 ore lucrătoare de la înregistrare.'],
      ['Care este comisionul meu?','Primiți 25% din pierderile nete generate de jucătorii pe care îi recomandați, pe toată durata activității lor.'],
      ['Când și cum primesc plata?','Plățile se procesează săptămânal. Suma minimă pentru retragere este $30. Plătim prin Bitcoin, USDT, Ethereum, Skrill, Neteller sau Binance Pay.'],
      ['Pot solicita un cod promoțional personalizat?','Da! Din dashboard puteți trimite o cerere pentru un cod personalizat. Cererea se procesează în 24-48 ore.'],
      ['Cum funcționează programul de referrali?','Când invitați alt blogger în program, câștigați 3% din toate comisioanele lui pe viață.'],
      ['Pe ce platforme pot promova?','Puteți promova pe orice platformă: TikTok, Instagram, YouTube, Telegram, Facebook, Twitter, site-uri web etc.'],
      ['Statisticile sunt în timp real?','Statisticile se actualizează zilnic. Puteți vedea click-uri, înregistrări, depunători și comisioane.'],
      ['Ce se întâmplă dacă un jucător pierde bani?','Primiți 25% din pierderile nete ale jucătorilor. Cu cât joacă mai mult, cu atât câștigați mai mult.'],
      ['Pot să am mai multe coduri promoționale?','Da, puteți genera mai multe coduri pentru campanii sau platforme diferite. Fiecare cod este urmărit separat.'],
    ]},
  ru:{ login:'Войти', reg:'Регистрация', title:'ЧАСТО ЗАДАВАЕМЫЕ', title2:'ВОПРОСЫ', sub:'Ответы на самые распространённые вопросы',
    faqs:[
      ['Сколько стоит регистрация?','Регистрация полностью бесплатна. Нет скрытых платежей, вступительных взносов или минимальных инвестиций.'],
      ['Сколько времени занимает одобрение?','Ваш аккаунт будет проверен и одобрен в течение 24-48 рабочих часов с момента регистрации.'],
      ['Какова моя комиссия?','Вы получаете 25% от чистых проигрышей привлечённых игроков на протяжении всего времени их активности.'],
      ['Когда и как я получаю выплату?','Выплаты еженедельно. Минимум $30. Bitcoin, USDT, Ethereum, Skrill, Neteller или Binance Pay.'],
      ['Могу запросить персональный промокод?','Да! Из дашборда можно отправить запрос на персональный код. Обрабатывается за 24-48 часов.'],
      ['Как работает реферальная программа?','Приглашая другого блогера, вы получаете 3% от всех его комиссий пожизненно.'],
      ['На каких платформах можно продвигать?','TikTok, Instagram, YouTube, Telegram, Facebook, Twitter, сайты, блоги и т.д.'],
      ['Статистика в реальном времени?','Статистика обновляется ежедневно: клики, регистрации, депозитчики и комиссии.'],
      ['Что если игрок проигрывает?','Вы получаете 25% чистых проигрышей. Чем больше играют — тем больше вы зарабатываете.'],
      ['Могу иметь несколько промокодов?','Да, несколько кодов для разных кампаний. Каждый отслеживается отдельно.'],
    ]},
  en:{ login:'Login', reg:'Register', title:'FREQUENTLY ASKED', title2:'QUESTIONS', sub:'Answers to the most common questions',
    faqs:[
      ['How much does registration cost?','Registration is completely free. No hidden costs, membership fees, or minimum investments.'],
      ['How long does approval take?','Your account will be reviewed and approved within 24-48 working hours of registration.'],
      ['What is my commission?','You receive 25% of referred players net losses throughout their activity. Lifetime commission.'],
      ['When and how do I get paid?','Payments weekly. Minimum $30. Bitcoin, USDT, Ethereum, Skrill, Neteller, or Binance Pay.'],
      ['Can I request a custom promo code?','Yes! From the dashboard submit a request for a custom code. Processed in 24-48 hours.'],
      ['How does the referral program work?','When you invite another blogger with your referral link, you earn 3% of all their commissions for life.'],
      ['On which platforms can I promote?','TikTok, Instagram, YouTube, Telegram, Facebook, Twitter, websites, blogs, etc.'],
      ['Are statistics real-time?','Statistics updated daily: clicks, registrations, depositors, and commissions for each day.'],
      ['What if a player loses money?','You receive 25% of players net losses. The more they play, the more you earn.'],
      ['Can I have multiple promo codes?','Yes, multiple codes for different campaigns or platforms. Each tracked separately.'],
    ]},
  tr:{ login:'Giriş', reg:'Kayıt', title:'SIK SORULAN', title2:'SORULAR', sub:'En yaygın soruların cevapları',
    faqs:[
      ['Kayıt ücreti nedir?','Kayıt tamamen ücretsizdir. Gizli ücretler, üyelik bedelleri veya minimum yatırım yoktur.'],
      ['Onay ne kadar sürer?','Hesabınız kayıttan itibaren 24-48 iş saati içinde incelenip onaylanacaktır.'],
      ['Komisyonum nedir?','Yönlendirilen oyuncuların net kayıplarının %25 ini alırsınız. Ömür boyu komisyon.'],
      ['Ne zaman ve nasıl ödeme alırım?','Ödemeler haftalık. Minimum 30$. Bitcoin, USDT, Ethereum, Skrill, Neteller veya Binance Pay.'],
      ['Kişisel promosyon kodu talep edebilir miyim?','Evet! Panodan adınızla kişisel kod talebi gönderin. 24-48 saat içinde işlenir.'],
      ['Referans programı nasıl çalışır?','Başka bir blogger davet ettiğinizde, komisyonlarının %3 ünü ömür boyu kazanırsınız.'],
      ['Hangi platformlarda tanıtım yapabilirim?','TikTok, Instagram, YouTube, Telegram, Facebook, Twitter, web siteleri, bloglar vb.'],
      ['İstatistikler anlık mı?','İstatistikler günlük güncellenir: tıklamalar, kayıtlar, para yatıranlar ve komisyonlar.'],
      ['Oyuncu para kaybederse ne olur?','Oyuncuların net kayıplarının %25 ini alırsınız. Ne kadar çok oynarlarsa, o kadar çok kazanırsınız.'],
      ['Birden fazla promosyon kodum olabilir mi?','Evet, farklı kampanyalar için birden fazla kod. Her biri ayrı takip edilir.'],
    ]},
  de:{ login:'Anmelden', reg:'Registrieren', title:'HÄUFIG GESTELLTE', title2:'FRAGEN', sub:'Antworten auf die häufigsten Fragen',
    faqs:[
      ['Was kostet die Registrierung?','Die Registrierung ist völlig kostenlos. Keine versteckten Kosten oder Mindestinvestitionen.'],
      ['Wie lange dauert die Genehmigung?','Ihr Konto wird innerhalb von 24-48 Arbeitsstunden nach der Registrierung genehmigt.'],
      ['Wie hoch ist meine Provision?','Sie erhalten 25% der Nettoverluste der geworbenen Spieler. Lebenslange Provision.'],
      ['Wann und wie werde ich bezahlt?','Zahlungen wöchentlich. Mindestens $30. Bitcoin, USDT, Ethereum, Skrill, Neteller oder Binance Pay.'],
      ['Kann ich einen benutzerdefinierten Promo-Code anfordern?','Ja! Über das Dashboard beantragen Sie einen personalisierten Code. Bearbeitung in 24-48 Stunden.'],
      ['Wie funktioniert das Empfehlungsprogramm?','Wenn Sie einen anderen Blogger einladen, verdienen Sie lebenslang 3% seiner Provisionen.'],
      ['Auf welchen Plattformen kann ich werben?','TikTok, Instagram, YouTube, Telegram, Facebook, Twitter, Websites, Blogs usw.'],
      ['Sind die Statistiken in Echtzeit?','Statistiken täglich aktualisiert: Klicks, Registrierungen, Einzahler und Provisionen.'],
      ['Was passiert wenn ein Spieler verliert?','Sie erhalten 25% der Nettoverluste der Spieler. Je mehr sie spielen, desto mehr verdienen Sie.'],
      ['Kann ich mehrere Promo-Codes haben?','Ja, mehrere Codes für verschiedene Kampagnen. Jeder Code separat verfolgt.'],
    ]},
  pt:{ login:'Entrar', reg:'Registrar', title:'PERGUNTAS', title2:'FREQUENTES', sub:'Respostas às perguntas mais comuns',
    faqs:[
      ['Quanto custa o registo?','O registo é completamente gratuito. Sem custos ocultos, taxas de adesão ou investimentos mínimos.'],
      ['Quanto tempo demora a aprovação?','A sua conta será aprovada no prazo de 24-48 horas úteis após o registo.'],
      ['Qual é a minha comissão?','Recebe 25% das perdas líquidas dos jogadores indicados. Comissão vitalícia.'],
      ['Quando e como recebo o pagamento?','Pagamentos semanais. Mínimo $30. Bitcoin, USDT, Ethereum, Skrill, Neteller ou Binance Pay.'],
      ['Posso solicitar um código personalizado?','Sim! No painel envie um pedido de código personalizado. Processado em 24-48 horas.'],
      ['Como funciona o programa de referência?','Ao convidar outro blogger, ganha 3% de todas as comissões dele para sempre.'],
      ['Em que plataformas posso promover?','TikTok, Instagram, YouTube, Telegram, Facebook, Twitter, websites, blogs, etc.'],
      ['As estatísticas são em tempo real?','Estatísticas atualizadas diariamente: cliques, registos, depositantes e comissões.'],
      ['O que acontece se um jogador perder?','Recebe 25% das perdas líquidas dos jogadores. Quanto mais jogarem, mais ganha.'],
      ['Posso ter vários códigos?','Sim, vários códigos para diferentes campanhas. Cada um rastreado separadamente.'],
    ]},
  pl:{ login:'Zaloguj się', reg:'Rejestracja', title:'CZĘSTO ZADAWANE', title2:'PYTANIA', sub:'Odpowiedzi na najczęstsze pytania',
    faqs:[
      ['Ile kosztuje rejestracja?','Rejestracja jest całkowicie bezpłatna. Brak ukrytych kosztów, opłat członkowskich lub minimalnych inwestycji.'],
      ['Jak długo trwa zatwierdzenie?','Twoje konto zostanie zatwierdzone w ciągu 24-48 godzin roboczych od rejestracji.'],
      ['Jaka jest moja prowizja?','Otrzymujesz 25% strat netto poleconych graczy. Prowizja dożywotnia.'],
      ['Kiedy i jak otrzymuję płatność?','Płatności tygodniowe. Minimum $30. Bitcoin, USDT, Ethereum, Skrill, Neteller lub Binance Pay.'],
      ['Czy mogę poprosić o spersonalizowany kod?','Tak! Z panelu wyślij prośbę o spersonalizowany kod. Przetwarzane w 24-48 godzin.'],
      ['Jak działa program poleceń?','Zapraszając innego bloggera, zarabiasz 3% wszystkich jego prowizji dożywotnio.'],
      ['Na jakich platformach mogę promować?','TikTok, Instagram, YouTube, Telegram, Facebook, Twitter, strony internetowe, blogi itp.'],
      ['Czy statystyki są w czasie rzeczywistym?','Statystyki aktualizowane codziennie: kliknięcia, rejestracje, deponenci i prowizje.'],
      ['Co się dzieje gdy gracz przegrywa?','Otrzymujesz 25% strat netto graczy. Im więcej grają, tym więcej zarabiasz.'],
      ['Czy mogę mieć wiele kodów?','Tak, wiele kodów dla różnych kampanii. Każdy śledzony oddzielnie.'],
    ]},
}
export default function FAQ() {
  const [open, setOpen] = useState(null)
  const nav = useNavigate()
  const [lang, setLang] = useState(() => { const s = localStorage.getItem('wp_lang'); return LANGS.includes(s) ? s : 'ro' })
  // Auto-detect limba după locație (doar dacă nu a ales manual)
  useEffect(() => {
    if (localStorage.getItem('wp_lang')) return
    const countryToLang = {
      MD:'ro', RO:'ro',
      RU:'ru', BY:'ru', KZ:'ru', UA:'ru', UZ:'ru',
      TR:'tr',
      DE:'de', AT:'de', CH:'de',
      PT:'pt', BR:'pt',
      PL:'pl',
    }
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => { const l = countryToLang[d.country_code]; if (l) setLang(l) })
      .catch(() => {})
  }, [])
  const t = T[lang] || T.ro
  const setL = l => { setLang(l); localStorage.setItem('wp_lang', l) }
  return (
    <div style={{background:'#0a0a0f',minHeight:'100vh',color:'#fff',fontFamily:"'Inter',sans-serif"}}>
      <nav style={{background:'rgba(10,10,15,0.97)',borderBottom:'1px solid rgba(245,166,35,0.12)',padding:'0 1.25rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:60,position:'sticky',top:0,zIndex:50,flexWrap:'wrap',gap:4}}>
        <div onClick={()=>nav('/')} style={{fontSize:20,fontWeight:900,cursor:'pointer'}}><span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span></div>
        <div style={{display:'flex',gap:4,alignItems:'center',flexWrap:'wrap'}}>
          {LANGS.map(l=>(<button key={l} onClick={()=>setL(l)} style={{padding:'3px 6px',fontSize:10,fontWeight:700,cursor:'pointer',border:`1px solid ${lang===l?gold:'rgba(255,255,255,0.15)'}`,borderRadius:4,background:lang===l?'rgba(245,166,35,0.15)':'none',color:lang===l?gold:'rgba(255,255,255,0.4)'}}>{l.toUpperCase()}</button>))}
          <button onClick={()=>nav('/dashboard')} style={{marginLeft:4,padding:'6px 14px',fontSize:12,cursor:'pointer',border:'1px solid rgba(255,255,255,0.15)',borderRadius:4,background:'none',color:'#e2e8f0'}}>{t.login}</button>
          <button onClick={()=>nav('/register')} style={{padding:'6px 14px',fontSize:12,fontWeight:700,cursor:'pointer',border:'none',borderRadius:4,background:gold,color:'#000'}}>{t.reg}</button>
        </div>
      </nav>
      <div style={{maxWidth:800,margin:'0 auto',padding:'3rem 1.25rem'}}>
        <h1 style={{fontSize:'clamp(2rem,4vw,3rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:8}}>{t.title} <span style={{color:gold}}>{t.title2}</span></h1>
        <p style={{fontSize:15,color:'rgba(255,255,255,0.5)',marginBottom:40}}>{t.sub}</p>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {t.faqs.map(([q,a],i)=>(
            <div key={i} style={{background:'rgba(255,255,255,0.03)',border:`1px solid ${open===i?'rgba(245,166,35,0.3)':'rgba(255,255,255,0.07)'}`,borderRadius:10,overflow:'hidden',cursor:'pointer'}} onClick={()=>setOpen(open===i?null:i)}>
              <div style={{padding:'1.1rem 1.25rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:15,fontWeight:600,color:open===i?gold:'#fff'}}>{q}</span>
                <span style={{fontSize:20,color:open===i?gold:'rgba(255,255,255,0.3)',flexShrink:0,marginLeft:12,display:'inline-block',transition:'transform .2s',transform:open===i?'rotate(45deg)':'none'}}>+</span>
              </div>
              {open===i&&<div style={{padding:'0 1.25rem 1.1rem',fontSize:14,color:'rgba(255,255,255,0.6)',lineHeight:1.7,borderTop:'1px solid rgba(245,166,35,0.1)'}}>{a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
