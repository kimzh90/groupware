'use client';

import Link from 'next/link';
import { LayoutDashboard, FileText, Settings, LogOut, Monitor } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';

export default function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  const menuItems = [
    { href: '/dashboard', label: '대시보드', icon: LayoutDashboard },
    { href: '/dashboard/approvals', label: '전자결재', icon: FileText },
    { href: '/admin', label: '모니터링', icon: Monitor },
    { href: '/dashboard/admin', label: '관리자 설정', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#FAFBFC] border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 h-16 flex items-center border-b border-gray-200">
        <div className="flex items-center gap-2 text-blue-700 font-bold text-xl">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">G</div>
          <span>Groupware</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const active = isActive(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${active
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
