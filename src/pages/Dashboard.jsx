import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const gold = '#f5a623'

// Date demo per blogger
const BLOGGERS = {
  'ionpopescu': {
    name:'Ion Popescu', username:'ionpopescu', platform:'TikTok',
    promoCode:'IONPOPESCU_WIN', refCode:'REF_ION2026',
    commission:20, refCommission:3,
    stats: {
      clicks:1247, regs:89, depositors:34, revenue:1840,
      paid:920, pending:448,
      yesterday:{clicks:145,regs:12,depositors:4,revenue:280},
      thisMonth:{clicks:890,regs:62,depositors:22,revenue:1240},
      last30:{clicks:1247,regs:89,depositors:34,revenue:1840},
    },
    daily:[
      {date:'06.06',clicks:145,regs:12,depositors:4,revenue:280},
      {date:'07.06',clicks:198,regs:18,depositors:6,revenue:340},
      {date:'08.06',clicks:167,regs:14,depositors:5,revenue:210},
      {date:'09.06',clicks:223,regs:21,depositors:8,revenue:410},
      {date:'10.06',clicks:189,regs:16,depositors:6,revenue:320},
      {date:'11.06',clicks:201,regs:19,depositors:7,revenue:280},
      {date:'12.06',clicks:124,regs:11,depositors:4,revenue:0},
    ],
    referrals:[
      {name:'@alex_md',platform:'Instagram',regs:23,revenue:180,myCommission:5.4,date:'05.06.2026'},
      {name:'@vlad_gaming',platform:'YouTube',regs:45,revenue:340,myCommission:10.2,date:'02.06.2026'},
      {name:'@marina_ro',platform:'TikTok',regs:12,revenue:90,myCommission:2.7,date:'08.06.2026'},
    ],
    payments:[
      {date:'01.06.2026',amount:920,method:'Bitcoin',status:'plătit'},
      {date:'01.05.2026',amount:780,method:'Bitcoin',status:'plătit'},
    ]
  }
}

const DEFAULT = BLOGGERS['ionpopescu']

export default function Dashboard() {
  const [tab, setTab] = useState('overview')
  const [copied, setCopied] = useState('')
  const [showPayReq, setShowPayReq] = useState(false)
  const [showCodeReq, setShowCodeReq] = useState(false)
  const [codeReqText, setCodeReqText] = useState('')
  const [payMethod, setPayMethod] = useState('Bitcoin')
  const [payAddress, setPayAddress] = useState('')
  const [payReqSent, setPayReqSent] = useState(false)
  const [codeReqSent, setCodeReqSent] = useState(false)
  const navigate = useNavigate()

  const d = DEFAULT
  const s = d.stats
  const refLink = `https://winpartners.partners/register?ref=${d.refCode}`
  const myComm = Math.round(s.revenue * d.commission / 100)
  const refEarnings = d.referrals.reduce((sum,r) => sum+r.myCommission, 0)

  const copy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(''), 2000)
    })
  }

  const inp = {width:'100%',padding:'9px 12px',fontSize:13,border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,background:'rgba(255,255,255,0.05)',color:'#e2e8f0',outline:'none',boxSizing:'border-box'}
  const tabBtn = (t) => ({padding:'8px 18px',fontSize:13,cursor:'pointer',border:'none',background:'none',color:tab===t?gold:'rgba(255,255,255,0.4)',borderBottom:tab===t?`2px solid ${gold}`:'2px solid transparent',marginBottom:-1,fontWeight:tab===t?700:400})
  const card = {background:'rgba(255,255,255,0.03)',border:'1px solid rgba(245,166,35,0.1)',borderRadius:12,padding:'1.25rem'}
  const th = {textAlign:'left',padding:'9px 12px',color:'rgba(255,255,255,0.35)',fontWeight:400,borderBottom:'1px solid rgba(255,255,255,0.07)',fontSize:11,textTransform:'uppercase',letterSpacing:'.05em'}
  const td = {padding:'9px 12px',borderBottom:'1px solid rgba(255,255,255,0.04)',color:'#e2e8f0',fontSize:13}

  return (
    <div style={{background:'#0a0a0f',minHeight:'100vh',color:'#fff',fontFamily:'Inter,sans-serif'}}>
      {/* NAV */}
      <nav style={{background:'rgba(10,10,15,0.97)',borderBottom:'1px solid rgba(245,166,35,0.12)',padding:'0 2rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:60}}>
        <div onClick={()=>navigate('/')} style={{fontSize:18,fontWeight:900,cursor:'pointer'}}>
          WIN<span style={{color:gold}}>PARTNERS</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:32,height:32,borderRadius:'50%',background:`linear-gradient(135deg,${gold},#e08600)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#000'}}>{d.name[0]}</div>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:'#fff'}}>{d.name}</div>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>@{d.username} · {d.platform}</div>
          </div>
          <button style={{padding:'5px 12px',fontSize:12,cursor:'pointer',border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,background:'none',color:'#94a3b8'}} onClick={()=>navigate('/')}>Logout</button>
        </div>
      </nav>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'2rem 1.5rem'}}>

        {/* PROMO CODE + REF LINK */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:'1.5rem'}}>
          <div style={{...card,background:'linear-gradient(135deg,rgba(245,166,35,0.1),rgba(245,166,35,0.05))'}}>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>Codul tău promoțional</div>
            <div style={{fontSize:26,fontWeight:900,color:gold,fontFamily:'monospace',letterSpacing:'.05em',marginBottom:10}}>{d.promoCode}</div>
            <div style={{display:'flex',gap:8}}>
              <button style={{padding:'6px 14px',fontSize:12,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:copied==='promo'?'#10b981':gold,color:'#000'}} onClick={()=>copy(d.promoCode,'promo')}>
                {copied==='promo'?'✓ Copiat!':'Copiază codul'}
              </button>
              <button style={{padding:'6px 14px',fontSize:12,fontWeight:600,cursor:'pointer',border:`1px solid ${gold}`,borderRadius:6,background:'none',color:gold}} onClick={()=>setShowCodeReq(true)}>
                Cere cod personalizat
              </button>
            </div>
          </div>
          <div style={card}>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>Linkul tău de referral (invită bloggeri)</div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.6)',fontFamily:'monospace',marginBottom:10,wordBreak:'break-all',background:'rgba(0,0,0,0.3)',padding:'6px 10px',borderRadius:6}}>{refLink}</div>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <button style={{padding:'6px 14px',fontSize:12,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:copied==='ref'?'#10b981':gold,color:'#000'}} onClick={()=>copy(refLink,'ref')}>
                {copied==='ref'?'✓ Copiat!':'Copiază linkul'}
              </button>
              <span style={{fontSize:12,color:'#10b981',fontWeight:600}}>+{d.refCommission}% din câștigurile lor pe viață!</span>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div style={{display:'flex',gap:4,borderBottom:'1px solid rgba(255,255,255,0.07)',marginBottom:'1.5rem'}}>
          {[['overview','Overview'],['stats','Statistici'],['referrals','Referrali & Comision'],['payments','Plăți']].map(([id,lbl]) => (
            <button key={id} style={tabBtn(id)} onClick={()=>setTab(id)}>{lbl}</button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab==='overview' && (
          <div>
            {/* Period cards */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:'1.5rem'}}>
              {[
                ['Disponibil retragere','$'+s.pending,'#10b981'],
                ['Ieri','$'+Math.round(s.yesterday.revenue*d.commission/100),'#f59e0b'],
                ['Luna curentă','$'+Math.round(s.thisMonth.revenue*d.commission/100),gold],
                ['Total câștigat','$'+myComm,gold],
              ].map(([l,v,c]) => (
                <div key={l} style={card}>
                  <div style={{fontSize:10,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>{l}</div>
                  <div style={{fontSize:28,fontWeight:900,color:c}}>{v}</div>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:'1.5rem'}}>
              {[
                ['Vizualizări','—'],
                ['Click-uri',s.clicks.toLocaleString()],
                ['Înregistrări',s.regs],
                ['Depunători noi',s.depositors],
              ].map(([l,v]) => (
                <div key={l} style={{...card,textAlign:'center'}}>
                  <div style={{fontSize:10,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>{l}</div>
                  <div style={{fontSize:22,fontWeight:700,color:'#fff'}}>{v}</div>
                </div>
              ))}
            </div>

            {/* Daily table */}
            <div style={{...card,marginBottom:'1.5rem'}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Statistici zilnice</div>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                  <thead>
                    <tr>
                      {['Data','Click-uri','Înregistrări','Depunători','Venit net (Melbet)','Comisionul meu (20%)'].map(h => <th key={h} style={th}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {d.daily.map(r => (
                      <tr key={r.date}>
                        <td style={td}>{r.date}</td>
                        <td style={td}>{r.clicks}</td>
                        <td style={td}>{r.regs}</td>
                        <td style={td}>{r.depositors}</td>
                        <td style={td}>${r.revenue.toLocaleString()}</td>
                        <td style={{...td,color:r.revenue>0?gold:'rgba(255,255,255,0.3)',fontWeight:r.revenue>0?700:400}}>
                          {r.revenue>0 ? '$'+Math.round(r.revenue*0.2) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Request payout */}
            <div style={{textAlign:'center'}}>
              <button onClick={()=>setShowPayReq(true)} style={{padding:'14px 40px',fontSize:15,fontWeight:700,cursor:'pointer',border:'none',borderRadius:8,background:gold,color:'#000'}}>
                Solicită plată → ${s.pending}
              </button>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.3)',marginTop:8}}>Minimum $30 · Procesare în 48 ore</div>
            </div>
          </div>
        )}

        {/* STATS */}
        {tab==='stats' && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:'1.5rem'}}>
              {[
                {period:'Ieri',data:s.yesterday},
                {period:'Luna curentă',data:s.thisMonth},
                {period:'Ultimele 30 zile',data:s.last30},
              ].map(({period,data}) => (
                <div key={period} style={card}>
                  <div style={{fontSize:12,fontWeight:700,color:gold,marginBottom:12,textTransform:'uppercase',letterSpacing:'.05em'}}>{period}</div>
                  {[['Click-uri',data.clicks],['Înregistrări',data.regs],['Depunători',data.depositors],['Venit net','$'+data.revenue],['Comisionul meu','$'+Math.round(data.revenue*0.2)]].map(([l,v]) => (
                    <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                      <span style={{fontSize:13,color:'rgba(255,255,255,0.5)'}}>{l}</span>
                      <span style={{fontSize:13,fontWeight:600,color:'#fff'}}>{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={card}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Statistici pe zile</div>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                  <thead>
                    <tr>{['Data','Click-uri','Înregistrări','Depunători noi','Venit net','Suma comisionului'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {d.daily.map(r => (
                      <tr key={r.date}>
                        <td style={td}>{r.date}</td>
                        <td style={td}>{r.clicks}</td>
                        <td style={td}>{r.regs}</td>
                        <td style={td}>{r.depositors}</td>
                        <td style={td}>${r.revenue}</td>
                        <td style={{...td,color:r.revenue>0?gold:'rgba(255,255,255,0.3)',fontWeight:700}}>{r.revenue>0?'$'+Math.round(r.revenue*0.2):'—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* REFERRALS */}
        {tab==='referrals' && (
          <div>
            {/* How it works */}
            <div style={{...card,background:'rgba(16,185,129,0.05)',border:'1px solid rgba(16,185,129,0.2)',marginBottom:'1.5rem'}}>
              <div style={{fontSize:14,fontWeight:700,color:'#10b981',marginBottom:8}}>💰 Cum câștig din referrali?</div>
              <p style={{fontSize:13,color:'rgba(255,255,255,0.6)',lineHeight:1.7}}>
                Trimite linkul tău de referral prietenilor bloggeri. Când ei se înregistrează și încep să câștige,
                tu primești automat <strong style={{color:'#10b981'}}>3% din câștigurile lor pe viață</strong> — fără niciun efort suplimentar.
                Cu cât mai mulți bloggeri aduci, cu atât câștigul tău pasiv crește!
              </p>
            </div>

            {/* Ref link big */}
            <div style={{...card,marginBottom:'1.5rem',textAlign:'center'}}>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:8}}>LINKUL TĂU PERSONAL DE REFERRAL</div>
              <div style={{fontSize:14,fontFamily:'monospace',color:gold,background:'rgba(0,0,0,0.3)',padding:'10px 16px',borderRadius:8,marginBottom:12,wordBreak:'break-all'}}>{refLink}</div>
              <button style={{padding:'10px 28px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:copied==='ref2'?'#10b981':gold,color:'#000'}} onClick={()=>copy(refLink,'ref2')}>
                {copied==='ref2'?'✓ Copiat!':'Copiază linkul de referral'}
              </button>
            </div>

            {/* Stats */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:'1.5rem'}}>
              {[
                ['Bloggeri invitați',d.referrals.length,'#3b82f6'],
                ['Total câștigat din referrali','$'+refEarnings.toFixed(2),'#10b981'],
                ['Comision referral','3%',gold],
              ].map(([l,v,c]) => (
                <div key={l} style={{...card,textAlign:'center'}}>
                  <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>{l}</div>
                  <div style={{fontSize:26,fontWeight:800,color:c}}>{v}</div>
                </div>
              ))}
            </div>

            {/* Referrals table */}
            <div style={card}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Bloggerii tăi ({d.referrals.length})</div>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                <thead>
                  <tr>{['Blogger','Platformă','Data înregistrării','Înregistrări aduse','Câștigurile lui','Comisionul meu (3%)'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {d.referrals.map(r => (
                    <tr key={r.name}>
                      <td style={{...td,fontWeight:600}}>{r.name}</td>
                      <td style={td}>{r.platform}</td>
                      <td style={{...td,color:'rgba(255,255,255,0.4)'}}>{r.date}</td>
                      <td style={td}>{r.regs}</td>
                      <td style={td}>${r.revenue}</td>
                      <td style={{...td,color:'#10b981',fontWeight:700}}>${r.myCommission.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYMENTS */}
        {tab==='payments' && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:'1.5rem'}}>
              {[
                ['Total câștigat','$'+myComm,gold],
                ['Total plătit','$'+s.paid,'#10b981'],
                ['Disponibil retragere','$'+s.pending,'#f59e0b'],
              ].map(([l,v,c]) => (
                <div key={l} style={{...card,textAlign:'center'}}>
                  <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>{l}</div>
                  <div style={{fontSize:28,fontWeight:800,color:c}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
              <button onClick={()=>setShowPayReq(true)} style={{padding:'14px 40px',fontSize:15,fontWeight:700,cursor:'pointer',border:'none',borderRadius:8,background:gold,color:'#000'}}>
                Solicită plată → ${s.pending}
              </button>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.3)',marginTop:8}}>Minimum $30 · Plăți Bitcoin, Skrill, Neteller, Visa</div>
            </div>
            <div style={card}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Istoricul plăților</div>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                <thead>
                  <tr>{['Data','Sumă','Metodă','Status'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {d.payments.map((p,i) => (
                    <tr key={i}>
                      <td style={td}>{p.date}</td>
                      <td style={{...td,fontWeight:600,color:'#10b981'}}>${p.amount}</td>
                      <td style={td}>{p.method}</td>
                      <td style={td}>
                        <span style={{background:'#10b98122',color:'#10b981',padding:'2px 8px',borderRadius:4,fontSize:11,fontWeight:600}}>{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* PAY REQUEST MODAL */}
      {showPayReq && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:'1rem'}} onClick={()=>setShowPayReq(false)}>
          <div style={{background:'#0d0d1f',border:'1px solid rgba(245,166,35,0.2)',borderRadius:16,padding:'1.5rem',width:'100%',maxWidth:420}} onClick={e=>e.stopPropagation()}>
            {payReqSent ? (
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:48,marginBottom:12}}>✅</div>
                <h3 style={{color:'#fff',fontWeight:700,marginBottom:8}}>Cerere trimisă!</h3>
                <p style={{color:'rgba(255,255,255,0.5)',fontSize:13,marginBottom:20}}>Plata va fi procesată în 48 ore lucrătoare.</p>
                <button style={{padding:'10px 24px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:gold,color:'#000'}} onClick={()=>{setShowPayReq(false);setPayReqSent(false)}}>Închide</button>
              </div>
            ) : (
              <>
                <h3 style={{color:'#fff',fontWeight:700,marginBottom:4}}>Solicită plată</h3>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginBottom:16}}>Disponibil: <strong style={{color:gold}}>${s.pending}</strong></p>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:4}}>Metodă de plată</div>
                <select style={{...inp,marginBottom:12}} value={payMethod} onChange={e=>setPayMethod(e.target.value)}>
                  {['Bitcoin','Skrill','Neteller','PAYEER','Transfer bancar'].map(m => <option key={m} style={{background:'#1a1a2e'}}>{m}</option>)}
                </select>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:4}}>Adresa / contul tău de {payMethod}</div>
                <input style={{...inp,marginBottom:16}} placeholder={payMethod==='Bitcoin'?'bc1q...':payMethod+' cont/email'} value={payAddress} onChange={e=>setPayAddress(e.target.value)}/>
                <button style={{width:'100%',padding:'12px',fontSize:14,fontWeight:700,cursor:'pointer',border:'none',borderRadius:8,background:gold,color:'#000'}} onClick={()=>payAddress&&setPayReqSent(true)}>
                  Trimite cererea
                </button>
                <button style={{width:'100%',padding:'10px',fontSize:13,cursor:'pointer',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,background:'none',color:'#94a3b8',marginTop:8}} onClick={()=>setShowPayReq(false)}>Anulează</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* CODE REQUEST MODAL */}
      {showCodeReq && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:'1rem'}} onClick={()=>setShowCodeReq(false)}>
          <div style={{background:'#0d0d1f',border:'1px solid rgba(245,166,35,0.2)',borderRadius:16,padding:'1.5rem',width:'100%',maxWidth:400}} onClick={e=>e.stopPropagation()}>
            {codeReqSent ? (
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:48,marginBottom:12}}>✅</div>
                <h3 style={{color:'#fff',fontWeight:700,marginBottom:8}}>Cerere trimisă!</h3>
                <p style={{color:'rgba(255,255,255,0.5)',fontSize:13,marginBottom:20}}>Codul personalizat va fi activat în 24-48 ore.</p>
                <button style={{padding:'10px 24px',fontSize:13,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,background:gold,color:'#000'}} onClick={()=>{setShowCodeReq(false);setCodeReqSent(false)}}>Închide</button>
              </div>
            ) : (
              <>
                <h3 style={{color:'#fff',fontWeight:700,marginBottom:4}}>Cere cod personalizat</h3>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginBottom:16}}>Codul personalizat se activează în 24-48 ore.</p>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:4}}>Codul dorit (ex: IONEL, VLAD20, ALEX100)</div>
                <input style={{...inp,marginBottom:16,textTransform:'uppercase',fontFamily:'monospace',fontSize:15,fontWeight:700}} placeholder="IONEL" value={codeReqText} onChange={e=>setCodeReqText(e.target.value.toUpperCase())}/>
                <button style={{width:'100%',padding:'12px',fontSize:14,fontWeight:700,cursor:'pointer',border:'none',borderRadius:8,background:gold,color:'#000'}} onClick={()=>codeReqText&&setCodeReqSent(true)}>
                  Trimite cererea
                </button>
                <button style={{width:'100%',padding:'10px',fontSize:13,cursor:'pointer',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,background:'none',color:'#94a3b8',marginTop:8}} onClick={()=>setShowCodeReq(false)}>Anulează</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
