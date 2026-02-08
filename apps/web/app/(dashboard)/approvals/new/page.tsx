'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approvalsApi } from '../../../../lib/api/approvals';
import OrgChartModal from '../../../../components/OrgChartModal';
import { UserPlus, Send, ArrowLeft, Trash2, FileText, Info } from 'lucide-react';
import Link from 'next/link';

export default function NewApprovalPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedApprovers, setSelectedApprovers] = useState<Array<{ id: string; name: string; position: string }>>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const mutation = useMutation({
        mutationFn: (data: { title: string; content: string; approverIds: string[] }) => approvalsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['approvals'] });
            router.push('/dashboard/approvals');
        },
        onError: (error: any) => {
            alert(error.message || '요청 중 오류가 발생했습니다.');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content || selectedApprovers.length === 0) {
            alert('제목, 내용 및 결재자를 모두 입력해주세요.');
            return;
        }
        mutation.mutate({
            title,
            content,
            approverIds: selectedApprovers.map(a => a.id),
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/approvals" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">새 결재 기안</h1>
                    <p className="text-gray-500 mt-1">새로운 결재 문서를 작성합니다.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">문서 제목</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="제목을 입력하세요"
                                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-lg font-medium"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">상세 내용</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="결재 내용을 상세히 기술해주세요"
                                rows={12}
                                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none font-medium"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar for Approvers */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 space-y-6 sticky top-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <FileText size={20} className="text-blue-500" />
                                결재선 구성
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-all"
                                title="결재자 추가"
                            >
                                <UserPlus size={20} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {selectedApprovers.length > 0 ? (
                                selectedApprovers.map((u, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-blue-50">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm">{u.name}</div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{u.position}</div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedApprovers(prev => prev.filter((_, i) => i !== index))}
                                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div
                                    onClick={() => setIsModalOpen(true)}
                                    className="h-32 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer group"
                                >
                                    <UserPlus size={32} className="mb-2 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                    <p className="text-sm font-medium">결재자를 추가하세요</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-blue-50/50 rounded-2xl flex gap-3">
                            <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-blue-700 leading-relaxed">
                                결재 순서는 상단부터 아래로 진행됩니다. 최소 한 명 이상의 결재자가 필요합니다.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={mutation.isPending || selectedApprovers.length === 0}
                            className="w-full bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 transition-all flex items-center justify-center gap-3"
                        >
                            {mutation.isPending ? '처리 중...' : (
                                <>
                                    기안하기
                                    <Send size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            <OrgChartModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={setSelectedApprovers}
                initialSelected={selectedApprovers}
            />
        </div>
    );
}
