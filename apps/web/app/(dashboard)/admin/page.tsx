export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-red-600">관리자 설정</h1>
      <p className="text-gray-600 mb-8">시스템 관리 권한이 있는 사용자만 접근할 수 있는 페이지입니다.</p>
      <div className="space-y-6">
        <section className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">사용자 관리</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            새 사용자 등록
          </button>
        </section>
      </div>
    </div>
  );
}
