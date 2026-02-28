import { Md } from '@m2d/react-markdown/client';
import { capitalize } from 'es-toolkit/string';
import { useEffect } from 'react';
import { View } from 'react-native';
import { type Theme } from 'react-shiki';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';
import useSWR from 'swr';

import { A, P } from '~/common/styleguide';
import { Check, ReadmeFile } from '~/components/Icons';
import ReadmeHeading from '~/components/Package/ReadmeHeading';
import rndDark from '~/styles/shiki/rnd-dark.json';
import rndLight from '~/styles/shiki/rnd-light.json';
import { TimeRange } from '~/util/datetime';
import { extractAndStripBlockquoteType } from '~/util/extractAndStripBlockquoteType';
import { getReadmeAssetURL } from '~/util/getReadmeAssetUrl';
import tw from '~/util/tailwind';

import ReadmeCodeBlock from './ReadmeCodeBlock';
import ThreeDotsLoader from './ThreeDotsLoader';

type Props = {
  packageName?: string;
  githubUrl?: string;
  isTemplate?: boolean;
  loader?: boolean;
};

export default function ReadmeBox({ packageName, githubUrl, isTemplate, loader = false }: Props) {
  const { data, error, isLoading } = useSWR(
    packageName
      ? isTemplate
        ? `${githubUrl?.replace('github.com/', 'raw.githubusercontent.com/')}/HEAD/README.md`
        : `https://unpkg.com/${packageName}/README.md`
      : null,
    (url: string) =>
      fetch(url).then(res => {
        if (res.status === 404) {
          return '';
        } else if (res.status === 200) {
          return res.text();
        }
        return null;
      }),
    {
      dedupingInterval: TimeRange.MINUTE * 10 * 1000,
      revalidateOnFocus: false,
    }
  );

  const readmeFallbackContent = getReadmeFallbackContent(data, isLoading || loader, error);
  const noData = (!data && Boolean(readmeFallbackContent)) || !githubUrl;

  useEffect(() => {
    if (!noData && window.location.hash) {
      const element = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));

      if (element) {
        setTimeout(() => {
          const top = element.getBoundingClientRect().top + window.scrollY - 12;
          window.scrollTo({ top, behavior: 'smooth' });
        }, 500);
      }
    }
  }, [noData]);

  return (
    <View
      style={tw`my-2 rounded-xl border border-palette-gray2 text-black dark:border-default dark:text-white`}>
      <View
        style={tw`flex-row items-center gap-2 border-b border-palette-gray2 px-4 py-3 dark:border-default`}>
        <ReadmeFile style={tw`text-tertiary dark:text-pewter`} />
        <P>Readme</P>
      </View>
      <View style={tw`p-4 pt-3 font-light`}>
        {noData ? (
          <View style={tw`gap-4 py-6`}>
            {isLoading && <ThreeDotsLoader />}
            <P style={tw`text-center`}>{readmeFallbackContent}</P>
          </View>
        ) : (
          <Md
            id="readmeMarkdownContainer"
            components={{
              h1: ({ children, node }: any) => (
                <ReadmeHeading tagName={node.tagName}>{children}</ReadmeHeading>
              ),
              h2: ({ children, node }: any) => (
                <ReadmeHeading tagName={node.tagName}>{children}</ReadmeHeading>
              ),
              h3: ({ children, node }: any) => (
                <ReadmeHeading tagName={node.tagName}>{children}</ReadmeHeading>
              ),
              h4: ({ children, node }: any) => (
                <ReadmeHeading tagName={node.tagName}>{children}</ReadmeHeading>
              ),
              h5: ({ children, node }: any) => (
                <ReadmeHeading tagName={node.tagName}>{children}</ReadmeHeading>
              ),
              h6: ({ children, node }: any) => (
                <ReadmeHeading tagName={node.tagName}>{children}</ReadmeHeading>
              ),
              br: () => null,
              hr: () => null,
              a: (props: any) => {
                if (props.href && !props.href.startsWith('//')) {
                  if (!props.href.startsWith('http')) {
                    return (
                      <A
                        {...props}
                        href={`${githubUrl}/blob/HEAD/${props.href.startsWith('/') ? props.href.slice(1) : props.href}`}
                      />
                    );
                  }
                  return <A {...props} />;
                }
                return <span>{props.children}</span>;
              },
              table: ({ children }) => {
                return (
                  // @ts-expect-error dataSet is a valid RNW prop
                  <View dataSet={{ tableWrapper: true }}>
                    <table>{children}</table>
                  </View>
                );
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
                const langClass = children?.props?.className;
                if (langClass) {
                  return (
                    <ReadmeCodeBlock
                      code={children.props.children}
                      theme={(tw.prefixMatch('dark') ? rndDark : rndLight) as Theme}
                      lang={langClass ? (langClass.split('-')[1] ?? 'sh').toLowerCase() : 'sh'}
                    />
                  );
                }
                return (
                  <div style={tw`relative my-2`} className="readme-code-block">
                    <pre className="shiki">{children}</pre>
                  </div>
                );
              },
              blockquote: ({ children }: any) => {
                const blockquoteType = extractAndStripBlockquoteType(children);
                return (
                  <blockquote
                    className={blockquoteType.type}
                    style={{
                      ...tw`text-secondary`,
                      ...(blockquoteType.type
                        ? {}
                        : tw`border-palette-gray4 dark:border-secondary`),
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
                    style={tw`mt-3 rounded-xl border border-palette-gray2 pb-3 pr-4 pt-1 dark:border-default`}>
                    {children}
                  </details>
                );
              },
              input: ({ type, checked, ...rest }: any) => {
                if (type === 'checkbox') {
                  const isChecked = Boolean(checked);
                  return (
                    <div
                      className="checkbox"
                      style={tw`m-0 box-border size-4 items-center justify-center rounded border border-solid border-palette-gray3 bg-palette-gray2 dark:border-powder dark:bg-palette-gray6`}>
                      {isChecked && <Check style={tw`size-3 text-success`} />}
                    </div>
                  );
                }
                return <input type={type} {...rest} />;
              },
            }}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            remarkPlugins={[remarkGfm, remarkEmoji]}>
            {data ?? undefined}
          </Md>
        )}
      </View>
    </View>
  );
}

function getReadmeFallbackContent(
  readmeContent?: string | null,
  isLoading?: boolean,
  error?: string
): string | null {
  if (isLoading) {
    return 'Loading README…';
  } else if (readmeContent === '') {
    return 'This package does not have a README file.';
  } else if (readmeContent === null || error) {
    return `Cannot fetch README file content.`;
  }
  return null;
}
