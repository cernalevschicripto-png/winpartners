import { useNavigate } from 'react-router-dom'

export default function Contact() {
  const nav = useNavigate()
  const gold = '#f5a623'
  const inp = {width:'100%',padding:'10px 14px',fontSize:14,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,background:'rgba(255,255,255,0.05)',color:'#e2e8f0',outline:'none',boxSizing:'border-box'}
  return (
    <div style={{background:'#0a0a0f',minHeight:'100vh',color:'#fff',fontFamily:"'Inter',sans-serif"}}>
      <nav style={{background:'rgba(10,10,15,0.97)',borderBottom:'1px solid rgba(245,166,35,0.12)',padding:'0 3rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:64}}>
        <div onClick={()=>nav('/')} style={{fontSize:20,fontWeight:900,cursor:'pointer'}}><span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span></div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>nav('/dashboard')} style={{padding:'7px 18px',fontSize:13,cursor:'pointer',border:'1px solid rgba(255,255,255,0.15)',borderRadius:4,background:'none',color:'#e2e8f0'}}>Login</button>
          <button onClick={()=>nav('/register')} style={{padding:'7px 18px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:4,background:gold,color:'#000'}}>Înregistrare</button>
        </div>
      </nav>
      <div style={{maxWidth:1000,margin:'0 auto',padding:'4rem 2rem',display:'grid',gridTemplateColumns:'1fr 1fr',gap:48}}>
        <div>
          <h1 style={{fontSize:'clamp(2rem,4vw,3rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:8}}>CONTACTE</h1>
          <p style={{fontSize:15,color:'rgba(255,255,255,0.5)',marginBottom:40}}>Suntem disponibili 24/7 pentru partenerii noștri</p>
          {[['📧','Email','support@winpartners.partners'],['💬','Telegram','@winpartners_support'],['📱','WhatsApp','+373 XX XXX XXX'],['🕐','Program','24/7, 365 zile/an']].map(([icon,label,val])=>(
            <div key={label} style={{display:'flex',gap:14,alignItems:'center',marginBottom:24}}>
              <div style={{width:44,height:44,background:'rgba(245,166,35,0.1)',border:'1px solid rgba(245,166,35,0.25)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>{icon}</div>
              <div>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'.08em'}}>{label}</div>
                <div style={{fontSize:14,color:'#fff',fontWeight:500}}>{val}</div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 style={{fontSize:20,fontWeight:700,marginBottom:24}}>Trimiteți un mesaj</h2>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {status==='sent' ? (
              <div style={{textAlign:'center',padding:'2rem'}}>
                <div style={{fontSize:40,marginBottom:12}}>✅</div>
                <div style={{fontSize:16,fontWeight:700,color:'#fff',marginBottom:8}}>Mesaj trimis!</div>
                <div style={{fontSize:13,color:'rgba(255,255,255,0.5)'}}>Te vom contacta în maxim 24 ore.</div>
              </div>
            ) : (
              <>
                <input style={inp} placeholder="Numele dvs." value={form.name} onChange={set('name')}/>
                <input style={inp} type="email" placeholder="Email" value={form.email} onChange={set('email')}/>
                <input style={inp} placeholder="Subiect" value={form.subject} onChange={set('subject')}/>
                <textarea style={{...inp,height:120,resize:'vertical'}} placeholder="Mesajul dvs." value={form.message} onChange={set('message')}/>
                {status==='error' && <div style={{fontSize:12,color:'#ef4444'}}>Eroare la trimitere. Contactează-ne direct pe Telegram.</div>}
                <button
                  onClick={sendMessage}
                  disabled={status==='sending'}
                  style={{padding:'12px',fontSize:14,fontWeight:700,cursor:status==='sending'?'wait':'pointer',border:'none',borderRadius:8,background:gold,color:'#000',textTransform:'uppercase',opacity:status==='sending'?0.7:1}}>
                  {status==='sending'?'SE TRIMITE...':'TRIMITE MESAJ'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
