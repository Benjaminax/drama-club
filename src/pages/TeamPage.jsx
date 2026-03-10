import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import MemberCard from '../components/MemberCard'
import '../App.css'

function TeamPage() {
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
      <section className="py-28 px-6 bg-stone-950/50 relative min-h-screen">
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
    </Layout>
  )
}

export default TeamPage
