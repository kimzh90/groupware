import type { Editor } from '@tiptap/react';

/**
 * Template Processor — 에디터 외부에서 {{variable}}을 실제 데이터로 치환
 *
 * 에디터 본체는 렌더링에만 집중하고, 
 * 변수 치환 로직은 이 유틸리티에서 처리합니다.
 */

/**
 * HTML 문자열 내의 모든 {{variable}} 패턴을 실제 값으로 치환합니다.
 *
 * @param html - 원본 HTML (변수 포함)
 * @param variables - { key: value } 형태의 변수 맵
 * @returns 변수가 치환된 HTML 문자열
 *
 * @example
 * const result = processTemplate(
 *   '<p>{{applicant_name}}님의 {{document_type}} 요청</p>',
 *   { applicant_name: '홍길동', document_type: '휴가' }
 * );
 * // => '<p>홍길동님의 휴가 요청</p>'
 */
export function processTemplate(
    html: string,
    variables: Record<string, string>
): string {
    return html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return variables[key] ?? match; // 일치하지 않는 변수는 원본 유지
    });
}

/**
 * data-variable 속성을 가진 <span> 태그의 변수도 함께 치환합니다.
 * TipTap VariableExtension이 생성하는 DOM 구조를 대상으로 합니다.
 *
 * @param html - 원본 HTML
 * @param variables - { key: value } 형태의 변수 맵
 * @returns 변수가 치환된 HTML 문자열
 */
export function processTemplateWithNodes(
    html: string,
    variables: Record<string, string>
): string {
    // 1) 일반 {{...}} 패턴 치환
    let result = processTemplate(html, variables);

    // 2) data-variable 속성을 가진 span 태그 치환
    result = result.replace(
        /<span[^>]*data-variable="([^"]*)"[^>]*>[^<]*<\/span>/g,
        (match, key) => {
            return variables[key] ?? match;
        }
    );

    return result;
}

/**
 * 에디터에 양식 데이터(JSON)를 로드합니다.
 * 관리자가 만든 양식 데이터를 불러와서 사용자가 편집할 수 있게 합니다.
 *
 * @param editor - TipTap Editor 인스턴스
 * @param content - 에디터에 설정할 콘텐츠 (JSON 또는 HTML 문자열)
 * @param emitUpdate - true일 경우 onUpdate 콜백을 트리거합니다
 */
export function loadTemplate(
    editor: Editor | null,
    content: Record<string, any> | string,
    emitUpdate = false
): void {
    if (!editor) {
        console.warn('[editor-utils] 에디터 인스턴스가 없습니다.');
        return;
    }

    editor.commands.setContent(content, { emitUpdate });
}

/**
 * 에디터의 현재 콘텐츠를 JSON 형태로 직렬화합니다.
 * 양식 저장 시 사용합니다.
 */
export function serializeContent(editor: Editor | null): Record<string, any> | null {
    if (!editor) return null;
    return editor.getJSON();
}

/**
 * HTML에서 모든 변수 키를 추출합니다.
 * 
 * @param html - 변수가 포함된 HTML 문자열
 * @returns 고유한 변수 키 배열
 *
 * @example
 * extractVariables('<p>{{name}}님의 {{type}}</p>')
 * // => ['name', 'type']
 */
export function extractVariables(html: string): string[] {
    const regex = /\{\{(\w+)\}\}/g;
    const keys = new Set<string>();
    let match: RegExpExecArray | null;
    while ((match = regex.exec(html)) !== null) {
        keys.add(match[1]);
    }
    return Array.from(keys);
}
