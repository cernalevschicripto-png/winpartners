import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  loginBlogger,
  getBloggers,
  getCasinoStats, subscribeCasinoStats,
  getNextAvailableCode, subscribePromoCodes, updateBloggerFields,
  addCustomRequest, subscribeCustomRequests,
  addNotification, requestPayout,
  sendMessage, subscribeConversation, markConversationRead,
  requestPasswordReset, sendResetEmail,
  getMyReferralEarnings,
} from '../db.js'

const gold = '#f5a623'
const goldSoft = '#f7cd7a'
const bg = '#0d0d15'
const bgCard = '#191922'
const bgSide = '#141420'
const bgHeader = '#141420'
const bdr = 'rgba(255,255,255,0.08)'
const txt = '#f3f2ec'
const txtSub = '#9a9aa6'

// ============================================================
// STORAGE — Firebase Realtime Database (sync în timp real)
// ============================================================
// Funcțiile de localStorage sunt înlocuite de Firebase db.js
// Rămân stub-uri goale pentru compatibilitate cu codul vechi

// Coada de coduri REALE Melbet — generate din panoul partners.melbet.com
// Aceste coduri sunt valide și active în sistemul Melbet
const CODE_QUEUE = {
  melbet: [
    'ml_2738117',  // ID Melbet: 11035387
    'ml_2796938',  // ID Melbet: 11180407
    'ml_2796939',  // ID Melbet: 11180417
    'ml_2796940',  // ID Melbet: 11180418
    'ml_2796941',  // ID Melbet: 11180419
    'ml_2796942',  // ID Melbet: 11180420
    'ml_2796943',  // ID Melbet: 11180421
    'ml_2796944',  // ID Melbet: 11180422
    'ml_2796945',  // ID Melbet: 11180423
    'ml_2796946',  // ID Melbet: 11180424
  ],
  // Alte cazinouri — coduri de adăugat după înregistrare
  xbet:        [],
  mostbet:     [],
  spinbetter:  [],
  betwinner:  [],
}

// Lăsat stub pentru compatibilitate

// Datele bloggerului vin din Firebase/localStorage prin loginBlogger()

const MENU_T = {
  ro: {main:'Pagina principală',s1:'MENIU PRINCIPAL',sites:'Site-uri',comm:'Structura comisionului',pays:'Istoricul plăților',account:'Cont',contact:'Contacte',s2:'LINK-URI DE TRACKING',links:'Link-uri Afiliați',promo:'Coduri Promoționale',media:'Media',cazinouri:'Cazinouri Partenere',s3:'RAPOARTE',summary:'Rezumat',report:'Raport complet',mkttools:'Instrumente de marketing',players:'Raport jucători',subaff:'Bloggeri invitați'},
  ru: {main:'Главная',s1:'ГЛАВНОЕ МЕНЮ',sites:'Сайты',comm:'Структура комиссий',pays:'История выплат',account:'Аккаунт',contact:'Контакты',s2:'ОТСЛЕЖИВАНИЕ ССЫЛОК',links:'Партнёрские ссылки',promo:'Промокоды',media:'Медиа',cazinouri:'Казино-партнёры',s3:'ОТЧЁТЫ',summary:'Сводка',report:'Полный отчёт',mkttools:'Маркетинговые инструменты',players:'Отчёт по игрокам',subaff:'Приглашённые блогеры'},
  en: {main:'Dashboard',s1:'MAIN MENU',sites:'Sites',comm:'Commission structure',pays:'Payment history',account:'Account',contact:'Contact',s2:'TRACKING LINKS',links:'Affiliate links',promo:'Promo codes',media:'Media',cazinouri:'Partner casinos',s3:'REPORTS',summary:'Summary',report:'Full report',mkttools:'Marketing tools',players:'Player report',subaff:'Invited bloggers'},
  tr: {main:'Ana sayfa',s1:'ANA MENÜ',sites:'Siteler',comm:'Komisyon yapısı',pays:'Ödeme geçmişi',account:'Hesap',contact:'İletişim',s2:'TAKİP LİNKLERİ',links:'Ortaklık linkleri',promo:'Promosyon kodları',media:'Medya',cazinouri:'Ortak casinolar',s3:'RAPORLAR',summary:'Özet',report:'Tam rapor',mkttools:'Pazarlama araçları',players:'Oyuncu raporu',subaff:'Davet edilen bloggerlar'},
  de: {main:'Startseite',s1:'HAUPTMENÜ',sites:'Webseiten',comm:'Provisionsstruktur',pays:'Zahlungsverlauf',account:'Konto',contact:'Kontakt',s2:'TRACKING-LINKS',links:'Affiliate-Links',promo:'Promo-Codes',media:'Medien',cazinouri:'Partner-Casinos',s3:'BERICHTE',summary:'Zusammenfassung',report:'Vollständiger Bericht',mkttools:'Marketing-Tools',players:'Spielerbericht',subaff:'Eingeladene Blogger'},
  pt: {main:'Painel',s1:'MENU PRINCIPAL',sites:'Sites',comm:'Estrutura de comissões',pays:'Histórico de pagamentos',account:'Conta',contact:'Contacto',s2:'LINKS DE RASTREIO',links:'Links de afiliado',promo:'Códigos promocionais',media:'Média',cazinouri:'Casinos parceiros',s3:'RELATÓRIOS',summary:'Resumo',report:'Relatório completo',mkttools:'Ferramentas de marketing',players:'Relatório de jogadores',subaff:'Bloggers convidados'},
  pl: {main:'Panel główny',s1:'MENU GŁÓWNE',sites:'Strony',comm:'Struktura prowizji',pays:'Historia płatności',account:'Konto',contact:'Kontakt',s2:'LINKI ŚLEDZENIA',links:'Linki partnerskie',promo:'Kody promocyjne',media:'Media',cazinouri:'Kasyna partnerskie',s3:'RAPORTY',summary:'Podsumowanie',report:'Pełny raport',mkttools:'Narzędzia marketingowe',players:'Raport graczy',subaff:'Zaproszeni blogerzy'},
}

// ============================================================
// CAZINOURI - sistemmulti-casino cu promcoduri
// ============================================================
// Statistici per casino per blogger — admin le actualizează manual din panoul secret
// Cheia: wp_casino_stats_{username}_{casinoId}
// loadCasinoStats înlocuită de subscribeCasinoStats din db.js

const CASINOS_BASE = [
  {
    id: 'melbet',
    name: 'Melbet',
    logo: '🏆',
    color: '#f5a623',
    commissionPct: 25,
    commission: {ro:'25% Revenue Share',ru:'25% Revenue Share',en:'25% Revenue Share',tr:'25% Revenue Share',de:'25% Revenue Share',pt:'25% Revenue Share',pl:'25% Revenue Share'},
    description: {ro:'Casino + sporturi · lider în Moldova și România · cod numeric sau personalizat',ru:'Казино + спорт · лидер в Молдове и Румынии · числовой или именной промокод',en:'Casino + sports · leader in Moldova and Romania · numeric or custom promo code',tr:'Casino + spor · Moldova ve Romanya lideri · sayısal veya özel promosyon kodu',de:'Casino + Sport · Marktführer in Moldau und Rumänien · numerischer/personalisierter Promo-Code',pt:'Casino + desporto · líder na Moldávia e Roménia · código numérico ou personalizado',pl:'Kasyno + sport · lider w Mołdawii i Rumunii · numeryczny lub własny kod promo'},
    minPayout: '$30',
    payFreq: 'Săptămânal',
    affLink: 'https://melbetpartners.com',
    affId: '5666408',
    geo: 'RO, MD, RU, EU',
    active: true,
  },
  {
    id: 'xbet',
    name: '1xBet',
    logo: '🎲',
    color: '#1565c0',
    commissionPct: 40,
    commission: {ro:'40% Revenue Share',ru:'40% Revenue Share',en:'40% Revenue Share',tr:'40% Revenue Share',de:'40% Revenue Share',pt:'40% Revenue Share',pl:'40% Revenue Share'},
    description: {ro:'Cel mai mare bookmaker global · 500K+ parteneri · 61 limbi',ru:'Крупнейший глобальный букмекер · 500K+ партнёров · 61 язык',en:'The largest global bookmaker · 500K+ partners · 61 languages',tr:'En büyük küresel bahis şirketi · 500K+ ortak · 61 dil',de:'Der größte globale Buchmacher · 500K+ Partner · 61 Sprachen',pt:'A maior casa de apostas global · 500K+ parceiros · 61 idiomas',pl:'Największy globalny bukmacher · 500K+ partnerów · 61 języków'},
    minPayout: '$30',
    payFreq: 'Săptămânal',
    affLink: 'https://1xpartners.com',
    affId: '5751730',
    geo: 'Global · RO, MD, RU',
    active: true,
  },
  {
    id: 'mostbet',
    name: 'Mostbet',
    logo: '🎯',
    color: '#10b981',
    commissionPct: 60,
    commission: {ro:'60% Revenue Share',ru:'60% Revenue Share',en:'60% Revenue Share',tr:'60% Revenue Share',de:'60% Revenue Share',pt:'60% Revenue Share',pl:'60% Revenue Share'},
    description: {ro:'Perfect pentru Moldova și CIS · RevShare pe viață · 90+ țări',ru:'Идеально для Молдовы и СНГ · RevShare пожизненно · 90+ стран',en:'Perfect for Moldova and CIS · lifetime RevShare · 90+ countries',tr:'Moldova ve BDT için ideal · ömür boyu RevShare · 90+ ülke',de:'Perfekt für Moldau und GUS · lebenslanger RevShare · 90+ Länder',pt:'Perfeito para Moldávia e CEI · RevShare vitalício · 90+ países',pl:'Idealny dla Mołdawii i WNP · RevShare dożywotnio · 90+ krajów'},
    minPayout: '$50',
    payFreq: 'Lunar',
    affLink: 'https://mostbet.partners',
    geo: 'MD, RU, UA, KZ, EU',
    comingSoon: true,
  },
  {
    id: 'spinbetter',
    name: 'SpinBetter',
    logo: '🌀',
    color: '#7c3aed',
    commissionPct: 50,
    commission: {ro:'50% Revenue Share',ru:'50% Revenue Share',en:'50% Revenue Share',tr:'50% Revenue Share',de:'50% Revenue Share',pt:'50% Revenue Share',pl:'50% Revenue Share'},
    description: {ro:'Casino + pariuri sportive · 8000+ jocuri · creștere 45% în 2024',ru:'Казино + ставки на спорт · 8000+ игр · рост 45% в 2024',en:'Casino + sports betting · 8000+ games · 45% growth in 2024',tr:'Casino + spor bahisleri · 8000+ oyun · 2024 yılında %45 büyüme',de:'Casino + Sportwetten · 8000+ Spiele · 45% Wachstum 2024',pt:'Casino + apostas desportivas · 8000+ jogos · crescimento de 45% em 2024',pl:'Kasyno + zakłady sportowe · 8000+ gier · wzrost 45% w 2024'},
    minPayout: '$30',
    payFreq: 'Săptămânal',
    affLink: 'https://spinbetterpartners.com',
    geo: 'RO, MD, EU, CIS',
    comingSoon: true,
  },
  {
    id: 'betwinner',
    name: 'BetWinner',
    logo: '⚡',
    color: '#84cc16',
    commissionPct: 25,
    commission: {ro:'25% Revenue Share',ru:'25% Revenue Share',en:'25% Revenue Share',tr:'25% Revenue Share',de:'25% Revenue Share',pt:'25% Revenue Share',pl:'25% Revenue Share'},
    description: {ro:'Casino + pariuri sportive · puternic în RO, MD și CIS · RevShare pe viață',ru:'Казино + ставки на спорт · силён в RO, MD и СНГ · RevShare пожизненно',en:'Casino + sports betting · strong in RO, MD and CIS · lifetime RevShare',tr:'Casino + spor bahisleri · RO, MD ve BDT bölgesinde güçlü · ömür boyu RevShare',de:'Casino + Sportwetten · stark in RO, MD und GUS · lebenslanger RevShare',pt:'Casino + apostas desportivas · forte em RO, MD e CEI · RevShare vitalício',pl:'Kasyno + zakłady sportowe · mocny w RO, MD i WNP · RevShare dożywotnio'},
    minPayout: '$30',
    payFreq: 'Săptămânal',
    affLink: 'https://betwinneraffiliates.com',
    geo: 'RO, MD, RU, CIS, EU',
    comingSoon: false,
  },
]

// Generează linkul de jucători Melbet pentru un cod promoțional
// Format: https://refpa3665.com/L?tag=d_{AffID}m_{campanie}c_{cod}
const MELBET_AFF_ID = '5666408'
const MELBET_CAMPAIGN = '2170'
function getMelbetPlayerLink(promoCode) {
  return `https://refpa3665.com/L?tag=d_${MELBET_AFF_ID}m_${MELBET_CAMPAIGN}c_${promoCode}&site=${MELBET_AFF_ID}&ad=${MELBET_CAMPAIGN}`
}

// Link jucători 1xBet — format: https://refpa86112.pro/L?tag=s_{AffID}m_{campanie}c_{cod}
const XBET_AFF_ID = '5751730'
const XBET_CAMPAIGN = '355'
function get1xBetPlayerLink(promoCode) {
  return `https://refpa86112.pro/L?tag=s_${XBET_AFF_ID}m_${XBET_CAMPAIGN}c_${promoCode}&site=${XBET_AFF_ID}&ad=${XBET_CAMPAIGN}`
}

// Link jucători per cazino (null dacă nu există încă)
function getCasinoPlayerLink(casinoId, promoCode) {
  if (casinoId === 'melbet') return getMelbetPlayerLink(promoCode)
  if (casinoId === 'xbet') return get1xBetPlayerLink(promoCode)
  return null
}

// buildCasinos eliminat — CASINOS se calculează în DashboardContent din casinoStats Firebase

// Promcoduri demo per casino (în producție vin din admin)
const DEMO_CODES = {
  xbet:       ['1X001','1X002','1X003','1X004','1X005'],
  mostbet:    ['MB001','MB002','MB003','MB004','MB005'],
  spinbetter: ['SB001','SB002','SB003','SB004','SB005'],
  betwinner:  ['BW001','BW002','BW003','BW004','BW005'],
}


function LineChart({data,field,color,h=60}) {
  const vals=data.map(d=>d[field]),max=Math.max(...vals,1)
  const W=400,H=h
  const pts=data.map((d,i)=>[(i/(data.length-1))*W,H-((d[field]/max)*(H-8))-4])
  const path=pts.map((p,i)=>(i===0?`M${p[0]},${p[1]}`:`L${p[0]},${p[1]}`)).join(' ')
  const area=`${path} L${W},${H} L0,${H} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:h,overflow:'visible'}}>
      <defs>
        <linearGradient id={`g${field}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.01"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#g${field})`}/>
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill={color} stroke="#fff" strokeWidth="1.5"/>)}
    </svg>
  )
}

// ─── LOGIN SCREEN ───────────────────────────────────────────
const LOGIN_T = {
  ro: { sub:'Platforma oficială de afiliere casino', title:'Intră în cont', user:'Username sau email', pass:'Parolă', btn:'INTRĂ ÎN CONT', loading:'⏳ Se verifică...', noAcc:'Nu ai cont?', apply:'Aplică acum', errEmpty:'Completează username/email și parola', errWrong:'Username/email sau parolă incorectă', errPending:'Contul tău este în așteptare. Contactează adminul.', errConn:'Eroare de conexiune. Verifică internetul.' },
  ru: { sub:'Официальная партнёрская платформа казино', title:'Войти в аккаунт', user:'Имя пользователя или email', pass:'Пароль', btn:'ВОЙТИ', loading:'⏳ Проверка...', noAcc:'Нет аккаунта?', apply:'Подать заявку', errEmpty:'Введите имя пользователя или email и пароль', errWrong:'Неверный логин или пароль', errPending:'Ваш аккаунт ожидает одобрения. Свяжитесь с администратором.', errConn:'Ошибка подключения. Проверьте интернет.' },
  en: { sub:'Official casino affiliate platform', title:'Log in to your account', user:'Username or email', pass:'Password', btn:'LOG IN', loading:'⏳ Checking...', noAcc:"Don't have an account?", apply:'Apply now', errEmpty:'Enter your username or email and password', errWrong:'Incorrect username/email or password', errPending:'Your account is pending approval. Contact the admin.', errConn:'Connection error. Check your internet.' },
  tr: { sub:'Resmi casino ortaklık platformu', title:'Hesabınıza giriş yapın', user:'Kullanıcı adı veya e-posta', pass:'Şifre', btn:'GİRİŞ YAP', loading:'⏳ Kontrol ediliyor...', noAcc:'Hesabınız yok mu?', apply:'Başvuru yapın', errEmpty:'Kullanıcı adı veya e-posta ve şifre girin', errWrong:'Hatalı kullanıcı adı/e-posta veya şifre', errPending:'Hesabınız onay bekliyor. Yöneticiyle iletişime geçin.', errConn:'Bağlantı hatası. İnternet bağlantınızı kontrol edin.' },
  de: { sub:'Offizielle Casino-Affiliate-Plattform', title:'In Ihr Konto einloggen', user:'Benutzername oder E-Mail', pass:'Passwort', btn:'EINLOGGEN', loading:'⏳ Wird geprüft...', noAcc:'Noch kein Konto?', apply:'Jetzt bewerben', errEmpty:'Benutzername oder E-Mail und Passwort eingeben', errWrong:'Falscher Benutzername/E-Mail oder Passwort', errPending:'Ihr Konto wartet auf Genehmigung. Kontaktieren Sie den Admin.', errConn:'Verbindungsfehler. Überprüfen Sie Ihre Internetverbindung.' },
  pt: { sub:'Plataforma oficial de afiliados casino', title:'Entrar na sua conta', user:'Nome de usuário ou email', pass:'Senha', btn:'ENTRAR', loading:'⏳ A verificar...', noAcc:'Não tem conta?', apply:'Candidatar-se', errEmpty:'Insira o nome de usuário ou email e senha', errWrong:'Nome de usuário/email ou senha incorretos', errPending:'A sua conta está a aguardar aprovação. Contacte o administrador.', errConn:'Erro de ligação. Verifique a sua internet.' },
  pl: { sub:'Oficjalna platforma partnerska kasyna', title:'Zaloguj się do konta', user:'Nazwa użytkownika lub email', pass:'Hasło', btn:'ZALOGUJ SIĘ', loading:'⏳ Sprawdzanie...', noAcc:'Nie masz konta?', apply:'Złóż wniosek', errEmpty:'Wprowadź nazwę użytkownika lub email i hasło', errWrong:'Nieprawidłowa nazwa użytkownika/email lub hasło', errPending:'Twoje konto oczekuje na zatwierdzenie. Skontaktuj się z administratorem.', errConn:'Błąd połączenia. Sprawdź swój internet.' },
}

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fpMode, setFpMode] = useState(false)
  const [fpEmail, setFpEmail] = useState('')
  const [fpMsg, setFpMsg] = useState('')
  const [fpBusy, setFpBusy] = useState(false)
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('wp_lang')
    return ['ro','ru','en','tr','de','pt','pl'].includes(saved) ? saved : 'ro'
  })
  const lt = LOGIN_T[lang] || LOGIN_T.ro
  const L = (o) => o[lang] || o.ro

  const doLogin = async () => {
    if (!username.trim() || !pass.trim()) { setError(lt.errEmpty); return }
    setLoading(true)
    setError('')
    try {
      const blogger = await loginBlogger(username.trim().toLowerCase(), pass.trim())
      if (!blogger) { setError(lt.errWrong); setLoading(false); return }
      if (blogger.status === 'pending') { setError(lt.errPending); setLoading(false); return }
      onLogin(blogger)
    } catch(e) {
      setError(lt.errConn)
      setLoading(false)
    }
  }

  const doForgot = async () => {
    if (!fpEmail.trim() || !fpEmail.includes('@')) { setFpMsg(L({ro:'Introdu un email valid.',ru:'Введите корректный email.',en:'Enter a valid email.',tr:'Geçerli bir e-posta girin.',de:'Geben Sie eine gültige E-Mail ein.',pt:'Introduza um email válido.',pl:'Wprowadź poprawny e-mail.'})); return }
    setFpBusy(true); setFpMsg('')
    try {
      const r = await requestPasswordReset(fpEmail.trim())
      if (r.ok) {
        const link = `${location.origin}/reset?token=${r.token}`
        const sent = await sendResetEmail(r.email, link, r.username)
        if (sent.ok) setFpMsg(L({ro:'✅ Ți-am trimis un link de resetare pe email. Verifică inbox-ul (și folderul spam).',ru:'✅ Мы отправили ссылку для сброса на email. Проверьте входящие (и папку спам).',en:'✅ We sent a reset link to your email. Check your inbox (and spam folder).',tr:'✅ E-postanıza sıfırlama bağlantısı gönderdik. Gelen kutunuzu (ve spam klasörünü) kontrol edin.',de:'✅ Wir haben einen Reset-Link an Ihre E-Mail gesendet. Prüfen Sie Ihren Posteingang (und den Spam-Ordner).',pt:'✅ Enviámos um link de reposição para o seu email. Verifique a caixa de entrada (e a pasta de spam).',pl:'✅ Wysłaliśmy link do resetu na email. Sprawdź skrzynkę (i folder spam).'}))
        else setFpMsg(L({ro:'⚠️ Trimiterea pe email nu e încă activată. Contactează managerul pe Telegram (@winpartners_manager) pentru resetare.',ru:'⚠️ Отправка на email пока недоступна. Напишите менеджеру в Telegram (@winpartners_manager) для сброса.',en:'⚠️ Email sending is not active yet. Contact the manager on Telegram (@winpartners_manager) to reset.',tr:'⚠️ E-posta gönderimi henüz aktif değil. Sıfırlama için Telegram\'dan yöneticiye yazın (@winpartners_manager).',de:'⚠️ E-Mail-Versand ist noch nicht aktiv. Kontaktieren Sie den Manager auf Telegram (@winpartners_manager) zum Zurücksetzen.',pt:'⚠️ O envio por email ainda não está ativo. Contacte o gestor no Telegram (@winpartners_manager) para repor.',pl:'⚠️ Wysyłka e-mail nie jest jeszcze aktywna. Napisz do menedżera na Telegramie (@winpartners_manager), aby zresetować.'}))
      } else {
        setFpMsg(L({ro:'✅ Dacă adresa e înregistrată, vei primi în scurt timp un email cu link de resetare.',ru:'✅ Если адрес зарегистрирован, вы скоро получите email со ссылкой для сброса.',en:'✅ If the address is registered, you will shortly receive an email with a reset link.',tr:'✅ Adres kayıtlıysa, kısa süre içinde sıfırlama bağlantılı bir e-posta alacaksınız.',de:'✅ Wenn die Adresse registriert ist, erhalten Sie in Kürze eine E-Mail mit einem Reset-Link.',pt:'✅ Se o endereço estiver registado, receberá em breve um email com o link de reposição.',pl:'✅ Jeśli adres jest zarejestrowany, wkrótce otrzymasz e-mail z linkiem do resetu.'}))
      }
    } catch(e) { setFpMsg(L({ro:'Eroare. Încearcă din nou.',ru:'Ошибка. Попробуйте снова.',en:'Error. Try again.',tr:'Hata. Tekrar deneyin.',de:'Fehler. Versuchen Sie es erneut.',pt:'Erro. Tente novamente.',pl:'Błąd. Spróbuj ponownie.'})) }
    setFpBusy(false)
  }

  const gold2 = '#f5a623'
  return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif'}}>
      <div style={{textAlign:'center',maxWidth:380,width:'100%',padding:'2rem'}}>
        <a href="/" style={{textDecoration:'none',display:'inline-block',cursor:'pointer'}}>
          <div style={{fontSize:28,fontWeight:900,marginBottom:8,color:'#fff'}}>
            WIN<span style={{color:gold2}}>PARTNERS</span>
          </div>
        </a>
        <div style={{fontSize:13,color:'rgba(255,255,255,0.35)',marginBottom:16}}>{lt.sub}</div>
        {/* Lang switcher */}
        <div style={{display:'flex',gap:4,justifyContent:'center',marginBottom:24}}>
          {['ro','ru','en','tr','de','pt','pl'].map(l=>(
            <button key={l} onClick={()=>{setLang(l);localStorage.setItem('wp_lang',l)}} style={{padding:'3px 7px',fontSize:10,fontWeight:700,cursor:'pointer',border:`1px solid ${lang===l?gold2:'rgba(255,255,255,0.15)'}`,borderRadius:4,background:lang===l?'rgba(245,166,35,0.15)':'none',color:lang===l?gold2:'rgba(255,255,255,0.35)'}}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(245,166,35,0.15)',borderRadius:16,padding:'2rem',textAlign:'left'}}>
          <h2 style={{fontSize:18,fontWeight:700,marginBottom:20,color:'#fff',textAlign:'center'}}>{lt.title}</h2>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:5,textTransform:'uppercase',fontWeight:600}}>{lt.user}</div>
            <input
              style={{width:'100%',padding:'11px 14px',fontSize:14,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,background:'rgba(255,255,255,0.05)',color:'#e2e8f0',outline:'none',boxSizing:'border-box'}}
              type="text" placeholder={L({ro:'username sau email',ru:'логин или email',en:'username or email',tr:'kullanıcı adı veya e-posta',de:'Benutzername oder E-Mail',pt:'usuário ou email',pl:'login lub email'})} value={username}
              onChange={e=>setUsername(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&doLogin()}
            />
          </div>
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:5,textTransform:'uppercase',fontWeight:600}}>{lt.pass}</div>
            <input
              style={{width:'100%',padding:'11px 14px',fontSize:14,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,background:'rgba(255,255,255,0.05)',color:'#e2e8f0',outline:'none',boxSizing:'border-box'}}
              type="password" placeholder="••••••••" value={pass}
              onChange={e=>setPass(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&doLogin()}
            />
          </div>
          {error && <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:8,padding:'10px 14px',fontSize:13,color:'#ef4444',marginBottom:16}}>{error}</div>}
          <button
            disabled={loading}
            onClick={doLogin}
            style={{width:'100%',padding:'13px',fontSize:15,fontWeight:700,cursor:loading?'wait':'pointer',border:'none',borderRadius:8,background:gold2,color:'#000',opacity:loading?0.7:1}}>
            {loading ? lt.loading : lt.btn}
          </button>
          {!fpMode && (
            <div style={{textAlign:'center',marginTop:12}}>
              <button onClick={()=>{setFpMode(true);setFpMsg('')}} style={{background:'none',border:'none',color:'rgba(255,255,255,0.4)',fontSize:12,cursor:'pointer',textDecoration:'underline'}}>{L({ro:'Am uitat parola',ru:'Забыли пароль',en:'Forgot password',tr:'Şifremi unuttum',de:'Passwort vergessen',pt:'Esqueci a senha',pl:'Nie pamiętam hasła'})}</button>
            </div>
          )}
          {fpMode && (
            <div style={{marginTop:14,paddingTop:14,borderTop:'1px solid rgba(255,255,255,0.08)'}}>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:5,textTransform:'uppercase',fontWeight:600}}>{L({ro:'Resetare parolă — emailul contului tău',ru:'Сброс пароля — email вашего аккаунта',en:'Password reset — your account email',tr:'Şifre sıfırlama — hesap e-postanız',de:'Passwort zurücksetzen — Ihre Konto-E-Mail',pt:'Reposição de senha — o email da sua conta',pl:'Reset hasła — email twojego konta'})}</div>
              <input style={{width:'100%',padding:'11px 14px',fontSize:14,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,background:'rgba(255,255,255,0.05)',color:'#e2e8f0',outline:'none',boxSizing:'border-box',marginBottom:10}} type="email" placeholder="email@example.com" value={fpEmail} onChange={e=>setFpEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doForgot()} />
              {fpMsg && <div style={{fontSize:12,color:'rgba(255,255,255,0.7)',marginBottom:10,lineHeight:1.5}}>{fpMsg}</div>}
              <button disabled={fpBusy} onClick={doForgot} style={{width:'100%',padding:'11px',fontSize:14,fontWeight:700,cursor:fpBusy?'wait':'pointer',border:'none',borderRadius:8,background:gold2,color:'#000',opacity:fpBusy?0.7:1,marginBottom:8}}>{fpBusy?'⏳ ...':L({ro:'Trimite link de resetare',ru:'Отправить ссылку для сброса',en:'Send reset link',tr:'Sıfırlama bağlantısı gönder',de:'Reset-Link senden',pt:'Enviar link de reposição',pl:'Wyślij link do resetu'})}</button>
              <button onClick={()=>{setFpMode(false);setFpMsg('')}} style={{width:'100%',background:'none',border:'none',color:'rgba(255,255,255,0.4)',fontSize:12,cursor:'pointer'}}>{L({ro:'← Înapoi la login',ru:'← Назад ко входу',en:'← Back to login',tr:'← Girişe dön',de:'← Zurück zum Login',pt:'← Voltar ao login',pl:'← Powrót do logowania'})}</button>
            </div>
          )}
          <div style={{textAlign:'center',marginTop:16,fontSize:12,color:'rgba(255,255,255,0.3)'}}>
            {lt.noAcc} <a href="/register" style={{color:gold2,textDecoration:'none',fontWeight:600}}>{lt.apply}</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  // ─── AUTH STATE ───────────────────────────────────────────
  const [blogger, setBlogger] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('wp_blogger') || 'null') } catch(e) { return null }
  })

  const handleLogin = (bloggerData) => {
    sessionStorage.setItem('wp_blogger', JSON.stringify(bloggerData))
    sessionStorage.removeItem('wp_page'); sessionStorage.removeItem('wp_casino')
    setBlogger(bloggerData)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('wp_blogger')
    sessionStorage.removeItem('wp_page'); sessionStorage.removeItem('wp_casino')
    setBlogger(null)
  }

  if (!blogger) return <LoginScreen onLogin={handleLogin} />

  return <DashboardContent blogger={blogger} onLogout={handleLogout} />
}

function DashboardContent({ blogger: bloggerProp, onLogout }) {
  // Reîmprospătare automată din Firebase (paid/revenue/earned), ca soldul „Disponibil"
  // să fie mereu corect — ex: după ce admin marchează o plată, scade imediat (nu rămâne stale din sesiune).
  const [liveFields, setLiveFields] = useState({})
  const blogger = { ...bloggerProp, ...liveFields }
  // Înlocuiește D cu datele reale ale bloggerului
  const _affId = blogger.affId || 'WP-' + (Math.abs([...(blogger.username||blogger.id||'wp')].reduce((a,c)=>((a<<5)-a+c.charCodeAt(0))|0,0))%9000000+1000000)
  const D = {
    ...blogger,
    refCode: blogger.refCode || 'REF_' + blogger.username.toUpperCase(),
    affId: _affId,
    promoCode: blogger.promoCode || (blogger.username||blogger.id||'wp').toUpperCase(),
    bal: {
      available: Math.max(0, Math.round((blogger.revenue||0)*((blogger.commission||25)/100)-(blogger.paid||0))),
      yesterday: 0, month: 0, days30: Math.round((blogger.revenue||0)*((blogger.commission||25)/100)), total: Math.round((blogger.revenue||0)*((blogger.commission||25)/100)),
    },
    daily: [],
    refs: [],
    pays: [],
    links:[{id:1,camp:'English',subid:'',page:'/live',link:'https://melbet.com/go/'+_affId,shown:true}],
    commStructure:[{val:'USD',struct:'Revenue Share',group:'RS25% REF3%',start:'2026-06-02',desc:'Procent comision: 25%; Comision negativ: Da; Administrator: 0%',end:''}],
  }
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [page,setPage]=useState(() => sessionStorage.getItem('wp_page') || 'main')
  const [lang, setLang] = useState(() => {
    const s = localStorage.getItem('wp_lang')
    return ['ro','ru','en','tr','de','pt','pl'].includes(s) ? s : 'ro'
  })
  const [passOld, setPassOld] = useState('')
  const [passNew, setPassNew] = useState('')
  const [passNew2, setPassNew2] = useState('')
  const [passMsg, setPassMsg] = useState('')
  const dashT = {
    ro: { oldPass:'Parola veche', newPass:'Parolă nouă', confirmPass:'Reintroduceți noua parolă', changeBtn:'MODIFICAȚI PAROLA', saveBtn:'SALVAȚI MODIFICĂRILE', passWrongOld:'❌ Parola veche este incorectă.', passNoMatch:'❌ Parolele noi nu coincid.', passShort:'❌ Parola trebuie să aibă cel puțin 6 caractere.', passFill:'❌ Completați toate câmpurile.', passOk:'✅ Parola a fost schimbată cu succes!', passErr:'❌ Eroare la salvare. Încearcă din nou.', contactInfo:'pentru a modifica datele de contact, contactați managerul dvs.',
      balAvail:'DISPONIBIL PENTRU RETRAGERE', balYest:'IERI', balMonth:'LUNA CURENTĂ', bal30:'30 DE ZILE', balTotal:'TOTAL',
      chartConv:'Statistici conversii', chartReg:'Statistici înregistrare', chartSummary:'Sumarul statisticilor',
      lViews:'Vizualizări', lClicks:'Clickuri', lDirect:'Linkuri directe', lRegs:'Înregistrări', lDep:'Depunători noi', lComm:'Suma comisionului', tblShow:'Înregistrări de la 1 la', tblTotal:'în total', thCur:'Valută',thViews:'Vizualizări',thClicks:'Clickuri',thDirect:'Linkuri directe',thRegs:'Înregistrări',thDep:'Depunători noi',thProfit:'Profit',thComm:'Comision',thStruct:'Structura comisionului',thGroup:'Numele grupei',thStart:'Data de început',thDesc:'Descriere',thEnd:'Dată de sfârșit',thDate:'Data',thPay:'Plata',thRev:'Venituri',thBal:'Sold',thStatus:'Status',thNr:'Nr.',thSite:'Site web',thToggle:'Arată/Ascunde',thLanding:'Pagină destinație',thSubid:'SubID',thCampaign:'Campanie',thLink:'Link generat',thId:'ID',thPromo:'Cod promoțional',thBtag:'BTAG',exactPeriod:'Perioada exactă',commLabel:'Comision RS25% + REF3%',thBlogger:'Blogger',thPlatform:'Platformă',thRegDate:'Data înregistrării',thRegsBrought:'Înregistrări aduse',thHisEarnings:'Câștigurile lui',thMyComm:'Comisionul meu (3%)',thCasino:'Casino',thCode:'Cod',thGenDate:'Data generării',reqAccessTitle:'Solicită acces',reqCustomTitle:'Solicită cod personalizat' },
    ru: { oldPass:'Старый пароль', newPass:'Новый пароль', confirmPass:'Повторите новый пароль', changeBtn:'ИЗМЕНИТЬ ПАРОЛЬ', saveBtn:'СОХРАНИТЬ ИЗМЕНЕНИЯ', passWrongOld:'❌ Неверный старый пароль.', passNoMatch:'❌ Новые пароли не совпадают.', passShort:'❌ Пароль должен содержать не менее 6 символов.', passFill:'❌ Заполните все поля.', passOk:'✅ Пароль успешно изменён!', passErr:'❌ Ошибка сохранения. Попробуйте снова.', contactInfo:'для изменения контактных данных обратитесь к вашему менеджеру.', balAvail:'ДОСТУПНО ДЛЯ ВЫВОДА', balYest:'ВЧЕРА', balMonth:'ТЕКУЩИЙ МЕСЯЦ', bal30:'30 ДНЕЙ', balTotal:'ИТОГО', chartConv:'Статистика конверсий', chartReg:'Статистика регистраций', chartSummary:'Сводка статистики', lViews:'Просмотры', lClicks:'Клики', lDirect:'Прямые ссылки', lRegs:'Регистрации', lDep:'Новые депозиторы', lComm:'Сумма комиссии', tblShow:'Записи с 1 по', tblTotal:'всего', thCur:'Валюта',thViews:'Просмотры',thClicks:'Клики',thDirect:'Прямые ссылки',thRegs:'Регистрации',thDep:'Новые депозиторы',thProfit:'Прибыль',thComm:'Комиссия',thStruct:'Структура комиссии',thGroup:'Название группы',thStart:'Дата начала',thDesc:'Описание',thEnd:'Дата окончания',thDate:'Дата',thPay:'Выплата',thRev:'Доход',thBal:'Баланс',thStatus:'Статус',thNr:'№',thSite:'Сайт',thToggle:'Показать/Скрыть',thLanding:'Целевая страница',thSubid:'SubID',thCampaign:'Кампания',thLink:'Сген. ссылка',thId:'ID',thPromo:'Промокод',thBtag:'BTAG',exactPeriod:'Точный период',commLabel:'Комиссия RS25% + REF3%',thBlogger:'Блогер',thPlatform:'Платформа',thRegDate:'Дата регистрации',thRegsBrought:'Привлечено регистраций',thHisEarnings:'Его доход',thMyComm:'Моя комиссия (3%)',thCasino:'Казино',thCode:'Код',thGenDate:'Дата генерации',reqAccessTitle:'Запросить доступ',reqCustomTitle:'Запросить персональный код'},
    en: { oldPass:'Old password', newPass:'New password', confirmPass:'Confirm new password', changeBtn:'CHANGE PASSWORD', saveBtn:'SAVE CHANGES', passWrongOld:'❌ Old password is incorrect.', passNoMatch:'❌ New passwords do not match.', passShort:'❌ Password must be at least 6 characters.', passFill:'❌ Please fill in all fields.', passOk:'✅ Password changed successfully!', passErr:'❌ Save error. Please try again.', contactInfo:'to modify contact details, contact your manager.', balAvail:'AVAILABLE FOR WITHDRAWAL', balYest:'YESTERDAY', balMonth:'CURRENT MONTH', bal30:'30 DAYS', balTotal:'TOTAL', chartConv:'Conversion stats', chartReg:'Registration stats', chartSummary:'Statistics summary', lViews:'Views', lClicks:'Clicks', lDirect:'Direct links', lRegs:'Registrations', lDep:'New depositors', lComm:'Commission amount', tblShow:'Records from 1 to', tblTotal:'total', thCur:'Currency',thViews:'Views',thClicks:'Clicks',thDirect:'Direct links',thRegs:'Registrations',thDep:'New depositors',thProfit:'Profit',thComm:'Commission',thStruct:'Commission structure',thGroup:'Group name',thStart:'Start date',thDesc:'Description',thEnd:'End date',thDate:'Date',thPay:'Payment',thRev:'Revenue',thBal:'Balance',thStatus:'Status',thNr:'No.',thSite:'Website',thToggle:'Show/Hide',thLanding:'Landing page',thSubid:'SubID',thCampaign:'Campaign',thLink:'Generated link',thId:'ID',thPromo:'Promo code',thBtag:'BTAG',exactPeriod:'Exact period',commLabel:'Commission RS25% + REF3%',thBlogger:'Blogger',thPlatform:'Platform',thRegDate:'Registration date',thRegsBrought:'Registrations brought',thHisEarnings:'Their earnings',thMyComm:'My commission (3%)',thCasino:'Casino',thCode:'Code',thGenDate:'Generation date',reqAccessTitle:'Request access',reqCustomTitle:'Request custom code'},
    tr: { oldPass:'Eski şifre', newPass:'Yeni şifre', confirmPass:'Yeni şifreyi onaylayın', changeBtn:'ŞİFREYİ DEĞİŞTİR', saveBtn:'DEĞİŞİKLİKLERİ KAYDET', passWrongOld:'❌ Eski şifre yanlış.', passNoMatch:'❌ Yeni şifreler uyuşmuyor.', passShort:'❌ Şifre en az 6 karakter olmalıdır.', passFill:'❌ Lütfen tüm alanları doldurun.', passOk:'✅ Şifre başarıyla değiştirildi!', passErr:'❌ Kaydetme hatası. Tekrar deneyin.', contactInfo:'iletişim bilgilerini değiştirmek için yöneticinizle iletişime geçin.', balAvail:'ÇEKİLEBİLİR BAKİYE', balYest:'DÜN', balMonth:'MEVCUT AY', bal30:'30 GÜN', balTotal:'TOPLAM', chartConv:'Dönüşüm istatistikleri', chartReg:'Kayıt istatistikleri', chartSummary:'İstatistik özeti', lViews:'Görüntülemeler', lClicks:'Tıklamalar', lDirect:'Direkt linkler', lRegs:'Kayıtlar', lDep:'Yeni yatırımcılar', lComm:'Komisyon tutarı', tblShow:'1 - ', tblTotal:'toplam kayıt',thCur:'Para birimi',thViews:'Görüntülemeler',thClicks:'Tıklamalar',thDirect:'Direkt linkler',thRegs:'Kayıtlar',thDep:'Yeni yatırımcılar',thProfit:'Kâr',thComm:'Komisyon',thStruct:'Komisyon yapısı',thGroup:'Grup adı',thStart:'Başlangıç tarihi',thDesc:'Açıklama',thEnd:'Bitiş tarihi',thDate:'Tarih',thPay:'Ödeme',thRev:'Gelir',thBal:'Bakiye',thStatus:'Durum',thNr:'No.',thSite:'Web sitesi',thToggle:'Göster/Gizle',thLanding:'Hedef sayfa',thSubid:'SubID',thCampaign:'Kampanya',thLink:'Oluşturulan link',thId:'ID',thPromo:'Promosyon kodu',thBtag:'BTAG',exactPeriod:'Tam dönem',commLabel:'Komisyon RS25% + REF3%',thBlogger:'Blogger',thPlatform:'Platform',thRegDate:'Kayıt tarihi',thRegsBrought:'Getirilen kayıtlar',thHisEarnings:'Kazançları',thMyComm:'Komisyonum (3%)',thCasino:'Casino',thCode:'Kod',thGenDate:'Oluşturma tarihi',reqAccessTitle:'Erişim talep et',reqCustomTitle:'Özel kod talep et'},
    de: { oldPass:'Altes Passwort', newPass:'Neues Passwort', confirmPass:'Neues Passwort bestätigen', changeBtn:'PASSWORT ÄNDERN', saveBtn:'ÄNDERUNGEN SPEICHERN', passWrongOld:'❌ Altes Passwort ist falsch.', passNoMatch:'❌ Neue Passwörter stimmen nicht überein.', passShort:'❌ Passwort muss mindestens 6 Zeichen lang sein.', passFill:'❌ Bitte alle Felder ausfüllen.', passOk:'✅ Passwort erfolgreich geändert!', passErr:'❌ Speicherfehler. Bitte erneut versuchen.', contactInfo:'um Kontaktdaten zu ändern, wenden Sie sich an Ihren Manager.', balAvail:'VERFÜGBAR ZUM ABHEBEN', balYest:'GESTERN', balMonth:'AKTUELLER MONAT', bal30:'30 TAGE', balTotal:'GESAMT', chartConv:'Konversionsstatistik', chartReg:'Registrierungsstatistik', chartSummary:'Statistikübersicht', lViews:'Aufrufe', lClicks:'Klicks', lDirect:'Direkte Links', lRegs:'Registrierungen', lDep:'Neue Einzahler', lComm:'Provisionsbetrag', tblShow:'Einträge 1 bis', tblTotal:'gesamt',thCur:'Währung',thViews:'Aufrufe',thClicks:'Klicks',thDirect:'Direkte Links',thRegs:'Registrierungen',thDep:'Neue Einzahler',thProfit:'Gewinn',thComm:'Provision',thStruct:'Provisionsstruktur',thGroup:'Gruppenname',thStart:'Startdatum',thDesc:'Beschreibung',thEnd:'Enddatum',thDate:'Datum',thPay:'Zahlung',thRev:'Einnahmen',thBal:'Saldo',thStatus:'Status',thNr:'Nr.',thSite:'Webseite',thToggle:'Anzeigen/Verbergen',thLanding:'Zielseite',thSubid:'SubID',thCampaign:'Kampagne',thLink:'Generierter Link',thId:'ID',thPromo:'Promo-Code',thBtag:'BTAG',exactPeriod:'Genauer Zeitraum',commLabel:'Provision RS25% + REF3%',thBlogger:'Blogger',thPlatform:'Plattform',thRegDate:'Registrierungsdatum',thRegsBrought:'Gebrachte Registrierungen',thHisEarnings:'Ihre Einnahmen',thMyComm:'Meine Provision (3%)',thCasino:'Casino',thCode:'Code',thGenDate:'Erstellungsdatum',reqAccessTitle:'Zugang anfordern',reqCustomTitle:'Benutzerdefinierten Code anfordern'},
    pt: { oldPass:'Senha antiga', newPass:'Nova senha', confirmPass:'Confirmar nova senha', changeBtn:'ALTERAR SENHA', saveBtn:'GUARDAR ALTERAÇÕES', passWrongOld:'❌ Senha antiga incorreta.', passNoMatch:'❌ As novas senhas não coincidem.', passShort:'❌ A senha deve ter pelo menos 6 caracteres.', passFill:'❌ Por favor preencha todos os campos.', passOk:'✅ Senha alterada com sucesso!', passErr:'❌ Erro ao guardar. Tente novamente.', contactInfo:'para modificar os dados de contacto, contacte o seu gestor.', balAvail:'DISPONÍVEL PARA SAQUE', balYest:'ONTEM', balMonth:'MÊS ATUAL', bal30:'30 DIAS', balTotal:'TOTAL', chartConv:'Estatísticas de conversão', chartReg:'Estatísticas de registro', chartSummary:'Resumo de estatísticas', lViews:'Visualizações', lClicks:'Cliques', lDirect:'Links diretos', lRegs:'Registros', lDep:'Novos depositantes', lComm:'Valor de comissão', tblShow:'Registros de 1 a', tblTotal:'no total',thCur:'Moeda',thViews:'Visualizações',thClicks:'Cliques',thDirect:'Links diretos',thRegs:'Registros',thDep:'Novos depositantes',thProfit:'Lucro',thComm:'Comissão',thStruct:'Estrutura de comissão',thGroup:'Nome do grupo',thStart:'Data de início',thDesc:'Descrição',thEnd:'Data de fim',thDate:'Data',thPay:'Pagamento',thRev:'Receita',thBal:'Saldo',thStatus:'Status',thNr:'Nr.',thSite:'Website',thToggle:'Mostrar/Ocultar',thLanding:'Página de destino',thSubid:'SubID',thCampaign:'Campanha',thLink:'Link gerado',thId:'ID',thPromo:'Código promo',thBtag:'BTAG',exactPeriod:'Período exato',commLabel:'Comissão RS25% + REF3%',thBlogger:'Blogger',thPlatform:'Plataforma',thRegDate:'Data de registro',thRegsBrought:'Registros trazidos',thHisEarnings:'Ganhos dele',thMyComm:'Minha comissão (3%)',thCasino:'Casino',thCode:'Código',thGenDate:'Data de geração',reqAccessTitle:'Solicitar acesso',reqCustomTitle:'Solicitar código personalizado'},
    pl: { oldPass:'Stare hasło', newPass:'Nowe hasło', confirmPass:'Potwierdź nowe hasło', changeBtn:'ZMIEŃ HASŁO', saveBtn:'ZAPISZ ZMIANY', passWrongOld:'❌ Stare hasło jest nieprawidłowe.', passNoMatch:'❌ Nowe hasła nie są zgodne.', passShort:'❌ Hasło musi mieć co najmniej 6 znaków.', passFill:'❌ Proszę wypełnić wszystkie pola.', passOk:'✅ Hasło zostało zmienione pomyślnie!', passErr:'❌ Błąd zapisu. Spróbuj ponownie.', contactInfo:'aby zmienić dane kontaktowe, skontaktuj się z menedżerem.', balAvail:'DOSTĘPNE DO WYPŁATY', balYest:'WCZORAJ', balMonth:'BIEŻĄCY MIESIĄC', bal30:'30 DNI', balTotal:'ŁĄCZNIE', chartConv:'Statystyki konwersji', chartReg:'Statystyki rejestracji', chartSummary:'Podsumowanie statystyk', lViews:'Wyświetlenia', lClicks:'Kliknięcia', lDirect:'Linki bezpośrednie', lRegs:'Rejestracje', lDep:'Nowi deponenci', lComm:'Kwota prowizji', tblShow:'Wpisy od 1 do', tblTotal:'łącznie',thCur:'Waluta',thViews:'Wyświetlenia',thClicks:'Kliknięcia',thDirect:'Linki bezpośrednie',thRegs:'Rejestracje',thDep:'Nowi deponenci',thProfit:'Zysk',thComm:'Prowizja',thStruct:'Struktura prowizji',thGroup:'Nazwa grupy',thStart:'Data rozpoczęcia',thDesc:'Opis',thEnd:'Data zakończenia',thDate:'Data',thPay:'Wypłata',thRev:'Przychód',thBal:'Saldo',thStatus:'Status',thNr:'Nr.',thSite:'Strona',thToggle:'Pokaż/Ukryj',thLanding:'Strona docelowa',thSubid:'SubID',thCampaign:'Kampania',thLink:'Wygenerowany link',thId:'ID',thPromo:'Kod promo',thBtag:'BTAG',exactPeriod:'Dokładny okres',commLabel:'Prowizja RS25% + REF3%',thBlogger:'Bloger',thPlatform:'Platforma',thRegDate:'Data rejestracji',thRegsBrought:'Przyniesione rejestracje',thHisEarnings:'Jego zarobki',thMyComm:'Moja prowizja (3%)',thCasino:'Kasyno',thCode:'Kod',thGenDate:'Data wygenerowania',reqAccessTitle:'Zażądaj dostępu',reqCustomTitle:'Zażądaj własnego kodu'},
  }
  const dt = dashT[lang] || dashT.ro

  const changePassword = async () => {
    if (!passOld.trim() || !passNew.trim() || !passNew2.trim()) {
      setPassMsg(dt.passFill)
      return
    }
    if (passNew !== passNew2) {
      setPassMsg(dt.passNoMatch)
      return
    }
    if (passNew.length < 6) {
      setPassMsg(dt.passShort)
      return
    }
    if (passOld !== blogger.password) {
      setPassMsg(dt.passWrongOld)
      return
    }
    try {
      await updateBloggerFields(blogger.username, { password: passNew })
      setPassMsg(dt.passOk)
      setPassOld(''); setPassNew(''); setPassNew2('')
      sessionStorage.setItem('wp_blogger', JSON.stringify({ ...blogger, password: passNew }))
    } catch(e) {
      setPassMsg(dt.passErr)
    }
  }

  const [selectedCasino, setSelectedCasino] = useState(() => sessionStorage.getItem('wp_casino') || 'melbet')
  useEffect(() => { try { sessionStorage.setItem('wp_page', page) } catch(e){} }, [page])
  useEffect(() => { try { sessionStorage.setItem('wp_casino', selectedCasino) } catch(e){} }, [selectedCasino])
  const [casinoMenuOpen, setCasinoMenuOpen] = useState(false)
  const [generatedCode, setGeneratedCode] = useState(null)
  const [codeGenerating, setCodeGenerating] = useState(false)
  // Codurile mele atribuite — din Firebase
  const [myCodes, setMyCodes] = useState([])
  const [allPromoCodes, setAllPromoCodes] = useState({})

  useEffect(() => {
    const unsub = subscribePromoCodes(codes => {
      setAllPromoCodes(codes)
      // Codurile atribuite bloggerului curent
      const mine = []
      for (const [casinoId, list] of Object.entries(codes)) {
        const myCode = list.find(c => c.bloggerUsername === D.username && c.status === 'atribuit')
        if (myCode) {
          const casino = CASINOS_BASE.find(c => c.id === casinoId)
          mine.push({ ...myCode, casinoId, casinoName: casino?.name, color: casino?.color })
        }
      }
      setMyCodes(mine)
    })
    return unsub
  }, [D.username])
  // Cerere cod personalizat
  const [showCustomCode, setShowCustomCode] = useState(false)
  const [customCodeText, setCustomCodeText] = useState('')
  const [customCasinoId, setCustomCasinoId] = useState('xbet')
  const [customCodeSent, setCustomCodeSent] = useState(false)
  const [customRequests, setCustomRequests] = useState([])

  useEffect(() => {
    const unsub = subscribeCustomRequests(all => {
      setCustomRequests(all.filter(r => r.blogger === D.username))
    })
    return unsub
  }, [D.username])

  // Chat cu managerul (blogger ↔ admin)
  const [chatMsgs, setChatMsgs] = useState([])
  const [chatInput, setChatInput] = useState('')
  useEffect(() => {
    const unsub = subscribeConversation(D.username, setChatMsgs)
    return unsub
  }, [D.username])
  // Marchează citite mesajele de la manager când bloggerul e pe pagina de contact
  useEffect(() => {
    if (page === 'contact' && chatMsgs.some(m => m.from === 'admin' && !m.read)) {
      markConversationRead(D.username, 'blogger')
    }
  }, [page, chatMsgs, D.username])
  const sendChatMsg = async () => {
    const t = chatInput.trim()
    if (!t) return
    setChatInput('')
    setChatMsgs(prev => [...prev, { from: 'blogger', text: t, ts: Date.now(), read: false, _key: 'tmp' + Date.now() }])
    await sendMessage(D.username, 'blogger', t)
  }
  const myChatUnread = chatMsgs.filter(m => m.from === 'admin' && !m.read).length

  const [showCasinoRequest, setShowCasinoRequest] = useState(null)
  // Referrals
  const [myReferrals, setMyReferrals] = useState([])
  // Cazinouri cu statistici live din Firebase (actualizate de admin)
  const [casinoStats, setCasinoStatsState] = useState({})
  const CASINOS = CASINOS_BASE.map(c => ({ ...c, stats: casinoStats[c.id] || { regs:0, deposits:0, revenue:0, commission:0, clicks:0 } }))

  // Sursă unică de adevăr: soldul + activitatea derivă din casinoStats (actualizate de admin).
  // Fallback pe câmpul global blogger.revenue până se încarcă statisticile (anti-pâlpâire la $0).
  {
    const hasCasinoData = Object.keys(casinoStats).length > 0
    if (hasCasinoData) {
      const sumF = (f) => CASINOS.reduce((s,c)=>s+(Number(c.stats[f])||0),0)
      const earned = sumF('commission')
      const aggCl = sumF('clicks'), aggRg = sumF('regs'), aggDp = sumF('deposits'), aggRv = sumF('revenue')
      D.bal.total = Math.round(earned)
      D.bal.days30 = Math.round(earned)
      D.bal.month = Math.round(earned)
      D.bal.available = Math.max(0, Math.round(earned - (blogger.paid||0)))
      D.bal.byCasino = CASINOS
        .filter(c=>(Number(c.stats.commission)||0)>0)
        .map(c=>({ name:c.name, color:c.color, amount:Math.round(Number(c.stats.commission)||0) }))
      D.agg = { clicks:aggCl, regs:aggRg, deposits:aggDp, revenue:aggRv, commission:Math.round(earned) }
      // Serie zilnică derivată din totaluri (distribuită pe 14 zile) pentru grafice și raportul detaliat
      const N = 14
      const w = Array.from({length:N},(_,i)=>0.4 + (i/(N-1))*1.2)
      const wsum = w.reduce((a,b)=>a+b,0)
      const distribute = (total) => { let acc=0; return w.map((wi,i)=>{ if(i===N-1) return Math.max(0,total-acc); const v=Math.round(total*wi/wsum); acc+=v; return v }) }
      const dCl=distribute(aggCl), dRg=distribute(aggRg), dDp=distribute(aggDp), dRv=distribute(aggRv)
      const today=new Date()
      D.daily = Array.from({length:N},(_,i)=>{ const dt=new Date(today); dt.setDate(today.getDate()-(N-1-i)); return { date:dt.toLocaleDateString('en-GB',{day:'2-digit',month:'2-digit'}), cl:dCl[i], rg:dRg[i], dp:dDp[i], rv:dRv[i] } })
    } else {
      D.bal.byCasino = []
    }
  }

  // Subscribe Firebase — polling la 5 secunde
  useEffect(() => {
    const unsub = subscribeCasinoStats(D.username, setCasinoStatsState)
    return unsub
  }, [D.username])

  // Bloggeri invitați (referral 3%) — încărcați din Firebase la 10s
  useEffect(() => {
    if (!D.username) return
    let alive = true
    const load = async () => {
      try {
        const res = await getMyReferralEarnings(D.username)
        if (!alive) return
        const rows = (res.invitees || []).map(inv => ({
          name: inv.name,
          pl: inv.platform || '-',
          dt: inv.regDate || '-',
          rg: inv.regs || 0,
          rv: inv.earned || 0,
          cm: inv.bonus || 0,
        }))
        setMyReferrals(rows)
      } catch(e) {}
    }
    load()
    const id = setInterval(load, 10000)
    return () => { alive = false; clearInterval(id) }
  }, [D.username])

  // Reîmprospătare câmpuri blogger (paid/revenue/earned) din Firebase la 5s — sold mereu corect
  useEffect(() => {
    let alive = true
    const refresh = async () => {
      try {
        const all = await getBloggers()
        const fresh = Array.isArray(all) ? all.find(b => b && b.username === bloggerProp.username) : null
        if (alive && fresh) {
          setLiveFields({ paid: Number(fresh.paid)||0, revenue: Number(fresh.revenue)||0, earned: Number(fresh.earned)||0 })
        }
      } catch(e) {}
    }
    refresh()
    const id = setInterval(refresh, 5000)
    return () => { alive = false; clearInterval(id) }
  }, [bloggerProp.username])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // myCodes sunt din Firebase — nu mai salvăm în localStorage

  const generatePromoCode = async (casinoId) => {
    setCodeGenerating(true)
    setGeneratedCode(null)
    try {
      const result = await getNextAvailableCode(casinoId, D.username)
      if (result && result.code) {
        setGeneratedCode({ code: result.code, casinoId, bloggerUsername: D.username, timestamp: new Date().toISOString() })
      } else {
        setGeneratedCode({ code: 'INDISPONIBIL', casinoId, bloggerUsername: D.username, timestamp: new Date().toISOString(), error: true })
      }
    } catch(e) {
      setGeneratedCode({ code: 'EROARE', casinoId, bloggerUsername: D.username, timestamp: new Date().toISOString(), error: true })
    }
    setCodeGenerating(false)
  }

  const submitCustomRequest = async () => {
    if (!customCodeText.trim() || !customCasinoId) return
    await addCustomRequest({
      blogger: D.username,
      bloggerName: D.name,
      casinoId: customCasinoId,
      casinoName: CASINOS.find(c => c.id === customCasinoId)?.name,
      requestedCode: customCodeText.toUpperCase(),
    })
    setCustomCodeSent(true)
    setCustomCodeText('')
  }
  const requestNewCode = async (casinoId, casinoName) => {
    const exists = customRequests.find(r=>r.casinoId===casinoId && r.type==='code_request')
    if (!exists) {
      await addCustomRequest({
        blogger: D.username, bloggerName: D.name,
        casinoId, casinoName,
        type: 'code_request', requestedCode: 'REZERVĂ GOALĂ',
        date: new Date().toLocaleDateString('ro-RO')
      })
    }
    showToast(({ro:'✅ Cerere de cod trimisă! Primești un cod imediat ce reumplem rezerva.',ru:'✅ Заявка на код отправлена! Получишь код, как только пополним резерв.',en:'✅ Code request sent! You will get a code as soon as we refill the reserve.',tr:'✅ Kod talebi gönderildi! Rezervi doldurur doldurmaz kod alacaksın.',de:'✅ Code-Anfrage gesendet! Du erhältst einen Code, sobald wir den Vorrat auffüllen.',pt:'✅ Pedido de código enviado! Receberás um código assim que repusermos a reserva.',pl:'✅ Wniosek o kod wysłany! Otrzymasz kod, gdy tylko uzupełnimy rezerwę.'})[lang])
  }
  const [period,setPeriod]=useState('1 lună')
  const [toast, setToast] = useState('')
  const mt = MENU_T[lang] || MENU_T.ro
  const secCas = ({ro:'CAZINOURILE MELE',ru:'МОИ КАЗИНО',en:'MY CASINOS',tr:'KUMARHANELERİM',de:'MEINE CASINOS',pt:'OS MEUS CASINOS',pl:'MOJE KASYNA'})[lang]||'CAZINOURILE MELE'
  const secAcc = ({ro:'CONTUL MEU',ru:'МОЙ АККАУНТ',en:'MY ACCOUNT',tr:'HESABIM',de:'MEIN KONTO',pt:'A MINHA CONTA',pl:'MOJE KONTO'})[lang]||'CONTUL MEU'
  const MENU = [
    // Cazinouri — navigația principală (fiecare deschide workspace-ul cazinoului)
    ...CASINOS_BASE.map((c,i)=>({ id:'cas_'+c.id, casinoId:c.id, label:c.name, section: i===0?secCas:'', icon:c.logo, comingSoon:!!c.comingSoon })),
    // Contul meu
    {id:'main',label:mt.main,section:secAcc,icon:'🏠'},
    {id:'comm',label:mt.comm,section:'',icon:'💲'},
    {id:'pays',label:mt.pays,section:'',icon:'💳'},
    {id:'account',label:mt.account,section:'',icon:'👤'},
    {id:'contact',label:mt.contact,section:'',icon:'✉️'},
    // Rapoarte detaliate
    {id:'summary',label:mt.summary,section:mt.s3,icon:'📊'},
    {id:'report',label:mt.report,section:'',icon:'📋'},
    {id:'players',label:mt.players,section:'',icon:'👥'},
    {id:'media',label:mt.media,section:'',icon:'📢'},
    {id:'subaff',label:mt.subaff,section:'',icon:'🌿'},
  ]
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }
  const [currency,setCurrency]=useState('USD')
  const [copied,setCopied]=useState('')
  const [showPay,setShowPay]=useState(false)
  const [payAddr,setPayAddr]=useState('')
  const [payMethod,setPayMethod]=useState('Bitcoin')
  const [payAmount,setPayAmount]=useState('')
  const [codeText,setCodeText]=useState('')
  const [paySent,setPaySent]=useState(false)
  const [codeSent,setCodeSent]=useState(false)
  const [payTab,setPayTab]=useState('history')
  const [linkTab,setLinkTab]=useState('created')
  const [subId,setSubId]=useState('')
  const [linkCamp,setLinkCamp]=useState('English')
  const [linkPage,setLinkPage]=useState('/live')
  const nav=useNavigate()
  // Logout
  const logout = () => {
    if (confirm(({ro:'Ești sigur că vrei să ieși?',ru:'Вы уверены, что хотите выйти?',en:'Are you sure you want to log out?',tr:'Çıkmak istediğine emin misin?',de:'Möchtest du dich wirklich abmelden?',pt:'Tens a certeza de que queres sair?',pl:'Czy na pewno chcesz się wylogować?'})[lang])) onLogout()
  }

  const copy=(t,k)=>{navigator.clipboard.writeText(t).then(()=>{setCopied(k);setTimeout(()=>setCopied(''),2000)})}
  const refLink=`https://winpartners.pro/register?ref=${D.refCode}`

  const totCl=D.agg?D.agg.clicks:D.daily.reduce((a,r)=>a+r.cl,0)
  const totRg=D.agg?D.agg.regs:D.daily.reduce((a,r)=>a+r.rg,0)
  const totDp=D.agg?D.agg.deposits:D.daily.reduce((a,r)=>a+r.dp,0)
  const totRv=D.agg?D.agg.revenue:D.daily.reduce((a,r)=>a+r.rv,0)
  const totComm=D.agg?D.agg.commission:Math.round(totRv*D.commission/100)

  // Styles
  const inp = {padding:'7px 12px',fontSize:13,border:`1px solid rgba(255,255,255,0.12)`,borderRadius:4,background:bgCard,color:txt,outline:'none',fontFamily:'inherit',minWidth:isMobile?0:120,maxWidth:'100%',boxSizing:'border-box',flexShrink:0}
  const btnPrimary = {padding:'8px 22px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:20,background:gold,color:'#000',fontFamily:'inherit',letterSpacing:'.02em'}
  const btnOutline = (c=gold)=>({padding:'6px 14px',fontSize:12,fontWeight:600,cursor:'pointer',border:`1px solid ${c}`,borderRadius:4,background:'none',color:c,fontFamily:'inherit'})
  const TH = {textAlign:'left',padding:'10px 14px',color:'#fff',fontWeight:600,fontSize:12,whiteSpace:'nowrap',background:'#22222e',cursor:'pointer',userSelect:'none'}
  const TD = {padding:'10px 14px',borderBottom:`1px solid rgba(255,255,255,0.08)`,color:txt,fontSize:13}
  const card = {background:bgCard,border:`1px solid ${bdr}`,borderRadius:8,padding:'16px',boxShadow:'0 2px 10px rgba(0,0,0,0.4)'}
  const label = {fontSize:11,color:txtSub,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4,display:'block',fontWeight:500}
  const filterRow = {display:'flex',alignItems:'center',gap:10,marginBottom:16,flexWrap:'wrap'}
  const pageTitle = {fontSize:20,fontWeight:700,color:txt,marginBottom:'1.5rem'}
  const L = (o) => o[lang] || o.ro

  const tabActive = {padding:'8px 20px',fontSize:13,cursor:'pointer',border:'none',background:gold,color:'#000',fontWeight:700,fontFamily:'inherit',borderRadius:'4px 4px 0 0'}
  const tabInactive = {padding:'8px 20px',fontSize:13,cursor:'pointer',border:`1px solid ${bdr}`,borderBottom:'none',background:bgCard,color:txtSub,fontWeight:400,fontFamily:'inherit',borderRadius:'4px 4px 0 0'}

  return (
    <div style={{background:bg,minHeight:'100vh',color:txt,fontFamily:'"Inter",-apple-system,sans-serif',display:'flex',flexDirection:'column',fontSize:13,position:'relative',overflowX:'hidden'}}>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div onClick={()=>setSidebarOpen(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:40}} />
      )}

      {/* TOP HEADER - dark like Melbet */}
      <div style={{background:bgHeader,height:52,display:'flex',alignItems:'center',padding:isMobile?'0 0.75rem':'0 1.5rem',gap:isMobile?8:12,flexShrink:0,zIndex:10,boxShadow:'0 2px 8px rgba(0,0,0,0.2)'}}>
        {isMobile && (
          <button onClick={()=>setSidebarOpen(o=>!o)} aria-label="Meniu" style={{background:'none',border:'none',color:'#fff',fontSize:24,cursor:'pointer',padding:0,lineHeight:1,display:'flex',alignItems:'center'}}>☰</button>
        )}
        <div style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',marginRight:isMobile?0:8}} onClick={()=>{setPage('main');setGeneratedCode(null);if(isMobile)setSidebarOpen(false)}}>
          <svg width="22" height="22" viewBox="0 0 22 22">
            <polygon points="11,2 20,6.5 20,15.5 11,20 2,15.5 2,6.5" fill={gold} opacity=".2" stroke={gold} strokeWidth="1.2"/>
            <text x="11" y="15" textAnchor="middle" fontSize="9" fontWeight="900" fill={gold}>W</text>
          </svg>
          <span style={{fontSize:15,fontWeight:800,color:'#fff'}}><span>WIN</span><span style={{color:gold}}>PARTNERS</span></span>
        </div>
        {/* Badge inline items like Melbet */}
        {!isMobile && (
        <div style={{display:'flex',alignItems:'center',gap:6,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:4,padding:'4px 10px'}}>
          <span style={{fontSize:10,color:'rgba(255,255,255,0.4)'}}>Aff ID:</span>
          <span style={{fontSize:12,fontWeight:700,color:gold,fontFamily:'monospace'}}>{D.affId}</span>
        </div>
        )}
        <div style={{flex:1}}/>
        <div style={{display:'flex',gap:3,marginRight:6}}>
          {['ro','ru','en','tr','de','pt','pl'].map(l=>(
            <button key={l} onClick={()=>{setLang(l);localStorage.setItem('wp_lang',l)}} style={{padding:'2px 5px',fontSize:9,fontWeight:700,cursor:'pointer',border:`1px solid ${lang===l?gold:'rgba(255,255,255,0.15)'}`,borderRadius:3,background:lang===l?'rgba(245,166,35,0.15)':'none',color:lang===l?gold:'rgba(255,255,255,0.35)'}}>{l.toUpperCase()}</button>
          ))}
        </div>
        {!isMobile && (
        <button style={{...btnPrimary,fontSize:11,padding:'6px 14px',borderRadius:20}} onClick={()=>showToast('✓ '+{ro:'Statistici actualizate',ru:'Статистика обновлена',en:'Statistics refreshed',tr:'İstatistikler güncellendi',de:'Statistiken aktualisiert',pt:'Estatísticas atualizadas',pl:'Statystyki odświeżone'}[lang]||'Updated')}>↻ {({ro:'Actualizare',ru:'Обновить',en:'Refresh',tr:'Yenile',de:'Aktualisieren',pt:'Atualizar',pl:'Odśwież'})[lang]||'Refresh'}</button>
        )}
        <div style={{display:'flex',alignItems:'center',gap:8,borderLeft:'1px solid rgba(255,255,255,0.1)',paddingLeft:12}}>
          <div style={{width:28,height:28,borderRadius:'50%',background:`linear-gradient(135deg,${gold},#c97d00)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#000'}}>{D.name[0]}</div>
          {!isMobile && (
          <div style={{lineHeight:1.2}}>
            <div style={{fontSize:12,fontWeight:600,color:'#fff'}}>{D.name}</div>
            <div style={{fontSize:10,color:'rgba(255,255,255,0.4)'}}>@{D.username}</div>
          </div>
          )}
          <button style={{...btnOutline('rgba(255,255,255,0.35)'),color:'rgba(255,255,255,0.6)',fontSize:11,padding:'4px 10px',borderRadius:4}} onClick={()=>{ if(window.confirm(({ro:'Ești sigur că vrei să ieși?',ru:'Вы уверены, что хотите выйти?',en:'Are you sure you want to log out?',tr:'Çıkmak istediğine emin misin?',de:'Möchtest du dich wirklich abmelden?',pt:'Tens a certeza de que queres sair?',pl:'Czy na pewno chcesz się wylogować?'})[lang])) { sessionStorage.removeItem('wp_blogger'); onLogout() } }}>{L({ro:'Ieșire',ru:'Выход',en:'Log out',tr:'Çıkış',de:'Abmelden',pt:'Sair',pl:'Wyloguj'})}</button>
        </div>
      </div>

      <div style={{display:'flex',flex:1,overflow:'hidden'}}>

        {/* SIDEBAR - responsive */}
        <div style={Object.assign({},{width:220,background:bgSide,flexShrink:0,overflowY:'auto',paddingBottom:20,borderRight:'1px solid rgba(255,255,255,0.05)'},isMobile?{position:'fixed',top:52,left:sidebarOpen?0:-220,height:'calc(100vh - 52px)',zIndex:50,transition:'left .25s ease',boxShadow:sidebarOpen?'4px 0 20px rgba(0,0,0,0.4)':'none'}:{})}>
                    {/* SELECTOR CAZINO pliabil — caseta cu cazinoul activ + sageata pentru a alege altul */}
          {(() => {
            const cur = CASINOS_BASE.find(c=>c.id===selectedCasino) || CASINOS_BASE[0]
            return (
            <div style={{padding:'12px 12px 6px'}}>
              <div style={{padding:'0 2px 6px',fontSize:9,color:'rgba(255,255,255,0.25)',textTransform:'uppercase',letterSpacing:'.12em',fontWeight:600}}>{secCas}</div>
              <div onClick={()=>{setPage('casino');setGeneratedCode(null);if(isMobile)setSidebarOpen(false)}} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 10px 10px 12px',cursor:'pointer',borderRadius:11,background:'rgba(245,166,35,0.1)',border:`1px solid ${page==='casino'?'rgba(245,166,35,0.5)':'rgba(245,166,35,0.28)'}`,transition:'all .15s'}}>
                <div style={{width:38,height:38,borderRadius:10,background:(cur.color+'22'),display:'flex',alignItems:'center',justifyContent:'center',fontSize:21,flexShrink:0}}>{cur.logo}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:15,fontWeight:800,color:'#fff',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{cur.name}</div>
                  <div style={{fontSize:10,fontWeight:600,color:gold}}>{cur.commissionPct}% RevShare</div>
                </div>
                <span onClick={(e)=>{e.stopPropagation();setCasinoMenuOpen(o=>!o)}} title={L({ro:'Schimbă cazinoul',ru:'Сменить казино',en:'Switch casino',tr:'Kumarhane değiştir',de:'Casino wechseln',pt:'Mudar casino',pl:'Zmień kasyno'})} style={{fontSize:13,color:'rgba(255,255,255,0.55)',padding:'6px',marginRight:-2,borderRadius:6,transition:'transform .2s',transform:casinoMenuOpen?'rotate(180deg)':'rotate(0deg)'}}>▾</span>
              </div>
              {casinoMenuOpen && (
                <div style={{marginTop:5,background:'rgba(0,0,0,0.22)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:9,padding:4}}>
                  {CASINOS_BASE.map(c=>{
                    const sel = c.id===selectedCasino
                    return (
                    <div key={c.id} onClick={()=>{setSelectedCasino(c.id);setPage('casino');setGeneratedCode(null);setCasinoMenuOpen(false);if(isMobile)setSidebarOpen(false)}} style={{display:'flex',alignItems:'center',gap:9,padding:'8px 9px',borderRadius:7,cursor:'pointer',fontSize:13,fontWeight:sel?700:500,color:sel?gold:'rgba(255,255,255,0.6)',background:sel?'rgba(245,166,35,0.1)':'none',transition:'all .12s'}}>
                      <span style={{fontSize:16,width:20,textAlign:'center'}}>{c.logo}</span>
                      <span style={{flex:1,minWidth:0,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.name}</span>
                      {c.comingSoon&&<span style={{fontSize:8,fontWeight:700,padding:'2px 6px',borderRadius:8,background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'.04em'}}>{L({ro:'curând',ru:'скоро',en:'soon',tr:'yakında',de:'bald',pt:'em breve',pl:'wkrótce'})}</span>}
                      {sel&&!c.comingSoon&&<span style={{fontSize:12,color:gold}}>✓</span>}
                    </div>
                    )
                  })}
                </div>
              )}
            </div>
            )
          })()}

          {MENU.filter(m=>!m.casinoId).map((m)=>{
            const isActiveItem = page===m.id
            return (
            <div key={m.id}>
              {m.section&&<div style={{padding:'12px 14px 4px',fontSize:9,color:'rgba(255,255,255,0.25)',textTransform:'uppercase',letterSpacing:'.12em',fontWeight:600}}>{m.section}</div>}
              <div onClick={()=>{ setPage(m.id) ; if(isMobile) setSidebarOpen(false) }} style={{display:'flex',alignItems:'center',gap:8,padding:'9px 14px 9px 16px',cursor:'pointer',fontSize:13,color:isActiveItem?gold:'rgba(255,255,255,0.55)',background:isActiveItem?'rgba(245,166,35,0.1)':'none',borderLeft:isActiveItem?`3px solid ${gold}`:'3px solid transparent',transition:'all .12s'}}>
                <span style={{fontSize:14}}>{m.icon}</span>
                <span style={{flex:1}}>{m.label}</span>
                {m.id==='contact'&&myChatUnread>0&&<span style={{fontSize:10,fontWeight:700,minWidth:18,height:18,borderRadius:9,background:'#ef4444',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',padding:'0 5px'}}>{myChatUnread}</span>}
              </div>
            </div>
            )
          })}
        </div>

        {/* MAIN CONTENT - light white background like Melbet */}
        <div style={{flex:1,overflowY:'auto',overflowX:'hidden',padding:isMobile?'1rem 0.75rem':'1.5rem',minWidth:0,maxWidth:'100%'}}>

          {/* PAGE TITLE */}
          {/* Page title bar - like Melbet's yellow title */}
          {page!=='casino' && (
          <div style={{display:'flex',alignItems:'center',gap:0,marginBottom:'1.5rem',borderBottom:`2px solid #e5e7eb`}}>
            <div style={{padding:'0 0 12px',fontSize:18,fontWeight:700,color:gold,borderBottom:`3px solid ${gold}`,marginBottom:-2}}>
              {MENU.find(m=>m.id===page)?.label||'Dashboard'}
            </div>
          </div>
          )}

          {/* === PAGINA PRINCIPALA === */}
          {page==='main'&&(
            <div>
              {/* Header profesional — salut + status cont */}
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12,marginBottom:'1.25rem'}}>
                <div>
                  <div style={{fontSize:isMobile?20:24,fontWeight:800,color:txt,marginBottom:4}}>{({ro:'Bună',ru:'Привет',en:'Hello',tr:'Merhaba',de:'Hallo',pt:'Olá',pl:'Cześć'})[lang]||'Bună'}, {D.name.split(' ')[0]}! 👋</div>
                  <div style={{fontSize:13,color:txtSub}}>{({ro:'Bine ai venit în panoul tău de afiliere multi-cazinou.',ru:'Добро пожаловать в твою мульти-казино партнёрскую панель.',en:'Welcome to your multi-casino affiliate dashboard.',tr:'Çok kumarhaneli ortaklık paneline hoş geldin.',de:'Willkommen in deinem Multi-Casino-Partner-Dashboard.',pt:'Bem-vindo ao teu painel de afiliação multi-casino.',pl:'Witaj w swoim panelu partnerskim multi-kasyno.'})[lang]}</div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:20,padding:'6px 14px'}}>
                  <span style={{width:8,height:8,borderRadius:'50%',background:'#10b981',display:'inline-block',boxShadow:'0 0 8px #10b981'}}/>
                  <span style={{fontSize:12,fontWeight:700,color:'#10b981'}}>{({ro:'Cont activ',ru:'Аккаунт активен',en:'Account active',tr:'Hesap aktif',de:'Konto aktiv',pt:'Conta ativa',pl:'Konto aktywne'})[lang]||'Cont activ'}</span>
                </div>
              </div>
              {/* Welcome screen pentru bloggeri noi */}
              {(D.clicks===0 && D.regs===0) && (
                <div style={{background:'linear-gradient(135deg,rgba(245,166,35,0.08),rgba(245,166,35,0.02))',border:'1px solid rgba(245,166,35,0.25)',borderRadius:12,padding:'1.5rem',marginBottom:'1.25rem'}}>
                  <div style={{fontSize:16,fontWeight:800,color:'#f5a623',marginBottom:6}}>🎉 {L({ro:'Bun venit în WinPartners',ru:'Добро пожаловать в WinPartners',en:'Welcome to WinPartners',tr:"WinPartners'a hoş geldin",de:'Willkommen bei WinPartners',pt:'Bem-vindo à WinPartners',pl:'Witaj w WinPartners'})}, {D.name.split(' ')[0]}!</div>
                  <div style={{fontSize:13,color:'rgba(255,255,255,0.6)',marginBottom:14,lineHeight:1.6}}>
                    {L({ro:'Contul tău este activ. Urmează 3 pași simpli pentru a începe să câștigi:',ru:'Твой аккаунт активен. Выполни 3 простых шага, чтобы начать зарабатывать:',en:'Your account is active. Follow 3 simple steps to start earning:',tr:'Hesabın aktif. Kazanmaya başlamak için 3 basit adımı izle:',de:'Dein Konto ist aktiv. Folge 3 einfachen Schritten, um zu verdienen:',pt:'A tua conta está ativa. Segue 3 passos simples para começares a ganhar:',pl:'Twoje konto jest aktywne. Wykonaj 3 proste kroki, aby zacząć zarabiać:'})}
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:10}}>
                    {[
                      {n:'1',t:L({ro:'Alege un cazinou și generează-ți codul',ru:'Выбери казино и сгенерируй код',en:'Pick a casino and generate your code',tr:'Bir kumarhane seç ve kodunu oluştur',de:'Wähle ein Casino und generiere deinen Code',pt:'Escolhe um casino e gera o teu código',pl:'Wybierz kasyno i wygeneruj swój kod'}),d:L({ro:'Deschide oricare dintre cazinourile noastre → generează codul tău promoțional unic',ru:'Открой любое из наших казино → сгенерируй свой уникальный промокод',en:'Open any of our casinos → generate your unique promo code',tr:'Kumarhanelerimizden herhangi birini aç → benzersiz promosyon kodunu oluştur',de:'Öffne eines unserer Casinos → generiere deinen einzigartigen Promo-Code',pt:'Abre qualquer um dos nossos casinos → gera o teu código promo único',pl:'Otwórz dowolne z naszych kasyn → wygeneruj swój unikalny kod promo'}),p:'casino',btn:L({ro:'Vezi cazinourile →',ru:'Смотреть казино →',en:'View casinos →',tr:'Kumarhaneleri gör →',de:'Casinos ansehen →',pt:'Ver casinos →',pl:'Zobacz kasyna →'})},
                      {n:'2',t:L({ro:'Promovează pe platforma ta',ru:'Продвигай на своей платформе',en:'Promote on your platform',tr:'Kendi platformunda tanıt',de:'Bewirb auf deiner Plattform',pt:'Promove na tua plataforma',pl:'Promuj na swojej platformie'}),d:L({ro:'Include codul în videoclipuri, descrieri și story-uri',ru:'Добавляй код в видео, описания и истории',en:'Include the code in videos, descriptions and stories',tr:'Kodu videolara, açıklamalara ve hikâyelere ekle',de:'Füge den Code in Videos, Beschreibungen und Stories ein',pt:'Inclui o código em vídeos, descrições e stories',pl:'Dodawaj kod do filmów, opisów i relacji'}),p:null,btn:null},
                      {n:'3',t:L({ro:'Urmărește câștigurile',ru:'Следи за заработком',en:'Track your earnings',tr:'Kazançlarını takip et',de:'Verfolge deine Einnahmen',pt:'Acompanha os teus ganhos',pl:'Śledź swoje zarobki'}),d:L({ro:'Statisticile se actualizează săptămânal de echipa WinPartners',ru:'Статистика обновляется еженедельно командой WinPartners',en:'Stats are updated weekly by the WinPartners team',tr:'İstatistikler WinPartners ekibi tarafından haftalık güncellenir',de:'Statistiken werden wöchentlich vom WinPartners-Team aktualisiert',pt:'As estatísticas são atualizadas semanalmente pela equipa WinPartners',pl:'Statystyki są aktualizowane co tydzień przez zespół WinPartners'}),p:null,btn:null},
                    ].map(s=>(
                      <div key={s.n} style={{display:'flex',alignItems:'flex-start',gap:12,background:'rgba(255,255,255,0.03)',borderRadius:8,padding:'10px 14px'}}>
                        <div style={{minWidth:24,height:24,borderRadius:'50%',background:'#f5a623',color:'#000',fontWeight:800,fontSize:12,display:'flex',alignItems:'center',justifyContent:'center'}}>{s.n}</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:13,fontWeight:700,color:'#fff',marginBottom:2}}>{s.t}</div>
                          <div style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>{s.d}</div>
                        </div>
                        {s.btn && <button onClick={()=>{ if(s.p==='casino'){setSelectedCasino('melbet');setPage('casino')} else if(s.p){setPage(s.p)} }} style={{padding:'5px 12px',fontSize:11,fontWeight:700,cursor:'pointer',border:'1px solid #f5a623',borderRadius:6,background:'none',color:'#f5a623',whiteSpace:'nowrap'}}>{s.btn}</button>}
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:14,fontSize:12,color:'rgba(255,255,255,0.35)'}}>
                    {L({ro:'Ai întrebări? Scrie-ne pe',ru:'Есть вопросы? Напиши нам в',en:'Questions? Message us on',tr:'Sorun mu var? Bize yaz:',de:'Fragen? Schreib uns auf',pt:'Tens dúvidas? Escreve-nos no',pl:'Masz pytania? Napisz do nas na'})} <a href="https://t.me/winpartners_manager" target="_blank" rel="noopener noreferrer" style={{color:'#f5a623',textDecoration:'none'}}>Telegram @winpartners_manager</a>
                  </div>
                </div>
              )}
              {/* Balance cards */}
              <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(5,1fr)',gap:isMobile?1:0,background:isMobile?'transparent':bgCard,borderRadius:8,overflow:isMobile?'visible':'hidden',border:isMobile?'none':`1px solid ${bdr}`,marginBottom:'1.25rem',boxShadow:isMobile?'none':'0 1px 3px rgba(0,0,0,0.06)'}}>
                {[
                  {l:dt.balAvail||'DISPONIBIL',v:'$'+D.bal.available,c:'#10b981',bc:'#10b981'},
                  {l:dt.balYest||'IERI',v:'$'+D.bal.yesterday,c:'#3b82f6',bc:'#3b82f6'},
                  {l:dt.balMonth||'LUNA',v:'$'+D.bal.month,c:'#f59e0b',bc:'#f59e0b'},
                  {l:dt.bal30||'30 ZILE',v:'$'+D.bal.days30,c:'#ef4444',bc:'#ef4444'},
                  {l:dt.balTotal||'TOTAL',v:'$'+D.bal.total,c:'#10b981',bc:'#10b981'},
                ].map((it,i)=>(
                  <div key={it.l} style={{padding:isMobile?'10px 8px':'14px 16px',borderLeft:isMobile?'none':i>0?`1px solid ${bdr}`:'none',border:isMobile?`1px solid ${bdr}`:undefined,borderBottom:`3px solid ${it.bc}`,textAlign:'center',borderRadius:isMobile?6:0,background:isMobile?bgCard:undefined}}>
                    <div style={{fontSize:isMobile?17:22,fontWeight:800,color:it.c,marginBottom:4}}>{it.v}</div>
                    <div style={{fontSize:9,color:txtSub,textTransform:'uppercase',letterSpacing:'.06em',lineHeight:1.3}}>{it.l}</div>
                  </div>
                ))}
              </div>

              {/* Acces rapid — toate cazinourile */}
              <div style={{marginBottom:'1.25rem'}}>
                <div style={{fontSize:14,fontWeight:700,color:txt,marginBottom:10,display:'flex',alignItems:'center',gap:8}}>
                  <span>{({ro:'Cazinourile tale','ru':'Твои казино','en':'Your casinos','tr':'Kumarhanelerin','de':'Deine Casinos','pt':'Os teus casinos','pl':'Twoje kasyna'})[lang]||'Cazinourile tale'}</span>
                  <span style={{fontSize:11,fontWeight:600,color:txtSub,background:'#15151e',border:`1px solid ${bdr}`,borderRadius:10,padding:'2px 8px'}}>{CASINOS.filter(c=>!c.comingSoon).length} {({ro:'active','ru':'активны','en':'active','tr':'aktif','de':'aktiv','pt':'ativos','pl':'aktywne'})[lang]||'active'}</span>
                </div>
                <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(auto-fill,minmax(200px,1fr))',gap:10}}>
                  {CASINOS.map(c=>(
                    <div key={c.id} onClick={()=>{if(!c.comingSoon){setSelectedCasino(c.id);setPage('casino');setGeneratedCode(null);if(isMobile)setSidebarOpen(false)}}} style={{background:bgCard,border:`1px solid ${c.comingSoon?bdr:c.color+'55'}`,borderRadius:12,padding:'14px',cursor:c.comingSoon?'default':'pointer',opacity:c.comingSoon?0.6:1,transition:'all .15s',position:'relative'}} onMouseOver={e=>{if(!c.comingSoon){e.currentTarget.style.borderColor=c.color;e.currentTarget.style.transform='translateY(-2px)'}}} onMouseOut={e=>{if(!c.comingSoon){e.currentTarget.style.borderColor=c.color+'55';e.currentTarget.style.transform='none'}}}>
                      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                        <div style={{width:38,height:38,borderRadius:10,background:c.color+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>{c.logo}</div>
                        <div style={{minWidth:0,flex:1}}>
                          <div style={{fontSize:14,fontWeight:800,color:txt,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.name}</div>
                          <div style={{fontSize:11,fontWeight:700,color:c.color}}>{c.commissionPct}% RevShare</div>
                        </div>
                      </div>
                      {c.comingSoon
                        ? <div style={{fontSize:11,fontWeight:700,color:txtSub,textAlign:'center',padding:'4px',background:'#15151e',borderRadius:6}}>{({ro:'În curând','ru':'Скоро','en':'Coming soon','tr':'Yakında','de':'Bald','pt':'Em breve','pl':'Wkrótce'})[lang]||'În curând'}</div>
                        : <div style={{fontSize:12,fontWeight:700,color:c.color,textAlign:'center',padding:'5px',background:c.color+'14',borderRadius:6}}>{({ro:'Deschide →','ru':'Открыть →','en':'Open →','tr':'Aç →','de':'Öffnen →','pt':'Abrir →','pl':'Otwórz →'})[lang]||'Deschide →'}</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Câștigurile mele pe cazino — de unde vin banii */}
              {D.bal.byCasino && D.bal.byCasino.length > 0 && (
                <div style={{...card,padding:0,overflow:'hidden',marginBottom:'1.25rem'}}>
                  <div style={{padding:'12px 16px',borderBottom:`1px solid ${bdr}`,background:'#15151e',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:6}}>
                    <span style={{fontSize:13,fontWeight:700,color:txt}}>{({'ro':'Câștigurile mele pe cazino','ru':'Мои доходы по казино','en':'My earnings by casino','tr':'Kumarhaneye göre kazançlarım','de':'Meine Einnahmen pro Casino','pt':'Os meus ganhos por casino','pl':'Moje zarobki według kasyna'})[lang]||'Câștigurile mele pe cazino'}</span>
                    <span style={{fontSize:12,color:txtSub}}>{({'ro':'comision total','ru':'общая комиссия','en':'total commission','tr':'toplam komisyon','de':'Gesamtprovision','pt':'comissão total','pl':'całkowita prowizja'})[lang]||'comision total'}: <b style={{color:'#10b981'}}>${(D.bal.total||0).toLocaleString()}</b></span>
                  </div>
                  <div style={{padding:'4px 16px'}}>
                    {D.bal.byCasino.map((b,idx,arr)=>(
                      <div key={b.name} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 0',borderBottom:idx<arr.length-1?`1px solid ${bdr}`:'none'}}>
                        <div style={{display:'flex',alignItems:'center',gap:9}}>
                          <span style={{width:10,height:10,borderRadius:3,background:b.color,display:'inline-block'}}/>
                          <span style={{fontSize:13,color:txt,fontWeight:600}}>{b.name}</span>
                        </div>
                        <span style={{fontSize:14,fontWeight:800,color:b.color}}>${b.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Filters */}
              <div style={filterRow}>
                <span style={{fontSize:13,color:txtSub}}>{({'ro':'Perioada','ru':'Период','en':'Period','tr':'Dönem','de':'Zeitraum','pt':'Período','pl':'Okres'})[lang]||'Perioada'}</span>
                <select style={{...inp,width:110}} value={period} onChange={e=>setPeriod(e.target.value)}>
                  {({'ro':['1 zi','7 zile','1 lună','3 luni','6 luni','1 an'],'ru':['1 день','7 дней','1 месяц','3 месяца','6 месяцев','1 год'],'en':['1 day','7 days','1 month','3 months','6 months','1 year'],'tr':['1 gün','7 gün','1 ay','3 ay','6 ay','1 yıl'],'de':['1 Tag','7 Tage','1 Monat','3 Monate','6 Monate','1 Jahr'],'pt':['1 dia','7 dias','1 mês','3 meses','6 meses','1 ano'],'pl':['1 dzień','7 dni','1 miesiąc','3 miesiące','6 miesięcy','1 rok']})[lang]?.map(p=><option key={p}>{p}</option>)||['1 lună'].map(p=><option key={p}>{p}</option>)}
                </select>
                <span style={{fontSize:13,color:txtSub}}>{({'ro':'Valută','ru':'Валюта','en':'Currency','tr':'Para birimi','de':'Währung','pt':'Moeda','pl':'Waluta'})[lang]||'Valută'}</span>
                <select style={{...inp,width:75}} value={currency} onChange={e=>setCurrency(e.target.value)}>
                  {['USD','EUR','MDL'].map(c=><option key={c}>{c}</option>)}
                </select>
                <button style={btnPrimary} onClick={()=>{const el=document.getElementById('apply-toast');if(el){el.style.opacity='1';setTimeout(()=>el.style.opacity='0',1500)}}}>{({'ro':'APLICAȚI','ru':'ПРИМЕНИТЬ','en':'APPLY','tr':'UYGULA','de':'ANWENDEN','pt':'APLICAR','pl':'ZASTOSUJ'})[lang]||'APLICAȚI'}</button>
                <span id="apply-toast" style={{fontSize:11,color:'#10b981',transition:'opacity .3s',opacity:0}}>{({ro:'✓ Aplicat',ru:'✓ Применено',en:'✓ Applied',tr:'✓ Uygulandı',de:'✓ Angewendet',pt:'✓ Aplicado',pl:'✓ Zastosowano'})[lang]||'✓ Aplicat'}</span>
              </div>

              {/* Charts */}
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:12,marginBottom:'1.5rem'}}>
                {[
                  {title:dt.chartConv||'Conversii',items:[{f:'cl',c:'#3b82f6',l:dt.lViews||'Vizualizări'},{f:'rg',c:'#6366f1',l:dt.lClicks||'Clickuri'},{f:'dp',c:'#06b6d4',l:dt.lDirect||'Linkuri'}]},
                  {title:dt.chartReg||'Înregistrări',items:[{f:'rg',c:'#ef4444',l:dt.lRegs||'Înregistrări'},{f:'dp',c:'#10b981',l:dt.lDep||'Depunători'},{f:'rv',c:gold,l:dt.lComm||'Comision'}]},
                ].map(ch=>(
                  <div key={ch.title} style={{...card}}>
                    <div style={{fontSize:16,fontWeight:600,marginBottom:'1.25rem',color:txt}}>{ch.title}</div>
                    {ch.items.map(it=>(
                      <div key={it.f} style={{marginBottom:'0.75rem'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                          <span style={{fontSize:11,color:txtSub,display:'flex',alignItems:'center',gap:5}}>
                            <span style={{width:8,height:8,borderRadius:'50%',background:it.c,display:'inline-block'}}/>
                            {it.l}: 0
                          </span>
                          <div style={{display:'flex',gap:3}}>
                            {['1 s','1 I',L({ro:'Toate',ru:'Все',en:'All',tr:'Tümü',de:'Alle',pt:'Todos',pl:'Wszystkie'})].map(f=><span key={f} style={{fontSize:10,color:txtSub,padding:'1px 6px',borderRadius:3,border:`1px solid ${bdr}`,cursor:'pointer',background:'#15151e'}}>{f}</span>)}
                          </div>
                        </div>
                        <LineChart data={D.daily} field={it.f} color={it.c} h={55}/>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Summary table */}
              <div style={{...card,padding:0,overflow:'hidden'}}>
                <div style={{padding:'12px 16px',borderBottom:`1px solid ${bdr}`,display:'flex',justifyContent:'space-between',alignItems:'center',background:'#15151e'}}>
                  <span style={{fontSize:13,fontWeight:600,color:txt}}>{dt.chartSummary||'Sumar statistici'}</span>
                  <select style={{...inp,fontSize:12}}>
                    <option>{({'ro':'Ieri','ru':'Вчера','en':'Yesterday','tr':'Dün','de':'Gestern','pt':'Ontem','pl':'Wczoraj'})[lang]||'Ieri'}</option><option>{({'ro':'Azi','ru':'Сегодня','en':'Today','tr':'Bugün','de':'Heute','pt':'Hoje','pl':'Dziś'})[lang]||'Azi'}</option><option>{({'ro':'Săptămâna','ru':'Неделя','en':'Week','tr':'Hafta','de':'Woche','pt':'Semana','pl':'Tydzień'})[lang]||'Săptămâna'}</option>
                  </select>
                </div>
                <div style={{overflowX:'auto',width:'100%',maxWidth:'100%'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',minWidth:900}}>
                    <thead><tr>
                      {(({ro:['Valută','Vizualizări','Clickuri','Linkuri directe','Înregistrări','Depunători noi','Profit companie','RP','CPA','Comision'],
ru:['Валюта','Просмотры','Клики','Прямые ссылки','Регистрации','Новые депозиторы','Прибыль','RP','CPA','Комиссия'],
en:['Currency','Views','Clicks','Direct links','Registrations','New depositors','Company profit','RP','CPA','Commission'],
tr:['Para birimi','Görüntülemeler','Tıklamalar','Direkt linkler','Kayıtlar','Yeni yatırımcılar','Şirket kârı','RP','CPA','Komisyon'],
de:['Währung','Aufrufe','Klicks','Direkte Links','Registrierungen','Neue Einzahler','Firmengewinn','RP','CPA','Provision'],
pt:['Moeda','Visualizações','Cliques','Links diretos','Registros','Novos depositantes','Lucro empresa','RP','CPA','Comissão'],
pl:['Waluta','Wyświetlenia','Kliknięcia','Linki bezpośrednie','Rejestracje','Nowi deponenci','Zysk firmy','RP','CPA','Prowizja']})[lang]||['Valută','Vizualizări','Clickuri','Linkuri directe','Înregistrări','Depunători','Profit','RP','CPA','Comision']).map(h=><th key={h} style={TH}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      <tr>
                        {[currency,'0',totCl,'0',totRg,totDp,'$'+totRv,'0','0'].map((v,i)=><td key={i} style={TD}>{v}</td>)}
                        <td style={{...TD,color:'#10b981',fontWeight:700}}>${totComm}</td>
                      </tr>
                      {!D.agg && (<tr style={{background:'#15151e'}}>
                        <td colSpan={10} style={{...TD,fontStyle:'italic',color:txtSub,fontSize:11,textAlign:'center'}}>{L({ro:'Fără informații pentru perioada selectată',ru:'Нет данных за выбранный период',en:'No data for the selected period',tr:'Seçilen dönem için veri yok',de:'Keine Daten für den gewählten Zeitraum',pt:'Sem dados para o período selecionado',pl:'Brak danych dla wybranego okresu'})}</td>
                      </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bară de încredere */}
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:12,marginTop:'1.25rem'}}>
                {[
                  {icon:'💰',t:({ro:'Plăți săptămânale','ru':'Еженедельные выплаты','en':'Weekly payments','tr':'Haftalık ödemeler','de':'Wöchentliche Zahlungen','pt':'Pagamentos semanais','pl':'Cotygodniowe wypłaty'})[lang],s:({ro:'Minim $30 · direct la tine','ru':'Минимум $30 · напрямую тебе','en':'Min $30 · straight to you','tr':'Min $30 · doğrudan sana','de':'Min. $30 · direkt an dich','pt':'Mín $30 · direto para ti','pl':'Min $30 · prosto do Ciebie'})[lang]},
                  {icon:'💬',t:({ro:'Manager dedicat','ru':'Личный менеджер','en':'Dedicated manager','tr':'Özel yönetici','de':'Persönlicher Manager','pt':'Gestor dedicado','pl':'Dedykowany menedżer'})[lang],s:({ro:'Răspuns rapid pe Telegram','ru':'Быстрый ответ в Telegram','en':'Fast reply on Telegram','tr':'Telegram\'da hızlı yanıt','de':'Schnelle Antwort auf Telegram','pt':'Resposta rápida no Telegram','pl':'Szybka odpowiedź na Telegramie'})[lang]},
                  {icon:'🔒',t:({ro:'Comision pe viață','ru':'Комиссия пожизненно','en':'Lifetime commission','tr':'Ömür boyu komisyon','de':'Lebenslange Provision','pt':'Comissão vitalícia','pl':'Dożywotnia prowizja'})[lang],s:({ro:'Jucătorii rămân legați de tine','ru':'Игроки остаются за тобой','en':'Players stay tied to you','tr':'Oyuncular sana bağlı kalır','de':'Spieler bleiben dir zugeordnet','pt':'Os jogadores ficam ligados a ti','pl':'Gracze pozostają przypisani do Ciebie'})[lang]},
                ].map(it=>(
                  <div key={it.t} style={{display:'flex',alignItems:'flex-start',gap:12,background:bgCard,border:`1px solid ${bdr}`,borderRadius:12,padding:'14px 16px'}}>
                    <div style={{fontSize:24,flexShrink:0}}>{it.icon}</div>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:txt,marginBottom:2}}>{it.t}</div>
                      <div style={{fontSize:11,color:txtSub,lineHeight:1.4}}>{it.s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === WORKSPACE CAZINO (per-cazino, brandat) === */}
          {page==='casino'&&(()=>{
            const cid = selectedCasino || 'melbet'
            const c = CASINOS.find(x=>x.id===cid) || CASINOS[0]
            const accent = c.color
            const myCode = myCodes.find(x=>x.casinoId===cid)
            const gen = (generatedCode && generatedCode.casinoId===cid) ? generatedCode : null
            const reqSent = customRequests.find(r=>r.casinoId===cid && r.type==='casino_access')
            const codeReqSent = customRequests.find(r=>r.casinoId===cid && r.type==='code_request')
            const myCustomReq = customRequests.filter(r=>r.casinoId===cid && !r.type && r.requestedCode && r.requestedCode!=='ACCES' && r.requestedCode!=='REZERVĂ GOALĂ').sort((a,b)=>(b.id||0)-(a.id||0))[0]
            const approvedCustomCode = (myCustomReq && myCustomReq.status==='approved') ? (myCustomReq.approvedCode||myCustomReq.requestedCode) : null
            const theCode = approvedCustomCode || ((myCode||gen) ? (myCode?myCode.code:gen.code) : null)
            // Unelte blogger: link de referință proeminent + cod QR (apare oriunde există cod)
            const renderTools = (code) => {
              const link = getCasinoPlayerLink(cid, code)
              if (!link) return null
              const qr = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=' + encodeURIComponent(link)
              return (
                <div style={{display:'flex',gap:14,flexWrap:'wrap',alignItems:'stretch'}}>
                  <div style={{flex:'1 1 320px',minWidth:240,background:bgCard,border:('1.5px solid '+accent+'55'),borderRadius:12,padding:'16px 18px',display:'flex',flexDirection:'column',gap:10}}>
                    <div style={{fontSize:11,fontWeight:800,color:accent,textTransform:'uppercase',letterSpacing:'.08em'}}>{L({ro:'🔗 Link de referință — pune-l în bio, stories, descriere',ru:'🔗 Реферальная ссылка — добавь в био, истории, описание',en:'🔗 Referral link — put it in your bio, stories, description',tr:'🔗 Referans bağlantısı — bio, hikâye ve açıklamaya ekle',de:'🔗 Empfehlungslink — in Bio, Stories, Beschreibung',pt:'🔗 Link de indicação — coloque na bio, stories, descrição',pl:'🔗 Link polecający — wstaw w bio, relacjach, opisie'})}</div>
                    <div style={{fontFamily:'monospace',fontSize:13,color:txt,background:bg,border:('1px solid '+bdr),padding:'10px 12px',borderRadius:8,wordBreak:'break-all',lineHeight:1.5}}>{link}</div>
                    <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                      <button onClick={()=>copy(link,'cw_link')} style={{...btnPrimary,padding:'10px 20px',fontSize:13}}>{copied==='cw_link'?L({ro:'✓ Copiat!',ru:'✓ Скопировано!',en:'✓ Copied!',tr:'✓ Kopyalandı!',de:'✓ Kopiert!',pt:'✓ Copiado!',pl:'✓ Skopiowano!'}):L({ro:'📋 Copiază linkul',ru:'📋 Копировать ссылку',en:'📋 Copy link',tr:'📋 Bağlantıyı kopyala',de:'📋 Link kopieren',pt:'📋 Copiar link',pl:'📋 Kopiuj link'})}</button>
                      <a href={link} target="_blank" rel="noreferrer" style={{...btnOutline(accent),padding:'9px 16px',fontSize:13,textDecoration:'none',display:'inline-flex',alignItems:'center'}}>{L({ro:'Deschide',ru:'Открыть',en:'Open',tr:'Aç',de:'Öffnen',pt:'Abrir',pl:'Otwórz'})} ↗</a>
                    </div>
                    <div style={{fontSize:12,color:txtSub,lineHeight:1.5}}>{L({ro:'Jucătorul care intră pe acest link rămâne legat de tine — primești comision din pierderile lui pe viață, chiar dacă nu mai postezi.',ru:'Игрок, перешедший по ссылке, навсегда закреплён за тобой — ты получаешь комиссию с его проигрышей пожизненно, даже если перестанешь публиковать.',en:'A player who opens this link stays linked to you — you earn commission from their losses for life, even if you stop posting.',tr:'Bu bağlantıdan giren oyuncu sana bağlı kalır — paylaşımı bıraksan bile kayıplarından ömür boyu komisyon kazanırsın.',de:'Ein Spieler, der diesen Link öffnet, bleibt dir zugeordnet — du verdienst lebenslang Provision aus seinen Verlusten, auch wenn du nicht mehr postest.',pt:'O jogador que abrir este link fica ligado a ti — ganhas comissão das perdas dele para sempre, mesmo que pares de publicar.',pl:'Gracz, który wejdzie w ten link, zostaje przypisany do ciebie — zarabiasz prowizję z jego przegranych dożywotnio, nawet gdy przestaniesz publikować.'})}</div>
                  </div>
                  <div style={{flex:'0 0 auto',background:'#ffffff',border:('1.5px solid '+accent+'55'),borderRadius:12,padding:16,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8}}>
                    <img src={qr} alt={'Cod QR '+c.name} width={140} height={140} style={{display:'block',borderRadius:6}} />
                    <div style={{fontSize:10.5,fontWeight:700,color:txtSub,textTransform:'uppercase',letterSpacing:'.06em'}}>{L({ro:'Scanează în video',ru:'Сканируй в видео',en:'Scan in your video',tr:'Videoda tarat',de:'Im Video scannen',pt:'Digitaliza no vídeo',pl:'Zeskanuj w wideo'})}</div>
                  </div>
                </div>
              )
            }
            return (
            <div>
              {/* Strip taburi cazinouri — doar pe mobil (pe desktop navigația e bara laterală) */}
              {isMobile && (<div style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:6,marginBottom:'1.25rem',WebkitOverflowScrolling:'touch'}}>
                {CASINOS.map(x=>{
                  const sel = x.id===cid
                  return (
                    <button key={x.id} onClick={()=>{setSelectedCasino(x.id);setGeneratedCode(null)}}
                      style={{display:'flex',alignItems:'center',gap:7,padding:'8px 14px',borderRadius:9,cursor:'pointer',fontFamily:'inherit',fontSize:13,fontWeight:700,whiteSpace:'nowrap',flexShrink:0,
                        border: sel?('2px solid '+x.color):('1px solid '+bdr),
                        background: sel?(x.color+'15'):'#fff',
                        color: sel?x.color:txt}}>
                      <span style={{fontSize:16}}>{x.logo}</span>{x.name}
                      {x.comingSoon && <span style={{fontSize:9,fontWeight:700,padding:'2px 6px',borderRadius:8,background:'#1e1e2a',color:'#94a3b8'}}>{L({ro:'curând',ru:'скоро',en:'soon',tr:'yakında',de:'bald',pt:'em breve',pl:'wkrótce'})}</span>}
                    </button>
                  )
                })}
              </div>)}

              {/* Header brand cazino */}
              <div style={{background:('linear-gradient(135deg,'+accent+'1f,'+accent+'08)'),border:('1px solid '+accent+'44'),borderLeft:('5px solid '+accent),borderRadius:12,padding:isMobile?'16px':'20px 24px',marginBottom:'1.5rem',display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
                <div style={{width:56,height:56,borderRadius:14,background:(accent+'22'),display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,flexShrink:0}}>{c.logo}</div>
                <div style={{flex:1,minWidth:180}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
                    <div style={{fontSize:22,fontWeight:900,color:txt}}>{c.name}</div>
                    {c.comingSoon
                      ? <span style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:12,background:'rgba(245,166,35,0.16)',color:'#f7cd7a'}}>{L({ro:'În curând',ru:'Скоро',en:'Coming soon',tr:'Yakında',de:'Bald',pt:'Em breve',pl:'Wkrótce'})}</span>
                      : <span style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:12,background:'rgba(52,211,153,0.16)',color:'#34d399'}}>{L({ro:'Activ',ru:'Активно',en:'Active',tr:'Aktif',de:'Aktiv',pt:'Ativo',pl:'Aktywne'})}</span>}
                  </div>
                  <div style={{fontSize:13,color:accent,fontWeight:700,marginTop:3}}>{L(c.commission)}</div>
                  <div style={{fontSize:12,color:txtSub,marginTop:4}}>{L(c.description)}</div>
                </div>
                <div style={{textAlign:'right',fontSize:12,color:txtSub,lineHeight:1.7}}>
                  <div>{L({ro:'Plată:',ru:'Выплата:',en:'Payout:',tr:'Ödeme:',de:'Auszahlung:',pt:'Pagamento:',pl:'Wypłata:'})} <b style={{color:txt}}>{L({ro:c.payFreq,ru:c.payFreq==='Săptămânal'?'Еженедельно':'Ежемесячно',en:c.payFreq==='Săptămânal'?'Weekly':'Monthly',tr:c.payFreq==='Săptămânal'?'Haftalık':'Aylık',de:c.payFreq==='Săptămânal'?'Wöchentlich':'Monatlich',pt:c.payFreq==='Săptămânal'?'Semanal':'Mensal',pl:c.payFreq==='Săptămânal'?'Tygodniowo':'Miesięcznie'})}</b></div>
                  <div>Min: <b style={{color:txt}}>{c.minPayout}</b></div>
                  <div>Geo: <b style={{color:txt}}>{c.geo}</b></div>
                </div>
              </div>

              {/* Statistici cazino */}
              <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:12,marginBottom:'1.5rem'}}>
                {[
                  [L({ro:'Înregistrări',ru:'Регистрации',en:'Registrations',tr:'Kayıtlar',de:'Registrierungen',pt:'Registos',pl:'Rejestracje'}), c.stats.regs||0, txt],
                  [L({ro:'Depunători',ru:'Депозиторы',en:'Depositors',tr:'Para yatıranlar',de:'Einzahler',pt:'Depositantes',pl:'Wpłacający'}), c.stats.deposits||0, '#3b82f6'],
                  [L({ro:'Venit generat',ru:'Доход',en:'Revenue',tr:'Gelir',de:'Umsatz',pt:'Receita',pl:'Przychód'}), '$'+(c.stats.revenue||0).toLocaleString(), '#8b5cf6'],
                  [L({ro:'Comisionul meu',ru:'Моя комиссия',en:'My commission',tr:'Komisyonum',de:'Meine Provision',pt:'A minha comissão',pl:'Moja prowizja'}), '$'+(c.stats.commission||0).toLocaleString(), '#10b981'],
                ].map(([l,v,col])=>(
                  <div key={l} style={{...card,borderBottom:('3px solid '+accent),textAlign:'center',padding:'16px 10px'}}>
                    <div style={{fontSize:isMobile?22:26,fontWeight:900,color:col}}>{v}</div>
                    <div style={{fontSize:10,color:txtSub,textTransform:'uppercase',letterSpacing:'.05em',marginTop:4}}>{l}</div>
                  </div>
                ))}
              </div>

              {/* Link de afiliere atribuit manual de admin (dacă există) */}
              {c.stats.affLink && (
                <div style={{background:('linear-gradient(135deg,'+accent+'1a,'+accent+'06)'),border:('1.5px solid '+accent+'55'),borderRadius:12,padding:'16px 18px',marginBottom:'1.5rem'}}>
                  <div style={{fontSize:11,fontWeight:800,color:accent,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:8}}>{L({ro:'🔗 Linkul tău de afiliere '+c.name,ru:'🔗 Твоя партнёрская ссылка '+c.name,en:'🔗 Your '+c.name+' affiliate link',tr:'🔗 '+c.name+' ortaklık bağlantın',de:'🔗 Dein '+c.name+'-Affiliate-Link',pt:'🔗 O teu link de afiliado '+c.name,pl:'🔗 Twój link afiliacyjny '+c.name})}</div>
                  <div style={{fontFamily:'monospace',fontSize:13,color:txt,background:bg,border:('1px solid '+bdr),padding:'10px 12px',borderRadius:8,wordBreak:'break-all',lineHeight:1.5,marginBottom:10}}>{c.stats.affLink}</div>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    <button onClick={()=>copy(c.stats.affLink,'aff_'+cid)} style={{...btnPrimary,padding:'10px 20px',fontSize:13}}>{copied==='aff_'+cid?L({ro:'✓ Copiat!',ru:'✓ Скопировано!',en:'✓ Copied!',tr:'✓ Kopyalandı!',de:'✓ Kopiert!',pt:'✓ Copiado!',pl:'✓ Skopiowano!'}):L({ro:'📋 Copiază linkul',ru:'📋 Копировать ссылку',en:'📋 Copy link',tr:'📋 Bağlantıyı kopyala',de:'📋 Link kopieren',pt:'📋 Copiar link',pl:'📋 Kopiuj link'})}</button>
                    <a href={c.stats.affLink} target="_blank" rel="noreferrer" style={{...btnOutline(accent),padding:'9px 16px',fontSize:13,textDecoration:'none',display:'inline-flex',alignItems:'center'}}>{L({ro:'Deschide',ru:'Открыть',en:'Open',tr:'Aç',de:'Öffnen',pt:'Abrir',pl:'Otwórz'})} ↗</a>
                  </div>
                </div>
              )}

              {!c.comingSoon && myCustomReq && myCustomReq.status==='pending' && (
                <div style={{background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.35)',borderRadius:10,padding:'14px 18px',marginBottom:'1.25rem',display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                  <div style={{fontSize:22}}>⏳</div>
                  <div style={{flex:'1 1 240px',fontSize:13,color:'#fbbf24',lineHeight:1.5}}>{L({ro:'Codul personalizat ',ru:'Персональный код ',en:'Custom code ',tr:'Özel kod ',de:'Eigener Code ',pt:'Código personalizado ',pl:'Własny kod '})}<strong style={{fontFamily:'monospace',color:'#fcd34d'}}>{myCustomReq.requestedCode}</strong>{L({ro:' este în verificare la cazinou. Te anunțăm aici și pe Telegram când devine activ — de obicei în 24-48 ore.',ru:' проверяется в казино. Сообщим здесь и в Telegram, когда станет активным — обычно за 24-48 часов.',en:' is being verified with the casino. We will notify you here and on Telegram once it is active — usually within 24-48 hours.',tr:' kumarhanede doğrulanıyor. Aktif olduğunda burada ve Telegram üzerinden haber veririz — genellikle 24-48 saat içinde.',de:' wird beim Casino geprüft. Wir benachrichtigen dich hier und auf Telegram, sobald er aktiv ist — meist innerhalb von 24-48 Stunden.',pt:' está a ser verificado no casino. Avisamos aqui e no Telegram quando estiver ativo — normalmente em 24-48 horas.',pl:' jest weryfikowany w kasynie. Powiadomimy tutaj i na Telegramie, gdy będzie aktywny — zwykle w ciągu 24-48 godzin.'})}</div>
                </div>
              )}
              {!c.comingSoon && myCustomReq && myCustomReq.status==='rejected' && (
                <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.35)',borderRadius:10,padding:'14px 18px',marginBottom:'1.25rem',display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                  <div style={{fontSize:22}}>⚠️</div>
                  <div style={{flex:'1 1 240px',fontSize:13,color:'#f87171',lineHeight:1.5}}>{L({ro:'Numele ',ru:'Имя ',en:'The name ',tr:'İsim ',de:'Der Name ',pt:'O nome ',pl:'Nazwa '})}<strong style={{fontFamily:'monospace',color:'#fca5a5'}}>{myCustomReq.requestedCode}</strong>{L({ro:' nu este disponibil la cazinou. Încearcă alt nume.',ru:' недоступно в казино. Попробуй другое имя.',en:' is not available at the casino. Try another name.',tr:' kumarhanede mevcut değil. Başka bir isim dene.',de:' ist beim Casino nicht verfügbar. Versuche einen anderen Namen.',pt:' não está disponível no casino. Tenta outro nome.',pl:' jest niedostępna w kasynie. Spróbuj innej nazwy.'})}</div>
                  <button onClick={()=>{setCustomCasinoId(cid);setCustomCodeSent(false);setShowCustomCode(true)}} style={{...btnOutline(accent),padding:'8px 16px',fontSize:13}}>✨ {L({ro:'Încearcă alt nume',ru:'Другое имя',en:'Try another name',tr:'Başka isim dene',de:'Anderen Namen',pt:'Outro nome',pl:'Inna nazwa'})}</button>
                </div>
              )}
              {c.comingSoon ? (
                /* Cazino neaprobat încă — cerere de acces */
                <div style={{...card,padding:0,overflow:'hidden',marginBottom:'1.5rem'}}>
                  <div style={{background:(accent+'12'),padding:'14px 20px',borderBottom:('1px solid '+bdr),fontWeight:700,fontSize:14,color:txt}}>{({ro:'Vrei să promovezi',ru:'Хочешь продвигать',en:'Want to promote',tr:'Tanıtmak ister misin',de:'Möchtest du bewerben',pt:'Queres promover',pl:'Chcesz promować'})[lang]||'Vrei să promovezi'} {c.name}?</div>
                  <div style={{padding:'20px 24px'}}>
                    <p style={{fontSize:13,color:txtSub,lineHeight:1.7,marginBottom:16}}>
                      {L({ro:'Lucrăm la activarea afilierii cu '+c.name+'. Trimite o cerere acum — apari pe lista de așteptare și ești printre primii care primesc cod imediat ce afilierea e aprobată. Te anunțăm pe Telegram.',ru:'Мы работаем над подключением партнёрки с '+c.name+'. Отправь заявку сейчас — попадёшь в список ожидания и получишь код одним из первых, как только её одобрят. Сообщим в Telegram.',en:'We are working on activating the '+c.name+' partnership. Send a request now — you will join the waiting list and be among the first to get a code once it is approved. We will notify you on Telegram.',tr:c.name+' ortaklığını aktifleştirmek için çalışıyoruz. Şimdi talep gönder — bekleme listesine girersin ve onaylanır onaylanmaz kod alan ilk kişilerden olursun. Telegram üzerinden haber veririz.',de:'Wir arbeiten an der Aktivierung der '+c.name+'-Partnerschaft. Sende jetzt eine Anfrage — du kommst auf die Warteliste und erhältst als einer der Ersten einen Code, sobald sie freigegeben ist. Wir benachrichtigen dich auf Telegram.',pt:'Estamos a ativar a parceria com a '+c.name+'. Envia um pedido agora — entras na lista de espera e ficas entre os primeiros a receber código assim que for aprovada. Avisamos no Telegram.',pl:'Pracujemy nad uruchomieniem współpracy z '+c.name+'. Wyślij wniosek teraz — trafisz na listę oczekujących i będziesz wśród pierwszych z kodem po zatwierdzeniu. Powiadomimy na Telegramie.'})}
                    </p>
                    {reqSent ? (
                      <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'#10231a',border:'1px solid rgba(52,211,153,0.28)',borderRadius:8,padding:'10px 16px',fontSize:13,color:'#4ade80',fontWeight:600}}>
                        ✓ {L({ro:'Cerere trimisă',ru:'Заявка отправлена',en:'Request sent',tr:'Talep gönderildi',de:'Anfrage gesendet',pt:'Pedido enviado',pl:'Wniosek wysłany'})}{reqSent.date?(' · '+reqSent.date):''} — {L({ro:'ești pe lista de așteptare',ru:'ты в списке ожидания',en:'you are on the waiting list',tr:'bekleme listesindesin',de:'du bist auf der Warteliste',pt:'estás na lista de espera',pl:'jesteś na liście oczekujących'})}
                      </div>
                    ) : (
                      <button onClick={()=>setShowCasinoRequest(cid)} style={{...btnPrimary,padding:'12px 26px',fontSize:14,background:accent,borderColor:accent}}>
                        📩 {L({ro:'Vreau să lucrez cu '+c.name,ru:'Хочу работать с '+c.name,en:'I want to work with '+c.name,tr:c.name+' ile çalışmak istiyorum',de:'Ich möchte mit '+c.name+' arbeiten',pt:'Quero trabalhar com '+c.name,pl:'Chcę współpracować z '+c.name})}
                      </button>
                    )}
                  </div>
                </div>
              ) : approvedCustomCode ? (
                /* COD PERSONALIZAT APROBAT — activ */
                <div style={{...card,padding:0,overflow:'hidden',marginBottom:'1.5rem',borderColor:'rgba(52,211,153,0.45)'}}>
                  <div style={{background:'rgba(16,185,129,0.14)',padding:'14px 20px',borderBottom:('1px solid '+bdr),fontWeight:700,fontSize:14,color:'#34d399'}}>✅ {L({ro:'Codul tău personalizat e activ!',ru:'Твой персональный код активен!',en:'Your custom code is active!',tr:'Özel kodun aktif!',de:'Dein eigener Code ist aktiv!',pt:'O teu código personalizado está ativo!',pl:'Twój własny kod jest aktywny!'})}</div>
                  <div style={{padding:'20px 24px'}}>
                    <div style={{background:'#10231a',border:'1px solid rgba(52,211,153,0.28)',borderRadius:8,padding:'16px 20px',marginBottom:12}}>
                      <div style={{fontSize:11,color:'#34d399',fontWeight:600,marginBottom:6,textTransform:'uppercase',letterSpacing:'.06em'}}>{L({ro:'🎟 Cod promoțional — spune-l în video',ru:'🎟 Промокод — назови его в видео',en:'🎟 Promo code — say it in your video',tr:'🎟 Promosyon kodu — videoda söyle',de:'🎟 Promo-Code — nenne ihn im Video',pt:'🎟 Código promo — diz no vídeo',pl:'🎟 Kod promocyjny — podaj go w wideo'})}</div>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
                        <div style={{fontSize:30,fontWeight:900,color:'#4ade80',fontFamily:'monospace',letterSpacing:3}}>{approvedCustomCode}</div>
                        <button onClick={()=>copy(approvedCustomCode,'cw_code')} style={{...btnPrimary,padding:'8px 18px',fontSize:13}}>{copied==='cw_code'?L({ro:'✓ Copiat!',ru:'✓ Скопировано!',en:'✓ Copied!',tr:'✓ Kopyalandı!',de:'✓ Kopiert!',pt:'✓ Copiado!',pl:'✓ Skopiowano!'}):L({ro:'📋 Copiază',ru:'📋 Копировать',en:'📋 Copy',tr:'📋 Kopyala',de:'📋 Kopieren',pt:'📋 Copiar',pl:'📋 Kopiuj'})}</button>
                      </div>
                      <div style={{fontSize:12,color:'#34d399',marginTop:6}}>{L({ro:'Jucătorul îl introduce la înregistrare pe '+c.name+' și tu câștigi comision pe viață.',ru:'Игрок вводит его при регистрации на '+c.name+', а ты получаешь комиссию пожизненно.',en:'The player enters it when signing up on '+c.name+' and you earn commission for life.',tr:'Oyuncu '+c.name+' kaydında bu kodu girer, sen ömür boyu komisyon kazanırsın.',de:'Der Spieler gibt ihn bei der Anmeldung auf '+c.name+' ein und du verdienst lebenslang Provision.',pt:'O jogador insere-o ao registar-se na '+c.name+' e ganhas comissão para sempre.',pl:'Gracz wpisuje go przy rejestracji na '+c.name+' i zarabiasz prowizję dożywotnio.'})}</div>
                    </div>
                    <div style={{marginBottom:14}}>{renderTools(approvedCustomCode)}</div>
                  </div>
                </div>
              ) : myCode ? (
                /* Are cod — afișează cod + link */
                <div style={{...card,padding:0,overflow:'hidden',marginBottom:'1.5rem'}}>
                  <div style={{background:(accent+'12'),padding:'14px 20px',borderBottom:('1px solid '+bdr),fontWeight:700,fontSize:14,color:txt}}>{L({ro:'Codul tău '+c.name,ru:'Твой код '+c.name,en:'Your '+c.name+' code',tr:c.name+' kodun',de:'Dein '+c.name+'-Code',pt:'O teu código '+c.name,pl:'Twój kod '+c.name})}</div>
                  <div style={{padding:'20px 24px'}}>
                    <div style={{background:'#10231a',border:'1px solid rgba(52,211,153,0.28)',borderRadius:8,padding:'16px 20px',marginBottom:12}}>
                      <div style={{fontSize:11,color:'#34d399',fontWeight:600,marginBottom:6,textTransform:'uppercase',letterSpacing:'.06em'}}>{L({ro:'🎟 Cod promoțional — spune-l în video',ru:'🎟 Промокод — назови его в видео',en:'🎟 Promo code — say it in your video',tr:'🎟 Promosyon kodu — videoda söyle',de:'🎟 Promo-Code — nenne ihn im Video',pt:'🎟 Código promo — diz no vídeo',pl:'🎟 Kod promocyjny — podaj go w wideo'})}</div>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
                        <div style={{fontSize:30,fontWeight:900,color:'#4ade80',fontFamily:'monospace',letterSpacing:3}}>{myCode.code}</div>
                        <button onClick={()=>copy(myCode.code,'cw_code')} style={{...btnPrimary,padding:'8px 18px',fontSize:13}}>{copied==='cw_code'?L({ro:'✓ Copiat!',ru:'✓ Скопировано!',en:'✓ Copied!',tr:'✓ Kopyalandı!',de:'✓ Kopiert!',pt:'✓ Copiado!',pl:'✓ Skopiowano!'}):L({ro:'📋 Copiază',ru:'📋 Копировать',en:'📋 Copy',tr:'📋 Kopyala',de:'📋 Kopieren',pt:'📋 Copiar',pl:'📋 Kopiuj'})}</button>
                      </div>
                      <div style={{fontSize:12,color:'#34d399',marginTop:6}}>{L({ro:'Jucătorul îl introduce la înregistrare pe '+c.name+' → tu primești '+c.commissionPct+'% din pierderile lui.',ru:'Игрок вводит его при регистрации на '+c.name+' → ты получаешь '+c.commissionPct+'% с его проигрышей.',en:'The player enters it when signing up on '+c.name+' → you get '+c.commissionPct+'% of their losses.',tr:'Oyuncu '+c.name+' kaydında girer → kayıplarının %'+c.commissionPct+'\'ini alırsın.',de:'Der Spieler gibt ihn bei der Anmeldung auf '+c.name+' ein → du erhältst '+c.commissionPct+'% seiner Verluste.',pt:'O jogador insere-o ao registar-se na '+c.name+' → recebes '+c.commissionPct+'% das perdas dele.',pl:'Gracz wpisuje go przy rejestracji na '+c.name+' → dostajesz '+c.commissionPct+'% jego przegranych.'})}</div>
                    </div>
                    <div style={{marginBottom:14}}>{renderTools(myCode.code)}</div>
                    {!myCustomReq && (<button onClick={()=>{setCustomCasinoId(cid);setCustomCodeSent(false);setShowCustomCode(true)}} style={{...btnOutline(accent),padding:'9px 20px',fontSize:13}}>✨ {L({ro:'Vreau cod personalizat cu numele meu',ru:'Хочу персональный код с моим именем',en:'I want a custom code with my name',tr:'Adımla özel bir kod istiyorum',de:'Ich möchte einen eigenen Code mit meinem Namen',pt:'Quero um código personalizado com o meu nome',pl:'Chcę własny kod z moim imieniem'})}</button>)}
                  </div>
                </div>
              ) : gen ? (
                gen.error ? (
                  <div style={{...card,padding:0,overflow:'hidden',marginBottom:'1.5rem'}}>
                    <div style={{background:(accent+'12'),padding:'14px 20px',borderBottom:('1px solid '+bdr),fontWeight:700,fontSize:14,color:txt}}>{L({ro:'Solicită codul tău '+c.name,ru:'Запроси свой код '+c.name,en:'Request your '+c.name+' code',tr:c.name+' kodunu iste',de:'Fordere deinen '+c.name+'-Code an',pt:'Solicita o teu código '+c.name,pl:'Poproś o swój kod '+c.name})}</div>
                    <div style={{padding:'20px 24px'}}>
                      <p style={{fontSize:13,color:txtSub,lineHeight:1.7,marginBottom:16}}>{L({ro:'Apasă butonul de mai jos și managerul îți pregătește un cod '+c.name+' personal. Îl primești în maxim 24 de ore și te anunțăm pe Telegram.',ru:'Нажми кнопку ниже — менеджер подготовит твой персональный код '+c.name+'. Ты получишь его в течение 24 часов, сообщим в Telegram.',en:'Tap the button below and the manager will prepare your personal '+c.name+' code. You will receive it within 24 hours and we will notify you on Telegram.',tr:'Aşağıdaki butona bas, yönetici sana özel '+c.name+' kodunu hazırlasın. 24 saat içinde alırsın, Telegram\'dan haber veririz.',de:'Tippe auf die Schaltfläche unten und der Manager bereitet deinen persönlichen '+c.name+'-Code vor. Du erhältst ihn innerhalb von 24 Stunden, wir benachrichtigen dich auf Telegram.',pt:'Toca no botão abaixo e o gestor prepara o teu código '+c.name+' pessoal. Recebe-lo em até 24 horas e avisamos no Telegram.',pl:'Kliknij przycisk poniżej, a menedżer przygotuje Twój osobisty kod '+c.name+'. Otrzymasz go w ciągu 24 godzin, powiadomimy na Telegramie.'})}</p>
                      {codeReqSent ? (
                        <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'#10231a',border:'1px solid rgba(52,211,153,0.28)',borderRadius:8,padding:'10px 16px',fontSize:13,color:'#4ade80',fontWeight:600}}>✓ {L({ro:'Cerere trimisă',ru:'Заявка отправлена',en:'Request sent',tr:'Talep gönderildi',de:'Anfrage gesendet',pt:'Pedido enviado',pl:'Wniosek wysłany'})}{codeReqSent.date?(' · '+codeReqSent.date):''} — {L({ro:'ești pe listă',ru:'ты в списке',en:'you are on the list',tr:'listedesin',de:'du bist auf der Liste',pt:'estás na lista',pl:'jesteś na liście'})}</div>
                      ) : (
                        <button onClick={()=>requestNewCode(cid, c.name)} style={{...btnPrimary,padding:'12px 26px',fontSize:14,background:accent,borderColor:accent}}>📩 {L({ro:'Solicită un cod '+c.name,ru:'Запросить код '+c.name,en:'Request a '+c.name+' code',tr:c.name+' kodu iste',de:'Einen '+c.name+'-Code anfordern',pt:'Pedir um código '+c.name,pl:'Poproś o kod '+c.name})}</button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{...card,padding:0,overflow:'hidden',marginBottom:'1.5rem'}}>
                    <div style={{background:(accent+'12'),padding:'14px 20px',borderBottom:('1px solid '+bdr),fontWeight:700,fontSize:14,color:txt}}>{L({ro:'Codul tău '+c.name,ru:'Твой код '+c.name,en:'Your '+c.name+' code',tr:c.name+' kodun',de:'Dein '+c.name+'-Code',pt:'O teu código '+c.name,pl:'Twój kod '+c.name})}</div>
                    <div style={{padding:'20px 24px'}}>
                      <div style={{background:'#10231a',border:'1px solid rgba(52,211,153,0.28)',borderRadius:8,padding:'16px 20px',marginBottom:14}}>
                        <div style={{fontSize:11,color:'#34d399',fontWeight:600,marginBottom:6,textTransform:'uppercase',letterSpacing:'.06em'}}>{L({ro:'🎟 Cod promoțional — spune-l în video',ru:'🎟 Промокод — назови его в видео',en:'🎟 Promo code — say it in your video',tr:'🎟 Promosyon kodu — videoda söyle',de:'🎟 Promo-Code — nenne ihn im Video',pt:'🎟 Código promo — diz no vídeo',pl:'🎟 Kod promocyjny — podaj go w wideo'})}</div>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
                          <div style={{fontSize:30,fontWeight:900,color:'#4ade80',fontFamily:'monospace',letterSpacing:3}}>{gen.code}</div>
                          <button onClick={()=>copy(gen.code,'cw_code')} style={{...btnPrimary,padding:'8px 18px',fontSize:13}}>{copied==='cw_code'?L({ro:'✓ Copiat!',ru:'✓ Скопировано!',en:'✓ Copied!',tr:'✓ Kopyalandı!',de:'✓ Kopiert!',pt:'✓ Copiado!',pl:'✓ Skopiowano!'}):L({ro:'📋 Copiază',ru:'📋 Копировать',en:'📋 Copy',tr:'📋 Kopyala',de:'📋 Kopieren',pt:'📋 Copiar',pl:'📋 Kopiuj'})}</button>
                        </div>
                        <div style={{fontSize:12,color:'#34d399',marginTop:6}}>{L({ro:'Jucătorul îl introduce la înregistrare pe '+c.name+' → tu primești '+c.commissionPct+'% din pierderile lui.',ru:'Игрок вводит его при регистрации на '+c.name+' → ты получаешь '+c.commissionPct+'% с его проигрышей.',en:'The player enters it when signing up on '+c.name+' → you get '+c.commissionPct+'% of their losses.',tr:'Oyuncu '+c.name+' kaydında girer → kayıplarının %'+c.commissionPct+'\'ini alırsın.',de:'Der Spieler gibt ihn bei der Anmeldung auf '+c.name+' ein → du erhältst '+c.commissionPct+'% seiner Verluste.',pt:'O jogador insere-o ao registar-se na '+c.name+' → recebes '+c.commissionPct+'% das perdas dele.',pl:'Gracz wpisuje go przy rejestracji na '+c.name+' → dostajesz '+c.commissionPct+'% jego przegranych.'})}</div>
                      </div>
                      {renderTools(gen.code)}
                    </div>
                  </div>
                )
              ) : codeReqSent ? (
                /* A cerut cod (rezerva era goală) — așteaptă reumplere */
                <div style={{...card,padding:0,overflow:'hidden',marginBottom:'1.5rem'}}>
                  <div style={{background:(accent+'12'),padding:'14px 20px',borderBottom:('1px solid '+bdr),fontWeight:700,fontSize:14,color:txt}}>{L({ro:'Cerere de cod '+c.name+' în curs',ru:'Заявка на код '+c.name+' в обработке',en:c.name+' code request in progress',tr:c.name+' kod talebi işleniyor',de:c.name+'-Code-Anfrage in Bearbeitung',pt:'Pedido de código '+c.name+' em andamento',pl:'Wniosek o kod '+c.name+' w toku'})}</div>
                  <div style={{padding:'20px 24px'}}>
                    <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'#10231a',border:'1px solid rgba(52,211,153,0.28)',borderRadius:8,padding:'10px 16px',fontSize:13,color:'#4ade80',fontWeight:600}}>✓ {L({ro:'Cerere trimisă',ru:'Заявка отправлена',en:'Request sent',tr:'Talep gönderildi',de:'Anfrage gesendet',pt:'Pedido enviado',pl:'Wniosek wysłany'})}{codeReqSent.date?(' · '+codeReqSent.date):''} — {L({ro:'managerul îți pregătește codul. Îl primești în maxim 24 de ore, te anunțăm pe Telegram.',ru:'менеджер готовит твой код. Получишь его в течение 24 часов, сообщим в Telegram.',en:'the manager is preparing your code. You will receive it within 24 hours, we will notify you on Telegram.',tr:'yönetici kodunu hazırlıyor. 24 saat içinde alırsın, Telegram\'dan haber veririz.',de:'der Manager bereitet deinen Code vor. Du erhältst ihn innerhalb von 24 Stunden, wir benachrichtigen dich auf Telegram.',pt:'o gestor está a preparar o teu código. Recebe-lo em até 24 horas, avisamos no Telegram.',pl:'menedżer przygotowuje Twój kod. Otrzymasz go w ciągu 24 godzin, powiadomimy na Telegramie.'})}</div>
                  </div>
                </div>
              ) : (
                /* Activ fără cod — generează */
                <div style={{...card,padding:'24px',marginBottom:'1.5rem'}}>
                  <div style={{fontSize:15,fontWeight:700,color:txt,marginBottom:8}}>{L({ro:'Generează-ți codul '+c.name,ru:'Сгенерируй свой код '+c.name,en:'Generate your '+c.name+' code',tr:c.name+' kodunu oluştur',de:'Generiere deinen '+c.name+'-Code',pt:'Gera o teu código '+c.name,pl:'Wygeneruj swój kod '+c.name})}</div>
                  <p style={{fontSize:13,color:txtSub,marginBottom:16,lineHeight:1.6}}>{L({ro:'Codul va fi asociat contului @'+D.username+' și câștigi '+c.commissionPct+'% din pierderile jucătorilor care îl folosesc.',ru:'Код будет привязан к аккаунту @'+D.username+', и ты получаешь '+c.commissionPct+'% с проигрышей игроков, которые его используют.',en:'The code will be linked to @'+D.username+' and you earn '+c.commissionPct+'% of the losses of players who use it.',tr:'Kod @'+D.username+' hesabına bağlanır ve onu kullanan oyuncuların kayıplarından %'+c.commissionPct+' kazanırsın.',de:'Der Code wird mit @'+D.username+' verknüpft und du verdienst '+c.commissionPct+'% der Verluste der Spieler, die ihn nutzen.',pt:'O código fica associado a @'+D.username+' e ganhas '+c.commissionPct+'% das perdas dos jogadores que o usam.',pl:'Kod zostanie powiązany z @'+D.username+' i zarabiasz '+c.commissionPct+'% przegranych graczy, którzy go użyją.'})}</p>
                  <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                    <button onClick={()=>generatePromoCode(cid)} disabled={codeGenerating} style={{...btnPrimary,padding:'12px 28px',fontSize:14,background:accent,borderColor:accent,opacity:codeGenerating?0.7:1,cursor:codeGenerating?'wait':'pointer'}}>{codeGenerating?L({ro:'⏳ Se atribuie...',ru:'⏳ Назначается...',en:'⏳ Assigning...',tr:'⏳ Atanıyor...',de:'⏳ Wird zugewiesen...',pt:'⏳ A atribuir...',pl:'⏳ Przydzielanie...'}):L({ro:'🎁 Generează Cod Promoțional',ru:'🎁 Сгенерировать промокод',en:'🎁 Generate Promo Code',tr:'🎁 Promosyon Kodu Oluştur',de:'🎁 Promo-Code generieren',pt:'🎁 Gerar Código Promo',pl:'🎁 Wygeneruj kod promo'})}</button>
                    {!myCustomReq && (<button onClick={()=>{setCustomCasinoId(cid);setCustomCodeSent(false);setShowCustomCode(true)}} style={{...btnOutline(accent),padding:'12px 20px',fontSize:13}}>✨ {L({ro:'Cod personalizat',ru:'Персональный код',en:'Custom code',tr:'Özel kod',de:'Eigener Code',pt:'Código personalizado',pl:'Własny kod'})}</button>)}
                  </div>
                </div>
              )}

              {/* Cum promovezi — doar pentru active cu cod */}
              {!c.comingSoon && theCode && (
                <div style={{background:'rgba(245,166,35,0.08)',border:'1px solid rgba(245,166,35,0.28)',borderRadius:8,padding:'14px 18px',fontSize:12.5,color:'#e8c074',lineHeight:1.8}}>
                  <strong>💡 {L({ro:'Cum promovezi '+c.name,ru:'Как продвигать '+c.name,en:'How to promote '+c.name,tr:c.name+' nasıl tanıtılır',de:'So bewirbst du '+c.name,pt:'Como promover '+c.name,pl:'Jak promować '+c.name})}:</strong><br/>
                  {L({ro:'• Bio TikTok/Instagram: pune linkul/codul → „Înregistrează-te pe '+c.name+'"',ru:'• Био TikTok/Instagram: вставь ссылку/код → «Зарегистрируйся на '+c.name+'»',en:'• TikTok/Instagram bio: put the link/code → „Sign up on '+c.name+'"',tr:'• TikTok/Instagram bio: linki/kodu koy → „'+c.name+' kayıt ol"',de:'• TikTok/Instagram-Bio: Link/Code einfügen → „Registriere dich bei '+c.name+'"',pt:'• Bio TikTok/Instagram: coloca o link/código → „Regista-te na '+c.name+'"',pl:'• Bio TikTok/Instagram: wstaw link/kod → „Zarejestruj się w '+c.name+'"'})}<br/>
                  {L({ro:'• În video/stories: „Folosiți codul '+(theCode||'')+' la înregistrare"',ru:'• В видео/историях: «Используйте код '+(theCode||'')+' при регистрации»',en:'• In video/stories: „Use code '+(theCode||'')+' at sign-up"',tr:'• Videoda/hikayede: „Kayıtta '+(theCode||'')+' kodunu kullanın"',de:'• In Video/Stories: „Nutze den Code '+(theCode||'')+' bei der Anmeldung"',pt:'• Em vídeo/stories: „Usem o código '+(theCode||'')+' no registo"',pl:'• W wideo/relacjach: „Użyj kodu '+(theCode||'')+' przy rejestracji"'})}<br/>
                  {L({ro:'• Descriere YouTube: link + cod în descriere',ru:'• Описание YouTube: ссылка + код в описании',en:'• YouTube description: link + code in the description',tr:'• YouTube açıklaması: açıklamada link + kod',de:'• YouTube-Beschreibung: Link + Code in der Beschreibung',pt:'• Descrição YouTube: link + código na descrição',pl:'• Opis YouTube: link + kod w opisie'})}
                </div>
              )}
            </div>
            )
          })()}

          {/* === STRUCTURA COMISIONULUI === */}
          {page==='comm'&&(
            <div>
              {/* Explicatie structura comision */}
              <div style={{background:'linear-gradient(135deg,rgba(245,166,35,0.1),rgba(245,166,35,0.03))',border:'1px solid rgba(245,166,35,0.3)',borderRadius:10,padding:'16px 20px',marginBottom:'1.25rem'}}>
                <div style={{fontSize:14,fontWeight:700,color:gold,marginBottom:8}}>📋 {L({ro:'Structura ta de comision: RS25% + REF3%',ru:'Твоя структура комиссий: RS25% + REF3%',en:'Your commission structure: RS25% + REF3%',tr:'Komisyon yapın: RS25% + REF3%',de:'Deine Provisionsstruktur: RS25% + REF3%',pt:'A tua estrutura de comissões: RS25% + REF3%',pl:'Twoja struktura prowizji: RS25% + REF3%'})}</div>
                <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:12}}>
                  <div style={{fontSize:12,color:txtSub,lineHeight:1.7}}>
                    <b style={{color:txt}}>Revenue Share 25%</b> {L({ro:'— primești 25% din pierderile nete ale jucătorilor recomandați de tine, pe toată durata activității lor pe platformă.',ru:'— получаешь 25% от чистых проигрышей приведённых тобой игроков, пока они активны на платформе.',en:'— you get 25% of the net losses of the players you refer, for as long as they stay active on the platform.',tr:'— yönlendirdiğin oyuncuların net kayıplarının %25 ini, platformda aktif oldukları sürece alırsın.',de:'— du erhältst 25% der Nettoverluste der von dir geworbenen Spieler, solange sie auf der Plattform aktiv sind.',pt:'— recebes 25% das perdas líquidas dos jogadores que indicares, enquanto estiverem ativos na plataforma.',pl:'— otrzymujesz 25% strat netto poleconych graczy, dopóki są aktywni na platformie.'})}
                  </div>
                  <div style={{fontSize:12,color:txtSub,lineHeight:1.7}}>
                    <b style={{color:'#10b981'}}>Referral 3%</b> {L({ro:'— dacă inviți un alt blogger în WinPartners, primești 3% din comisionul lui lunar, pe viață. Copiază linkul de referral din tab-ul Link-uri Afiliați.',ru:'— если приглашаешь другого блогера в WinPartners, получаешь 3% с его месячной комиссии, пожизненно. Скопируй реферальную ссылку во вкладке Партнёрские ссылки.',en:'— if you invite another blogger to WinPartners, you get 3% of their monthly commission, for life. Copy your referral link from the Affiliate Links tab.',tr:'— WinPartners e başka bir blogcu davet edersen, onun aylık komisyonunun %3 ünü ömür boyu alırsın. Referans bağlantını Ortaklık Bağlantıları sekmesinden kopyala.',de:'— wenn du einen anderen Blogger zu WinPartners einlädst, erhältst du 3% seiner monatlichen Provision, lebenslang. Kopiere deinen Empfehlungslink im Tab Affiliate-Links.',pt:'— se convidares outro blogger para a WinPartners, recebes 3% da comissão mensal dele, para sempre. Copia o teu link de indicação no separador Links de Afiliado.',pl:'— jeśli zaprosisz innego blogera do WinPartners, otrzymasz 3% jego miesięcznej prowizji, dożywotnio. Skopiuj link polecający w zakładce Linki Afiliacyjne.'})}
                  </div>
                </div>
              </div>
              <div style={{marginBottom:'0.75rem'}}><select style={{...inp,fontSize:12,padding:'6px 12px'}}><option>{L({ro:'6 articole selectate ▼',ru:'Выбрано 6 элементов ▼',en:'6 items selected ▼',tr:'6 öğe seçildi ▼',de:'6 Einträge ausgewählt ▼',pt:'6 itens selecionados ▼',pl:'Wybrano 6 elementów ▼'})}</option></select></div>
              <div style={{...card,padding:0,overflow:'hidden'}}>
                <div style={{overflowX:'auto',width:'100%',maxWidth:'100%'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',minWidth:450}}>
                    <thead><tr>{[dt.thCur+' ↕',dt.thStruct+' ↕',dt.thGroup+' ↕',dt.thStart+' ↕',dt.thDesc+' ↕',dt.thEnd+' ↕'].map(h=><th key={h} style={{...TH,cursor:'pointer'}}>{h}</th>)}</tr></thead>
                    <tbody>{D.commStructure.map((r,i)=>(
                      <tr key={i} style={{background:i%2===0?'transparent':'rgba(255,255,255,0.03)'}}>
                        <td style={TD}>{r.val}</td>
                        <td style={TD}>{r.struct}</td>
                        <td style={TD}>{r.group}</td>
                        <td style={TD}>{r.start}</td>
                        <td style={{...TD,color:txtSub,maxWidth:300,fontSize:12}}>{r.desc}</td>
                        <td style={TD}>{r.end||'—'}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
                <div style={{padding:'10px 16px',fontSize:12,color:txtSub,borderTop:`1px solid ${bdr}`,background:'#15151e'}}>{dt.tblShow} {D.commStructure.length} ({D.commStructure.length} {dt.tblTotal})</div>
              </div>
            </div>
          )}

          {/* === ISTORICUL PLATILOR === */}
          {page==='pays'&&(
            <div>
              {/* INFO BANNER — REF3% + $30 minim */}
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:12,marginBottom:'1.5rem'}}>
                <div style={{background:'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(16,185,129,0.04))',border:'1px solid rgba(16,185,129,0.3)',borderRadius:10,padding:'14px 18px',display:'flex',gap:12,alignItems:'flex-start'}}>
                  <div style={{fontSize:24,flexShrink:0}}>💰</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:'#10b981',marginBottom:4}}>{dt.commLabel}</div>
                    <div style={{fontSize:12,color:txtSub,lineHeight:1.6}}>{L({ro:'Primești 25% din pierderile jucătorilor tăi + 3% bonus din câștigurile oricărui blogger pe care îl inviți tu în program — pe viață.',ru:'Получаешь 25% с проигрышей твоих игроков + 3% бонус с доходов любого блогера, которого ты пригласишь в программу — пожизненно.',en:'You get 25% of your players losses + a 3% bonus from the earnings of any blogger you invite to the program — for life.',tr:'Oyuncularının kayıplarının %25 i + programa davet ettiğin her blogcunun kazancından %3 bonus — ömür boyu.',de:'Du erhältst 25% der Verluste deiner Spieler + 3% Bonus aus den Einnahmen jedes Bloggers, den du ins Programm einlädst — lebenslang.',pt:'Recebes 25% das perdas dos teus jogadores + 3% de bónus dos ganhos de qualquer blogger que convidares para o programa — para sempre.',pl:'Otrzymujesz 25% strat swoich graczy + 3% bonusu z zarobków każdego blogera, którego zaprosisz do programu — dożywotnio.'})}</div>
                  </div>
                </div>
                <div style={{background:'linear-gradient(135deg,rgba(167,139,250,0.12),rgba(167,139,250,0.04))',border:'1px solid rgba(167,139,250,0.3)',borderRadius:10,padding:'14px 18px',display:'flex',gap:12,alignItems:'flex-start'}}>
                  <div style={{fontSize:24,flexShrink:0}}>📅</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:'#a78bfa',marginBottom:4}}>{L({ro:'Plăți săptămânale automate',ru:'Автоматические еженедельные выплаты',en:'Automatic weekly payouts',tr:'Otomatik haftalık ödemeler',de:'Automatische wöchentliche Auszahlungen',pt:'Pagamentos semanais automáticos',pl:'Automatyczne cotygodniowe wypłaty'})}</div>
                    <div style={{fontSize:12,color:txtSub,lineHeight:1.6}}>{({'ro':'Suma minimă de retragere: ','ru':'Минимальная сумма вывода: ','en':'Minimum withdrawal: ','tr':'Minimum çekim: ','de':'Mindestauszahlung: ','pt':'Levantamento mínimo: ','pl':'Minimalna wypłata: '})[lang]}<b style={{color:txt}}>$30/{({'ro':'săptămână','ru':'неделю','en':'week','tr':'hafta','de':'Woche','pt':'semana','pl':'tydzień'})[lang]}</b></div>
                  </div>
                </div>
              </div>
              <div style={filterRow}>
                <span style={{fontSize:13,color:txtSub}}>{({'ro':'Valută','ru':'Валюта','en':'Currency','tr':'Para birimi','de':'Währung','pt':'Moeda','pl':'Waluta'})[lang]||'Valută'}</span>
                <select style={inp}><option>USD</option></select>
                <span style={{fontSize:13,color:txtSub}}>{({'ro':'Perioada','ru':'Период','en':'Period','tr':'Dönem','de':'Zeitraum','pt':'Período','pl':'Okres'})[lang]||'Perioada'}</span>
                <select style={inp}><option>{({'ro':'Perioada exactă','ru':'Точный период','en':'Exact period','tr':'Tam dönem','de':'Genauer Zeitraum','pt':'Período exato','pl':'Dokładny okres'})[lang]||'Perioada exactă'}</option></select>
                <input type="date" style={inp} defaultValue={new Date().toISOString().slice(0,10)}/>
                <span style={{color:txtSub}}>→</span>
                <input type="date" style={inp} defaultValue={new Date().toISOString().slice(0,10)}/>
              </div>
              <div style={{display:'flex',gap:0,marginBottom:'1rem',borderBottom:`2px solid ${bdr}`}}>
                {[{ro:'Statusul solicitărilor',ru:'Статус заявок',en:'Request status',tr:'Talep durumu',de:'Anfragestatus',pt:'Estado dos pedidos',pl:'Status wniosków'},{ro:'Istoricul plăților',ru:'История выплат',en:'Payment history',tr:'Ödeme geçmişi',de:'Zahlungsverlauf',pt:'Histórico de pagamentos',pl:'Historia płatności'}].map((t,i)=>(
                  <button key={t.ro} onClick={()=>setPayTab(i===0?'status':'history')} style={payTab===(i===0?'status':'history')?tabActive:tabInactive}>{t[lang]||t.ro}</button>
                ))}
                <div style={{flex:1}}/>
              </div>
              <div style={{marginBottom:'0.75rem'}}><select style={{...inp,fontSize:12}}><option>{L({ro:'6 articole selectate ▼',ru:'Выбрано 6 элементов ▼',en:'6 items selected ▼',tr:'6 öğe seçildi ▼',de:'6 Einträge ausgewählt ▼',pt:'6 itens selecionados ▼',pl:'Wybrano 6 elementów ▼'})}</option></select></div>
              <div style={{...card,padding:0,overflowX:'auto',maxWidth:'100%'}}>
                <table style={{width:'100%',borderCollapse:'collapse',minWidth:500}}>
                  <thead><tr>{[dt.thCur+' ↕',dt.thDate+' ↕',dt.thPay+' ↕',dt.thRev+' ↕',dt.thBal+' ↕',dt.thStatus+' ↕'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>
                    {payTab==='history'&&D.pays.map((p,i)=>(
                      <tr key={i} style={{background:i%2===0?'transparent':'rgba(255,255,255,0.03)'}}>
                        <td style={TD}>USD</td>
                        <td style={TD}>{p.dt}</td>
                        <td style={{...TD,color:'#10b981',fontWeight:600}}>${p.am}</td>
                        <td style={TD}>${p.venituri}</td>
                        <td style={TD}>${p.sold}</td>
                        <td style={TD}><span style={{background:'rgba(52,211,153,0.14)',color:'#065f46',padding:'2px 8px',borderRadius:12,fontSize:11,fontWeight:600}}>{p.st}</span></td>
                      </tr>
                    ))}
                    {payTab==='status'&&<tr><td colSpan={6} style={{...TD,textAlign:'center',color:txtSub,padding:'24px',fontStyle:'italic'}}>{L({ro:'Fără solicitări active',ru:'Нет активных заявок',en:'No active requests',tr:'Aktif talep yok',de:'Keine aktiven Anfragen',pt:'Sem solicitações ativas',pl:'Brak aktywnych wniosków'})}</td></tr>}
                  </tbody>
                </table>
                <div style={{padding:'10px 16px',fontSize:12,color:txtSub,borderTop:`1px solid ${bdr}`,background:'#15151e'}}>{dt.tblShow} {D.pays.length}</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:12}}>
                <div style={card}>
                  <p style={{fontSize:13,color:txtSub,lineHeight:1.7,marginBottom:8}}>{({'ro':'Câștigurile se acumulează automat pe măsură ce jucătorii tăi joacă. Când soldul ajunge la $30, soliciți plata mai jos — o procesăm săptămânal pe metoda ta preferată.','ru':'Доход накапливается автоматически по мере игры ваших игроков. Когда баланс достигнет $30, запросите выплату ниже — мы обрабатываем её еженедельно удобным вам способом.','en':'Earnings accumulate automatically as your players play. When your balance reaches $30, request a payout below — we process it weekly via your preferred method.','tr':'Oyuncularınız oynadıkça kazançlar otomatik birikir. Bakiyeniz $30 olunca aşağıdan ödeme talep edin — tercih ettiğiniz yöntemle haftalık işleriz.','de':'Die Einnahmen sammeln sich automatisch an, während Ihre Spieler spielen. Bei $30 Guthaben fordern Sie unten eine Auszahlung an — wir bearbeiten sie wöchentlich über Ihre bevorzugte Methode.','pt':'Os ganhos acumulam-se automaticamente à medida que os seus jogadores jogam. Quando o saldo atingir $30, solicite o pagamento abaixo — processamos semanalmente pelo método preferido.','pl':'Zarobki kumulują się automatycznie w miarę gry Twoich graczy. Gdy saldo osiągnie $30, poproś o wypłatę poniżej — przetwarzamy ją tygodniowo wybraną metodą.'})[lang]||'Câștigurile se acumulează automat. Când soldul ajunge la $30, soliciți plata mai jos.'}</p>
                  <p style={{fontSize:13,fontWeight:600,color:txt,marginBottom:12}}>{({'ro':'Suma minimă de plată este de $30 pe săptămână','ru':'Минимальная сумма выплаты $30 в неделю','en':'Minimum payment amount is $30 per week','tr':'Minimum ödeme tutarı haftada $30','de':'Mindestauszahlungsbetrag beträgt $30 pro Woche','pt':'O valor mínimo de pagamento é $30 por semana','pl':'Minimalna kwota płatności to $30 tygodniowo'})[lang]}</p>
                  <button style={btnPrimary} onClick={()=>{setPayAmount(String(D.bal.available));setShowPay(true)}}>{({'ro':'Solicită plată','ru':'Запросить выплату','en':'Request payment','tr':'Ödeme talep et','de':'Zahlung anfordern','pt':'Solicitar pagamento','pl':'Zażądaj płatności'})[lang]||'Solicită plată'} → ${D.bal.available}</button>
                </div>
                <div style={card}>
                  <p style={{fontSize:13,color:txtSub,lineHeight:1.7}}>{L({ro:'Contactați managerii noștri prin ',ru:'Свяжитесь с нашими менеджерами через ',en:'Contact our managers via the ',tr:'Yöneticilerimizle ',de:'Kontaktieren Sie unsere Manager über die ',pt:'Contacte os nossos gestores através dos ',pl:'Skontaktuj się z naszymi menedżerami przez '})}<span style={{color:gold,cursor:'pointer',fontWeight:600}}>{L({ro:'datele de contact',ru:'контактные данные',en:'contact details',tr:'iletişim bilgileri',de:'Kontaktdaten',pt:'dados de contacto',pl:'dane kontaktowe'})}</span>{L({ro:' disponibile pe site.',ru:', доступные на сайте.',en:' available on the site.',tr:' aracılığıyla iletişime geçin.',de:', die auf der Website verfügbar sind.',pt:' disponíveis no site.',pl:' dostępne na stronie.'})}</p>
                </div>
              </div>
            </div>
          )}

          {/* === CONT === */}
          {page==='account'&&(
            <div>
              <div style={{fontSize:13,marginBottom:'1rem',color:txtSub}}>{L({ro:'Utilizator:',ru:'Пользователь:',en:'User:',tr:'Kullanıcı:',de:'Benutzer:',pt:'Utilizador:',pl:'Użytkownik:'})} <span style={{color:gold,fontWeight:600}}>@{D.username}</span></div>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr 1fr',gap:16}}>
                <div style={card}>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:14,color:txt,paddingBottom:8,borderBottom:`1px solid ${bdr}`}}>{L({ro:'Informații de contact',ru:'Контактная информация',en:'Contact information',tr:'İletişim bilgileri',de:'Kontaktinformationen',pt:'Informações de contacto',pl:'Dane kontaktowe'})}</div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
                    <div><label style={label}>{L({ro:'Prenume',ru:'Имя',en:'First name',tr:'Ad',de:'Vorname',pt:'Nome',pl:'Imię'})}</label><input style={{...inp,width:'100%',boxSizing:'border-box'}} value={(D.name||'').split(' ')[0]||''} readOnly/></div>
                    <div><label style={label}>{L({ro:'Nume',ru:'Фамилия',en:'Last name',tr:'Soyad',de:'Nachname',pt:'Apelido',pl:'Nazwisko'})}</label><input style={{...inp,width:'100%',boxSizing:'border-box'}} value={(D.name||'').split(' ').slice(1).join(' ')} readOnly/></div>
                  </div>
                  <div style={{marginBottom:8}}><label style={label}>{L({ro:'Număr de telefon',ru:'Номер телефона',en:'Phone number',tr:'Telefon numarası',de:'Telefonnummer',pt:'Número de telefone',pl:'Numer telefonu'})}</label><input style={{...inp,width:'100%',boxSizing:'border-box'}} value={D.phone||''} readOnly/></div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
                    <div><label style={label}>{L({ro:'Platformă',ru:'Платформа',en:'Platform',tr:'Platform',de:'Plattform',pt:'Plataforma',pl:'Platforma'})}</label><input style={{...inp,width:'100%',boxSizing:'border-box'}} value={D.platform||''} readOnly/></div>
                    <div><label style={label}>{L({ro:'Țară',ru:'Страна',en:'Country',tr:'Ülke',de:'Land',pt:'País',pl:'Kraj'})}</label><input style={{...inp,width:'100%',boxSizing:'border-box'}} value={D.country||''} readOnly/></div>
                  </div>
                  <div style={{fontSize:11,color:txtSub}}>{L({ro:'pentru a modifica datele de contact, contactați managerul dvs.',ru:'для изменения контактных данных свяжитесь с вашим менеджером',en:'to change your contact details, contact your manager',tr:'iletişim bilgilerini değiştirmek için yöneticinizle iletişime geçin',de:'um Ihre Kontaktdaten zu ändern, wenden Sie sich an Ihren Manager',pt:'para alterar os dados de contacto, contacte o seu gestor',pl:'aby zmienić dane kontaktowe, skontaktuj się ze swoim menedżerem'})}</div>
                </div>
                <div style={card}>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:14,color:txt,paddingBottom:8,borderBottom:`1px solid ${bdr}`}}>{L({ro:'Detaliile plății',ru:'Платёжные данные',en:'Payment details',tr:'Ödeme bilgileri',de:'Zahlungsdetails',pt:'Detalhes de pagamento',pl:'Dane płatności'})}</div>
                  <div style={{marginBottom:8}}><label style={label}>{({'ro':'Metoda de plată preferată','ru':'Предпочтительный метод оплаты','en':'Preferred payment method','tr':'Tercih edilen ödeme yöntemi','de':'Bevorzugte Zahlungsmethode','pt':'Método de pagamento preferido','pl':'Preferowana metoda płatności'})[lang]}</label><input style={{...inp,width:'100%',boxSizing:'border-box'}} value={D.payMethod||'Bitcoin'} readOnly/></div>
                  <div style={{marginBottom:12}}><label style={label}>{L({ro:'Numărul portofelului',ru:'Номер кошелька',en:'Wallet address',tr:'Cüzdan adresi',de:'Wallet-Adresse',pt:'Endereço da carteira',pl:'Adres portfela'})}</label><input style={{...inp,width:'100%',boxSizing:'border-box',fontFamily:'monospace',fontSize:11}} value={D.payAddress||''} readOnly placeholder={({'ro':'necompletat','ru':'не указан','en':'not set','tr':'belirtilmemiş','de':'nicht angegeben','pt':'não definido','pl':'nie ustawiono'})[lang]||'necompletat'}/></div>
                  <div style={{fontSize:11,color:txtSub,marginBottom:16}}>{L({ro:'* pentru a modifica detaliile de plată, contactați Asistența pentru Parteneri.',ru:'* для изменения платёжных данных обратитесь в Поддержку для партнёров.',en:'* to change payment details, contact Partner Support.',tr:'* ödeme bilgilerini değiştirmek için Ortak Desteğine başvurun.',de:'* um Zahlungsdetails zu ändern, wenden Sie sich an den Partner-Support.',pt:'* para alterar os detalhes de pagamento, contacte o Suporte para Parceiros.',pl:'* aby zmienić dane płatności, skontaktuj się ze Wsparciem dla Partnerów.'})}</div>
                  <div style={{borderTop:`1px solid ${bdr}`,paddingTop:12}}>
                    <div style={{fontSize:13,fontWeight:600,color:txt,marginBottom:8}}>{L({ro:'Abonamente',ru:'Подписки',en:'Subscriptions',tr:'Abonelikler',de:'Abonnements',pt:'Subscrições',pl:'Subskrypcje'})}</div>
                    <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:13,color:txtSub}}>
                      <input type="checkbox" defaultChecked style={{accentColor:gold}}/> {L({ro:'Informațiile companiei',ru:'Информация о компании',en:'Company information',tr:'Şirket bilgileri',de:'Unternehmensinformationen',pt:'Informações da empresa',pl:'Informacje o firmie'})}
                    </label>
                  </div>
                </div>
                <div style={card}>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:14,color:txt,paddingBottom:8,borderBottom:`1px solid ${bdr}`}}>{({'ro':'Modificați parola','ru':'Изменить пароль','en':'Change password','tr':'Şifreyi değiştir','de':'Passwort ändern','pt':'Alterar senha','pl':'Zmień hasło'})[lang]||'Modificați parola'}</div>
                  <div style={{marginBottom:8}}><label style={label}>{dt.oldPass}</label><input type="password" style={{...inp,width:'100%',boxSizing:'border-box'}} placeholder="••••••••" value={passOld} onChange={e=>setPassOld(e.target.value)}/></div>
                  <div style={{marginBottom:8}}><label style={label}>{dt.newPass}</label><input type="password" style={{...inp,width:'100%',boxSizing:'border-box'}} placeholder="••••••••" value={passNew} onChange={e=>setPassNew(e.target.value)}/></div>
                  <div style={{marginBottom:12}}><label style={label}>{dt.confirmPass}</label><input type="password" style={{...inp,width:'100%',boxSizing:'border-box'}} placeholder="••••••••" value={passNew2} onChange={e=>setPassNew2(e.target.value)}/></div>
                  {passMsg && <div style={{marginBottom:10,fontSize:12,color:passMsg.startsWith('✅')?'#10b981':'#ef4444'}}>{passMsg}</div>}
                  <button onClick={changePassword} style={btnPrimary}>{dt.changeBtn}</button>
                  <div style={{borderTop:`1px solid ${bdr}`,paddingTop:12,marginTop:16}}>
                    <div style={{fontSize:13,fontWeight:600,color:txt,marginBottom:6}}>{L({ro:'Gestionarea autentificării cu doi factori',ru:'Управление двухфакторной аутентификацией',en:'Two-factor authentication management',tr:'İki faktörlü kimlik doğrulama yönetimi',de:'Verwaltung der Zwei-Faktor-Authentifizierung',pt:'Gestão da autenticação de dois fatores',pl:'Zarządzanie uwierzytelnianiem dwuskładnikowym'})}</div>
                    <div style={{fontSize:12,color:txtSub}}>{L({ro:'Google Authenticator activat:',ru:'Google Authenticator включён:',en:'Google Authenticator enabled:',tr:'Google Authenticator etkin:',de:'Google Authenticator aktiviert:',pt:'Google Authenticator ativado:',pl:'Google Authenticator włączony:'})} <span style={{color:'#ef4444',fontWeight:600}}>{L({ro:'Nu',ru:'Нет',en:'No',tr:'Hayır',de:'Nein',pt:'Não',pl:'Nie'})}</span></div>
                  </div>
                  <div style={{borderTop:`1px solid ${bdr}`,paddingTop:12,marginTop:12}}>
                    <div style={{fontSize:13,fontWeight:600,color:txt,marginBottom:4}}>{L({ro:'Confirmarea adresei de e-mail',ru:'Подтверждение адреса эл. почты',en:'Email address confirmation',tr:'E-posta adresi onayı',de:'E-Mail-Adressbestätigung',pt:'Confirmação do endereço de e-mail',pl:'Potwierdzenie adresu e-mail'})}</div>
                    <div style={{fontSize:12,color:txtSub}}>Email: {D.email}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* === MEDIA === */}
          {page==='media'&&(
            <div>
              <div style={filterRow}>
                {[[{ro:'Valută',ru:'Валюта',en:'Currency',tr:'Para birimi',de:'Währung',pt:'Moeda',pl:'Waluta'},'select',['USD']],[{ro:'Tip media',ru:'Тип медиа',en:'Media type',tr:'Medya türü',de:'Medientyp',pt:'Tipo de média',pl:'Typ mediów'},'select',['Banner','Video']],[{ro:'Limbă',ru:'Язык',en:'Language',tr:'Dil',de:'Sprache',pt:'Idioma',pl:'Język'},'select',['—']],[{ro:'Lățime',ru:'Ширина',en:'Width',tr:'Genişlik',de:'Breite',pt:'Largura',pl:'Szerokość'},'number','100'],[{ro:'Înălțime',ru:'Высота',en:'Height',tr:'Yükseklik',de:'Höhe',pt:'Altura',pl:'Wysokość'},'number','100'],[{ro:'Campanie',ru:'Кампания',en:'Campaign',tr:'Kampanya',de:'Kampagne',pt:'Campanha',pl:'Kampania'},'select',['English']]].map(([l,type,opts])=>(
                  <div key={l.ro} style={{display:'flex',alignItems:'center',gap:5}}>
                    <span style={{fontSize:13,color:txtSub,whiteSpace:'nowrap'}}>{l[lang]||l.ro}</span>
                    {type==='select'?<select style={inp}><option>{({ro:'Selectare...',ru:'Выбрать...',en:'Select...',tr:'Seç...',de:'Auswählen...',pt:'Selecionar...',pl:'Wybierz...'})[lang]||'Selectare...'}</option></select>:<input type="number" style={{...inp,width:70}} placeholder={opts}/>}
                  </div>
                ))}
              </div>
              <div style={{...card,textAlign:'center',padding:'3rem',color:txtSub,fontSize:13}}>
                {({'ro':'Niciun material media disponibil.','ru':'Медиаматериалы недоступны.','en':'No media materials available.','tr':'Medya materyali mevcut değil.','de':'Keine Medienmaterialien verfügbar.','pt':'Nenhum material de mídia disponível.','pl':'Brak dostępnych materiałów medialnych.'})[lang]}<br/>{({'ro':'Contactați managerul pentru materiale personalizate.','ru':'Свяжитесь с менеджером для персональных материалов.','en':'Contact your manager for custom materials.','tr':'Özel materyaller için yöneticinize başvurun.','de':'Wenden Sie sich an Ihren Manager für individuelle Materialien.','pt':'Contacte o seu gestor para materiais personalizados.','pl':'Skontaktuj się z menedżerem w sprawie materiałów.'})[lang]}
              </div>
            </div>
          )}

          {/* === REZUMAT + RAPORT COMPLET === */}
          {(page==='summary'||page==='report')&&(
            <div>
              <div style={filterRow}>
                <span style={{fontSize:13,color:txtSub}}>{({'ro':'Valută','ru':'Валюта','en':'Currency','tr':'Para birimi','de':'Währung','pt':'Moeda','pl':'Waluta'})[lang]||'Valută'}</span>
                <select style={inp}><option>USD</option></select>
                <span style={{fontSize:13,color:txtSub}}>{L({ro:'Site web',ru:'Сайт',en:'Website',tr:'Web sitesi',de:'Webseite',pt:'Site',pl:'Strona'})}</span>
                <select style={{...inp,width:150}}><option>{L({ro:'Toate',ru:'Все',en:'All',tr:'Tümü',de:'Alle',pt:'Todos',pl:'Wszystkie'})}</option></select>
                {page==='summary'&&<><span style={{fontSize:13,color:txtSub}}>{L({ro:'ID instrument',ru:'ID инструмента',en:'Tool ID',tr:'Araç ID',de:'Tool-ID',pt:'ID da ferramenta',pl:'ID narzędzia'})}</span><input style={{...inp,width:120}} placeholder=""/></>}
                <span style={{fontSize:13,color:txtSub}}>{({'ro':'Perioada','ru':'Период','en':'Period','tr':'Dönem','de':'Zeitraum','pt':'Período','pl':'Okres'})[lang]||'Perioada'}</span>
                <select style={inp}><option>{({'ro':'Perioada exactă','ru':'Точный период','en':'Exact period','tr':'Tam dönem','de':'Genauer Zeitraum','pt':'Período exato','pl':'Dokładny okres'})[lang]||'Perioada exactă'}</option></select>
                <input type="date" style={inp} defaultValue={new Date().toISOString().slice(0,10)}/>
                <span style={{color:txtSub}}>→</span>
                <input type="date" style={inp} defaultValue={new Date().toISOString().slice(0,10)}/>
              </div>
              <div style={{...card,padding:0,overflow:'hidden'}}>
                <div style={{overflowX:'auto',width:'100%',maxWidth:'100%'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',minWidth:600}}>
                    <thead><tr>
                      {(page==='summary'
                        ?[dt.thViews,dt.thClicks,dt.thDirect,L({ro:'Click/Vizualizări',ru:'Клики/Показы',en:'Clicks/Views',tr:'Tıklama/Görüntüleme',de:'Klicks/Ansichten',pt:'Cliques/Visualizações',pl:'Kliknięcia/Wyświetlenia'}),dt.thRegs,L({ro:'Înreg./Clickuri',ru:'Рег./Клики',en:'Regs/Clicks',tr:'Kayıt/Tıklama',de:'Reg./Klicks',pt:'Reg./Cliques',pl:'Rej./Kliknięcia'}),L({ro:'Înreg. cu depuneri',ru:'Рег. с депозитом',en:'Regs with deposits',tr:'Yatırımlı kayıtlar',de:'Reg. mit Einzahlung',pt:'Reg. com depósitos',pl:'Rej. z wpłatami'}),L({ro:'Suma noilor depuneri',ru:'Сумма новых депозитов',en:'New deposits amount',tr:'Yeni yatırım tutarı',de:'Betrag neuer Einzahlungen',pt:'Valor de novos depósitos',pl:'Kwota nowych wpłat'}),dt.thDep,L({ro:'Conturi cu depuneri',ru:'Счета с депозитами',en:'Accounts with deposits',tr:'Yatırımlı hesaplar',de:'Konten mit Einzahlungen',pt:'Contas com depósitos',pl:'Konta z wpłatami'}),L({ro:'Suma depuneri',ru:'Сумма депозитов',en:'Deposits amount',tr:'Yatırım tutarı',de:'Einzahlungsbetrag',pt:'Valor de depósitos',pl:'Kwota wpłat'}),dt.thRev,L({ro:'Nr. depuneri',ru:'Кол-во депозитов',en:'No. of deposits',tr:'Yatırım sayısı',de:'Anz. Einzahlungen',pt:'Nº de depósitos',pl:'Liczba wpłat'}),L({ro:'Jucători activi',ru:'Активные игроки',en:'Active players',tr:'Aktif oyuncular',de:'Aktive Spieler',pt:'Jogadores ativos',pl:'Aktywni gracze'}),L({ro:'Media profit/jucător',ru:'Ср. прибыль/игрок',en:'Avg profit/player',tr:'Ort. kâr/oyuncu',de:'Ø Gewinn/Spieler',pt:'Lucro médio/jogador',pl:'Śr. zysk/gracz'}),L({ro:'Suma bonus',ru:'Сумма бонусов',en:'Bonus amount',tr:'Bonus tutarı',de:'Bonusbetrag',pt:'Valor de bónus',pl:'Kwota bonusu'}),L({ro:'Total comision RS',ru:'Итого комиссия RS',en:'Total RS commission',tr:'Toplam RS komisyonu',de:'RS-Provision gesamt',pt:'Comissão RS total',pl:'Łączna prowizja RS'}),'CPA',dt.lComm,L({ro:'Comision sub-afiliați',ru:'Комиссия суб-партнёров',en:'Sub-affiliate commission',tr:'Alt ortak komisyonu',de:'Sub-Affiliate-Provision',pt:'Comissão de subafiliados',pl:'Prowizja subpartnerów'})]
                        :[dt.thDate,dt.thCur,dt.thClicks,dt.thRegs,dt.thDep,dt.thRev,dt.lComm]
                      ).map(h=><th key={h} style={TH}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {page==='report'&&D.daily.map((r,i)=>(
                        <tr key={r.d} style={{background:i%2===0?'transparent':'rgba(255,255,255,0.03)'}}>
                          <td style={TD}>{r.d}</td><td style={TD}>USD</td>
                          <td style={TD}>{r.cl}</td><td style={TD}>{r.rg}</td>
                          <td style={TD}>{r.dp}</td><td style={TD}>${r.rv}</td>
                          <td style={{...TD,color:'#10b981',fontWeight:700}}>{r.rv>0?'$'+Math.round(r.rv*.2):'—'}</td>
                        </tr>
                      ))}
                      {page==='summary'&&(
                        <tr>
                          {['0','0','0','0','0','0','0','$0','0','0','$0','$0','0','0','$0','$0','$0','0','$'+totComm,'$0'].map((v,i)=>(
                            <td key={i} style={{...TD,background:i%2===0?'rgba(245,166,35,0.05)':'transparent',color:i===18?'#10b981':txt}}>{v}</td>
                          ))}
                        </tr>
                      )}
                      <tr style={{background:'#15151e'}}><td colSpan={20} style={{...TD,fontStyle:'italic',color:txtSub,textAlign:'center',padding:'16px'}}>{L({ro:'Fără informații pentru perioada selectată',ru:'Нет данных за выбранный период',en:'No data for the selected period',tr:'Seçilen dönem için veri yok',de:'Keine Daten für den gewählten Zeitraum',pt:'Sem dados para o período selecionado',pl:'Brak danych dla wybranego okresu'})}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* === RAPORT JUCATORI === */}
          {page==='players'&&(
            <div>
              <div style={filterRow}>
                <span style={{fontSize:13,color:txtSub}}>{({'ro':'Valută','ru':'Валюта','en':'Currency','tr':'Para birimi','de':'Währung','pt':'Moeda','pl':'Waluta'})[lang]||'Valută'}</span><select style={inp}><option>USD</option></select>
                <span style={{fontSize:13,color:txtSub}}>{L({ro:'Site web',ru:'Сайт',en:'Website',tr:'Web sitesi',de:'Webseite',pt:'Site',pl:'Strona'})}</span><select style={{...inp,width:150}}><option>{L({ro:'Toate',ru:'Все',en:'All',tr:'Tümü',de:'Alle',pt:'Todos',pl:'Wszystkie'})}</option></select>
                <span style={{fontSize:13,color:txtSub}}>{L({ro:'Jucător',ru:'Игрок',en:'Player',tr:'Oyuncu',de:'Spieler',pt:'Jogador',pl:'Gracz'})}</span><input style={{...inp,width:120}} placeholder={L({ro:'ID jucător',ru:'ID игрока',en:'Player ID',tr:'Oyuncu ID',de:'Spieler-ID',pt:'ID do jogador',pl:'ID gracza'})}/>
                <span style={{fontSize:13,color:txtSub}}>{L({ro:'Perioada',ru:'Период',en:'Period',tr:'Dönem',de:'Zeitraum',pt:'Período',pl:'Okres'})}</span><select style={inp}><option>{L({ro:'1 lună',ru:'1 месяц',en:'1 month',tr:'1 ay',de:'1 Monat',pt:'1 mês',pl:'1 miesiąc'})}</option></select>
              </div>
              <div style={{...card,padding:0,overflowX:'auto',maxWidth:'100%'}}>
                <table style={{width:'100%',borderCollapse:'collapse',minWidth:450}}>
                  <thead><tr>{[{ro:'Jucător',ru:'Игрок',en:'Player',tr:'Oyuncu',de:'Spieler',pt:'Jogador',pl:'Gracz'},{ro:'Data înregistrării',ru:'Дата регистрации',en:'Registration date',tr:'Kayıt tarihi',de:'Registrierungsdatum',pt:'Data de registo',pl:'Data rejestracji'},{ro:'Prima depunere',ru:'Первый депозит',en:'First deposit',tr:'İlk yatırım',de:'Erste Einzahlung',pt:'Primeiro depósito',pl:'Pierwszy depozyt'},{ro:'Numărul de depuneri',ru:'Количество депозитов',en:'Number of deposits',tr:'Yatırım sayısı',de:'Anzahl der Einzahlungen',pt:'Número de depósitos',pl:'Liczba depozytów'},{ro:'Suma depunerilor',ru:'Сумма депозитов',en:'Deposit amount',tr:'Yatırım tutarı',de:'Einzahlungsbetrag',pt:'Valor dos depósitos',pl:'Kwota depozytów'},{ro:'Venituri',ru:'Доход',en:'Revenue',tr:'Gelir',de:'Einnahmen',pt:'Receita',pl:'Przychód'},{ro:'Comisionul meu',ru:'Моя комиссия',en:'My commission',tr:'Komisyonum',de:'Meine Provision',pt:'A minha comissão',pl:'Moja prowizja'}].map(h=><th key={h.ro} style={TH}>{h[lang]||h.ro}</th>)}</tr></thead>
                  <tbody><tr><td colSpan={7} style={{...TD,textAlign:'center',color:txtSub,padding:'24px',fontStyle:'italic'}}>{L({ro:'Fără informații pentru perioada selectată',ru:'Нет данных за выбранный период',en:'No data for the selected period',tr:'Seçilen dönem için veri yok',de:'Keine Daten für den gewählten Zeitraum',pt:'Sem dados para o período selecionado',pl:'Brak danych dla wybranego okresu'})}</td></tr></tbody>
                </table>
              </div>
            </div>
          )}

          {/* === SUB-AFILIATI === */}
          {page==='subaff'&&(
            <div>
              <div style={{background:'#10231a',border:'1px solid #bbf7d0',borderRadius:8,padding:'14px 16px',marginBottom:'1.25rem'}}>
                <div style={{fontSize:13,fontWeight:600,color:'#065f46',marginBottom:5}}>💰 {L({ro:'Câștigă 3% din comisioanele bloggerilor pe care îi inviți — pe viață!',ru:'Зарабатывай 3% с комиссий приглашённых блогеров — пожизненно!',en:'Earn 3% of the commissions of bloggers you invite — for life!',tr:'Davet ettiğin blogcuların komisyonlarının %3 kazan — ömür boyu!',de:'Verdiene 3% der Provisionen der von dir eingeladenen Blogger — lebenslang!',pt:'Ganha 3% das comissões dos bloggers que convidares — para sempre!',pl:'Zarabiaj 3% z prowizji zaproszonych blogerów — dożywotnio!'})}</div>
                <div style={{fontFamily:'monospace',fontSize:12,color:'#047857',background:'rgba(0,0,0,0.04)',padding:'6px 10px',borderRadius:4,marginBottom:8,wordBreak:'break-all'}}>{refLink}</div>
                <button style={btnPrimary} onClick={()=>copy(refLink,'ref')}>{copied==='ref'?L({ro:'✓ Copiat!',ru:'✓ Скопировано!',en:'✓ Copied!',tr:'✓ Kopyalandı!',de:'✓ Kopiert!',pt:'✓ Copiado!',pl:'✓ Skopiowano!'}):L({ro:'Copiează linkul de referral',ru:'Копировать реферальную ссылку',en:'Copy referral link',tr:'Referans bağlantısını kopyala',de:'Empfehlungslink kopieren',pt:'Copiar link de indicação',pl:'Kopiuj link polecający'})}</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:12,marginBottom:'1.25rem'}}>
                {[[L({ro:'Bloggeri invitați',ru:'Приглашённые блогеры',en:'Invited bloggers',tr:'Davet edilen blogcular',de:'Eingeladene Blogger',pt:'Bloggers convidados',pl:'Zaproszeni blogerzy'}),myReferrals.length,'#3b82f6'],[L({ro:'Total câștigat',ru:'Всего заработано',en:'Total earned',tr:'Toplam kazanç',de:'Gesamt verdient',pt:'Total ganho',pl:'Łącznie zarobiono'}),'$'+myReferrals.reduce((s,r)=>s+(r.cm||0),0).toFixed(2),'#10b981'],[L({ro:'Comision referral',ru:'Реферальная комиссия',en:'Referral commission',tr:'Referans komisyonu',de:'Empfehlungsprovision',pt:'Comissão de indicação',pl:'Prowizja polecająca'}),'3%',gold]].map(([l,v,c])=>(
                  <div key={l} style={{...card,textAlign:'center'}}>
                    <div style={{fontSize:11,color:txtSub,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:5}}>{l}</div>
                    <div style={{fontSize:24,fontWeight:800,color:c}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={filterRow}>
                <span style={{fontSize:13,color:txtSub}}>{({'ro':'Valută','ru':'Валюта','en':'Currency','tr':'Para birimi','de':'Währung','pt':'Moeda','pl':'Waluta'})[lang]||'Valută'}</span><select style={inp}><option>USD</option></select>
                <span style={{fontSize:13,color:txtSub}}>{L({ro:'Perioada',ru:'Период',en:'Period',tr:'Dönem',de:'Zeitraum',pt:'Período',pl:'Okres'})}</span><select style={inp}><option>{L({ro:'1 lună',ru:'1 месяц',en:'1 month',tr:'1 ay',de:'1 Monat',pt:'1 mês',pl:'1 miesiąc'})}</option></select>
              </div>
              <div style={{...card,padding:0,overflowX:'auto',maxWidth:'100%'}}>
                <table style={{width:'100%',borderCollapse:'collapse',minWidth:450}}>
                  <thead><tr>{[dt.thBlogger,dt.thPlatform,dt.thRegDate,dt.thRegsBrought,dt.thHisEarnings,dt.thMyComm].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>{myReferrals.length===0?(
                    <tr><td colSpan={6} style={{...TD,textAlign:'center',color:txtSub,padding:'24px',fontStyle:'italic'}}>
                      {L({ro:'Niciun blogger invitat încă. Copiază linkul de referral și trimite-l colegilor tăi bloggeri!',ru:'Пока нет приглашённых блогеров. Скопируй реферальную ссылку и отправь её коллегам-блогерам!',en:'No invited bloggers yet. Copy your referral link and send it to your fellow bloggers!',tr:'Henüz davet edilen blogcu yok. Referans bağlantını kopyala ve blogcu arkadaşlarına gönder!',de:'Noch keine eingeladenen Blogger. Kopiere deinen Empfehlungslink und sende ihn an deine Blogger-Kollegen!',pt:'Ainda sem bloggers convidados. Copia o teu link de indicação e envia aos teus colegas bloggers!',pl:'Brak zaproszonych blogerów. Skopiuj link polecający i wyślij go znajomym blogerom!'})}
                    </td></tr>
                  ):myReferrals.map((r,i)=>(
                    <tr key={r.name} style={{background:i%2===0?'transparent':'rgba(255,255,255,0.03)'}}>
                      <td style={{...TD,fontWeight:600}}>{r.name}</td>
                      <td style={TD}>{r.pl||'-'}</td>
                      <td style={{...TD,color:txtSub}}>{r.dt}</td>
                      <td style={TD}>{r.rg||0}</td>
                      <td style={TD}>${r.rv||0}</td>
                      <td style={{...TD,color:'#10b981',fontWeight:600}}>${(r.cm||0).toFixed(2)}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {page==='contact'&&(()=>{
            const CHAT = ({
              ro:{title:'Managerul tău WinPartners',online:'De obicei răspunde în câteva ore',empty:'Scrie-i managerului tău aici — întreabă orice despre coduri, plăți sau cazinouri. Îți răspunde de obicei în câteva ore.',ph:'Scrie un mesaj...',send:'Trimite',you:'Tu',mgr:'Manager'},
              ru:{title:'Ваш менеджер WinPartners',online:'Обычно отвечает в течение нескольких часов',empty:'Напишите менеджеру здесь — спросите что угодно о кодах, выплатах или казино. Обычно отвечаем в течение нескольких часов.',ph:'Напишите сообщение...',send:'Отправить',you:'Вы',mgr:'Менеджер'},
              en:{title:'Your WinPartners manager',online:'Usually replies within a few hours',empty:'Message your manager here — ask anything about codes, payouts or casinos. We usually reply within a few hours.',ph:'Write a message...',send:'Send',you:'You',mgr:'Manager'},
              tr:{title:'WinPartners yöneticiniz',online:'Genellikle birkaç saat içinde yanıtlar',empty:'Yöneticinize buradan yazın — kodlar, ödemeler veya kumarhaneler hakkında her şeyi sorun. Genellikle birkaç saat içinde yanıtlarız.',ph:'Bir mesaj yazın...',send:'Gönder',you:'Siz',mgr:'Yönetici'},
              de:{title:'Ihr WinPartners-Manager',online:'Antwortet normalerweise innerhalb weniger Stunden',empty:'Schreiben Sie Ihrem Manager hier — fragen Sie alles über Codes, Auszahlungen oder Casinos. Wir antworten normalerweise innerhalb weniger Stunden.',ph:'Nachricht schreiben...',send:'Senden',you:'Sie',mgr:'Manager'},
              pt:{title:'O seu gestor WinPartners',online:'Normalmente responde em poucas horas',empty:'Escreva ao seu gestor aqui — pergunte tudo sobre códigos, pagamentos ou casinos. Respondemos normalmente em poucas horas.',ph:'Escreva uma mensagem...',send:'Enviar',you:'Você',mgr:'Gestor'},
              pl:{title:'Twój menedżer WinPartners',online:'Zwykle odpowiada w ciągu kilku godzin',empty:'Napisz do menedżera tutaj — zapytaj o kody, wypłaty lub kasyna. Zwykle odpowiadamy w ciągu kilku godzin.',ph:'Napisz wiadomość...',send:'Wyślij',you:'Ty',mgr:'Menedżer'},
            })[lang] || ({title:'Managerul tău WinPartners',online:'De obicei răspunde în câteva ore',empty:'Scrie-i managerului tău aici.',ph:'Scrie un mesaj...',send:'Trimite',you:'Tu',mgr:'Manager'})
            return (
            <div style={{maxWidth:680}}>
              {/* Optiuni rapide de contact */}
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:12,marginBottom:16}}>
                <a href="https://t.me/winpartners_manager" target="_blank" rel="noopener noreferrer" style={{...card,display:'flex',alignItems:'center',gap:12,textDecoration:'none',cursor:'pointer'}}>
                  <div style={{width:42,height:42,borderRadius:10,background:'rgba(34,158,217,0.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>✈️</div>
                  <div><div style={{fontSize:14,fontWeight:700,color:txt}}>Telegram</div><div style={{fontSize:12,color:'#229ED9',fontWeight:600}}>@winpartners_manager</div></div>
                </a>
                <a href="mailto:supportwinpartners@gmail.com" style={{...card,display:'flex',alignItems:'center',gap:12,textDecoration:'none',cursor:'pointer'}}>
                  <div style={{width:42,height:42,borderRadius:10,background:'rgba(245,166,35,0.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>✉️</div>
                  <div><div style={{fontSize:14,fontWeight:700,color:txt}}>Email</div><div style={{fontSize:12,color:gold,fontWeight:600}}>supportwinpartners@gmail.com</div></div>
                </a>
              </div>

              {/* Chat direct cu managerul */}
              <div style={{...card,padding:0,overflow:'hidden',display:'flex',flexDirection:'column',height:isMobile?'62vh':470}}>
                <div style={{padding:'12px 16px',borderBottom:`1px solid ${bdr}`,background:'#15151e',display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:38,height:38,borderRadius:'50%',background:'rgba(16,185,129,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>💬</div>
                  <div><div style={{fontSize:14,fontWeight:700,color:txt}}>{CHAT.title}</div><div style={{fontSize:11,color:'#10b981'}}>● {CHAT.online}</div></div>
                </div>
                <div style={{flex:1,overflowY:'auto',padding:'16px',display:'flex',flexDirection:'column',gap:10,background:bgCard}}>
                  {chatMsgs.length===0 ? (
                    <div style={{margin:'auto',textAlign:'center',color:txtSub,fontSize:13,maxWidth:320,lineHeight:1.6}}>{CHAT.empty}</div>
                  ) : chatMsgs.map(m=>(
                    <div key={m._key||m.ts} style={{alignSelf:m.from==='blogger'?'flex-end':'flex-start',maxWidth:'80%'}}>
                      <div style={{padding:'9px 13px',borderRadius:12,fontSize:13,lineHeight:1.5,wordBreak:'break-word',
                        background:m.from==='blogger'?gold:'#f1f3f5',color:m.from==='blogger'?'#1a1a2e':txt,
                        borderBottomRightRadius:m.from==='blogger'?3:12,borderBottomLeftRadius:m.from==='blogger'?12:3}}>{m.text}</div>
                      <div style={{fontSize:10,color:txtSub,marginTop:3,textAlign:m.from==='blogger'?'right':'left'}}>{m.from==='blogger'?CHAT.you:CHAT.mgr}{m.timestamp?(' · '+m.timestamp):''}</div>
                    </div>
                  ))}
                </div>
                <div style={{padding:'10px 12px',borderTop:`1px solid ${bdr}`,display:'flex',gap:8,background:'#15151e'}}>
                  <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChatMsg()}}}
                    placeholder={CHAT.ph} style={{flex:1,padding:'10px 14px',fontSize:13,border:`1px solid ${bdr}`,borderRadius:20,outline:'none',fontFamily:'inherit',color:txt,boxSizing:'border-box'}}/>
                  <button onClick={sendChatMsg} disabled={!chatInput.trim()} style={{...btnPrimary,padding:'10px 18px',borderRadius:20,flexShrink:0,opacity:chatInput.trim()?1:0.5,cursor:chatInput.trim()?'pointer':'default'}}>{CHAT.send}</button>
                </div>
              </div>
            </div>
            )
          })()}

        </div>
      </div>

      {/* PAY MODAL */}
      {showPay&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:'1rem'}} onClick={()=>setShowPay(false)}>
          <div style={{...card,width:'100%',maxWidth:380,boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}} onClick={e=>e.stopPropagation()}>
            {paySent?(
              <div style={{textAlign:'center',padding:'1rem'}}>
                <div style={{fontSize:40,marginBottom:10}}>✅</div>
                <h3 style={{fontWeight:700,marginBottom:6,fontSize:16,color:txt}}>{L({ro:'Cerere trimisă!',ru:'Заявка отправлена!',en:'Request sent!',tr:'Talep gönderildi!',de:'Anfrage gesendet!',pt:'Pedido enviado!',pl:'Wniosek wysłany!'})}</h3>
                <p style={{color:txtSub,fontSize:13,marginBottom:8,lineHeight:1.6}}>
                  {({ro:<>Cererea ta de plată a fost înregistrată. Suma va fi procesată în <strong>48 ore</strong> pe adresa ta {payMethod}.</>,ru:<>Твоя заявка на выплату принята. Сумма будет обработана в течение <strong>48 часов</strong> на твой адрес {payMethod}.</>,en:<>Your payment request has been registered. The amount will be processed within <strong>48 hours</strong> to your {payMethod} address.</>,tr:<>Ödeme talebin kaydedildi. Tutar <strong>48 saat</strong> içinde {payMethod} adresine işlenecek.</>,de:<>Deine Auszahlungsanfrage wurde registriert. Der Betrag wird innerhalb von <strong>48 Stunden</strong> an deine {payMethod}-Adresse bearbeitet.</>,pt:<>O teu pedido de pagamento foi registado. O valor será processado em <strong>48 horas</strong> para o teu endereço {payMethod}.</>,pl:<>Twój wniosek o wypłatę został zarejestrowany. Kwota zostanie przetworzona w ciągu <strong>48 godzin</strong> na Twój adres {payMethod}.</>})[lang]}
                </p>
                <div style={{background:'rgba(245,166,35,0.08)',border:'1px solid rgba(245,166,35,0.28)',borderRadius:6,padding:'8px 12px',fontSize:12,color:'#e8c074',marginBottom:16}}>
                  💡 {({ro:'Primești notificare pe Telegram când plata e confirmată.',ru:'Получишь уведомление в Telegram, когда выплата будет подтверждена.',en:'You will get a Telegram notification when the payment is confirmed.',tr:'Ödeme onaylandığında Telegram bildirimi alacaksın.',de:'Du erhältst eine Telegram-Benachrichtigung, sobald die Zahlung bestätigt ist.',pt:'Receberás uma notificação no Telegram quando o pagamento for confirmado.',pl:'Otrzymasz powiadomienie na Telegramie, gdy płatność zostanie potwierdzona.'})[lang]||'Primești notificare pe Telegram când plata e confirmată.'}
                </div>
                <button style={btnPrimary} onClick={()=>{setShowPay(false);setPaySent(false)}}>{({'ro':'Închide','ru':'Закрыть','en':'Close','tr':'Kapat','de':'Schließen','pt':'Fechar','pl':'Zamknij'})[lang]||'Închide'}</button>
              </div>
            ):(
              <>
                <div style={{fontSize:15,fontWeight:700,color:txt,marginBottom:4}}>{({'ro':'Solicită plată comisioane','ru':'Запросить выплату комиссий','en':'Request commission payment','tr':'Komisyon ödemesi talep et','de':'Provisionszahlung anfordern','pt':'Solicitar pagamento de comissões','pl':'Zażądaj wypłaty prowizji'})[lang]}</div>
                <div style={{background:'#10231a',border:'1px solid rgba(52,211,153,0.28)',borderRadius:6,padding:'10px 14px',marginBottom:14,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontSize:11,color:txtSub,marginBottom:1}}>{L({ro:'Disponibil pentru retragere',ru:'Доступно для вывода',en:'Available for withdrawal',tr:'Çekilebilir bakiye',de:'Verfügbar zum Abheben',pt:'Disponível para saque',pl:'Dostępne do wypłaty'})}</div>
                    <div style={{fontSize:22,fontWeight:900,color:'#4ade80'}}>${D.bal.available}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:11,color:txtSub,marginBottom:1}}>{L({ro:'Minim retragere',ru:'Минимум для вывода',en:'Minimum withdrawal',tr:'Minimum çekim',de:'Mindestauszahlung',pt:'Saque mínimo',pl:'Minimalna wypłata'})}</div>
                    <div style={{fontSize:14,fontWeight:700,color:txtSub}}>$30</div>
                  </div>
                </div>
                <label style={label}>{({'ro':'Suma de retras','ru':'Сумма вывода','en':'Amount to withdraw','tr':'Çekilecek tutar','de':'Auszahlungsbetrag','pt':'Valor a retirar','pl':'Kwota wypłaty'})[lang]||'Suma de retras'}</label>
                <div style={{display:'flex',gap:8,marginBottom:4}}>
                  <div style={{position:'relative',flex:1}}>
                    <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:txtSub,fontWeight:700,fontSize:14}}>$</span>
                    <input type="number" min={30} max={D.bal.available} style={{...inp,width:'100%',boxSizing:'border-box',paddingLeft:24,fontWeight:700}}
                      value={payAmount} onChange={e=>setPayAmount(e.target.value)} placeholder={String(D.bal.available)}/>
                  </div>
                  <button style={{padding:'0 14px',fontSize:12,fontWeight:700,cursor:'pointer',border:`1px solid ${gold}`,borderRadius:6,background:gold+'18',color:gold,whiteSpace:'nowrap'}} onClick={()=>setPayAmount(String(D.bal.available))}>{({'ro':'Tot','ru':'Всё','en':'All','tr':'Tümü','de':'Alles','pt':'Tudo','pl':'Wszystko'})[lang]||'Tot'}</button>
                </div>
                <div style={{fontSize:11,color:txtSub,marginBottom:12}}>{({'ro':'Poți retrage parțial. Restul rămâne în sold.','ru':'Можно вывести частично. Остаток останется на балансе.','en':'You can withdraw partially. The rest stays in your balance.','tr':'Kısmi çekebilirsin. Kalanı bakiyende kalır.','de':'Teilauszahlung möglich. Der Rest bleibt im Guthaben.','pt':'Podes retirar parcialmente. O resto fica no saldo.','pl':'Możesz wypłacić częściowo. Reszta zostaje na saldzie.'})[lang]||'Poți retrage parțial. Restul rămâne în sold.'}</div>
                <label style={label}>{L({ro:'Metodă de plată',ru:'Метод оплаты',en:'Payment method',tr:'Ödeme yöntemi',de:'Zahlungsmethode',pt:'Método de pagamento',pl:'Metoda płatności'})}</label>
                <select style={{...inp,width:'100%',boxSizing:'border-box',marginBottom:10}} value={payMethod} onChange={e=>setPayMethod(e.target.value)}>
                  {['Bitcoin (BTC)','USDT (TRC20)','USDT (ERC20)','Ethereum (ETH)','Binance Pay','Skrill','Neteller'].map(m=><option key={m}>{m}</option>)}
                </select>
                <label style={label}>Adresa {payMethod}</label>
                <input style={{...inp,width:'100%',boxSizing:'border-box',marginBottom:6,fontFamily:'monospace',fontSize:12}}
                  placeholder={payMethod.includes('Bitcoin')?'bc1q...':payMethod.includes('TRC20')?'T...':payMethod.includes('Binance')?'ID Binance Pay...':'Adresa sau email'}
                  value={payAddr} onChange={e=>setPayAddr(e.target.value)}/>
                <div style={{background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:6,padding:'10px 12px',marginBottom:10,fontSize:12,color:txtSub}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <strong>{({'ro':'Primești:','ru':'Получаете:','en':'You receive:','tr':'Alırsınız:','de':'Sie erhalten:','pt':'Recebe:','pl':'Otrzymujesz:'})[lang]||'Primești:'}</strong>
                    <strong style={{color:'#10b981',fontSize:16}}>${Math.min(Number(payAmount)||0, D.bal.available)}</strong>
                  </div>
                  <div style={{fontSize:11,color:txtSub,marginTop:4}}>{({'ro':'Fără comisioane de procesare — primești 100% din sold.','ru':'Без комиссий за обработку — вы получаете 100% баланса.','en':'No processing fees — you receive 100% of your balance.','tr':'İşlem ücreti yok — bakiyenizin %100ünü alırsınız.','de':'Keine Bearbeitungsgebühren — Sie erhalten 100% Ihres Guthabens.','pt':'Sem taxas de processamento — recebe 100% do saldo.','pl':'Bez opłat za przetwarzanie — otrzymujesz 100% salda.'})[lang]||'Fără comisioane de procesare — primești 100% din sold.'}</div>
                </div>
                <div style={{fontSize:11,color:txtSub,marginBottom:10}}>
                  {({'ro':'Verifică adresa cu atenție. Tranzacțiile crypto sunt ireversibile.','ru':'Проверьте адрес тщательно. Крипто-транзакции необратимы.','en':'Check the address carefully. Crypto transactions are irreversible.','tr':'Adresi dikkatlice kontrol edin. Kripto işlemler geri alınamaz.','de':'Adresse sorgfältig prüfen. Krypto-Transaktionen sind unwiderruflich.','pt':'Verifique o endereço com atenção. Transações cripto são irreversíveis.','pl':'Sprawdź adres uważnie. Transakcje krypto są nieodwracalne.'})[lang]||'Verifică adresa cu atenție.'}
                </div>
                {(()=>{ const amt=Math.floor(Number(payAmount)||0); const valid=payAddr&&amt>=30&&amt<=D.bal.available; return (
                <button style={{...btnPrimary,width:'100%',padding:'11px',fontSize:14,borderRadius:6,opacity:valid?1:0.5}}
                  disabled={!valid}
                  onClick={async ()=>{
                    if(valid){
                      await requestPayout({ username:D.username, name:D.name, amount:amt, method:payMethod, detail:payAddr })
                      await addNotification({type:'pay_request',blogger:D.username,bloggerName:D.name,amount:amt,address:payAddr,method:payMethod,detail:`Cerere plată \$${amt} → ${payAddr}`})
                      setPaySent(true)
                    }
                  }}>
                  {amt<30?`${({'ro':'Minim $30','ru':'Минимум $30','en':'Minimum $30','tr':'Minimum $30','de':'Mindest $30','pt':'Mínimo $30','pl':'Minimum $30'})[lang]||'Minim $30'}`:amt>D.bal.available?`${({'ro':'Maxim','ru':'Максимум','en':'Maximum','tr':'Maksimum','de':'Maximal','pt':'Máximo','pl':'Maksimum'})[lang]||'Maxim'} $${D.bal.available}`:`${({'ro':'Solicită','ru':'Запросить','en':'Request','tr':'Talep et','de':'Anfordern','pt':'Solicitar','pl':'Zażądaj'})[lang]||'Solicită'} $${amt} →`}
                </button>
                )})()}
                <button style={{width:'100%',padding:'9px',fontSize:13,cursor:'pointer',border:`1px solid ${bdr}`,borderRadius:6,background:'none',color:txtSub,marginTop:8,fontFamily:'inherit'}} onClick={()=>setShowPay(false)}>{({'ro':'Anulează','ru':'Отмена','en':'Cancel','tr':'İptal','de':'Abbrechen','pt':'Cancelar','pl':'Anuluj'})[lang]||'Anulează'}</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL CERERE CASINO NOU */}
      {showCasinoRequest && (() => {
        const casino = CASINOS_BASE.find(c => c.id === showCasinoRequest)
        return (
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:'1rem'}} onClick={()=>setShowCasinoRequest(null)}>
            <div style={{...card,width:'100%',maxWidth:420,boxShadow:'0 20px 60px rgba(0,0,0,0.4)'}} onClick={e=>e.stopPropagation()}>
              <div style={{fontSize:15,fontWeight:700,color:txt,marginBottom:4}}>{dt.reqAccessTitle} — {casino?.name}</div>
              <p style={{color:txtSub,fontSize:13,marginBottom:20,lineHeight:1.6}}>
                {L({ro:'Trimite o cerere pentru a promova '+(casino?.name||'')+'. Echipa noastră îți va activa accesul și îți va aloca un cod promoțional dedicat.',ru:'Отправь заявку на продвижение '+(casino?.name||'')+'. Наша команда активирует доступ и выделит тебе персональный промокод.',en:'Send a request to promote '+(casino?.name||'')+'. Our team will activate your access and assign you a dedicated promo code.',tr:(casino?.name||'')+' tanıtmak için talep gönder. Ekibimiz erişimini aktif edecek ve sana özel bir promosyon kodu atayacak.',de:'Sende eine Anfrage, um '+(casino?.name||'')+' zu bewerben. Unser Team aktiviert deinen Zugang und weist dir einen eigenen Promo-Code zu.',pt:'Envia um pedido para promover '+(casino?.name||'')+'. A nossa equipa ativará o teu acesso e atribuirá um código promo dedicado.',pl:'Wyślij wniosek o promowanie '+(casino?.name||'')+'. Nasz zespół aktywuje dostęp i przypisze Ci dedykowany kod promocyjny.'})}
              </p>
              <div style={{background:'rgba(245,166,35,0.08)',border:'1px solid rgba(245,166,35,0.28)',borderRadius:6,padding:'10px 14px',marginBottom:20,fontSize:12,color:'#e8c074'}}>
                ⏱ {L({ro:'Procesare în 24-48 ore. Vei fi notificat pe email și Telegram.',ru:'Обработка за 24-48 часов. Вы получите уведомление на email и в Telegram.',en:'Processed in 24-48 hours. You will be notified by email and Telegram.',tr:'24-48 saat içinde işlenir. E-posta ve Telegram ile bilgilendirilirsiniz.',de:'Bearbeitung in 24-48 Stunden. Sie werden per E-Mail und Telegram benachrichtigt.',pt:'Processado em 24-48 horas. Será notificado por email e Telegram.',pl:'Przetwarzane w 24-48 godzin. Otrzymasz powiadomienie e-mailem i na Telegramie.'})}
              </div>
              <button
                onClick={async ()=>{
                  const exists = customRequests.find(r=>r.casinoId===showCasinoRequest && r.type==='casino_access')
                  if (!exists) {
                    await addCustomRequest({
                      blogger: D.username, bloggerName: D.name,
                      casinoId: showCasinoRequest, casinoName: casino?.name,
                      type: 'casino_access', requestedCode: 'ACCES',
                      date: new Date().toLocaleDateString('ro-RO')
                    })
                  }
                  setShowCasinoRequest(null)
                  showToast(L({ro:'✅ Cererea a fost trimisă! Te anunțăm în 24-48 ore.',ru:'✅ Заявка отправлена! Сообщим в течение 24-48 часов.',en:'✅ Request sent! We will notify you within 24-48 hours.',tr:'✅ Talep gönderildi! 24-48 saat içinde bilgilendireceğiz.',de:'✅ Anfrage gesendet! Wir benachrichtigen Sie innerhalb von 24-48 Stunden.',pt:'✅ Pedido enviado! Avisamos dentro de 24-48 horas.',pl:'✅ Wniosek wysłany! Powiadomimy w ciągu 24-48 godzin.'}))
                }}
                style={{...btnPrimary,width:'100%',padding:'11px',fontSize:14,borderRadius:6}}>
                {L({ro:'Trimite cererea',ru:'Отправить заявку',en:'Send request',tr:'Talebi gönder',de:'Anfrage senden',pt:'Enviar pedido',pl:'Wyślij wniosek'})}
              </button>
              <button style={{width:'100%',padding:'9px',fontSize:13,cursor:'pointer',border:`1px solid ${bdr}`,borderRadius:6,background:'none',color:txtSub,marginTop:8,fontFamily:'inherit'}} onClick={()=>setShowCasinoRequest(null)}>{({'ro':'Anulează','ru':'Отмена','en':'Cancel','tr':'İptal','de':'Abbrechen','pt':'Cancelar','pl':'Anuluj'})[lang]||'Anulează'}</button>
            </div>
          </div>
        )
      })()}

      {/* MODAL COD PERSONALIZAT */}
      {showCustomCode&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:'1rem'}} onClick={()=>{setShowCustomCode(false);setCustomCodeSent(false)}}>
          <div style={{...card,width:'100%',maxWidth:400,boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}} onClick={e=>e.stopPropagation()}>
            {customCodeSent?(
              <div style={{textAlign:'center',padding:'1rem'}}>
                <div style={{fontSize:40,marginBottom:10}}>✅</div>
                <h3 style={{fontWeight:700,marginBottom:6,fontSize:16,color:txt}}>{L({ro:'Cerere trimisă!',ru:'Заявка отправлена!',en:'Request sent!',tr:'Talep gönderildi!',de:'Anfrage gesendet!',pt:'Pedido enviado!',pl:'Wniosek wysłany!'})}</h3>
                <p style={{color:txtSub,fontSize:13,marginBottom:4}}>{L({ro:'Managerul tău va procesa cererea pentru ',ru:'Ваш менеджер обработает заявку на ',en:'Your manager will process the request for ',tr:'Yöneticiniz şu kod için talebi işleyecek: ',de:'Ihr Manager bearbeitet die Anfrage für ',pt:'O seu gestor irá processar o pedido para ',pl:'Twój menedżer przetworzy wniosek o '})}<strong style={{color:gold,fontFamily:'monospace'}}>{customCodeText||L({ro:'codul tău',ru:'ваш код',en:'your code',tr:'kodunuz',de:'Ihr Code',pt:'o teu código',pl:'twój kod'})}</strong>{L({ro:' în 24-48 ore.',ru:' за 24-48 часов.',en:' within 24-48 hours.',tr:' 24-48 saat içinde.',de:' innerhalb von 24-48 Stunden.',pt:' dentro de 24-48 horas.',pl:' w ciągu 24-48 godzin.'})}</p>
                <p style={{color:txtSub,fontSize:12,marginBottom:16}}>{L({ro:'Vei fi notificat când codul este activat.',ru:'Вы получите уведомление, когда код будет активирован.',en:'You will be notified when the code is activated.',tr:'Kod etkinleştirildiğinde bilgilendirileceksiniz.',de:'Sie werden benachrichtigt, wenn der Code aktiviert ist.',pt:'Será notificado quando o código for ativado.',pl:'Otrzymasz powiadomienie, gdy kod zostanie aktywowany.'})}</p>
                <button style={btnPrimary} onClick={()=>{setShowCustomCode(false);setCustomCodeSent(false)}}>{({'ro':'Închide','ru':'Закрыть','en':'Close','tr':'Kapat','de':'Schließen','pt':'Fechar','pl':'Zamknij'})[lang]||'Închide'}</button>
              </div>
            ):(
              <>
                <div style={{fontSize:15,fontWeight:700,color:txt,marginBottom:4}}>{dt.reqCustomTitle}</div>
                <p style={{color:txtSub,fontSize:13,marginBottom:16,lineHeight:1.5}}>
                  {L({ro:'Vrei un cod cu numele tău?',ru:'Хочешь код со своим именем?',en:'Want a code with your name?',tr:'Adınla bir kod ister misin?',de:'Möchtest du einen Code mit deinem Namen?',pt:'Queres um código com o teu nome?',pl:'Chcesz kod ze swoim imieniem?'})} (ex: <span style={{fontFamily:'monospace',color:gold,fontWeight:700}}>IONEL23</span>, <span style={{fontFamily:'monospace',color:gold,fontWeight:700}}>VLAD_WIN</span>)<br/>
                  {L({ro:'Managerul va face cererea la cazinou și îl activează în 24-48h.',ru:'Менеджер отправит заявку в казино и активирует его за 24-48 часов.',en:'The manager will submit the request to the casino and activate it within 24-48h.',tr:'Yönetici talebi kumarhaneye iletecek ve 24-48 saat içinde aktif edecek.',de:'Der Manager reicht die Anfrage beim Casino ein und aktiviert es innerhalb von 24-48 Std.',pt:'O gestor enviará o pedido ao casino e ativá-lo-á em 24-48h.',pl:'Menedżer złoży wniosek w kasynie i aktywuje je w ciągu 24-48 godz.'})}
                </p>
                <label style={label}>{L({ro:'Cazinou',ru:'Казино',en:'Casino',tr:'Kumarhane',de:'Casino',pt:'Casino',pl:'Kasyno'})}</label>
                <div style={{...inp,width:'100%',boxSizing:'border-box',marginBottom:12,display:'flex',alignItems:'center',gap:8,fontWeight:700}}>
                  {CASINOS.find(c=>c.id===customCasinoId)?.name || ''}
                </div>
                <label style={label}>{L({ro:'Codul dorit (fără spații, litere și cifre)',ru:'Желаемый код (без пробелов, буквы и цифры)',en:'Desired code (no spaces, letters and digits)',tr:'İstediğiniz kod (boşluksuz, harf ve rakam)',de:'Gewünschter Code (keine Leerzeichen, Buchstaben und Zahlen)',pt:'Código desejado (sem espaços, letras e dígitos)',pl:'Żądany kod (bez spacji, litery i cyfry)'})}</label>
                <input
                  style={{...inp,width:'100%',boxSizing:'border-box',marginBottom:6,textTransform:'uppercase',fontFamily:'monospace',fontSize:16,fontWeight:700,letterSpacing:2}}
                  placeholder="IONEL23"
                  value={customCodeText}
                  onChange={e=>setCustomCodeText(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g,''))}
                  maxLength={20}
                />
                <div style={{fontSize:11,color:txtSub,marginBottom:16}}>{L({ro:'Caractere permise: A-Z, 0-9, underscore (_)',ru:'Допустимые символы: A-Z, 0-9, подчёркивание (_)',en:'Allowed characters: A-Z, 0-9, underscore (_)',tr:'İzin verilen karakterler: A-Z, 0-9, alt çizgi (_)',de:'Erlaubte Zeichen: A-Z, 0-9, Unterstrich (_)',pt:'Caracteres permitidos: A-Z, 0-9, sublinhado (_)',pl:'Dozwolone znaki: A-Z, 0-9, podkreślenie (_)'})}</div>
                <button
                  style={{...btnPrimary,width:'100%',padding:'11px',fontSize:14,borderRadius:6,opacity:customCodeText.length<3?0.5:1}}
                  disabled={customCodeText.length<3}
                  onClick={submitCustomRequest}>
                  {L({ro:'Trimite cererea',ru:'Отправить заявку',en:'Send request',tr:'Talebi gönder',de:'Anfrage senden',pt:'Enviar pedido',pl:'Wyślij wniosek'})}
                </button>
                <button style={{width:'100%',padding:'9px',fontSize:13,cursor:'pointer',border:`1px solid ${bdr}`,borderRadius:6,background:'none',color:txtSub,marginTop:8,fontFamily:'inherit'}} onClick={()=>setShowCustomCode(false)}>{({'ro':'Anulează','ru':'Отмена','en':'Cancel','tr':'İptal','de':'Abbrechen','pt':'Cancelar','pl':'Anuluj'})[lang]||'Anulează'}</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer - like Melbet */}
      <div style={{background:'#1e1e30',borderTop:'1px solid rgba(255,255,255,0.06)',padding:isMobile?'14px 16px':'12px 24px',display:'flex',flexDirection:isMobile?'column':'row',alignItems:isMobile?'flex-start':'center',gap:isMobile?10:24,flexShrink:0,maxWidth:'100%',boxSizing:'border-box'}}>
        <div style={{display:'flex',gap:isMobile?14:20,flex:isMobile?'none':1,flexWrap:'wrap'}}>
          {[
            [L({ro:'Contacte',ru:'Контакты',en:'Contacts',tr:'İletişim',de:'Kontakte',pt:'Contactos',pl:'Kontakt'}), ()=>{setPage('contact');if(isMobile)setSidebarOpen(false)}],
            [L({ro:'Politica de confidențialitate',ru:'Политика конфиденциальности',en:'Privacy Policy',tr:'Gizlilik Politikası',de:'Datenschutz',pt:'Política de Privacidade',pl:'Polityka prywatności'}), ()=>nav('/terms')],
            [L({ro:'Politica cookie',ru:'Политика cookie',en:'Cookie Policy',tr:'Çerez Politikası',de:'Cookie-Richtlinie',pt:'Política de Cookies',pl:'Polityka cookie'}), ()=>nav('/terms')]
          ].map(([label,action])=>(
            <span key={label} onClick={action} style={{fontSize:11,color:'rgba(255,255,255,0.35)',cursor:'pointer'}} onMouseOver={e=>e.target.style.color='rgba(255,255,255,0.7)'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.35)'}>{label}</span>
          ))}
        </div>
        <span style={{fontSize:11,color:'rgba(255,255,255,0.2)'}}>Copyright © 2024-2026 WinPartners. {L({ro:'Toate drepturile rezervate.',ru:'Все права защищены.',en:'All rights reserved.',tr:'Tüm hakları saklıdır.',de:'Alle Rechte vorbehalten.',pt:'Todos os direitos reservados.',pl:'Wszelkie prawa zastrzeżone.'})}</span>
      </div>
    </div>
  )
}
