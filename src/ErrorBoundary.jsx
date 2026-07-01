import { Component } from 'react'

// Traduceri pentru ecranul de eroare (7 limbi). Citim limba din localStorage.
const T = {
  ro: { title: 'Ceva nu a funcționat', sub: 'A apărut o problemă temporară. Încearcă să reîncarci pagina.', reload: '↺ Reîncarcă pagina', home: '← Pagina principală' },
  ru: { title: 'Что-то пошло не так', sub: 'Произошла временная ошибка. Попробуйте перезагрузить страницу.', reload: '↺ Перезагрузить', home: '← На главную' },
  en: { title: 'Something went wrong', sub: 'A temporary problem occurred. Try reloading the page.', reload: '↺ Reload page', home: '← Homepage' },
  tr: { title: 'Bir şeyler ters gitti', sub: 'Geçici bir sorun oluştu. Sayfayı yeniden yüklemeyi deneyin.', reload: '↺ Sayfayı yenile', home: '← Ana sayfa' },
  de: { title: 'Etwas ist schiefgelaufen', sub: 'Ein vorübergehendes Problem ist aufgetreten. Bitte laden Sie die Seite neu.', reload: '↺ Seite neu laden', home: '← Startseite' },
  pt: { title: 'Algo deu errado', sub: 'Ocorreu um problema temporário. Tente recarregar a página.', reload: '↺ Recarregar página', home: '← Página inicial' },
  pl: { title: 'Coś poszło nie tak', sub: 'Wystąpił tymczasowy problem. Spróbuj odświeżyć stronę.', reload: '↺ Odśwież stronę', home: '← Strona główna' },
}

function getLang() {
  try {
    const l = localStorage.getItem('wp_lang')
    return T[l] ? l : 'en'
  } catch (e) {
    return 'en'
  }
}

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Log silențios — nu afișăm erori tehnice utilizatorului
    console.error('WinPartners error:', error.message)
  }

  render() {
    if (this.state.hasError) {
      const t = T[getLang()]
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0a0a0f',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
          color: '#e2e8f0',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
            {t.title}
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 32, maxWidth: 380 }}>
            {t.sub}
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '11px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', border: 'none', borderRadius: 8, background: '#f5a623', color: '#000' }}>
              {t.reload}
            </button>
            <button
              onClick={() => { window.location.href = '/' }}
              style={{ padding: '11px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', border: '1px solid rgba(245,166,35,0.4)', borderRadius: 8, background: 'none', color: '#f5a623' }}>
              {t.home}
            </button>
          </div>
          <div style={{ marginTop: 48, fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
            WIN<span style={{ color: '#f5a623' }}>PARTNERS</span> · winpartners.pro
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
