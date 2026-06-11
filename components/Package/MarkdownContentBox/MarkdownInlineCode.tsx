import { useEffect, useState } from 'react';
import { type Highlighter } from 'shiki';

import { inlineHighlighterInstance } from '~/util/shiki';

type Props = {
  code: string;
  theme: string;
};

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
