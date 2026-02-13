'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { approvalTemplatesApi, ApprovalTemplate } from '@/lib/api/approval-templates';
import SharedEditor from '@/components/shared/editor';
import {
    ArrowLeft,
    Plus,
    Pencil,
    Trash2,
    FileText,
    Eye,
    EyeOff,
    Save,
    X,
    LayoutTemplate,
} from 'lucide-react';
import Link from 'next/link';
import { useToastStore } from '@/store/useToastStore';

type ViewMode = 'list' | 'create' | 'edit';

export default function ApprovalTemplatesPage() {
    const queryClient = useQueryClient();
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [editingTemplate, setEditingTemplate] = useState<ApprovalTemplate | null>(null);

    // 폼 상태
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');

    const { data: templates = [], isLoading } = useQuery({
        queryKey: ['approval-templates', 'admin'],
        queryFn: () => approvalTemplatesApi.findAll(true),
    });

    const createMutation = useMutation({
        mutationFn: (data: { name: string; description?: string; content: string }) => approvalTemplatesApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['approval-templates'] });
            resetForm();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => approvalTemplatesApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['approval-templates'] });
            resetForm();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => approvalTemplatesApi.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['approval-templates'] });
        },
    });

    const toggleActiveMutation = useMutation({
        mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
            approvalTemplatesApi.update(id, { isActive }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['approval-templates'] });
        },
    });

    const resetForm = () => {
        setViewMode('list');
        setEditingTemplate(null);
        setName('');
        setDescription('');
        setContent('');
    };

    const handleEdit = (template: ApprovalTemplate) => {
        setEditingTemplate(template);
        setName(template.name);
        setDescription(template.description || '');
        setContent(template.content);
        setViewMode('edit');
    };

    const handleSubmit = () => {
        const strippedContent = content.replace(/<[^>]*>/g, '').trim();
        if (!name.trim() || !strippedContent) {
            useToastStore.getState().warning('입력 확인', '양식 이름과 내용을 입력해주세요.');
            return;
        }

        if (viewMode === 'create') {
            createMutation.mutate({ name, description, content });
        } else if (viewMode === 'edit' && editingTemplate) {
            updateMutation.mutate({ id: editingTemplate.id, data: { name, description, content } });
        }
    };

    const handleDelete = (id: string) => {
        useToastStore.getState().showConfirm({
            title: '양식 삭제',
            message: '이 양식을 삭제하시겠습니까? 삭제된 양식은 복구할 수 없습니다.',
            confirmLabel: '삭제',
            variant: 'danger',
            onConfirm: () => {
                deleteMutation.mutate(id);
            },
        });
    };

    // ──── 양식 편집/생성 뷰 ────
    if (viewMode === 'create' || viewMode === 'edit') {
        return (
            <div className="px-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4">
                    <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                            {viewMode === 'create' ? '새 양식 만들기' : '양식 수정'}
                        </h1>
                        <p className="text-gray-500 mt-0.5 text-sm">
                            사용자가 결재 기안 시 사용할 양식 서식을 작성합니다.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                    {/* 에디터 영역 */}
                    <div className="bg-white rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-700 mb-1 block">양식 이름 <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="예: 휴가 신청서, 출장 보고서"
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-lg font-semibold"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700 mb-1 block">양식 설명 (선택)</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="이 양식의 용도를 설명해주세요"
                                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div className="p-4">
                            <SharedEditor
                                mode="admin"
                                initialContent={content}
                                onChange={(html) => setContent(html)}
                                placeholder="양식 내용을 작성하세요. 표, 서식, 변수({{변수명}})를 활용할 수 있습니다."
                            />
                        </div>
                    </div>

                    {/* 사이드바 */}
                    <div className="space-y-4">
                        <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 space-y-4 sticky top-8">
                            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <LayoutTemplate size={16} className="text-violet-500" />
                                양식 설정
                            </h3>

                            <div className="p-3 bg-violet-50/60 rounded-xl">
                                <p className="text-xs text-violet-700 leading-relaxed">
                                    <strong>팁:</strong> <code className="text-xs bg-violet-100 px-1 rounded">{'{{변수명}}'}</code> 형태로 변수를 삽입하면,
                                    사용자가 기안 시 해당 부분을 직접 입력하게 됩니다.
                                </p>
                            </div>

                            <div className="p-3 bg-blue-50/60 rounded-xl">
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    <strong>예시 변수:</strong> {'{{신청인}}'}, {'{{부서명}}'}, {'{{시작일}}'}, {'{{종료일}}'}, {'{{사유}}'}
                                </p>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={createMutation.isPending || updateMutation.isPending}
                                className="w-full bg-blue-600 text-white px-4 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                {viewMode === 'create' ? '양식 저장' : '수정 저장'}
                            </button>

                            <button
                                onClick={resetForm}
                                className="w-full bg-gray-100 text-gray-600 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                            >
                                <X size={16} />
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ──── 목록 뷰 ────
    return (
        <div className="px-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">결재 양식 관리</h1>
                        <p className="text-gray-500 mt-0.5 text-sm">사용자가 결재 기안 시 사용하는 양식 서식을 관리합니다.</p>
                    </div>
                </div>
                <button
                    onClick={() => setViewMode('create')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                    <Plus size={18} />
                    새 양식 추가
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64 text-gray-400">로딩 중...</div>
            ) : templates.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <LayoutTemplate size={48} className="mb-4 opacity-30" />
                    <p className="text-lg font-medium">등록된 양식이 없습니다</p>
                    <p className="text-sm mt-1">새 양식을 추가하여 시작하세요.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {templates.map((tpl) => (
                        <div
                            key={tpl.id}
                            className={`bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all group relative overflow-hidden ${!tpl.isActive ? 'opacity-60 border-gray-200' : 'border-gray-100'
                                }`}
                        >
                            {/* 상단 미리보기 */}
                            <div className="h-36 overflow-hidden border-b border-gray-100 bg-gray-50 px-5 pt-4 relative">
                                <div
                                    className="tiptap-editor text-[10px] leading-tight pointer-events-none scale-[0.7] origin-top-left"
                                    dangerouslySetInnerHTML={{ __html: tpl.content }}
                                    style={{ width: '142%' }}
                                />
                                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-gray-50 to-transparent" />

                                {!tpl.isActive && (
                                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-gray-200 text-gray-500 text-[10px] font-bold rounded-full uppercase">
                                        비활성
                                    </span>
                                )}
                            </div>

                            {/* 하단 정보 */}
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                            <FileText size={16} className="text-blue-500" />
                                            {tpl.name}
                                        </h3>
                                        {tpl.description && (
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{tpl.description}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="text-[10px] text-gray-400 mb-4">
                                    생성: {tpl.creator.name} · {new Date(tpl.createdAt).toLocaleDateString()}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(tpl)}
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <Pencil size={13} />
                                        수정
                                    </button>
                                    <button
                                        onClick={() => toggleActiveMutation.mutate({ id: tpl.id, isActive: !tpl.isActive })}
                                        className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${tpl.isActive
                                            ? 'text-orange-600 bg-orange-50 hover:bg-orange-100'
                                            : 'text-green-600 bg-green-50 hover:bg-green-100'
                                            }`}
                                    >
                                        {tpl.isActive ? <EyeOff size={13} /> : <Eye size={13} />}
                                        {tpl.isActive ? '비활성' : '활성'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tpl.id)}
                                        className="flex items-center justify-center p-2 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
