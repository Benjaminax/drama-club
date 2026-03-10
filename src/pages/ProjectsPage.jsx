import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import '../App.css'

function ProjectsPage() {
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
      <section className="py-28 px-6 relative min-h-screen" style={{ backgroundColor: '#0c0a09' }}>
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
    </Layout>
  )
}

export default ProjectsPage
