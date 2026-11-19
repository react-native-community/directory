import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { View } from 'react-native';

import { HoverEffect, Label, useLayout } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import { FileMetadataIcon, PackageCompareIcon, PackageCompareSwitchIcon } from '~/components/Icons';
import CodeBrowser from '~/components/Package/CodeBrowser';
import { type CodeBrowserSettingsType } from '~/components/Package/CodeBrowser/CodeBrowserSettings';
import CodeBrowserVersionDiff from '~/components/Package/CodeBrowser/CodeBrowserVersionDiff';
import PackageVersionSelector from '~/components/Package/CodeBrowser/PackageVersionSelector';
import NavigationHeader from '~/components/Package/Navigation/NavigationHeader';
import NotFound from '~/components/Package/NotFound';
import PackageHeader from '~/components/Package/PackageHeader';
import PageMeta from '~/components/PageMeta';
import { Tooltip } from '~/components/Tooltip';
import { type PackageCodePageProps } from '~/types/pages';
import { getDiffActiveFileStorageKey } from '~/util/codeDiff';
import { getStoredValue } from '~/util/localStorage';
import { parseQueryParams, replaceQueryParams } from '~/util/queryParams';
import { cx } from '~/util/tailwind';

const ACTIVE_FILE_STORAGE_KEY_PREFIX = '@ReactNativeDirectory:PackageCodeScene:activeFile';
const CODE_BROWSER_SETTINGS_STORAGE_KEY = '@ReactNativeDirectory:CodeBrowser:settings';
const DEFAULT_CODE_BROWSER_SETTINGS: CodeBrowserSettingsType = {
  wordWrap: true,
  showLineNumbers: true,
  hideMapFiles: false,
};

export default function PackageCodeScene({ apiData, packageName }: PackageCodePageProps) {
  const router = useRouter();
  const { isSmallScreen } = useLayout();

  const activeFileStorageKey = `${ACTIVE_FILE_STORAGE_KEY_PREFIX}:${packageName}`;
  const selectedVersionParam =
    parseQueryParams(router.query).selectedVersion?.toLowerCase() ?? 'latest';
  const compareVersion = parseQueryParams(router.query).compareVersion;

  const selectedVersion = selectedVersionParam;
  const [isChoosingCompareVersion, setChoosingCompareVersion] = useState(false);
  const [codeBrowserSettings, setCodeBrowserSettings] = useState<CodeBrowserSettingsType>(() =>
    readCodeBrowserSettings()
  );
  const [activeFile, setActiveFile] = useState<string | null>(() =>
    getStoredValue(activeFileStorageKey)
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

  function selectVersion(version?: string) {
    replaceQueryParams(router, { selectedVersion: version });
  }

  function toggleBrowserMaximized() {
    setBrowserMaximized(isMaximized => !isMaximized);
  }

  function selectCompareVersion(version: string) {
    if (compareVersion) {
      replaceQueryParams(router, { compareVersion: version });
      return;
    }

    const diffActiveFileStorageKey = getDiffActiveFileStorageKey(
      packageName,
      selectedVersion,
      version
    );

    if (activeFile) {
      window.localStorage.setItem(diffActiveFileStorageKey, activeFile);
    } else {
      window.localStorage.removeItem(diffActiveFileStorageKey);
    }

    void router
      .push(
        {
          pathname: router.pathname,
          query: { ...router.query, selectedVersion, compareVersion: version },
        },
        undefined,
        { shallow: true, scroll: false }
      )
      .then(() => setChoosingCompareVersion(false));
  }

  function closeVersionComparison() {
    setChoosingCompareVersion(false);

    if (compareVersion) {
      const diffActiveFile = getStoredValue(
        getDiffActiveFileStorageKey(packageName, selectedVersion, compareVersion)
      );

      if (diffActiveFile) {
        setActiveFile(diffActiveFile);
      }

      replaceQueryParams(router, { compareVersion: undefined });
    }
  }

  const isSelectingCompareVersion = isChoosingCompareVersion && !compareVersion;
  const showCompareVersionSelector = Boolean(compareVersion) || isChoosingCompareVersion;

  const versionControls = (
    <View className="flex-row flex-wrap items-end gap-2">
      <View className="gap-1">
        <Label className="text-secondary px-1.5">
          {showCompareVersionSelector ? 'From version' : 'Package version'}
        </Label>
        <PackageVersionSelector
          packageName={library.npmPkg}
          selectedVersion={selectedVersion}
          setVersion={selectVersion}
        />
      </View>
      {compareVersion ? (
        <Tooltip
          sideOffset={2}
          trigger={
            <HoverEffect
              accessibilityRole="button"
              onPress={() => {
                replaceQueryParams(router, {
                  compareVersion: selectedVersion,
                  selectedVersion: compareVersion,
                });
              }}
              className="mb-0.5 p-1">
              <PackageCompareSwitchIcon className="text-icon" />
            </HoverEffect>
          }>
          Flip versions
        </Tooltip>
      ) : isSelectingCompareVersion ? (
        <View className="mb-0.5 p-1">
          <PackageCompareSwitchIcon className="text-icon opacity-50" />
        </View>
      ) : (
        <Tooltip
          sideOffset={2}
          trigger={
            <HoverEffect
              accessibilityLabel="Compare versions"
              accessibilityRole="button"
              onPress={() => setChoosingCompareVersion(true)}
              className="mb-0.5 p-1">
              <PackageCompareIcon className="text-icon" />
            </HoverEffect>
          }>
          Compare versions
        </Tooltip>
      )}
      {showCompareVersionSelector && (
        <View className="gap-1">
          <Label className="text-secondary px-1.5">To version</Label>
          <PackageVersionSelector
            packageName={library.npmPkg}
            selectedVersion={compareVersion}
            setVersion={selectCompareVersion}
          />
        </View>
      )}
      {showCompareVersionSelector && (
        <Tooltip
          sideOffset={2}
          trigger={
            <HoverEffect
              accessibilityLabel="Go back to code view"
              accessibilityRole="button"
              onPress={closeVersionComparison}
              className="mb-0.5 p-1">
              <FileMetadataIcon className="text-icon size-5" />
            </HoverEffect>
          }>
          Go back to code view
        </Tooltip>
      )}
    </View>
  );

  const headerContent = (
    <>
      <View className="flex-1 flex-wrap gap-3">
        <PackageHeader library={library} skipDescription />
      </View>
      {versionControls}
    </>
  );

  const browserHeader = (
    <View
      className={cx(
        'flex flex-row flex-wrap items-center justify-between gap-4 bg-default px-5 py-3 dark:bg-dark',
        cx(isSmallScreen && 'flex-col items-start')
      )}>
      {headerContent}
    </View>
  );

  const codeBrowser = compareVersion ? (
    <CodeBrowserVersionDiff
      key={`${selectedVersion}:${compareVersion}`}
      packageName={library.npmPkg}
      fromVersion={selectedVersion}
      toVersion={compareVersion}
      preferredActiveFile={activeFile ?? undefined}
      onActiveFileChange={setActiveFile}
      header={browserHeader}
      isBrowserMaximized={isBrowserMaximized}
      toggleMaximized={toggleBrowserMaximized}
      settings={codeBrowserSettings}
      onSettingsChange={setCodeBrowserSettings}
    />
  ) : (
    <CodeBrowser
      selectedVersion={selectedVersion}
      library={library}
      activeFile={activeFile}
      settings={codeBrowserSettings}
      onSettingsChange={setCodeBrowserSettings}
      header={browserHeader}
      onSelectFile={setActiveFile}
      isBrowserMaximized={isBrowserMaximized}
      toggleMaximized={toggleBrowserMaximized}
    />
  );

  return (
    <>
      <PageMeta
        title={library.npmPkg}
        description="See package directory score details"
        path="package"
      />
      <NavigationHeader library={library} />
      <ContentContainer className="my-6 px-5 pb-3">
        <View className="flex-1 gap-3">
          <View
            className={cx(
              'flex flex-1 flex-row flex-wrap items-center justify-between gap-4',
              cx(isSmallScreen && 'flex-col items-start')
            )}>
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
      hideMapFiles: parsedSettings?.hideMapFiles ?? DEFAULT_CODE_BROWSER_SETTINGS.hideMapFiles,
    };
  } catch {
    return DEFAULT_CODE_BROWSER_SETTINGS;
  }
}
