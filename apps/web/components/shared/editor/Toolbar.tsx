'use client';

import React, { useCallback, useRef } from 'react';
import type { Editor } from '@tiptap/react';
import type { ToolbarProps } from './types';
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Link as LinkIcon,
    Image as ImageIcon,
    Heading1,
    Heading2,
    Heading3,
    Table as TableIcon,
    TableCellsMerge,
    Columns3,
    Rows3,
    Trash2,
    Variable,
    Highlighter,
    Palette,
    Undo,
    Redo,
    Minus,
    Quote,
    Code,
} from 'lucide-react';

/* ─────────────────────────── 타입 ─────────────────────────── */

interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
}

/* ────────────────────── 공통 버튼 컴포넌트 ────────────────────── */

function ToolbarButton({ onClick, isActive, disabled, title, children }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`
        p-1.5 rounded-lg transition-all duration-150 
        ${isActive
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                }
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
      `}
        >
            {children}
        </button>
    );
}

function Divider() {
    return <div className="w-px h-6 bg-gray-200 mx-1" />;
}

/* ────────────────────── 메인 툴바 컴포넌트 ────────────────────── */

/**
 * Toolbar — 에디터 모드에 따라 동적으로 구성되는 서식 툴바
 *
 * - basic:    기본 서식 (Bold, Italic 등) + 목록 + 링크/이미지
 * - approval: + 표 삽입·편집 버튼
 * - admin:    + 표 + 변수 삽입 버튼
 */
export default function Toolbar({ editor, mode, uploadHandler }: ToolbarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editor) return;

        try {
            let url: string;
            if (uploadHandler) {
                url = await uploadHandler(file);
            } else {
                // 기본 핸들러: Base64 인라인 삽입
                url = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });
            }
            editor.chain().focus().setImage({ src: url }).run();
        } catch (err) {
            console.error('이미지 업로드 실패:', err);
        }

        // 입력 초기화
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [editor, uploadHandler]);

    const handleLinkInsert = useCallback(() => {
        if (!editor) return;

        const previousUrl = editor.getAttributes('link').href || '';
        const url = window.prompt('링크 URL을 입력하세요:', previousUrl);

        if (url === null) return; // 취소

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    }, [editor]);

    const handleInsertVariable = useCallback(() => {
        if (!editor) return;
        const name = window.prompt('삽입할 변수명을 입력하세요 (예: applicant_name):');
        if (!name) return;
        (editor.chain().focus() as any).insertVariable(name).run();
    }, [editor]);

    const handleInsertTable = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }, [editor]);

    if (!editor) return null;

    const iconSize = 16;

    return (
        <div className="editor-toolbar flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-200 bg-gray-50/80 backdrop-blur-sm rounded-t-2xl">
            {/* ── 실행취소/다시실행 ── */}
            <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="실행 취소"
            >
                <Undo size={iconSize} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="다시 실행"
            >
                <Redo size={iconSize} />
            </ToolbarButton>

            <Divider />

            {/* ── 제목 ── */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                title="제목 1"
            >
                <Heading1 size={iconSize} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                title="제목 2"
            >
                <Heading2 size={iconSize} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive('heading', { level: 3 })}
                title="제목 3"
            >
                <Heading3 size={iconSize} />
            </ToolbarButton>

            <Divider />

            {/* ── 인라인 서식 ── */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="굵게"
            >
                <Bold size={iconSize} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="기울임"
            >
                <Italic size={iconSize} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
                title="밑줄"
            >
                <Underline size={iconSize} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
                title="취소선"
            >
                <Strikethrough size={iconSize} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                isActive={editor.isActive('highlight')}
                title="형광펜"
            >
                <Highlighter size={iconSize} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                isActive={editor.isActive('code')}
                title="인라인 코드"
            >
                <Code size={iconSize} />
            </ToolbarButton>

            <Divider />

            {/* ── 정렬 ── */}
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                isActive={editor.isActive({ textAlign: 'left' })}
                title="왼쪽 정렬"
            >
                <AlignLeft size={iconSize} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                isActive={editor.isActive({ textAlign: 'center' })}
                title="가운데 정렬"
            >
                <AlignCenter size={iconSize} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                isActive={editor.isActive({ textAlign: 'right' })}
                title="오른쪽 정렬"
            >
                <AlignRight size={iconSize} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                isActive={editor.isActive({ textAlign: 'justify' })}
                title="양쪽 정렬"
            >
                <AlignJustify size={iconSize} />
            </ToolbarButton>

            <Divider />

            {/* ── 목록 ── */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="글머리 기호"
            >
                <List size={iconSize} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="번호 목록"
            >
                <ListOrdered size={iconSize} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                title="인용구"
            >
                <Quote size={iconSize} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="구분선"
            >
                <Minus size={iconSize} />
            </ToolbarButton>

            <Divider />

            {/* ── 링크 & 이미지 ── */}
            <ToolbarButton
                onClick={handleLinkInsert}
                isActive={editor.isActive('link')}
                title="링크 삽입"
            >
                <LinkIcon size={iconSize} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => fileInputRef.current?.click()}
                title="이미지 업로드"
            >
                <ImageIcon size={iconSize} />
            </ToolbarButton>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />

            {/* ── 표 관련 (approval, admin 모드) ── */}
            {(mode === 'approval' || mode === 'admin') && (
                <>
                    <Divider />
                    <ToolbarButton onClick={handleInsertTable} title="표 삽입">
                        <TableIcon size={iconSize} />
                    </ToolbarButton>
                    {editor.isActive('table') && (
                        <>
                            <ToolbarButton
                                onClick={() => editor.chain().focus().addColumnAfter().run()}
                                title="열 추가"
                            >
                                <Columns3 size={iconSize} />
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => editor.chain().focus().addRowAfter().run()}
                                title="행 추가"
                            >
                                <Rows3 size={iconSize} />
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => editor.chain().focus().mergeCells().run()}
                                title="셀 병합"
                            >
                                <TableCellsMerge size={iconSize} />
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => editor.chain().focus().deleteTable().run()}
                                title="표 삭제"
                            >
                                <Trash2 size={iconSize} />
                            </ToolbarButton>
                        </>
                    )}
                </>
            )}

            {/* ── 변수 삽입 (admin 모드) ── */}
            {mode === 'admin' && (
                <>
                    <Divider />
                    <ToolbarButton onClick={handleInsertVariable} title="변수 삽입">
                        <Variable size={iconSize} />
                        <span className="ml-1 text-xs font-semibold hidden sm:inline">변수</span>
                    </ToolbarButton>
                </>
            )}
        </div>
    );
}
