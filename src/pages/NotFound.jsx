import { useNavigate } from 'react-router-dom'
const gold = '#f5a623'
export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0f', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:'Inter,sans-serif', color:'#e2e8f0', padding:'2rem', textAlign:'center' }}>
      <div style={{ fontSize:100, fontWeight:900, color:gold, lineHeight:1, marginBottom:8 }}>404</div>
      <div style={{ fontSize:22, fontWeight:700, color:'#fff', marginBottom:10 }}>Pagina nu a fost găsită</div>
      <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:32, maxWidth:380 }}>
        Linkul pe care l-ai accesat nu există sau a fost mutat.
      </div>
      <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
        <button onClick={() => navigate('/')} style={{ padding:'12px 28px', fontSize:14, fontWeight:700, cursor:'pointer', border:'none', borderRadius:8, background:gold, color:'#000' }}>
          ← Pagina principală
        </button>
        <button onClick={() => navigate('/register')} style={{ padding:'12px 28px', fontSize:14, fontWeight:700, cursor:'pointer', border:`1px solid ${gold}`, borderRadius:8, background:'none', color:gold }}>
          Aplică acum
        </button>
      </div>
      <div style={{ marginTop:48, fontSize:12, color:'rgba(255,255,255,0.2)' }}>
        WIN<span style={{ color:gold }}>PARTNERS</span> · winpartners.pro
      </div>
    </div>
  )
}
