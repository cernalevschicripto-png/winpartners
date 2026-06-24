import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { _r, _rm } from './cfg.js'
import ErrorBoundary from './ErrorBoundary.jsx'
import './index.css'

const Landing      = lazy(() => import('./pages/Landing.jsx'))
const Register     = lazy(() => import('./pages/Register.jsx'))
const Dashboard    = lazy(() => import('./pages/Dashboard.jsx'))
const About        = lazy(() => import('./pages/About.jsx'))
const Benefits     = lazy(() => import('./pages/Benefits.jsx'))
const Instructions = lazy(() => import('./pages/Instructions.jsx'))
const FAQ          = lazy(() => import('./pages/FAQ.jsx'))
const Contact      = lazy(() => import('./pages/Contact.jsx'))
const Terms        = lazy(() => import('./pages/Terms.jsx'))
const Admin        = lazy(() => import('./pages/Admin.jsx'))
const AdminMobile  = lazy(() => import('./pages/AdminMobile.jsx'))
const NotFound     = lazy(() => import('./pages/NotFound.jsx'))
const Media        = lazy(() => import('./pages/Media.jsx'))

const PageLoader = () => (
  <div style={{minHeight:'100vh',background:'#0a0a0f',display:'flex',alignItems:'center',justifyContent:'center'}}>
    <div style={{width:32,height:32,border:'3px solid rgba(245,166,35,0.2)',borderTop:'3px solid #f5a623',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>
    <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
  </div>
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/benefits" element={<Benefits />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/media" element={<Media />} />
        <Route path={_r} element={<Admin />} />
        <Route path={_rm} element={<AdminMobile />} />
        <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
)
