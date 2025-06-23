import { ReactNode, createElement } from 'react';

const ALLOWED_TAGS = ['strong', 'b', 'i', 'em', 'span'];

export function parseSafeHtml(input: string): ReactNode {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${input}</div>`, 'text/html');
    const root = doc.body.firstChild;

    function walk(node: ChildNode, index: number): ReactNode {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement;
            const tag = el.tagName.toLowerCase();

            if (!ALLOWED_TAGS.includes(tag)) {
                return el.textContent;
            }

            const children = Array.from(el.childNodes).map((child, i) => walk(child, i));

            return createElement(tag, { key: index }, children);
        }

        return null;
    }

    if (!root) return input;

    return Array.from(root.childNodes).map((node, index) => walk(node, index));
}