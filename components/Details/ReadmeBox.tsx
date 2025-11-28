import { Md } from '@m2d/react-markdown/client';
import { capitalize } from 'es-toolkit';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';

import { A, colors, darkColors, P } from '~/common/styleguide';
import ReadmeCodeBlock from '~/components/Details/ReadmeCodeBlock';
import { ReadmeFile } from '~/components/Icons';
import { extractAndStripBlockquoteType } from '~/util/extractAndStripBlockquoteType';
import { getReadmeAssetURL } from '~/util/getReadmeAssetUrl';

type Props = {
  packageName?: string;
  githubUrl?: string;
  isDark?: boolean;
  loader?: boolean;
};

export default function ReadmeBox({
  packageName,
  githubUrl,
  isDark = false,
  loader = false,
}: Props) {
  const [readmeContent, setReadmeContent] = useState<string | null | undefined>(undefined);

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
      } catch (error: any) {
        if (error instanceof Error) {
          if (error.message === 'Failed to fetch') {
            setReadmeContent('');
            return;
          }
        }
        if (!cancelled) {
          setReadmeContent(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!githubUrl || !packageName) {
    return null;
  }

  const readmeFallbackContent = getReadmeFallbackContent(readmeContent);

  // TODO: collapse Readme content by default, expand on user interaction
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
        {!readmeContent && readmeFallbackContent ? (
          <P style={styles.statusContent}>{readmeFallbackContent}</P>
        ) : (
          <Md
            components={{
              // TODO: remove/hide empty paragraphs
              // TODO: skip broken/non-loading images
              hr: () => null,
              div: () => null,
              a: (props: any) => {
                if (props.href) {
                  return <A {...props} />;
                }
                return <span>{props.children}</span>;
              },
              img: ({ src, alt, width, height }: any) => (
                <img
                  src={getReadmeAssetURL(src, githubUrl)}
                  alt={alt ?? ''}
                  width={width}
                  height={height}
                />
              ),
              pre: ({ children }: any) => {
                const langClass = children.props.className;
                return (
                  <ReadmeCodeBlock
                    code={children.props.children}
                    lang={langClass ? (langClass.split('-')[1] ?? 'sh').toLowerCase() : 'sh'}
                    isDark={isDark}
                  />
                );
              },
              blockquote: ({ children }: any) => {
                const blockquoteType = extractAndStripBlockquoteType(children);
                return (
                  <blockquote
                    className={blockquoteType.type}
                    style={{
                      color: isDark ? darkColors.secondary : colors.gray5,
                      borderColor: blockquoteType.type
                        ? undefined
                        : isDark
                          ? darkColors.secondary
                          : colors.gray4,
                    }}>
                    {blockquoteType.type && (
                      <strong className="blockquote-title">
                        {capitalize(blockquoteType.type)}
                      </strong>
                    )}
                    {blockquoteType.children}
                  </blockquote>
                );
              },
              details: ({ children }: any) => {
                return (
                  <details
                    style={{
                      ...styles.detailsWrapper,
                      borderColor: isDark ? darkColors.border : colors.gray2,
                    }}>
                    {children}
                  </details>
                );
              },
            }}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            remarkPlugins={[remarkGfm, remarkEmoji]}>
            {readmeContent ?? undefined}
          </Md>
        )}
      </View>
    </View>
  );
}

function getReadmeFallbackContent(readmeContent: string | null | undefined): string | null {
  if (readmeContent === undefined) {
    return 'Loading README.md…';
  } else if (readmeContent === null) {
    return 'Cannot fetch README.md content.';
  } else if (readmeContent === '') {
    return 'This package does not have a README.md file.';
  }
  return null;
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
    fontWeight: 300,
  },
  statusContent: {
    textAlign: 'center',
    paddingVertical: 24,
  },
  detailsWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    marginTop: 12,
    paddingBottom: 12,
    paddingTop: 4,
    paddingRight: 16,
  },
});
