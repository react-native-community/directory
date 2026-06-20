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
