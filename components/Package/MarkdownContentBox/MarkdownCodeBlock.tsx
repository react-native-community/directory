import { type Theme, useShikiHighlighter } from 'react-shiki';

import CopyButton from '~/components/Package/CopyButton';
import { SHIKI_OPTS } from '~/util/shiki';
import { cx } from '~/util/tailwind';

type Props = {
  code: string;
  lang: string;
  theme: Theme;
};

export default function MarkdownCodeBlock({ code, theme, lang }: Props) {
  const highlighter = useShikiHighlighter(code, lang, theme, SHIKI_OPTS);

  const copyButton = <CopyButton data={code} tooltip="Copy code" label="Copy code to clipboard" />;

  if (!highlighter) {
    return (
      <div className={cx('readme-code-block', 'relative mt-2')}>
        <pre className="shiki">
          <code>{code}</code>
        </pre>
        {copyButton}
      </div>
    );
  }

  return (
    <div className={cx('readme-code-block', 'relative mt-2')}>
      {highlighter}
      {copyButton}
    </div>
  );
}
