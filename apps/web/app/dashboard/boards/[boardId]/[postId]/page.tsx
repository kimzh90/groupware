'use client';

import { useQuery } from '@tanstack/react-query';
import { postsApi } from '../../../../../lib/api/boards';
import { useAuthStore } from '../../../../../store/useAuthStore';
import { ArrowLeft, Eye, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

export default function PostDetailPage({ params }: { params: Promise<{ boardId: string; postId: string }> }) {
    const { boardId, postId } = use(params);

    const { data: post, isLoading } = useQuery({
        queryKey: ['posts', postId],
        queryFn: () => postsApi.findOne(postId),
        enabled: useAuthStore.getState()._hasHydrated && !!useAuthStore.getState().accessToken,
    });

    if (isLoading) {
        return (
            <div className="space-y-6 max-w-3xl">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-100 rounded w-48 mb-4"></div>
                    <div className="bg-white rounded-2xl p-6 space-y-4">
                        <div className="h-6 bg-gray-100 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-100 rounded w-1/4 mb-6"></div>
                        <div className="space-y-2">
                            {Array(5).fill(0).map((_, i) => (<div key={i} className="h-4 bg-gray-100 rounded"></div>))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-3">
                <Link href={`/dashboard/boards/${boardId}`} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-lg font-semibold text-gray-500">{post?.board?.name || '게시판'}</h1>
            </div>

            <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">{post?.title}</h2>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <User size={14} />
                            {post?.author?.name} ({post?.author?.position})
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {post?.createdAt ? new Date(post.createdAt).toLocaleDateString('ko-KR') : ''}
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye size={14} />
                            조회 {post?.views || 0}
                        </span>
                    </div>
                </div>
                <div className="p-6">
                    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {post?.content}
                    </div>
                </div>
            </article>

            <div className="flex justify-end">
                <Link
                    href={`/dashboard/boards/${boardId}`}
                    className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    목록으로
                </Link>
            </div>
        </div>
    );
}
