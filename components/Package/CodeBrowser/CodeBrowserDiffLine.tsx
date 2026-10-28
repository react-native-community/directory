import { type ShikiTransformer } from '@shikijs/types';
import { View } from 'react-native';
import { type Theme, useShikiHighlighter } from 'react-shiki';

import { Label } from '~/common/styleguide';
import rndDark from '~/styles/shiki/rnd-dark.json';
import rndLight from '~/styles/shiki/rnd-light.json';
import { type DiffLine } from '~/types';
import { SHIKI_OPTS } from '~/util/shiki';
import tw from '~/util/tailwind';

type Props = {
  line: DiffLine;
  lang: string;
  showLineNumbers: boolean;
  wordWrap: boolean;
};

export function CodeBrowserDiffLine({ line, lang, showLineNumbers, wordWrap }: Props) {
  const isDark = tw.prefixMatch('dark');
  const theme = (isDark ? rndDark : rndLight) as Theme;
  const highlighter = useShikiHighlighter(line.text || ' ', lang, theme, {
    ...SHIKI_OPTS,
    transformers: [diffLineTransformer],
  });

  return (
    <View
      style={[
        tw`min-h-4 flex-row items-center`,
        !wordWrap && [tw`min-w-full`, { width: 'max-content' }],
        line.type === 'added' && tw`bg-[#eaffee] dark:bg-[#15281d]`,
        line.type === 'removed' && tw`bg-[#fdeff0] dark:bg-[#2e191b]`,
      ]}>
      {showLineNumbers && (
        <>
          <Label
            style={tw`font-mono w-10 shrink-0 px-1 text-right text-[11px] leading-4 text-tertiary`}>
            {line.oldLine ?? ''}
          </Label>
          <Label
            style={tw`font-mono w-10 shrink-0 px-1 text-right text-[11px] leading-4 text-tertiary`}>
            {line.newLine ?? ''}
          </Label>
        </>
      )}
      <View style={tw`min-w-0 flex-1 flex-row gap-2 pl-1.5 pr-2.5`}>
        <Label
          style={[
            tw`font-mono select-none text-[12px] leading-4 opacity-60`,
            line.type === 'added' && tw`text-success`,
            line.type === 'removed' && tw`text-error`,
          ]}>
          {line.type === 'added' ? '+' : line.type === 'removed' ? '−' : ' '}
        </Label>
        <View style={tw`min-w-0 flex-1`}>
          {highlighter ?? (
            <pre className="shiki" style={tw`m-0 h-auto bg-transparent p-0 text-[75%]`}>
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
