import { useNavigate } from 'react-router-dom'
const gold = '#f5a623'
const lang = (() => { const s = localStorage.getItem('wp_lang'); return ['ro','ru','en','tr','de','pt','pl'].includes(s) ? s : 'ro' })()
const L = (o) => o[lang] || o.ro
export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0f', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:'Inter,sans-serif', color:'#e2e8f0', padding:'2rem', textAlign:'center' }}>
      <div style={{ fontSize:100, fontWeight:900, color:gold, lineHeight:1, marginBottom:8 }}>404</div>
      <div style={{ fontSize:22, fontWeight:700, color:'#fff', marginBottom:10 }}>{L({ro:'Pagina nu a fost găsită',ru:'Страница не найдена',en:'Page not found',tr:'Sayfa bulunamadı',de:'Seite nicht gefunden',pt:'Página não encontrada',pl:'Strona nie znaleziona'})}</div>
      <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:32, maxWidth:380 }}>
        {L({ro:'Linkul pe care l-ai accesat nu există sau a fost mutat.',ru:'Ссылка, которую вы открыли, не существует или была перемещена.',en:'The link you accessed does not exist or has been moved.',tr:'Eriştiğiniz bağlantı mevcut değil veya taşınmış.',de:'Der aufgerufene Link existiert nicht oder wurde verschoben.',pt:'O link que acedeu não existe ou foi movido.',pl:'Link, który otworzyłeś, nie istnieje lub został przeniesiony.'})}
      </div>
      <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
        <button onClick={() => navigate('/')} style={{ padding:'12px 28px', fontSize:14, fontWeight:700, cursor:'pointer', border:'none', borderRadius:8, background:gold, color:'#000' }}>
          {L({ro:'← Pagina principală',ru:'← Главная',en:'← Home',tr:'← Ana sayfa',de:'← Startseite',pt:'← Página inicial',pl:'← Strona główna'})}
        </button>
        <button onClick={() => navigate('/register')} style={{ padding:'12px 28px', fontSize:14, fontWeight:700, cursor:'pointer', border:`1px solid ${gold}`, borderRadius:8, background:'none', color:gold }}>
          {L({ro:'Aplică acum',ru:'Подать заявку',en:'Apply now',tr:'Şimdi başvur',de:'Jetzt bewerben',pt:'Candidatar agora',pl:'Aplikuj teraz'})}
        </button>
      </div>
      <div style={{ marginTop:48, fontSize:12, color:'rgba(255,255,255,0.2)' }}>
        WIN<span style={{ color:gold }}>PARTNERS</span> · winpartners.pro
      </div>
    </div>
  )
}
