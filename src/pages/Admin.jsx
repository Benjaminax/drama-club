import { useState, useEffect } from 'react'
import { LayoutDashboard, Save, Loader2, ArrowLeft, Image as ImageIcon, Users, Type, Film, Upload, LogOut, Coffee, BarChart3, X, Plus, Settings as SettingsIcon, Mail, Video, ChevronDown, ChevronUp, Sparkles, Check, AlertCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function Admin() {
    const navigate = useNavigate()
    const [content, setContent] = useState(null)
    const [settings, setSettings] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [notification, setNotification] = useState('')
    const [activeTab, setActiveTab] = useState('hero')
    const [expandedProductions, setExpandedProductions] = useState({})
    const [expandedTeam, setExpandedTeam] = useState({})

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

    // Nested content block handlers (for productions.content, team.bio, etc.)
    const handleNestedContentChange = (parentArray, parentIdx, contentField, contentIdx, field, value) => {
        const newParentArray = [...content[parentArray]]
        const newContentArray = [...(newParentArray[parentIdx][contentField] || [])]
        newContentArray[contentIdx] = { ...newContentArray[contentIdx], [field]: value }
        newParentArray[parentIdx] = { ...newParentArray[parentIdx], [contentField]: newContentArray }
        setContent({ ...content, [parentArray]: newParentArray })
    }

    const addNestedContent = (parentArray, parentIdx, contentField, emptyBlock) => {
        const newParentArray = [...content[parentArray]]
        const currentContent = newParentArray[parentIdx][contentField] || []
        newParentArray[parentIdx] = { 
            ...newParentArray[parentIdx], 
            [contentField]: [...currentContent, emptyBlock] 
        }
        setContent({ ...content, [parentArray]: newParentArray })
    }

    const removeNestedContent = (parentArray, parentIdx, contentField, contentIdx) => {
        const newParentArray = [...content[parentArray]]
        const newContentArray = (newParentArray[parentIdx][contentField] || []).filter((_, i) => i !== contentIdx)
        newParentArray[parentIdx] = { ...newParentArray[parentIdx], [contentField]: newContentArray }
        setContent({ ...content, [parentArray]: newParentArray })
    }

    const moveNestedContent = (parentArray, parentIdx, contentField, contentIdx, direction) => {
        const newParentArray = [...content[parentArray]]
        const contentArray = [...(newParentArray[parentIdx][contentField] || [])]
        const newIdx = direction === 'up' ? contentIdx - 1 : contentIdx + 1
        if (newIdx < 0 || newIdx >= contentArray.length) return
        ;[contentArray[contentIdx], contentArray[newIdx]] = [contentArray[newIdx], contentArray[contentIdx]]
        newParentArray[parentIdx] = { ...newParentArray[parentIdx], [contentField]: contentArray }
        setContent({ ...content, [parentArray]: newParentArray })
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
            <div className="min-h-screen bg-linear-to-br from-slate-950 via-stone-950 to-slate-900 flex flex-col items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-yellow-500 animate-spin mb-6 mx-auto" />
                    <p className="text-amber-100/90 text-lg font-medium tracking-wide">Loading Dashboard</p>
                    <div className="flex gap-1 justify-center mt-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            </div>
        )
    }

    // Content Block Editor Component
    const ContentBlockEditor = ({ blocks = [], onChange, onAdd, onRemove, onMove, title = "Content Blocks", supportVideo = false }) => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    {title}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => onAdd({ type: 'text', content: '' })}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-xs font-medium transition-all hover:scale-105"
                    >
                        <Type className="w-3.5 h-3.5" /> Text
                    </button>
                    <button
                        onClick={() => onAdd({ type: 'image', url: '', caption: '' })}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg text-xs font-medium transition-all hover:scale-105"
                    >
                        <ImageIcon className="w-3.5 h-3.5" /> Image
                    </button>
                    {supportVideo && (
                        <button
                            onClick={() => onAdd({ type: 'video', url: '', caption: '' })}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-medium transition-all hover:scale-105"
                        >
                            <Video className="w-3.5 h-3.5" /> Video
                        </button>
                    )}
                </div>
            </div>

            {(!blocks || blocks.length === 0) && (
                <div className="py-12 text-center bg-slate-900/30 border-2 border-dashed border-slate-700/50 rounded-xl">
                    <div className="max-w-sm mx-auto">
                        <div className="w-16 h-16 bg-slate-800/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-slate-600" />
                        </div>
                        <p className="text-slate-400 text-sm">No content blocks yet</p>
                        <p className="text-slate-500 text-xs mt-1">Click the buttons above to add content</p>
                    </div>
                </div>
            )}

            {blocks.map((block, idx) => (
                <div key={idx} className="group relative bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600/50 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            {block.type === 'text' && <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center"><Type className="w-4 h-4 text-blue-400" /></div>}
                            {block.type === 'image' && <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center"><ImageIcon className="w-4 h-4 text-purple-400" /></div>}
                            {block.type === 'video' && <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center"><Video className="w-4 h-4 text-emerald-400" /></div>}
                            <div>
                                <span className="text-sm font-medium text-slate-200">{block.type.charAt(0).toUpperCase() + block.type.slice(1)} Block</span>
                                <p className="text-xs text-slate-500">Position #{idx + 1}</p>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            {idx > 0 && (
                                <button onClick={() => onMove(idx, 'up')} className="w-7 h-7 flex items-center justify-center bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg transition-all" title="Move Up">
                                    <ChevronUp className="w-4 h-4" />
                                </button>
                            )}
                            {idx < blocks.length - 1 && (
                                <button onClick={() => onMove(idx, 'down')} className="w-7 h-7 flex items-center justify-center bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg transition-all" title="Move Down">
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            )}
                            <button onClick={() => onRemove(idx)} className="w-7 h-7 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {block.type === 'text' ? (
                        <textarea
                            value={block.content || ''}
                            onChange={(e) => onChange(idx, 'content', e.target.value)}
                            rows={4}
                            placeholder="Enter your text content here..."
                            className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm leading-relaxed resize-none"
                        />
                    ) : (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-2">{block.type === 'video' ? 'Video URL' : 'Image URL'}</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={block.url || ''}
                                        onChange={(e) => onChange(idx, 'url', e.target.value)}
                                        placeholder="https://example.com/media.jpg"
                                        className="flex-1 bg-slate-950/60 border border-slate-700/50 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                                    />
                                    <label className={`px-4 py-2.5 ${block.type === 'video' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' : 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20'} border rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 hover:scale-105`}>
                                        <Upload className="w-3.5 h-3.5" /> Upload
                                        <input type="file" accept={block.type === 'video' ? 'video/*' : 'image/*'} onChange={(e) => {
                                            const file = e.target.files[0]
                                            if (!file) return
                                            const formData = new FormData()
                                            formData.append('media', file)
                                            fetch(`${import.meta.env.VITE_API_URL || '/api'}/upload`, {
                                                method: 'POST',
                                                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
                                                body: formData
                                            })
                                                .then(res => res.json())
                                                .then(data => {
                                                    if (data.success) {
                                                        onChange(idx, 'url', data.url)
                                                        setNotification('Upload successful!')
                                                        setTimeout(() => setNotification(''), 3000)
                                                    }
                                                })
                                        }} className="hidden" />
                                    </label>
                                </div>
                            </div>
                            {block.url && (
                                <div className="rounded-lg overflow-hidden border border-slate-700/50">
                                    {block.type === 'video' ? (
                                        <video src={block.url} className="w-full h-56 object-cover bg-slate-950" controls />
                                    ) : (
                                        <img src={block.url} alt="Preview" className="w-full h-56 object-cover bg-slate-950" />
                                    )}
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-2">Caption (Optional)</label>
                                <input
                                    type="text"
                                    value={block.caption || ''}
                                    onChange={(e) => onChange(idx, 'caption', e.target.value)}
                                    placeholder="Add a caption or description..."
                                    className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                                />
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )

    const tabs = [
        { id: 'hero', label: 'Hero Section', icon: Sparkles },
        { id: 'about', label: 'About Details', icon: Type },
        { id: 'stats', label: 'Statistics', icon: BarChart3 },
        { id: 'tertulia', label: 'Tertulia Section', icon: Coffee },
        { id: 'productions', label: 'Productions', icon: Film },
        { id: 'gallery', label: 'Gallery', icon: ImageIcon },
        { id: 'team', label: 'Team Members', icon: Users },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
    ]

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-stone-950 to-slate-900 flex">
            {/* Professional Sidebar */}
            <aside className="w-72 bg-linear-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl border-r border-slate-800/50 flex flex-col shrink-0 shadow-2xl">
                <div className="p-6 border-b border-slate-800/50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-linear-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white tracking-tight">AMD Dashboard</h1>
                            <p className="text-xs text-slate-400">Content Management</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {tabs.map(tab => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                    isActive
                                        ? 'bg-linear-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-500/30 shadow-lg shadow-yellow-500/10'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-yellow-400' : ''}`} />
                                <span>{tab.label}</span>
                            </button>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800/50 space-y-2">
                    <Link to="/" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Website
                    </Link>

                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all w-full">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Professional Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-8">
                    {/* Professional Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-1">
                                {tabs.find(t => t.id === activeTab)?.label}
                            </h2>
                            <p className="text-slate-400 text-sm">Edit and manage your live website content</p>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-linear-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black px-6 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 hover:-translate-y-0.5 disabled:hover:translate-y-0"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>

                    {/* Success Notification */}
                    {notification && (
                        <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                    <Check className="w-4 h-4 text-emerald-400" />
                                </div>
                                <span className="text-emerald-300 text-sm font-medium">{notification}</span>
                            </div>
                            <button onClick={() => setNotification('')} className="text-emerald-400/50 hover:text-emerald-400 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Content Editor Card */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-2xl">

                        {/* HERO TAB */}
                        {activeTab === 'hero' && (
                            <div className="space-y-8">
                                <div className="bg-linear-to-br from-yellow-500/5 to-amber-500/5 border border-yellow-500/20 rounded-xl p-6">
                                    <h3 className="text-sm font-semibold text-yellow-400 mb-5 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" /> Main Hero Content
                                    </h3>
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-300 mb-2">Hero Title</label>
                                            <input
                                                type="text" name="heroText" value={content.heroText || ''} onChange={handleChange}
                                                placeholder="Enter hero title..."
                                                className="w-full bg-slate-950/80 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all font-serif text-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-300 mb-2">Hero Description</label>
                                            <textarea
                                                name="heroDescription" value={content.heroDescription || ''} onChange={handleChange} rows={3}
                                                placeholder="Enter hero description..."
                                                className="w-full bg-slate-950/80 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all text-sm resize-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-300 mb-2">Background Image URL</label>
                                            <div className="flex gap-2 mb-3">
                                                <input
                                                    type="text" name="heroBackgroundImage" value={content.heroBackgroundImage || ''} onChange={handleChange}
                                                    placeholder="https://example.com/image.jpg"
                                                    className="flex-1 bg-slate-950/80 border border-slate-700/50 rounded-xl px-4 py-2.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-sm"
                                                />
                                                <label className="px-5 py-2.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-xl text-xs font-medium cursor-pointer hover:bg-yellow-500/20 transition-all flex items-center gap-2 hover:scale-105">
                                                    <Upload className="w-4 h-4" /> Upload
                                                    <input type="file" accept="image/*" onChange={async (e) => {
                                                        const file = e.target.files[0]
                                                        if (!file) return
                                                        const formData = new FormData()
                                                        formData.append('media', file)
                                                        const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/upload`, {
                                                            method: 'POST',
                                                            headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
                                                            body: formData
                                                        })
                                                        const data = await res.json()
                                                        if (data.success) {
                                                            setContent({ ...content, heroBackgroundImage: data.url })
                                                            setNotification('Background uploaded!')
                                                            setTimeout(() => setNotification(''), 3000)
                                                        }
                                                    }} className="hidden" />
                                                </label>
                                            </div>
                                            {content.heroBackgroundImage && (
                                                <div className="rounded-xl overflow-hidden border border-slate-700/50">
                                                    <img src={content.heroBackgroundImage} alt="Hero background preview" className="w-full h-40 object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Rich Content Blocks for Hero */}
                                <ContentBlockEditor
                                    blocks={content.heroContent || []}
                                    onChange={(idx, field, value) => handleArrayChange('heroContent', idx, field, value)}
                                    onAdd={(block) => addArrayItem('heroContent', block)}
                                    onRemove={(idx) => removeArrayItem('heroContent', idx)}
                                    onMove={(idx, dir) => {
                                        const newArray = [...content.heroContent]
                                        const newIdx = dir === 'up' ? idx - 1 : idx + 1
                                        if (newIdx < 0 || newIdx >= newArray.length) return
                                        ;[newArray[idx], newArray[newIdx]] = [newArray[newIdx], newArray[idx]]
                                        setContent({ ...content, heroContent: newArray })
                                    }}
                                    title="Additional Hero Content"
                                    supportVideo={true}
                                />

                                <div className="pt-6 border-t border-slate-800/50">
                                    <h3 className="text-sm font-semibold text-slate-200 mb-5">Page Titles</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {[
                                            { name: 'pageTitle_about', label: 'About Page', default: 'About Us' },
                                            { name: 'pageTitle_projects', label: 'Productions Page', default: 'Productions' },
                                            { name: 'pageTitle_team', label: 'Team Page', default: 'Our Team' },
                                            { name: 'pageTitle_gallery', label: 'Gallery Page', default: 'Gallery' },
                                            { name: 'pageTitle_tertulia', label: 'Tertulia Page', default: 'Tertulia Sessions' },
                                            { name: 'pageTitle_contact', label: 'Contact Page', default: 'Contact Us' }
                                        ].map(field => (
                                            <div key={field.name}>
                                                <label className="block text-xs font-medium text-slate-400 mb-2">{field.label}</label>
                                                <input 
                                                    type="text" 
                                                    name={field.name} 
                                                    value={content[field.name] || field.default} 
                                                    onChange={handleChange} 
                                                    placeholder={field.default} 
                                                    className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50" 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ABOUT TAB */}
                        {activeTab === 'about' && (
                            <div className="space-y-8">
                                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
                                    <label className="block text-xs font-medium text-slate-300 mb-2">Section Subtitle</label>
                                    <input
                                        type="text" name="aboutSubtitle" value={content.aboutSubtitle || 'Who We Are'} onChange={handleChange}
                                        placeholder="Who We Are"
                                        className="w-full bg-slate-950/80 border border-slate-700/50 rounded-xl px-4 py-2.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm"
                                    />
                                </div>

                                {/* Content Blocks Editor */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-slate-200">Content Blocks</h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => addArrayItem('aboutContent', { type: 'text', content: '' })}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-xs font-medium transition-all hover:scale-105"
                                            >
                                                <Type className="w-3.5 h-3.5" /> Add Text
                                            </button>
                                            <button
                                                onClick={() => addArrayItem('aboutContent', { type: 'image', url: '', caption: '' })}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg text-xs font-medium transition-all hover:scale-105"
                                            >
                                                <ImageIcon className="w-3.5 h-3.5" /> Add Image
                                            </button>
                                        </div>
                                    </div>

                                    {(!content.aboutContent || content.aboutContent.length === 0) && (
                                        <div className="py-12 text-center bg-slate-900/30 border-2 border-dashed border-slate-700/50 rounded-xl">
                                            <div className="max-w-sm mx-auto">
                                                <div className="w-16 h-16 bg-slate-800/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                                                    <AlertCircle className="w-8 h-8 text-slate-600" />
                                                </div>
                                                <p className="text-slate-400 text-sm">No content blocks yet</p>
                                                <p className="text-slate-500 text-xs mt-1">Add text paragraphs or images above</p>
                                            </div>
                                        </div>
                                    )}

                                    {(content.aboutContent || []).map((block, idx) => (
                                        <div key={idx} className="group relative bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600/50 transition-all">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    {block.type === 'text' ? 
                                                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center"><Type className="w-4 h-4 text-blue-400" /></div> : 
                                                        <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center"><ImageIcon className="w-4 h-4 text-purple-400" /></div>
                                                    }
                                                    <div>
                                                        <span className="text-sm font-medium text-slate-200">{block.type === 'text' ? 'Text' : 'Image'} Block</span>
                                                        <p className="text-xs text-slate-500">Position #{idx + 1}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    {idx > 0 && (
                                                        <button onClick={() => {
                                                            const newArray = [...content.aboutContent]
                                                            ;[newArray[idx], newArray[idx-1]] = [newArray[idx-1], newArray[idx]]
                                                            setContent({ ...content, aboutContent: newArray })
                                                        }} className="w-7 h-7 flex items-center justify-center bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg transition-all">
                                                            <ChevronUp className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {idx < content.aboutContent.length - 1 && (
                                                        <button onClick={() => {
                                                            const newArray = [...content.aboutContent]
                                                            ;[newArray[idx], newArray[idx+1]] = [newArray[idx+1], newArray[idx]]
                                                            setContent({ ...content, aboutContent: newArray })
                                                        }} className="w-7 h-7 flex items-center justify-center bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg transition-all">
                                                            <ChevronDown className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => removeArrayItem('aboutContent', idx)}
                                                        className="w-7 h-7 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {block.type === 'text' ? (
                                                <textarea
                                                    value={block.content || ''}
                                                    onChange={(e) => handleArrayChange('aboutContent', idx, 'content', e.target.value)}
                                                    rows={4}
                                                    placeholder="Enter paragraph text..."
                                                    className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm leading-relaxed resize-none"
                                                />
                                            ) : (
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-slate-400 mb-2">Image URL</label>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={block.url || ''}
                                                                onChange={(e) => handleArrayChange('aboutContent', idx, 'url', e.target.value)}
                                                                placeholder="https://example.com/image.jpg"
                                                                className="flex-1 bg-slate-950/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                                                            />
                                                            <label className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg text-xs font-medium cursor-pointer hover:bg-purple-500/20 transition-all flex items-center gap-1.5 hover:scale-105">
                                                                <Upload className="w-3.5 h-3.5" /> Upload
                                                                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'aboutContent', idx, 'url')} className="hidden" />
                                                            </label>
                                                        </div>
                                                    </div>
                                                    {block.url && (
                                                        <div className="rounded-lg overflow-hidden border border-slate-700/50">
                                                            <img src={block.url} alt="Preview" className="w-full h-56 object-cover bg-slate-950" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <label className="block text-xs font-medium text-slate-400 mb-2">Caption (Optional)</label>
                                                        <input
                                                            type="text"
                                                            value={block.caption || ''}
                                                            onChange={(e) => handleArrayChange('aboutContent', idx, 'caption', e.target.value)}
                                                            placeholder="Image caption or description..."
                                                            className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STATS TAB */}
                        {activeTab === 'stats' && (
                            <div className="space-y-6">
                                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
                                    <div className="flex items-start gap-3 mb-4">
                                        <BarChart3 className="w-5 h-5 text-amber-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-200 mb-1">Icon Names</p>
                                            <p className="text-xs text-slate-400">Film, Users, Trophy, Award, Star, Sparkles, Heart, Target, Zap, Crown, Medal</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {(content.stats || []).map((stat, idx) => (
                                    <div key={idx} className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-400 mb-2">Icon Name</label>
                                                <input type="text" value={stat.icon || ''} onChange={(e) => handleArrayChange('stats', idx, 'icon', e.target.value)} placeholder="Film" className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-400 mb-2">Value</label>
                                                <input type="number" value={stat.count || 0} onChange={(e) => handleArrayChange('stats', idx, 'count', parseInt(e.target.value))} placeholder="20" className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-400 mb-2">Suffix</label>
                                                <input type="text" value={stat.suffix || ''} onChange={(e) => handleArrayChange('stats', idx, 'suffix', e.target.value)} placeholder="+" className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-400 mb-2">Label</label>
                                                <input type="text" value={stat.label || ''} onChange={(e) => handleArrayChange('stats', idx, 'label', e.target.value)} placeholder="Productions" className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* TERTULIA TAB */}
                        {activeTab === 'tertulia' && (
                            <div className="space-y-8">
                                <div className="bg-linear-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-xl p-6">
                                    <h3 className="text-sm font-semibold text-amber-400 mb-5 flex items-center gap-2">
                                        <Coffee className="w-4 h-4" /> Tertulia Main Info
                                    </h3>
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-300 mb-2">Page Title</label>
                                            <input
                                                type="text" name="pageTitle_tertulia" value={content.pageTitle_tertulia || 'Tertulia Sessions'} onChange={handleChange}
                                                placeholder="Tertulia Sessions"
                                                className="w-full bg-slate-950/80 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all font-serif text-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-300 mb-2">Description</label>
                                            <textarea
                                                name="tertuliaDescription" value={content.tertuliaDescription || ''} onChange={handleChange} rows={4}
                                                placeholder="Enter tertulia description..."
                                                className="w-full bg-slate-950/80 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-sm leading-relaxed resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Rich Content Blocks */}
                                <ContentBlockEditor
                                    blocks={content.tertuliaContent || []}
                                    onChange={(idx, field, value) => handleArrayChange('tertuliaContent', idx, field, value)}
                                    onAdd={(block) => addArrayItem('tertuliaContent', block)}
                                    onRemove={(idx) => removeArrayItem('tertuliaContent', idx)}
                                    onMove={(idx, dir) => {
                                        const newArray = [...(content.tertuliaContent || [])]
                                        const newIdx = dir === 'up' ? idx - 1 : idx + 1
                                        if (newIdx < 0 || newIdx >= newArray.length) return
                                        ;[newArray[idx], newArray[newIdx]] = [newArray[newIdx], newArray[idx]]
                                        setContent({ ...content, tertuliaContent: newArray })
                                    }}
                                    title="Article Content (News Portal Style)"
                                    supportVideo={true}
                                />
                                
                                <div className="pt-6 border-t border-slate-800/50">
                                    <div className="flex items-center justify-between mb-5">
                                        <h3 className="text-sm font-semibold text-slate-200">Media Gallery</h3>
                                        <button
                                            onClick={() => addArrayItem('tertuliaMedia', { label: 'New Media', url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80' })}
                                            className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-lg text-xs font-medium transition-all hover:scale-105"
                                        >
                                            <Plus className="w-4 h-4" /> Add Media
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {(content.tertuliaMedia || []).map((item, idx) => (
                                            <div key={idx} className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden group hover:border-slate-600/50 transition-all">
                                                <div className="relative">
                                                    <button onClick={() => removeArrayItem('tertuliaMedia', idx)} className="absolute z-10 top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500/20 backdrop-blur-sm hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    <div className="aspect-video bg-slate-950">
                                                        {item.url && item.url.match(/\.(mp4|webm|ogg)$/i) ? (
                                                            <video src={item.url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                                                        ) : (
                                                            item.url && <img src={item.url} alt="Tertulia" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="p-4 space-y-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-slate-400 mb-2">Media URL</label>
                                                        <div className="flex gap-2">
                                                            <input type="text" value={item.url || ''} onChange={(e) => handleArrayChange('tertuliaMedia', idx, 'url', e.target.value)} placeholder="https://..." className="flex-1 bg-slate-950/60 border border-slate-700/50 rounded-lg px-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50" />
                                                            <label className="flex items-center justify-center w-8 h-8 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg transition-all cursor-pointer">
                                                                <Upload className="w-3.5 h-3.5" />
                                                                <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => handleFileUpload(e, 'tertuliaMedia', idx, 'url')} />
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-slate-400 mb-2">Label</label>
                                                        <input type="text" value={item.label || ''} onChange={(e) => handleArrayChange('tertuliaMedia', idx, 'label', e.target.value)} placeholder="Media description" className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg px-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PRODUCTIONS TAB */}
                        {activeTab === 'productions' && (
                            <div className="space-y-6">
                                {(content.productions || []).map((prod, idx) => {
                                    const isExpanded = expandedProductions[idx]
                                    return (
                                        <div key={idx} className="relative bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all">
                                            <button onClick={() => removeArrayItem('productions', idx)} className="absolute -top-3 -right-3 w-10 h-10 flex items-center justify-center bg-red-500/20 backdrop-blur-sm hover:bg-red-500 text-red-400 hover:text-white rounded-full border-2 border-slate-900 transition-all shadow-lg z-10">
                                                <X className="w-5 h-5" />
                                            </button>
                                            
                                            {/* Production Header */}
                                            <div className="flex items-start justify-between mb-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                                                        <Film className="w-5 h-5 text-yellow-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-slate-200">{prod.title || `Production #${idx + 1}`}</h3>
                                                        <p className="text-xs text-slate-500">Production Item</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setExpandedProductions({ ...expandedProductions, [idx]: !isExpanded })}
                                                    className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-lg text-xs font-medium transition-all"
                                                >
                                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                    {isExpanded ? 'Collapse' : 'Expand'} Article Editor
                                                </button>
                                            </div>

                                            {/* Basic Info */}
                                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-medium text-slate-400 mb-2">Production Title</label>
                                                    <input type="text" value={prod.title || ''} onChange={(e) => handleArrayChange('productions', idx, 'title', e.target.value)} placeholder="e.g., Romeo & Juliet" className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-400 mb-2">Year</label>
                                                    <input type="text" value={prod.year || ''} onChange={(e) => handleArrayChange('productions', idx, 'year', e.target.value)} placeholder="2024" className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50" />
                                                </div>
                                            </div>
                                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-400 mb-2">Genre</label>
                                                    <input type="text" value={prod.genre || ''} onChange={(e) => handleArrayChange('productions', idx, 'genre', e.target.value)} placeholder="Drama, Comedy..." className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50" />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-medium text-slate-400 mb-2">Short Description</label>
                                                    <input type="text" value={prod.description || ''} onChange={(e) => handleArrayChange('productions', idx, 'description', e.target.value)} placeholder="Brief one-liner..." className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-400 mb-2">Cover Image/Video</label>
                                                <div className="flex gap-2 mb-3">
                                                    <input type="text" value={prod.image || ''} onChange={(e) => handleArrayChange('productions', idx, 'image', e.target.value)} placeholder="https://..." className="flex-1 bg-slate-950/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50" />
                                                    <label className="cursor-pointer flex items-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-4 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105">
                                                        <Upload className="w-4 h-4" /> Upload
                                                        <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => handleFileUpload(e, 'productions', idx, 'image')} />
                                                    </label>
                                                </div>
                                                {prod.image && (
                                                    <div className="rounded-lg overflow-hidden border border-slate-700/50">
                                                        <img src={prod.image} alt="Cover preview" className="w-full h-48 object-cover" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Rich Content Editor (Expandable) */}
                                            {isExpanded && (
                                                <div className="mt-6 pt-6 border-t border-slate-800/50">
                                                    <ContentBlockEditor
                                                        blocks={prod.content || []}
                                                        onChange={(blockIdx, field, value) => handleNestedContentChange('productions', idx, 'content', blockIdx, field, value)}
                                                        onAdd={(block) => addNestedContent('productions', idx, 'content', block)}
                                                        onRemove={(blockIdx) => removeNestedContent('productions', idx, 'content', blockIdx)}
                                                        onMove={(blockIdx, dir) => moveNestedContent('productions', idx, 'content', blockIdx, dir)}
                                                        title={`Full Article Content for "${prod.title || 'Production'}"`}
                                                        supportVideo={true}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                                <button
                                    onClick={() => addArrayItem('productions', { title: 'New Production', year: new Date().getFullYear().toString(), genre: 'Drama', description: '', image: '', content: [] })}
                                    className="w-full py-5 border-2 border-dashed border-slate-700/50 hover:border-yellow-500/50 rounded-xl text-yellow-400 hover:bg-yellow-500/5 transition-all text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-5 h-5" /> Add New Production
                                </button>
                            </div>
                        )}

                        {/* GALLERY TAB */}
                        {activeTab === 'gallery' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-slate-200">Gallery Items</h3>
                                    <button
                                        onClick={() => addArrayItem('gallery', { label: 'New Media', url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80' })}
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg text-xs font-medium transition-all hover:scale-105"
                                    >
                                        <Plus className="w-4 h-4" /> Add Image/Video
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {(content.gallery || []).map((item, idx) => (
                                        <div key={idx} className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden group hover:border-slate-600/50 transition-all">
                                            <div className="relative">
                                                <button onClick={() => removeArrayItem('gallery', idx)} className="absolute z-10 top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500/20 backdrop-blur-sm hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all">
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <div className="aspect-video bg-slate-950">
                                                    {item.url && item.url.match(/\.(mp4|webm|ogg)$/i) ? (
                                                        <video src={item.url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                                                    ) : (
                                                        item.url && <img src={item.url} alt="Gallery" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="p-4 space-y-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-400 mb-2">Media URL</label>
                                                    <div className="flex gap-2">
                                                        <input type="text" value={item.url || ''} onChange={(e) => handleArrayChange('gallery', idx, 'url', e.target.value)} placeholder="https://..." className="flex-1 bg-slate-950/60 border border-slate-700/50 rounded-lg px-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
                                                        <label className="flex items-center justify-center w-8 h-8 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg transition-all cursor-pointer">
                                                            <Upload className="w-3.5 h-3.5" />
                                                            <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => handleFileUpload(e, 'gallery', idx, 'url')} />
                                                        </label>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-400 mb-2">Label</label>
                                                    <input type="text" value={item.label || ''} onChange={(e) => handleArrayChange('gallery', idx, 'label', e.target.value)} placeholder="Image description" className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg px-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TEAM TAB */}
                        {activeTab === 'team' && (
                            <div className="space-y-6">
                                {(content.team || []).map((member, idx) => {
                                    const isExpanded = expandedTeam[idx]
                                    return (
                                        <div key={idx} className="relative bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all">
                                            <button onClick={() => removeArrayItem('team', idx)} className="absolute -top-3 -right-3 w-10 h-10 flex items-center justify-center bg-red-500/20 backdrop-blur-sm hover:bg-red-500 text-red-400 hover:text-white rounded-full border-2 border-slate-900 transition-all shadow-lg z-10">
                                                <X className="w-5 h-5" />
                                            </button>
                                            
                                            {/* Member Header */}
                                            <div className="flex items-start justify-between mb-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                                        <Users className="w-5 h-5 text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-slate-200">{member.name || `Team Member #${idx + 1}`}</h3>
                                                        <p className="text-xs text-slate-500">{member.role || 'Team Member'}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setExpandedTeam({ ...expandedTeam, [idx]: !isExpanded })}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-xs font-medium transition-all"
                                                >
                                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                    {isExpanded ? 'Collapse' : 'Expand'} Bio Editor
                                                </button>
                                            </div>

                                            {/* Basic Info */}
                                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-400 mb-2">Full Name</label>
                                                    <input type="text" value={member.name || ''} onChange={(e) => handleArrayChange('team', idx, 'name', e.target.value)} placeholder="e.g., John Doe" className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-400 mb-2">Role / Position</label>
                                                    <input type="text" value={member.role || ''} onChange={(e) => handleArrayChange('team', idx, 'role', e.target.value)} placeholder="President, Director..." className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-400 mb-2">Nickname (aka)</label>
                                                    <input type="text" value={member.aka || ''} onChange={(e) => handleArrayChange('team', idx, 'aka', e.target.value)} placeholder="Nickname" className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                                                </div>
                                            </div>

                                            {/* Profile Photo */}
                                            <div className="mb-4">
                                                <label className="block text-xs font-medium text-slate-400 mb-2">Profile Photo</label>
                                                <div className="flex gap-3 items-start">
                                                    <div className="flex-1">
                                                        <div className="flex gap-2 mb-3">
                                                            <input type="text" value={member.photo || ''} onChange={(e) => handleArrayChange('team', idx, 'photo', e.target.value)} placeholder="https://..." className="flex-1 bg-slate-950/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                                                            <label className="cursor-pointer flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105">
                                                                <Upload className="w-4 h-4" /> Upload
                                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'team', idx, 'photo')} />
                                                            </label>
                                                        </div>
                                                    </div>
                                                    {member.photo && (
                                                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-700/50 bg-slate-950 shrink-0">
                                                            <img src={member.photo} alt="Profile preview" className="w-full h-full object-cover" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Short Bio */}
                                            <div className="mb-4">
                                                <label className="block text-xs font-medium text-slate-400 mb-2">Short Bio</label>
                                                <textarea value={member.description || ''} onChange={(e) => handleArrayChange('team', idx, 'description', e.target.value)} rows={2} placeholder="Brief one-paragraph bio..." className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none" />
                                            </div>

                                            {/* Rich Bio Content (Expandable) */}
                                            {isExpanded && (
                                                <div className="mt-6 pt-6 border-t border-slate-800/50">
                                                    <ContentBlockEditor
                                                        blocks={member.bio || []}
                                                        onChange={(blockIdx, field, value) => handleNestedContentChange('team', idx, 'bio', blockIdx, field, value)}
                                                        onAdd={(block) => addNestedContent('team', idx, 'bio', block)}
                                                        onRemove={(blockIdx) => removeNestedContent('team', idx, 'bio', blockIdx)}
                                                        onMove={(blockIdx, dir) => moveNestedContent('team', idx, 'bio', blockIdx, dir)}
                                                        title={`Extended Bio for "${member.name || 'Member'}"`}
                                                        supportVideo={false}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                                <button
                                    onClick={() => addArrayItem('team', { name: 'New Member', aka: '', role: 'Member', description: '', photo: '', bio: [] })}
                                    className="w-full py-5 border-2 border-dashed border-slate-700/50 hover:border-blue-500/50 rounded-xl text-blue-400 hover:bg-blue-500/5 transition-all text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-5 h-5" /> Add Team Member
                                </button>
                            </div>
                        )}

                        {/* SETTINGS TAB */}
                        {activeTab === 'settings' && settings && (
                            <div className="space-y-6">
                                <div className="bg-linear-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-xl p-6">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                                            <Mail className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-200 mb-1">Email Notifications</h3>
                                            <p className="text-slate-400 text-sm">Configure where contact form submissions are sent</p>
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-300 mb-2">Admin Email Recipient</label>
                                            <input
                                                type="email"
                                                value={settings.emailRecipient || ''}
                                                onChange={(e) => setSettings({ ...settings, emailRecipient: e.target.value })}
                                                placeholder="admin@example.com"
                                                className="w-full bg-slate-950/80 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                            />
                                            <p className="mt-2 text-xs text-slate-400">
                                                This email address will receive notifications when visitors submit the contact form.
                                            </p>
                                        </div>

                                        <div className="bg-slate-950/50 border border-slate-700/50 rounded-xl p-5">
                                            <p className="text-xs font-medium text-slate-300 mb-3">Current Configuration</p>
                                            <div className="space-y-2 text-sm text-slate-400">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                                    <span>Email Service: Gmail</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    <span>Recipient: {settings.emailRecipient || 'Not set'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                                                    <AlertCircle className="w-4 h-4 text-blue-400" />
                                                </div>
                                                <div className="text-sm text-blue-200/80 space-y-2">
                                                    <p className="font-semibold text-blue-300">How Email Notifications Work:</p>
                                                    <ul className="list-disc list-inside space-y-1 text-xs text-blue-200/60 ml-2">
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
                </div>
            </main>
        </div>
    )
}
