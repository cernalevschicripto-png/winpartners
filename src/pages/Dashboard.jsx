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
  winbet:    [],
  spinmax:   [],
  luckydeal: [],
}

// getNextCode — înlocuit cu Firebase (async) în generatePromoCode
// Lăsat stub pentru compatibilitate
function getNextCode(casinoId, username) { return null }

// Datele bloggerului vin din Firebase/localStorage prin loginBlogger()

const MENU = [
  {id:'main',label:'Pagina principală',section:'MENIU PRINCIPAL',icon:'🏠'},
  {id:'sites',label:'Site-uri',section:'',icon:'🌐'},
  {id:'comm',label:'Structura comisionului',section:'',icon:'💲'},
  {id:'pays',label:'Istoricul plăților',section:'',icon:'💳'},
  {id:'account',label:'Cont',section:'',icon:'👤'},
  {id:'contact',label:'Contacte',section:'',icon:'✉️'},
  {id:'links',label:'Link-uri Afiliați',section:'LINK-URI DE TRACKING',icon:'🔗'},
  {id:'promo',label:'Coduri Promoționale',section:'',icon:'🎟'},
  {id:'media',label:'Media',section:'',icon:'📢'},
  {id:'cazinouri',label:'Cazinouri Partenere',section:'',icon:'🎰'},
  {id:'summary',label:'Rezumat',section:'RAPOARTE',icon:'📊'},
  {id:'report',label:'Raport complet',section:'',icon:'📋'},
  {id:'mkttools',label:'Instrumente de marketing',section:'',icon:'🛠'},
  {id:'players',label:'Raport despre jucători',section:'',icon:'👥'},
  {id:'subaff',label:'Bloggeri invitați',section:'',icon:'🌿'},
]

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
    description: 'Casino + sporturi · cel mai popular în Moldova și România',
    minPayout: '$30',
    payFreq: 'Săptămânal',
    affLink: 'https://melbetpartners.com',
    affId: '5666408',
  },
  {
    id: 'winbet',
    name: 'WinBet',
    logo: '🎰',
    color: '#e63946',
    commissionPct: 25,
    commission: '25% Revenue Share',
    description: 'În curând — înregistrare în progres',
    minPayout: '$30',
    payFreq: 'Săptămânal',
    comingSoon: true,
  },
  {
    id: 'spinmax',
    name: '1xBet',
    logo: '🎲',
    color: '#3b82f6',
    commissionPct: 25,
    commission: '25% Revenue Share',
    description: 'În curând — înregistrare în progres',
    minPayout: '$30',
    payFreq: 'Săptămânal',
    comingSoon: true,
  },
  {
    id: 'luckydeal',
    name: 'Mostbet',
    logo: '🃏',
    color: '#10b981',
    commissionPct: 25,
    commission: '25% Revenue Share',
    description: 'În curând — înregistrare în progres',
    minPayout: '$30',
    payFreq: 'Lunar',
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
  winbet:    ['WIN001','WIN002','WIN003','WIN004','WIN005','WIN006','WIN007','WIN008','WIN009','WIN010'],
  spinmax:   ['SPX001','SPX002','SPX003','SPX004','SPX005','SPX006','SPX007','SPX008','SPX009','SPX010'],
  luckydeal: ['LKD001','LKD002','LKD003','LKD004','LKD005','LKD006','LKD007','LKD008','LKD009','LKD010'],
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
  const D = {
    ...blogger,
    refCode: blogger.refCode || 'REF_' + blogger.username.toUpperCase(),
    affId: blogger.affId || 'WP-' + Math.floor(Math.random()*9000000+1000000),
    bal: {
      available: Math.max(0, Math.round((blogger.revenue||0)*((blogger.commission||25)/100)-(blogger.paid||0))),
      yesterday: 0, month: 0, days30: Math.round((blogger.revenue||0)*((blogger.commission||25)/100)), total: Math.round((blogger.revenue||0)*((blogger.commission||25)/100)),
    },
    daily:[],
    refs: [],
    pays: [],
    links:[{id:1,camp:'English',subid:'',page:'/live',link:'https://melbet.com/go/WP'+blogger.affId,shown:true}],
    commStructure:[{val:'USD',struct:'Revenue Share',group:'RS25% REF3%',start:'2026-06-02',desc:'Procent comision: 25%; Comision negativ: Da; Administrator: 0%',end:''}],
  }
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [page,setPage]=useState('main')
  const [passOld, setPassOld] = useState('')
  const [passNew, setPassNew] = useState('')
  const [passNew2, setPassNew2] = useState('')
  const [passMsg, setPassMsg] = useState('')
  const dashT = {
    ro: { oldPass:'Parola veche', newPass:'Parolă nouă', confirmPass:'Reintroduceți noua parolă', changeBtn:'MODIFICAȚI PAROLA', saveBtn:'SALVAȚI MODIFICĂRILE', passWrongOld:'❌ Parola veche este incorectă.', passNoMatch:'❌ Parolele noi nu coincid.', passShort:'❌ Parola trebuie să aibă cel puțin 6 caractere.', passFill:'❌ Completați toate câmpurile.', passOk:'✅ Parola a fost schimbată cu succes!', passErr:'❌ Eroare la salvare. Încearcă din nou.', contactInfo:'pentru a modifica datele de contact, contactați managerul dvs.' },
    ru: { oldPass:'Старый пароль', newPass:'Новый пароль', confirmPass:'Повторите новый пароль', changeBtn:'ИЗМЕНИТЬ ПАРОЛЬ', saveBtn:'СОХРАНИТЬ ИЗМЕНЕНИЯ', passWrongOld:'❌ Неверный старый пароль.', passNoMatch:'❌ Новые пароли не совпадают.', passShort:'❌ Пароль должен содержать не менее 6 символов.', passFill:'❌ Заполните все поля.', passOk:'✅ Пароль успешно изменён!', passErr:'❌ Ошибка сохранения. Попробуйте снова.', contactInfo:'для изменения контактных данных обратитесь к вашему менеджеру.' },
    en: { oldPass:'Old password', newPass:'New password', confirmPass:'Confirm new password', changeBtn:'CHANGE PASSWORD', saveBtn:'SAVE CHANGES', passWrongOld:'❌ Old password is incorrect.', passNoMatch:'❌ New passwords do not match.', passShort:'❌ Password must be at least 6 characters.', passFill:'❌ Please fill in all fields.', passOk:'✅ Password changed successfully!', passErr:'❌ Save error. Please try again.', contactInfo:'to modify contact details, contact your manager.' },
    tr: { oldPass:'Eski şifre', newPass:'Yeni şifre', confirmPass:'Yeni şifreyi onaylayın', changeBtn:'ŞİFREYİ DEĞİŞTİR', saveBtn:'DEĞİŞİKLİKLERİ KAYDET', passWrongOld:'❌ Eski şifre yanlış.', passNoMatch:'❌ Yeni şifreler uyuşmuyor.', passShort:'❌ Şifre en az 6 karakter olmalıdır.', passFill:'❌ Lütfen tüm alanları doldurun.', passOk:'✅ Şifre başarıyla değiştirildi!', passErr:'❌ Kaydetme hatası. Tekrar deneyin.', contactInfo:'iletişim bilgilerini değiştirmek için yöneticinizle iletişime geçin.' },
    de: { oldPass:'Altes Passwort', newPass:'Neues Passwort', confirmPass:'Neues Passwort bestätigen', changeBtn:'PASSWORT ÄNDERN', saveBtn:'ÄNDERUNGEN SPEICHERN', passWrongOld:'❌ Altes Passwort ist falsch.', passNoMatch:'❌ Neue Passwörter stimmen nicht überein.', passShort:'❌ Passwort muss mindestens 6 Zeichen lang sein.', passFill:'❌ Bitte alle Felder ausfüllen.', passOk:'✅ Passwort erfolgreich geändert!', passErr:'❌ Speicherfehler. Bitte erneut versuchen.', contactInfo:'um Kontaktdaten zu ändern, wenden Sie sich an Ihren Manager.' },
    pt: { oldPass:'Senha antiga', newPass:'Nova senha', confirmPass:'Confirmar nova senha', changeBtn:'ALTERAR SENHA', saveBtn:'GUARDAR ALTERAÇÕES', passWrongOld:'❌ Senha antiga incorreta.', passNoMatch:'❌ As novas senhas não coincidem.', passShort:'❌ A senha deve ter pelo menos 6 caracteres.', passFill:'❌ Por favor preencha todos os campos.', passOk:'✅ Senha alterada com sucesso!', passErr:'❌ Erro ao guardar. Tente novamente.', contactInfo:'para modificar os dados de contacto, contacte o seu gestor.' },
    pl: { oldPass:'Stare hasło', newPass:'Nowe hasło', confirmPass:'Potwierdź nowe hasło', changeBtn:'ZMIEŃ HASŁO', saveBtn:'ZAPISZ ZMIANY', passWrongOld:'❌ Stare hasło jest nieprawidłowe.', passNoMatch:'❌ Nowe hasła nie są zgodne.', passShort:'❌ Hasło musi mieć co najmniej 6 znaków.', passFill:'❌ Proszę wypełnić wszystkie pola.', passOk:'✅ Hasło zostało zmienione pomyślnie!', passErr:'❌ Błąd zapisu. Spróbuj ponownie.', contactInfo:'aby zmienić dane kontaktowe, skontaktuj się z menedżerem.' },
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

  const [selectedCasino, setSelectedCasino] = useState(null)
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
  const [customCasinoId, setCustomCasinoId] = useState('winbet')
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
  const [currency,setCurrency]=useState('USD')
  const [copied,setCopied]=useState('')
  const [showPay,setShowPay]=useState(false)
  const [showCode,setShowCode]=useState(false)
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
    <div style={{background:bg,minHeight:'100vh',color:txt,fontFamily:'"Inter",-apple-system,sans-serif',display:'flex',flexDirection:'column',fontSize:13,position:'relative'}}>
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
        <button style={{...btnPrimary,fontSize:11,padding:'6px 14px',borderRadius:20}}>↻ ACTUALIZARE STATISTICI</button>
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
          {MENU.map((m)=>(
            <div key={m.id}>
              {m.section&&<div style={{padding:'12px 14px 4px',fontSize:9,color:'rgba(255,255,255,0.25)',textTransform:'uppercase',letterSpacing:'.12em',fontWeight:600}}>{m.section}</div>}
              <div onClick={()=>setPage(m.id)} style={{display:'flex',alignItems:'center',gap:8,padding:'9px 14px 9px 16px',cursor:'pointer',fontSize:13,color:page===m.id?gold:'rgba(255,255,255,0.55)',background:page===m.id?'rgba(245,166,35,0.1)':'none',borderLeft:page===m.id?`3px solid ${gold}`:'3px solid transparent',transition:'all .12s'}}>
                <span style={{fontSize:14}}>{m.icon}</span>
                <span>{m.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN CONTENT - light white background like Melbet */}
        <div style={{flex:1,overflowY:'auto',padding:isMobile?'1rem 0.75rem':'1.5rem',minWidth:0}}>

          {/* PAGE TITLE */}
          {/* Page title bar - like Melbet's yellow title */}
          <div style={{display:'flex',alignItems:'center',gap:0,marginBottom:'1.5rem',borderBottom:`2px solid #e5e7eb`}}>
            <div style={{padding:'0 0 12px',fontSize:18,fontWeight:700,color:gold,borderBottom:`3px solid ${gold}`,marginBottom:-2}}>
              {MENU.find(m=>m.id===page)?.label||'Dashboard'}
            </div>
          </div>

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
                      {n:'1',t:'Ia-ți codul promoțional Melbet',d:'Mergi la "Coduri Promoționale" → generează codul tău unic',p:'promo',btn:'Generează cod →'},
                      {n:'2',t:'Promovează pe platforma ta',d:'Include codul în videoclipuri, descrieri și story-uri',p:null,btn:null},
                      {n:'3',t:'Urmărește câștigurile',d:'Statisticile se actualizează săptămânal de echipa WinPartners',p:null,btn:null},
                    ].map(s=>(
                      <div key={s.n} style={{display:'flex',alignItems:'flex-start',gap:12,background:'rgba(255,255,255,0.03)',borderRadius:8,padding:'10px 14px'}}>
                        <div style={{minWidth:24,height:24,borderRadius:'50%',background:'#f5a623',color:'#000',fontWeight:800,fontSize:12,display:'flex',alignItems:'center',justifyContent:'center'}}>{s.n}</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:13,fontWeight:700,color:'#fff',marginBottom:2}}>{s.t}</div>
                          <div style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>{s.d}</div>
                        </div>
                        {s.btn && <button onClick={()=>setPage(s.p)} style={{padding:'5px 12px',fontSize:11,fontWeight:700,cursor:'pointer',border:'1px solid #f5a623',borderRadius:6,background:'none',color:'#f5a623',whiteSpace:'nowrap'}}>{s.btn}</button>}
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
                  {l:'DISPONIBIL PENTRU RETRAGERE',v:'$'+D.bal.available,c:'#10b981',bc:'#10b981'},
                  {l:'IERI',v:'$'+D.bal.yesterday,c:'#3b82f6',bc:'#3b82f6'},
                  {l:'LUNA CURENTĂ',v:'$'+D.bal.month,c:'#f59e0b',bc:'#f59e0b'},
                  {l:'30 DE ZILE',v:'$'+D.bal.days30,c:'#ef4444',bc:'#ef4444'},
                  {l:'TOTAL',v:'$'+D.bal.total,c:'#10b981',bc:'#10b981'},
                ].map((it,i)=>(
                  <div key={it.l} style={{padding:isMobile?'10px 8px':'14px 16px',borderLeft:isMobile?'none':i>0?`1px solid ${bdr}`:'none',border:isMobile?`1px solid ${bdr}`:undefined,borderBottom:`3px solid ${it.bc}`,textAlign:'center',borderRadius:isMobile?6:0,background:isMobile?bgCard:undefined}}>
                    <div style={{fontSize:isMobile?17:22,fontWeight:800,color:it.c,marginBottom:4}}>{it.v}</div>
                    <div style={{fontSize:9,color:txtSub,textTransform:'uppercase',letterSpacing:'.06em',lineHeight:1.3}}>{it.l}</div>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div style={filterRow}>
                <span style={{fontSize:13,color:txtSub}}>Perioada</span>
                <select style={{...inp,width:110}} value={period} onChange={e=>setPeriod(e.target.value)}>
                  {['1 zi','7 zile','1 lună','3 luni','6 luni','1 an'].map(p=><option key={p}>{p}</option>)}
                </select>
                <span style={{fontSize:13,color:txtSub}}>Valută</span>
                <select style={{...inp,width:75}} value={currency} onChange={e=>setCurrency(e.target.value)}>
                  {['USD','EUR','MDL'].map(c=><option key={c}>{c}</option>)}
                </select>
                <button style={btnPrimary} onClick={()=>{const el=document.getElementById('apply-toast');if(el){el.style.opacity='1';setTimeout(()=>el.style.opacity='0',1500)}}}>APLICAȚI</button>
                <span id="apply-toast" style={{fontSize:11,color:'#10b981',transition:'opacity .3s',opacity:0}}>✓ Aplicat</span>
              </div>

              {/* Charts */}
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:12,marginBottom:'1.5rem'}}>
                {[
                  {title:'Statistici conversii',items:[{f:'cl',c:'#3b82f6',l:'Vizualizări'},{f:'rg',c:'#6366f1',l:'Clickuri'},{f:'dp',c:'#06b6d4',l:'Linkuri directe'}]},
                  {title:'Statistici înregistrare',items:[{f:'rg',c:'#ef4444',l:'Înregistrări'},{f:'dp',c:'#10b981',l:'Depunători noi'},{f:'rv',c:gold,l:'Suma comisionului'}]},
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
                  <span style={{fontSize:13,fontWeight:600,color:txt}}>Sumarul statisticilor</span>
                  <select style={{...inp,fontSize:12}}>
                    <option>Ieri</option><option>Azi</option><option>Săptămâna</option>
                  </select>
                </div>
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',minWidth:900}}>
                    <thead><tr>
                      {['Valută','Vizualizări','Clickuri','Linkuri directe','Înregistrări','Depunători noi','Profitul companiei','RP','CPA','Suma comisionului'].map(h=><th key={h} style={TH}>{h}</th>)}
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
                  <table style={{width:'100%',borderCollapse:'collapse'}}>
                    <thead><tr>{['Valută ↕','Structura comisionului ↕','Numele grupei ↕','Data de început ↕','Descriere ↕','Dată de sfârșit ↕'].map(h=><th key={h} style={{...TH,cursor:'pointer'}}>{h}</th>)}</tr></thead>
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
                <div style={{padding:'10px 16px',fontSize:12,color:txtSub,borderTop:`1px solid ${bdr}`,background:'#fafafa'}}>Înregistrări de la 1 la {D.commStructure.length} ({D.commStructure.length} înregistrări în total)</div>
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
                    <div style={{fontSize:13,fontWeight:700,color:'#10b981',marginBottom:4}}>Comision RS25% + REF3%</div>
                    <div style={{fontSize:12,color:txtSub,lineHeight:1.6}}>Primești <b style={{color:txt}}>25%</b> din pierderile jucătorilor tăi + <b style={{color:'#10b981'}}>3% bonus</b> din câștigurile oricărui blogger pe care îl inviți tu în program — pe viață.</div>
                  </div>
                </div>
                <div style={{background:'linear-gradient(135deg,rgba(167,139,250,0.12),rgba(167,139,250,0.04))',border:'1px solid rgba(167,139,250,0.3)',borderRadius:10,padding:'14px 18px',display:'flex',gap:12,alignItems:'flex-start'}}>
                  <div style={{fontSize:24,flexShrink:0}}>📅</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:'#a78bfa',marginBottom:4}}>Plăți săptămânale automate</div>
                    <div style={{fontSize:12,color:txtSub,lineHeight:1.6}}>Suma minimă de retragere: <b style={{color:txt}}>$30/săptămână</b>. Prima plată se activează după ce contactezi managerul WinPartners pe Telegram.</div>
                  </div>
                </div>
              </div>
              <div style={filterRow}>
                <span style={{fontSize:13,color:txtSub}}>Valută</span>
                <select style={inp}><option>USD</option></select>
                <span style={{fontSize:13,color:txtSub}}>Perioada</span>
                <select style={inp}><option>Perioada exactă</option></select>
                <input type="date" style={inp} defaultValue="2026-06-13"/>
                <span style={{color:txtSub}}>→</span>
                <input type="date" style={inp} defaultValue="2026-06-13"/>
                <button style={btnPrimary}>GENERAȚI RAPORT</button>
              </div>
              <div style={{display:'flex',gap:0,marginBottom:'1rem',borderBottom:`2px solid ${bdr}`}}>
                {['Statusul solicitărilor','Istoricul plăților'].map((t,i)=>(
                  <button key={t} onClick={()=>setPayTab(i===0?'status':'history')} style={payTab===(i===0?'status':'history')?tabActive:tabInactive}>{t}</button>
                ))}
                <div style={{flex:1}}/>
                <button style={{...btnOutline('#ef4444'),marginBottom:2,fontSize:12}}>EXPORT ▼</button>
              </div>
              <div style={{marginBottom:'0.75rem'}}><select style={{...inp,fontSize:12}}><option>6 articole selectate ▼</option></select></div>
              <div style={{...card,padding:0,overflow:'hidden',marginBottom:'1.25rem'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>{['Valută ↕','Data ↕','Plata ↕','Venituri ↕','Sold ↕','Status ↕'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
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
                <div style={{padding:'10px 16px',fontSize:12,color:txtSub,borderTop:`1px solid ${bdr}`,background:'#fafafa'}}>Înregistrări de la 1 la {D.pays.length}</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div style={card}>
                  <p style={{fontSize:13,color:txtSub,lineHeight:1.7,marginBottom:8}}>Pentru a primi plata, vă rugăm să contactați managerul dumneavoastră. Plata automată va fi setată ulterior.</p>
                  <p style={{fontSize:13,fontWeight:600,color:txt,marginBottom:12}}>Suma minimă de plată este de $30 pe săptămână</p>
                  <button style={btnPrimary} onClick={()=>setShowPay(true)}>Solicită plată → ${D.bal.available}</button>
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
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
                <div style={card}>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:14,color:txt,paddingBottom:8,borderBottom:`1px solid ${bdr}`}}>Informații de contact</div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
                    <div><label style={label}>Prenume *</label><input style={{...inp,width:'100%',boxSizing:'border-box'}} defaultValue="Ion"/></div>
                    <div><label style={label}>Prenume *</label><input style={{...inp,width:'100%',boxSizing:'border-box'}} defaultValue="Popescu"/></div>
                  </div>
                  <div style={{marginBottom:8}}><label style={label}>Număr de telefon</label><input style={{...inp,width:'100%',boxSizing:'border-box'}} defaultValue={D.phone}/></div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
                    <div><label style={label}>Messenger</label><select style={{...inp,width:'100%',boxSizing:'border-box'}}><option>WhatsApp</option></select></div>
                    <div><label style={label}>Număr telefon</label><input style={{...inp,width:'100%',boxSizing:'border-box'}} defaultValue={D.phone}/></div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
                    <div><label style={label}>Țară</label><select style={{...inp,width:'100%',boxSizing:'border-box'}}><option>Moldova</option></select></div>
                    <div><label style={label}>Limbă notificări</label><select style={{...inp,width:'100%',boxSizing:'border-box'}}><option>Română</option></select></div>
                  </div>
                  <div style={{fontSize:11,color:txtSub,marginBottom:10}}>pentru a modifica datele de contact, contactați managerul dvs.</div>
                  <button style={btnPrimary} onClick={()=>setPassMsg('ℹ️ '+dt.contactInfo)}>{dt.saveBtn}</button>
                </div>
                <div style={card}>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:14,color:txt,paddingBottom:8,borderBottom:`1px solid ${bdr}`}}>Detaliile plății</div>
                  <div style={{marginBottom:8}}><label style={label}>Metoda de plată preferată</label><input style={{...inp,width:'100%',boxSizing:'border-box'}} defaultValue="Bitcoin" readOnly/></div>
                  <div style={{marginBottom:12}}><label style={label}>Numărul portofelului</label><input style={{...inp,width:'100%',boxSizing:'border-box',fontFamily:'monospace',fontSize:11}} defaultValue={D.payAddress}/></div>
                  <div style={{fontSize:11,color:txtSub,marginBottom:16}}>* pentru a modifica detaliile de plată, contactați Asistența Pentru Parteneri.</div>
                  <div style={{borderTop:`1px solid ${bdr}`,paddingTop:12}}>
                    <div style={{fontSize:13,fontWeight:600,color:txt,marginBottom:8}}>Abonamente</div>
                    <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:13,color:txtSub}}>
                      <input type="checkbox" defaultChecked style={{accentColor:gold}}/> Informațiile companiei
                    </label>
                  </div>
                </div>
                <div style={card}>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:14,color:txt,paddingBottom:8,borderBottom:`1px solid ${bdr}`}}>Modificați parola</div>
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

          {/* === LINK-URI === */}
          {page==='links'&&(
            <div>
              <div style={filterRow}>
                <span style={{fontSize:13,color:txtSub}}>Site web</span>
                <select style={{...inp,width:190}}><option>winpartners.pro</option></select>
                <span style={{fontSize:13,color:txtSub}}>Valută</span>
                <select style={inp}><option>USD</option></select>
                <span style={{fontSize:13,color:txtSub}}>Campanie</span>
                <select style={{...inp,width:120}} value={linkCamp} onChange={e=>setLinkCamp(e.target.value)}><option>English</option><option>Romanian</option><option>Russian</option></select>
                <span style={{fontSize:13,color:txtSub}}>Pagină destinație</span>
                <input style={{...inp,width:70}} value={linkPage} onChange={e=>setLinkPage(e.target.value)}/>
                <span style={{fontSize:13,color:txtSub}}>Sub ID</span>
                <input style={{...inp,width:90}} value={subId} onChange={e=>setSubId(e.target.value)} placeholder="SubID"/>
                <button style={btnPrimary}>GENERARE LINK</button>
              </div>
              <div style={{display:'flex',gap:0,marginBottom:'1rem',borderBottom:`2px solid ${bdr}`}}>
                {['Link-uri create','Link-uri ascunse'].map((t,i)=>(
                  <button key={t} onClick={()=>setLinkTab(i===0?'created':'hidden')} style={linkTab===(i===0?'created':'hidden')?tabActive:tabInactive}>{t}</button>
                ))}
              </div>
              <div style={{marginBottom:'0.75rem'}}><select style={{...inp,fontSize:12}}><option>8 articole selectate ▼</option></select></div>
              <div style={{...card,padding:0,overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>{['Nr. ↕','Site web ↕','Arată/Ascunde ↕','Pagină destinație ↕','SubID ↕','Campanie ↕','Link generat ↕','Valută ↕'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>
                    {linkTab==='created'&&D.links.map((l,i)=>(
                      <tr key={i} style={{background:i%2===0?'#fff':'#fafafa'}}>
                        <td style={TD}>{l.id}</td>
                        <td style={TD}>winpartners.pro</td>
                        <td style={TD}><span style={{background:'#d1fae5',color:'#065f46',padding:'2px 8px',borderRadius:12,fontSize:11,fontWeight:600}}>Arată</span></td>
                        <td style={TD}>{l.page}</td>
                        <td style={TD}>{l.subid||'—'}</td>
                        <td style={TD}>{l.camp}</td>
                        <td style={{...TD,fontFamily:'monospace',fontSize:11,color:txtSub}}>
                          {l.link}
                          <button style={{...btnOutline(gold),padding:'2px 8px',fontSize:10,marginLeft:6}} onClick={()=>copy(l.link,'lnk'+i)}>{copied==='lnk'+i?'✓':'Copiează'}</button>
                        </td>
                        <td style={TD}>USD</td>
                      </tr>
                    ))}
                    {linkTab==='hidden'&&<tr><td colSpan={8} style={{...TD,textAlign:'center',color:txtSub,padding:'24px',fontStyle:'italic'}}>Fără informații</td></tr>}
                  </tbody>
                </table>
                <div style={{padding:'10px 16px',fontSize:12,color:txtSub,borderTop:`1px solid ${bdr}`,background:'#fafafa'}}>Înregistrări de la 1 la {D.links.length}</div>
              </div>
            </div>
          )}

          {/* === CODURI PROMO === */}
          {page==='promo'&&(
            <div>
              {/* Banner important — cod numeric Melbet */}
              <div style={{background:'linear-gradient(135deg,rgba(245,166,35,0.12),rgba(245,166,35,0.03))',border:'1px solid rgba(245,166,35,0.35)',borderRadius:10,padding:'14px 18px',marginBottom:'1.25rem',display:'flex',gap:14,alignItems:'flex-start'}}>
                <div style={{fontSize:22,flexShrink:0}}>🎟️</div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:gold,marginBottom:5}}>Codul tău promoțional Melbet — cum funcționează</div>
                  <div style={{fontSize:12,color:txtSub,lineHeight:1.7}}>
                    Codul tău numeric (ex: <span style={{fontFamily:'monospace',color:txt,fontWeight:700}}>11035387</span>) e codul promoțional oficial generat de Melbet. Jucătorii îl introduc la înregistrare pe Melbet.com și sunt legați automat de tine — fără link de referral. <b style={{color:txt}}>Spune-le bloggerilor tăi să-l includă în videoclipuri și descrieri.</b>
                  </div>
                </div>
              </div>
              <div style={filterRow}>
                <span style={{fontSize:13,color:txtSub}}>Site web</span>
                <select style={{...inp,width:190}}><option>winpartners.pro</option></select>
                <span style={{fontSize:13,color:txtSub}}>Valută</span>
                <select style={inp}><option>USD</option></select>
                <span style={{fontSize:13,color:txtSub}}>Campanie</span>
                <select style={{...inp,width:120}}><option>English</option></select>
                <button style={btnPrimary}>GENERAȚI COD PROMOȚIONAL</button>
              </div>
              <div style={{marginBottom:'0.75rem'}}><select style={{...inp,fontSize:12}}><option>5 articole selectate ▼</option></select></div>
              <div style={{...card,padding:0,overflow:'hidden',marginBottom:'1.25rem'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>{['ID ↕','Site web ↕','Valută ↕','Cod promoțional ↕','BTAG ↕',''].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>
                    <tr>
                      <td style={TD}>11035387</td>
                      <td style={TD}>winpartners.pro</td>
                      <td style={TD}>USD</td>
                      <td style={{...TD,fontWeight:700,color:'#1a1a2e',fontFamily:'monospace',fontSize:14}}>{D.promoCode.toLowerCase()}</td>
                      <td style={{...TD,fontFamily:'monospace',fontSize:10,color:txtSub}}>d_5666408m_2170c_{D.promoCode.toLowerCase()}</td>
                      <td style={TD}>
                        <button style={{...btnOutline(gold),padding:'4px 10px',fontSize:11}} onClick={()=>copy(D.promoCode,'promo')}>{copied==='promo'?'✓ Copiat':'Copiează'}</button>
                        <button style={{...btnOutline('#6366f1'),padding:'4px 10px',fontSize:11,marginLeft:6}} onClick={()=>setShowCode(true)}>Personalizat</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div style={{padding:'10px 16px',fontSize:12,color:txtSub,borderTop:`1px solid ${bdr}`,background:'#fafafa'}}>Înregistrări de la 1 la 1 (1 înregistrare în total)</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <div style={card}>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:8,color:txt}}>Pentru ce sunt codurile promoționale?</div>
                  <p style={{fontSize:13,color:txtSub,lineHeight:1.7,marginBottom:10}}>Clienții pot introduce codul promoțional în timp ce se înregistrează pe site, care îi leagă automat de dumneavoastră. Nu este necesar ca noii clienți să urmeze un link afiliat la site.</p>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:6,color:txt}}>Cum să obțineți un cod promoțional?</div>
                  <p style={{fontSize:13,color:txtSub,lineHeight:1.7}}>Selectați o monedă și o campanie și faceți click pe «Generare Cod Promoțional». Dacă doriți un cod personalizat, <span style={{color:gold,cursor:'pointer',fontWeight:600}} onClick={()=>setShowCode(true)}>contactați Echipa de Asistență</span>.</p>
                </div>
                <div style={card}>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:8,color:txt}}>Un bonus de înregistrare folosind un cod promoțional</div>
                  <p style={{fontSize:13,color:txtSub,lineHeight:1.7,marginBottom:10}}>Discutați cu managerul dumneavoastră pentru a afla mai multe despre bonusurile acordate jucătorilor care se înregistrează cu codul promoțional.</p>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:6,color:txt}}>Avantajele utilizării unui cod promoțional</div>
                  <ul style={{fontSize:13,color:txtSub,lineHeight:1.8,paddingLeft:18}}>
                    <li>Utilizat când nu puteți plasa un link de afiliat</li>
                    <li>Clientul este legat de dvs. automat la înregistrare</li>
                    <li>Funcționează pe toate platformele sociale</li>
                  </ul>
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
                <button style={btnPrimary}>CĂUTARE</button>
              </div>
              <div style={{...card,textAlign:'center',padding:'3rem',color:txtSub,fontSize:13}}>
                Niciun material media disponibil.<br/>Contactați managerul pentru materiale de promovare personalizate.
              </div>
            </div>
          )}

          {/* === REZUMAT + RAPORT COMPLET === */}
          {(page==='summary'||page==='report')&&(
            <div>
              <div style={filterRow}>
                <span style={{fontSize:13,color:txtSub}}>Valută</span>
                <select style={inp}><option>USD</option></select>
                <span style={{fontSize:13,color:txtSub}}>Site web</span>
                <select style={{...inp,width:150}}><option>Toate</option></select>
                {page==='summary'&&<><span style={{fontSize:13,color:txtSub}}>ID instrument</span><input style={{...inp,width:120}} placeholder=""/></>}
                <span style={{fontSize:13,color:txtSub}}>Perioada</span>
                <select style={{...inp,width:130}}><option>Perioada exactă</option></select>
                <input type="date" style={inp} defaultValue="2026-06-13"/>
                <span style={{color:txtSub}}>→</span>
                <input type="date" style={inp} defaultValue="2026-06-13"/>
                <button style={btnPrimary}>GENERAȚI RAPORT</button>
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
                <span style={{fontSize:13,color:txtSub}}>Valută</span><select style={inp}><option>USD</option></select>
                <span style={{fontSize:13,color:txtSub}}>Site web</span><select style={{...inp,width:150}}><option>Toate</option></select>
                <span style={{fontSize:13,color:txtSub}}>Jucător</span><input style={{...inp,width:120}} placeholder="ID jucător"/>
                <span style={{fontSize:13,color:txtSub}}>Perioada</span><select style={inp}><option>1 lună</option></select>
                <button style={btnPrimary}>GENERAȚI RAPORT</button>
              </div>
              <div style={{...card,padding:0,overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
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
                <span style={{fontSize:13,color:txtSub}}>Valută</span><select style={inp}><option>USD</option></select>
                <span style={{fontSize:13,color:txtSub}}>Perioada</span><select style={inp}><option>1 lună</option></select>
                <button style={btnPrimary}>GENERAȚI RAPORT</button>
              </div>
              <div style={{...card,padding:0,overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>{['Blogger','Platformă','Data înregistrării','Înregistrări aduse','Câștigurile lui','Comisionul meu (3%)'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
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

          {/* === INSTRUMENTE MARKETING === */}
          {page==='mkttools'&&(
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
              {[['📊','Raport complet','Statistici detaliate per zi','report'],['👥','Raport jucători','Activitatea fiecărui jucător','players'],['🌿','Sub-afiliați','Gestionați bloggerii invitați','subaff'],['🔗','Link-uri Afiliați','Linkuri de tracking personalizate','links'],['🎟','Coduri Promo','Coduri personalizate pentru promovare','promo'],['📢','Media','Bannere și materiale grafice','media']].map(([icon,t,d,dest])=>(
                <div key={t} style={{...card,cursor:'pointer',transition:'box-shadow .15s,transform .15s'}} onClick={()=>setPage(dest)}
                  onMouseOver={e=>{e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.12)';e.currentTarget.style.transform='translateY(-2px)'}}
                  onMouseOut={e=>{e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,0.06)';e.currentTarget.style.transform='none'}}>
                  <div style={{fontSize:28,marginBottom:10}}>{icon}</div>
                  <div style={{fontSize:14,fontWeight:700,color:txt,marginBottom:4}}>{t}</div>
                  <div style={{fontSize:12,color:txtSub,lineHeight:1.5}}>{d}</div>
                </div>
              ))}
            </div>
          )}

          {/* === CAZINOURI PARTENERE === */}
          {page==='cazinouri'&&(
            <div>
              {/* Sumar total deasupra */}
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(4,1fr)',gap:12,marginBottom:'1.5rem'}}>
                {[
                  ['Total înregistrări', CASINOS.reduce((s,c)=>s+(c.stats.regs||0),0), txt, '👥'],
                  ['Total depunători', CASINOS.reduce((s,c)=>s+(c.stats.deposits||0),0), txt, '💳'],
                  ['Venit total generat', '$'+CASINOS.reduce((s,c)=>s+(c.stats.revenue||0),0).toLocaleString(), '#3b82f6', '📈'],
                  ['Comision total al meu', '$'+CASINOS.reduce((s,c)=>s+(c.stats.commission||0),0).toLocaleString(), '#10b981', '💰'],
                ].map(([l,v,c,icon])=>(
                  <div key={l} style={{...card,textAlign:'center',padding:'14px 12px'}}>
                    <div style={{fontSize:18,marginBottom:4}}>{icon}</div>
                    <div style={{fontSize:11,color:txtSub,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4,lineHeight:1.3}}>{l}</div>
                    <div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Carduri casino — fiecare cu statistici */}
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:16,marginBottom:'1.5rem'}}>
                {CASINOS.map(casino=>{
                  const myCode = myCodes.find(c=>c.casinoId===casino.id)
                  const isActive = !!myCode
                  const isSelected = selectedCasino===casino.id
                  return (
                    <div key={casino.id}
                      onClick={()=>{setSelectedCasino(isSelected?null:casino.id);setGeneratedCode(null)}}
                      style={{...card,cursor:'pointer',border:isSelected?`2px solid ${casino.color}`:`2px solid ${isActive?casino.color+'44':bdr}`,transition:'all .2s',position:'relative',overflow:'hidden',padding:0}}>

                      {/* Header casino */}
                      <div style={{background:isActive?`${casino.color}12`:'#fafafa',padding:'14px 16px',borderBottom:`1px solid ${bdr}`,display:'flex',alignItems:'center',gap:12}}>
                        <div style={{width:40,height:40,borderRadius:10,background:`${casino.color}20`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>{casino.logo}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:700,fontSize:14,color:txt,marginBottom:2}}>{casino.name}</div>
                          <div style={{fontSize:11,color:casino.color,fontWeight:700}}>{casino.commission}</div>
                        </div>
                        {isActive && <div style={{background:casino.color,color:'#000',fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:12,flexShrink:0}}>ACTIV</div>}
                      </div>

                      {/* Statistici per casino */}
                      <div style={{padding:'12px 16px'}}>
                        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr 1fr',gap:8,marginBottom:12}}>
                          {[
                            ['Înreg.', casino.stats.regs, txt],
                            ['Depun.', casino.stats.deposits, '#3b82f6'],
                            ['Comision', '$'+casino.stats.commission, '#10b981'],
                          ].map(([l,v,c])=>(
                            <div key={l} style={{textAlign:'center',background:'#f8f9fa',borderRadius:6,padding:'8px 4px'}}>
                              <div style={{fontSize:10,color:txtSub,marginBottom:3,textTransform:'uppercase',letterSpacing:'.04em'}}>{l}</div>
                              <div style={{fontSize:16,fontWeight:800,color:c}}>{v}</div>
                            </div>
                          ))}
                        </div>

                        {/* Codul meu dacă există */}
                        {casino.comingSoon ? (
                          <div>
                            <div style={{background:'rgba(0,0,0,0.04)',border:'1px solid rgba(0,0,0,0.08)',borderRadius:6,padding:'8px 10px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                              <div style={{fontSize:12,color:txtSub,fontWeight:600}}>🔜 Disponibil în curând</div>
                              <button
                                onClick={e=>{e.stopPropagation();setShowCasinoRequest(casino.id)}}
                                style={{padding:'3px 10px',fontSize:11,fontWeight:600,cursor:'pointer',border:'1px solid rgba(245,166,35,0.3)',borderRadius:5,background:'none',color:gold,fontFamily:'inherit',flexShrink:0}}>
                                Aplică
                              </button>
                            </div>
                          </div>
                        ) : isActive ? (
                          <div>
                            {/* Codul promoțional */}
                            <div style={{background:`${casino.color}0d`,border:`1px solid ${casino.color}30`,borderRadius:6,padding:'8px 12px',display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
                              <div>
                                <div style={{fontSize:10,color:txtSub,marginBottom:1}}>Codul meu (spune-l în video)</div>
                                <div style={{fontFamily:'monospace',fontWeight:900,color:casino.color,fontSize:15,letterSpacing:1}}>{myCode.code}</div>
                              </div>
                              <button onClick={e=>{e.stopPropagation();copy(myCode.code,'code_'+casino.id)}}
                                style={{padding:'4px 10px',fontSize:11,fontWeight:600,cursor:'pointer',border:`1px solid ${casino.color}40`,borderRadius:6,background:'none',color:casino.color,fontFamily:'inherit'}}>
                                {copied==='code_'+casino.id?'✓':'Copiază'}
                              </button>
                            </div>
                            {/* Link pentru jucători */}
                            {casino.id==='melbet' && (
                              <div style={{background:'rgba(59,130,246,0.06)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:6,padding:'8px 12px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                                <div style={{flex:1,minWidth:0}}>
                                  <div style={{fontSize:10,color:txtSub,marginBottom:1}}>Link pentru jucători (pune în bio/stories)</div>
                                  <div style={{fontFamily:'monospace',fontSize:10,color:'#3b82f6',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{getMelbetPlayerLink(myCode.code)}</div>
                                </div>
                                <button onClick={e=>{e.stopPropagation();copy(getMelbetPlayerLink(myCode.code),'link_'+casino.id)}}
                                  style={{padding:'4px 10px',fontSize:11,fontWeight:600,cursor:'pointer',border:'1px solid rgba(59,130,246,0.3)',borderRadius:6,background:'none',color:'#3b82f6',fontFamily:'inherit',flexShrink:0,marginLeft:8}}>
                                  {copied==='link_'+casino.id?'✓':'Copiază'}
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:6,padding:'8px 12px',textAlign:'center'}}>
                            <div style={{fontSize:12,color:'#16a34a',fontWeight:600}}>Disponibil — generează cod</div>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div style={{padding:'8px 16px',borderTop:`1px solid ${bdr}`,display:'flex',justifyContent:'space-between',fontSize:11,color:txtSub,background:'#fafafa'}}>
                        <span>Plată: {casino.payFreq}</span>
                        <span>Min: {casino.minPayout}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Panoul de acțiune — apare când selectezi un casino */}
              {selectedCasino && (()=>{
                const casino = CASINOS.find(c=>c.id===selectedCasino)
                const myCode = myCodes.find(c=>c.casinoId===selectedCasino)
                return (
                  <div style={{...card,border:`2px solid ${casino.color}44`,marginBottom:'1.5rem'}}>
                    <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                      <div style={{width:36,height:36,borderRadius:8,background:`${casino.color}20`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>{casino.logo}</div>
                      <div>
                        <div style={{fontWeight:700,fontSize:15,color:txt}}>{casino.name}</div>
                        <div style={{fontSize:12,color:txtSub}}>{casino.description}</div>
                      </div>
                    </div>

                    {myCode ? (
                      /* Cod deja generat */
                      <div>
                        {/* Codul promoțional */}
                        <div style={{background:'#f0fdf4',border:'1px solid #86efac',borderRadius:8,padding:'16px 20px',marginBottom:12}}>
                          <div style={{fontSize:11,color:'#16a34a',fontWeight:600,marginBottom:6,textTransform:'uppercase',letterSpacing:'.06em'}}>🎟 Codul tău promoțional — spune-l în video</div>
                          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
                            <div style={{fontSize:32,fontWeight:900,color:'#15803d',fontFamily:'monospace',letterSpacing:3}}>{myCode.code}</div>
                            <button onClick={()=>copy(myCode.code,'panel_code')} style={{...btnPrimary,padding:'8px 18px',fontSize:13,flexShrink:0}}>
                              {copied==='panel_code'?'✓ Copiat!':'📋 Copiază'}
                            </button>
                          </div>
                          <div style={{fontSize:12,color:'#16a34a',marginTop:6}}>Jucătorul introduce acest cod la înregistrare pe Melbet → tu primești {casino.commissionPct}% din pierderile lui.</div>
                        </div>

                        {/* Linkul de jucători — PRINCIPAL */}
                        {casino.id==='melbet' && (
                          <div style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:8,padding:'16px 20px',marginBottom:12}}>
                            <div style={{fontSize:11,color:'#1d4ed8',fontWeight:600,marginBottom:6,textTransform:'uppercase',letterSpacing:'.06em'}}>🔗 Linkul tău de afiliat — pune în bio, stories, descriere</div>
                            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                              <div style={{flex:1,fontFamily:'monospace',fontSize:12,color:'#1d4ed8',background:'#dbeafe',padding:'8px 10px',borderRadius:6,wordBreak:'break-all',lineHeight:1.5}}>
                                {getMelbetPlayerLink(myCode.code)}
                              </div>
                              <button onClick={()=>copy(getMelbetPlayerLink(myCode.code),'player_link')} style={{...btnPrimary,padding:'8px 16px',fontSize:13,flexShrink:0,background:'#2563eb'}}>
                                {copied==='player_link'?'✓ Copiat!':'📋 Copiază'}
                              </button>
                            </div>
                            <div style={{fontSize:11,color:'#3b82f6',lineHeight:1.6}}>
                              Jucătorul dă click pe link → ajunge direct pe Melbet → se înregistrează → e legat automat de tine. <strong>Nu trebuie să introducă codul manual!</strong>
                            </div>
                          </div>
                        )}

                        {/* Cum să folosești */}
                        <div style={{background:'#fefce8',border:'1px solid #fde047',borderRadius:8,padding:'12px 16px',marginBottom:12,fontSize:12,color:'#854d0e',lineHeight:1.7}}>
                          <strong>💡 Cum promovezi:</strong><br/>
                          • <strong>TikTok/Instagram Bio:</strong> Pune linkul de afiliat în bio → „Înregistrează-te pe Melbet prin linkul din bio"<br/>
                          • <strong>În video/stories:</strong> „Folosiți codul <strong>{myCode.code}</strong> la înregistrare pentru bonus"<br/>
                          • <strong>YouTube descriere:</strong> Pune linkul + scrie codul în descriere
                        </div>

                        <button onClick={()=>setShowCustomCode(true)} style={{...btnOutline(casino.color),padding:'9px 20px',fontSize:13}}>
                          ✨ Vreau cod personalizat cu numele meu
                        </button>
                      </div>
                    ) : (
                      /* Nu are cod încă */
                      <div>
                        {!generatedCode ? (
                          <div>
                            <p style={{fontSize:13,color:txtSub,marginBottom:16,lineHeight:1.6}}>
                              Generează un cod promoțional unic pentru <strong>{casino.name}</strong>. Codul va fi asociat contului tău @{D.username} și vei câștiga <strong style={{color:casino.color}}>{casino.commissionPct}%</strong> din pierderile jucătorilor care îl folosesc.
                            </p>
                            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                              <button onClick={()=>generatePromoCode(selectedCasino)} disabled={codeGenerating}
                                style={{...btnPrimary,padding:'12px 28px',fontSize:14,borderRadius:8,opacity:codeGenerating?0.7:1,cursor:codeGenerating?'wait':'pointer'}}>
                                {codeGenerating?'⏳ Se atribuie codul...':'🎁 Generează Cod Promoțional'}
                              </button>
                              <button onClick={()=>setShowCustomCode(true)} style={{...btnOutline(casino.color),padding:'12px 20px',fontSize:13}}>
                                ✨ Vreau cod personalizat
                              </button>
                            </div>
                          </div>
                        ) : generatedCode.error ? (
                          <div style={{background:'#fef2f2',border:'1px solid #fca5a5',borderRadius:8,padding:'16px',textAlign:'center'}}>
                            <div style={{fontSize:14,color:'#dc2626',fontWeight:600,marginBottom:4}}>⚠️ Momentan nu sunt coduri disponibile</div>
                            <div style={{fontSize:12,color:'#9ca3af'}}>Contactează managerul pentru alocare manuală.</div>
                          </div>
                        ) : (
                          <div>
                            <div style={{background:'#f0fdf4',border:'1px solid #86efac',borderRadius:8,padding:'20px',marginBottom:14,textAlign:'center'}}>
                              <div style={{fontSize:11,color:'#16a34a',fontWeight:600,marginBottom:6,textTransform:'uppercase',letterSpacing:'.08em'}}>✅ Codul tău promoțional</div>
                              <div style={{fontSize:32,fontWeight:900,color:'#15803d',fontFamily:'monospace',letterSpacing:4,marginBottom:8}}>{generatedCode.code}</div>
                              <div style={{fontSize:12,color:'#16a34a'}}>{casino.name} · @{generatedCode.bloggerUsername}</div>
                            </div>
                            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                              <button onClick={()=>copy(generatedCode.code,'promoCode')} style={{...btnPrimary,padding:'10px 20px',fontSize:13}}>
                                {copied==='promoCode'?'✓ Copiat!':'📋 Copiază codul'}
                              </button>
                              <button onClick={()=>setShowCustomCode(true)} style={{...btnOutline(casino.color),padding:'10px 16px',fontSize:13}}>
                                ✨ Vreau cod cu numele meu
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })()}

              {/* Buton cod personalizat */}
              <div style={{...card,marginBottom:'1rem',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:txt,marginBottom:3}}>Vrei un cod personalizat? (ex: IONEL23)</div>
                  <div style={{fontSize:12,color:txtSub}}>Trimite o cerere — managerul tău îl activează în 24-48h</div>
                </div>
                <button onClick={()=>setShowCustomCode(true)} style={{...btnPrimary,padding:'9px 20px',fontSize:13,flexShrink:0}}>
                  ✨ Solicită cod special
                </button>
              </div>

              {/* Cereri trimise */}
              {customRequests.length > 0 && (
                <div style={{...card,marginBottom:'1rem',padding:0,overflow:'hidden'}}>
                  <div style={{padding:'10px 16px',borderBottom:`1px solid ${bdr}`,fontSize:13,fontWeight:700,color:txt}}>Cererile mele de cod special</div>
                  <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
                  <table style={{width:'100%',borderCollapse:'collapse'}}>
                    <thead><tr>{['Cod solicitat','Casino','Data','Status'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                    <tbody>{customRequests.map((r,i)=>(
                      <tr key={r.id} style={{background:i%2===0?'#fff':'#fafafa'}}>
                        <td style={{...TD,fontFamily:'monospace',fontWeight:700,color:gold}}>{r.requestedCode}</td>
                        <td style={TD}>{r.casinoName}</td>
                        <td style={{...TD,color:txtSub}}>{r.date}</td>
                        <td style={TD}>
                          <span style={{padding:'2px 10px',borderRadius:12,fontSize:11,fontWeight:600,
                            background: r.status==='approved'?'#d1fae5': r.status==='rejected'?'#fee2e2':'#fef9c3',
                            color: r.status==='approved'?'#065f46': r.status==='rejected'?'#991b1b':'#92400e'}}>
                            {r.status==='approved'?'✓ Aprobat': r.status==='rejected'?'✗ Respins':'⏳ În așteptare'}
                          </span>
                        </td>
                      </tr>
                    ))}</tbody>
                  </table>
                  </div>
                </div>
              )}

              {/* Tabel toate codurile mele */}
              {myCodes.length > 0 && (
                <div style={{...card,padding:0,overflow:'hidden'}}>
                  <div style={{padding:'12px 16px',borderBottom:`1px solid ${bdr}`,fontSize:14,fontWeight:700,color:txt}}>Toate codurile mele active</div>
                  <div style={{overflowX:'auto'}}>
                    <table style={{width:'100%',borderCollapse:'collapse'}}>
                      <thead><tr>{['Casino','Cod','Data generării','Înregistrări','Comision'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                      <tbody>{myCodes.map((c,i)=>(
                        <tr key={c.code} style={{background:i%2===0?'#fff':'#fafafa'}}>
                          <td style={TD}>
                            <div style={{display:'flex',alignItems:'center',gap:8}}>
                              <span style={{width:8,height:8,borderRadius:'50%',background:c.color||gold,display:'inline-block',flexShrink:0}}/>
                              {c.casinoName}
                            </div>
                          </td>
                          <td style={{...TD,fontFamily:'monospace',fontWeight:800,color:c.color||gold,fontSize:14}}>{c.code}</td>
                          <td style={{...TD,color:txtSub}}>{c.date}</td>
                          <td style={TD}>{c.regs}</td>
                          <td style={{...TD,color:'#10b981',fontWeight:700}}>${c.commission.toFixed(2)}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {page==='contact'&&(
            <div style={{...card,maxWidth:440}}>
              {[['Email','support@winpartners.pro'],['Telegram','@winpartners_manager'],['WhatsApp','+373 XX XXX XXX'],['Program','24/7, 365 zile/an']].map(([l,v])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:`1px solid ${bdr}`}}>
                  <span style={{fontSize:13,color:txtSub,fontWeight:500}}>{l}</span>
                  <span style={{fontSize:13,color:gold,fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {/* === SITES === */}
          {page==='sites'&&(
            <div style={{...card,padding:0,overflow:'hidden'}}>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead><tr>{['Site web','Status','Data adăugării'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                <tbody>
                  <tr>
                    <td style={TD}>winpartners.pro</td>
                    <td style={TD}><span style={{background:'#d1fae5',color:'#065f46',padding:'2px 10px',borderRadius:12,fontSize:11,fontWeight:600}}>Activ</span></td>
                    <td style={TD}>2026-06-13</td>
                  </tr>
                </tbody>
              </table>
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
                <button style={btnPrimary} onClick={()=>{setShowPay(false);setPaySent(false)}}>Închide</button>
              </div>
            ):(
              <>
                <div style={{fontSize:15,fontWeight:700,color:txt,marginBottom:4}}>Solicită plată comisioane</div>
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
                <div style={{background:'rgba(245,166,35,0.06)',border:'1px solid rgba(245,166,35,0.15)',borderRadius:6,padding:'8px 12px',marginBottom:10,fontSize:12,color:txtSub}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                    <span>Sumă solicitată:</span>
                    <strong style={{color:txt}}>${D.bal.available}</strong>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                    <span>Taxă procesare (5%):</span>
                    <span style={{color:'#ef4444'}}>-${(D.bal.available*0.05).toFixed(2)}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',borderTop:'1px solid rgba(255,255,255,0.08)',paddingTop:4,marginTop:4}}>
                    <strong>Primești:</strong>
                    <strong style={{color:'#10b981'}}>${(D.bal.available*0.95).toFixed(2)}</strong>
                  </div>
                </div>
                <div style={{fontSize:10,color:'rgba(255,255,255,0.25)',marginBottom:10}}>
                  Se aplică o taxă de procesare de 5% pentru acoperirea costurilor de transfer. Detalii în <span style={{color:gold,cursor:'pointer'}} onClick={()=>window.open('/terms','_blank')}>Termeni și Condiții</span>.
                </div>
                <div style={{fontSize:11,color:txtSub,marginBottom:10}}>
                  Verifică adresa cu atenție. Tranzacțiile crypto sunt ireversibile.
                </div>
                <button style={{...btnPrimary,width:'100%',padding:'11px',fontSize:14,borderRadius:6,opacity:(!payAddr||D.bal.available<30)?0.5:1}}
                  disabled={!payAddr||D.bal.available<30}
                  onClick={async ()=>{
                    if(payAddr&&D.bal.available>=30){
                      await addNotification({type:'pay_request',blogger:D.username,bloggerName:D.name,amount:D.bal.available,address:payAddr,method:payMethod,detail:`Cerere plată \$${D.bal.available} → ${payAddr}`})
                      setPaySent(true)
                    }
                  }}>
                  {D.bal.available<30?`Minim $30 (ai $${D.bal.available})`:'Solicită plata →'}
                </button>
                <button style={{width:'100%',padding:'9px',fontSize:13,cursor:'pointer',border:`1px solid ${bdr}`,borderRadius:6,background:'none',color:txtSub,marginTop:8,fontFamily:'inherit'}} onClick={()=>setShowPay(false)}>Anulează</button>
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
              <div style={{fontSize:15,fontWeight:700,color:txt,marginBottom:4}}>Solicită acces — {casino?.name}</div>
              <p style={{color:txtSub,fontSize:13,marginBottom:20,lineHeight:1.6}}>
                Trimite o cerere pentru a promova <strong>{casino?.name}</strong>. Echipa noastră îți va activa accesul și îți va aloca un cod promoțional dedicat.
              </p>
              <div style={{background:'#fef9c3',border:'1px solid #fde047',borderRadius:6,padding:'10px 14px',marginBottom:20,fontSize:12,color:'#854d0e'}}>
                ⏱ Procesare în 24-48 ore. Vei fi notificat pe email și WhatsApp.
              </div>
              <button
                onClick={()=>{
                  const reqs = loadCustomRequests()
                  const already = reqs.find(r=>r.blogger===D.username && r.casinoId===showCasinoRequest && r.type==='casino_access')
                  if (!already) {
                    saveCustomRequests([...reqs, {
                      id: Date.now(), blogger: D.username, bloggerName: D.name,
                      casinoId: showCasinoRequest, casinoName: casino?.name,
                      type: 'casino_access', requestedCode: 'ACCES', date: new Date().toLocaleDateString('ro-RO'), status: 'pending'
                    }])
                  }
                  setShowCasinoRequest(null)
                  alert('✅ Cererea a fost trimisă! Vei fi notificat în 24-48 ore.')
                }}
                style={{...btnPrimary,width:'100%',padding:'11px',fontSize:14,borderRadius:6}}>
                Trimite cererea
              </button>
              <button style={{width:'100%',padding:'9px',fontSize:13,cursor:'pointer',border:`1px solid ${bdr}`,borderRadius:6,background:'none',color:txtSub,marginTop:8,fontFamily:'inherit'}} onClick={()=>setShowCasinoRequest(null)}>Anulează</button>
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
                <button style={btnPrimary} onClick={()=>{setShowCustomCode(false);setCustomCodeSent(false)}}>Închide</button>
              </div>
            ):(
              <>
                <div style={{fontSize:15,fontWeight:700,color:txt,marginBottom:4}}>Solicită cod personalizat</div>
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
                <button style={{width:'100%',padding:'9px',fontSize:13,cursor:'pointer',border:`1px solid ${bdr}`,borderRadius:6,background:'none',color:txtSub,marginTop:8,fontFamily:'inherit'}} onClick={()=>setShowCustomCode(false)}>Anulează</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* CODE MODAL */}
      {showCode&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:'1rem'}} onClick={()=>setShowCode(false)}>
          <div style={{...card,width:'100%',maxWidth:360,boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}} onClick={e=>e.stopPropagation()}>
            {codeSent?(
              <div style={{textAlign:'center',padding:'1rem'}}>
                <div style={{fontSize:40,marginBottom:10}}>✅</div>
                <h3 style={{fontWeight:700,marginBottom:6,fontSize:16,color:txt}}>Cerere trimisă!</h3>
                <p style={{color:txtSub,fontSize:13,marginBottom:16}}>Codul personalizat va fi activat în 24-48 ore.</p>
                <button style={btnPrimary} onClick={()=>{setShowCode(false);setCodeSent(false)}}>Închide</button>
              </div>
            ):(
              <>
                <div style={{fontSize:15,fontWeight:700,color:txt,marginBottom:4}}>Cere cod personalizat</div>
                <p style={{color:txtSub,fontSize:13,marginBottom:14}}>Procesare în 24-48 ore. Discutați cu managerul pentru bonusuri speciale.</p>
                <label style={label}>Codul dorit (ex: IONEL, VLAD20)</label>
                <input style={{...inp,width:'100%',boxSizing:'border-box',marginBottom:14,textTransform:'uppercase',fontFamily:'monospace',fontSize:14,fontWeight:700}} placeholder="IONEL" value={codeText} onChange={e=>setCodeText(e.target.value.toUpperCase())}/>
                <button style={{...btnPrimary,width:'100%',padding:'10px',fontSize:14,borderRadius:6}} onClick={()=>codeText&&setCodeSent(true)}>Trimite</button>
                <button style={{width:'100%',padding:'9px',fontSize:13,cursor:'pointer',border:`1px solid ${bdr}`,borderRadius:6,background:'none',color:txtSub,marginTop:8,fontFamily:'inherit'}} onClick={()=>setShowCode(false)}>Anulează</button>
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
