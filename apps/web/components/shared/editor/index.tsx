'use client';

import React, { useState, useCallback } from 'react';
import type { Editor } from '@tiptap/react';
import CoreEditor from './CoreEditor';
import Toolbar from './Toolbar';
import type { SharedEditorProps } from './types';

/**
 * SharedEditor — 모든 도메인에서 사용할 수 있는 GenericEditor 엔트리 포인트
 *
 * mode prop에 따라 툴바 버튼과 TipTap 익스텐션이 동적으로 로드됩니다.
 *
 * @example
 * // 결재 기안 (표 편집 가능)
 * <SharedEditor mode="approval" onChange={(html) => setContent(html)} />
 *
 * // 결재 양식 관리 (변수 삽입 가능)
 * <SharedEditor mode="admin" onChange={(html) => setTemplate(html)} />
 *
 * // 게시판 (기본 서식)
 * <SharedEditor mode="basic" onChange={(html) => setBody(html)} />
 */
export default function SharedEditor({
    initialContent,
    onChange,
    mode,
    uploadHandler,
    placeholder,
    readOnly = false,
}: SharedEditorProps) {
    const [editor, setEditor] = useState<Editor | null>(null);

    const handleEditorReady = useCallback((editorInstance: Editor) => {
        setEditor(editorInstance);
    }, []);

    return (
        <div className="shared-editor-root rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md focus-within:shadow-lg focus-within:border-blue-300">
            {/* 읽기 전용이 아닌 경우에만 툴바 표시 */}
            {!readOnly && (
                <Toolbar editor={editor} mode={mode} uploadHandler={uploadHandler} />
            )}

            {/* 에디터 본체 */}
            <CoreEditor
                mode={mode}
                initialContent={initialContent}
                placeholder={placeholder}
                readOnly={readOnly}
                onChange={onChange}
                onEditorReady={handleEditorReady}
            />
        </div>
    );
}

// Named exports for advanced usage
export { default as CoreEditor } from './CoreEditor';
export { default as Toolbar } from './Toolbar';
export { getExtensions } from './extensions';
export type { SharedEditorProps, EditorMode, ToolbarProps, CoreEditorProps } from './types';
