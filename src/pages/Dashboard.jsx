import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  loginBlogger,
  getCasinoStats, subscribeCasinoStats,
  getNextAvailableCode, subscribePromoCodes, updateBloggerFields,
  addCustomRequest, subscribeCustomRequests,
  addNotification,
} from '../db.js'

const gold = '#f5a623'
const bg = '#f0f2f5'
const bgCard = '#ffffff'
const bgSide = '#1e1e30'
const bgHeader = '#1e1e30'
const bdr = 'rgba(0,0,0,0.1)'
const txt = '#1a1a2e'
const txtSub = '#6b7280'

// ============================================================
// STORAGE — Firebase Realtime Database (sync în timp real)
// ============================================================
// Funcțiile de localStorage sunt înlocuite de Firebase db.js
// Rămân stub-uri goale pentru compatibilitate cu codul vechi
function loadCustomRequests() { return [] }
function saveCustomRequests() {}

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
  pinup:       [],
}

// getNextCode — înlocuit cu Firebase (async) în generatePromoCode
// Lăsat stub pentru compatibilitate
function getNextCode(casinoId, username) { return null }

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
    commission: '25% Revenue Share',
    description: 'Casino + sporturi · lider în Moldova și România · cod promo numeric',
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
    commission: 'până la 40% Revenue Share',
    description: 'Cel mai mare bookmaker global · 500K+ parteneri · 61 limbi',
    minPayout: '$30',
    payFreq: 'Săptămânal',
    affLink: 'https://1xpartners.com',
    geo: 'Global · RO, MD, RU',
    comingSoon: true,
  },
  {
    id: 'mostbet',
    name: 'Mostbet',
    logo: '🎯',
    color: '#10b981',
    commissionPct: 60,
    commission: 'până la 60% Revenue Share',
    description: 'Perfect pentru Moldova și CIS · RevShare pe viață · 90+ țări',
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
    commission: 'până la 60% Revenue Share',
    description: 'Casino + pariuri sportive · 8000+ jocuri · creștere 45% în 2024',
    minPayout: '$30',
    payFreq: 'Săptămânal',
    affLink: 'https://spinbetterpartners.com',
    geo: 'RO, MD, EU, CIS',
    comingSoon: true,
  },
  {
    id: 'pinup',
    name: 'PIN-UP Casino',
    logo: '📌',
    color: '#e91e63',
    commissionPct: 50,
    commission: 'până la 50% Revenue Share',
    description: 'Câștigător Affiliate of the Year 2025 · 25000+ parteneri activi',
    minPayout: '$30',
    payFreq: 'Lunar',
    affLink: 'https://pin-up.partners',
    geo: 'MD, RU, CIS, LATAM',
    comingSoon: true,
  },
]

// Generează linkul de jucători Melbet pentru un cod promoțional
// Format: https://refpa3665.com/L?tag=d_{AffID}m_{campanie}c_{cod}
const MELBET_AFF_ID = '5666408'
const MELBET_CAMPAIGN = '2170'
function getMelbetPlayerLink(promoCode) {
  return `https://refpa3665.com/L?tag=d_${MELBET_AFF_ID}m_${MELBET_CAMPAIGN}c_${promoCode}`
}

// buildCasinos eliminat — CASINOS se calculează în DashboardContent din casinoStats Firebase

// Promcoduri demo per casino (în producție vin din admin)
const DEMO_CODES = {
  xbet:       ['1X001','1X002','1X003','1X004','1X005'],
  mostbet:    ['MB001','MB002','MB003','MB004','MB005'],
  spinbetter: ['SB001','SB002','SB003','SB004','SB005'],
  pinup:      ['PU001','PU002','PU003','PU004','PU005'],
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
  ro: { sub:'Platforma oficială de afiliere casino', title:'Intră în cont', user:'Username', pass:'Parolă', btn:'INTRĂ ÎN CONT', loading:'⏳ Se verifică...', noAcc:'Nu ai cont?', apply:'Aplică acum', errEmpty:'Completează username și parola', errWrong:'Username sau parolă incorectă', errPending:'Contul tău este în așteptare. Contactează adminul.', errConn:'Eroare de conexiune. Verifică internetul.' },
  ru: { sub:'Официальная партнёрская платформа казино', title:'Войти в аккаунт', user:'Имя пользователя', pass:'Пароль', btn:'ВОЙТИ', loading:'⏳ Проверка...', noAcc:'Нет аккаунта?', apply:'Подать заявку', errEmpty:'Введите имя пользователя и пароль', errWrong:'Неверное имя пользователя или пароль', errPending:'Ваш аккаунт ожидает одобрения. Свяжитесь с администратором.', errConn:'Ошибка подключения. Проверьте интернет.' },
  en: { sub:'Official casino affiliate platform', title:'Log in to your account', user:'Username', pass:'Password', btn:'LOG IN', loading:'⏳ Checking...', noAcc:"Don't have an account?", apply:'Apply now', errEmpty:'Enter your username and password', errWrong:'Incorrect username or password', errPending:'Your account is pending approval. Contact the admin.', errConn:'Connection error. Check your internet.' },
  tr: { sub:'Resmi casino ortaklık platformu', title:'Hesabınıza giriş yapın', user:'Kullanıcı adı', pass:'Şifre', btn:'GİRİŞ YAP', loading:'⏳ Kontrol ediliyor...', noAcc:'Hesabınız yok mu?', apply:'Başvuru yapın', errEmpty:'Kullanıcı adı ve şifre girin', errWrong:'Hatalı kullanıcı adı veya şifre', errPending:'Hesabınız onay bekliyor. Yöneticiyle iletişime geçin.', errConn:'Bağlantı hatası. İnternet bağlantınızı kontrol edin.' },
  de: { sub:'Offizielle Casino-Affiliate-Plattform', title:'In Ihr Konto einloggen', user:'Benutzername', pass:'Passwort', btn:'EINLOGGEN', loading:'⏳ Wird geprüft...', noAcc:'Noch kein Konto?', apply:'Jetzt bewerben', errEmpty:'Benutzername und Passwort eingeben', errWrong:'Falscher Benutzername oder Passwort', errPending:'Ihr Konto wartet auf Genehmigung. Kontaktieren Sie den Admin.', errConn:'Verbindungsfehler. Überprüfen Sie Ihre Internetverbindung.' },
  pt: { sub:'Plataforma oficial de afiliados casino', title:'Entrar na sua conta', user:'Nome de usuário', pass:'Senha', btn:'ENTRAR', loading:'⏳ A verificar...', noAcc:'Não tem conta?', apply:'Candidatar-se', errEmpty:'Insira o nome de usuário e senha', errWrong:'Nome de usuário ou senha incorretos', errPending:'A sua conta está a aguardar aprovação. Contacte o administrador.', errConn:'Erro de ligação. Verifique a sua internet.' },
  pl: { sub:'Oficjalna platforma partnerska kasyna', title:'Zaloguj się do konta', user:'Nazwa użytkownika', pass:'Hasło', btn:'ZALOGUJ SIĘ', loading:'⏳ Sprawdzanie...', noAcc:'Nie masz konta?', apply:'Złóż wniosek', errEmpty:'Wprowadź nazwę użytkownika i hasło', errWrong:'Nieprawidłowa nazwa użytkownika lub hasło', errPending:'Twoje konto oczekuje na zatwierdzenie. Skontaktuj się z administratorem.', errConn:'Błąd połączenia. Sprawdź swój internet.' },
}

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('wp_lang')
    return ['ro','ru','en','tr','de','pt','pl'].includes(saved) ? saved : 'ro'
  })
  const lt = LOGIN_T[lang] || LOGIN_T.ro

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

  const gold2 = '#f5a623'
  return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif'}}>
      <div style={{textAlign:'center',maxWidth:380,width:'100%',padding:'2rem'}}>
        <div style={{fontSize:28,fontWeight:900,marginBottom:8,color:'#fff'}}>
          WIN<span style={{color:gold2}}>PARTNERS</span>
        </div>
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
              type="text" placeholder="username" value={username}
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
    setBlogger(bloggerData)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('wp_blogger')
    setBlogger(null)
  }

  if (!blogger) return <LoginScreen onLogin={handleLogin} />

  return <DashboardContent blogger={blogger} onLogout={handleLogout} />
}

function DashboardContent({ blogger, onLogout }) {
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
  const [page,setPage]=useState('casino')
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

  const [selectedCasino, setSelectedCasino] = useState('melbet')
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
  const [showCasinoRequest, setShowCasinoRequest] = useState(null)
  // Referrals
  const [myReferrals] = useState([])
  // Cazinouri cu statistici live din Firebase (actualizate de admin)
  const [casinoStats, setCasinoStatsState] = useState({})
  const CASINOS = CASINOS_BASE.map(c => ({ ...c, stats: casinoStats[c.id] || { regs:0, deposits:0, revenue:0, commission:0, clicks:0 } }))

  // Sursă unică de adevăr: soldul derivă din suma comisioanelor pe cazinouri (actualizate de admin).
  // Fallback pe câmpul global blogger.revenue până se încarcă statisticile (anti-pâlpâire la $0).
  {
    const hasCasinoData = Object.keys(casinoStats).length > 0
    if (hasCasinoData) {
      const earned = CASINOS.reduce((s,c)=>s+(Number(c.stats.commission)||0),0)
      D.bal.total = Math.round(earned)
      D.bal.days30 = Math.round(earned)
      D.bal.available = Math.max(0, Math.round(earned - (blogger.paid||0)))
      D.bal.byCasino = CASINOS
        .filter(c=>(Number(c.stats.commission)||0)>0)
        .map(c=>({ name:c.name, color:c.color, amount:Math.round(Number(c.stats.commission)||0) }))
    } else {
      D.bal.byCasino = []
    }
  }

  // Subscribe Firebase — polling la 5 secunde
  useEffect(() => {
    const unsub = subscribeCasinoStats(D.username, setCasinoStatsState)
    return unsub
  }, [D.username])

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
    if (confirm('Ești sigur că vrei să ieși?')) onLogout()
  }

  const copy=(t,k)=>{navigator.clipboard.writeText(t).then(()=>{setCopied(k);setTimeout(()=>setCopied(''),2000)})}
  const refLink=`https://winpartners.pro/register?ref=${D.refCode}`

  const totCl=D.daily.reduce((a,r)=>a+r.cl,0)
  const totRg=D.daily.reduce((a,r)=>a+r.rg,0)
  const totDp=D.daily.reduce((a,r)=>a+r.dp,0)
  const totRv=D.daily.reduce((a,r)=>a+r.rv,0)
  const totComm=Math.round(totRv*D.commission/100)

  // Styles
  const inp = {padding:'7px 12px',fontSize:13,border:`1px solid #d1d5db`,borderRadius:4,background:'#fff',color:txt,outline:'none',fontFamily:'inherit',minWidth:120}
  const btnPrimary = {padding:'8px 22px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:20,background:gold,color:'#000',fontFamily:'inherit',letterSpacing:'.02em'}
  const btnOutline = (c=gold)=>({padding:'6px 14px',fontSize:12,fontWeight:600,cursor:'pointer',border:`1px solid ${c}`,borderRadius:4,background:'none',color:c,fontFamily:'inherit'})
  const TH = {textAlign:'left',padding:'10px 14px',color:'#fff',fontWeight:600,fontSize:12,whiteSpace:'nowrap',background:'#2d2d3d',cursor:'pointer',userSelect:'none'}
  const TD = {padding:'10px 14px',borderBottom:`1px solid #f3f4f6`,color:txt,fontSize:13}
  const card = {background:bgCard,border:`1px solid ${bdr}`,borderRadius:8,padding:'16px',boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}
  const label = {fontSize:11,color:txtSub,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4,display:'block',fontWeight:500}
  const filterRow = {display:'flex',alignItems:'center',gap:10,marginBottom:16,flexWrap:'wrap'}
  const pageTitle = {fontSize:20,fontWeight:700,color:txt,marginBottom:'1.5rem'}

  const tabActive = {padding:'8px 20px',fontSize:13,cursor:'pointer',border:'none',background:gold,color:'#000',fontWeight:700,fontFamily:'inherit',borderRadius:'4px 4px 0 0'}
  const tabInactive = {padding:'8px 20px',fontSize:13,cursor:'pointer',border:`1px solid ${bdr}`,borderBottom:'none',background:bgCard,color:txtSub,fontWeight:400,fontFamily:'inherit',borderRadius:'4px 4px 0 0'}

  return (
    <div style={{background:bg,minHeight:'100vh',color:txt,fontFamily:'"Inter",-apple-system,sans-serif',display:'flex',flexDirection:'column',fontSize:13,position:'relative',overflowX:'hidden'}}>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div onClick={()=>setSidebarOpen(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:40}} />
      )}

      {/* TOP HEADER - dark like Melbet */}
      <div style={{background:bgHeader,height:52,display:'flex',alignItems:'center',padding:'0 1.5rem',gap:12,flexShrink:0,zIndex:10,boxShadow:'0 2px 8px rgba(0,0,0,0.2)'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',marginRight:8}} onClick={()=>nav('/')}>
          <svg width="22" height="22" viewBox="0 0 22 22">
            <polygon points="11,2 20,6.5 20,15.5 11,20 2,15.5 2,6.5" fill={gold} opacity=".2" stroke={gold} strokeWidth="1.2"/>
            <text x="11" y="15" textAnchor="middle" fontSize="9" fontWeight="900" fill={gold}>W</text>
          </svg>
          <span style={{fontSize:15,fontWeight:800,color:'#fff'}}><span>WIN</span><span style={{color:gold}}>PARTNERS</span></span>
        </div>
        {/* Badge inline items like Melbet */}
        <div style={{display:'flex',alignItems:'center',gap:6,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:4,padding:'4px 10px'}}>
          <span style={{fontSize:10,color:'rgba(255,255,255,0.4)'}}>Aff ID:</span>
          <span style={{fontSize:12,fontWeight:700,color:gold,fontFamily:'monospace'}}>{D.affId}</span>
        </div>
        <div style={{flex:1}}/>
        <div style={{display:'flex',gap:3,marginRight:6}}>
          {['ro','ru','en','tr','de','pt','pl'].map(l=>(
            <button key={l} onClick={()=>{setLang(l);localStorage.setItem('wp_lang',l)}} style={{padding:'2px 5px',fontSize:9,fontWeight:700,cursor:'pointer',border:`1px solid ${lang===l?gold:'rgba(255,255,255,0.15)'}`,borderRadius:3,background:lang===l?'rgba(245,166,35,0.15)':'none',color:lang===l?gold:'rgba(255,255,255,0.35)'}}>{l.toUpperCase()}</button>
          ))}
        </div>
        <button style={{...btnPrimary,fontSize:11,padding:'6px 14px',borderRadius:20}} onClick={()=>showToast('✓ '+{ro:'Statistici actualizate',ru:'Статистика обновлена',en:'Statistics refreshed',tr:'İstatistikler güncellendi',de:'Statistiken aktualisiert',pt:'Estatísticas atualizadas',pl:'Statystyki odświeżone'}[lang]||'Updated')}>↻ {({ro:'Actualizare',ru:'Обновить',en:'Refresh',tr:'Yenile',de:'Aktualisieren',pt:'Atualizar',pl:'Odśwież'})[lang]||'Refresh'}</button>
        <div style={{display:'flex',alignItems:'center',gap:8,borderLeft:'1px solid rgba(255,255,255,0.1)',paddingLeft:12}}>
          <div style={{width:28,height:28,borderRadius:'50%',background:`linear-gradient(135deg,${gold},#c97d00)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#000'}}>{D.name[0]}</div>
          <div style={{lineHeight:1.2}}>
            <div style={{fontSize:12,fontWeight:600,color:'#fff'}}>{D.name}</div>
            <div style={{fontSize:10,color:'rgba(255,255,255,0.4)'}}>@{D.username}</div>
          </div>
          <button style={{...btnOutline('rgba(255,255,255,0.35)'),color:'rgba(255,255,255,0.6)',fontSize:11,padding:'4px 10px',borderRadius:4}} onClick={()=>{ if(window.confirm('Ești sigur că vrei să ieși?')) { sessionStorage.removeItem('wp_blogger'); onLogout() } }}>Logout</button>
        </div>
      </div>

      <div style={{display:'flex',flex:1,overflow:'hidden'}}>

        {/* SIDEBAR - responsive */}
        <div style={Object.assign({},{width:220,background:bgSide,flexShrink:0,overflowY:'auto',paddingBottom:20,borderRight:'1px solid rgba(255,255,255,0.05)'},isMobile?{position:'fixed',top:52,left:sidebarOpen?0:-220,height:'calc(100vh - 52px)',zIndex:50,transition:'left .25s ease',boxShadow:sidebarOpen?'4px 0 20px rgba(0,0,0,0.4)':'none'}:{})}>
          {MENU.map((m)=>{
            const isActiveItem = m.casinoId ? (page==='casino' && selectedCasino===m.casinoId) : page===m.id
            return (
            <div key={m.id}>
              {m.section&&<div style={{padding:'12px 14px 4px',fontSize:9,color:'rgba(255,255,255,0.25)',textTransform:'uppercase',letterSpacing:'.12em',fontWeight:600}}>{m.section}</div>}
              <div onClick={()=>{ if(m.casinoId){setSelectedCasino(m.casinoId);setPage('casino');setGeneratedCode(null)} else {setPage(m.id)} ; if(isMobile) setSidebarOpen(false) }} style={{display:'flex',alignItems:'center',gap:8,padding:'9px 14px 9px 16px',cursor:'pointer',fontSize:13,color:isActiveItem?gold:'rgba(255,255,255,0.55)',background:isActiveItem?'rgba(245,166,35,0.1)':'none',borderLeft:isActiveItem?`3px solid ${gold}`:'3px solid transparent',transition:'all .12s'}}>
                <span style={{fontSize:14}}>{m.icon}</span>
                <span style={{flex:1}}>{m.label}</span>
                {m.comingSoon&&<span style={{fontSize:8,fontWeight:700,padding:'2px 6px',borderRadius:8,background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'.04em'}}>curând</span>}
              </div>
            </div>
            )
          })}
        </div>

        {/* MAIN CONTENT - light white background like Melbet */}
        <div style={{flex:1,overflowY:'auto',padding:isMobile?'1rem 0.75rem':'1.5rem',minWidth:0}}>

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
              {/* Welcome screen pentru bloggeri noi */}
              {(D.clicks===0 && D.regs===0) && (
                <div style={{background:'linear-gradient(135deg,rgba(245,166,35,0.08),rgba(245,166,35,0.02))',border:'1px solid rgba(245,166,35,0.25)',borderRadius:12,padding:'1.5rem',marginBottom:'1.25rem'}}>
                  <div style={{fontSize:16,fontWeight:800,color:'#f5a623',marginBottom:6}}>🎉 Bun venit în WinPartners, {D.name.split(' ')[0]}!</div>
                  <div style={{fontSize:13,color:'rgba(255,255,255,0.6)',marginBottom:14,lineHeight:1.6}}>
                    Contul tău este activ. Urmează 3 pași simpli pentru a începe să câștigi:
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:10}}>
                    {[
                      {n:'1',t:'Ia-ți codul promoțional Melbet',d:'Deschide secțiunea Melbet → generează codul tău unic',p:'casino',btn:'Generează cod →'},
                      {n:'2',t:'Promovează pe platforma ta',d:'Include codul în videoclipuri, descrieri și story-uri',p:null,btn:null},
                      {n:'3',t:'Urmărește câștigurile',d:'Statisticile se actualizează săptămânal de echipa WinPartners',p:null,btn:null},
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
                    Ai întrebări? Scrie-ne pe <a href="https://t.me/winpartners_manager" target="_blank" rel="noopener noreferrer" style={{color:'#f5a623',textDecoration:'none'}}>Telegram @winpartners_manager</a>
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

              {/* Câștigurile mele pe cazino — de unde vin banii */}
              {D.bal.byCasino && D.bal.byCasino.length > 0 && (
                <div style={{...card,padding:0,overflow:'hidden',marginBottom:'1.25rem'}}>
                  <div style={{padding:'12px 16px',borderBottom:`1px solid ${bdr}`,background:'#fafafa',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:6}}>
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
                <span id="apply-toast" style={{fontSize:11,color:'#10b981',transition:'opacity .3s',opacity:0}}>✓ Aplicat</span>
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
                            {['1 s','1 I','Toate'].map(f=><span key={f} style={{fontSize:10,color:txtSub,padding:'1px 6px',borderRadius:3,border:`1px solid ${bdr}`,cursor:'pointer',background:'#f9fafb'}}>{f}</span>)}
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
                <div style={{padding:'12px 16px',borderBottom:`1px solid ${bdr}`,display:'flex',justifyContent:'space-between',alignItems:'center',background:'#fafafa'}}>
                  <span style={{fontSize:13,fontWeight:600,color:txt}}>{dt.chartSummary||'Sumar statistici'}</span>
                  <select style={{...inp,fontSize:12}}>
                    <option>{({'ro':'Ieri','ru':'Вчера','en':'Yesterday','tr':'Dün','de':'Gestern','pt':'Ontem','pl':'Wczoraj'})[lang]||'Ieri'}</option><option>Azi</option><option>Săptămâna</option>
                  </select>
                </div>
                <div style={{overflowX:'auto'}}>
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
                      <tr style={{background:'#fafafa'}}>
                        <td colSpan={10} style={{...TD,fontStyle:'italic',color:txtSub,fontSize:11,textAlign:'center'}}>Fără informații pentru perioada selectată</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
            const theCode = (myCode||gen) ? (myCode?myCode.code:gen.code) : null
            return (
            <div>
              {/* Strip taburi cazinouri — comutare rapidă */}
              <div style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:6,marginBottom:'1.25rem',WebkitOverflowScrolling:'touch'}}>
                {CASINOS.map(x=>{
                  const sel = x.id===cid
                  return (
                    <button key={x.id} onClick={()=>{setSelectedCasino(x.id);setGeneratedCode(null)}}
                      style={{display:'flex',alignItems:'center',gap:7,padding:'8px 14px',borderRadius:9,cursor:'pointer',fontFamily:'inherit',fontSize:13,fontWeight:700,whiteSpace:'nowrap',flexShrink:0,
                        border: sel?('2px solid '+x.color):('1px solid '+bdr),
                        background: sel?(x.color+'15'):'#fff',
                        color: sel?x.color:txt}}>
                      <span style={{fontSize:16}}>{x.logo}</span>{x.name}
                      {x.comingSoon && <span style={{fontSize:9,fontWeight:700,padding:'2px 6px',borderRadius:8,background:'#f1f5f9',color:'#94a3b8'}}>curând</span>}
                    </button>
                  )
                })}
              </div>

              {/* Header brand cazino */}
              <div style={{background:('linear-gradient(135deg,'+accent+'1f,'+accent+'08)'),border:('1px solid '+accent+'44'),borderLeft:('5px solid '+accent),borderRadius:12,padding:isMobile?'16px':'20px 24px',marginBottom:'1.5rem',display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
                <div style={{width:56,height:56,borderRadius:14,background:(accent+'22'),display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,flexShrink:0}}>{c.logo}</div>
                <div style={{flex:1,minWidth:180}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
                    <div style={{fontSize:22,fontWeight:900,color:txt}}>{c.name}</div>
                    {c.comingSoon
                      ? <span style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:12,background:'#fef3c7',color:'#92400e'}}>În curând</span>
                      : <span style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:12,background:'#dcfce7',color:'#16a34a'}}>Activ</span>}
                  </div>
                  <div style={{fontSize:13,color:accent,fontWeight:700,marginTop:3}}>{c.commission}</div>
                  <div style={{fontSize:12,color:txtSub,marginTop:4}}>{c.description}</div>
                </div>
                <div style={{textAlign:'right',fontSize:12,color:txtSub,lineHeight:1.7}}>
                  <div>Plată: <b style={{color:txt}}>{c.payFreq}</b></div>
                  <div>Min: <b style={{color:txt}}>{c.minPayout}</b></div>
                  <div>Geo: <b style={{color:txt}}>{c.geo}</b></div>
                </div>
              </div>

              {/* Statistici cazino */}
              <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:12,marginBottom:'1.5rem'}}>
                {[
                  ['Înregistrări', c.stats.regs||0, txt],
                  ['Depunători', c.stats.deposits||0, '#3b82f6'],
                  ['Venit generat', '$'+(c.stats.revenue||0).toLocaleString(), '#8b5cf6'],
                  ['Comisionul meu', '$'+(c.stats.commission||0).toLocaleString(), '#10b981'],
                ].map(([l,v,col])=>(
                  <div key={l} style={{...card,borderBottom:('3px solid '+accent),textAlign:'center',padding:'16px 10px'}}>
                    <div style={{fontSize:isMobile?22:26,fontWeight:900,color:col}}>{v}</div>
                    <div style={{fontSize:10,color:txtSub,textTransform:'uppercase',letterSpacing:'.05em',marginTop:4}}>{l}</div>
                  </div>
                ))}
              </div>

              {c.comingSoon ? (
                /* Cazino neaprobat încă — cerere de acces */
                <div style={{...card,padding:0,overflow:'hidden',marginBottom:'1.5rem'}}>
                  <div style={{background:(accent+'12'),padding:'14px 20px',borderBottom:('1px solid '+bdr),fontWeight:700,fontSize:14,color:txt}}>Vrei să promovezi {c.name}?</div>
                  <div style={{padding:'20px 24px'}}>
                    <p style={{fontSize:13,color:txtSub,lineHeight:1.7,marginBottom:16}}>
                      Lucrăm la activarea afilierii cu <b style={{color:txt}}>{c.name}</b>. Trimite o cerere acum — apari pe lista de așteptare și ești printre primii care primesc cod imediat ce afilierea e aprobată. Te anunțăm pe Telegram.
                    </p>
                    {reqSent ? (
                      <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'#f0fdf4',border:'1px solid #86efac',borderRadius:8,padding:'10px 16px',fontSize:13,color:'#15803d',fontWeight:600}}>
                        ✓ Cerere trimisă{reqSent.date?(' pe '+reqSent.date):''} — ești pe lista de așteptare
                      </div>
                    ) : (
                      <button onClick={()=>setShowCasinoRequest(cid)} style={{...btnPrimary,padding:'12px 26px',fontSize:14,background:accent,borderColor:accent}}>
                        📩 Vreau să lucrez cu {c.name}
                      </button>
                    )}
                  </div>
                </div>
              ) : myCode ? (
                /* Are cod — afișează cod + link */
                <div style={{...card,padding:0,overflow:'hidden',marginBottom:'1.5rem'}}>
                  <div style={{background:(accent+'12'),padding:'14px 20px',borderBottom:('1px solid '+bdr),fontWeight:700,fontSize:14,color:txt}}>Codul tău {c.name}</div>
                  <div style={{padding:'20px 24px'}}>
                    <div style={{background:'#f0fdf4',border:'1px solid #86efac',borderRadius:8,padding:'16px 20px',marginBottom:12}}>
                      <div style={{fontSize:11,color:'#16a34a',fontWeight:600,marginBottom:6,textTransform:'uppercase',letterSpacing:'.06em'}}>🎟 Cod promoțional — spune-l în video</div>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
                        <div style={{fontSize:30,fontWeight:900,color:'#15803d',fontFamily:'monospace',letterSpacing:3}}>{myCode.code}</div>
                        <button onClick={()=>copy(myCode.code,'cw_code')} style={{...btnPrimary,padding:'8px 18px',fontSize:13}}>{copied==='cw_code'?'✓ Copiat!':'📋 Copiază'}</button>
                      </div>
                      <div style={{fontSize:12,color:'#16a34a',marginTop:6}}>Jucătorul îl introduce la înregistrare pe {c.name} → tu primești {c.commissionPct}% din pierderile lui.</div>
                    </div>
                    {c.id==='melbet' && (
                      <div style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:8,padding:'16px 20px',marginBottom:12}}>
                        <div style={{fontSize:11,color:'#1d4ed8',fontWeight:600,marginBottom:6,textTransform:'uppercase',letterSpacing:'.06em'}}>🔗 Link de afiliat — pune în bio, stories, descriere</div>
                        <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
                          <div style={{flex:1,minWidth:200,fontFamily:'monospace',fontSize:12,color:'#1d4ed8',background:'#dbeafe',padding:'8px 10px',borderRadius:6,wordBreak:'break-all',lineHeight:1.5}}>{getMelbetPlayerLink(myCode.code)}</div>
                          <button onClick={()=>copy(getMelbetPlayerLink(myCode.code),'cw_link')} style={{...btnPrimary,padding:'8px 16px',fontSize:13,background:'#2563eb'}}>{copied==='cw_link'?'✓':'📋 Copiază'}</button>
                        </div>
                      </div>
                    )}
                    <button onClick={()=>setShowCustomCode(true)} style={{...btnOutline(accent),padding:'9px 20px',fontSize:13}}>✨ Vreau cod personalizat cu numele meu</button>
                  </div>
                </div>
              ) : gen ? (
                gen.error ? (
                  <div style={{...card,textAlign:'center',padding:'24px',marginBottom:'1.5rem'}}>
                    <div style={{fontSize:14,color:'#dc2626',fontWeight:600,marginBottom:4}}>⚠️ Momentan nu sunt coduri disponibile</div>
                    <div style={{fontSize:12,color:txtSub}}>Contactează managerul pentru alocare manuală.</div>
                  </div>
                ) : (
                  <div style={{...card,textAlign:'center',padding:'24px',marginBottom:'1.5rem'}}>
                    <div style={{fontSize:11,color:'#16a34a',fontWeight:600,marginBottom:6,textTransform:'uppercase',letterSpacing:'.08em'}}>✅ Codul tău {c.name}</div>
                    <div style={{fontSize:30,fontWeight:900,color:'#15803d',fontFamily:'monospace',letterSpacing:4,marginBottom:8}}>{gen.code}</div>
                    <div style={{fontSize:12,color:'#16a34a',marginBottom:12}}>@{gen.bloggerUsername}</div>
                    <button onClick={()=>copy(gen.code,'cw_code')} style={{...btnPrimary,padding:'10px 20px',fontSize:13}}>{copied==='cw_code'?'✓ Copiat!':'📋 Copiază codul'}</button>
                  </div>
                )
              ) : (
                /* Activ fără cod — generează */
                <div style={{...card,padding:'24px',marginBottom:'1.5rem'}}>
                  <div style={{fontSize:15,fontWeight:700,color:txt,marginBottom:8}}>Generează-ți codul {c.name}</div>
                  <p style={{fontSize:13,color:txtSub,marginBottom:16,lineHeight:1.6}}>Codul va fi asociat contului <b>@{D.username}</b> și câștigi <b style={{color:accent}}>{c.commissionPct}%</b> din pierderile jucătorilor care îl folosesc.</p>
                  <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                    <button onClick={()=>generatePromoCode(cid)} disabled={codeGenerating} style={{...btnPrimary,padding:'12px 28px',fontSize:14,background:accent,borderColor:accent,opacity:codeGenerating?0.7:1,cursor:codeGenerating?'wait':'pointer'}}>{codeGenerating?'⏳ Se atribuie...':'🎁 Generează Cod Promoțional'}</button>
                    <button onClick={()=>setShowCustomCode(true)} style={{...btnOutline(accent),padding:'12px 20px',fontSize:13}}>✨ Cod personalizat</button>
                  </div>
                </div>
              )}

              {/* Cum promovezi — doar pentru active cu cod */}
              {!c.comingSoon && theCode && (
                <div style={{background:'#fefce8',border:'1px solid #fde047',borderRadius:8,padding:'14px 18px',fontSize:12.5,color:'#854d0e',lineHeight:1.8}}>
                  <strong>💡 Cum promovezi {c.name}:</strong><br/>
                  • <strong>Bio TikTok/Instagram:</strong> pune linkul/codul → „Înregistrează-te pe {c.name}"<br/>
                  • <strong>În video/stories:</strong> „Folosiți codul <strong>{theCode}</strong> la înregistrare"<br/>
                  • <strong>Descriere YouTube:</strong> link + cod în descriere
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
                <div style={{fontSize:14,fontWeight:700,color:gold,marginBottom:8}}>📋 Structura ta de comision: RS25% + REF3%</div>
                <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:12}}>
                  <div style={{fontSize:12,color:txtSub,lineHeight:1.7}}>
                    <b style={{color:txt}}>Revenue Share 25%</b> — primești 25% din pierderile nete ale jucătorilor recomandați de tine, pe toată durata activității lor pe platforma Melbet.
                  </div>
                  <div style={{fontSize:12,color:txtSub,lineHeight:1.7}}>
                    <b style={{color:'#10b981'}}>Referral 3%</b> — dacă inviți un alt blogger în WinPartners, primești 3% din comisionul lui lunar, pe viață. Copiază linkul de referral din tab-ul "Link-uri Afiliați".
                  </div>
                </div>
              </div>
              <div style={{marginBottom:'0.75rem'}}><select style={{...inp,fontSize:12,padding:'6px 12px'}}><option>6 articole selectate ▼</option></select></div>
              <div style={{...card,padding:0,overflow:'hidden'}}>
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',minWidth:450}}>
                    <thead><tr>{[dt.thCur+' ↕',dt.thStruct+' ↕',dt.thGroup+' ↕',dt.thStart+' ↕',dt.thDesc+' ↕',dt.thEnd+' ↕'].map(h=><th key={h} style={{...TH,cursor:'pointer'}}>{h}</th>)}</tr></thead>
                    <tbody>{D.commStructure.map((r,i)=>(
                      <tr key={i} style={{background:i%2===0?'#fff':'#fafafa'}}>
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
                <div style={{padding:'10px 16px',fontSize:12,color:txtSub,borderTop:`1px solid ${bdr}`,background:'#fafafa'}}>{dt.tblShow} {D.commStructure.length} ({D.commStructure.length} {dt.tblTotal})</div>
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
                    <div style={{fontSize:12,color:txtSub,lineHeight:1.6}}>Primești <b style={{color:txt}}>25%</b> din pierderile jucătorilor tăi + <b style={{color:'#10b981'}}>3% bonus</b> din câștigurile oricărui blogger pe care îl inviți tu în program — pe viață.</div>
                  </div>
                </div>
                <div style={{background:'linear-gradient(135deg,rgba(167,139,250,0.12),rgba(167,139,250,0.04))',border:'1px solid rgba(167,139,250,0.3)',borderRadius:10,padding:'14px 18px',display:'flex',gap:12,alignItems:'flex-start'}}>
                  <div style={{fontSize:24,flexShrink:0}}>📅</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:'#a78bfa',marginBottom:4}}>Plăți săptămânale automate</div>
                    <div style={{fontSize:12,color:txtSub,lineHeight:1.6}}>{({'ro':'Suma minimă de retragere: ','ru':'Минимальная сумма вывода: ','en':'Minimum withdrawal: ','tr':'Minimum çekim: ','de':'Mindestauszahlung: ','pt':'Levantamento mínimo: ','pl':'Minimalna wypłata: '})[lang]}<b style={{color:txt}}>$30/{({'ro':'săptămână','ru':'неделю','en':'week','tr':'hafta','de':'Woche','pt':'semana','pl':'tydzień'})[lang]}</b></div>
                  </div>
                </div>
              </div>
              <div style={filterRow}>
                <span style={{fontSize:13,color:txtSub}}>{({'ro':'Valută','ru':'Валюта','en':'Currency','tr':'Para birimi','de':'Währung','pt':'Moeda','pl':'Waluta'})[lang]||'Valută'}</span>
                <select style={inp}><option>USD</option></select>
                <span style={{fontSize:13,color:txtSub}}>{({'ro':'Perioada','ru':'Период','en':'Period','tr':'Dönem','de':'Zeitraum','pt':'Período','pl':'Okres'})[lang]||'Perioada'}</span>
                <select style={inp}><option>{({'ro':'Perioada exactă','ru':'Точный период','en':'Exact period','tr':'Tam dönem','de':'Genauer Zeitraum','pt':'Período exato','pl':'Dokładny okres'})[lang]||'Perioada exactă'}</option></select>
                <input type="date" style={inp} defaultValue="2026-06-13"/>
                <span style={{color:txtSub}}>→</span>
                <input type="date" style={inp} defaultValue="2026-06-13"/>
                <button style={btnPrimary} onClick={()=>showToast("📊 Funcție disponibilă în curând")}>GENERAȚI RAPORT</button>
              </div>
              <div style={{display:'flex',gap:0,marginBottom:'1rem',borderBottom:`2px solid ${bdr}`}}>
                {['Statusul solicitărilor','Istoricul plăților'].map((t,i)=>(
                  <button key={t} onClick={()=>setPayTab(i===0?'status':'history')} style={payTab===(i===0?'status':'history')?tabActive:tabInactive}>{t}</button>
                ))}
                <div style={{flex:1}}/>
                <button style={{...btnOutline('#ef4444'),marginBottom:2,fontSize:12}} onClick={()=>showToast("📁 Export disponibil în curând")}>EXPORT ▼</button>
              </div>
              <div style={{marginBottom:'0.75rem'}}><select style={{...inp,fontSize:12}}><option>6 articole selectate ▼</option></select></div>
              <div style={{...card,padding:0,overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',minWidth:500}}>
                  <thead><tr>{[dt.thCur+' ↕',dt.thDate+' ↕',dt.thPay+' ↕',dt.thRev+' ↕',dt.thBal+' ↕',dt.thStatus+' ↕'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>
                    {payTab==='history'&&D.pays.map((p,i)=>(
                      <tr key={i} style={{background:i%2===0?'#fff':'#fafafa'}}>
                        <td style={TD}>USD</td>
                        <td style={TD}>{p.dt}</td>
                        <td style={{...TD,color:'#10b981',fontWeight:600}}>${p.am}</td>
                        <td style={TD}>${p.venituri}</td>
                        <td style={TD}>${p.sold}</td>
                        <td style={TD}><span style={{background:'#d1fae5',color:'#065f46',padding:'2px 8px',borderRadius:12,fontSize:11,fontWeight:600}}>{p.st}</span></td>
                      </tr>
                    ))}
                    {payTab==='status'&&<tr><td colSpan={6} style={{...TD,textAlign:'center',color:txtSub,padding:'24px',fontStyle:'italic'}}>Fără solicitări active</td></tr>}
                  </tbody>
                </table>
                <div style={{padding:'10px 16px',fontSize:12,color:txtSub,borderTop:`1px solid ${bdr}`,background:'#fafafa'}}>{dt.tblShow} {D.pays.length}</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:12}}>
                <div style={card}>
                  <p style={{fontSize:13,color:txtSub,lineHeight:1.7,marginBottom:8}}>{({'ro':'Câștigurile se acumulează automat pe măsură ce jucătorii tăi joacă. Când soldul ajunge la $30, soliciți plata mai jos — o procesăm săptămânal pe metoda ta preferată.','ru':'Доход накапливается автоматически по мере игры ваших игроков. Когда баланс достигнет $30, запросите выплату ниже — мы обрабатываем её еженедельно удобным вам способом.','en':'Earnings accumulate automatically as your players play. When your balance reaches $30, request a payout below — we process it weekly via your preferred method.','tr':'Oyuncularınız oynadıkça kazançlar otomatik birikir. Bakiyeniz $30 olunca aşağıdan ödeme talep edin — tercih ettiğiniz yöntemle haftalık işleriz.','de':'Die Einnahmen sammeln sich automatisch an, während Ihre Spieler spielen. Bei $30 Guthaben fordern Sie unten eine Auszahlung an — wir bearbeiten sie wöchentlich über Ihre bevorzugte Methode.','pt':'Os ganhos acumulam-se automaticamente à medida que os seus jogadores jogam. Quando o saldo atingir $30, solicite o pagamento abaixo — processamos semanalmente pelo método preferido.','pl':'Zarobki kumulują się automatycznie w miarę gry Twoich graczy. Gdy saldo osiągnie $30, poproś o wypłatę poniżej — przetwarzamy ją tygodniowo wybraną metodą.'})[lang]||'Câștigurile se acumulează automat. Când soldul ajunge la $30, soliciți plata mai jos.'}</p>
                  <p style={{fontSize:13,fontWeight:600,color:txt,marginBottom:12}}>{({'ro':'Suma minimă de plată este de $30 pe săptămână','ru':'Минимальная сумма выплаты $30 в неделю','en':'Minimum payment amount is $30 per week','tr':'Minimum ödeme tutarı haftada $30','de':'Mindestauszahlungsbetrag beträgt $30 pro Woche','pt':'O valor mínimo de pagamento é $30 por semana','pl':'Minimalna kwota płatności to $30 tygodniowo'})[lang]}</p>
                  <button style={btnPrimary} onClick={()=>setShowPay(true)}>{({'ro':'Solicită plată','ru':'Запросить выплату','en':'Request payment','tr':'Ödeme talep et','de':'Zahlung anfordern','pt':'Solicitar pagamento','pl':'Zażądaj płatności'})[lang]||'Solicită plată'} → ${D.bal.available}</button>
                </div>
                <div style={card}>
                  <p style={{fontSize:13,color:txtSub,lineHeight:1.7}}>Contactați managerii noștri prin <span style={{color:gold,cursor:'pointer',fontWeight:600}}>datele de contact</span> disponibile pe site.</p>
                </div>
              </div>
            </div>
          )}

          {/* === CONT === */}
          {page==='account'&&(
            <div>
              <div style={{fontSize:13,marginBottom:'1rem',color:txtSub}}>Utilizator: <span style={{color:gold,fontWeight:600}}>@{D.username}</span></div>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr 1fr',gap:16}}>
                <div style={card}>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:14,color:txt,paddingBottom:8,borderBottom:`1px solid ${bdr}`}}>Informații de contact</div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
                    <div><label style={label}>Prenume</label><input style={{...inp,width:'100%',boxSizing:'border-box'}} value={(D.name||'').split(' ')[0]||''} readOnly/></div>
                    <div><label style={label}>Nume</label><input style={{...inp,width:'100%',boxSizing:'border-box'}} value={(D.name||'').split(' ').slice(1).join(' ')} readOnly/></div>
                  </div>
                  <div style={{marginBottom:8}}><label style={label}>Număr de telefon</label><input style={{...inp,width:'100%',boxSizing:'border-box'}} value={D.phone||''} readOnly/></div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
                    <div><label style={label}>Platformă</label><input style={{...inp,width:'100%',boxSizing:'border-box'}} value={D.platform||''} readOnly/></div>
                    <div><label style={label}>Țară</label><input style={{...inp,width:'100%',boxSizing:'border-box'}} value={D.country||''} readOnly/></div>
                  </div>
                  <div style={{fontSize:11,color:txtSub}}>pentru a modifica datele de contact, contactați managerul dvs.</div>
                </div>
                <div style={card}>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:14,color:txt,paddingBottom:8,borderBottom:`1px solid ${bdr}`}}>Detaliile plății</div>
                  <div style={{marginBottom:8}}><label style={label}>{({'ro':'Metoda de plată preferată','ru':'Предпочтительный метод оплаты','en':'Preferred payment method','tr':'Tercih edilen ödeme yöntemi','de':'Bevorzugte Zahlungsmethode','pt':'Método de pagamento preferido','pl':'Preferowana metoda płatności'})[lang]}</label><input style={{...inp,width:'100%',boxSizing:'border-box'}} value={D.payMethod||'Bitcoin'} readOnly/></div>
                  <div style={{marginBottom:12}}><label style={label}>Numărul portofelului</label><input style={{...inp,width:'100%',boxSizing:'border-box',fontFamily:'monospace',fontSize:11}} value={D.payAddress||''} readOnly placeholder={({'ro':'necompletat','ru':'не указан','en':'not set','tr':'belirtilmemiş','de':'nicht angegeben','pt':'não definido','pl':'nie ustawiono'})[lang]||'necompletat'}/></div>
                  <div style={{fontSize:11,color:txtSub,marginBottom:16}}>* pentru a modifica detaliile de plată, contactați Asistența Pentru Parteneri.</div>
                  <div style={{borderTop:`1px solid ${bdr}`,paddingTop:12}}>
                    <div style={{fontSize:13,fontWeight:600,color:txt,marginBottom:8}}>Abonamente</div>
                    <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:13,color:txtSub}}>
                      <input type="checkbox" defaultChecked style={{accentColor:gold}}/> Informațiile companiei
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
                    <div style={{fontSize:13,fontWeight:600,color:txt,marginBottom:6}}>Gestionarea autentificării cu doi factori</div>
                    <div style={{fontSize:12,color:txtSub}}>Google Authenticator activat: <span style={{color:'#ef4444',fontWeight:600}}>Nu</span></div>
                  </div>
                  <div style={{borderTop:`1px solid ${bdr}`,paddingTop:12,marginTop:12}}>
                    <div style={{fontSize:13,fontWeight:600,color:txt,marginBottom:4}}>Confirmarea adresei de e-mail</div>
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
                {[['Valută','select',['USD']],['Tip media','select',['Banner','Video']],['Limbă','select',['Română','Rusă','Engleză']],['Lățime','number','100'],['Înălțime','number','100'],['Campanie','select',['English']]].map(([l,type,opts])=>(
                  <div key={l} style={{display:'flex',alignItems:'center',gap:5}}>
                    <span style={{fontSize:13,color:txtSub,whiteSpace:'nowrap'}}>{l}</span>
                    {type==='select'?<select style={inp}><option>Selectare...</option></select>:<input type="number" style={{...inp,width:70}} placeholder={opts}/>}
                  </div>
                ))}
                <button style={btnPrimary} onClick={()=>showToast("🔍 Funcție de căutare disponibilă în curând")}>CĂUTARE</button>
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
                <span style={{fontSize:13,color:txtSub}}>Site web</span>
                <select style={{...inp,width:150}}><option>Toate</option></select>
                {page==='summary'&&<><span style={{fontSize:13,color:txtSub}}>ID instrument</span><input style={{...inp,width:120}} placeholder=""/></>}
                <span style={{fontSize:13,color:txtSub}}>{({'ro':'Perioada','ru':'Период','en':'Period','tr':'Dönem','de':'Zeitraum','pt':'Período','pl':'Okres'})[lang]||'Perioada'}</span>
                <select style={{...inp,width:130}}><option>{({'ro':'Perioada exactă','ru':'Точный период','en':'Exact period','tr':'Tam dönem','de':'Genauer Zeitraum','pt':'Período exato','pl':'Dokładny okres'})[lang]||'Perioada exactă'}</option></select>
                <input type="date" style={inp} defaultValue="2026-06-13"/>
                <span style={{color:txtSub}}>→</span>
                <input type="date" style={inp} defaultValue="2026-06-13"/>
                <button style={btnPrimary} onClick={()=>showToast("📊 Funcție disponibilă în curând")}>GENERAȚI RAPORT</button>
              </div>
              <div style={{...card,padding:0,overflow:'hidden'}}>
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',minWidth:600}}>
                    <thead><tr>
                      {(page==='summary'
                        ?['Vizualizări','Clickuri','Linkuri directe','Click/Vizualizări','Înregistrări','Înreg./Clickuri','Înreg. cu depuneri','Suma noilor depuneri','Depunători noi','Conturi cu depuneri','Suma depuneri','Venituri','Nr. depuneri','Jucători activi','Media profit/jucător','Suma bonus','Total comision RS','CPA','Suma comisionului','Comision sub-afiliați']
                        :['Data','Valută','Clickuri','Înregistrări','Depunători noi','Venituri','Suma comisionului']
                      ).map(h=><th key={h} style={TH}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {page==='report'&&D.daily.map((r,i)=>(
                        <tr key={r.d} style={{background:i%2===0?'#fff':'#fafafa'}}>
                          <td style={TD}>{r.d}</td><td style={TD}>USD</td>
                          <td style={TD}>{r.cl}</td><td style={TD}>{r.rg}</td>
                          <td style={TD}>{r.dp}</td><td style={TD}>${r.rv}</td>
                          <td style={{...TD,color:'#10b981',fontWeight:700}}>{r.rv>0?'$'+Math.round(r.rv*.2):'—'}</td>
                        </tr>
                      ))}
                      {page==='summary'&&(
                        <tr>
                          {['0','0','0','0','0','0','0','$0','0','0','$0','$0','0','0','$0','$0','$0','0','$'+totComm,'$0'].map((v,i)=>(
                            <td key={i} style={{...TD,background:i%2===0?'#fffbf0':'#fff',color:i===18?'#10b981':txt}}>{v}</td>
                          ))}
                        </tr>
                      )}
                      <tr style={{background:'#fafafa'}}><td colSpan={20} style={{...TD,fontStyle:'italic',color:txtSub,textAlign:'center',padding:'16px'}}>Fără informații pentru perioada selectată</td></tr>
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
                <span style={{fontSize:13,color:txtSub}}>Site web</span><select style={{...inp,width:150}}><option>Toate</option></select>
                <span style={{fontSize:13,color:txtSub}}>Jucător</span><input style={{...inp,width:120}} placeholder="ID jucător"/>
                <span style={{fontSize:13,color:txtSub}}>Perioada</span><select style={inp}><option>1 lună</option></select>
                <button style={btnPrimary} onClick={()=>showToast("📊 Funcție disponibilă în curând")}>GENERAȚI RAPORT</button>
              </div>
              <div style={{...card,padding:0,overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',minWidth:450}}>
                  <thead><tr>{['Jucător','Data înregistrării','Prima depunere','Numărul de depuneri','Suma depunerilor','Venituri','Comisionul meu'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody><tr><td colSpan={7} style={{...TD,textAlign:'center',color:txtSub,padding:'24px',fontStyle:'italic'}}>Fără informații pentru perioada selectată</td></tr></tbody>
                </table>
              </div>
            </div>
          )}

          {/* === SUB-AFILIATI === */}
          {page==='subaff'&&(
            <div>
              <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:8,padding:'14px 16px',marginBottom:'1.25rem'}}>
                <div style={{fontSize:13,fontWeight:600,color:'#065f46',marginBottom:5}}>💰 Câștigă 3% din comisioanele bloggerilor pe care îi inviți — pe viață!</div>
                <div style={{fontFamily:'monospace',fontSize:12,color:'#047857',background:'rgba(0,0,0,0.04)',padding:'6px 10px',borderRadius:4,marginBottom:8,wordBreak:'break-all'}}>{refLink}</div>
                <button style={btnPrimary} onClick={()=>copy(refLink,'ref')}>{copied==='ref'?'✓ Copiat!':'Copiează linkul de referral'}</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:12,marginBottom:'1.25rem'}}>
                {[['Bloggeri invitați',myReferrals.length,'#3b82f6'],['Total câștigat','$'+myReferrals.reduce((s,r)=>s+(r.cm||0),0).toFixed(2),'#10b981'],['Comision referral','3%',gold]].map(([l,v,c])=>(
                  <div key={l} style={{...card,textAlign:'center'}}>
                    <div style={{fontSize:11,color:txtSub,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:5}}>{l}</div>
                    <div style={{fontSize:24,fontWeight:800,color:c}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={filterRow}>
                <span style={{fontSize:13,color:txtSub}}>{({'ro':'Valută','ru':'Валюта','en':'Currency','tr':'Para birimi','de':'Währung','pt':'Moeda','pl':'Waluta'})[lang]||'Valută'}</span><select style={inp}><option>USD</option></select>
                <span style={{fontSize:13,color:txtSub}}>Perioada</span><select style={inp}><option>1 lună</option></select>
                <button style={btnPrimary} onClick={()=>showToast("📊 Funcție disponibilă în curând")}>GENERAȚI RAPORT</button>
              </div>
              <div style={{...card,padding:0,overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',minWidth:450}}>
                  <thead><tr>{[dt.thBlogger,dt.thPlatform,dt.thRegDate,dt.thRegsBrought,dt.thHisEarnings,dt.thMyComm].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>{myReferrals.length===0?(
                    <tr><td colSpan={6} style={{...TD,textAlign:'center',color:txtSub,padding:'24px',fontStyle:'italic'}}>
                      Niciun blogger invitat încă. Copiază linkul de referral și trimite-l colegilor tăi bloggeri!
                    </td></tr>
                  ):myReferrals.map((r,i)=>(
                    <tr key={r.name} style={{background:i%2===0?'#fff':'#fafafa'}}>
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

          {page==='contact'&&(
            <div style={{...card,maxWidth:440}}>
              {[['Email','support@winpartners.pro'],['Telegram','@winpartners_manager'],['Program','24/7, 365 zile/an']].map(([l,v])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:`1px solid ${bdr}`}}>
                  <span style={{fontSize:13,color:txtSub,fontWeight:500}}>{l}</span>
                  <span style={{fontSize:13,color:gold,fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* PAY MODAL */}
      {showPay&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:'1rem'}} onClick={()=>setShowPay(false)}>
          <div style={{...card,width:'100%',maxWidth:380,boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}} onClick={e=>e.stopPropagation()}>
            {paySent?(
              <div style={{textAlign:'center',padding:'1rem'}}>
                <div style={{fontSize:40,marginBottom:10}}>✅</div>
                <h3 style={{fontWeight:700,marginBottom:6,fontSize:16,color:txt}}>Cerere trimisă!</h3>
                <p style={{color:txtSub,fontSize:13,marginBottom:8,lineHeight:1.6}}>
                  Cererea ta de plată a fost înregistrată. Suma va fi procesată în <strong>48 ore</strong> pe adresa ta {payMethod}.
                </p>
                <div style={{background:'#fef9c3',border:'1px solid #fde047',borderRadius:6,padding:'8px 12px',fontSize:12,color:'#854d0e',marginBottom:16}}>
                  💡 Primești notificare pe WhatsApp când plata e confirmată.
                </div>
                <button style={btnPrimary} onClick={()=>{setShowPay(false);setPaySent(false)}}>{({'ro':'Închide','ru':'Закрыть','en':'Close','tr':'Kapat','de':'Schließen','pt':'Fechar','pl':'Zamknij'})[lang]||'Închide'}</button>
              </div>
            ):(
              <>
                <div style={{fontSize:15,fontWeight:700,color:txt,marginBottom:4}}>{({'ro':'Solicită plată comisioane','ru':'Запросить выплату комиссий','en':'Request commission payment','tr':'Komisyon ödemesi talep et','de':'Provisionszahlung anfordern','pt':'Solicitar pagamento de comissões','pl':'Zażądaj wypłaty prowizji'})[lang]}</div>
                <div style={{background:'#f0fdf4',border:'1px solid #86efac',borderRadius:6,padding:'10px 14px',marginBottom:14,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontSize:11,color:txtSub,marginBottom:1}}>Disponibil pentru retragere</div>
                    <div style={{fontSize:22,fontWeight:900,color:'#15803d'}}>${D.bal.available}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:11,color:txtSub,marginBottom:1}}>Minim retragere</div>
                    <div style={{fontSize:14,fontWeight:700,color:txtSub}}>$30</div>
                  </div>
                </div>
                <label style={label}>Metodă de plată</label>
                <select style={{...inp,width:'100%',boxSizing:'border-box',marginBottom:10}} value={payMethod} onChange={e=>setPayMethod(e.target.value)}>
                  {['Bitcoin (BTC)','USDT (TRC20)','USDT (ERC20)','Ethereum (ETH)','Binance Pay','Skrill','Neteller'].map(m=><option key={m}>{m}</option>)}
                </select>
                <label style={label}>Adresa {payMethod}</label>
                <input style={{...inp,width:'100%',boxSizing:'border-box',marginBottom:6,fontFamily:'monospace',fontSize:12}}
                  placeholder={payMethod.includes('Bitcoin')?'bc1q...':payMethod.includes('TRC20')?'T...':payMethod.includes('Binance')?'ID Binance Pay...':'Adresa sau email'}
                  value={payAddr} onChange={e=>setPayAddr(e.target.value)}/>
                <div style={{background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:6,padding:'10px 12px',marginBottom:10,fontSize:12,color:txtSub}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <strong>{({'ro':'Primești integral:','ru':'Получаете полностью:','en':'You receive in full:','tr':'Tam alırsınız:','de':'Sie erhalten vollständig:','pt':'Recebe na totalidade:','pl':'Otrzymujesz w całości:'})[lang]||'Primești integral:'}</strong>
                    <strong style={{color:'#10b981',fontSize:16}}>${D.bal.available}</strong>
                  </div>
                  <div style={{fontSize:11,color:txtSub,marginTop:4}}>{({'ro':'Fără comisioane de procesare — primești 100% din sold.','ru':'Без комиссий за обработку — вы получаете 100% баланса.','en':'No processing fees — you receive 100% of your balance.','tr':'İşlem ücreti yok — bakiyenizin %100ünü alırsınız.','de':'Keine Bearbeitungsgebühren — Sie erhalten 100% Ihres Guthabens.','pt':'Sem taxas de processamento — recebe 100% do saldo.','pl':'Bez opłat za przetwarzanie — otrzymujesz 100% salda.'})[lang]||'Fără comisioane de procesare — primești 100% din sold.'}</div>
                </div>
                <div style={{fontSize:11,color:txtSub,marginBottom:10}}>
                  {({'ro':'Verifică adresa cu atenție. Tranzacțiile crypto sunt ireversibile.','ru':'Проверьте адрес тщательно. Крипто-транзакции необратимы.','en':'Check the address carefully. Crypto transactions are irreversible.','tr':'Adresi dikkatlice kontrol edin. Kripto işlemler geri alınamaz.','de':'Adresse sorgfältig prüfen. Krypto-Transaktionen sind unwiderruflich.','pt':'Verifique o endereço com atenção. Transações cripto são irreversíveis.','pl':'Sprawdź adres uważnie. Transakcje krypto są nieodwracalne.'})[lang]||'Verifică adresa cu atenție.'}
                </div>
                <button style={{...btnPrimary,width:'100%',padding:'11px',fontSize:14,borderRadius:6,opacity:(!payAddr||D.bal.available<30)?0.5:1}}
                  disabled={!payAddr||D.bal.available<30}
                  onClick={async ()=>{
                    if(payAddr&&D.bal.available>=30){
                      await addNotification({type:'pay_request',blogger:D.username,bloggerName:D.name,amount:D.bal.available,address:payAddr,method:payMethod,detail:`Cerere plată \$${D.bal.available} → ${payAddr}`})
                      setPaySent(true)
                    }
                  }}>
                  {D.bal.available<30?`${({'ro':'Minim $30 (ai','ru':'Минимум $30 (у вас','en':'Minimum $30 (you have','tr':'Minimum $30 (bakiyeniz','de':'Mindest $30 (Sie haben','pt':'Mínimo $30 (você tem','pl':'Minimum $30 (masz'})[lang]||'Minim $30 (ai'} $${D.bal.available})`  :({'ro':'Solicită plata →','ru':'Запросить выплату →','en':'Request payment →','tr':'Ödeme talep et →','de':'Zahlung anfordern →','pt':'Solicitar pagamento →','pl':'Zażądaj płatności →'})[lang]||'Solicită plata →'}
                </button>
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
                Trimite o cerere pentru a promova <strong>{casino?.name}</strong>. Echipa noastră îți va activa accesul și îți va aloca un cod promoțional dedicat.
              </p>
              <div style={{background:'#fef9c3',border:'1px solid #fde047',borderRadius:6,padding:'10px 14px',marginBottom:20,fontSize:12,color:'#854d0e'}}>
                ⏱ Procesare în 24-48 ore. Vei fi notificat pe email și WhatsApp.
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
                  showToast('✅ Cererea a fost trimisă! Te anunțăm în 24-48 ore.')
                }}
                style={{...btnPrimary,width:'100%',padding:'11px',fontSize:14,borderRadius:6}}>
                Trimite cererea
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
                <h3 style={{fontWeight:700,marginBottom:6,fontSize:16,color:txt}}>Cerere trimisă!</h3>
                <p style={{color:txtSub,fontSize:13,marginBottom:4}}>Managerul tău va procesa cererea pentru <strong style={{color:gold,fontFamily:'monospace'}}>{customCodeText||'codul tău'}</strong> în 24-48 ore.</p>
                <p style={{color:txtSub,fontSize:12,marginBottom:16}}>Vei fi notificat când codul este activat.</p>
                <button style={btnPrimary} onClick={()=>{setShowCustomCode(false);setCustomCodeSent(false)}}>{({'ro':'Închide','ru':'Закрыть','en':'Close','tr':'Kapat','de':'Schließen','pt':'Fechar','pl':'Zamknij'})[lang]||'Închide'}</button>
              </div>
            ):(
              <>
                <div style={{fontSize:15,fontWeight:700,color:txt,marginBottom:4}}>{dt.reqCustomTitle}</div>
                <p style={{color:txtSub,fontSize:13,marginBottom:16,lineHeight:1.5}}>
                  Vrei un cod cu numele tău? (ex: <span style={{fontFamily:'monospace',color:gold,fontWeight:700}}>IONEL23</span>, <span style={{fontFamily:'monospace',color:gold,fontWeight:700}}>VLAD_WIN</span>)<br/>
                  Managerul va face cererea la cazinou și îl activează în 24-48h.
                </p>
                <label style={label}>Cazinou</label>
                <select style={{...inp,width:'100%',boxSizing:'border-box',marginBottom:12}} value={customCasinoId} onChange={e=>setCustomCasinoId(e.target.value)}>
                  {CASINOS.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <label style={label}>Codul dorit (fără spații, litere și cifre)</label>
                <input
                  style={{...inp,width:'100%',boxSizing:'border-box',marginBottom:6,textTransform:'uppercase',fontFamily:'monospace',fontSize:16,fontWeight:700,letterSpacing:2}}
                  placeholder="IONEL23"
                  value={customCodeText}
                  onChange={e=>setCustomCodeText(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g,''))}
                  maxLength={20}
                />
                <div style={{fontSize:11,color:txtSub,marginBottom:16}}>Caractere permise: A-Z, 0-9, underscore (_)</div>
                <button
                  style={{...btnPrimary,width:'100%',padding:'11px',fontSize:14,borderRadius:6,opacity:customCodeText.length<3?0.5:1}}
                  disabled={customCodeText.length<3}
                  onClick={submitCustomRequest}>
                  Trimite cererea
                </button>
                <button style={{width:'100%',padding:'9px',fontSize:13,cursor:'pointer',border:`1px solid ${bdr}`,borderRadius:6,background:'none',color:txtSub,marginTop:8,fontFamily:'inherit'}} onClick={()=>setShowCustomCode(false)}>{({'ro':'Anulează','ru':'Отмена','en':'Cancel','tr':'İptal','de':'Abbrechen','pt':'Cancelar','pl':'Anuluj'})[lang]||'Anulează'}</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer - like Melbet */}
      <div style={{background:'#1e1e30',borderTop:'1px solid rgba(255,255,255,0.06)',padding:'12px 24px',display:'flex',alignItems:'center',gap:24,flexShrink:0}}>
        <div style={{display:'flex',gap:20,flex:1}}>
          {['Contacte','Știri','Politica de confidențialitate','Politica cookie'].map(l=>(
            <span key={l} style={{fontSize:11,color:'rgba(255,255,255,0.35)',cursor:'pointer'}}>{l}</span>
          ))}
        </div>
        <span style={{fontSize:11,color:'rgba(255,255,255,0.35)'}}>App for Android™</span>
        <span style={{fontSize:11,color:'rgba(255,255,255,0.2)'}}>Copyright © 2024-2026 WinPartners. Toate drepturile rezervate.</span>
      </div>
    </div>
  )
}
