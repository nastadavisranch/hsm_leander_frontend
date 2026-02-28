import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck } from 'lucide-react';
import { authApi } from '../../api/api';

export default function Login() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { token } = await authApi.login(password);
      sessionStorage.setItem('admin-token', token);
      navigate('/admin/dashboard');
    } catch {
      setError('Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1d33] p-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-[#0a1628] border border-[#d4af37]/40 rounded-xl p-8 shadow-2xl"
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center">
          <ShieldCheck className="text-[#d4af37]" size={24} />
        </div>

        <h1 className="text-2xl font-bold text-[#d4af37] text-center mb-6">
          Admin Access
        </h1>

        <div className="relative mb-4">
          <Lock
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]/70"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-10 pr-3 py-3 bg-[#0f1d33] border border-[#d4af37]/40 rounded text-white focus:outline-none focus:border-[#d4af37]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#d4af37] text-[#0a1628] font-bold py-3 rounded hover:bg-[#e6c158] transition-colors disabled:opacity-60"
        >
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}
