import { useShikiHighlighter } from 'react-shiki';

type Props = {
  code: string;
  lang: string;
  isDark: boolean;
};

export default function ReadmeCodeBlock({ code, lang, isDark }: Props) {
  const highlighter = useShikiHighlighter(
    code,
    lang,
    isDark ? 'github-dark-default' : 'github-light-default',
    {
      langAlias: { gradle: 'groovy' },
    }
  );

  if (!highlighter) {
    return (
      <pre className="shiki">
        <code>{code}</code>
      </pre>
    );
  }

  return highlighter;
}
