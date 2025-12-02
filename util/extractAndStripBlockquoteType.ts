import { type ReactNode } from 'react';

const BLOCKQUOTE_TYPE_REGEX = /^\s*\[!([A-Z]+)]\s*/;

type ExtractResult = {
  children: ReactNode;
  type?: string;
};

export function extractAndStripBlockquoteType(children: ReactNode): ExtractResult {
  const { type, cleaned } = walk(children);
  return { children: cleaned, type: type?.toLowerCase() };
}

function walk(node: ReactNode): { type: string | null; cleaned: ReactNode } {
  if (node == null || typeof node === 'boolean' || typeof node === 'number') {
    return { type: null, cleaned: node };
  }

  if (typeof node === 'string') {
    const match = node.match(BLOCKQUOTE_TYPE_REGEX);
    if (match) {
      return { type: match[1], cleaned: node.replace(BLOCKQUOTE_TYPE_REGEX, '').trim() };
    }
    return { type: null, cleaned: node };
  }

  if (Array.isArray(node)) {
    let foundType: string | null = null;
    const out: ReactNode[] = [];
    for (const child of node) {
      const { type, cleaned } = walk(child);
      if (!foundType && type) {
        foundType = type;
      }
      if (cleaned !== null && cleaned !== undefined && cleaned !== false) {
        out.push(cleaned);
      }
    }
    return { type: foundType, cleaned: out };
  }

  if (typeof node === 'object') {
    const anyNode = node as any;
    const props = anyNode?.props;
    if (props && 'children' in props) {
      const { type, cleaned } = walk(props.children as ReactNode);

      const isEmpty = cleaned == null || (Array.isArray(cleaned) && cleaned.length === 0);

      if (isEmpty) {
        return { type, cleaned: null };
      }

      const cloned = {
        ...anyNode,
        props: {
          ...props,
          children: cleaned,
        },
      };
      return { type, cleaned: cloned };
    }
    return { type: null, cleaned: node };
  }

  return { type: null, cleaned: node };
}
