import { type ShikiTransformer } from '@shikijs/types';
import { View } from 'react-native';
import { type Theme, useShikiHighlighter } from 'react-shiki';

import { Label } from '~/common/styleguide';
import rndDark from '~/styles/shiki/rnd-dark.json';
import rndLight from '~/styles/shiki/rnd-light.json';
import { type DiffLine } from '~/types';
import { SHIKI_OPTS } from '~/util/shiki';
import { cx, useIsDark } from '~/util/tailwind';

type Props = {
  line: DiffLine;
  lang: string;
  showLineNumbers: boolean;
  wordWrap: boolean;
};

export function CodeBrowserDiffLine({ line, lang, showLineNumbers, wordWrap }: Props) {
  const isDark = useIsDark();
  const theme = (isDark ? rndDark : rndLight) as Theme;
  const highlighter = useShikiHighlighter(line.text || ' ', lang, theme, {
    ...SHIKI_OPTS,
    transformers: [diffLineTransformer],
  });

  return (
    <View
      className={cx(
        'min-h-4 flex-row items-center',
        cx(!wordWrap && cx('min-w-full')),
        cx(line.type === 'added' && 'bg-diff-added'),
        cx(line.type === 'removed' && 'bg-diff-removed')
      )}>
      {showLineNumbers && (
        <>
          <Label className="text-tertiary w-10 shrink-0 px-1 text-right font-mono text-[11px] leading-4">
            {line.oldLine ?? ''}
          </Label>
          <Label className="text-tertiary w-10 shrink-0 px-1 text-right font-mono text-[11px] leading-4">
            {line.newLine ?? ''}
          </Label>
        </>
      )}
      <View className="min-w-0 flex-1 flex-row gap-2 pr-2.5 pl-1.5">
        <Label
          className={cx(
            'font-mono select-none text-[12px] leading-4 opacity-60',
            cx(line.type === 'added' && 'text-success'),
            cx(line.type === 'removed' && 'text-error')
          )}>
          {line.type === 'added' ? '+' : line.type === 'removed' ? '−' : ' '}
        </Label>
        <View className="min-w-0 flex-1">
          {highlighter ?? (
            <pre className={cx('shiki', 'm-0 h-auto bg-transparent p-0 text-[75%]')}>
              <code>
                <span className="line">
                  <span>{line.text || ' '}</span>
                </span>
              </code>
            </pre>
          )}
        </View>
      </View>
    </View>
  );
}

const diffLineTransformer: ShikiTransformer = {
  name: 'code-browser-diff-line',
  pre(node) {
    node.properties = {
      ...node.properties,
      style: `${node.properties?.style ?? ''};background-color:transparent;padding:0;margin:0;height:auto;font-size:75%;line-height:16px`,
    };
  },
};
