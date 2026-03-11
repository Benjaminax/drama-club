import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import '../App.css'

function ProjectsPage() {
  const [content, setContent] = useState(null)
  const [selectedProduction, setSelectedProduction] = useState(null)

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
              <span className="curtain-wrap">{content.pageTitle_projects || 'Productions'}</span>
            </h2>
            <div data-reveal="up" className="h-px w-24 bg-linear-to-r from-transparent via-yellow-600 to-transparent mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {(content.productions || []).map((p, i) => {
              const hasContent = p.content && p.content.length > 0
              return (
                <div
                  key={i}
                  data-reveal="up"
                  onClick={() => hasContent && setSelectedProduction(p)}
                  className={`bg-stone-900/60 flex flex-col backdrop-blur-md rounded-2xl hover:bg-stone-900/80 transition-all card-hover border border-amber-900/20 shadow-xl group overflow-hidden relative h-full ${hasContent ? 'cursor-pointer' : ''}`}
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
                    {hasContent && (
                      <p className="text-yellow-500 text-xs mt-4 font-medium">Click to read full article →</p>
                    )}
                    <div className="mt-auto pt-5 h-px w-0 group-hover:w-full bg-linear-to-r from-yellow-600 to-transparent transition-all duration-500" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Production Article Modal */}
      {selectedProduction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProduction(null)}>
          <div className="bg-stone-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-amber-900/30 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-stone-900 border-b border-amber-900/20 p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-3xl font-serif text-amber-100 mb-2">{selectedProduction.title}</h2>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-yellow-600/20 border border-yellow-600/30 text-yellow-500 text-xs font-bold tracking-widest rounded-md uppercase">
                    {selectedProduction.genre || selectedProduction.type}
                  </span>
                  <span className="text-amber-100 text-sm font-medium">{selectedProduction.year}</span>
                </div>
              </div>
              <button onClick={() => setSelectedProduction(null)} className="text-amber-100 hover:text-yellow-500 text-3xl font-light transition-colors">×</button>
            </div>
            {selectedProduction.image && (
              <div className="w-full h-64 md:h-96 bg-stone-950 relative overflow-hidden">
                {selectedProduction.image.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video src={selectedProduction.image} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                ) : (
                  <img src={selectedProduction.image} alt={selectedProduction.title} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-stone-900 to-transparent opacity-60" />
              </div>
            )}
            <div className="p-8 space-y-6">
              <p className="text-amber-100 text-lg leading-relaxed font-light">{selectedProduction.description}</p>
              {selectedProduction.content && selectedProduction.content.map((block, idx) => (
                <div key={idx}>
                  {block.type === 'text' ? (
                    <p className="text-amber-100 text-base leading-relaxed font-light">
                      {block.content}
                    </p>
                  ) : block.type === 'image' && block.url ? (
                    <div className="my-6">
                      <img 
                        src={block.url} 
                        alt={block.caption || 'Production content'} 
                        className="w-full rounded-xl shadow-2xl border border-amber-900/30"
                      />
                      {block.caption && (
                        <p className="text-amber-100/60 text-sm text-center mt-3 italic">{block.caption}</p>
                      )}
                    </div>
                  ) : block.type === 'video' && block.url ? (
                    <div className="my-6">
                      <video 
                        src={block.url} 
                        controls 
                        className="w-full rounded-xl shadow-2xl border border-amber-900/30 bg-black"
                      />
                      {block.caption && (
                        <p className="text-amber-100/60 text-sm text-center mt-3 italic">{block.caption}</p>
                      )}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default ProjectsPage
