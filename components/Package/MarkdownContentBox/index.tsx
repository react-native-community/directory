import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import useSWR from 'swr';

import { P } from '~/common/styleguide';
import {
  CCFileIcon,
  ChangelogFileIcon,
  ContributingFileIcon,
  ReadmeFileIcon,
  SecurityIcon,
} from '~/components/Icons';
import CopyButton from '~/components/Package/CopyButton';
import ThreeDotsLoader from '~/components/Package/ThreeDotsLoader';
import { type LibraryType, type MarkdownTab, type MarkdownTabsType } from '~/types';
import { TimeRange } from '~/util/datetime';
import { parseGitHubUrl } from '~/util/parseGitHubUrl';
import tw from '~/util/tailwind';

import MarkdownContentTab from './MarkdownContentTab';
import MarkdownRenderer from './MarkdownRenderer';
import { DEFAULT_MARKDOWN_TAB, MARKDOWN_CONTENT_QUERY_PARAM, parseMarkdownTab } from './utils';

type Props = {
  packageName?: string;
  library?: LibraryType;
  loader?: boolean;
};

export default function MarkdownContentBox({ packageName, library, loader = false }: Props) {
  const router = useRouter();
  const repoUrl = library?.github.urls.repo;

  const contentTabs: MarkdownTab[] = [
    ...(packageName
      ? [
          {
            title: 'Readme' as const,
            Icon: ReadmeFileIcon,
            url: `/api/proxy/unpkg?name=${packageName}&path=README.md`,
          },
        ]
      : []),
    ...(library?.github?.hasChangelog
      ? [
          {
            title: 'Changelog' as const,
            Icon: ChangelogFileIcon,
            ...getTabContentUrls(library, 'CHANGELOG.md'),
          },
        ]
      : []),
    ...(library?.github?.hasContributing
      ? [
          {
            title: 'Contributing' as const,
            Icon: ContributingFileIcon,
            ...getTabContentUrls(library, 'CONTRIBUTING.md'),
          },
        ]
      : []),
    ...(library?.github?.hasCC
      ? [
          {
            title: 'Code of Conduct' as const,
            Icon: CCFileIcon,
            ...getTabContentUrls(library, 'CODE_OF_CONDUCT.md'),
          },
        ]
      : []),
    ...(library?.github?.hasSecurity
      ? [
          {
            title: 'Security' as const,
            Icon: SecurityIcon,
            ...getTabContentUrls(library, 'SECURITY.md'),
          },
        ]
      : []),
  ].flat();

  const availableTabs = contentTabs.map(({ title }) => title);
  const routeTab = parseMarkdownTab(router.query[MARKDOWN_CONTENT_QUERY_PARAM], availableTabs);
  const [activeTab, setActiveTab] = useState<MarkdownTabsType>(routeTab);

  const activeContentTab = contentTabs.find(({ title }) => title === activeTab);
  const { data, error, isLoading } = useSWR(
    activeContentTab?.url,
    () => fetchMarkdownContent(activeContentTab?.url, activeContentTab?.fallbackUrl),
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
        const timer = setTimeout(() => {
          const top = element.getBoundingClientRect().top + window.scrollY - 12;
          window.scrollTo({ top, behavior: 'smooth' });
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [noData]);

  function handleTabChange(nextTab: MarkdownTabsType) {
    if (nextTab === activeTab) {
      return;
    }

    setActiveTab(nextTab);

    const url = new URL(window.location.href);

    if (nextTab === DEFAULT_MARKDOWN_TAB) {
      url.searchParams.delete(MARKDOWN_CONTENT_QUERY_PARAM);
    } else {
      url.searchParams.set(MARKDOWN_CONTENT_QUERY_PARAM, nextTab);
    }

    url.hash = '';

    void router.replace(`${url.pathname}${url.search}`, undefined, {
      shallow: true,
      scroll: false,
    });
  }

  return (
    <View
      style={tw`my-2 rounded-xl border border-palette-gray2 text-black dark:border-default dark:text-white`}>
      <View
        style={tw`flex-row flex-wrap items-center gap-x-2 border-b border-palette-gray2 pl-1.5 pr-4 dark:border-default`}>
        {contentTabs.map(tab => (
          <MarkdownContentTab
            tab={tab}
            activeTab={activeTab}
            onPress={availableTabs.length > 1 ? handleTabChange : undefined}
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
          <MarkdownRenderer data={data} repoUrl={repoUrl} />
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

async function fetchMarkdownContent(url?: string, fallbackUrl?: string) {
  if (!url) {
    return null;
  }

  const response = await fetch(url);
  if (response.status === 404 && fallbackUrl) {
    return fetchMarkdownContent(fallbackUrl);
  } else if (response.status === 404) {
    return '';
  } else if (response.status === 200) {
    return response.text();
  }

  return null;
}

function getTabContentUrls(library: LibraryType, fileName: string) {
  const { isMonorepo } = parseGitHubUrl(library.githubUrl);
  return {
    url: getContentUrl(library, fileName, false),
    fallbackUrl: isMonorepo ? getContentUrl(library, fileName, true) : undefined,
  };
}

function getContentUrl(library: LibraryType, fileName: string, fromRoot: boolean) {
  const { packagePath, branchName } = parseGitHubUrl(library.githubUrl);
  const contentPath = !fromRoot && packagePath !== '.' ? `${packagePath}/` : '';
  return `${library.github.urls.repo?.replace('github.com/', 'raw.githubusercontent.com/')}/${branchName ?? 'HEAD'}/${contentPath}${fileName}`;
}
