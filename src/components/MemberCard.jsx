import { User } from 'lucide-react'

const MemberCard = ({ member }) => {
    return (
        <div
            className="bg-stone-900/40 backdrop-blur-md rounded-2xl p-7 text-center hover:bg-stone-900/60 transition-all border border-amber-900/20 shadow-xl card-hover group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all duration-500" />
            <div className="relative z-10">
                <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-linear-to-br from-amber-700 to-yellow-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-400 border-4 border-amber-900/30 group-hover:border-amber-600/50 shadow-lg group-hover:shadow-amber-500/25">
                    <User className="w-14 h-14 text-stone-900" strokeWidth={1.5} />
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
                <div className="mt-5 h-px w-0 group-hover:w-3/4 bg-linear-to-r from-yellow-600 to-transparent transition-all duration-500 mx-auto" />
            </div>
        </div>
    );
};

export default MemberCard;
