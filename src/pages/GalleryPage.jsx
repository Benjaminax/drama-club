import { useState, useEffect } from 'react'
import { Play, Image as ImageIcon, X } from 'lucide-react'
import Layout from '../components/Layout'
import '../App.css'

function GalleryPage() {
  const [content, setContent] = useState(null)
  const [lightboxItem, setLightboxItem] = useState(null)

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

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxItem) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [lightboxItem])

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
      <section className="py-28 px-6 relative overflow-hidden min-h-screen">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
            {(content.gallery || []).map((item, idx) => {
              const isVideo = item.url && item.url.match(/\.(mp4|webm|ogg)$/i)
              return (
              <div
                key={idx}
                data-reveal="scale"
                onClick={() => setLightboxItem(item)}
                className="aspect-video rounded-2xl card-hover border border-amber-900/20 shadow-xl group overflow-hidden relative cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-600/20"
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
                  <p className="text-amber-100/60 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Click to view {isVideo ? 'video' : 'image'}</p>
                </div>
                
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-600/50 rounded-2xl transition-all duration-300" />
              </div>
            )})}
          </div>

          {/* Lightbox Modal */}
          {lightboxItem && (
            <div 
              className="fixed inset-0 z-9999 bg-black/95 backdrop-blur-md flex items-center justify-center p-6"
              onClick={() => setLightboxItem(null)}
            >
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-6 right-6 bg-stone-900/80 hover:bg-stone-800 p-3 rounded-full border border-amber-600/30 transition-all duration-300 hover:border-yellow-600 group z-10"
              >
                <X className="w-6 h-6 text-amber-100 group-hover:text-yellow-500 transition-colors" />
              </button>
              
              <div className="max-w-6xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
                {lightboxItem.url && lightboxItem.url.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video 
                    src={lightboxItem.url} 
                    controls 
                    autoPlay 
                    className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-amber-600/30"
                  />
                ) : (
                  <img
                    src={lightboxItem.url}
                    alt={lightboxItem.label}
                    className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-amber-600/30"
                  />
                )}
                <div className="mt-4 text-center">
                  <p className="text-amber-100 text-lg tracking-wider font-semibold uppercase">{lightboxItem.label}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}

export default GalleryPage
