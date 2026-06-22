import { Component } from 'react'

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
            Ceva nu a funcționat
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 32, maxWidth: 380 }}>
            A apărut o problemă temporară. Încearcă să reîncarci pagina.
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '11px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', border: 'none', borderRadius: 8, background: '#f5a623', color: '#000' }}>
              ↺ Reîncarcă pagina
            </button>
            <button
              onClick={() => { window.location.href = '/' }}
              style={{ padding: '11px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', border: '1px solid rgba(245,166,35,0.4)', borderRadius: 8, background: 'none', color: '#f5a623' }}>
              ← Pagina principală
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
