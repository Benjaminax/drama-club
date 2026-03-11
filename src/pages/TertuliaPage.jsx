import { useState, useEffect } from 'react'
import { Play, Image as ImageIcon } from 'lucide-react'
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
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p data-reveal="up" className="text-yellow-600 text-xs tracking-[0.3em] mb-4 font-semibold uppercase">Weekly Meetings</p>
            <h2 data-reveal="up" className="text-4xl md:text-5xl font-serif font-light text-amber-100 mb-6 tracking-tight">
              <span className="curtain-wrap">{content.pageTitle_tertulia || 'Tertulia Sessions'}</span>
            </h2>
            <div data-reveal="up" className="w-20 h-px bg-yellow-600 mx-auto mb-8" />
            <p data-reveal="up" className="text-amber-100 text-xl leading-relaxed mb-8 font-light italic max-w-3xl mx-auto">
              {content.tertuliaDescription}
            </p>
          </div>
          
          <div data-reveal="up" className="bg-stone-900/60 backdrop-blur-md rounded-2xl p-12 border border-amber-900/20 shadow-2xl mb-16 max-w-4xl mx-auto">
            <p className="text-amber-100 text-lg leading-relaxed font-light mb-8 text-center">
              Tertulia is where conversations about theatre, media, and visual arts come alive.
              Join us for discussions, workshops, and collaborative sessions that fuel creativity and innovation.
            </p>
            <div className="text-center">
              <button className="bg-yellow-600 hover:bg-yellow-500 text-stone-900 px-10 py-3.5 rounded-full font-bold transition-all duration-300 shadow-lg shadow-black/30 text-sm tracking-widest uppercase btn-ripple glow hover:-translate-y-0.5 hover:shadow-yellow-600/30">
                Learn More About Tertulia
              </button>
            </div>
          </div>

          {/* Media Gallery */}
          {content.tertuliaMedia && content.tertuliaMedia.length > 0 && (
            <div data-reveal="up" className="mt-16">
              <h3 className="text-2xl md:text-3xl font-serif font-light text-amber-100 mb-8 text-center">
                <span className="curtain-wrap">Tertulia Moments</span>
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.tertuliaMedia.map((item, idx) => {
                  const isVideo = item.url && item.url.match(/\.(mp4|webm|ogg)$/i)
                  return (
                    <div
                      key={idx}
                      data-reveal="scale"
                      className="aspect-video rounded-2xl card-hover border border-amber-900/20 shadow-xl group overflow-hidden relative transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-600/20"
                    >
                      {isVideo ? (
                        <video src={item.url} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.label}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
                      <div className="absolute inset-0 bg-yellow-600/0 group-hover:bg-yellow-600/10 transition-all duration-500" />
                      
                      {/* Media type indicator */}
                      <div className="absolute top-4 right-4 bg-stone-900/80 backdrop-blur-sm p-2.5 rounded-full border border-amber-600/30 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        {isVideo ? (
                          <Play className="w-5 h-5 text-yellow-500" fill="currentColor" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>

                      {/* Label */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-amber-100 text-sm tracking-widest font-semibold uppercase transition-colors">{item.label}</p>
                      </div>
                      
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-600/50 rounded-2xl transition-all duration-300" />
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}

export default TertuliaPage
