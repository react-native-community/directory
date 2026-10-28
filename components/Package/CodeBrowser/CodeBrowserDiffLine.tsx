import { type ShikiTransformer } from '@shikijs/types';
import { View } from 'react-native';
import { type Theme, useShikiHighlighter } from 'react-shiki';

import { Label } from '~/common/styleguide';
import rndDark from '~/styles/shiki/rnd-dark.json';
import rndLight from '~/styles/shiki/rnd-light.json';
import { type DiffLine } from '~/types';
import { SHIKI_OPTS } from '~/util/shiki';
import tw from '~/util/tailwind';

type Props = { line: DiffLine; lang: string };

export function CodeBrowserDiffLine({ line, lang }: Props) {
  const highlighter = useShikiHighlighter(
    line.text || ' ',
    lang,
    (tw.prefixMatch('dark') ? rndDark : rndLight) as Theme,
    {
      ...SHIKI_OPTS,
      transformers: [diffLineTransformer],
    }
  );

  return (
    <View
      style={[
        tw`min-h-4 flex-row items-center`,
        line.type === 'added' && tw`bg-[#eaffee] dark:bg-[#132a1d]`,
        line.type === 'removed' && tw`bg-[#fdeff0] dark:bg-[#2f181b]`,
      ]}>
      <Label
        style={tw`font-mono w-11 shrink-0 px-1 text-right text-[11px] leading-4 text-tertiary`}>
        {line.oldLine ?? ''}
      </Label>
      <Label
        style={tw`font-mono w-11 shrink-0 px-1 text-right text-[11px] leading-4 text-tertiary`}>
        {line.newLine ?? ''}
      </Label>
      <View style={tw`flex-1 flex-row gap-2 px-2`}>
        <Label
          style={[
            tw`font-mono text-[12px] leading-4`,
            line.type === 'added' && tw`text-success`,
            line.type === 'removed' && tw`text-error`,
          ]}>
          {line.type === 'added' ? '+' : line.type === 'removed' ? '−' : ' '}
        </Label>
        <View style={tw`flex-1`}>
          {highlighter ?? (
            <pre
              className="shiki"
              style={{
                backgroundColor: 'transparent',
                fontSize: '75%',
                height: 'auto',
                lineHeight: '16px',
                margin: 0,
                overflow: 'visible',
                padding: 0,
              }}>
              <code style={{ display: 'flex' }}>{line.text || ' '}</code>
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
      style: `${node.properties?.style ?? ''};background-color:transparent;padding:0;margin:0;height:auto;overflow:visible;font-size:75%;line-height:16px`,
    };
  },
};
