import { User } from 'lucide-react'
import { useState } from 'react'

const MemberCard = ({ member }) => {
    const [showBio, setShowBio] = useState(false)
    const hasBio = member.bio && member.bio.length > 0

    return (
        <>
            <div
                onClick={() => hasBio && setShowBio(true)}
                className={`bg-stone-900/40 backdrop-blur-md rounded-2xl p-7 text-center hover:bg-stone-900/60 transition-all border border-amber-900/20 shadow-xl card-hover group relative overflow-hidden ${hasBio ? 'cursor-pointer' : ''}`}
            >
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all duration-500" />
                <div className="relative z-10">
                    <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-700 to-yellow-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-400 border-4 border-amber-900/30 group-hover:border-amber-600/50 shadow-lg group-hover:shadow-amber-500/25 overflow-hidden">
                        {member.photo ? (
                            <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-14 h-14 text-stone-900" strokeWidth={1.5} />
                        )}
                    </div>
                    <div className="mb-4">
                        <h3 className="text-xl font-serif text-amber-100 mb-1 group-hover:text-yellow-400 transition-all duration-300">
                            {member.name}
                        </h3>
                        {member.aka && <p className="text-amber-200 text-sm italic">"{member.aka}"</p>}
                    </div>
                    <span className="inline-block px-4 py-1 bg-yellow-600 group-hover:bg-yellow-500 text-stone-900 rounded-full text-xs font-bold tracking-widest transition-all mb-4 shadow-md uppercase">
                        {member.role}
                    </span>
                    <p className="text-amber-100 text-sm leading-relaxed font-light transition-colors">
                        {member.description}
                    </p>
                    {hasBio && (
                        <p className="text-yellow-500 text-xs mt-4 font-medium">Click to read more →</p>
                    )}
                    <div className="mt-5 h-px w-0 group-hover:w-3/4 bg-linear-to-r from-yellow-600 to-transparent transition-all duration-500 mx-auto" />
                </div>
            </div>

            {/* Bio Modal */}
            {showBio && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowBio(false)}>
                    <div className="bg-stone-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-amber-900/30 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-stone-900 border-b border-amber-900/20 p-6 flex items-center justify-between z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-700 to-yellow-700 flex items-center justify-center border-2 border-amber-900/30 overflow-hidden">
                                    {member.photo ? (
                                        <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-8 h-8 text-stone-900" strokeWidth={1.5} />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-serif text-amber-100">{member.name}</h2>
                                    {member.aka && <p className="text-amber-200 text-sm italic">"{member.aka}"</p>}
                                    <span className="text-yellow-500 text-sm font-medium">{member.role}</span>
                                </div>
                            </div>
                            <button onClick={() => setShowBio(false)} className="text-amber-100 hover:text-yellow-500 text-2xl font-light transition-colors">×</button>
                        </div>
                        <div className="p-8 space-y-6">
                            <p className="text-amber-100 text-base leading-relaxed font-light">{member.description}</p>
                            {member.bio && member.bio.map((block, idx) => (
                                <div key={idx}>
                                    {block.type === 'text' ? (
                                        <p className="text-amber-100 text-base leading-relaxed font-light">
                                            {block.content}
                                        </p>
                                    ) : block.type === 'image' && block.url ? (
                                        <div className="my-6">
                                            <img 
                                                src={block.url} 
                                                alt={block.caption || 'Bio content'} 
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
        </>
    );
};

export default MemberCard;
