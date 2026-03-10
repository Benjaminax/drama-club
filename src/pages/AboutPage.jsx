import { useState, useEffect } from 'react'
import { Film, Users, Trophy } from 'lucide-react'
import Layout from '../components/Layout'
import '../App.css'

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

const iconMap = {
  '🎬': Film,
  '👥': Users,
  '🏆': Trophy,
  'Film': Film,
  'Users': Users,
  'Trophy': Trophy
}

function AboutPage() {
  const [content, setContent] = useState(null)

  useCounterAnimation()

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || '/api'}/content`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setContent(res.data)
        }
      })
      .catch(err => console.error('Error fetching content:', err))
  }, [])

  if (!content) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-amber-900/30 border-t-yellow-600 rounded-full animate-spin" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="py-32 px-6 relative min-h-screen" style={{ backgroundColor: '#0c0a09' }}>
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
    </Layout>
  )
}

export default AboutPage
