'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';
import {
  Home,
  FileText,
  MessageSquare,
  Network,
  Clock,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const isActive = (path: string) =>
    pathname === path || (path !== '/dashboard' && pathname.startsWith(`${path}/`));

  const menuItems = [
    { href: '/dashboard', label: '홈', icon: Home },
    { href: '/dashboard/approvals', label: '전자결재', icon: FileText },
    { href: '/dashboard/boards', label: '게시판', icon: MessageSquare },
    { href: '/dashboard/organization', label: '조직도', icon: Network },
    { href: '/dashboard/attendance', label: '근태관리', icon: Clock },
  ];

  const adminItems = [
    { href: '/dashboard/admin', label: '관리자 설정', icon: Settings },
  ];

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  const handleLogout = () => {
    logout();
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col shadow-sm">
      {/* 로고 */}
      <div className="p-5 h-16 flex items-center border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
            G
          </div>
          <span className="font-bold text-xl text-gray-800">그룹웨어</span>
        </Link>
      </div>

      {/* 메인 메뉴 */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">메뉴</p>
        {menuItems.map((item) => {
          const active = isActive(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}

        {/* 관리자 메뉴 */}
        {isAdmin && (
          <>
            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Shield size={12} />
                관리자
              </p>
            </div>
            {adminItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                  {item.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* 사용자 정보 & 로그아웃 */}
      <div className="p-3 border-t border-gray-100">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-gray-800 truncate">{user?.name || '사용자'}</p>
          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut size={18} />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
