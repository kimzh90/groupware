'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { approvalsApi, ApprovalDoc } from '../../../lib/api/approvals';
import { Plus, FileText, Clock, CheckCircle2, XCircle, ChevronRight, Search } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '../../../store/useAuthStore';

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState<'TO_APPROVE' | 'MY_DOCS'>('TO_APPROVE');
  const user = useAuthStore((state) => state.user);

  const { data: approvals, isLoading } = useQuery({
    queryKey: ['approvals'],
    queryFn: approvalsApi.findAll,
  });

  const filteredApprovals = approvals?.filter((doc) => {
    if (activeTab === 'TO_APPROVE') {
      return doc.lines.some(
        (line) => line.status === 'PENDING' && line.approver.name === user?.name
      );
    } else {
      return doc.requester.name === user?.name;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"><CheckCircle2 size={12} />승인</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700"><XCircle size={12} />반려</span>;
      case 'PENDING':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700"><Clock size={12} />대기</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">전자결재</h1>
          <p className="text-gray-500 mt-1">결재 요청을 관리하고 처리합니다.</p>
        </div>
        <Link
          href="/dashboard/approvals/new"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-200"
        >
          <Plus size={16} />
          결재 요청
        </Link>
      </div>

      {/* 탭 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('TO_APPROVE')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'TO_APPROVE'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            결재 대기
          </button>
          <button
            onClick={() => setActiveTab('MY_DOCS')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'MY_DOCS'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            내 결재 문서
          </button>
        </nav>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">상태</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">제목</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">요청자</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">작성일</th>
              <th className="relative px-6 py-3.5"><span className="sr-only">보기</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <tr key={i}>
                  {Array(5).fill(0).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-20"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredApprovals?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-gray-400">
                  <Search size={32} className="mx-auto mb-2 opacity-30" />
                  <p>결재 문서가 없습니다.</p>
                </td>
              </tr>
            ) : (
              filteredApprovals?.map((doc) => (
                <tr key={doc.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(doc.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/dashboard/approvals/${doc.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                      {doc.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">{doc.requester.name}</div>
                    <div className="text-xs text-gray-400">{doc.requester.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(doc.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link href={`/dashboard/approvals/${doc.id}`} className="text-gray-400 hover:text-blue-600">
                      <ChevronRight size={18} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
