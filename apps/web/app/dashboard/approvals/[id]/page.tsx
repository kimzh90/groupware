'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { approvalsApi } from '../../../../lib/api/approvals';
import { useAuthStore } from '../../../../store/useAuthStore';
import {
    ArrowLeft,
    Clock,
    CheckCircle2,
    XCircle,
    User,
    MessageSquare,
    Send,
    FileText,
    Download
} from 'lucide-react';
import Link from 'next/link';

export default function ApprovalDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);
    const [comment, setComment] = useState('');

    const { data: doc, isLoading } = useQuery({
        queryKey: ['approvals', id],
        queryFn: () => approvalsApi.findOne(id),
    });

    const mutation = useMutation({
        mutationFn: ({ action, comment }: { action: 'APPROVE' | 'REJECT'; comment?: string }) =>
            approvalsApi.process(id, action, comment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['approvals'] });
            router.push('/dashboard/approvals');
        },
    });

    if (isLoading) return <div className="flex items-center justify-center h-64 text-gray-500">문서를 불러오는 중...</div>;
    if (!doc) return <div className="flex items-center justify-center h-64 text-gray-500">문서를 찾을 수 없습니다.</div>;

    const currentPendingLine = doc.lines.find(
        (line) => line.status === 'PENDING' && line.approver.name === user?.name
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-sm font-medium bg-green-100 text-green-800 tracking-wide"><CheckCircle2 size={14} /> 승인</span>;
            case 'REJECTED':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-sm font-medium bg-red-100 text-red-800 tracking-wide"><XCircle size={14} /> 반려</span>;
            case 'PENDING':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800 tracking-wide"><Clock size={14} /> 대기</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-1 rounded text-sm font-medium bg-gray-100 text-gray-800 tracking-wide">{status}</span>;
        }
    };

    return (
        <div className="px-6 pb-20">
            {/* 헤더 */}
            <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/dashboard/approvals" className="text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <nav className="text-sm breadcrumbs text-gray-500">
                        <span className="mx-2">/</span>
                        <Link href="/dashboard/approvals" className="hover:text-blue-600">전자결재</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium">{doc.id.slice(0, 8).toUpperCase()}</span>
                    </nav>
                </div>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-[#172B4D] mb-2">{doc.title}</h1>
                        <div className="flex items-center gap-3">
                            {getStatusBadge(doc.status)}
                            <span className="text-gray-500 text-sm">작성일: {new Date(doc.createdAt).toLocaleString('ko-KR')}</span>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                        <Download size={16} />
                        PDF 내보내기
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
                {/* 본문 내용 */}
                <div className="space-y-6">
                    <div className="bg-white p-12 rounded shadow-sm border border-gray-200 min-h-[600px] print:shadow-none">
                        <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
                            <div>
                                <div className="text-xs font-bold text-gray-500 tracking-widest mb-2">기안자</div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-[#172B4D]">{doc.requester.name}</div>
                                        <div className="text-xs text-gray-500">{doc.requester.department.name} · {doc.requester.position}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-bold text-gray-500 tracking-widest mb-2">문서 정보</div>
                                <div className="text-sm font-mono text-gray-500">문서번호: {doc.id.slice(0, 8)}</div>
                                <div className="text-sm text-gray-500">버전: 1.0</div>
                            </div>
                        </div>

                        <div
                            className="tiptap-editor max-w-none text-[#172B4D] leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: doc.content }}
                        />
                    </div>
                </div>

                {/* 사이드바 (결재 처리 & 결재선) */}
                <div className="space-y-6">
                    {/* 결재 처리 */}
                    {currentPendingLine && (
                        <div className="bg-white p-6 rounded shadow-sm border border-gray-200 border-l-4 border-l-blue-600">
                            <h3 className="text-sm font-bold text-[#172B4D] mb-4 flex items-center gap-2">
                                <MessageSquare size={16} className="text-blue-600" />
                                결재 처리가 필요합니다
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">의견 (선택사항)</label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="의견을 입력하세요..."
                                        rows={3}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => mutation.mutate({ action: 'APPROVE', comment })}
                                        disabled={mutation.isPending}
                                        className="flex-1 bg-[#0052CC] text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        승인
                                    </button>
                                    <button
                                        onClick={() => mutation.mutate({ action: 'REJECT', comment })}
                                        disabled={mutation.isPending}
                                        className="flex-1 bg-white text-red-600 border border-red-200 px-4 py-2 rounded text-sm font-medium hover:bg-red-50 transition-colors"
                                    >
                                        반려
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 결재선 */}
                    <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                        <h3 className="text-xs font-bold text-gray-500 tracking-widest mb-4">결재선</h3>
                        <div className="relative space-y-6 pl-2">
                            {/* 세로 연결선 */}
                            <div className="absolute left-[15px] top-3 bottom-3 w-px bg-gray-200 -z-0"></div>

                            {doc.lines.map((line) => (
                                <div key={line.id} className="relative z-10 flex items-start gap-4">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 bg-white ${line.status === 'APPROVED' ? 'border-green-500 text-green-500' :
                                        line.status === 'REJECTED' ? 'border-red-500 text-red-500' :
                                            line.status === 'PENDING' ? 'border-blue-500 text-blue-500' : 'border-gray-200 text-gray-300'
                                        }`}>
                                        {line.status === 'APPROVED' && <CheckCircle2 size={14} />}
                                        {line.status === 'REJECTED' && <XCircle size={14} />}
                                        {line.status === 'PENDING' && <Clock size={14} />}
                                        {line.status === 'WAITING' && <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-sm font-semibold text-[#172B4D]">{line.approver.name}</div>
                                                <div className="text-xs text-gray-500">{line.approver.department.name} · {line.approver.position}</div>
                                            </div>
                                            <div className="text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                                                {line.status === 'APPROVED' ? '승인' : line.status === 'REJECTED' ? '반려' : line.status === 'PENDING' ? '대기' : '대기중'}
                                            </div>
                                        </div>
                                        {line.comment && (
                                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 border border-gray-100 italic">
                                                &quot;{line.comment}&quot;
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
