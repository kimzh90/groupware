'use client';

import { useQuery } from '@tanstack/react-query';
import { boardsApi } from '../../../lib/api/boards';
import { useAuthStore } from '../../../store/useAuthStore';
import { MessageSquare, FileText, Megaphone, Building2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function BoardsPage() {
    const { data: boards, isLoading } = useQuery({
        queryKey: ['boards'],
        queryFn: boardsApi.findAll,
        enabled: useAuthStore.getState()._hasHydrated && !!useAuthStore.getState().accessToken,
    });

    const getBoardIcon = (type: string) => {
        switch (type) {
            case 'NOTICE':
                return <Megaphone size={24} className="text-red-500" />;
            case 'DEPARTMENT':
                return <Building2 size={24} className="text-green-500" />;
            default:
                return <MessageSquare size={24} className="text-blue-500" />;
        }
    };

    const getBoardTypeName = (type: string) => {
        switch (type) {
            case 'NOTICE': return '공지';
            case 'DEPARTMENT': return '부서';
            default: return '일반';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">게시판</h1>
                <p className="text-gray-500 mt-1">공지사항 및 자유게시판을 이용해보세요.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                            <div className="h-12 w-12 bg-gray-100 rounded-xl mb-4"></div>
                            <div className="h-5 bg-gray-100 rounded w-32 mb-2"></div>
                            <div className="h-4 bg-gray-100 rounded w-20"></div>
                        </div>
                    ))
                ) : boards?.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        등록된 게시판이 없습니다.
                    </div>
                ) : (
                    boards?.map((board: any) => (
                        <Link
                            key={board.id}
                            href={`/dashboard/boards/${board.id}`}
                            className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300"
                        >
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                                    {getBoardIcon(board.type)}
                                </div>
                                <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors mt-2" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                                {board.name}
                            </h3>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                                    {getBoardTypeName(board.type)}
                                </span>
                                <span className="text-xs text-gray-400">
                                    게시물 {board._count?.posts || 0}건
                                </span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
