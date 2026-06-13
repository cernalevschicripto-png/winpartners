import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const gold = '#f5a623'
const FORMSPREE = 'https://formspree.io/f/mnjyoylo'

export default function Contact() {
  const nav = useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 650)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 650)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const send = async () => {
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    try {
      const res = await fetch(FORMSPREE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: '💬 Mesaj contact WinPartners — ' + form.name,
          nume: form.name,
          email: form.email,
          subiect: form.subject || '—',
          mesaj: form.message,
        })
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch(e) { setStatus('error') }
  }

  const inp = { width:'100%', padding:'11px 14px', fontSize:14, border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, background:'rgba(255,255,255,0.05)', color:'#e2e8f0', outline:'none', boxSizing:'border-box', fontFamily:'inherit' }

  const contacts = [
    { icon:'✈️', label:'TELEGRAM', val:'@winpartners_support', href:'https://t.me/winpartners_support' },
    { icon:'✉️', label:'EMAIL', val:'support.winpartners@gmail.com', href:'mailto:support.winpartners@gmail.com' },
    { icon:'🕐', label:'PROGRAM', val:'24/7, 365 zile/an', href: null },
    { icon:'⚡', label:'RĂSPUNS', val:'Maxim 2 ore', href: null },
  ]

  return (
    <div style={{ background:'#0a0a0f', minHeight:'100vh', color:'#fff', fontFamily:"'Inter',sans-serif" }}>

      {/* Nav */}
      <nav style={{ background:'rgba(10,10,15,0.97)', borderBottom:'1px solid rgba(245,166,35,0.12)', padding:'0 1rem', display:'flex', alignItems:'center', justifyContent:'space-between', height:56 }}>
        <div onClick={() => nav('/')} style={{ fontSize:18, fontWeight:900, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
          <img src="/icons/logo.png" width="24" height="24" alt="W" style={{ borderRadius:3 }}/>
          <span><span style={{ color:'#fff' }}>WIN</span><span style={{ color:gold }}>PARTNERS</span></span>
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {!isMobile && <button onClick={() => nav('/dashboard')} style={{ padding:'6px 14px', fontSize:12, cursor:'pointer', border:'1px solid rgba(255,255,255,0.15)', borderRadius:4, background:'none', color:'#e2e8f0', fontFamily:'inherit' }}>Login</button>}
          <button onClick={() => nav('/register')} style={{ padding:'6px 14px', fontSize:12, fontWeight:700, cursor:'pointer', border:'none', borderRadius:4, background:gold, color:'#000', fontFamily:'inherit' }}>{isMobile?'Aplică':'Înregistrare'}</button>
        </div>
      </nav>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'3rem 1.5rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'start' }}>

        {/* Stânga — info */}
        <div>
          <h1 style={{ fontSize:36, fontWeight:900, textTransform:'uppercase', marginBottom:12 }}>Contacte</h1>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:14, lineHeight:1.7, marginBottom:32 }}>
            Suntem disponibili 24/7 pentru partenerii noștri. Scrie-ne pe Telegram pentru răspuns instant.
          </p>

          {/* Manager card */}
          <div style={{ background:'rgba(245,166,35,0.06)', border:'1px solid rgba(245,166,35,0.15)', borderRadius:14, padding:'1.5rem', marginBottom:24 }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
              <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(245,166,35,0.15)', border:`2px solid ${gold}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>👤</div>
              <div>
                <div style={{ fontWeight:700, fontSize:15 }}>Manager WinPartners</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:2, display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ width:7, height:7, borderRadius:'50%', background:'#10b981', display:'inline-block' }}/>
                  Online acum · răspunde în maxim 2 ore
                </div>
              </div>
            </div>
            <a href="https://t.me/winpartners_support" target="_blank" rel="noreferrer"
              style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'11px', borderRadius:8, background:'#229ED9', color:'#fff', textDecoration:'none', fontWeight:700, fontSize:14, width:'100%', boxSizing:'border-box' }}>
              ✈️ Scrie pe Telegram acum
            </a>
          </div>

          {/* Contact list */}
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {contacts.map(({ icon, label, val, href }) => (
              <div key={label} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 14px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10 }}>
                <div style={{ fontSize:20, flexShrink:0 }}>{icon}</div>
                <div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:2 }}>{label}</div>
                  {href
                    ? <a href={href} style={{ fontSize:13, fontWeight:600, color:gold, textDecoration:'none' }}>{val}</a>
                    : <div style={{ fontSize:13, fontWeight:600 }}>{val}</div>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dreapta — formular */}
        <div>
          <h2 style={{ fontSize:20, fontWeight:700, marginBottom:24 }}>Trimite un mesaj</h2>

          {status === 'sent' ? (
            <div style={{ textAlign:'center', padding:'3rem 2rem', background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:14 }}>
              <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
              <div style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>Mesaj trimis!</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.45)', lineHeight:1.7 }}>
                Te vom contacta în maxim 24 ore pe emailul tău.<br/>
                Pentru răspuns instant scrie pe <a href="https://t.me/winpartners_support" style={{ color:gold }}>Telegram</a>.
              </div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em', display:'block', marginBottom:5 }}>Numele tău *</label>
                  <input style={inp} placeholder="Ion Popescu" value={form.name} onChange={set('name')}/>
                </div>
                <div>
                  <label style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em', display:'block', marginBottom:5 }}>Email *</label>
                  <input style={inp} type="email" placeholder="ion@gmail.com" value={form.email} onChange={set('email')}/>
                </div>
              </div>

              <div>
                <label style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em', display:'block', marginBottom:5 }}>Subiect</label>
                <input style={inp} placeholder="ex: Întrebare despre comisioane" value={form.subject} onChange={set('subject')}/>
              </div>

              <div>
                <label style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em', display:'block', marginBottom:5 }}>Mesaj *</label>
                <textarea style={{ ...inp, height:140, resize:'vertical' }} placeholder="Scrie mesajul tău aici..." value={form.message} onChange={set('message')}/>
              </div>

              {status === 'error' && (
                <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:6, padding:'10px 14px', fontSize:13, color:'#ef4444' }}>
                  ⚠ Eroare la trimitere. Contactează-ne direct pe <a href="https://t.me/winpartners_support" style={{ color:gold }}>Telegram</a>.
                </div>
              )}

              <button onClick={send} disabled={status === 'sending'}
                style={{ padding:'13px', fontSize:14, fontWeight:700, cursor:status==='sending'?'wait':'pointer', border:'none', borderRadius:8, background:gold, color:'#000', textTransform:'uppercase', letterSpacing:'.05em', fontFamily:'inherit', opacity:status==='sending'?0.7:1 }}>
                {status === 'sending' ? '⏳ SE TRIMITE...' : 'TRIMITE MESAJ →'}
              </button>

              <p style={{ textAlign:'center', fontSize:11, color:'rgba(255,255,255,0.2)', margin:0 }}>
                Sau scrie direct pe <a href="https://t.me/winpartners_support" style={{ color:gold }}>@winpartners_support</a> pentru răspuns instant
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
