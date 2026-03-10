import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import '../App.css'

function TertuliaPage() {
  const [content, setContent] = useState(null)

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
      <section className="py-32 px-6 relative overflow-hidden min-h-screen">
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
    </Layout>
  )
}

export default TertuliaPage
