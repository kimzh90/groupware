'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { postsApi } from '../../../../../lib/api/boards';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

export default function NewPostPage({ params }: { params: Promise<{ boardId: string }> }) {
    const { boardId } = use(params);
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setLoading(true);
        try {
            await postsApi.create({ title, content, boardId });
            router.push(`/dashboard/boards/${boardId}`);
        } catch (err) {
            alert('게시물 작성에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-3">
                <Link href={`/dashboard/boards/${boardId}`} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">새 글 작성</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 입력하세요"
                        rows={12}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all resize-none"
                        required
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <Link
                        href={`/dashboard/boards/${boardId}`}
                        className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        취소
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-md shadow-blue-200"
                    >
                        <Send size={16} />
                        {loading ? '등록 중...' : '등록'}
                    </button>
                </div>
            </form>
        </div>
    );
}
