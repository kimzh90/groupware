import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0">
      <div className="p-6 text-2xl font-bold border-b border-gray-800">
        Groupware
      </div>
      <nav className="p-4 space-y-2">
        <Link href="/dashboard" className="block p-3 hover:bg-gray-800 rounded">
          대시보드
        </Link>
        <Link href="/dashboard/approvals" className="block p-3 hover:bg-gray-800 rounded">
          전자결재
        </Link>
        <Link href="/dashboard/admin" className="block p-3 hover:bg-gray-800 rounded">
          관리자 설정
        </Link>
      </nav>
    </aside>
  );
}
