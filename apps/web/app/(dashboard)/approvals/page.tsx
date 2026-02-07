export default function ApprovalsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">전자결재</h1>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold">제목</th>
              <th className="p-4 font-semibold">기안자</th>
              <th className="p-4 font-semibold">날짜</th>
              <th className="p-4 font-semibold">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="p-4">2024년 하반기 휴가 신청</td>
              <td className="p-4">김개발</td>
              <td className="p-4">2024-10-25</td>
              <td className="p-4">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">대기중</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
