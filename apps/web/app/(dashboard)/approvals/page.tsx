'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { approvalsApi, ApprovalDoc } from '../../../lib/api/approvals';
import { Plus, FileText, Clock, CheckCircle2, XCircle, ChevronRight, Search, List } from 'lucide-react';
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
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">APPROVED</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">REJECTED</span>;
      case 'PENDING':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">PENDING</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#172B4D]">Approvals</h1>
          <p className="text-gray-500 mt-1">Manage your approval requests and documents.</p>
        </div>
        <Link
          href="/dashboard/approvals/new"
          className="flex items-center gap-2 bg-[#0052CC] text-white px-4 py-2 rounded-[3px] font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Create Request
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('TO_APPROVE')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'TO_APPROVE'
              ? 'border-[#0052CC] text-[#0052CC]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            To Approve
            {/* Optional Badge for count */}
          </button>
          <button
            onClick={() => setActiveTab('MY_DOCS')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'MY_DOCS'
              ? 'border-[#0052CC] text-[#0052CC]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            My Requests
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#FAFBFC]">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Requester</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-100 rounded w-16 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-100 rounded w-48 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-100 rounded w-24 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-100 rounded w-24 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="h-4 bg-gray-100 rounded w-8 animate-pulse ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : filteredApprovals?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Search size={32} className="mb-2 opacity-20" />
                    <p>No documents found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredApprovals?.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(doc.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/dashboard/approvals/${doc.id}`} className="text-sm font-medium text-[#0052CC] hover:underline">
                      {doc.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#172B4D]">{doc.requester.name}</div>
                    <div className="text-xs text-gray-500">{doc.requester.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/dashboard/approvals/${doc.id}`} className="text-gray-400 hover:text-[#0052CC]">
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
