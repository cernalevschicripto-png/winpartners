import { useState } from 'react'
import { applyPasswordReset } from '../db.js'

const gold = '#f5a623'
const box = { width:'100%', padding:'11px 14px', fontSize:14, border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, background:'rgba(255,255,255,0.05)', color:'#e2e8f0', outline:'none', boxSizing:'border-box' }
const lblS = { fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:5, textTransform:'uppercase', fontWeight:600 }

const lang = (() => { const s = localStorage.getItem('wp_lang'); return ['ro','ru','en','tr','de','pt','pl'].includes(s) ? s : 'ro' })()
const L = (o) => o[lang] || o.ro

export default function ResetPassword() {
  const token = new URLSearchParams(window.location.search).get('token') || ''
  const [p1, setP1] = useState('')
  const [p2, setP2] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async () => {
    if (!token) { setMsg(L({ro:'Link invalid sau lipsă token.',ru:'Неверная ссылка или отсутствует токен.',en:'Invalid link or missing token.',tr:'Geçersiz bağlantı veya eksik token.',de:'Ungültiger Link oder fehlendes Token.',pt:'Link inválido ou token em falta.',pl:'Nieprawidłowy link lub brak tokenu.'})); return }
    if (p1.length < 6) { setMsg(L({ro:'Parola trebuie să aibă minim 6 caractere.',ru:'Пароль должен содержать минимум 6 символов.',en:'Password must be at least 6 characters.',tr:'Şifre en az 6 karakter olmalı.',de:'Das Passwort muss mindestens 6 Zeichen haben.',pt:'A senha deve ter no mínimo 6 caracteres.',pl:'Hasło musi mieć co najmniej 6 znaków.'})); return }
    if (p1 !== p2) { setMsg(L({ro:'Parolele nu coincid.',ru:'Пароли не совпадают.',en:'Passwords do not match.',tr:'Şifreler eşleşmiyor.',de:'Die Passwörter stimmen nicht überein.',pt:'As senhas não coincidem.',pl:'Hasła nie są zgodne.'})); return }
    setBusy(true); setMsg('')
    try {
      const r = await applyPasswordReset(token, p1)
      if (r.ok) { setDone(true) }
      else if (r.reason === 'expired') setMsg(L({ro:'Link-ul a expirat. Cere unul nou din pagina de login.',ru:'Срок действия ссылки истёк. Запросите новую на странице входа.',en:'The link has expired. Request a new one from the login page.',tr:'Bağlantının süresi doldu. Giriş sayfasından yenisini isteyin.',de:'Der Link ist abgelaufen. Fordern Sie einen neuen auf der Login-Seite an.',pt:'O link expirou. Solicite um novo na página de login.',pl:'Link wygasł. Poproś o nowy na stronie logowania.'}))
      else if (r.reason === 'invalid_token') setMsg(L({ro:'Link invalid sau deja folosit. Cere unul nou.',ru:'Неверная или уже использованная ссылка. Запросите новую.',en:'Invalid or already used link. Request a new one.',tr:'Geçersiz veya kullanılmış bağlantı. Yenisini isteyin.',de:'Ungültiger oder bereits verwendeter Link. Fordern Sie einen neuen an.',pt:'Link inválido ou já usado. Solicite um novo.',pl:'Nieprawidłowy lub już użyty link. Poproś o nowy.'}))
      else setMsg(L({ro:'Eroare la salvare. Încearcă din nou.',ru:'Ошибка при сохранении. Попробуйте снова.',en:'Error saving. Try again.',tr:'Kaydetme hatası. Tekrar deneyin.',de:'Fehler beim Speichern. Versuchen Sie es erneut.',pt:'Erro ao guardar. Tente novamente.',pl:'Błąd zapisu. Spróbuj ponownie.'}))
    } catch(e) { setMsg(L({ro:'Eroare de conexiune. Încearcă din nou.',ru:'Ошибка соединения. Попробуйте снова.',en:'Connection error. Try again.',tr:'Bağlantı hatası. Tekrar deneyin.',de:'Verbindungsfehler. Versuchen Sie es erneut.',pt:'Erro de ligação. Tente novamente.',pl:'Błąd połączenia. Spróbuj ponownie.'})) }
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
              <h2 style={{ fontSize:18, fontWeight:700, color:'#fff', marginBottom:10 }}>{L({ro:'Parolă schimbată!',ru:'Пароль изменён!',en:'Password changed!',tr:'Şifre değiştirildi!',de:'Passwort geändert!',pt:'Senha alterada!',pl:'Hasło zmienione!'})}</h2>
              <p style={{ color:'rgba(255,255,255,0.5)', fontSize:14, marginBottom:20 }}>{L({ro:'Te poți loga acum cu noua parolă.',ru:'Теперь вы можете войти с новым паролем.',en:'You can now log in with your new password.',tr:'Artık yeni şifrenizle giriş yapabilirsiniz.',de:'Sie können sich jetzt mit Ihrem neuen Passwort anmelden.',pt:'Já pode entrar com a nova senha.',pl:'Możesz teraz zalogować się nowym hasłem.'})}</p>
              <a href="/dashboard" style={{ display:'inline-block', padding:'11px 24px', background:gold, color:'#000', borderRadius:8, textDecoration:'none', fontWeight:700, fontSize:14 }}>{L({ro:'Mergi la login',ru:'Перейти ко входу',en:'Go to login',tr:'Girişe git',de:'Zum Login',pt:'Ir para o login',pl:'Przejdź do logowania'})}</a>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize:18, fontWeight:700, color:'#fff', marginBottom:6, textAlign:'center' }}>{L({ro:'Setează o parolă nouă',ru:'Установите новый пароль',en:'Set a new password',tr:'Yeni bir şifre belirleyin',de:'Neues Passwort festlegen',pt:'Defina uma nova senha',pl:'Ustaw nowe hasło'})}</h2>
              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginBottom:18, textAlign:'center' }}>{L({ro:'Alege o parolă nouă pentru contul tău.',ru:'Выберите новый пароль для вашего аккаунта.',en:'Choose a new password for your account.',tr:'Hesabınız için yeni bir şifre seçin.',de:'Wählen Sie ein neues Passwort für Ihr Konto.',pt:'Escolha uma nova senha para a sua conta.',pl:'Wybierz nowe hasło do swojego konta.'})}</p>
              <div style={{ marginBottom:12 }}>
                <div style={lblS}>{L({ro:'Parolă nouă',ru:'Новый пароль',en:'New password',tr:'Yeni şifre',de:'Neues Passwort',pt:'Nova senha',pl:'Nowe hasło'})}</div>
                <input style={box} type="password" placeholder={L({ro:'Minim 6 caractere',ru:'Минимум 6 символов',en:'Min 6 characters',tr:'En az 6 karakter',de:'Mind. 6 Zeichen',pt:'Mín. 6 caracteres',pl:'Min. 6 znaków'})} value={p1} onChange={e=>setP1(e.target.value)} />
              </div>
              <div style={{ marginBottom:16 }}>
                <div style={lblS}>{L({ro:'Confirmă parola',ru:'Подтвердите пароль',en:'Confirm password',tr:'Şifreyi onayla',de:'Passwort bestätigen',pt:'Confirme a senha',pl:'Potwierdź hasło'})}</div>
                <input style={box} type="password" placeholder={L({ro:'Reintrodu parola',ru:'Повторите пароль',en:'Re-enter password',tr:'Şifreyi tekrar girin',de:'Passwort erneut eingeben',pt:'Reintroduza a senha',pl:'Wpisz hasło ponownie'})} value={p2} onChange={e=>setP2(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} />
              </div>
              {msg && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#ef4444', marginBottom:14 }}>{msg}</div>}
              <button disabled={busy} onClick={submit} style={{ width:'100%', padding:'13px', fontSize:15, fontWeight:700, cursor:busy?'wait':'pointer', border:'none', borderRadius:8, background:gold, color:'#000', opacity:busy?0.7:1 }}>{busy ? '⏳ ...' : L({ro:'Schimbă parola',ru:'Изменить пароль',en:'Change password',tr:'Şifreyi değiştir',de:'Passwort ändern',pt:'Alterar senha',pl:'Zmień hasło'})}</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
