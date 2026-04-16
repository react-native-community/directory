import { type Theme, useShikiHighlighter } from 'react-shiki';

import { SHIKI_OPTS } from '~/util/shiki';

type Props = {
  code: string;
  lang: string;
  theme: Theme;
};

export default function CodeBrowserContentHighlighter({ code, lang, theme }: Props) {
  const highlighter = useShikiHighlighter(code, lang, theme, SHIKI_OPTS);

  if (!highlighter) {
    return (
      <pre className="shiki">
        <code>{code}</code>
      </pre>
    );
  }

  return highlighter;
}
