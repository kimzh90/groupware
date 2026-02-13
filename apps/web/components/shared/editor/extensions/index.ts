import type { Extensions } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import VariableExtension from './VariableExtension';
import type { EditorMode } from '../types';

interface ExtensionOptions {
    placeholder?: string;
}

/**
 * 모드에 따라 TipTap 익스텐션을 동적으로 구성합니다.
 *
 * - 공통: StarterKit, Placeholder, Underline, TextAlign, Image, Link, TextStyle, Color, Highlight
 * - approval: + Table 계열  (표 편집)
 * - admin:   + Table 계열 + VariableExtension (변수 삽입)
 */
export function getExtensions(
    mode: EditorMode,
    options: ExtensionOptions = {}
): Extensions {
    // 모든 모드에서 공통으로 사용되는 기본 익스텐션
    const baseExtensions: Extensions = [
        StarterKit.configure({
            heading: {
                levels: [1, 2, 3],
            },
        }),
        Placeholder.configure({
            placeholder: options.placeholder || '내용을 입력하세요...',
        }),
        Underline,
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        Image.configure({
            inline: true,
            allowBase64: true,
        }),
        Link.configure({
            openOnClick: false,
            autolink: true,
            HTMLAttributes: {
                class: 'editor-link',
            },
        }),
        TextStyle,
        Color.configure({
            types: [TextStyle.name],
        }),
        Highlight.configure({
            multicolor: true,
        }),
    ];

    // Table 관련 익스텐션 (approval, admin 모드)
    const tableExtensions: Extensions = [
        Table.configure({
            resizable: true,
            HTMLAttributes: {
                class: 'editor-table',
            },
        }),
        TableRow,
        TableHeader,
        TableCell,
    ];

    // 모드별 익스텐션 구성
    switch (mode) {
        case 'approval':
            return [...baseExtensions, ...tableExtensions];

        case 'admin':
            return [...baseExtensions, ...tableExtensions, VariableExtension];

        case 'basic':
        default:
            return baseExtensions;
    }
}
