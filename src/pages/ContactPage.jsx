import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import '../App.css'

function ContactPage() {
  const [content, setContent] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  return (
    <Layout>
      <section className="py-28 px-6 bg-black/40 relative overflow-hidden min-h-screen">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <p data-reveal="up" className="text-yellow-600 text-xs tracking-[0.3em] mb-4 font-semibold uppercase">Get In Touch</p>
            <h2 data-reveal="up" className="text-4xl md:text-5xl font-serif font-light text-amber-100 mb-6 tracking-tight">
              <span className="curtain-wrap">{content?.pageTitle_contact || 'Contact Us'}</span>
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
    </Layout>
  )
}

export default ContactPage
