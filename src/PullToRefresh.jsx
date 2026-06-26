import React, { useEffect, useRef, useState } from 'react'

// Pull-to-refresh global: tragi de sus în jos (când ești în vârf) → pagina se reîmprospătează.
// Funcționează pe mobil (touch). Pe desktop nu se activează.
export default function PullToRefresh({ children }) {
  const [pull, setPull] = useState(0)        // câți px a tras în jos
  const [refreshing, setRefreshing] = useState(false)
  const startY = useRef(0)
  const pulling = useRef(false)

  const THRESHOLD = 70   // px de tras ca să declanșeze refresh
  const MAX = 110        // px maxim afișat

  useEffect(() => {
    // verifică dacă elementul atins (sau părinții) e deja scrollat în jos.
    // Dacă da, nu pornim pull-to-refresh (lăsăm scroll-ul normal).
    const atTop = (target) => {
      let el = target
      while (el && el !== document.body && el !== document.documentElement) {
        if (el.scrollTop && el.scrollTop > 0) return false
        el = el.parentElement
      }
      return (window.scrollY || document.documentElement.scrollTop || 0) <= 0
    }

    const onStart = (e) => {
      if (refreshing) return
      if (!atTop(e.target)) { pulling.current = false; return }
      startY.current = e.touches[0].clientY
      pulling.current = true
    }

    const onMove = (e) => {
      if (!pulling.current || refreshing) return
      const dy = e.touches[0].clientY - startY.current
      if (dy > 0) {
        // rezistență: tragi mai greu pe măsură ce cobori
        const dist = Math.min(MAX, dy * 0.5)
        setPull(dist)
        if (dist > 5 && e.cancelable) e.preventDefault()  // blochează bounce-ul nativ doar când chiar tragem
      } else {
        setPull(0)
      }
    }

    const onEnd = () => {
      if (!pulling.current) return
      pulling.current = false
      if (pull >= THRESHOLD && !refreshing) {
        setRefreshing(true)
        setPull(MAX)
        setTimeout(() => window.location.reload(), 400)
      } else {
        setPull(0)
      }
    }

    document.addEventListener('touchstart', onStart, { passive: true })
    document.addEventListener('touchmove', onMove, { passive: false })
    document.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      document.removeEventListener('touchstart', onStart)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onEnd)
    }
  }, [pull, refreshing])

  const show = pull > 0 || refreshing
  const ready = pull >= THRESHOLD

  return (
    <>
      {show && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
          height: pull, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          pointerEvents: 'none', overflow: 'hidden'
        }}>
          <div style={{
            marginBottom: 12, width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(10,10,15,0.9)', border: '1px solid rgba(245,166,35,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
          }}>
            <div style={{
              width: 18, height: 18,
              border: '2px solid rgba(245,166,35,0.25)',
              borderTop: '2px solid #f5a623', borderRadius: '50%',
              transform: refreshing ? 'none' : `rotate(${pull * 3}deg)`,
              animation: refreshing ? 'wpspin 0.7s linear infinite' : 'none'
            }} />
          </div>
          <style>{'@keyframes wpspin{to{transform:rotate(360deg)}}'}</style>
        </div>
      )}
      <div style={{
        transform: show ? `translateY(${pull}px)` : 'none',
        transition: pulling.current ? 'none' : 'transform .25s ease'
      }}>
        {children}
      </div>
    </>
  )
}
