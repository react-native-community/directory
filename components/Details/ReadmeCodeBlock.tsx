import { StyleSheet } from 'react-native';
import { useShikiHighlighter } from 'react-shiki';

import { colors, darkColors } from '~/common/styleguide';
import { Button } from '~/components/Button';
import { Copy } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';

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

  const copyButton = (
    <Tooltip
      sideOffset={2}
      trigger={
        <Button
          style={styles.copyCodeButton}
          onPress={async () => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              await navigator.clipboard.writeText(code);
            }
          }}>
          <Copy width={20} height={20} fill={isDark ? darkColors.pewter : colors.gray4} />
        </Button>
      }>
      Copy code
    </Tooltip>
  );

  if (!highlighter) {
    return (
      <>
        {copyButton}
        <pre className="shiki">
          <code>{code}</code>
        </pre>
      </>
    );
  }

  return (
    <>
      {copyButton}
      {highlighter}
    </>
  );
}

const styles = StyleSheet.create({
  copyCodeButton: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 24,
    right: 12,
  },
});
