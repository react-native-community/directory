import { Md } from '@m2d/react-markdown/client';
import { capitalize } from 'es-toolkit/string';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { type Theme } from 'react-shiki';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';
import useSWR from 'swr';

import { A, P } from '~/common/styleguide';
import { CCFile, ChangelogFile, Check, ContributingFile, ReadmeFile } from '~/components/Icons';
import CopyButton from '~/components/Package/CopyButton';
import MarkdownContentTab from '~/components/Package/MarkdownContentTab';
import ReadmeHeading from '~/components/Package/ReadmeHeading';
import rndDark from '~/styles/shiki/rnd-dark.json';
import rndLight from '~/styles/shiki/rnd-light.json';
import { type LibraryType, type MarkdownTab, type MarkdownTabsType } from '~/types';
import { TimeRange } from '~/util/datetime';
import { extractAndStripBlockquoteType } from '~/util/extractAndStripBlockquoteType';
import { getReadmeAssetURL } from '~/util/getReadmeAssetUrl';
import { parseGitHubUrl } from '~/util/parseGitHubUrl';
import tw from '~/util/tailwind';

import ReadmeCodeBlock from './ReadmeCodeBlock';
import ThreeDotsLoader from './ThreeDotsLoader';

type Props = {
  packageName?: string;
  library?: LibraryType;
  loader?: boolean;
};

export default function MarkdownContentBox({ packageName, library, loader = false }: Props) {
  const [activeTab, setActiveTab] = useState<MarkdownTabsType>('Readme');
  const repoUrl = library?.github.urls.repo;

  const contentTabs: MarkdownTab[] = [
    {
      title: 'Readme' as const,
      Icon: ReadmeFile,
      url: library?.template
        ? getTabContentUrl(library, 'README.md')
        : `https://unpkg.com/${packageName}/README.md`,
    },
    ...(library?.github?.hasChangelog
      ? [
          {
            title: 'Changelog' as const,
            Icon: ChangelogFile,
            url: getTabContentUrl(library, 'CHANGELOG.md'),
          },
        ]
      : []),
    ...(library?.github?.hasContributing
      ? [
          {
            title: 'Contributing' as const,
            Icon: ContributingFile,
            url: getTabContentUrl(library, 'CONTRIBUTING.md'),
          },
        ]
      : []),
    ...(library?.github?.hasCC
      ? [
          {
            title: 'Code of Conduct' as const,
            Icon: CCFile,
            url: getTabContentUrl(library, 'CODE_OF_CONDUCT.md'),
          },
        ]
      : []),
  ].flat();

  const { data, error, isLoading } = useSWR(
    contentTabs.find(({ title }) => title === activeTab)?.url,
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

  const readmeFallbackContent = getReadmeFallbackContent(
    activeTab,
    data,
    isLoading || loader,
    error
  );
  const noData = (!data && Boolean(readmeFallbackContent)) || !repoUrl;

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
        style={tw`flex-row flex-wrap items-center gap-x-2 border-b border-palette-gray2 pl-1.5 pr-4 dark:border-default`}>
        {contentTabs.map(tab => (
          <MarkdownContentTab
            tab={tab}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            key={`tab-${tab.title.toLocaleLowerCase()}`}
          />
        ))}
        {!noData && data && (
          <CopyButton
            data={data}
            tooltip={`Copy ${activeTab}`}
            label={`Copy ${activeTab} to clipboard`}
            style={tw`right-4`}
          />
        )}
      </View>
      <View style={tw`p-4 pt-3 font-light`}>
        {noData ? (
          <View style={tw`gap-4 py-6`}>
            {isLoading && <ThreeDotsLoader />}
            <P style={tw`text-center`}>{readmeFallbackContent}</P>
          </View>
        ) : (
          <Md
            id="markdownContentContainer"
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
                        href={`${repoUrl}/blob/HEAD/${props.href.startsWith('/') ? props.href.slice(1) : props.href}`}
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
                  src={getReadmeAssetURL(src, repoUrl)}
                  onError={(error: any) => {
                    const fallbackUrl = getReadmeAssetURL(src, repoUrl, 'master');
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
                  srcSet={srcSet ? getReadmeAssetURL(srcSet, repoUrl) : undefined}
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
  activeTab: string,
  readmeContent?: string | null,
  isLoading?: boolean,
  error?: string
): string | null {
  if (isLoading) {
    return `Loading ${activeTab}…`;
  } else if (readmeContent === '') {
    return `This package does not have a ${activeTab} file.`;
  } else if (readmeContent === null || error) {
    return `Cannot fetch ${activeTab} file content.`;
  }
  return null;
}

function getTabContentUrl(library: LibraryType, fileName: string) {
  const { packagePath, branchName } = parseGitHubUrl(library.githubUrl);
  return `${library.github.urls.repo?.replace('github.com/', 'raw.githubusercontent.com/')}/${branchName ?? 'HEAD'}/${packagePath !== '.' ? `${packagePath}/` : ''}${fileName}`;
}
