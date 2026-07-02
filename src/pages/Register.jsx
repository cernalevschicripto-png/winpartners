import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { addApplication, sendTelegramNotif, getBloggers, getApplications } from '../db.js'

const gold = '#f5a623'
const PLATFORMS = ['TikTok','Instagram','YouTube','Telegram','Facebook','Twitter/X','Other']
const COUNTRIES = ['Moldova','România','Ucraina','Rusia','Kazakhstan','Belarus','Georgia','Armenia','Azerbaijan','Turcia','Germania','Polonia','Portugalia','Altă țară']
const LANGS = ['ro','ru','en','tr','de','pt','pl']

const T = {
  ro: {
    title:'Aplică pentru parteneriat',
    sub:'Completează formularul — durează 2 minute. Verificăm că profilul e activ și public, apoi îți trimitem accesul la cazinouri în ',
    sub2:'24-48 de ore', sub3:'.',
    invited:'✓ Ai fost invitat cu codul', invited2:'. Cererea ta va fi procesată prioritar.',
    sec1:'Date personale',
    sec2:'Profilul social',
    sec3:'Metoda de plată',
    lName:'Nume complet', phName:'Nume Prenume',
    lUser:'Username dorit', phUser:'username',
    lEmail:'Email', phEmail:'email@exemplu.com',
    lPhone:'Telegram', phPhone:'@username',
    lCountry:'Țara',
    lPlatform:'Platforma principală',
    lFollowers:'Număr urmăritori', phFollowers:'10000',
    lProfile:'Link profil (TikTok/Instagram/YouTube)', phProfile:'https://tiktok.com/@username',
    profileNote:'Profilul trebuie să fie public și activ',
    lAbout:'De ce vrei să te alături WinPartners?', phAbout:'Descrie pe scurt audiența ta și cum planifici să promovezi...',
    payNote:'Comisioanele vor fi plătite săptămânal, minim $30. Poți modifica metoda de plată oricând.',
    lPayMethod:'Metoda preferată', lPayAddr:'Adresa portofelului', phPayAddr:'bc1q... sau adresa ta',
    payNote2:'Poți lăsa adresa goală acum și o completezi după aprobare.',
    lRef:'Cod de invitație (opțional)', phRef:'ex: REF_ION2026',
    refNote:'Cererile cu cod de invitație sunt procesate prioritar',
    errMsg:'Verifică câmpurile marcate: username minim 3 caractere, email valid, minim 100 urmăritori',
    submit:'TRIMITE CEREREA',
    terms:'Prin trimiterea cererii, confirmi că informațiile sunt reale și ești de acord cu ',
    termsLink:'termenii și condițiile',
    terms2:' WinPartners.',
    hasAccount:'Ai deja cont?', login:'Conectați-vă',
    sent:'Cererea a fost trimisă!',
    thanks1:'Mulțumim, ', thanks2:'! Cererea ta a fost primită și va fi analizată de echipa noastră.',
    nextTitle:'Ce urmează:',
    st1t:'Acum', st1d:'Cererea ta a fost înregistrată și trimisă echipei noastre',
    st2t:'24-48 ore', st2d:'Verificăm că profilul tău e activ și public. 95% din cereri sunt aprobate.',
    st3t:'După aprobare', st3d:'Te loghezi cu username-ul și parola alese acum; managerul îți confirmă aprobarea',
    st4t:'Start', st4d:'Intri în dashboard și începi să câștigi',
    contact:'Întrebări? Scrie-ne direct pe Telegram',
    back:'← Înapoi la pagina principală',
    step1:'Date personale', step2:'Profil', step3:'Plată',
    required:'câmp obligatoriu',
    sideTitle:'De ce WinPartners?',
    side1:'25% RevShare pe viață din fiecare jucător recomandat',
    side2:'Plăți săptămânale garantate — minim $30',
    side3:'Cod promoțional propriu în 24-48 ore',
    side4:'Manager personal pe Telegram',
    side5:'Acces la Melbet, 1xBet, Mostbet dintr-un loc',
    appr_pct:'95%', appr_label:'aprobare', appr_text:'Procesăm în 24-48 ore. Telegram rapid.',
  },
  ru: {
    title:'Подать заявку на партнёрство',
    sub:'Заполните форму — займёт 2 минуты. Мы проверим профиль и отправим доступ к казино в течение ',
    sub2:'24-48 часов', sub3:'.',
    invited:'✓ Вас пригласили с кодом', invited2:'. Ваша заявка будет обработана приоритетно.',
    sec1:'Личные данные',
    sec2:'Социальный профиль',
    sec3:'Способ оплаты',
    lName:'Полное имя', phName:'Имя Фамилия',
    lUser:'Желаемый логин', phUser:'username',
    lEmail:'Email', phEmail:'email@example.com',
    lPhone:'Telegram', phPhone:'@username',
    lCountry:'Страна',
    lPlatform:'Основная платформа',
    lFollowers:'Количество подписчиков', phFollowers:'10000',
    lProfile:'Ссылка на профиль (TikTok/Instagram/YouTube)', phProfile:'https://tiktok.com/@username',
    profileNote:'Профиль должен быть публичным и активным',
    lAbout:'Почему хотите присоединиться к WinPartners?', phAbout:'Коротко опишите вашу аудиторию и как планируете продвигать...',
    payNote:'Комиссии выплачиваются еженедельно, минимум $30. Способ оплаты можно изменить в любое время.',
    lPayMethod:'Предпочитаемый способ', lPayAddr:'Адрес кошелька', phPayAddr:'bc1q... или ваш адрес',
    payNote2:'Адрес можно оставить пустым и заполнить после одобрения.',
    lRef:'Код приглашения (если есть)', phRef:'напр. REF_ION2026',
    refNote:'Заявки с кодом приглашения обрабатываются приоритетно',
    errMsg:'Проверьте отмеченные поля: логин мин 3 символа, корректный email, мин 100 подписчиков',
    submit:'ОТПРАВИТЬ ЗАЯВКУ',
    terms:'Отправляя заявку, вы подтверждаете достоверность данных и соглашаетесь с ',
    termsLink:'условиями',
    terms2:' WinPartners.',
    hasAccount:'Уже есть аккаунт?', login:'Войти',
    sent:'Заявка отправлена!',
    thanks1:'Спасибо, ', thanks2:'! Заявка получена и будет рассмотрена командой.',
    nextTitle:'Что дальше:',
    st1t:'Сейчас', st1d:'Заявка зарегистрирована и передана команде',
    st2t:'24-48 часов', st2d:'Проверяем профиль. 95% заявок одобряются.',
    st3t:'После одобрения', st3d:'Входишь с выбранными логином и паролем; менеджер подтвердит одобрение',
    st4t:'Старт', st4d:'Входите в дашборд и начинаете зарабатывать',
    contact:'Вопросы? Пишите нам в Telegram',
    back:'← На главную',
    step1:'Данные', step2:'Профиль', step3:'Оплата',
    required:'обязательное поле',
    sideTitle:'Почему WinPartners?',
    side1:'25% RevShare пожизненно с каждого привлечённого игрока',
    side2:'Гарантированные еженедельные выплаты — минимум $30',
    side3:'Персональный промокод за 24-48 часов',
    side4:'Личный менеджер в Telegram',
    side5:'Доступ к Melbet, 1xBet, Mostbet из одного места',
    appr_pct:'95%', appr_label:'одобрение', appr_text:'Обрабатываем 24-48 ч. Быстрый ответ в Telegram.',
  },
  en: {
    title:'Apply for Partnership',
    sub:'Fill out the form — takes 2 minutes. We verify your profile and send your casino access within ',
    sub2:'24-48 hours', sub3:'.',
    invited:'✓ You were invited with code', invited2:'. Your application will be processed with priority.',
    sec1:'Personal Details',
    sec2:'Social Profile',
    sec3:'Payment Method',
    lName:'Full name', phName:'John Smith',
    lUser:'Desired username', phUser:'username',
    lEmail:'Email', phEmail:'email@example.com',
    lPhone:'Telegram', phPhone:'@username',
    lCountry:'Country',
    lPlatform:'Main platform',
    lFollowers:'Number of followers', phFollowers:'10000',
    lProfile:'Profile link (TikTok/Instagram/YouTube)', phProfile:'https://tiktok.com/@username',
    profileNote:'Your profile must be public and active',
    lAbout:'Why do you want to join WinPartners?', phAbout:'Briefly describe your audience and how you plan to promote...',
    payNote:'Commissions are paid weekly, minimum $30. Change your payment method anytime.',
    lPayMethod:'Preferred method', lPayAddr:'Wallet address', phPayAddr:'bc1q... or your address',
    payNote2:'You can leave the address empty and fill it in after approval.',
    lRef:'Invitation code (optional)', phRef:'e.g. REF_ION2026',
    refNote:'Applications with an invitation code are processed with priority',
    errMsg:'Check marked fields: username min 3 characters, valid email, min 100 followers',
    submit:'SUBMIT APPLICATION',
    terms:'By submitting, you confirm the information is accurate and agree to the ',
    termsLink:'terms and conditions',
    terms2:' of WinPartners.',
    hasAccount:'Already have an account?', login:'Log in',
    sent:'Application Submitted!',
    thanks1:'Thank you, ', thanks2:'! Your application has been received and will be reviewed by our team.',
    nextTitle:"What's next:",
    st1t:'Now', st1d:'Your application has been registered and sent to our team',
    st2t:'24-48 hours', st2d:'We review your profile. 95% of applications are approved.',
    st3t:'After approval', st3d:'You log in with the username and password you just chose; the manager confirms approval',
    st4t:'Start', st4d:'Log into your dashboard and start earning',
    contact:'Questions? Contact us on Telegram',
    back:'← Back to homepage',
    step1:'Details', step2:'Profile', step3:'Payment',
    required:'required',
    sideTitle:'Why WinPartners?',
    side1:'25% RevShare for life from every referred player',
    side2:'Guaranteed weekly payments — minimum $30',
    side3:'Personal Casino promo code within 24-48 hours',
    side4:'Personal manager on Telegram',
    side5:'Access to Melbet, 1xBet, Mostbet from one place',
    appr_pct:'95%', appr_label:'approval', appr_text:'We process in 24-48h. Fast reply on Telegram.',
  },
  tr: {
    title:'Ortaklık Başvurusu',
    sub:'Formu doldurun — 2 dakika sürer. Profilinizi doğrulayıp casino erişiminizi ',
    sub2:'24-48 saat', sub3:' içinde göndeririz.',
    invited:'Kodla davet edildiniz', invited2:'. Başvurunuz öncelikli olarak işlenecektir.',
    sec1:'Kişisel Bilgiler', sec2:'Sosyal Profil', sec3:'Ödeme Yöntemi',
    lName:'Ad Soyad', phName:'Ahmet Yilmaz', lUser:'Kullanıcı adı', phUser:'ahmetyilmaz',
    lEmail:'E-posta', phEmail:'email@ornek.com', lPhone:'Telegram', phPhone:'@username',
    lCountry:'Ülke', lPlatform:'Ana Platform', lFollowers:'Takipçi Sayısı', phFollowers:'10000',
    lProfile:'Profil linki (TikTok/Instagram/YouTube)', phProfile:'https://tiktok.com/@username',
    profileNote:'Profiliniz herkese açık ve aktif olmalıdır',
    lAbout:'Neden WinPartners katılmak istiyorsunuz?', phAbout:'Kitlenizi ve planlarınızı kısaca açıklayın...',
    payNote:'Komisyonlar haftalık ödenir, minimum $30.',
    lPayMethod:'Tercih edilen yöntem', lPayAddr:'Cüzdan adresi', phPayAddr:'bc1q... veya adresiniz',
    payNote2:'Adresi boş bırakıp onaydan sonra doldurabilirsiniz.',
    lRef:'Davet kodu (opsiyonel)', phRef:'örn: REF_ION2026',
    refNote:'Davet kodlu başvurular öncelikli işlenir',
    errMsg:'İşaretli alanları kontrol edin: kullanıcı adı min 3 karakter, geçerli e-posta, min 100 takipçi',
    submit:'BAŞVURUYU GÖNDER',
    terms:'Başvuru göndererek bilgilerin doğru olduğunu ve WinPartners ',
    termsLink:'kullanım sartlarini', terms2:' kabul ediyorsunuz.',
    hasAccount:'Hesabınız var mı?', login:'Giriş yapın',
    sent:'Başvurunuz Alındı!',
    thanks1:'Tesekkurler, ', thanks2:'! Başvurunuz alındı.',
    nextTitle:'Sıradakiler:',
    st1t:'Simdi', st1d:'Başvurunuz kaydedildi', st2t:'24-48 saat', st2d:'Profilinizi inceliyoruz',
    st3t:'Onaydan sonra', st3d:'Şimdi seçtiğin kullanıcı adı ve şifre ile giriş yaparsın; yönetici onaylar',
    st4t:'Baslangiç', st4d:'Panele giris yapın ve kazanmaya başlayın',
    contact:'Sorularınız mı var? Telegram üzerinden yazın',
    back:'Ana sayfaya don',
    step1:'Bilgiler', step2:'Profil', step3:'Odeme',
    required:'zorunlu', sideTitle:'Neden WinPartners?',
    side1:'Her oyuncudan ömür boyu %25 RevShare',
    side2:'Haftalık garantili ödemeler — minimum $30',
    side3:'24-48 saatte kisisel promosyon kodu',
    side4:'Telegram üzerinde kisisel yönetici',
    side5:'Melbet, 1xBet, Mostbet tek yerden',
    appr_pct:'%95', appr_label:'onay', appr_text:'24-48 saatte isliyoruz. Telegram hizli yanit.',
  },
  de: {
    title:'Partnerschaft beantragen',
    sub:'Formular ausfüllen — dauert 2 Minuten. Wir überprüfen Ihr Profil und senden Ihren Casino-Zugang innerhalb von ',
    sub2:'24-48 Stunden', sub3:'.',
    invited:'Mit Code eingeladen', invited2:'. Ihre Bewerbung wird vorrangig bearbeitet.',
    sec1:'Persönliche Daten', sec2:'Soziales Profil', sec3:'Zahlungsmethode',
    lName:'Vollständiger Name', phName:'Max Mustermann', lUser:'Benutzername', phUser:'maxmustermann',
    lEmail:'E-Mail', phEmail:'email@beispiel.com', lPhone:'Telegram', phPhone:'@username',
    lCountry:'Land', lPlatform:'Hauptplattform', lFollowers:'Anzahl Follower', phFollowers:'10000',
    lProfile:'Profillink (TikTok/Instagram/YouTube)', phProfile:'https://tiktok.com/@username',
    profileNote:'Ihr Profil muss öffentlich und aktiv sein',
    lAbout:'Warum möchten Sie WinPartners beitreten?', phAbout:'Beschreiben Sie kurz Ihr Publikum...',
    payNote:'Provisionen werden wöchentlich ausgezahlt, mindestens $30.',
    lPayMethod:'Bevorzugte Methode', lPayAddr:'Wallet-Adresse', phPayAddr:'bc1q... oder Ihre Adresse',
    payNote2:'Sie können die Adresse leer lassen und später ausfüllen.',
    lRef:'Einladungscode (optional)', phRef:'z.B. REF_ION2026',
    refNote:'Bewerbungen mit Einladungscode werden vorrangig bearbeitet',
    errMsg:'Überprüfen Sie markierte Felder: Benutzername min 3 Zeichen, gültige E-Mail, min 100 Follower',
    submit:'BEWERBUNG EINREICHEN',
    terms:'Mit dem Absenden bestätigen Sie die Richtigkeit der Daten und stimmen den ',
    termsLink:'Nutzungsbedingungen', terms2:' von WinPartners zu.',
    hasAccount:'Haben Sie bereits ein Konto?', login:'Anmelden',
    sent:'Bewerbung eingereicht!',
    thanks1:'Danke, ', thanks2:'! Ihre Bewerbung wurde erhalten.',
    nextTitle:'Was passiert als nächstes:',
    st1t:'Jetzt', st1d:'Bewerbung registriert', st2t:'24-48 Stunden', st2d:'Wir überprüfen Ihr Profil',
    st3t:'Nach Genehmigung', st3d:'Du meldest dich mit gewähltem Benutzernamen und Passwort an; der Manager bestätigt',
    st4t:'Start', st4d:'Dashboard öffnen und verdienen',
    contact:'Fragen? Schreiben Sie uns auf Telegram',
    back:'← Zurück zur Startseite',
    step1:'Daten', step2:'Profil', step3:'Zahlung',
    required:'erforderlich', sideTitle:'Warum WinPartners?',
    side1:'25% RevShare lebenslang pro weitergegebenem Spieler',
    side2:'Garantierte wöchentliche Auszahlungen — mindestens $30',
    side3:'Persönlicher Promo-Code in 24-48 Stunden',
    side4:'Persönlicher Manager auf Telegram',
    side5:'Zugang zu Melbet, 1xBet, Mostbet von einem Ort',
    appr_pct:'95%', appr_label:'Genehmigung', appr_text:'Bearbeitung 24-48h. Schnelle Telegram-Antwort.',
  },
  pt: {
    title:'Candidatura à Parceria',
    sub:'Preencha o formulário — leva 2 minutos. Verificamos seu perfil e enviamos o acesso ao casino em ',
    sub2:'24-48 horas', sub3:'.',
    invited:'Convidado com código', invited2:'. Sua candidatura será processada com prioridade.',
    sec1:'Dados Pessoais', sec2:'Perfil Social', sec3:'Método de Pagamento',
    lName:'Nome completo', phName:'João Silva', lUser:'Nome de usuário', phUser:'joaosilva',
    lEmail:'Email', phEmail:'email@exemplo.com', lPhone:'Telegram', phPhone:'@username',
    lCountry:'País', lPlatform:'Plataforma principal', lFollowers:'Número de seguidores', phFollowers:'10000',
    lProfile:'Link do perfil (TikTok/Instagram/YouTube)', phProfile:'https://tiktok.com/@username',
    profileNote:'Seu perfil deve ser público e ativo',
    lAbout:'Por que quer entrar no WinPartners?', phAbout:'Descreva seu público e como planeja promover...',
    payNote:'Comissões pagas semanalmente, mínimo $30.',
    lPayMethod:'Método preferido', lPayAddr:'Endereço da carteira', phPayAddr:'bc1q... ou seu endereço',
    payNote2:'Pode deixar o endereço vazio e preencher após aprovação.',
    lRef:'Código de convite (opcional)', phRef:'ex: REF_ION2026',
    refNote:'Candidaturas com código de convite são processadas com prioridade',
    errMsg:'Verifique os campos marcados: nome de usuário mín 3 caracteres, email válido, mín 100 seguidores',
    submit:'ENVIAR CANDIDATURA',
    terms:'Ao enviar, confirma que as informações são precisas e concorda com os ',
    termsLink:'termos e condições', terms2:' da WinPartners.',
    hasAccount:'Já tem uma conta?', login:'Entrar',
    sent:'Candidatura Enviada!',
    thanks1:'Obrigado, ', thanks2:'! Sua candidatura foi recebida.',
    nextTitle:'O que vem a seguir:',
    st1t:'Agora', st1d:'Candidatura registrada', st2t:'24-48 horas', st2d:'Analisamos seu perfil',
    st3t:'Após aprovação', st3d:'Entras com o utilizador e senha escolhidos agora; o gestor confirma',
    st4t:'Início', st4d:'Entre no painel e comece a ganhar',
    contact:'Dúvidas? Contate-nos no Telegram',
    back:'← Voltar à página inicial',
    step1:'Dados', step2:'Perfil', step3:'Pagamento',
    required:'obrigatório', sideTitle:'Por que WinPartners?',
    side1:'25% RevShare vitalício por cada jogador indicado',
    side2:'Pagamentos semanais garantidos — mínimo $30',
    side3:'Código promocional pessoal em 24-48 horas',
    side4:'Gerente pessoal no Telegram',
    side5:'Acesso a Melbet, 1xBet, Mostbet de um lugar',
    appr_pct:'95%', appr_label:'aprovacao', appr_text:'Processamos em 24-48h. Resposta rapida Telegram.',
  },
  pl: {
    title:'Złóż Wniosek o Partnerstwo',
    sub:'Wypełnij formularz — zajmuje 2 minuty. Sprawdzamy Twój profil i wysyłamy dostęp do kasyna w ciągu ',
    sub2:'24-48 godzin', sub3:'.',
    invited:'Zaproszony z kodem', invited2:'. Wniosek zostanie rozpatrzony priorytetowo.',
    sec1:'Dane Osobowe', sec2:'Profil Społecznościowy', sec3:'Metoda Płatności',
    lName:'Imię i nazwisko', phName:'Jan Kowalski', lUser:'Nazwa użytkownika', phUser:'jankowalski',
    lEmail:'Email', phEmail:'email@przyklad.com', lPhone:'Telegram', phPhone:'@username',
    lCountry:'Kraj', lPlatform:'Główna platforma', lFollowers:'Liczba obserwujących', phFollowers:'10000',
    lProfile:'Link do profilu (TikTok/Instagram/YouTube)', phProfile:'https://tiktok.com/@username',
    profileNote:'Twój profil musi być publiczny i aktywny',
    lAbout:'Dlaczego chcesz dołączyć do WinPartners?', phAbout:'Krótko opisz swoją publiczność...',
    payNote:'Prowizje wypłacane co tydzień, minimum $30.',
    lPayMethod:'Preferowana metoda', lPayAddr:'Adres portfela', phPayAddr:'bc1q... lub Twój adres',
    payNote2:'Możesz zostawić adres pusty i wypełnić po zatwierdzeniu.',
    lRef:'Kod zaproszenia (opcjonalny)', phRef:'np. REF_ION2026',
    refNote:'Wnioski z kodem zaproszenia są przetwarzane priorytetowo',
    errMsg:'Sprawdź zaznaczone pola: nazwa użytkownika min 3 znaki, prawidłowy email, min 100 obserwujących',
    submit:'WYŚLIJ WNIOSEK',
    terms:'Wysyłając wniosek, potwierdzasz prawdziwość danych i akceptujesz ',
    termsLink:'warunki korzystania', terms2:' WinPartners.',
    hasAccount:'Masz już konto?', login:'Zaloguj się',
    sent:'Wniosek Wysłany!',
    thanks1:'Dziękujemy, ', thanks2:'! Twój wniosek został otrzymany.',
    nextTitle:'Co dalej:',
    st1t:'Teraz', st1d:'Wniosek zarejestrowany', st2t:'24-48 godzin', st2d:'Sprawdzamy Twój profil',
    st3t:'Po zatwierdzeniu', st3d:'Logujesz się wybranym loginem i hasłem; menedżer potwierdzi',
    st4t:'Start', st4d:'Zaloguj się do panelu i zacznij zarabiać',
    contact:'Masz pytania? Skontaktuj się przez Telegram',
    back:'← Powrót do strony głównej',
    step1:'Dane', step2:'Profil', step3:'Platnosc',
    required:'wymagane', sideTitle:'Dlaczego WinPartners?',
    side1:'25% RevShare dożywotnio za każdego poleconego gracza',
    side2:'Gwarantowane wypłaty tygodniowe — minimum $30',
    side3:'Osobisty kod promocyjny w 24-48 godzin',
    side4:'Osobisty menedżer na Telegramie',
    side5:'Dostęp do Melbet, 1xBet, Mostbet z jednego miejsca',
    appr_pct:'95%', appr_label:'zatwierdzenie', appr_text:'Przetwarzamy 24-48h. Szybka odpowiedź Telegram.',
  },
}

async function saveApplication(data) {
  await addApplication(data)
  // Notificare Telegram — fără await, ca să nu blocheze trecerea la pasul de confirmare.
  // Cererea e deja salvată în Firebase; notificarea pleacă în fundal.
  sendTelegramNotif(
    `🆕 <b>Cerere nouă!</b>\n` +
    `👤 ${data.name} (@${data.username})\n` +
    `📱 ${data.platform} · ${Number(data.followers||0).toLocaleString()} urmăritori\n` +
    `🌍 ${data.country||'—'} · ${data.email}\n` +
    `🔗 ${data.profileLink||'—'}\n` +
    `📋 Admin: https://winpartners.pro/sys/ctrl/p8x4`
  ).catch(()=>{})
}

// Inline styles
const inp = {width:'100%',padding:'10px 13px',fontSize:14,border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,background:'rgba(255,255,255,0.04)',color:'#e2e8f0',outline:'none',boxSizing:'border-box',fontFamily:'inherit',transition:'border-color .15s'}
const inpErr = {...inp, borderColor:'rgba(239,68,68,0.7)', background:'rgba(239,68,68,0.04)'}
const lbl = {fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:5,display:'block',fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em'}
const sec = {fontSize:11,color:gold,fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em',paddingBottom:6,marginBottom:4,borderBottom:'1px solid rgba(245,166,35,0.12)'}

export default function Register() {
  const [searchParams] = useSearchParams()
  const refCode = searchParams.get('ref') || ''
  const inviteCode = searchParams.get('invite') || ''

  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('wp_lang')
    return ['ro','ru','en','tr','de','pt','pl'].includes(saved) ? saved : 'ro'
  })
  useEffect(() => {
    if (localStorage.getItem('wp_lang')) return
    const m = {MD:'ro',RO:'ro',RU:'ru',BY:'ru',KZ:'ru',UA:'ru',UZ:'ru',AM:'ru',AZ:'ru',GE:'ru',TJ:'ru',TM:'ru',KG:'ru',TR:'tr',DE:'de',AT:'de',CH:'de',PT:'pt',BR:'pt',PL:'pl'}
    fetch('https://ipapi.co/json/',{signal:AbortSignal.timeout(3000)}).then(r=>r.json()).then(d=>{const _c=d.country_code;const l=(_c&&_c.length===2)?(m[_c]||'en'):null;if(l){setLang(l);localStorage.setItem('wp_lang',l)}}).catch(()=>{})
  }, [])
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name:'', username:'', email:'', phone:'',
    platform:'TikTok', followers:'', country:'Moldova', password:'',
    profileLink:'', aboutYou:'',
    refCode: refCode || inviteCode,
    payMethod:'Bitcoin (BTC)', payAddress:'',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [openDD, setOpenDD] = useState(null)
  const navigate = useNavigate()
  const set = k => e => setForm(f => ({...f, [k]: e.target.value}))
  const t = T[lang] || T.ro

  // Dropdown custom — nu folosește <select> nativ (care e capricios pe Windows/Chrome)
  const Dropdown = ({ id, value, options, onPick }) => {
    const open = openDD === id
    return (
      <div style={{ position:'relative' }}>
        <button type="button"
          onClick={() => setOpenDD(open ? null : id)}
          style={{ ...inp, textAlign:'left', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span>{value}</span>
          <span style={{ fontSize:10, opacity:0.6, transform: open?'rotate(180deg)':'none', transition:'transform .15s' }}>▼</span>
        </button>
        {open && (
          <>
            <div onClick={() => setOpenDD(null)} style={{ position:'fixed', inset:0, zIndex:40 }} />
            <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, right:0, zIndex:50, background:'#1a1a2e', border:'1px solid rgba(245,166,35,0.3)', borderRadius:8, maxHeight:240, overflowY:'auto', boxShadow:'0 10px 30px rgba(0,0,0,0.5)' }}>
              {options.map(opt => (
                <div key={opt} onClick={() => { onPick(opt); setOpenDD(null) }}
                  style={{ padding:'10px 13px', fontSize:14, cursor:'pointer', color: opt===value ? '#f5a623' : '#e2e8f0', background: opt===value ? 'rgba(245,166,35,0.1)' : 'transparent', fontWeight: opt===value ? 700 : 400 }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.06)'}
                  onMouseLeave={e=>e.currentTarget.style.background = opt===value ? 'rgba(245,166,35,0.1)' : 'transparent'}>
                  {opt}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

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
    if (!form.password || form.password.length < 6) e.password = true
    if (!form.phone.trim() || form.phone.trim().length < 6) e.phone = true
    if (!form.profileLink.trim()) e.profileLink = true
    if (!form.followers || +form.followers < 100) e.followers = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) return
    setSubmitting(true)
    try {
      const uname = form.username.trim().toLowerCase()
      const [bl, apps] = await Promise.all([getBloggers().catch(()=>[]), getApplications().catch(()=>[])])
      const takenB = (bl||[]).some(b => (b.username||'').toLowerCase() === uname)
      const takenA = (apps||[]).some(a => a.status==='pending' && (a.username||'').toLowerCase() === uname)
      if (takenB || takenA) {
        const M = {ro:'Username-ul „'+form.username.trim()+'" este deja folosit. Alege altul.',ru:'Имя пользователя «'+form.username.trim()+'» уже занято. Выберите другое.',en:'The username "'+form.username.trim()+'" is already taken. Please choose another one.',tr:'"'+form.username.trim()+'" kullanıcı adı zaten alınmış. Lütfen başka bir tane seç.',de:'Der Benutzername „'+form.username.trim()+'" ist bereits vergeben. Bitte wähle einen anderen.',pt:'O nome de utilizador "'+form.username.trim()+'" já está em uso. Escolhe outro.',pl:'Nazwa użytkownika „'+form.username.trim()+'" jest już zajęta. Wybierz inną.'}
        window.alert(M[lang]||M.ro)
        setErrors(prev=>({ ...prev, username:true }))
        return
      }
      await saveApplication({ ...form, username: uname })
      setStep(2)
    } finally {
      setSubmitting(false)
    }
  }

  const Nav = () => (
    <nav style={{background:'rgba(10,10,15,0.97)',borderBottom:'1px solid rgba(245,166,35,0.1)',padding:'0 1rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:56,position:'sticky',top:0,zIndex:50,backdropFilter:'blur(10px)'}}>
      <div onClick={() => navigate(sessionStorage.getItem('wp_blogger')?'/dashboard':'/')} style={{fontSize:17,fontWeight:900,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
        <img src="/icons/logo.png" width="24" height="24" alt="W" style={{borderRadius:3}}/>
        <span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span>
      </div>
      <div style={{display:'flex',gap:3,overflowX:'auto',scrollbarWidth:'none',maxWidth:isMobile?200:'none',flexShrink:0}}>
        {LANGS.map(l => (
          <button key={l} onClick={() => { setLang(l); localStorage.setItem('wp_lang', l) }} style={{padding:'3px 6px',fontSize:10,fontWeight:700,cursor:'pointer',border:`1px solid ${lang===l?gold:'rgba(255,255,255,0.12)'}`,borderRadius:4,background:lang===l?'rgba(245,166,35,0.12)':'transparent',color:lang===l?gold:'rgba(255,255,255,0.4)',transition:'all .15s',flexShrink:0}}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </nav>
  )

  // Progress steps bar
  const ProgressBar = () => (
    <div style={{display:'flex',alignItems:'center',gap:0,marginBottom:28}}>
      {[[t.step1,1],[t.step2,2],[t.step3,3]].map(([label, n], idx) => (
        <div key={n} style={{display:'flex',alignItems:'center',flex: idx < 2 ? 1 : 'none'}}>
          <div style={{display:'flex',alignItems:'center',gap:7}}>
            <div style={{width:26,height:26,borderRadius:'50%',background:n===1?gold:'rgba(255,255,255,0.06)',border:`1px solid ${n===1?gold:'rgba(255,255,255,0.12)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:n===1?'#000':'rgba(255,255,255,0.3)',flexShrink:0}}>
              {n}
            </div>
            <span style={{fontSize:11,fontWeight:600,color:n===1?gold:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'.05em',whiteSpace:'nowrap'}}>{label}</span>
          </div>
          {idx < 2 && <div style={{flex:1,height:1,background:'rgba(255,255,255,0.08)',margin:'0 12px'}}/>}
        </div>
      ))}
    </div>
  )

  // Confirmation screen
  if (step === 2) return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',fontFamily:'Inter,sans-serif'}}>
      <Nav/>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'2.5rem 1.5rem',minHeight:'calc(100vh - 56px)'}}>
        <div style={{maxWidth:520,width:'100%'}}>

          {/* Check icon */}
          <div style={{textAlign:'center',marginBottom:28}}>
            <div style={{width:80,height:80,borderRadius:'50%',background:'rgba(16,185,129,0.1)',border:'2px solid rgba(16,185,129,0.4)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 style={{fontSize:22,fontWeight:900,color:'#fff',marginBottom:8,textTransform:'uppercase',letterSpacing:'.03em'}}>
              {t.sent}
            </h2>
            <p style={{color:'rgba(255,255,255,0.5)',lineHeight:1.75,fontSize:14}}>
              {t.thanks1}<strong style={{color:'#fff'}}>{form.name}</strong>{t.thanks2}
            </p>
          </div>

          {/* Next steps */}
          <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'1.25rem 1.5rem',marginBottom:20}}>
            <div style={{fontSize:11,color:gold,fontWeight:700,marginBottom:16,textTransform:'uppercase',letterSpacing:'.08em'}}>{t.nextTitle}</div>
            {[
              ['#10b981', t.st1t, t.st1d],
              ['#60a5fa', t.st2t, t.st2d],
              ['#a78bfa', t.st3t, t.st3d],
              [gold,      t.st4t, t.st4d],
            ].map(([color, time, text], i) => (
              <div key={i} style={{display:'flex',gap:12,marginBottom:i<3?14:0,alignItems:'flex-start'}}>
                <div style={{width:7,height:7,borderRadius:'50%',background:color,marginTop:5,flexShrink:0,boxShadow:`0 0 6px ${color}88`}}/>
                <div>
                  <div style={{fontSize:11,color:color,fontWeight:700,marginBottom:2,textTransform:'uppercase',letterSpacing:'.04em'}}>{time}</div>
                  <div style={{fontSize:13,color:'rgba(255,255,255,0.55)',lineHeight:1.5}}>{text}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Telegram CTA */}
          <div style={{background:'rgba(34,158,217,0.07)',border:'1px solid rgba(34,158,217,0.2)',borderRadius:10,padding:'14px 16px',marginBottom:20,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
            <span style={{fontSize:13,color:'rgba(255,255,255,0.5)'}}>{t.contact}</span>
            <a href="https://t.me/winpartners_manager" target="_blank" rel="noopener noreferrer"
              style={{display:'inline-flex',alignItems:'center',gap:7,background:'#229ED9',color:'#fff',padding:'8px 16px',borderRadius:7,fontSize:13,fontWeight:700,textDecoration:'none',whiteSpace:'nowrap'}}>
              ✈️ @winpartners_manager
            </a>
          </div>

          <button onClick={() => navigate(sessionStorage.getItem('wp_blogger')?'/dashboard':'/')} style={{width:'100%',padding:'11px',fontSize:14,fontWeight:600,cursor:'pointer',border:'1px solid rgba(255,255,255,0.1)',borderRadius:7,background:'transparent',color:'rgba(255,255,255,0.5)',fontFamily:'inherit',transition:'border-color .15s'}} onMouseOver={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.25)'} onMouseOut={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'}>
            {t.back}
          </button>
        </div>
      </div>
    </div>
  )

  // Main form
  return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',fontFamily:'Inter,sans-serif',overflowX:'hidden'}}>
      <Nav/>

      <div style={{maxWidth:isMobile?'100%':1080,margin:'0 auto',padding:isMobile?'0':'0 2rem',display:'flex',gap:0,minHeight:'calc(100vh - 56px)'}}>

        {/* LEFT — Form */}
        <div style={{flex:1,padding:isMobile?'1.5rem 1rem':'2.5rem 2rem 3rem 0',minWidth:0}}>
          {/* Header */}
          <div style={{marginBottom:28}}>
            {(refCode || inviteCode) && (
              <div style={{background:'rgba(16,185,129,0.07)',border:'1px solid rgba(16,185,129,0.18)',borderRadius:7,padding:'9px 13px',marginBottom:18,fontSize:13,color:'#10b981',display:'flex',alignItems:'center',gap:8}}>
                <span>✓</span>
                {t.invited} <strong style={{fontFamily:'monospace'}}>{refCode || inviteCode}</strong>{t.invited2}
              </div>
            )}
            <h1 style={{fontSize:isMobile?20:26,fontWeight:900,color:'#fff',marginBottom:6,textTransform:'uppercase',letterSpacing:'.02em'}}>
              {t.title}
            </h1>
            <p style={{color:'rgba(255,255,255,0.38)',fontSize:13,lineHeight:1.65,margin:0}}>
              {t.sub}<strong style={{color:'rgba(255,255,255,0.7)'}}>{t.sub2}</strong>{t.sub3}
            </p>
          </div>

          {/* Progress */}
          <ProgressBar/>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {/* SECTION 1 */}
            <div style={sec}>{t.sec1}</div>

            <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:13}}>
              <div>
                <label style={lbl}>{t.lName} <span style={{color:'rgba(239,68,68,0.7)'}}>*</span></label>
                <input style={errors.name?inpErr:inp} value={form.name} onChange={set('name')} placeholder={t.phName}
                  onFocus={e=>e.target.style.borderColor='rgba(245,166,35,0.4)'} onBlur={e=>e.target.style.borderColor=errors.name?'rgba(239,68,68,0.7)':'rgba(255,255,255,0.1)'}/>
              </div>
              <div>
                <label style={lbl}>{t.lUser} <span style={{color:'rgba(239,68,68,0.7)'}}>*</span></label>
                <input style={errors.username?inpErr:inp} value={form.username} onChange={set('username')} placeholder={t.phUser}
                  onInput={e=>e.target.value=e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,'')}
                  onFocus={e=>e.target.style.borderColor='rgba(245,166,35,0.4)'} onBlur={e=>e.target.style.borderColor=errors.username?'rgba(239,68,68,0.7)':'rgba(255,255,255,0.1)'}/>
              </div>
            </div>

            <div>
              <label style={lbl}>{t.lEmail} <span style={{color:'rgba(239,68,68,0.7)'}}>*</span></label>
              <input style={errors.email?inpErr:inp} type="email" value={form.email} onChange={set('email')} placeholder={t.phEmail}
                onFocus={e=>e.target.style.borderColor='rgba(245,166,35,0.4)'} onBlur={e=>e.target.style.borderColor=errors.email?'rgba(239,68,68,0.7)':'rgba(255,255,255,0.1)'}/>
            </div>

            {(() => { const P={ro:['Parolă (o alegi tu)','Minim 6 caractere'],ru:['Пароль (выбираешь сам)','Минимум 6 символов'],en:['Password (your choice)','Min 6 characters'],tr:['Şifre (sen seç)','En az 6 karakter'],de:['Passwort (frei wählbar)','Mind. 6 Zeichen'],pt:['Senha (à tua escolha)','Mín. 6 caracteres'],pl:['Hasło (Twój wybór)','Min. 6 znaków']}; const [pl_,ph_]=P[lang]||P.ro; return (
              <div>
                <label style={lbl}>{pl_} <span style={{color:'rgba(239,68,68,0.7)'}}>*</span></label>
                <input style={errors.password?inpErr:inp} type="password" value={form.password} onChange={set('password')} placeholder={ph_}
                  onFocus={e=>e.target.style.borderColor='rgba(245,166,35,0.4)'} onBlur={e=>e.target.style.borderColor=errors.password?'rgba(239,68,68,0.7)':'rgba(255,255,255,0.1)'}/>
              </div>
            ); })()}

            <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:13}}>
              <div>
                <label style={lbl}>{t.lPhone} <span style={{color:'rgba(239,68,68,0.7)'}}>*</span></label>
                <input style={errors.phone?inpErr:inp} value={form.phone} onChange={set('phone')} placeholder={t.phPhone}
                  onFocus={e=>e.target.style.borderColor='rgba(245,166,35,0.4)'} onBlur={e=>e.target.style.borderColor=errors.phone?'rgba(239,68,68,0.7)':'rgba(255,255,255,0.1)'}/>
              </div>
              <div>
                <label style={lbl}>{t.lCountry}</label>
                <Dropdown id="country" value={form.country} options={COUNTRIES} onPick={v => setForm(f => ({...f, country:v}))} />
              </div>
            </div>

            {/* SECTION 2 */}
            <div style={{...sec, marginTop:8}}>{t.sec2}</div>

            <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:13}}>
              <div>
                <label style={lbl}>{t.lPlatform}</label>
                <Dropdown id="platform" value={form.platform} options={PLATFORMS} onPick={v => setForm(f => ({...f, platform:v}))} />
              </div>
              <div>
                <label style={lbl}>{t.lFollowers} <span style={{color:'rgba(239,68,68,0.7)'}}>*</span></label>
                <input style={errors.followers?inpErr:inp} type="number" value={form.followers} onChange={set('followers')} placeholder={t.phFollowers} min="100"
                  onFocus={e=>e.target.style.borderColor='rgba(245,166,35,0.4)'} onBlur={e=>e.target.style.borderColor=errors.followers?'rgba(239,68,68,0.7)':'rgba(255,255,255,0.1)'}/>
              </div>
            </div>

            <div>
              <label style={lbl}>{t.lProfile} <span style={{color:'rgba(239,68,68,0.7)'}}>*</span></label>
              <input style={errors.profileLink?inpErr:inp} value={form.profileLink} onChange={set('profileLink')} placeholder={({TikTok:'https://tiktok.com/@username',Instagram:'https://instagram.com/username',YouTube:'https://youtube.com/@channel',Telegram:'https://t.me/channel',Facebook:'https://facebook.com/page','Twitter/X':'https://x.com/username',Other:'https://...'})[form.platform] || t.phProfile}
                onFocus={e=>e.target.style.borderColor='rgba(245,166,35,0.4)'} onBlur={e=>e.target.style.borderColor=errors.profileLink?'rgba(239,68,68,0.7)':'rgba(255,255,255,0.1)'}/>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.25)',marginTop:4}}>{t.profileNote}</div>
            </div>

            <div>
              <label style={lbl}>{t.lAbout}</label>
              <textarea style={{...inp,minHeight:76,resize:'vertical'}} value={form.aboutYou} onChange={set('aboutYou')} placeholder={t.phAbout}
                onFocus={e=>e.target.style.borderColor='rgba(245,166,35,0.4)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
            </div>

            {/* SECTION 3 */}
            <div style={{...sec, marginTop:8}}>{t.sec3}</div>

            <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(245,166,35,0.08)',borderRadius:8,padding:'14px'}}>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:12,lineHeight:1.6}}>{t.payNote}</div>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:13}}>
                <div>
                  <label style={lbl}>{t.lPayMethod}</label>
                  <Dropdown id="payMethod" value={form.payMethod} options={['Bitcoin (BTC)','USDT (TRC20)','USDT (ERC20)','Ethereum (ETH)','Binance Pay','Skrill','Neteller']} onPick={v => setForm(f => ({...f, payMethod:v}))} />
                </div>
                <div>
                  <label style={lbl}>{t.lPayAddr}</label>
                  <input style={inp} value={form.payAddress} onChange={set('payAddress')} placeholder={t.phPayAddr}
                    onFocus={e=>e.target.style.borderColor='rgba(245,166,35,0.4)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
                </div>
              </div>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.22)',marginTop:10}}>{t.payNote2}</div>
            </div>

            <div>
              <label style={lbl}>{t.lRef}</label>
              <input style={inp} value={form.refCode} onChange={set('refCode')} placeholder={t.phRef}
                onFocus={e=>e.target.style.borderColor='rgba(245,166,35,0.4)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.25)',marginTop:4}}>{t.refNote}</div>
            </div>

            {Object.keys(errors).length > 0 && (
              <div style={{background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:6,padding:'10px 13px',fontSize:13,color:'rgba(239,68,68,0.9)',display:'flex',gap:8,alignItems:'flex-start'}}>
                <span style={{marginTop:1}}>⚠</span>
                <span>{t.errMsg}</span>
              </div>
            )}

            <button onClick={submit} disabled={submitting} style={{padding:'14px',fontSize:14,fontWeight:800,cursor:submitting?'not-allowed':'pointer',border:'none',borderRadius:8,background:submitting?'rgba(245,166,35,0.5)':gold,color:'#000',marginTop:4,textTransform:'uppercase',letterSpacing:'.06em',fontFamily:'inherit',opacity:submitting?0.7:1,boxShadow:'0 4px 20px rgba(245,166,35,0.25)',transition:'box-shadow .15s,transform .1s'}} onMouseOver={e=>{if(!submitting){e.currentTarget.style.boxShadow='0 6px 28px rgba(245,166,35,0.38)';e.currentTarget.style.transform='translateY(-1px)'}}} onMouseOut={e=>{e.currentTarget.style.boxShadow='0 4px 20px rgba(245,166,35,0.25)';e.currentTarget.style.transform='translateY(0)'}}>
              {submitting ? '...' : t.submit}
            </button>

            <p style={{textAlign:'center',fontSize:11,color:'rgba(255,255,255,0.2)',lineHeight:1.65}}>
              {t.terms}<span style={{color:gold,cursor:'pointer'}} onClick={()=>navigate('/terms')}>{t.termsLink}</span>{t.terms2}
            </p>

            <p style={{textAlign:'center',fontSize:13,color:'rgba(255,255,255,0.32)'}}>
              {t.hasAccount} <span onClick={() => navigate('/dashboard')} style={{color:gold,cursor:'pointer',fontWeight:600}}>{t.login}</span>
            </p>
          </div>
        </div>

        {/* RIGHT — Benefits sidebar (desktop only) */}
        {!isMobile && (
          <div style={{width:280,flexShrink:0,padding:'2.5rem 0 3rem 2rem',borderLeft:'1px solid rgba(255,255,255,0.05)'}}>
            <div style={{position:'sticky',top:80}}>
              <div style={{fontSize:11,color:gold,fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em',marginBottom:20}}>{t.sideTitle}</div>
              {[t.side1,t.side2,t.side3,t.side4,t.side5].map((item, i) => (
                <div key={i} style={{display:'flex',gap:10,marginBottom:16,alignItems:'flex-start'}}>
                  <div style={{width:18,height:18,borderRadius:'50%',background:gold,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span style={{fontSize:13,color:'rgba(255,255,255,0.55)',lineHeight:1.55}}>{item}</span>
                </div>
              ))}

              {/* Trust box */}
              <div style={{marginTop:28,background:'rgba(245,166,35,0.04)',border:'1px solid rgba(245,166,35,0.12)',borderRadius:10,padding:'1rem'}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                  <div style={{width:7,height:7,borderRadius:'50%',background:'#10b981',boxShadow:'0 0 5px #10b981'}}/>
                  <span style={{fontSize:12,color:'#10b981',fontWeight:700}}>{t.appr_pct||'95%'} {t.appr_label||'aprobare'}</span>
                </div>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.35)',lineHeight:1.6}}>
                  {t.appr_text||'Procesăm cererile în 24-48 ore. Răspuns rapid pe Telegram.'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Footer */}
      <footer style={{background:'#050508',borderTop:'1px solid rgba(245,166,35,0.07)',padding:'1.25rem 1.5rem',textAlign:'center'}}>
        <div style={{display:'flex',flexWrap:'wrap',gap:16,justifyContent:'center',alignItems:'center',marginBottom:8}}>
          {[['/',t.nav_home||'Home'],['/about',t.nav_about||'About'],['/faq','FAQ'],['/contact','Contact'],['/terms',t.nav_terms||'Terms']].map(([p,l])=>(
            <span key={p} onClick={()=>navigate(p)} style={{fontSize:12,color:'rgba(255,255,255,0.3)',cursor:'pointer'}} onMouseOver={e=>e.target.style.color='#f5a623'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.3)'}>{l}</span>
          ))}
        </div>
        <div style={{fontSize:11,color:'rgba(255,255,255,0.15)'}}>© 2026 WinPartners · <a href="https://winpartners.pro" style={{color:'rgba(255,255,255,0.15)',textDecoration:'none'}}>winpartners.pro</a></div>
      </footer>
    </div>
  )
}
