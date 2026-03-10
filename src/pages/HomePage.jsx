import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Drama, Film, Palette, Sparkles } from 'lucide-react'
import Layout from '../components/Layout'
import '../App.css'

function HomePage() {
  const [content, setContent] = useState(null)
  const [loadingError, setLoadingError] = useState(false)

  useEffect(() => {
    fetch('http://localhost:5000/api/content')
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

  if (!content) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center text-amber-100 font-serif">
        <div className="w-12 h-12 border-4 border-amber-900/30 border-t-yellow-600 rounded-full animate-spin mb-4" />
        <p className="tracking-widest uppercase text-xs font-bold text-yellow-600">
          {loadingError ? 'Failed to load content. Check if server is running on http://localhost:5000' : 'Loading Stage...'}
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
    <Layout>
      <section className="min-h-screen flex items-center justify-center px-6 pt-28 pb-20 relative overflow-hidden">
        {/* Hero background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507924538820-ede94a04019d?auto=format&fit=crop&w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-stone-950/85 to-stone-900/90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTEsMTkxLDM2LDAuMDQpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

        <div className="stage-light stage-light-left" />
        <div className="stage-light stage-light-right" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2.5 mb-8 px-5 py-2.5 bg-amber-900/20 backdrop-blur-md border border-amber-600/25 rounded-full fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <p className="text-yellow-600 text-xs tracking-[0.28em] font-bold uppercase">Academic City University</p>
          </div>

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
            <Link
              to="/about"
              className="bg-yellow-600 hover:bg-yellow-500 text-stone-900 px-10 py-3.5 rounded-lg text-sm font-bold tracking-widest transition-all duration-300 btn-ripple hover:shadow-xl hover:shadow-yellow-600/35 hover:-translate-y-0.5 uppercase"
            >
              Discover More
            </Link>
            <Link
              to="/projects"
              className="bg-transparent border-2 border-amber-100/20 hover:border-yellow-600/50 text-amber-100 px-10 py-3.5 rounded-lg text-sm font-bold tracking-widest transition-all duration-300 hover:bg-stone-900/50 backdrop-blur-sm hover:-translate-y-0.5 uppercase"
            >
              View Projects
            </Link>
          </div>

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
    </Layout>
  )
}

export default HomePage
