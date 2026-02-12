'use client';

import { useAuthStore } from '../store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Bell, Search } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push('/login');
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between px-8 ml-64 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">{dateStr}</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0) || '?'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-800">{user?.name || '사용자'}</p>
            <p className="text-xs text-gray-400">{user?.role === 'SUPER_ADMIN' ? '최고관리자' : user?.role === 'ADMIN' ? '관리자' : '사용자'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
