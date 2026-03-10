import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Drama, Mail, Sparkles } from 'lucide-react'
import universityLogo from '../assets/ACity Logo NW landscape.png'

function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/tertulia', label: 'Tertulia' },
    { path: '/projects', label: 'Projects' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/team', label: 'Team' },
    { path: '/contact', label: 'Contact' }
  ]

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }, [location])

  return (
    <div className="min-h-screen bg-linear-to-br from-stone-900 via-amber-950 to-stone-900 relative overflow-hidden">
      {/* Bokeh ambient particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[
          { size: 280, top: '8%', left: '6%', dur: '18s', delay: '0s' },
          { size: 180, top: '70%', left: '85%', dur: '22s', delay: '4s' },
          { size: 220, top: '40%', left: '50%', dur: '26s', delay: '9s' },
          { size: 120, top: '20%', left: '75%', dur: '20s', delay: '2s' },
          { size: 160, top: '85%', left: '15%', dur: '24s', delay: '12s' },
        ].map((b, i) => (
          <div
            key={i}
            className="bokeh-dot"
            style={{
              width: b.size, height: b.size,
              top: b.top, left: b.left,
              animationDuration: b.dur,
              animationDelay: b.delay,
              opacity: 0.18,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
        ? 'bg-stone-950/95 backdrop-blur-lg border-b border-amber-900/25 shadow-xl shadow-black/30 py-0'
        : 'bg-transparent border-b border-transparent py-2'
        }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src={universityLogo} 
                alt="Academic City University Logo" 
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-xl font-serif font-bold tracking-wide text-amber-100">AMD CLUB</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium tracking-widest uppercase relative group transition-colors duration-200 ${location.pathname === link.path ? 'nav-link-active text-amber-100' : 'text-amber-100 hover:text-yellow-400'
                    }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-0.5 left-0 h-0.5 bg-yellow-600 transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                </Link>
              ))}
              <Link
                to="/contact"
                className="bg-yellow-600 hover:bg-yellow-500 text-stone-900 px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all duration-200 btn-ripple hover:shadow-lg hover:shadow-yellow-600/30 hover:-translate-y-0.5"
              >
                JOIN NOW
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className={`hamburger lg:hidden ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div className={`mobile-nav lg:hidden bg-stone-950/98 border-t border-amber-900/20 ${menuOpen ? 'open' : ''}`}>
          <div className="px-6 py-5 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-3 px-4 rounded-lg text-sm font-medium tracking-widest uppercase transition-colors ${location.pathname === link.path
                  ? 'bg-amber-900/30 text-amber-100 border border-amber-700/30'
                  : 'text-amber-100 hover:text-yellow-400 hover:bg-stone-800/60'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="block mt-4 text-center bg-yellow-600 hover:bg-yellow-500 text-stone-900 py-3 px-4 rounded-lg text-sm font-bold tracking-wide transition-colors"
            >
              JOIN NOW
            </Link>
          </div>
        </div>
      </nav>

      {/* Page content */}
      {children}

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-amber-900/25 bg-stone-950 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2.5 mb-4 justify-center md:justify-start">
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-amber-600 to-yellow-700 flex items-center justify-center shadow-md">
                  <Drama className="w-5 h-5 text-stone-900" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-serif font-bold tracking-wide text-amber-100">AMD CLUB</h3>
              </div>
              <p className="text-amber-100 text-sm leading-relaxed font-light">
                Academic City Arts, Media &amp; Drama Club —<br />Where creativity meets excellence.
              </p>
            </div>

            <div className="text-center">
              <h4 className="text-amber-100 font-semibold mb-5 tracking-widest text-xs uppercase">Quick Links</h4>
              <div className="space-y-2.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block text-amber-100 hover:text-yellow-400 text-sm transition-colors duration-200 hover:translate-x-1 transform"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="text-center md:text-right">
              <h4 className="text-amber-100 font-semibold mb-5 tracking-widest text-xs uppercase">Connect</h4>
              <div className="flex gap-3 justify-center md:justify-end">
                {[
                  { label: 'Instagram', Icon: Sparkles },
                  { label: 'Email', Icon: Mail },
                  { label: 'Events', Icon: Drama },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    className="w-11 h-11 rounded-xl bg-amber-900/25 flex items-center justify-center hover:bg-yellow-600 transition-all duration-300 border border-amber-900/30 hover:border-yellow-600 shadow-md hover:shadow-yellow-600/25 hover:-translate-y-1"
                  >
                    <s.Icon className="w-5 h-5 text-amber-100 group-hover:text-stone-900" strokeWidth={2} />
                  </a>
                ))}
              </div>
              <p className="text-amber-100 text-xs mt-6">
                &copy; 2026 AMD Club. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
