'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/useAuthStore';
import apiClient from '../../../lib/api-client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response: any = await apiClient.post('/auth/login', { email, password });

      if (response.success) {
        const { user, access_token, refresh_token } = response.data;
        setAuth(user, access_token, refresh_token);
        document.cookie = `token=${access_token}; path=/; max-age=3600; SameSite=Lax`;
        document.cookie = `role=${user.role}; path=/; max-age=3600; SameSite=Lax`;
        router.push('/dashboard');
      }
    } catch (error) {
      alert('로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F7] p-4">
      <div className="mb-8 text-center">
        <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
          G
        </div>
        <h1 className="text-3xl font-bold text-[#172B4D]">Groupware</h1>
        <p className="text-gray-500 mt-2">Enterprise Collaboration Platform</p>
      </div>

      <div className="bg-white p-8 rounded-sm shadow-md w-full max-w-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-6 text-center text-[#5E6C84]">Log in to your account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email or ID</label>
            <input
              type="text"
              placeholder="Enter your email or ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-gray-100 bg-[#FAFBFC] rounded p-2.5 text-sm focus:bg-white focus:border-blue-500 focus:ring-0 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-gray-100 bg-[#FAFBFC] rounded p-2.5 text-sm focus:bg-white focus:border-blue-500 focus:ring-0 transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0052CC] text-white py-2.5 rounded hover:bg-blue-700 disabled:bg-blue-300 font-medium transition-colors shadow-sm"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
          <p>Contact IT support if you have trouble logging in.</p>
        </div>
      </div>
    </div>
  );
}
