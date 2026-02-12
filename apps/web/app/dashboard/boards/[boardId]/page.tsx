'use client';

import { useQuery } from '@tanstack/react-query';
import { boardsApi, postsApi } from '../../../../lib/api/boards';
import { useAuthStore } from '../../../../store/useAuthStore';
import { Plus, ChevronRight, ArrowLeft, Search, Eye } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

export default function BoardDetailPage({ params }: { params: Promise<{ boardId: string }> }) {
    const { boardId } = use(params);

    const { data: board } = useQuery({
        queryKey: ['boards', boardId],
        queryFn: () => boardsApi.findOne(boardId),
        enabled: useAuthStore.getState()._hasHydrated && !!useAuthStore.getState().accessToken,
    });

    const { data: postsData, isLoading } = useQuery({
        queryKey: ['posts', boardId],
        queryFn: () => postsApi.findByBoard(boardId),
        enabled: useAuthStore.getState()._hasHydrated && !!useAuthStore.getState().accessToken,
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/boards" className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{board?.name || '게시판'}</h1>
                        <p className="text-gray-500 mt-0.5 text-sm">총 {postsData?.total || 0}개의 게시물</p>
                    </div>
                </div>
                <Link
                    href={`/dashboard/boards/${boardId}/new`}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-200"
                >
                    <Plus size={16} />
                    글쓰기
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase w-full">제목</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">작성자</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">작성일</th>
                            <th className="px-6 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">조회</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i}>
                                    {Array(4).fill(0).map((_, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <div className="h-4 bg-gray-100 rounded animate-pulse w-24"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : postsData?.posts?.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-16 text-center text-gray-400">
                                    <Search size={32} className="mx-auto mb-2 opacity-30" />
                                    <p>게시물이 없습니다. 첫 번째 글을 작성해보세요!</p>
                                </td>
                            </tr>
                        ) : (
                            postsData?.posts?.map((post: any) => (
                                <tr key={post.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <Link href={`/dashboard/boards/${boardId}/${post.id}`} className="text-sm font-medium text-gray-800 group-hover:text-blue-700 transition-colors">
                                            {post.title}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm text-gray-700">{post.author?.name}</p>
                                        <p className="text-xs text-gray-400">{post.author?.position}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                            <Eye size={12} />{post.views}
                                        </span>
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
