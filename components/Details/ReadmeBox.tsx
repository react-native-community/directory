import { Md } from '@m2d/react-markdown/client';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

import { A, colors, darkColors, P } from '~/common/styleguide';
import { ReadmeFile } from '~/components/Icons';
import { getReadmeAssetURL } from '~/util/getReadmeAssetUrl';

type Props = {
  packageName?: string;
  githubUrl?: string;
  isDark?: boolean;
  loader?: boolean;
};

export default function ReadmeBox({ packageName, githubUrl, isDark, loader }: Props) {
  const [readmeContent, setReadmeContent] = useState<string | null>(null);

  useEffect(() => {
    if (loader) {
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const readmeResponse = await fetch(`https://unpkg.com/${packageName}/README.md`);
        const readmeContent = await readmeResponse.text();
        if (!cancelled) {
          setReadmeContent(readmeContent);
        }
      } catch {
        if (!cancelled) {
          setReadmeContent(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View
      id="readmeMarkdownWrapper"
      style={[
        styles.readmeWrapper,
        {
          // @ts-expect-error allow color style inheritance
          color: isDark ? colors.white : colors.black,
          borderColor: isDark ? darkColors.border : colors.gray2,
        },
      ]}>
      <View
        style={[
          styles.readmeHeader,
          {
            borderColor: isDark ? darkColors.border : colors.gray2,
          },
        ]}>
        <ReadmeFile fill={isDark ? darkColors.pewter : colors.secondary} />
        <P>Readme.md</P>
      </View>
      <View style={styles.readmeContainer}>
        {readmeContent && githubUrl ? (
          // TODO: collapse Readme content by default, expand on user interaction
          <Md
            components={{
              hr: () => null,
              div: () => null,
              a: (props: any) => <A style={{ display: 'contents' }} {...props} />,
              img: ({ src, alt }: any) => (
                <img src={getReadmeAssetURL(src, githubUrl)} alt={alt ?? ''} />
              ),
              // TODO: skip broken/non-loading images
              // TODO: render blockquotes in a better way, support GH themed notes
              // TODO: render code block in a better way
              // TODO: render tables in a better way
            }}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            remarkPlugins={[remarkGfm]}>
            {readmeContent}
          </Md>
        ) : (
          <P style={styles.loadingContent}>Loading README.md…</P>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  readmeWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    marginBottom: 8,
  },
  readmeHeader: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
  readmeContainer: {
    padding: 16,
    paddingTop: 12,
  },
  loadingContent: {
    textAlign: 'center',
    paddingVertical: 24,
  },
});
