'use client';

import { useAuthStore } from '../store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push('/login');
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-8 ml-64">
      <div className="text-gray-500">환영합니다, <span className="font-semibold text-gray-900">{user?.name || '사용자'}</span>님</div>
      <button
        onClick={handleLogout}
        className="text-sm text-red-600 hover:underline"
      >
        로그아웃
      </button>
    </header>
  );
}
