import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { View } from 'react-native';

import { Label, useLayout } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import CodeBrowser from '~/components/Package/CodeBrowser';
import { type CodeBrowserSettingsType } from '~/components/Package/CodeBrowser/CodeBrowserSettings';
import PackageVersionSelector from '~/components/Package/CodeBrowser/PackageVersionSelector';
import DetailsNavigation from '~/components/Package/DetailsNavigation';
import NotFound from '~/components/Package/NotFound';
import PackageHeader from '~/components/Package/PackageHeader';
import PageMeta from '~/components/PageMeta';
import { type PackageCodePageProps } from '~/types/pages';
import { parseQueryParams, replaceQueryParam } from '~/util/queryParams';
import tw from '~/util/tailwind';

const ACTIVE_FILE_STORAGE_KEY_PREFIX = '@ReactNativeDirectory:PackageCodeScene:activeFile';
const CODE_BROWSER_SETTINGS_STORAGE_KEY = '@ReactNativeDirectory:CodeBrowser:settings';
const DEFAULT_CODE_BROWSER_SETTINGS: CodeBrowserSettingsType = {
  wordWrap: true,
  showLineNumbers: true,
};

export default function PackageCodeScene({ apiData, packageName }: PackageCodePageProps) {
  const router = useRouter();
  const { isSmallScreen } = useLayout();

  const activeFileStorageKey = `${ACTIVE_FILE_STORAGE_KEY_PREFIX}:${packageName}`;
  const selectedVersionParam =
    parseQueryParams(router.query).selectedVersion?.toLowerCase() ?? 'latest';

  const [selectedVersion, setSelectedVersion] = useState(selectedVersionParam);
  const [codeBrowserSettings, setCodeBrowserSettings] = useState<CodeBrowserSettingsType>(() =>
    readCodeBrowserSettings()
  );
  const [activeFile, setActiveFile] = useState<string | null>(() =>
    window.localStorage.getItem(activeFileStorageKey)
  );
  const [isBrowserMaximized, setBrowserMaximized] = useState(false);

  const library = apiData.libraries.find(lib => lib.npmPkg === packageName);

  useEffect(() => {
    window.localStorage.setItem(
      CODE_BROWSER_SETTINGS_STORAGE_KEY,
      JSON.stringify(codeBrowserSettings)
    );
  }, [codeBrowserSettings]);

  useEffect(() => {
    if (!isBrowserMaximized) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setBrowserMaximized(false);
      }
    }

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
    };
  }, [isBrowserMaximized]);

  useEffect(() => {
    // oxlint-disable-next-line react-doctor/no-derived-state
    setActiveFile(window.localStorage.getItem(activeFileStorageKey));
  }, [activeFileStorageKey]);

  // oxlint-disable-next-line react-doctor/no-effect-chain
  useEffect(() => {
    if (activeFile) {
      window.localStorage.setItem(activeFileStorageKey, activeFile);
    } else {
      window.localStorage.removeItem(activeFileStorageKey);
    }
  }, [activeFile, activeFileStorageKey]);

  useEffect(() => {
    function clearStoredActiveFile() {
      window.localStorage.removeItem(activeFileStorageKey);
    }

    window.addEventListener('beforeunload', clearStoredActiveFile);
    window.addEventListener('pagehide', clearStoredActiveFile);
    router.events.on('routeChangeStart', clearStoredActiveFile);

    return () => {
      window.removeEventListener('beforeunload', clearStoredActiveFile);
      window.removeEventListener('pagehide', clearStoredActiveFile);
      router.events.off('routeChangeStart', clearStoredActiveFile);
    };
  }, [activeFileStorageKey, router.events]);

  if (!library) {
    return <NotFound />;
  }

  const headerContent = (
    <>
      <View style={tw`flex-1 flex-wrap gap-3`}>
        <PackageHeader library={library} skipDescription />
      </View>
      <View style={tw`gap-1`}>
        <Label style={tw`px-1.5 text-secondary`}>Package version</Label>
        <PackageVersionSelector
          packageName={library.npmPkg}
          selectedVersion={selectedVersion}
          setVersion={selectedVersion => {
            setSelectedVersion(selectedVersion);
            replaceQueryParam(router, 'selectedVersion', selectedVersion);
          }}
        />
      </View>
    </>
  );

  const codeBrowser = (
    <CodeBrowser
      selectedVersion={selectedVersion}
      library={library}
      activeFile={activeFile}
      settings={codeBrowserSettings}
      onSettingsChange={setCodeBrowserSettings}
      header={
        <View
          style={[
            tw`flex flex-row flex-wrap items-center justify-between gap-4 bg-default px-5 py-3 dark:bg-dark`,
            isSmallScreen && tw`flex-col items-start`,
          ]}>
          {headerContent}
        </View>
      }
      onSelectFile={setActiveFile}
      isBrowserMaximized={isBrowserMaximized}
      toggleMaximized={() => setBrowserMaximized(isMaximized => !isMaximized)}
    />
  );

  return (
    <>
      <PageMeta
        title={library.npmPkg}
        description="See package directory score details"
        path="package"
      />
      <DetailsNavigation library={library} />
      <ContentContainer style={tw`my-6 px-5 pb-3`}>
        <View style={tw`flex-1 gap-3`}>
          <View
            style={[
              tw`flex flex-1 flex-row flex-wrap items-center justify-between gap-4`,
              isSmallScreen && tw`flex-col items-start`,
            ]}>
            {headerContent}
          </View>
          {isBrowserMaximized && document.body
            ? createPortal(codeBrowser, document.body)
            : codeBrowser}
        </View>
      </ContentContainer>
    </>
  );
}

function readCodeBrowserSettings(): CodeBrowserSettingsType {
  if (typeof window === 'undefined') {
    return DEFAULT_CODE_BROWSER_SETTINGS;
  }

  try {
    const storedSettings = window.localStorage.getItem(CODE_BROWSER_SETTINGS_STORAGE_KEY);
    const parsedSettings = storedSettings ? JSON.parse(storedSettings) : undefined;

    return {
      wordWrap: parsedSettings?.wordWrap ?? DEFAULT_CODE_BROWSER_SETTINGS.wordWrap,
      showLineNumbers:
        parsedSettings?.showLineNumbers ?? DEFAULT_CODE_BROWSER_SETTINGS.showLineNumbers,
    };
  } catch {
    return DEFAULT_CODE_BROWSER_SETTINGS;
  }
}
