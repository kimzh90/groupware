import type { Editor } from '@tiptap/react';

/**
 * 에디터 모드 — 사용처에 따라 툴바 구성과 익스텐션이 달라집니다.
 *
 * - basic   : 게시판, 자유 문서함 등 기본 서식 편집
 * - approval: 전자결재 기안 — 표 편집 + 변수 치환 기능
 * - admin   : 결재 양식 관리 — 표 편집 + 변수 삽입 기능
 */
export type EditorMode = 'basic' | 'approval' | 'admin';

/**
 * SharedEditor 컴포넌트에 전달되는 Props
 */
export interface SharedEditorProps {
    /** 에디터 초기 콘텐츠 (HTML 문자열) */
    initialContent?: string;
    /** 콘텐츠 변경 콜백 — HTML과 JSON 두 가지 형식으로 전달 */
    onChange?: (html: string, json: any) => void;
    /** 에디터 모드 — 모드에 따라 툴바 구성과 익스텐션이 변경됩니다 */
    mode: EditorMode;
    /** 도메인별 이미지 업로드 핸들러 */
    uploadHandler?: (file: File) => Promise<string>;
    /** 플레이스홀더 텍스트 */
    placeholder?: string;
    /** 읽기 전용 여부 */
    readOnly?: boolean;
}

/**
 * 툴바 컴포넌트에 전달되는 Props
 */
export interface ToolbarProps {
    editor: Editor | null;
    mode: EditorMode;
    uploadHandler?: (file: File) => Promise<string>;
}

/**
 * CoreEditor 컴포넌트에 전달되는 Props
 */
export interface CoreEditorProps {
    mode: EditorMode;
    initialContent?: string;
    placeholder?: string;
    readOnly?: boolean;
    onChange?: (html: string, json: any) => void;
    onEditorReady?: (editor: Editor) => void;
}

/**
 * 변수 삽입에 사용되는 변수 데이터 타입
 */
export interface TemplateVariable {
    /** 변수 키 (예: applicant_name) */
    key: string;
    /** 변수 표시 이름 (예: 기안자 이름) */
    label: string;
    /** 기본값 */
    defaultValue?: string;
}
