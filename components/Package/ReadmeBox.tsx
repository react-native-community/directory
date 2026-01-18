import { Md } from '@m2d/react-markdown/client';
import { capitalize } from 'es-toolkit';
import { View } from 'react-native';
import { type Theme } from 'react-shiki';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';
import useSWR from 'swr';

import { A, P } from '~/common/styleguide';
import { ReadmeFile } from '~/components/Icons';
import rndDark from '~/styles/shiki/rnd-dark.json';
import rndLight from '~/styles/shiki/rnd-light.json';
import { extractAndStripBlockquoteType } from '~/util/extractAndStripBlockquoteType';
import { getReadmeAssetURL } from '~/util/getReadmeAssetUrl';
import tw from '~/util/tailwind';

import ReadmeCodeBlock from './ReadmeCodeBlock';
import ThreeDotsLoader from './ThreeDotsLoader';
import { TimeRange } from '~/util/datetime';

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

  return (
    <View
      style={tw`rounded-xl my-2 border border-palette-gray2 text-black dark:border-default dark:text-white`}>
      <View
        style={tw`flex-row gap-2 items-center px-4 py-3 border-b border-palette-gray2 dark:border-default`}>
        <ReadmeFile style={tw`text-tertiary dark:text-pewter`} />
        <P>Readme</P>
      </View>
      <View style={tw`p-4 pt-3 font-light`}>
        {(!data && readmeFallbackContent) || !githubUrl ? (
          <View style={tw`gap-4 py-6`}>
            {isLoading && <ThreeDotsLoader />}
            <P style={tw`text-center`}>{readmeFallbackContent}</P>
          </View>
        ) : (
          <Md
            id="readmeMarkdownContainer"
            components={{
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
                    style={tw`rounded-xl mt-3 pb-3 pt-1 pr-4 border border-palette-gray2 dark:border-default`}>
                    {children}
                  </details>
                );
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
