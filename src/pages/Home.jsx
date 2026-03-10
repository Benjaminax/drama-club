import { useState, useEffect, useRef } from 'react'
import { Drama, Film, Sparkles, Palette, Mail, Smartphone, Users, Trophy } from 'lucide-react'
import '../App.css'
import MemberCard from '../components/MemberCard'

/* ── Scroll-reveal hook ───────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* ── Curtain-reveal hook ─────────────────────────────────── */
function useCurtainReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.curtain-wrap')
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('curtain-open')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* ── Animated counter hook ───────────────────────────────── */
function useCounterAnimation() {
  useEffect(() => {
    const counters = document.querySelectorAll('[data-count]')
    if (!counters.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target
          const target = parseInt(el.dataset.count, 10)
          const duration = 1800
          const step = 16
          const increment = target / (duration / step)
          let current = 0
          const timer = setInterval(() => {
            current = Math.min(current + increment, target)
            el.textContent = Math.floor(current)
            if (current >= target) clearInterval(timer)
          }, step)
          io.unobserve(el)
        })
      },
      { threshold: 0.6 }
    )
    counters.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* ── Active nav section hook ────────────────────────────── */
function useActiveNav(setActive) {
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    if (!sections.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { threshold: 0.35 }
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [setActive])
}

/* ── Main Component ──────────────────────────────────────── */
function Home() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showBackTop, setShowBackTop] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isScrolled, setIsScrolled] = useState(false)
  const [content, setContent] = useState(null)
  const [loadingError, setLoadingError] = useState(false)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || '/api'}/content`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setContent(res.data)
        } else {
          setLoadingError(true)
        }
      })
      .catch(err => {
        console.error('Error fetching content:', err)
        setLoadingError(true)
      })
  }, [])

  /* activate all animation hooks */
  useScrollReveal()
  useCurtainReveal()
  useCounterAnimation()
  useActiveNav(setActiveSection)

  const iconMap = {
    '🎬': Film,
    '👥': Users,
    '🏆': Trophy,
    'Film': Film,
    'Users': Users,
    'Trophy': Trophy
  }

  /* scroll listeners for back-to-top and navbar background */
  useEffect(() => {
    const onScroll = () => {
      setShowBackTop(window.scrollY > 320)
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    // Initial check
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* close mobile menu on resize */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: '', message: '' })
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (data.success) {
        setSubmitStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully.' })
        setFormData({ name: '', email: '', phone: '', message: '' })
      } else {
        setSubmitStatus({ type: 'error', message: data.message || 'Something went wrong. Please try again.' })
      }
    } catch {
      setSubmitStatus({ type: 'error', message: 'Unable to send message. Please ensure the server is running.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const navLinks = ['home', 'about', 'tertulia', 'projects', 'gallery', 'team', 'contact']

  if (!content) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center text-amber-100 font-serif">
        <div className="w-12 h-12 border-4 border-amber-900/30 border-t-yellow-600 rounded-full animate-spin mb-4" />
        <p className="tracking-widest uppercase text-xs font-bold text-yellow-600">
          {loadingError ? 'Failed to load content. Please check your connection.' : 'Loading Stage...'}
        </p>
        {loadingError && (
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-yellow-600 text-stone-900 rounded-lg text-sm font-bold hover:bg-yellow-500 transition"
          >
            Retry
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-stone-900 via-amber-950 to-stone-900 relative overflow-hidden">

      {/* ── Bokeh ambient particles ── */}
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

      {/* ── Navigation ── */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
        ? 'bg-stone-950/95 backdrop-blur-lg border-b border-amber-900/25 shadow-xl shadow-black/30 py-0'
        : 'bg-transparent border-b border-transparent py-2'
        }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <a href="#home" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-linear-to-br from-amber-600 to-yellow-700 flex items-center justify-center shadow-lg shadow-amber-900/30 group-hover:shadow-amber-600/40 transition-shadow">
                <Drama className="w-6 h-6 text-stone-900" strokeWidth={2} />
              </div>
              <span className="text-xl font-serif font-bold tracking-wide text-amber-100">AMD CLUB</span>
            </a>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link}`}
                  className={`text-sm font-medium tracking-widest uppercase relative group transition-colors duration-200 ${activeSection === link ? 'nav-link-active text-amber-100' : 'text-amber-100 hover:text-yellow-400'
                    }`}
                >
                  {link.charAt(0).toUpperCase() + link.slice(1)}
                  <span className={`absolute -bottom-0.5 left-0 h-0.5 bg-yellow-600 transition-all duration-300 ${activeSection === link ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                </a>
              ))}
              <a
                href="#contact"
                className="bg-yellow-600 hover:bg-yellow-500 text-stone-900 px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all duration-200 btn-ripple hover:shadow-lg hover:shadow-yellow-600/30 hover:-translate-y-0.5"
              >
                JOIN NOW
              </a>
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
              <a
                key={link}
                href={`#${link}`}
                onClick={() => setMenuOpen(false)}
                className={`block py-3 px-4 rounded-lg text-sm font-medium tracking-widest uppercase transition-colors ${activeSection === link
                  ? 'bg-amber-900/30 text-amber-100 border border-amber-700/30'
                  : 'text-amber-100 hover:text-yellow-400 hover:bg-stone-800/60'
                  }`}
              >
                {link.charAt(0).toUpperCase() + link.slice(1)}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="block mt-4 text-center bg-yellow-600 hover:bg-yellow-500 text-stone-900 py-3 px-4 rounded-lg text-sm font-bold tracking-wide transition-colors"
            >
              JOIN NOW
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section id="home" className="min-h-screen flex items-center justify-center px-6 pt-28 pb-20 relative overflow-hidden">

        {/* Hero background image — dramatic theatre stage */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507924538820-ede94a04019d?auto=format&fit=crop&w=1920&q=80')" }}
        />
        {/* Overlay — keep text readable */}
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-stone-950/85 to-stone-900/90" />
        {/* Grid texture on top */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTEsMTkxLDM2LDAuMDQpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

        {/* Stage lights */}
        <div className="stage-light stage-light-left" />
        <div className="stage-light stage-light-right" />

        <div className="max-w-6xl mx-auto text-center relative z-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 mb-8 px-5 py-2.5 bg-amber-900/20 backdrop-blur-md border border-amber-600/25 rounded-full fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <p className="text-yellow-600 text-xs tracking-[0.28em] font-bold uppercase">Academic City University</p>
          </div>

          {/* Heading — dynamic text */}
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif font-light mb-8 tracking-tight text-amber-100 leading-[1.1] overflow-hidden">
            {(() => {
              const text = content.heroText || ''
              const parts = text.split('&')
              if (parts.length > 1) {
                return (
                  <>
                    <span className="hero-word">{parts[0].trim()}&nbsp;</span>
                    <br />
                    <span className="hero-word text-yellow-400">
                      &amp; {parts.slice(1).join('&').trim()}
                    </span>
                  </>
                )
              }
              return <span className="hero-word">{text}</span>
            })()}
          </h1>

          <div className="w-20 h-px bg-yellow-600 mx-auto mb-8 fade-in-up" style={{ animationDelay: '0.55s' }} />

          <p className="text-lg md:text-xl text-amber-100 mb-14 font-light max-w-2xl mx-auto leading-relaxed fade-in-up" style={{ animationDelay: '0.65s' }}>
            {content.heroDescription}
          </p>

          <div className="flex gap-5 justify-center flex-wrap mb-16 fade-in-up" style={{ animationDelay: '0.78s' }}>
            <a
              href="#about"
              className="bg-yellow-600 hover:bg-yellow-500 text-stone-900 px-10 py-3.5 rounded-lg text-sm font-bold tracking-widest transition-all duration-300 btn-ripple hover:shadow-xl hover:shadow-yellow-600/35 hover:-translate-y-0.5 uppercase"
            >
              Discover More
            </a>
            <a
              href="#projects"
              className="bg-transparent border-2 border-amber-100/20 hover:border-yellow-600/50 text-amber-100 px-10 py-3.5 rounded-lg text-sm font-bold tracking-widest transition-all duration-300 hover:bg-stone-900/50 backdrop-blur-sm hover:-translate-y-0.5 uppercase"
            >
              View Projects
            </a>
          </div>

          {/* Category tags */}
          <div className="flex gap-4 justify-center flex-wrap fade-in-up" style={{ animationDelay: '0.9s' }}>
            {[
              { Icon: Drama, label: 'Theatre' },
              { Icon: Film, label: 'Film' },
              { Icon: Sparkles, label: 'Music' },
              { Icon: Palette, label: 'Visual Arts' },
            ].map((cat, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-5 py-3 bg-stone-900/40 backdrop-blur-md border border-amber-900/30 rounded-xl hover:border-amber-600/50 hover:bg-stone-900/60 transition-all duration-300 cursor-default card-hover"
              >
                <cat.Icon className="w-5 h-5 text-yellow-500" strokeWidth={2} />
                <span className="text-xs text-amber-100 tracking-widest font-medium uppercase">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Section ── */}
      <section id="about" className="py-32 px-6 relative" style={{ backgroundColor: '#0c0a09' }}>
        {/* Subtle textured background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-8"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1920&q=80')", opacity: 0.06 }}
        />
        <div className="absolute inset-0 bg-stone-950/80" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p data-reveal="up" className="text-yellow-600 text-xs tracking-[0.3em] mb-4 font-semibold uppercase">Who We Are</p>
            <h2 data-reveal="up" className="text-4xl md:text-5xl font-serif font-light text-amber-100 mb-6 tracking-tight">
              <span className="curtain-wrap">About AMD Club</span>
            </h2>
            <div data-reveal="up" className="w-20 h-px bg-yellow-600 mx-auto" />
          </div>

          <div data-reveal="up" className="bg-stone-900/40 backdrop-blur-md rounded-2xl p-10 shadow-2xl border border-amber-900/20">
            <p className="text-amber-100 text-lg leading-relaxed mb-5 font-light text-center max-w-4xl mx-auto">
              {content.aboutDescription1}
            </p>
            <p className="text-amber-100 text-lg leading-relaxed mb-10 font-light text-center max-w-4xl mx-auto">
              {content.aboutDescription2}
            </p>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              {(content.stats || []).map((stat, i) => {
                const IconComponent = iconMap[stat.icon] || Film
                return (
                <div
                  key={i}
                  data-reveal="scale"
                  className="text-center p-10 bg-stone-900/50 backdrop-blur-sm rounded-xl border border-amber-900/30 hover:border-amber-600/50 transition-all card-hover"
                >
                  <div className="mb-4 flex justify-center">
                    <IconComponent className="w-12 h-12 text-yellow-600" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-5xl font-bold mb-2 text-amber-100">
                    <span className="stat-number" data-count={stat.count}>0</span>
                    <span className="text-yellow-600">{stat.suffix}</span>
                  </h3>
                  <p className="text-amber-100 text-xs tracking-widest font-semibold uppercase">{stat.label}</p>
                </div>
              )})}
            </div>
          </div>
        </div>
      </section>

      {/* ── Tertulia Section ── */}
      <section id="tertulia" className="py-32 px-6 relative overflow-hidden">
        {/* Backstage / curtain atmosphere image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-linear-to-br from-amber-900/20 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p data-reveal="up" className="text-yellow-600 text-xs tracking-[0.3em] mb-4 font-semibold uppercase">Weekly Meetings</p>
          <h2 data-reveal="up" className="text-4xl md:text-5xl font-serif font-light text-amber-100 mb-6 tracking-tight">
            <span className="curtain-wrap">Tertulia Sessions</span>
          </h2>
          <div data-reveal="up" className="w-20 h-px bg-yellow-600 mx-auto mb-8" />
          <p data-reveal="up" className="text-amber-100 text-xl leading-relaxed mb-8 font-light italic max-w-3xl mx-auto">
            {content.tertuliaDescription}
          </p>
          <div data-reveal="up" className="bg-stone-900/60 backdrop-blur-md rounded-2xl p-12 border border-amber-900/20 shadow-2xl">
            <p className="text-amber-100 text-lg leading-relaxed font-light mb-8">
              Tertulia is where conversations about theatre, media, and visual arts come alive.
              Join us for discussions, workshops, and collaborative sessions that fuel creativity and innovation.
            </p>
            <button className="bg-yellow-600 hover:bg-yellow-500 text-stone-900 px-10 py-3.5 rounded-full font-bold transition-all duration-300 shadow-lg shadow-black/30 text-sm tracking-widest uppercase btn-ripple glow hover:-translate-y-0.5 hover:shadow-yellow-600/30">
              Learn More About Tertulia
            </button>
          </div>
        </div>
      </section>

      {/* ── Projects Section ── */}
      <section id="projects" className="py-28 px-6 relative" style={{ backgroundColor: '#0c0a09' }}>
        {/* Subtle performance image background */}
        <div
          className="absolute inset-0 bg-cover bg-bottom"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1920&q=80')", opacity: 0.06 }}
        />
        <div className="absolute inset-0 bg-stone-950/88" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p data-reveal="up" className="text-yellow-600 text-xs tracking-[0.3em] mb-4 font-semibold uppercase">Our Work</p>
            <h2 data-reveal="up" className="text-4xl md:text-5xl font-serif font-light text-amber-100 mb-6 tracking-tight">
              <span className="curtain-wrap">Productions</span>
            </h2>
            <div data-reveal="up" className="h-px w-24 bg-linear-to-r from-transparent via-yellow-600 to-transparent mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {(content.productions || []).map((p, i) => (
              <div
                key={i}
                data-reveal="up"
                className="bg-stone-900/60 flex flex-col backdrop-blur-md rounded-2xl hover:bg-stone-900/80 transition-all card-hover border border-amber-900/20 shadow-xl group overflow-hidden relative h-full"
              >
                {p.image && (
                  <div className="w-full h-48 bg-stone-950 relative overflow-hidden shrink-0">
                    {p.image.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video src={p.image} autoPlay loop muted playsInline className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-stone-900 to-transparent opacity-80" />
                  </div>
                )}
                <div className="p-7 flex-1 flex flex-col relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2.5 py-0.5 bg-yellow-600/20 border border-yellow-600/30 text-yellow-500 text-xs font-bold tracking-widest rounded-md uppercase">{p.genre || p.type}</span>
                    <span className="text-amber-100 text-xs font-medium">{p.year}</span>
                  </div>
                  <h3 className="text-xl font-serif text-amber-100 mb-3 group-hover:text-yellow-400 transition-all duration-300">
                    {p.title}
                  </h3>
                  <p className="text-amber-100 text-sm font-light leading-relaxed">{p.description}</p>
                  <div className="mt-auto pt-5 h-px w-0 group-hover:w-full bg-linear-to-r from-yellow-600 to-transparent transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery Section ── */}
      <section id="gallery" className="py-28 px-6 relative overflow-hidden">
        {/* Section-wide background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-stone-950/88" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p data-reveal="up" className="text-yellow-600 text-xs tracking-[0.3em] mb-4 font-semibold uppercase">Captured Moments</p>
            <h2 data-reveal="up" className="text-4xl md:text-5xl font-serif font-light text-amber-100 mb-6 tracking-tight">
              <span className="curtain-wrap">Gallery</span>
            </h2>
            <div data-reveal="up" className="h-px w-24 bg-linear-to-r from-transparent via-yellow-600 to-transparent mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {(content.gallery || []).map((item, idx) => (
              <div
                key={idx}
                data-reveal="scale"
                className="aspect-video rounded-2xl card-hover border border-amber-900/20 shadow-xl group overflow-hidden relative"
              >
                {item.url && item.url.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video src={item.url} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <img
                    src={item.url}
                    alt={item.label}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-amber-800/0 group-hover:bg-amber-800/20 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-amber-100 text-xs tracking-widest font-semibold uppercase transition-colors">{item.label}</p>
                </div>
                <div className="absolute inset-0 border border-transparent group-hover:border-amber-600/40 rounded-2xl transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leadership Section ── */}
      <section id="team" className="py-28 px-6 bg-stone-950/50 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p data-reveal="up" className="text-yellow-600 text-xs tracking-[0.3em] mb-4 font-semibold uppercase">Meet The Team</p>
            <h2 data-reveal="up" className="text-4xl md:text-5xl font-serif font-light text-amber-100 mb-6 tracking-tight">
              <span className="curtain-wrap">Our Leadership</span>
            </h2>
            <div data-reveal="up" className="h-px w-24 bg-linear-to-r from-transparent via-yellow-600 to-transparent mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">
            {(content.team || []).map((m, i) => (
              <div key={i} data-reveal="up">
                <MemberCard member={m} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Section ── */}
      <section id="contact" className="py-28 px-6 bg-black/40 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <p data-reveal="up" className="text-yellow-600 text-xs tracking-[0.3em] mb-4 font-semibold uppercase">Get In Touch</p>
            <h2 data-reveal="up" className="text-4xl md:text-5xl font-serif font-light text-amber-100 mb-6 tracking-tight">
              <span className="curtain-wrap">Contact Us</span>
            </h2>
            <div data-reveal="up" className="h-px w-24 bg-linear-to-r from-transparent via-yellow-600 to-transparent mx-auto" />
          </div>

          <div data-reveal="up" className="bg-stone-900/60 backdrop-blur-md rounded-2xl p-10 shadow-2xl border border-amber-900/20">
            <p className="text-amber-100 text-center mb-8 font-light text-lg">
              Interested in joining our club or have questions? Send us a message!
            </p>

            {submitStatus.message && (
              <div className={`mb-6 p-4 rounded-xl animate-fadeIn ${submitStatus.type === 'success'
                ? 'bg-green-500/15 border border-green-500/40 text-green-300'
                : 'bg-red-500/15 border border-red-500/40 text-red-300'
                }`}>
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { label: 'Name', name: 'name', type: 'text', required: true, placeholder: 'Your full name' },
                { label: 'Email', name: 'email', type: 'email', required: true, placeholder: 'your.email@example.com' },
                { label: 'Phone', name: 'phone', type: 'tel', required: false, placeholder: 'Optional' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-amber-100 mb-2 text-xs tracking-widest uppercase font-semibold">
                    {field.label}{field.required && <span className="text-yellow-600 ml-1">*</span>}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full px-4 py-3.5 rounded-xl bg-stone-800/60 border border-amber-900/30 text-amber-100 placeholder-amber-100/25 focus:outline-none focus:border-yellow-600/70 focus:ring-2 focus:ring-yellow-600/20 transition-all duration-200 text-sm"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
              <div>
                <label className="block text-amber-100 mb-2 text-xs tracking-widest uppercase font-semibold">
                  Message<span className="text-yellow-600 ml-1">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3.5 rounded-xl bg-stone-800/60 border border-amber-900/30 text-amber-100 placeholder-amber-100/25 focus:outline-none focus:border-yellow-600/70 focus:ring-2 focus:ring-yellow-600/20 resize-none transition-all duration-200 text-sm"
                  placeholder="Tell us about yourself or your inquiry…"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-600 hover:bg-yellow-500 text-stone-900 px-8 py-4 rounded-xl font-bold tracking-widest text-sm uppercase transition-all duration-300 btn-ripple hover:shadow-xl hover:shadow-yellow-600/35 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {isSubmitting ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
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
                {['Home', 'About', 'Tertulia', 'Projects', 'Gallery', 'Team', 'Contact'].map((link) => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    className="block text-amber-100 hover:text-yellow-400 text-sm transition-colors duration-200 hover:translate-x-1 transform"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            <div className="text-center md:text-right">
              <h4 className="text-amber-100 font-semibold mb-5 tracking-widest text-xs uppercase">Connect</h4>
              <div className="flex gap-3 justify-center md:justify-end">
                {[
                  { label: 'Instagram', Icon: Smartphone },
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

      {/* ── Back to Top ── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`back-to-top ${showBackTop ? 'visible' : ''}`}
        aria-label="Back to top"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>

    </div>
  )
}

export default Home
