import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { addApplication } from '../db.js'

const gold = '#f5a623'
const PLATFORMS = ['TikTok','Instagram','YouTube','Telegram','Facebook','Twitter/X','Other']
const COUNTRIES = ['Moldova','România','Ucraina','Rusia','Kazakhstan','Belarus','Georgia','Armenia','Azerbaijan','Turcia','Germania','Polonia','Portugalia','Altă țară']

const LANGS = ['ro','ru','en','tr','de','pt','pl']

const T = {
  ro: {
    title:'Aplică pentru parteneriat',
    sub:'Completează formularul. Echipa noastră va analiza profilul tău și te va contacta în ',
    sub2:'24-48 de ore', sub3:'.',
    invited:'✓ Ai fost invitat cu codul', invited2:'. Cererea ta va fi procesată prioritar.',
    sec1:'1. Date personale',
    sec2:'2. Profilul tău social',
    sec3:'3. Metoda de plată a comisioanelor',
    lName:'Nume complet *', phName:'Ion Popescu',
    lUser:'Username dorit *', phUser:'ionpopescu',
    lEmail:'Email *', phEmail:'email@exemplu.com',
    lPhone:'WhatsApp / Telegram *', phPhone:'+373 60 000 000',
    lCountry:'Țara',
    lPlatform:'Platforma principală',
    lFollowers:'Număr urmăritori *', phFollowers:'10000',
    lProfile:'Link profil (TikTok/Instagram/YouTube) *', phProfile:'https://tiktok.com/@ionpopescu',
    profileNote:'Profilul tău trebuie să fie public și activ',
    lAbout:'De ce vrei să te alături WinPartners?', phAbout:'Descrie pe scurt audiența ta și cum planifici să promovezi...',
    payNote:'Comisioanele tale vor fi plătite săptămânal, minim $30. Poți modifica metoda de plată oricând din contul tău.',
    lPayMethod:'Metoda preferată', lPayAddr:'Adresa portofelului', phPayAddr:'bc1q... sau adresa ta',
    payNote2:'Poți lăsa adresa goală acum și o completezi după aprobare din dashboard.',
    lRef:'Cod de invitație (dacă ai)', phRef:'ex: REF_ION2026',
    refNote:'Cererile cu cod de invitație sunt procesate prioritar',
    errMsg:'⚠ Verifică câmpurile marcate: username minim 3 caractere, email valid, minim 100 urmăritori',
    submit:'TRIMITE CEREREA →',
    terms:'Prin trimiterea cererii, confirmi că informațiile sunt reale și ești de acord cu ',
    termsLink:'termenii și condițiile',
    terms2:' WinPartners.',
    hasAccount:'Ai deja cont?', login:'Conectați-vă',
    // Confirmare
    sent:'Cererea a fost trimisă!',
    thanks1:'Mulțumim, ', thanks2:'! Cererea ta a fost primită și va fi analizată de echipa noastră.',
    nextTitle:'Ce urmează:',
    st1t:'Acum', st1d:'Cererea ta a fost înregistrată și trimisă echipei noastre',
    st2t:'24-48 ore', st2d:'Echipa noastră analizează profilul tău',
    st3t:'După aprobare', st3d:'Primești email cu datele de acces și codul tău Melbet',
    st4t:'Start', st4d:'Intri în dashboard și începi să câștigi',
    contact:'💬 Ai întrebări? Contactează-ne pe WhatsApp sau Telegram @winpartners',
    back:'← Înapoi la pagina principală',
  },
  ru: {
    title:'Подать заявку на партнёрство',
    sub:'Заполните форму. Наша команда рассмотрит ваш профиль и свяжется с вами в течение ',
    sub2:'24-48 часов', sub3:'.',
    invited:'✓ Вы приглашены с кодом', invited2:'. Ваша заявка будет обработана приоритетно.',
    sec1:'1. Личные данные',
    sec2:'2. Социальный профиль',
    sec3:'3. Способ оплаты',
    lName:'Полное имя *', phName:'Иван Иванов',
    lUser:'Имя пользователя *', phUser:'ivanivanov',
    lEmail:'Email *', phEmail:'ivan@mail.ru',
    lPhone:'WhatsApp / Telegram *', phPhone:'+7 900 000 0000',
    lCountry:'Страна',
    lPlatform:'Основная платформа',
    lFollowers:'Количество подписчиков *', phFollowers:'10000',
    lProfile:'Ссылка на профиль *', phProfile:'https://tiktok.com/@ivanivanov',
    profileNote:'Ваш профиль должен быть публичным и активным',
    lAbout:'Почему хотите присоединиться к WinPartners?', phAbout:'Кратко опишите вашу аудиторию и как планируете продвигать...',
    payNote:'Комиссии выплачиваются еженедельно, минимум $30. Метод оплаты можно изменить в любое время в аккаунте.',
    lPayMethod:'Предпочтительный метод', lPayAddr:'Адрес кошелька', phPayAddr:'bc1q... или ваш адрес',
    payNote2:'Можно оставить адрес пустым и заполнить после одобрения в личном кабинете.',
    lRef:'Код приглашения (если есть)', phRef:'напр: REF_ION2026',
    refNote:'Заявки с кодом приглашения обрабатываются приоритетно',
    errMsg:'⚠ Проверьте отмеченные поля: имя пользователя минимум 3 символа, действительный email, минимум 100 подписчиков',
    submit:'ОТПРАВИТЬ ЗАЯВКУ →',
    terms:'Отправляя заявку, вы подтверждаете, что информация достоверна, и соглашаетесь с ',
    termsLink:'условиями использования',
    terms2:' WinPartners.',
    hasAccount:'Уже есть аккаунт?', login:'Войти',
    sent:'Заявка отправлена!',
    thanks1:'Спасибо, ', thanks2:'! Ваша заявка получена и будет рассмотрена нашей командой.',
    nextTitle:'Что дальше:',
    st1t:'Сейчас', st1d:'Ваша заявка зарегистрирована и отправлена команде',
    st2t:'24-48 часов', st2d:'Наша команда анализирует ваш профиль',
    st3t:'После одобрения', st3d:'Получите email с данными для входа и вашим кодом Melbet',
    st4t:'Старт', st4d:'Войдите в личный кабинет и начните зарабатывать',
    contact:'💬 Есть вопросы? Свяжитесь с нами в WhatsApp или Telegram @winpartners',
    back:'← Вернуться на главную',
  },
  en: {
    title:'Apply for Partnership',
    sub:'Fill in the form. Our team will review your profile and contact you within ',
    sub2:'24-48 hours', sub3:'.',
    invited:'✓ You were invited with code', invited2:'. Your application will be processed with priority.',
    sec1:'1. Personal Details',
    sec2:'2. Your Social Profile',
    sec3:'3. Payment Method',
    lName:'Full name *', phName:'John Smith',
    lUser:'Desired username *', phUser:'johnsmith',
    lEmail:'Email *', phEmail:'john@gmail.com',
    lPhone:'WhatsApp / Telegram *', phPhone:'+44 7000 000000',
    lCountry:'Country',
    lPlatform:'Main platform',
    lFollowers:'Number of followers *', phFollowers:'10000',
    lProfile:'Profile link (TikTok/Instagram/YouTube) *', phProfile:'https://tiktok.com/@johnsmith',
    profileNote:'Your profile must be public and active',
    lAbout:'Why do you want to join WinPartners?', phAbout:'Briefly describe your audience and how you plan to promote...',
    payNote:'Commissions are paid weekly, minimum $30. You can change your payment method anytime from your account.',
    lPayMethod:'Preferred method', lPayAddr:'Wallet address', phPayAddr:'bc1q... or your address',
    payNote2:'You can leave the address empty now and fill it in after approval from your dashboard.',
    lRef:'Invitation code (if you have one)', phRef:'e.g. REF_ION2026',
    refNote:'Applications with an invitation code are processed with priority',
    errMsg:'⚠ Check marked fields: username min 3 characters, valid email, min 100 followers',
    submit:'SUBMIT APPLICATION →',
    terms:'By submitting, you confirm that the information is accurate and agree to the ',
    termsLink:'terms and conditions',
    terms2:' of WinPartners.',
    hasAccount:'Already have an account?', login:'Log in',
    sent:'Application Submitted!',
    thanks1:'Thank you, ', thanks2:'! Your application has been received and will be reviewed by our team.',
    nextTitle:"What's next:",
    st1t:'Now', st1d:'Your application has been registered and sent to our team',
    st2t:'24-48 hours', st2d:'Our team reviews your profile',
    st3t:'After approval', st3d:'You receive an email with login details and your Melbet code',
    st4t:'Start', st4d:'Log into your dashboard and start earning',
    contact:'💬 Questions? Contact us on WhatsApp or Telegram @winpartners',
    back:'← Back to homepage',
  },
  tr: {
    title:'Ortaklık Başvurusu',
    sub:'Formu doldurun. Ekibimiz profilinizi inceleyip ',
    sub2:'24-48 saat', sub3:' içinde sizinle iletişime geçecektir.',
    invited:'✓ Bu kodla davet edildiniz', invited2:'. Başvurunuz öncelikli olarak işlenecektir.',
    sec1:'1. Kişisel Bilgiler',
    sec2:'2. Sosyal Profiliniz',
    sec3:'3. Ödeme Yöntemi',
    lName:'Ad Soyad *', phName:'Ahmet Yılmaz',
    lUser:'İstenen kullanıcı adı *', phUser:'ahmetyilmaz',
    lEmail:'E-posta *', phEmail:'ahmet@gmail.com',
    lPhone:'WhatsApp / Telegram *', phPhone:'+90 500 000 0000',
    lCountry:'Ülke',
    lPlatform:'Ana Platform',
    lFollowers:'Takipçi Sayısı *', phFollowers:'10000',
    lProfile:'Profil linki (TikTok/Instagram/YouTube) *', phProfile:'https://tiktok.com/@ahmetyilmaz',
    profileNote:'Profiliniz herkese açık ve aktif olmalıdır',
    lAbout:'Neden WinPartners\'a katılmak istiyorsunuz?', phAbout:'Kitlenizi ve nasıl tanıtım yapmayı planladığınızı kısaca açıklayın...',
    payNote:'Komisyonlar haftalık ödenir, minimum $30. Ödeme yöntemini hesabınızdan istediğiniz zaman değiştirebilirsiniz.',
    lPayMethod:'Tercih edilen yöntem', lPayAddr:'Cüzdan adresi', phPayAddr:'bc1q... veya adresiniz',
    payNote2:'Adresi boş bırakıp onaydan sonra panelden doldurabilirsiniz.',
    lRef:'Davet kodu (varsa)', phRef:'örn: REF_ION2026',
    refNote:'Davet kodlu başvurular öncelikli işlenir',
    errMsg:'⚠ İşaretli alanları kontrol edin: kullanıcı adı min 3 karakter, geçerli e-posta, min 100 takipçi',
    submit:'BAŞVURU GÖNDER →',
    terms:'Başvuru göndererek bilgilerin doğru olduğunu onaylıyor ve WinPartners ',
    termsLink:'kullanım şartlarını',
    terms2:' kabul ediyorsunuz.',
    hasAccount:'Zaten hesabınız var mı?', login:'Giriş yapın',
    sent:'Başvurunuz Alındı!',
    thanks1:'Teşekkürler, ', thanks2:'! Başvurunuz alındı ve ekibimiz tarafından incelenecektir.',
    nextTitle:'Sıradakiler:',
    st1t:'Şimdi', st1d:'Başvurunuz kaydedildi ve ekibimize iletildi',
    st2t:'24-48 saat', st2d:'Ekibimiz profilinizi inceler',
    st3t:'Onaydan sonra', st3d:'Giriş bilgileri ve Melbet kodunuzla e-posta alırsınız',
    st4t:'Başlangıç', st4d:'Panele giriş yapın ve kazanmaya başlayın',
    contact:'💬 Sorularınız mı var? WhatsApp veya Telegram @winpartners',
    back:'← Ana sayfaya dön',
  },
  de: {
    title:'Partnerschaft beantragen',
    sub:'Füllen Sie das Formular aus. Unser Team überprüft Ihr Profil und kontaktiert Sie innerhalb von ',
    sub2:'24-48 Stunden', sub3:'.',
    invited:'✓ Sie wurden mit dem Code eingeladen', invited2:'. Ihre Bewerbung wird vorrangig bearbeitet.',
    sec1:'1. Persönliche Daten',
    sec2:'2. Ihr soziales Profil',
    sec3:'3. Zahlungsmethode',
    lName:'Vollständiger Name *', phName:'Max Mustermann',
    lUser:'Gewünschter Benutzername *', phUser:'maxmustermann',
    lEmail:'E-Mail *', phEmail:'max@gmail.com',
    lPhone:'WhatsApp / Telegram *', phPhone:'+49 170 000 0000',
    lCountry:'Land',
    lPlatform:'Hauptplattform',
    lFollowers:'Anzahl Follower *', phFollowers:'10000',
    lProfile:'Profillink (TikTok/Instagram/YouTube) *', phProfile:'https://tiktok.com/@maxmustermann',
    profileNote:'Ihr Profil muss öffentlich und aktiv sein',
    lAbout:'Warum möchten Sie WinPartners beitreten?', phAbout:'Beschreiben Sie kurz Ihr Publikum und wie Sie planen zu werben...',
    payNote:'Provisionen werden wöchentlich ausgezahlt, mindestens $30. Sie können die Zahlungsmethode jederzeit ändern.',
    lPayMethod:'Bevorzugte Methode', lPayAddr:'Wallet-Adresse', phPayAddr:'bc1q... oder Ihre Adresse',
    payNote2:'Sie können die Adresse leer lassen und nach Genehmigung im Dashboard ausfüllen.',
    lRef:'Einladungscode (falls vorhanden)', phRef:'z.B. REF_ION2026',
    refNote:'Bewerbungen mit Einladungscode werden vorrangig bearbeitet',
    errMsg:'⚠ Überprüfen Sie markierte Felder: Benutzername min 3 Zeichen, gültige E-Mail, min 100 Follower',
    submit:'BEWERBUNG EINREICHEN →',
    terms:'Mit dem Absenden bestätigen Sie, dass die Informationen korrekt sind und stimmen den ',
    termsLink:'Nutzungsbedingungen',
    terms2:' von WinPartners zu.',
    hasAccount:'Haben Sie bereits ein Konto?', login:'Anmelden',
    sent:'Bewerbung eingereicht!',
    thanks1:'Danke, ', thanks2:'! Ihre Bewerbung wurde erhalten und wird von unserem Team geprüft.',
    nextTitle:'Was passiert als nächstes:',
    st1t:'Jetzt', st1d:'Ihre Bewerbung wurde registriert und an unser Team gesendet',
    st2t:'24-48 Stunden', st2d:'Unser Team überprüft Ihr Profil',
    st3t:'Nach Genehmigung', st3d:'Sie erhalten eine E-Mail mit Anmeldedaten und Ihrem Melbet-Code',
    st4t:'Start', st4d:'Melden Sie sich im Dashboard an und beginnen Sie zu verdienen',
    contact:'💬 Fragen? Kontaktieren Sie uns auf WhatsApp oder Telegram @winpartners',
    back:'← Zurück zur Startseite',
  },
  pt: {
    title:'Candidatar-se à Parceria',
    sub:'Preencha o formulário. Nossa equipe analisará seu perfil e entrará em contato em ',
    sub2:'24-48 horas', sub3:'.',
    invited:'✓ Você foi convidado com o código', invited2:'. Sua candidatura será processada com prioridade.',
    sec1:'1. Dados Pessoais',
    sec2:'2. Seu Perfil Social',
    sec3:'3. Método de Pagamento',
    lName:'Nome completo *', phName:'João Silva',
    lUser:'Nome de usuário desejado *', phUser:'joaosilva',
    lEmail:'Email *', phEmail:'joao@gmail.com',
    lPhone:'WhatsApp / Telegram *', phPhone:'+351 900 000 000',
    lCountry:'País',
    lPlatform:'Plataforma principal',
    lFollowers:'Número de seguidores *', phFollowers:'10000',
    lProfile:'Link do perfil (TikTok/Instagram/YouTube) *', phProfile:'https://tiktok.com/@joaosilva',
    profileNote:'O seu perfil deve ser público e ativo',
    lAbout:'Por que quer se juntar ao WinPartners?', phAbout:'Descreva brevemente seu público e como planeia promover...',
    payNote:'As comissões são pagas semanalmente, mínimo $30. Pode alterar o método de pagamento a qualquer momento.',
    lPayMethod:'Método preferido', lPayAddr:'Endereço da carteira', phPayAddr:'bc1q... ou o seu endereço',
    payNote2:'Pode deixar o endereço em branco e preenchê-lo após aprovação no painel.',
    lRef:'Código de convite (se tiver)', phRef:'ex: REF_ION2026',
    refNote:'Candidaturas com código de convite são processadas com prioridade',
    errMsg:'⚠ Verifique os campos marcados: nome de usuário mín 3 caracteres, email válido, mín 100 seguidores',
    submit:'ENVIAR CANDIDATURA →',
    terms:'Ao submeter, confirma que as informações são precisas e concorda com os ',
    termsLink:'termos e condições',
    terms2:' da WinPartners.',
    hasAccount:'Já tem uma conta?', login:'Entrar',
    sent:'Candidatura enviada!',
    thanks1:'Obrigado, ', thanks2:'! A sua candidatura foi recebida e será analisada pela nossa equipe.',
    nextTitle:'O que vem a seguir:',
    st1t:'Agora', st1d:'A sua candidatura foi registada e enviada à nossa equipe',
    st2t:'24-48 horas', st2d:'A nossa equipa analisa o seu perfil',
    st3t:'Após aprovação', st3d:'Recebe email com dados de acesso e o seu código Melbet',
    st4t:'Início', st4d:'Entre no painel e comece a ganhar',
    contact:'💬 Dúvidas? Contacte-nos no WhatsApp ou Telegram @winpartners',
    back:'← Voltar à página inicial',
  },
  pl: {
    title:'Złóż wniosek o partnerstwo',
    sub:'Wypełnij formularz. Nasz zespół sprawdzi Twój profil i skontaktuje się w ciągu ',
    sub2:'24-48 godzin', sub3:'.',
    invited:'✓ Zostałeś zaproszony kodem', invited2:'. Twój wniosek zostanie rozpatrzony priorytetowo.',
    sec1:'1. Dane osobowe',
    sec2:'2. Twój profil społecznościowy',
    sec3:'3. Metoda płatności',
    lName:'Imię i nazwisko *', phName:'Jan Kowalski',
    lUser:'Żądana nazwa użytkownika *', phUser:'jankowalski',
    lEmail:'Email *', phEmail:'jan@gmail.com',
    lPhone:'WhatsApp / Telegram *', phPhone:'+48 500 000 000',
    lCountry:'Kraj',
    lPlatform:'Główna platforma',
    lFollowers:'Liczba obserwujących *', phFollowers:'10000',
    lProfile:'Link do profilu (TikTok/Instagram/YouTube) *', phProfile:'https://tiktok.com/@jankowalski',
    profileNote:'Twój profil musi być publiczny i aktywny',
    lAbout:'Dlaczego chcesz dołączyć do WinPartners?', phAbout:'Krótko opisz swoją publiczność i jak planujesz promować...',
    payNote:'Prowizje są wypłacane co tydzień, minimum $30. Metodę płatności można zmienić w dowolnym momencie.',
    lPayMethod:'Preferowana metoda', lPayAddr:'Adres portfela', phPayAddr:'bc1q... lub Twój adres',
    payNote2:'Możesz zostawić adres pusty i wypełnić go po zatwierdzeniu z panelu.',
    lRef:'Kod zaproszenia (jeśli masz)', phRef:'np. REF_ION2026',
    refNote:'Wnioski z kodem zaproszenia są przetwarzane priorytetowo',
    errMsg:'⚠ Sprawdź zaznaczone pola: nazwa użytkownika min 3 znaki, prawidłowy email, min 100 obserwujących',
    submit:'WYŚLIJ WNIOSEK →',
    terms:'Wysyłając wniosek, potwierdzasz, że informacje są prawdziwe i akceptujesz ',
    termsLink:'warunki korzystania',
    terms2:' WinPartners.',
    hasAccount:'Masz już konto?', login:'Zaloguj się',
    sent:'Wniosek wysłany!',
    thanks1:'Dziękujemy, ', thanks2:'! Twój wniosek został otrzymany i zostanie rozpatrzony przez nasz zespół.',
    nextTitle:'Co dalej:',
    st1t:'Teraz', st1d:'Twój wniosek został zarejestrowany i wysłany do naszego zespołu',
    st2t:'24-48 godzin', st2d:'Nasz zespół analizuje Twój profil',
    st3t:'Po zatwierdzeniu', st3d:'Otrzymasz email z danymi logowania i kodem Melbet',
    st4t:'Start', st4d:'Zaloguj się do panelu i zacznij zarabiać',
    contact:'💬 Masz pytania? Skontaktuj się przez WhatsApp lub Telegram @winpartners',
    back:'← Powrót do strony głównej',
  },
}

async function saveApplication(data) {
  await addApplication(data)
  try {
    await fetch('https://formspree.io/f/mnjyoylo', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify({
        _subject: '🆕 New affiliate application — ' + data.name + ' (' + data.platform + ' · ' + Number(data.followers||0).toLocaleString() + ' followers)',
        name: data.name, username: '@' + data.username, email: data.email,
        phone: data.phone, country: data.country, platform: data.platform,
        followers: data.followers, profile: data.profileLink,
        about: data.aboutYou || '—', pay_method: data.payMethod,
        pay_address: data.payAddress || 'not provided',
        invite_code: data.refCode || '—',
        date: new Date().toLocaleString('ro-RO'),
      })
    })
  } catch(e) {}
}

export default function Register() {
  const [searchParams] = useSearchParams()
  const refCode = searchParams.get('ref') || ''
  const inviteCode = searchParams.get('invite') || ''

  const [lang, setLang] = useState('ro')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name:'', username:'', email:'', phone:'',
    platform:'TikTok', followers:'', country:'Moldova',
    profileLink:'', aboutYou:'',
    refCode: refCode || inviteCode,
    payMethod:'Bitcoin (BTC)', payAddress:'',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const set = k => e => setForm(f => ({...f, [k]: e.target.value}))
  const t = T[lang] || T.ro

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  const validate = () => {
    const e = {}
    if (!form.name.trim() || form.name.trim().length < 2) e.name = true
    if (!form.username.trim() || form.username.trim().length < 3) e.username = true
    if (!form.email.includes('@') || !form.email.includes('.')) e.email = true
    if (!form.phone.trim() || form.phone.trim().length < 6) e.phone = true
    if (!form.profileLink.trim()) e.profileLink = true
    if (!form.followers || +form.followers < 100) e.followers = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) return
    setSubmitting(true)
    await saveApplication(form)
    setStep(2)
    setSubmitting(false)
  }

  const inp = {width:'100%',padding:'11px 14px',fontSize:14,border:'1px solid rgba(255,255,255,0.12)',borderRadius:6,background:'rgba(255,255,255,0.05)',color:'#e2e8f0',outline:'none',boxSizing:'border-box',fontFamily:'inherit'}
  const inpErr = {...inp, borderColor:'#ef4444'}
  const lbl = {fontSize:11,color:'rgba(255,255,255,0.45)',marginBottom:5,display:'block',fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em'}
  const sec = {fontSize:11,color:gold,fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em',borderBottom:'1px solid rgba(245,166,35,0.15)',paddingBottom:8,marginTop:8}

  const Nav = () => (
    <nav style={{background:'rgba(10,10,15,0.97)',borderBottom:'1px solid rgba(245,166,35,0.12)',padding:'0 1rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:56,position:'sticky',top:0,zIndex:50}}>
      <div onClick={() => navigate('/')} style={{fontSize:18,fontWeight:900,cursor:'pointer',display:'flex',alignItems:'center',gap:8}}>
        <img src="/icons/logo.png" width="24" height="24" alt="W" style={{borderRadius:3}}/>
        <span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span>
      </div>
      <div style={{display:'flex',gap:4,flexWrap:'wrap',justifyContent:'flex-end'}}>
        {LANGS.map(l => (
          <button key={l} onClick={() => setLang(l)} style={{padding:'3px 6px',fontSize:10,fontWeight:700,cursor:'pointer',border:`1px solid ${lang===l?gold:'rgba(255,255,255,0.15)'}`,borderRadius:4,background:lang===l?'rgba(245,166,35,0.15)':'none',color:lang===l?gold:'rgba(255,255,255,0.4)'}}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </nav>
  )

  // PASUL 2 — Confirmare
  if (step === 2) return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',fontFamily:'Inter,sans-serif'}}>
      <Nav/>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'3rem 1.5rem'}}>
        <div style={{textAlign:'center',maxWidth:520,width:'100%'}}>
          <div style={{width:88,height:88,borderRadius:'50%',background:'rgba(245,166,35,0.1)',border:`2px solid ${gold}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:40,margin:'0 auto 28px'}}>
            📬
          </div>
          <h2 style={{fontSize:26,fontWeight:900,color:'#fff',marginBottom:12,textTransform:'uppercase'}}>
            {t.sent}
          </h2>
          <p style={{color:'rgba(255,255,255,0.55)',marginBottom:28,lineHeight:1.8,fontSize:14}}>
            {t.thanks1}<strong style={{color:'#fff'}}>{form.name}</strong>{t.thanks2}
          </p>
          <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(245,166,35,0.15)',borderRadius:12,padding:'1.5rem',marginBottom:24,textAlign:'left'}}>
            <div style={{fontSize:12,color:gold,fontWeight:700,marginBottom:16,textTransform:'uppercase',letterSpacing:'.08em'}}>{t.nextTitle}</div>
            {[
              ['📬', t.st1t, t.st1d],
              ['🔍', t.st2t, t.st2d],
              ['✅', t.st3t, t.st3d],
              ['🚀', t.st4t, t.st4d],
            ].map(([icon, time, text]) => (
              <div key={time} style={{display:'flex',gap:12,marginBottom:12,alignItems:'flex-start'}}>
                <span style={{fontSize:18,flexShrink:0}}>{icon}</span>
                <div>
                  <div style={{fontSize:11,color:gold,fontWeight:700,marginBottom:2}}>{time}</div>
                  <div style={{fontSize:13,color:'rgba(255,255,255,0.6)',lineHeight:1.5}}>{text}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{background:'rgba(59,130,246,0.08)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:8,padding:'12px 16px',marginBottom:24,fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.6}}>
            {t.contact}
          </div>
          <button onClick={() => navigate('/')} style={{padding:'12px 32px',fontSize:14,fontWeight:700,cursor:'pointer',border:'1px solid rgba(255,255,255,0.15)',borderRadius:6,background:'none',color:'rgba(255,255,255,0.6)',fontFamily:'inherit'}}>
            {t.back}
          </button>
        </div>
      </div>
    </div>
  )

  // PASUL 1 — Formular
  return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',fontFamily:'Inter,sans-serif',overflowX:'hidden'}}>
      <Nav/>
      <div style={{maxWidth:600,margin:'0 auto',padding:isMobile?'1.5rem 1rem':'3rem 1.5rem'}}>
        <div style={{marginBottom:32}}>
          {(refCode || inviteCode) && (
            <div style={{background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:8,padding:'10px 14px',marginBottom:20,fontSize:13,color:'#10b981',display:'flex',alignItems:'center',gap:8}}>
              {t.invited} <strong style={{fontFamily:'monospace'}}>{refCode || inviteCode}</strong>{t.invited2}
            </div>
          )}
          <h1 style={{fontSize:isMobile?22:28,fontWeight:900,color:'#fff',marginBottom:8,textTransform:'uppercase'}}>
            {t.title}
          </h1>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:14,lineHeight:1.6}}>
            {t.sub}<strong style={{color:'#fff'}}>{t.sub2}</strong>{t.sub3}
          </p>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:18}}>
          <div style={sec}>{t.sec1}</div>

          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:14}}>
            <div>
              <label style={lbl}>{t.lName}</label>
              <input style={errors.name?inpErr:inp} value={form.name} onChange={set('name')} placeholder={t.phName}/>
            </div>
            <div>
              <label style={lbl}>{t.lUser}</label>
              <input style={errors.username?inpErr:inp} value={form.username} onChange={set('username')} placeholder={t.phUser} onInput={e=>e.target.value=e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,'')}/>
            </div>
          </div>

          <div>
            <label style={lbl}>{t.lEmail}</label>
            <input style={errors.email?inpErr:inp} type="email" value={form.email} onChange={set('email')} placeholder={t.phEmail}/>
          </div>

          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:14}}>
            <div>
              <label style={lbl}>{t.lPhone}</label>
              <input style={errors.phone?inpErr:inp} value={form.phone} onChange={set('phone')} placeholder={t.phPhone}/>
            </div>
            <div>
              <label style={lbl}>{t.lCountry}</label>
              <select style={inp} value={form.country} onChange={set('country')}>
                {COUNTRIES.map(c => <option key={c} style={{background:'#1a1a2e'}}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={sec}>{t.sec2}</div>

          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:14}}>
            <div>
              <label style={lbl}>{t.lPlatform}</label>
              <select style={inp} value={form.platform} onChange={set('platform')}>
                {PLATFORMS.map(p => <option key={p} style={{background:'#1a1a2e'}}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>{t.lFollowers}</label>
              <input style={errors.followers?inpErr:inp} type="number" value={form.followers} onChange={set('followers')} placeholder={t.phFollowers} min="100"/>
            </div>
          </div>

          <div>
            <label style={lbl}>{t.lProfile}</label>
            <input style={errors.profileLink?inpErr:inp} value={form.profileLink} onChange={set('profileLink')} placeholder={t.phProfile}/>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.3)',marginTop:4}}>{t.profileNote}</div>
          </div>

          <div>
            <label style={lbl}>{t.lAbout}</label>
            <textarea style={{...inp,minHeight:80,resize:'vertical'}} value={form.aboutYou} onChange={set('aboutYou')} placeholder={t.phAbout}/>
          </div>

          <div style={sec}>{t.sec3}</div>

          <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(245,166,35,0.1)',borderRadius:8,padding:'14px'}}>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:14,lineHeight:1.6}}>{t.payNote}</div>
            <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:14}}>
              <div>
                <label style={lbl}>{t.lPayMethod}</label>
                <select style={inp} value={form.payMethod} onChange={set('payMethod')}>
                  {['Bitcoin (BTC)','USDT (TRC20)','USDT (ERC20)','Ethereum (ETH)','Binance Pay','Skrill','Neteller'].map(m => (
                    <option key={m} style={{background:'#1a1a2e'}}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={lbl}>{t.lPayAddr}</label>
                <input style={inp} value={form.payAddress} onChange={set('payAddress')} placeholder={t.phPayAddr}/>
              </div>
            </div>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.25)',marginTop:10}}>{t.payNote2}</div>
          </div>

          <div>
            <label style={lbl}>{t.lRef}</label>
            <input style={inp} value={form.refCode} onChange={set('refCode')} placeholder={t.phRef}/>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.3)',marginTop:4}}>{t.refNote}</div>
          </div>

          {Object.keys(errors).length > 0 && (
            <div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:6,padding:'10px 14px',fontSize:13,color:'#ef4444'}}>
              {t.errMsg}
            </div>
          )}

          <button onClick={submit} disabled={submitting} style={{padding:'15px',fontSize:15,fontWeight:800,cursor:submitting?'not-allowed':'pointer',border:'none',borderRadius:8,background:submitting?'rgba(245,166,35,0.5)':gold,color:'#000',marginTop:4,textTransform:'uppercase',letterSpacing:'.05em',fontFamily:'inherit',opacity:submitting?0.7:1}}>
            {submitting ? '...' : t.submit}
          </button>

          <p style={{textAlign:'center',fontSize:11,color:'rgba(255,255,255,0.2)',lineHeight:1.6}}>
            {t.terms}<span style={{color:gold,cursor:'pointer'}} onClick={()=>navigate('/terms')}>{t.termsLink}</span>{t.terms2}
          </p>

          <p style={{textAlign:'center',fontSize:13,color:'rgba(255,255,255,0.35)'}}>
            {t.hasAccount} <span onClick={() => navigate('/dashboard')} style={{color:gold,cursor:'pointer',fontWeight:600}}>{t.login}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
