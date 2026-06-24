import { useState } from 'react'
import { applyPasswordReset } from '../db.js'

const gold = '#f5a623'
const box = { width:'100%', padding:'11px 14px', fontSize:14, border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, background:'rgba(255,255,255,0.05)', color:'#e2e8f0', outline:'none', boxSizing:'border-box' }
const lblS = { fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:5, textTransform:'uppercase', fontWeight:600 }

export default function ResetPassword() {
  const token = new URLSearchParams(window.location.search).get('token') || ''
  const [p1, setP1] = useState('')
  const [p2, setP2] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async () => {
    if (!token) { setMsg('Link invalid sau lipsă token.'); return }
    if (p1.length < 6) { setMsg('Parola trebuie să aibă minim 6 caractere.'); return }
    if (p1 !== p2) { setMsg('Parolele nu coincid.'); return }
    setBusy(true); setMsg('')
    try {
      const r = await applyPasswordReset(token, p1)
      if (r.ok) { setDone(true) }
      else if (r.reason === 'expired') setMsg('Link-ul a expirat. Cere unul nou din pagina de login.')
      else if (r.reason === 'invalid_token') setMsg('Link invalid sau deja folosit. Cere unul nou.')
      else setMsg('Eroare la salvare. Încearcă din nou.')
    } catch(e) { setMsg('Eroare de conexiune. Încearcă din nou.') }
    setBusy(false)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0f', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter,sans-serif' }}>
      <div style={{ maxWidth:380, width:'100%', padding:'2rem' }}>
        <div style={{ fontSize:28, fontWeight:900, marginBottom:20, color:'#fff', textAlign:'center' }}>WIN<span style={{ color:gold }}>PARTNERS</span></div>
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(245,166,35,0.15)', borderRadius:16, padding:'2rem' }}>
          {done ? (
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:40, marginBottom:12 }}>✅</div>
              <h2 style={{ fontSize:18, fontWeight:700, color:'#fff', marginBottom:10 }}>Parolă schimbată!</h2>
              <p style={{ color:'rgba(255,255,255,0.5)', fontSize:14, marginBottom:20 }}>Te poți loga acum cu noua parolă.</p>
              <a href="/dashboard" style={{ display:'inline-block', padding:'11px 24px', background:gold, color:'#000', borderRadius:8, textDecoration:'none', fontWeight:700, fontSize:14 }}>Mergi la login</a>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize:18, fontWeight:700, color:'#fff', marginBottom:6, textAlign:'center' }}>Setează o parolă nouă</h2>
              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginBottom:18, textAlign:'center' }}>Alege o parolă nouă pentru contul tău.</p>
              <div style={{ marginBottom:12 }}>
                <div style={lblS}>Parolă nouă</div>
                <input style={box} type="password" placeholder="Minim 6 caractere" value={p1} onChange={e=>setP1(e.target.value)} />
              </div>
              <div style={{ marginBottom:16 }}>
                <div style={lblS}>Confirmă parola</div>
                <input style={box} type="password" placeholder="Reintrodu parola" value={p2} onChange={e=>setP2(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} />
              </div>
              {msg && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#ef4444', marginBottom:14 }}>{msg}</div>}
              <button disabled={busy} onClick={submit} style={{ width:'100%', padding:'13px', fontSize:15, fontWeight:700, cursor:busy?'wait':'pointer', border:'none', borderRadius:8, background:gold, color:'#000', opacity:busy?0.7:1 }}>{busy ? '⏳ ...' : 'Schimbă parola'}</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
