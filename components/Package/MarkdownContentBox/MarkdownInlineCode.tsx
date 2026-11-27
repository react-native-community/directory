import { type ReactNode, useEffect, useState } from 'react';
import { type Highlighter } from 'shiki';

import { inlineHighlighterInstance } from '~/util/shiki';

type Props = {
  code: ReactNode;
  theme: string;
};

/**
 * Members are tokenized as labels or ternaries, highlight them instead
 */
const MEMBER_REGEX = /^[A-Za-z_$][\w$]*(?:\?(?=[:(<]|$)|:\s)/;

export default function MarkdownInlineCode({ code, theme }: Props) {
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null);

  useEffect(() => {
    void inlineHighlighterInstance.then(setHighlighter);
  }, []);

  if (!highlighter || typeof code !== 'string') {
    return <code>{code}</code>;
  }

  const tokens = highlighter.codeToTokens(code, {
    lang: 'tsx',
    theme,
    grammarContextCode: MEMBER_REGEX.test(code) ? 'type _ = {' : undefined,
  });

  const line = tokens.tokens[0] ?? [];

  return (
    <code>
      {line.map(token => (
        <span key={`${token.offset}`} style={{ color: token.color }}>
          {token.content}
        </span>
      ))}
    </code>
  );
}
