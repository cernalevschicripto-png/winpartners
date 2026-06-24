import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const gold = '#f5a623'
const LANGS = ['ro','ru','en','tr','de','pt','pl']

const T = {
  ro:{reg:'Înregistrare',title:'MATERIALE PROMOȚIONALE',sub:'Texte gata de postat și idei de conținut pentru TikTok, Instagram și YouTube.',copy:'Copiază',copied:'✓ Copiat',cat1:'Texte gata de postat',cat2:'Idei de conținut',t1title:'Post scurt (TikTok/Instagram)',t2title:'Descriere video YouTube',t3title:'Text pentru Bio',c1:'Tutorial: cum câștig bani din casino fără să joc',c2:'Video: Câți bani ai putea câștiga cu audiența ta',c3:'Short: Arată diferența — cu cod vs. fără cod promoțional',c4:'Livestream Q&A: cum funcționează afiliere casino',note:'Înlocuiește [COD_TAU] cu codul tău real din dashboard.',cta:'Aplică acum și primești codul tău'},
  ru:{reg:'Регистрация',title:'ПРОМО-МАТЕРИАЛЫ',sub:'Готовые тексты и идеи для TikTok, Instagram и YouTube.',copy:'Копировать',copied:'✓ Скопировано',cat1:'Готовые тексты',cat2:'Идеи для контента',t1title:'Короткий пост (TikTok/Instagram)',t2title:'Описание видео YouTube',t3title:'Текст для Bio',c1:'Туториал: зарабатываю на казино без игры',c2:'Видео: сколько ты мог бы зарабатывать со своей аудиторией',c3:'Shorts: с кодом vs. без промокода — разница',c4:'Прямой эфир: как работает партнёрская программа',note:'Замени [КОД] на свой реальный промокод из дашборда.',cta:'Подать заявку и получить свой код'},
  en:{reg:'Register',title:'PROMOTIONAL MATERIALS',sub:'Ready-to-post texts and content ideas for TikTok, Instagram and YouTube.',copy:'Copy',copied:'✓ Copied',cat1:'Ready-to-post texts',cat2:'Content ideas',t1title:'Short post (TikTok/Instagram)',t2title:'YouTube video description',t3title:'Bio text',c1:'Tutorial: how I earn from casino without playing',c2:'Video: how much could you earn with your audience',c3:'Short: with code vs. without promo code — the difference',c4:'Livestream Q&A: how does casino affiliate work',note:'Replace [CODE] with your real promo code from the dashboard.',cta:'Apply now and get your code'},
  tr:{reg:'Kayıt',title:'TANITIM MATERYALLERİ',sub:'TikTok, Instagram ve YouTube için hazır metinler ve içerik fikirleri.',copy:'Kopyala',copied:'✓ Kopyalandı',cat1:'Hazır Metinler',cat2:'İçerik Fikirleri',t1title:'Kısa gönderi (TikTok/Instagram)',t2title:'YouTube video açıklaması',t3title:'Bio metni',c1:'Tutorial: oynamadan kumarhane kazancı',c2:'Video: kitlenle ne kadar kazanabilirsin',c3:'Short: kodlu vs. kodsuz fark',c4:'Canlı yayın: casino ortaklık programı nasıl çalışır',note:'[KOD] yerine kontrol panelindeki gerçek promosyon kodunu yaz.',cta:'Başvur ve kodunu al'},
  de:{reg:'Registrieren',title:'WERBEMATERIALIEN',sub:'Fertige Texte und Content-Ideen für TikTok, Instagram und YouTube.',copy:'Kopieren',copied:'✓ Kopiert',cat1:'Fertige Texte',cat2:'Content-Ideen',t1title:'Kurzer Beitrag (TikTok/Instagram)',t2title:'YouTube-Videobeschreibung',t3title:'Bio-Text',c1:'Tutorial: Casino-Verdienst ohne zu spielen',c2:'Video: Wie viel könntest du mit deiner Audience verdienen',c3:'Short: Mit Code vs. ohne Promo-Code',c4:'Livestream: Wie funktioniert ein Casino-Partnerprogramm',note:'Ersetze [CODE] durch deinen echten Promo-Code aus dem Dashboard.',cta:'Jetzt bewerben und Code erhalten'},
  pt:{reg:'Registrar',title:'MATERIAIS PROMOCIONAIS',sub:'Textos prontos e ideias de conteúdo para TikTok, Instagram e YouTube.',copy:'Copiar',copied:'✓ Copiado',cat1:'Textos Prontos',cat2:'Ideias de Conteúdo',t1title:'Post curto (TikTok/Instagram)',t2title:'Descrição vídeo YouTube',t3title:'Texto Bio',c1:'Tutorial: ganho com casino sem jogar',c2:'Vídeo: quanto poderias ganhar com a tua audiência',c3:'Short: com código vs. sem código promo',c4:'Livestream: como funciona afiliado de casino',note:'Substitui [CÓDIGO] pelo teu código real do dashboard.',cta:'Candidata-te e recebe o teu código'},
  pl:{reg:'Rejestracja',title:'MATERIAŁY PROMOCYJNE',sub:'Gotowe teksty i pomysły na treści dla TikTok, Instagram i YouTube.',copy:'Kopiuj',copied:'✓ Skopiowano',cat1:'Gotowe Teksty',cat2:'Pomysły na Treści',t1title:'Krótki post (TikTok/Instagram)',t2title:'Opis wideo YouTube',t3title:'Tekst Bio',c1:'Tutorial: zarabiam na kasynie bez grania',c2:'Wideo: ile mógłbyś zarobić ze swoją publicznością',c3:'Short: z kodem vs. bez kodu promo',c4:'Livestream: jak działa program partnerski kasyna',note:'Zastąp [KOD] swoim prawdziwym kodem promo z panelu.',cta:'Aplikuj teraz i otrzymaj swój kod'},
}

const TEXTS = {
  ro:{
    t1:`🎰 Ai auzit de programele de afiliere la cazinouri?\n\nEu câștig 25% din fiecare jucător pe care îl aduc — pe viață. Jucătorul joacă, eu primesc comision săptămânal.\n\nFolosește codul meu [COD_TAU] la înregistrare pe Melbet.\n\n👉 Link în bio\n#casino #melbet #câștiguri #afiliere #winpartners`,
    t2:`💰 Cum câștig bani din casino fără să joc | Program afiliere WinPartners\n\nÎn acest video îți explic exact:\n✅ Ce este RevShare 25% și cum funcționează\n✅ Cât câștig efectiv pe lună\n✅ Cum aplici și primești codul tău promoțional\n\nCodul meu: [COD_TAU]\nÎnregistrează-te pe Melbet cu codul de mai sus și ambii câștigăm.\n\n🔗 Link pentru înregistrare: winpartners.pro\n\n⏱ Timestamps:\n0:00 Intro\n1:00 Ce este programul de afiliere\n2:30 Cât am câștigat\n4:00 Cum aplici tu`,
    t3:`💰 Câștig pasiv din casino | Cod: [COD_TAU] | winpartners.pro`,
  },
  ru:{
    t1:`🎰 Слышал о партнёрских программах казино?\n\nЯ получаю 25% с каждого игрока навсегда. Игрок играет — я получаю комиссию каждую неделю. Автоматически.\n\nИспользуй мой код [КОД] при регистрации на Melbet.\n\n👉 Ссылка в шапке профиля\n#casino #melbet #заработок #партнёрка`,
    t2:`💰 Зарабатываю на казино без игры | WinPartners\n\nВ этом видео:\n✅ Что такое RevShare 25% и как это работает\n✅ Сколько я реально зарабатываю в месяц\n✅ Как подать заявку и получить промокод\n\nМой код: [КОД]\nРегистрируйся на Melbet с кодом выше — оба в плюсе.\n\n🔗 Ссылка: winpartners.pro`,
    t3:`💰 Пассивный доход с казино | Код: [КОД] | winpartners.pro`,
  },
  en:{
    t1:`🎰 Ever heard of casino affiliate programs?\n\nI earn 25% from every player I refer — for life. They play, I get weekly commission.\n\nUse my code [CODE] when registering on Melbet.\n\n👉 Link in bio\n#casino #melbet #earnings #affiliate #winpartners`,
    t2:`💰 How I earn from casino without playing | WinPartners affiliate\n\nIn this video:\n✅ What RevShare 25% means and how it works\n✅ How much I actually earn per month\n✅ How to apply and get your promo code\n\nMy code: [CODE]\nRegister on Melbet with the code above — we both win.\n\n🔗 Link: winpartners.pro`,
    t3:`💰 Passive casino income | Code: [CODE] | winpartners.pro`,
  },
  tr:{
    t1:`🎰 Casino ortaklık programlarını duydun mu?\n\nGetirdiğim her oyuncudan ömür boyu %25 kazanıyorum. Onlar oynar, ben her hafta komisyon alırım.\n\nMelbet kaydında [KOD] kodumu kullan.\n\n👉 Bio'da link\n#casino #melbet #kazanç #ortaklık #winpartners`,
    t2:`💰 Oynamadan casinodan nasıl kazanıyorum | WinPartners ortaklık\n\nBu videoda:\n✅ RevShare %25 nedir ve nasıl çalışır\n✅ Ayda gerçekte ne kadar kazanıyorum\n✅ Nasıl başvurulur ve promosyon kodu alınır\n\nKodum: [KOD]\nYukarıdaki kodla Melbet'e kaydol — ikimiz de kazanırız.\n\n🔗 Link: winpartners.pro`,
    t3:`💰 Pasif casino geliri | Kod: [KOD] | winpartners.pro`,
  },
  de:{
    t1:`🎰 Schon von Casino-Partnerprogrammen gehört?\n\nIch verdiene 25% von jedem geworbenen Spieler — lebenslang. Sie spielen, ich bekomme wöchentlich Provision.\n\nNutze meinen Code [CODE] bei der Anmeldung auf Melbet.\n\n👉 Link in der Bio\n#casino #melbet #verdienst #affiliate #winpartners`,
    t2:`💰 Wie ich ohne zu spielen mit Casino verdiene | WinPartners Affiliate\n\nIn diesem Video:\n✅ Was RevShare 25% bedeutet und wie es funktioniert\n✅ Wie viel ich tatsächlich pro Monat verdiene\n✅ Wie du dich bewirbst und deinen Promo-Code erhältst\n\nMein Code: [CODE]\nMelde dich mit dem Code oben auf Melbet an — wir gewinnen beide.\n\n🔗 Link: winpartners.pro`,
    t3:`💰 Passives Casino-Einkommen | Code: [CODE] | winpartners.pro`,
  },
  pt:{
    t1:`🎰 Já ouviste falar de programas de afiliados de casino?\n\nGanho 25% de cada jogador que indico — para sempre. Eles jogam, eu recebo comissão semanal.\n\nUsa o meu código [CÓDIGO] ao registar-te na Melbet.\n\n👉 Link na bio\n#casino #melbet #ganhos #afiliado #winpartners`,
    t2:`💰 Como ganho com casino sem jogar | Afiliado WinPartners\n\nNeste vídeo:\n✅ O que é RevShare 25% e como funciona\n✅ Quanto ganho realmente por mês\n✅ Como te candidatas e recebes o teu código promo\n\nO meu código: [CÓDIGO]\nRegista-te na Melbet com o código acima — ganhamos os dois.\n\n🔗 Link: winpartners.pro`,
    t3:`💰 Renda passiva de casino | Código: [CÓDIGO] | winpartners.pro`,
  },
  pl:{
    t1:`🎰 Słyszałeś o programach partnerskich kasyn?\n\nZarabiam 25% z każdego poleconego gracza — dożywotnio. Oni grają, ja co tydzień dostaję prowizję.\n\nUżyj mojego kodu [KOD] przy rejestracji na Melbet.\n\n👉 Link w bio\n#casino #melbet #zarobki #partnerstwo #winpartners`,
    t2:`💰 Jak zarabiam na kasynie bez grania | Partner WinPartners\n\nW tym filmie:\n✅ Czym jest RevShare 25% i jak działa\n✅ Ile naprawdę zarabiam miesięcznie\n✅ Jak aplikować i otrzymać kod promo\n\nMój kod: [KOD]\nZarejestruj się na Melbet z kodem powyżej — oboje wygrywamy.\n\n🔗 Link: winpartners.pro`,
    t3:`💰 Pasywny dochód z kasyna | Kod: [KOD] | winpartners.pro`,
  },
}

function CopyBox({ title, text, t }) {
  const [copied, setCopied] = useState(false)
  const doCopy = () => {
    navigator.clipboard.writeText(text).catch(()=>{})
    setCopied(true)
    setTimeout(()=>setCopied(false), 2000)
  }
  return (
    <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'1.25rem'}}>
      <div style={{fontSize:13,fontWeight:700,color:'rgba(255,255,255,0.9)',marginBottom:10}}>{title}</div>
      <pre style={{fontSize:12,color:'rgba(255,255,255,0.45)',lineHeight:1.75,whiteSpace:'pre-wrap',wordBreak:'break-word',margin:0,fontFamily:'monospace',background:'rgba(0,0,0,0.3)',padding:'12px',borderRadius:8,maxHeight:140,overflow:'auto'}}>{text}</pre>
      <button onClick={doCopy} style={{marginTop:10,padding:'7px 18px',fontSize:12,fontWeight:700,cursor:'pointer',border:`1px solid ${copied?'#10b981':gold}`,borderRadius:6,background:'none',color:copied?'#10b981':gold,transition:'all .2s'}}>
        {copied ? t.copied : t.copy}
      </button>
    </div>
  )
}

export default function Media() {
  const nav = useNavigate()
  const [lang, setLang] = useState(() => {
    const s = localStorage.getItem('wp_lang')
    return LANGS.includes(s) ? s : 'ro'
  })
  const t = T[lang] || T.ro
  const ct = TEXTS[lang] || TEXTS.en
  const setL = (l) => { setLang(l); localStorage.setItem('wp_lang', l) }

  return (
    <div style={{background:'#0a0a0f',minHeight:'100vh',color:'#fff',fontFamily:"'Inter',sans-serif",overflowX:'hidden'}}>
      <nav style={{background:'rgba(10,10,15,0.97)',borderBottom:'1px solid rgba(245,166,35,0.12)',padding:'0 1rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:56,position:'sticky',top:0,zIndex:50}}>
        <div onClick={()=>nav('/')} style={{fontSize:16,fontWeight:900,cursor:'pointer'}}>
          <span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span>
        </div>
        <div style={{display:'flex',gap:4,alignItems:'center'}}>
          <div style={{display:'flex',gap:3,overflowX:'auto',scrollbarWidth:'none'}}>
            {LANGS.map(l=>(
              <button key={l} onClick={()=>setL(l)} style={{padding:'3px 6px',fontSize:10,fontWeight:700,cursor:'pointer',border:`1px solid ${lang===l?gold:'rgba(255,255,255,0.15)'}`,borderRadius:4,background:lang===l?'rgba(245,166,35,0.15)':'none',color:lang===l?gold:'rgba(255,255,255,0.4)',flexShrink:0}}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={()=>nav('/register')} style={{padding:'6px 12px',fontSize:12,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:gold,color:'#000',marginLeft:6}}>
            {t.reg}
          </button>
        </div>
      </nav>

      <div style={{maxWidth:960,margin:'0 auto',padding:'3rem 1.25rem'}}>
        <div style={{textAlign:'center',marginBottom:'3rem'}}>
          <h1 style={{fontSize:'clamp(1.8rem,3.5vw,2.5rem)',fontWeight:900,letterSpacing:'.06em',marginBottom:12}}>{t.title}</h1>
          <p style={{fontSize:15,color:'rgba(255,255,255,0.45)',maxWidth:520,margin:'0 auto'}}>{t.sub}</p>
        </div>

        <div style={{marginBottom:'3rem'}}>
          <h2 style={{fontSize:17,fontWeight:800,color:gold,marginBottom:'1.25rem',letterSpacing:'.03em'}}>{t.cat1}</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16}}>
            <CopyBox title={t.t1title} text={ct.t1} t={t}/>
            <CopyBox title={t.t2title} text={ct.t2} t={t}/>
            <CopyBox title={t.t3title} text={ct.t3} t={t}/>
          </div>
          <div style={{marginTop:12,fontSize:12,color:'rgba(255,255,255,0.3)',padding:'8px 12px',background:'rgba(245,166,35,0.05)',borderRadius:6,border:'1px solid rgba(245,166,35,0.1)'}}>
            * {t.note}
          </div>
        </div>

        <div style={{marginBottom:'3rem'}}>
          <h2 style={{fontSize:17,fontWeight:800,color:gold,marginBottom:'1.25rem',letterSpacing:'.03em'}}>{t.cat2}</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>
            {[t.c1,t.c2,t.c3,t.c4].map((idea,i)=>(
              <div key={i} style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,padding:'1rem',display:'flex',gap:12,alignItems:'flex-start'}}>
                <div style={{width:30,height:30,borderRadius:8,background:'rgba(245,166,35,0.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,color:gold,fontWeight:900,flexShrink:0}}>{i+1}</div>
                <span style={{fontSize:13,color:'rgba(255,255,255,0.6)',lineHeight:1.55}}>{idea}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{textAlign:'center',padding:'2rem',background:'rgba(245,166,35,0.05)',border:'1px solid rgba(245,166,35,0.15)',borderRadius:14}}>
          <div style={{fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:16}}>{t.note}</div>
          <button onClick={()=>nav('/register')} style={{padding:'14px 36px',fontSize:15,fontWeight:800,cursor:'pointer',border:'none',borderRadius:10,background:gold,color:'#000'}}>
            {t.cta} →
          </button>
        </div>
      </div>
    </div>
  )
}
