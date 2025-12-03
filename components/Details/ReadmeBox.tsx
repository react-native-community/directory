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
import { ThreeDotsLoader } from '~/components/Details/ThreeDotsLoader';
import { ReadmeFile } from '~/components/Icons';
import { extractAndStripBlockquoteType } from '~/util/extractAndStripBlockquoteType';
import { getReadmeAssetURL } from '~/util/getReadmeAssetUrl';

type Props = {
  packageName?: string;
  githubUrl?: string;
  isTemplate?: boolean;
  isDark?: boolean;
  loader?: boolean;
};

export default function ReadmeBox({
  packageName,
  githubUrl,
  isTemplate,
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
      if (isTemplate) {
        const templateRawUrl = githubUrl?.replace('github.com/', 'raw.githubusercontent.com/');
        let readmeResponse = await fetch(`${templateRawUrl}/main/README.md`);

        if (readmeResponse.status === 404) {
          readmeResponse = await fetch(`${templateRawUrl}/master/README.md`);
        }

        if (readmeResponse.status === 200) {
          const readmeContent = await readmeResponse.text();
          if (!cancelled) {
            setReadmeContent(readmeContent);
          }
        } else {
          setReadmeContent('');
        }
      } else {
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
  const borderColorStyle = { borderColor: isDark ? darkColors.border : colors.gray2 };

  return (
    <View
      style={[
        styles.readmeWrapper,
        borderColorStyle,
        {
          // @ts-expect-error allow color style inheritance
          color: isDark ? colors.white : colors.black,
        },
      ]}>
      <View style={[styles.readmeHeader, borderColorStyle]}>
        <ReadmeFile fill={isDark ? darkColors.pewter : colors.secondary} />
        <P>Readme.md</P>
      </View>
      <View style={styles.readmeContainer}>
        {!readmeContent && readmeFallbackContent ? (
          <View style={styles.statusContainer}>
            {readmeContent === undefined && (
              <ThreeDotsLoader color={isDark ? darkColors.pewter : colors.gray4} />
            )}
            <P style={styles.statusContent}>{readmeFallbackContent}</P>
          </View>
        ) : (
          <Md
            id="readmeMarkdownContainer"
            components={{
              br: () => null,
              hr: () => null,
              a: (props: any) => {
                if (props.href && !props.href.startsWith('//')) {
                  return <A {...props} />;
                }
                return <span>{props.children}</span>;
              },
              img: ({ src, alt, width, height }: any) => (
                <img
                  src={getReadmeAssetURL(src, githubUrl)}
                  onError={(error: any) => {
                    const fallbackUrl = getReadmeAssetURL(src, githubUrl, 'master');
                    const target = error.currentTarget;

                    if (target.src !== fallbackUrl) {
                      target.onerror = null;
                      target.src = fallbackUrl;
                    } else {
                      target.style.display = 'none';
                    }
                  }}
                  alt={alt ?? ''}
                  width={width}
                  height="auto"
                  style={{
                    maxHeight: height,
                  }}
                />
              ),
              source: ({ srcSet, ...rest }: any) => (
                <source
                  srcSet={srcSet ? getReadmeAssetURL(srcSet, githubUrl) : undefined}
                  {...rest}
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
                      ...borderColorStyle,
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

function getReadmeFallbackContent(readmeContent?: string | null): string | null {
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
    marginVertical: 8,
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
  statusContainer: {
    paddingVertical: 24,
    gap: 16,
  },
  statusContent: {
    textAlign: 'center',
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
  copyCodeButton: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 22,
    right: 10,
  },
});
