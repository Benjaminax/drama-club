import { useState, useEffect } from 'react'
import { LayoutDashboard, Save, Loader2, ArrowLeft, Image as ImageIcon, Users, Type, Film, Upload, LogOut, Coffee, BarChart3, X, Plus, Settings as SettingsIcon, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function Admin() {
    const navigate = useNavigate()
    const [content, setContent] = useState(null)
    const [settings, setSettings] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [notification, setNotification] = useState('')
    const [activeTab, setActiveTab] = useState('hero')

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL || '/api'}/content`)
            .then(res => res.json())
            .then(res => {
                if (res.success && res.data) {
                    setContent(res.data)
                }
            })
        
        // Fetch settings
        const token = localStorage.getItem('adminToken')
        fetch(`${import.meta.env.VITE_API_URL || '/api'}/settings`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(res => {
                if (res.success && res.data) {
                    setSettings(res.data)
                }
            })
            .catch(err => console.error('Error fetching settings:', err))
    }, [])

    const handleChange = (e) => {
        setContent({ ...content, [e.target.name]: e.target.value })
    }

    const handleArrayChange = (arrayName, index, field, value) => {
        const newArray = [...content[arrayName]]
        newArray[index] = { ...newArray[index], [field]: value }
        setContent({ ...content, [arrayName]: newArray })
    }

    const addArrayItem = (arrayName, emptyItem) => {
        setContent({ ...content, [arrayName]: [...content[arrayName], emptyItem] })
    }

    const removeArrayItem = (arrayName, index) => {
        const newArray = content[arrayName].filter((_, i) => i !== index)
        setContent({ ...content, [arrayName]: newArray })
    }

    const handleFileUpload = async (e, arrayName, idx, field) => {
        const file = e.target.files[0]
        if (!file) return
        const formData = new FormData()
        formData.append('media', file)

        try {
            const token = localStorage.getItem('adminToken')
            const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            if (res.status === 401) {
                handleLogout()
                return
            }

            const data = await res.json()
            if (data.success) {
                handleArrayChange(arrayName, idx, field, data.url)
                setNotification('Upload successful!')
                setTimeout(() => setNotification(''), 3000)
            } else {
                setNotification('Upload failed: ' + data.message)
                setTimeout(() => setNotification(''), 3000)
            }
        } catch (err) {
            console.error(err)
            setNotification('Error uploading file.')
            setTimeout(() => setNotification(''), 3000)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        navigate('/login')
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const token = localStorage.getItem('adminToken')
            
            // Save settings if on settings tab
            if (activeTab === 'settings') {
                const settingsRes = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/settings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(settings)
                })

                if (settingsRes.status === 401) {
                    handleLogout()
                    return
                }

                const settingsData = await settingsRes.json()
                if (settingsData.success) {
                    setNotification('Settings saved successfully!')
                    setTimeout(() => setNotification(''), 3000)
                }
            } else {
                // Save content for other tabs
                const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/content`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(content)
                })

                if (res.status === 401) {
                    handleLogout()
                    return
                }

                const data = await res.json()
                if (data.success) {
                    setNotification('Changes saved successfully!')
                    setTimeout(() => setNotification(''), 3000)
                }
            }
        } catch (err) {
            console.error(err)
            setNotification('Error saving changes.')
            setTimeout(() => setNotification(''), 3000)
        } finally {
            setIsSaving(false)
        }
    }

    if (!content) {
        return (
            <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-amber-100 font-serif">
                <Loader2 className="w-12 h-12 text-yellow-600 animate-spin mb-4" />
                <p className="tracking-widest uppercase text-xs font-bold text-yellow-600">Loading Dashboard...</p>
            </div>
        )
    }

    const tabs = [
        { id: 'hero', label: 'Hero Section', icon: Type },
        { id: 'about', label: 'About Details', icon: Type },
        { id: 'stats', label: 'Statistics', icon: BarChart3 },
        { id: 'tertulia', label: 'Tertulia Section', icon: Coffee },
        { id: 'productions', label: 'Productions', icon: Film },
        { id: 'gallery', label: 'Gallery', icon: ImageIcon },
        { id: 'team', label: 'Team Members', icon: Users },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
    ]

    return (
        <div className="min-h-screen bg-stone-950 text-amber-50 font-sans flex flex-col lg:flex-row">
            {/* Sidebar */}
            <aside className="w-full lg:w-72 bg-stone-900 border-b lg:border-b-0 lg:border-r border-amber-900/40 p-6 flex flex-col shrink-0">
                <div className="flex flex-col gap-6 h-full">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <LayoutDashboard className="w-6 h-6 text-yellow-600" />
                            <h1 className="text-xl font-serif font-bold tracking-wide text-amber-100">AMD Admin</h1>
                        </div>
                        <p className="text-xs text-amber-100/40 tracking-widest uppercase">Content Management</p>
                    </div>

                    <nav className="flex-1 space-y-1 mt-6">
                        {tabs.map(tab => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium tracking-wide transition-all ${activeTab === tab.id
                                        ? 'bg-amber-900/30 text-yellow-500 border border-amber-700/50'
                                        : 'text-amber-100/60 hover:bg-stone-800 hover:text-amber-100 border border-transparent'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            )
                        })}
                    </nav>

                    <div className="pt-6 border-t border-amber-900/20 space-y-4">
                        <Link to="/" className="flex items-center gap-3 text-sm text-amber-100/50 hover:text-yellow-500 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Website
                        </Link>

                        <button onClick={handleLogout} className="flex items-center gap-3 text-sm text-red-400/70 hover:text-red-400 transition-colors w-full">
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 max-w-5xl w-full p-6 lg:p-10 mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-serif text-amber-100 mb-2">
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h2>
                        <p className="text-amber-100/50 text-sm">Make changes to your live website content.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-stone-900 px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all disabled:opacity-50 btn-ripple shadow-lg shadow-yellow-600/20 hover:shadow-yellow-600/40 hover:-translate-y-0.5"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
                    </button>
                </div>

                {notification && (
                    <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm flex items-center justify-between animate-in fade-in slide-in-from-top-4">
                        {notification}
                        <button onClick={() => setNotification('')} className="text-green-400/50 hover:text-green-400">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Editor Forms */}
                <div className="bg-stone-900/50 border border-amber-900/20 rounded-2xl p-6 lg:p-8 backdrop-blur-sm">

                    {/* HERO TAB */}
                    {activeTab === 'hero' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-semibold tracking-widest text-amber-100 uppercase mb-2">Hero Title</label>
                                <input
                                    type="text" name="heroText" value={content.heroText || ''} onChange={handleChange}
                                    placeholder="Enter hero title..."
                                    className="w-full bg-stone-950/80 border border-amber-900/40 rounded-lg px-4 py-3 text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50 focus:ring-1 focus:ring-yellow-600/50 transition-all font-serif text-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold tracking-widest text-amber-100 uppercase mb-2">Hero subtitle/description</label>
                                <textarea
                                    name="heroDescription" value={content.heroDescription || ''} onChange={handleChange} rows={3}
                                    placeholder="Enter hero description..."
                                    className="w-full bg-stone-950/80 border border-amber-900/40 rounded-lg px-4 py-3 text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50 focus:ring-1 focus:ring-yellow-600/50 transition-all text-sm"
                                />
                            </div>
                            <div className="pt-6 border-t border-amber-900/20">
                                <h3 className="text-sm font-semibold tracking-widest text-amber-100 uppercase mb-4">Page Titles</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold tracking-widest text-amber-100/70 uppercase mb-1">About Page Title</label>
                                        <input type="text" name="pageTitle_about" value={content.pageTitle_about || 'About Us'} onChange={handleChange} placeholder="About Us" className="w-full bg-stone-950/50 border border-amber-900/30 rounded px-3 py-2 text-sm text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold tracking-widest text-amber-100/70 uppercase mb-1">Productions Page Title</label>
                                        <input type="text" name="pageTitle_projects" value={content.pageTitle_projects || 'Productions'} onChange={handleChange} placeholder="Productions" className="w-full bg-stone-950/50 border border-amber-900/30 rounded px-3 py-2 text-sm text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold tracking-widest text-amber-100/70 uppercase mb-1">Team Page Title</label>
                                        <input type="text" name="pageTitle_team" value={content.pageTitle_team || 'Our Team'} onChange={handleChange} placeholder="Our Team" className="w-full bg-stone-950/50 border border-amber-900/30 rounded px-3 py-2 text-sm text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold tracking-widest text-amber-100/70 uppercase mb-1">Gallery Page Title</label>
                                        <input type="text" name="pageTitle_gallery" value={content.pageTitle_gallery || 'Gallery'} onChange={handleChange} placeholder="Gallery" className="w-full bg-stone-950/50 border border-amber-900/30 rounded px-3 py-2 text-sm text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold tracking-widest text-amber-100/70 uppercase mb-1">Contact Page Title</label>
                                        <input type="text" name="pageTitle_contact" value={content.pageTitle_contact || 'Contact Us'} onChange={handleChange} placeholder="Contact Us" className="w-full bg-stone-950/50 border border-amber-900/30 rounded px-3 py-2 text-sm text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ABOUT TAB */}
                    {activeTab === 'about' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-semibold tracking-widest text-amber-100 uppercase mb-2">About Paragraph 1</label>
                                <textarea
                                    name="aboutDescription1" value={content.aboutDescription1 || ''} onChange={handleChange} rows={4}
                                    placeholder="Enter first about paragraph..."
                                    className="w-full bg-stone-950/80 border border-amber-900/40 rounded-lg px-4 py-3 text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50 transition-all text-sm leading-relaxed"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold tracking-widest text-amber-100 uppercase mb-2">About Paragraph 2</label>
                                <textarea
                                    name="aboutDescription2" value={content.aboutDescription2 || ''} onChange={handleChange} rows={3}
                                    placeholder="Enter second about paragraph..."
                                    className="w-full bg-stone-950/80 border border-amber-900/40 rounded-lg px-4 py-3 text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50 transition-all text-sm leading-relaxed"
                                />
                            </div>
                        </div>
                    )}

                    {/* STATS TAB */}
                    {activeTab === 'stats' && (
                        <div className="space-y-6">
                            <div className="p-4 bg-amber-900/10 border border-amber-600/20 rounded-lg">
                                <p className="text-xs text-amber-100/70 mb-2 font-semibold flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4" /> Icon Names (use lucide-react icon names):
                                </p>
                                <p className="text-xs text-amber-100/50">
                                    Film, Users, Trophy, Award, Star, Sparkles, Heart, Target, Zap, Crown, Medal
                                </p>
                                <p className="text-xs text-red-400/60 mt-2">
                                    ⚠️ If you see emojis (🎬👥🏆), replace them with icon names above
                                </p>
                            </div>
                            {(content.stats || []).map((stat, idx) => (
                                <div key={idx} className="p-4 bg-stone-800/30 border border-amber-900/20 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                                    <div>
                                        <label className="block text-[10px] font-bold tracking-widest text-amber-100 uppercase mb-1">Icon Name</label>
                                        <input type="text" value={stat.icon || ''} onChange={(e) => handleArrayChange('stats', idx, 'icon', e.target.value)} placeholder="Icon name (e.g., Drama)" className="w-full bg-stone-950/50 border border-amber-900/30 rounded px-3 py-2 text-sm text-amber-50 placeholder:text-amber-100/30" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold tracking-widest text-amber-100 uppercase mb-1">Value (Number)</label>
                                        <input type="number" value={stat.count || 0} onChange={(e) => handleArrayChange('stats', idx, 'count', parseInt(e.target.value))} placeholder="20" className="w-full bg-stone-950/50 border border-amber-900/30 rounded px-3 py-2 text-sm text-amber-50 placeholder:text-amber-100/30" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold tracking-widest text-amber-100 uppercase mb-1">Suffix (e.g. +)</label>
                                        <input type="text" value={stat.suffix || ''} onChange={(e) => handleArrayChange('stats', idx, 'suffix', e.target.value)} placeholder="+" className="w-full bg-stone-950/50 border border-amber-900/30 rounded px-3 py-2 text-sm text-amber-50 placeholder:text-amber-100/30" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold tracking-widest text-amber-100 uppercase mb-1">Label</label>
                                        <input type="text" value={stat.label || ''} onChange={(e) => handleArrayChange('stats', idx, 'label', e.target.value)} placeholder="Productions" className="w-full bg-stone-950/50 border border-amber-900/30 rounded px-3 py-2 text-sm text-amber-50 placeholder:text-amber-100/30" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* TERTULIA TAB */}
                    {activeTab === 'tertulia' && (
                        <div className="space-y-8">
                            <div>
                                <label className="block text-xs font-semibold tracking-widest text-amber-100 uppercase mb-2">Page Title</label>
                                <input
                                    type="text" name="pageTitle_tertulia" value={content.pageTitle_tertulia || 'Tertulia Sessions'} onChange={handleChange}
                                    placeholder="Tertulia Sessions"
                                    className="w-full bg-stone-950/80 border border-amber-900/40 rounded-lg px-4 py-3 text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50 focus:ring-1 focus:ring-yellow-600/50 transition-all font-serif text-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold tracking-widest text-amber-100 uppercase mb-2">Description</label>
                                <textarea
                                    name="tertuliaDescription" value={content.tertuliaDescription || ''} onChange={handleChange} rows={4}
                                    placeholder="Enter tertulia description..."
                                    className="w-full bg-stone-950/80 border border-amber-900/40 rounded-lg px-4 py-3 text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50 transition-all text-sm leading-relaxed"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-semibold tracking-widest text-amber-100 uppercase mb-4">Tertulia Media Gallery (Images & Videos)</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {(content.tertuliaMedia || []).map((item, idx) => (
                                        <div key={idx} className="bg-stone-800/30 border border-amber-900/30 rounded-xl overflow-hidden relative group shadow-lg">
                                            <button onClick={() => removeArrayItem('tertuliaMedia', idx)} className="absolute z-10 top-2 right-2 w-7 h-7 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors">
                                                <X className="w-4 h-4" />
                                            </button>
                                            <div className="aspect-video bg-stone-950 relative overflow-hidden">
                                                {item.url && item.url.match(/\.(mp4|webm|ogg)$/i) ? (
                                                    <video src={item.url} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60" />
                                                ) : (
                                                    <>
                                                        <img src={item.url} alt="Tertulia" className="w-full h-full object-cover opacity-60" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                                        <div className="absolute inset-0 hidden items-center justify-center text-amber-100/20 text-xs">Invalid URL</div>
                                                    </>
                                                )}
                                            </div>
                                            <div className="p-4 space-y-3">
                                                <div>
                                                    <label className="block text-[10px] font-bold tracking-widest text-amber-100 uppercase mb-1">Media URL (Image or Video)</label>
                                                    <div className="flex gap-2">
                                                        <input type="text" value={item.url || ''} onChange={(e) => handleArrayChange('tertuliaMedia', idx, 'url', e.target.value)} placeholder="https://..." className="flex-1 bg-stone-950/50 border border-amber-900/30 rounded px-2 py-1.5 text-xs text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50" />
                                                        <label className="cursor-pointer flex items-center justify-center w-8 bg-stone-800 hover:bg-stone-700 border border-amber-900/30 text-amber-100 rounded transition-colors">
                                                            <Upload className="w-3.5 h-3.5" />
                                                            <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => handleFileUpload(e, 'tertuliaMedia', idx, 'url')} />
                                                        </label>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold tracking-widest text-amber-100 uppercase mb-1">Label</label>
                                                    <input type="text" value={item.label || ''} onChange={(e) => handleArrayChange('tertuliaMedia', idx, 'label', e.target.value)} placeholder="Media description" className="w-full bg-stone-950/50 border border-amber-900/30 rounded px-2 py-1.5 text-xs text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => addArrayItem('tertuliaMedia', { label: 'New Media', url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80' })}
                                    className="w-full mt-6 py-4 border-2 border-dashed border-amber-900/30 rounded-xl text-yellow-600 hover:bg-yellow-600/5 hover:border-yellow-600/50 transition-colors text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-5 h-5" /> Add Image / Video
                                </button>
                            </div>
                        </div>
                    )}

                    {/* PRODUCTIONS TAB */}
                    {activeTab === 'productions' && (
                        <div className="space-y-8">
                            {(content.productions || []).map((item, idx) => (
                                <div key={idx} className="p-5 bg-stone-800/30 border border-amber-900/30 rounded-xl relative group">
                                    <button onClick={() => removeArrayItem('productions', idx)} className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-red-500/10 text-red-500 rounded-full border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-bold tracking-widest text-amber-100 uppercase mb-1">Title</label>
                                            <input type="text" value={item.title || ''} onChange={(e) => handleArrayChange('productions', idx, 'title', e.target.value)} placeholder="Production Title" className="w-full bg-stone-950/50 border border-amber-900/30 rounded px-3 py-2 text-sm text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold tracking-widest text-amber-100 uppercase mb-1">Year</label>
                                            <input type="text" value={item.year || ''} onChange={(e) => handleArrayChange('productions', idx, 'year', e.target.value)} placeholder="2024" className="w-full bg-stone-950/50 border border-amber-900/30 rounded px-3 py-2 text-sm text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50" />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold tracking-widest text-amber-100 uppercase mb-1">Genre</label>
                                            <input type="text" value={item.genre || ''} onChange={(e) => handleArrayChange('productions', idx, 'genre', e.target.value)} placeholder="Drama" className="w-full bg-stone-950/50 border border-amber-900/30 rounded px-3 py-2 text-sm text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-bold tracking-widest text-amber-100 uppercase mb-1">Description</label>
                                            <input type="text" value={item.description || ''} onChange={(e) => handleArrayChange('productions', idx, 'description', e.target.value)} placeholder="Brief description" className="w-full bg-stone-950/50 border border-amber-900/30 rounded px-3 py-2 text-sm text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50" />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-[10px] font-bold tracking-widest text-amber-100 uppercase mb-1">Cover Media (Image/Video URL)</label>
                                        <div className="flex gap-2">
                                            <input type="text" value={item.image || ''} onChange={(e) => handleArrayChange('productions', idx, 'image', e.target.value)} placeholder="http://..." className="flex-1 bg-stone-950/50 border border-amber-900/30 rounded px-3 py-2 text-sm text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50" />
                                            <label className="cursor-pointer flex items-center gap-2 bg-stone-800 hover:bg-stone-700 border border-amber-900/30 text-amber-100 px-4 py-2 rounded text-xs font-bold uppercase transition-colors">
                                                <Upload className="w-4 h-4" /> Upload
                                                <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => handleFileUpload(e, 'productions', idx, 'image')} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => addArrayItem('productions', { title: 'New Production', year: new Date().getFullYear().toString(), genre: 'Drama', description: '', image: '' })}
                                className="w-full py-4 border-2 border-dashed border-amber-900/30 rounded-xl text-yellow-600 hover:bg-yellow-600/5 hover:border-yellow-600/50 transition-colors text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" /> Add Production
                            </button>
                        </div>
                    )}

                    {/* GALLERY TAB */}
                    {activeTab === 'gallery' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(content.gallery || []).map((item, idx) => (
                                    <div key={idx} className="bg-stone-800/30 border border-amber-900/30 rounded-xl overflow-hidden relative group shadow-lg">
                                        <button onClick={() => removeArrayItem('gallery', idx)} className="absolute z-10 top-2 right-2 w-7 h-7 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                        <div className="aspect-video bg-stone-950 relative overflow-hidden">
                                            {item.url && item.url.match(/\.(mp4|webm|ogg)$/i) ? (
                                                <video src={item.url} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60" />
                                            ) : (
                                                <>
                                                    <img src={item.url} alt="Gallery" className="w-full h-full object-cover opacity-60" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                                    <div className="absolute inset-0 hidden items-center justify-center text-amber-100/20 text-xs">Invalid URL</div>
                                                </>
                                            )}
                                        </div>
                                        <div className="p-4 space-y-3">
                                            <div>
                                                <label className="block text-[10px] font-bold tracking-widest text-amber-100 uppercase mb-1">Media URL</label>
                                                <div className="flex gap-2">
                                                    <input type="text" value={item.url || ''} onChange={(e) => handleArrayChange('gallery', idx, 'url', e.target.value)} placeholder="https://..." className="flex-1 bg-stone-950/50 border border-amber-900/30 rounded px-2 py-1.5 text-xs text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50" />
                                                    <label className="cursor-pointer flex items-center justify-center w-8 bg-stone-800 hover:bg-stone-700 border border-amber-900/30 text-amber-100 rounded transition-colors tooltip relative group">
                                                        <Upload className="w-3.5 h-3.5" />
                                                        <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => handleFileUpload(e, 'gallery', idx, 'url')} />
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold tracking-widest text-amber-100 uppercase mb-1">Label</label>
                                                <input type="text" value={item.label || ''} onChange={(e) => handleArrayChange('gallery', idx, 'label', e.target.value)} placeholder="Image description" className="w-full bg-stone-950/50 border border-amber-900/30 rounded px-2 py-1.5 text-xs text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => addArrayItem('gallery', { label: 'New Media', url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80' })}
                                className="w-full py-4 border-2 border-dashed border-amber-900/30 rounded-xl text-yellow-600 hover:bg-yellow-600/5 hover:border-yellow-600/50 transition-colors text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" /> Add Image / Video
                            </button>
                        </div>
                    )}

                    {/* TEAM TAB */}
                    {activeTab === 'team' && (
                        <div className="space-y-6">
                            {(content.team || []).map((item, idx) => (
                                <div key={idx} className="p-5 bg-stone-800/30 border border-amber-900/30 rounded-xl relative group">
                                    <button onClick={() => removeArrayItem('team', idx)} className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-red-500/10 text-red-500 rounded-full border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label className="block text-[10px] font-bold tracking-widest text-amber-100 uppercase mb-1">Name</label>
                                            <input type="text" value={item.name || ''} onChange={(e) => handleArrayChange('team', idx, 'name', e.target.value)} placeholder="Full Name" className="w-full bg-stone-950/50 border border-amber-900/30 rounded px-3 py-2 text-sm text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold tracking-widest text-amber-100 uppercase mb-1">Role / Position</label>
                                            <input type="text" value={item.role || ''} onChange={(e) => handleArrayChange('team', idx, 'role', e.target.value)} placeholder="President" className="w-full bg-stone-950/50 border border-amber-900/30 rounded px-3 py-2 text-sm text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold tracking-widest text-amber-100 uppercase mb-1">Alias (Aka)</label>
                                            <input type="text" value={item.aka || ''} onChange={(e) => handleArrayChange('team', idx, 'aka', e.target.value)} placeholder="Nickname" className="w-full bg-stone-950/50 border border-amber-900/30 rounded px-3 py-2 text-sm text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold tracking-widest text-amber-100 uppercase mb-1">Bio Description</label>
                                        <textarea value={item.description || ''} onChange={(e) => handleArrayChange('team', idx, 'description', e.target.value)} rows={2} placeholder="Brief bio..." className="w-full bg-stone-950/50 border border-amber-900/30 rounded px-3 py-2 text-sm text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50" />
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => addArrayItem('team', { name: 'New Executive', aka: '', role: 'Member', description: '' })}
                                className="w-full py-4 border-2 border-dashed border-amber-900/30 rounded-xl text-yellow-600 hover:bg-yellow-600/5 hover:border-yellow-600/50 transition-colors text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" /> Add Team Member
                            </button>
                        </div>
                    )}

                    {/* SETTINGS TAB */}
                    {activeTab === 'settings' && settings && (
                        <div className="space-y-6">
                            <div className="bg-amber-900/10 border border-amber-900/30 rounded-xl p-6">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center shrink-0">
                                        <Mail className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-serif font-bold text-amber-100 mb-1">Email Notifications</h3>
                                        <p className="text-amber-100/60 text-sm">Configure where contact form submissions are sent</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold tracking-widest text-amber-100 uppercase mb-2">Admin Email Recipient</label>
                                        <input
                                            type="email"
                                            value={settings.emailRecipient || ''}
                                            onChange={(e) => setSettings({ ...settings, emailRecipient: e.target.value })}
                                            placeholder="admin@example.com"
                                            className="w-full bg-stone-950/80 border border-amber-900/40 rounded-lg px-4 py-3 text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:border-yellow-600/50 focus:ring-1 focus:ring-yellow-600/50 transition-all"
                                        />
                                        <p className="mt-2 text-xs text-amber-100/50">
                                            This email address will receive notifications when visitors submit the contact form.
                                        </p>
                                    </div>

                                    <div className="bg-stone-950/50 border border-amber-900/20 rounded-lg p-4 space-y-2">
                                        <p className="text-xs font-semibold tracking-widest text-amber-100 uppercase">Current Configuration</p>
                                        <div className="space-y-1 text-sm text-amber-100/70">
                                            <p>📧 Email Service: Gmail</p>
                                            <p>✉️ Sender: {process.env.EMAIL_USER || 'Not configured'}</p>
                                            <p>📬 Recipient: {settings.emailRecipient || 'Not set'}</p>
                                        </div>
                                    </div>

                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                        <div className="flex gap-3">
                                            <div className="text-blue-400 shrink-0">ℹ️</div>
                                            <div className="text-sm text-blue-100/80 space-y-1">
                                                <p className="font-semibold">How Email Notifications Work:</p>
                                                <ul className="list-disc list-inside space-y-1 text-xs text-blue-100/60 ml-2">
                                                    <li>Visitors fill out the contact form on your website</li>
                                                    <li>You receive a notification email with their details</li>
                                                    <li>Visitor receives an automatic confirmation email</li>
                                                    <li>All submissions are saved to the database</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    )
}
