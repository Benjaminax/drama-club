import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'

function ProjectDetailPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/content`)
        const data = await res.json()
        
        if (data.success && data.data) {
          setContent(data.data)
          // Find the project by index (projectId)
          const foundProject = data.data.productions?.[parseInt(projectId)]
          
          if (foundProject) {
            setProject(foundProject)
          } else {
            // Project not found, redirect to projects page
            navigate('/projects')
          }
        }
      } catch (err) {
        console.error('Error fetching project:', err)
        navigate('/projects')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId, navigate])

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-stone-950">
          <div className="w-12 h-12 border-4 border-amber-900/30 border-t-yellow-600 rounded-full animate-spin" />
        </div>
      </Layout>
    )
  }

  if (!project) {
    return null // Will redirect in useEffect
  }

  return (
    <Layout>
      <div className="min-h-screen bg-stone-950">
        {/* Hero Section with Cover Image/Video */}
        {project.image && (
          <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
            {project.image.match(/\.(mp4|webm|ogg)$/i) ? (
              <video 
                src={project.image} 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-stone-950/60 to-transparent" />
            
            {/* Back Button */}
            <Link 
              to="/projects"
              className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-stone-900/80 backdrop-blur-sm hover:bg-stone-800 text-amber-100 rounded-lg transition-all border border-amber-900/30 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Projects</span>
            </Link>

            {/* Project Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-yellow-600/20 border border-yellow-600/30 text-yellow-500 text-xs font-bold tracking-widest rounded-md uppercase flex items-center gap-2">
                    <Tag className="w-3 h-3" />
                    {project.genre || project.type}
                  </span>
                  <span className="text-amber-100 text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {project.year}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-serif font-light text-amber-100 mb-4 tracking-tight">
                  {project.title}
                </h1>
                <p className="text-lg md:text-xl text-amber-100/90 font-light max-w-3xl leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        <section className="py-16 px-6 md:px-8 relative">
          <div className="absolute inset-0 bg-linear-to-b from-stone-950 to-stone-900" />
          <div className="max-w-4xl mx-auto relative z-10">
            {/* If no cover image, show title here */}
            {!project.image && (
              <div className="mb-12">
                <Link 
                  to="/projects"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900/80 hover:bg-stone-800 text-amber-100 rounded-lg transition-all border border-amber-900/30 group mb-8"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm font-medium">Back to Projects</span>
                </Link>
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-yellow-600/20 border border-yellow-600/30 text-yellow-500 text-xs font-bold tracking-widest rounded-md uppercase">
                    {project.genre || project.type}
                  </span>
                  <span className="text-amber-100 text-sm font-medium">{project.year}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-light text-amber-100 mb-6 tracking-tight">
                  {project.title}
                </h1>
                <p className="text-xl text-amber-100/90 font-light leading-relaxed">
                  {project.description}
                </p>
              </div>
            )}

            {/* Rich Content Blocks */}
            {project.content && project.content.length > 0 ? (
              <div className="space-y-8">
                {project.content.map((block, idx) => (
                  <div key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                    {block.type === 'text' && block.content && (
                      <div className="prose prose-invert prose-amber max-w-none">
                        <p className="text-amber-100 text-lg leading-relaxed font-light whitespace-pre-wrap">
                          {block.content}
                        </p>
                      </div>
                    )}
                    
                    {block.type === 'image' && block.url && (
                      <div className="my-8">
                        <img 
                          src={block.url} 
                          alt={block.caption || `${project.title} - image ${idx + 1}`} 
                          className="w-full rounded-xl shadow-2xl border border-amber-900/30"
                        />
                        {block.caption && (
                          <p className="text-amber-100/60 text-sm text-center mt-4 italic font-light">
                            {block.caption}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {block.type === 'video' && block.url && (
                      <div className="my-8">
                        <video 
                          src={block.url} 
                          controls 
                          className="w-full rounded-xl shadow-2xl border border-amber-900/30 bg-black"
                        />
                        {block.caption && (
                          <p className="text-amber-100/60 text-sm text-center mt-4 italic font-light">
                            {block.caption}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-amber-100/60 text-lg italic">
                  More content coming soon...
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Related Projects Section */}
        {content && content.productions && content.productions.length > 1 && (
          <section className="py-16 px-6 md:px-8 bg-stone-900/50 border-t border-amber-900/20">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-serif font-light text-amber-100 mb-8 text-center">
                Other Productions
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {content.productions
                  .map((p, idx) => ({ ...p, idx }))
                  .filter((p) => p.idx !== parseInt(projectId))
                  .slice(0, 3)
                  .map((p) => (
                    <Link
                      key={p.idx}
                      to={`/projects/${p.idx}`}
                      className="group bg-stone-900/60 rounded-xl overflow-hidden hover:bg-stone-900/80 transition-all border border-amber-900/20 hover:border-amber-900/40"
                    >
                      {p.image && (
                        <div className="w-full h-40 bg-stone-950 relative overflow-hidden">
                          {p.image.match(/\.(mp4|webm|ogg)$/i) ? (
                            <video 
                              src={p.image} 
                              autoPlay 
                              loop 
                              muted 
                              playsInline 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <img 
                              src={p.image} 
                              alt={p.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          )}
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-yellow-500 text-xs font-bold">{p.genre || p.type}</span>
                          <span className="text-amber-100/60 text-xs">• {p.year}</span>
                        </div>
                        <h3 className="text-lg font-serif text-amber-100 group-hover:text-yellow-400 transition-colors">
                          {p.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  )
}

export default ProjectDetailPage
