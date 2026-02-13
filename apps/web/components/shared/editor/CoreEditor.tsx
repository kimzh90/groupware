'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { getExtensions } from './extensions';
import type { CoreEditorProps } from './types';

/**
 * CoreEditor — TipTap의 useEditor 설정과 에디터 본체만 포함하는 순수 엔진 컴포넌트
 *
 * 이 컴포넌트는 UI(툴바)를 포함하지 않으며, 에디터 인스턴스의 생성과 콘텐츠
 * 동기화에만 집중합니다. 툴바는 별도 Toolbar 컴포넌트에서 처리합니다.
 */
export default function CoreEditor({
    mode,
    initialContent,
    placeholder,
    readOnly = false,
    onChange,
    onEditorReady,
}: CoreEditorProps) {
    const editor = useEditor({
        extensions: getExtensions(mode, { placeholder }),
        content: initialContent || '',
        editable: !readOnly,
        immediatelyRender: false, // SSR (Next.js) 호환
        onUpdate: ({ editor }) => {
            if (onChange) {
                onChange(editor.getHTML(), editor.getJSON());
            }
        },
        editorProps: {
            attributes: {
                class: 'tiptap-editor prose prose-sm max-w-none focus:outline-none',
            },
        },
    });

    // 에디터 인스턴스가 준비되면 부모에 알림
    useEffect(() => {
        if (editor && onEditorReady) {
            onEditorReady(editor);
        }
    }, [editor, onEditorReady]);

    // readOnly prop이 변경되면 에디터에 반영
    useEffect(() => {
        if (editor) {
            editor.setEditable(!readOnly);
        }
    }, [editor, readOnly]);

    return (
        <div className="tiptap-editor-wrapper">
            <EditorContent editor={editor} />
        </div>
    );
}

// editor 인스턴스 접근을 위한 래퍼
export { CoreEditor };
