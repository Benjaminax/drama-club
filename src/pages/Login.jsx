import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                navigate('/admin');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred during login. Is the server running?');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-stone-900 border border-amber-900/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-900/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex justify-center mb-8">
                        <div className="w-14 h-14 bg-stone-800 border border-amber-900/50 rounded-2xl flex items-center justify-center shadow-inner">
                            <Lock className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-serif text-amber-100 text-center mb-2">Admin Portal</h1>
                    <p className="text-amber-100/50 text-sm text-center mb-8 font-light">Enter your credentials to manage content.</p>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest text-amber-100/40 uppercase mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-stone-950/80 border border-amber-900/30 rounded-lg px-4 py-3 text-sm text-amber-50 focus:outline-none focus:border-yellow-600/50 transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold tracking-widest text-amber-100/40 uppercase mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-stone-950/80 border border-amber-900/30 rounded-lg px-4 py-3 text-sm text-amber-50 focus:outline-none focus:border-yellow-600/50 transition-colors"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-lg text-red-300 text-xs font-medium text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 mt-2 bg-linear-to-r from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 text-stone-950 text-sm font-bold tracking-widest uppercase rounded-xl transition-all shadow-[0_8px_24px_rgba(202,138,4,0.15)] hover:shadow-[0_12px_32px_rgba(202,138,4,0.25)] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Secure Sign In'}
                        </button>
                    </form>

                    <div className="mt-10 text-center text-[10px] uppercase font-bold tracking-widest text-amber-100/20">
                        &copy; {new Date().getFullYear()} Academic City AMD Club
                    </div>
                </div>
            </div>
        </div>
    );
}
