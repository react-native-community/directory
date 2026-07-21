import { type ShikiTransformer } from '@shikijs/types';
import { type Theme, useShikiHighlighter } from 'react-shiki';

import { SHIKI_OPTS } from '~/util/shiki';
import tw from '~/util/tailwind';

type Props = {
  code: string;
  lang: string;
  theme: Theme;
};

export default function CodeBrowserContentHighlighter({ code, lang, theme }: Props) {
  const highlighter = useShikiHighlighter(code, lang, theme, {
    showLineNumbers: true,
    transformers: [linkifyUrlsTransformer],
    ...SHIKI_OPTS,
  });

  if (!highlighter) {
    return (
      <pre className="shiki">
        <code style={tw`flex pl-[29px]`}>{code}</code>
      </pre>
    );
  }

  return highlighter;
}

const URL_RE = /https?:\/\/\S+/g;
const TRAILING_PUNCTUATION_RE = /[).]+$/;

export const linkifyUrlsTransformer: ShikiTransformer = {
  name: 'linkify-comment-urls',
  span(node) {
    const content = node.children?.[0];
    if (content?.type !== 'text') {
      return;
    }

    const text = content.value;
    if (!text.includes('http://') && !text.includes('https://')) {
      return;
    }

    const matches = Array.from(text.matchAll(URL_RE));
    if (matches.length === 0) {
      return;
    }

    const children: typeof node.children = [];
    let lastIndex = 0;

    for (const match of matches) {
      const fullMatch = match[0];
      const index = match.index ?? 0;

      const trailing = fullMatch.match(TRAILING_PUNCTUATION_RE)?.[0] ?? '';
      const url = trailing ? fullMatch.slice(0, -trailing.length) : fullMatch;

      if (index > lastIndex) {
        children.push({
          type: 'text',
          value: text.slice(lastIndex, index),
        });
      }

      children.push({
        type: 'element',
        tagName: 'a',
        properties: {
          href: url,
          target: '_blank',
          style: node.properties?.style ?? 'color:inherit',
          rel: 'noreferrer noopener',
        },
        children: [{ type: 'text', value: url }],
      });

      lastIndex = index + url.length;
    }

    if (lastIndex < text.length) {
      children.push({
        type: 'text',
        value: text.slice(lastIndex),
      });
    }

    node.children = children;
  },
};
