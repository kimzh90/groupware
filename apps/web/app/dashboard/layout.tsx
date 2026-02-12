import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <main className="ml-64 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
