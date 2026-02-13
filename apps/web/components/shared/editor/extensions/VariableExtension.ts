import { Node, mergeAttributes } from '@tiptap/core';

export interface VariableOptions {
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        variable: {
            /**
             * 변수 노드를 현재 커서 위치에 삽입합니다.
             * @param name 변수 이름 (예: applicant_name)
             */
            insertVariable: (name: string) => ReturnType;
        };
    }
}

/**
 * TipTap 커스텀 Node 익스텐션 — 변수(Variable)
 *
 * admin 모드에서 결재 양식에 {{변수명}} 형태의 치환 가능한 변수를 삽입합니다.
 * 에디터 내에서 시각적으로 구별되는 인라인 뱃지로 렌더링됩니다.
 */
const VariableExtension = Node.create<VariableOptions>({
    name: 'variable',

    group: 'inline',
    inline: true,
    atom: true, // 편집 불가한 단일 단위 노드

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            name: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-variable'),
                renderHTML: (attributes) => ({
                    'data-variable': attributes.name,
                }),
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-variable]',
            },
        ];
    },

    renderHTML({ node, HTMLAttributes }) {
        return [
            'span',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                class: 'editor-variable',
                contenteditable: 'false',
            }),
            `{{${node.attrs.name}}}`,
        ];
    },

    addCommands() {
        return {
            insertVariable:
                (name: string) =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: { name },
                        });
                    },
        };
    },
});

export default VariableExtension;
