import { useShikiHighlighter } from 'react-shiki';

import { Button } from '~/components/Button';
import { Copy } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';
import tw from '~/util/tailwind';

type Props = {
  code: string;
  lang: string;
};

export default function ReadmeCodeBlock({ code, lang }: Props) {
  const highlighter = useShikiHighlighter(
    code,
    lang,
    tw.prefixMatch('dark') ? 'github-dark-default' : 'github-light-default',
    {
      langAlias: { gradle: 'groovy' },
    }
  );

  const copyButton = (
    <Tooltip
      sideOffset={2}
      trigger={
        <Button
          containerStyle={tw`absolute top-3 right-3`}
          style={tw`bg-transparent`}
          onPress={async () => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              await navigator.clipboard.writeText(code);
            }
          }}>
          <Copy width={20} height={20} style={tw`text-palette-gray4 dark:text-pewter`} />
        </Button>
      }>
      Copy code
    </Tooltip>
  );

  if (!highlighter) {
    return (
      <div style={tw`relative mt-2`} className="readme-code-block">
        <pre className="shiki">
          <code>{code}</code>
        </pre>
        {copyButton}
      </div>
    );
  }

  return (
    <div style={tw`relative mt-2`} className="readme-code-block">
      {highlighter}
      {copyButton}
    </div>
  );
}
