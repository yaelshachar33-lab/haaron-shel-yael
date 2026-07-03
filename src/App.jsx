import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import MainSite from './MainSite'
import AdminPage from './pages/AdminPage'
import TermsPage from './pages/TermsPage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'

const SUB_PAGES = ['/about', '/contact', '/terms']

function AppContent() {
  const { pathname } = useLocation()
  const isSubPage = SUB_PAGES.includes(pathname)

  useEffect(() => {
    if (pathname === '/') window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <>
      {/* MainSite always mounted — video keeps playing */}
      <div style={{ display: pathname === '/admin' ? 'none' : 'block' }}>
        <MainSite />
      </div>

      {/* Sub-pages as full-screen overlay */}
      {isSubPage && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-cream-100">
          {pathname === '/about'   && <AboutPage />}
          {pathname === '/contact' && <ContactPage />}
          {pathname === '/terms'   && <TermsPage />}
        </div>
      )}

      {/* Admin — separate page */}
      {pathname === '/admin' && <AdminPage />}
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  )
}
