export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="font-semibold text-gray-500 mb-2">대기 중인 결재</h2>
          <div className="text-3xl font-bold">5건</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="font-semibold text-gray-500 mb-2">공지사항</h2>
          <div className="text-3xl font-bold">12건</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="font-semibold text-gray-500 mb-2">부서 인원</h2>
          <div className="text-3xl font-bold">8명</div>
        </div>
      </div>
    </div>
  );
}
