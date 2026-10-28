import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Pressable, View } from 'react-native';

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
import { getStoredValue } from '~/util/localStorage';
import { parseQueryParams, replaceQueryParams } from '~/util/queryParams';
import tw from '~/util/tailwind';

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

  const versionControls = compareVersion ? (
    <View style={tw`flex-row flex-wrap items-end gap-2`}>
      <View style={tw`gap-1`}>
        <Label style={tw`px-1.5 text-secondary`}>From version</Label>
        <PackageVersionSelector
          packageName={library.npmPkg}
          selectedVersion={selectedVersion}
          setVersion={selectVersion}
        />
      </View>
      <Tooltip
        trigger={
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              replaceQueryParams(router, {
                compareVersion: selectedVersion,
                selectedVersion: compareVersion,
              });
            }}
            style={tw`mb-0.5 p-1`}>
            <PackageCompareSwitchIcon style={tw`text-icon`} />
          </Pressable>
        }>
        Flip versions
      </Tooltip>
      <View style={tw`gap-1`}>
        <Label style={tw`px-1.5 text-secondary`}>To version</Label>
        <PackageVersionSelector
          packageName={library.npmPkg}
          selectedVersion={compareVersion}
          setVersion={version => replaceQueryParams(router, { compareVersion: version })}
        />
      </View>
      <Tooltip
        trigger={
          <View>
            <HoverEffect>
              <Pressable
                accessibilityLabel="Go back to code view"
                accessibilityRole="button"
                onPress={() => {
                  setChoosingCompareVersion(false);
                  replaceQueryParams(router, { compareVersion: undefined });
                }}
                style={tw`mb-0.5 p-1`}>
                <FileMetadataIcon style={tw`size-5 text-icon`} />
              </Pressable>
            </HoverEffect>
          </View>
        }>
        Go back to code view
      </Tooltip>
    </View>
  ) : (
    <View style={tw`flex-row flex-wrap items-end gap-2`}>
      <View style={tw`gap-1`}>
        <Label style={tw`px-1.5 text-secondary`}>
          {isChoosingCompareVersion ? 'From version' : 'Package version'}
        </Label>
        <PackageVersionSelector
          packageName={library.npmPkg}
          selectedVersion={selectedVersion}
          setVersion={selectVersion}
        />
      </View>
      {isChoosingCompareVersion ? (
        <View style={tw`mb-0.5 p-1`}>
          <PackageCompareSwitchIcon style={tw`text-icon opacity-50`} />
        </View>
      ) : (
        <Tooltip
          trigger={
            <View>
              <HoverEffect>
                <Pressable
                  accessibilityLabel="Compare versions"
                  accessibilityRole="button"
                  disabled={isChoosingCompareVersion}
                  onPress={() => {
                    setChoosingCompareVersion(isChoosing => !isChoosing);
                  }}
                  style={tw`mb-0.5 p-1`}>
                  <PackageCompareIcon style={tw`text-icon`} />
                </Pressable>
              </HoverEffect>
            </View>
          }>
          Compare versions
        </Tooltip>
      )}
      {isChoosingCompareVersion && (
        <>
          <View style={tw`gap-1`}>
            <Label style={tw`px-1.5 text-secondary`}>To version</Label>
            <PackageVersionSelector
              packageName={library.npmPkg}
              setVersion={version => {
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
              }}
            />
          </View>
          <Tooltip
            trigger={
              <View>
                <HoverEffect>
                  <Pressable
                    accessibilityLabel="Go back to code view"
                    accessibilityRole="button"
                    onPress={() => setChoosingCompareVersion(isChoosing => !isChoosing)}
                    style={tw`mb-0.5 p-1`}>
                    <FileMetadataIcon style={tw`size-5 text-icon`} />
                  </Pressable>
                </HoverEffect>
              </View>
            }>
            Go back to code view
          </Tooltip>
        </>
      )}
    </View>
  );

  const headerContent = (
    <>
      <View style={tw`flex-1 flex-wrap gap-3`}>
        <PackageHeader library={library} skipDescription />
      </View>
      {versionControls}
    </>
  );

  const browserHeader = (
    <View
      style={[
        tw`flex flex-row flex-wrap items-center justify-between gap-4 bg-default px-5 py-3 dark:bg-dark`,
        isSmallScreen && tw`flex-col items-start`,
      ]}>
      {headerContent}
    </View>
  );

  const codeBrowser = compareVersion ? (
    <CodeBrowserVersionDiff
      key={`${selectedVersion}:${compareVersion}`}
      packageName={library.npmPkg}
      fromVersion={selectedVersion}
      toVersion={compareVersion}
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
      hideMapFiles: parsedSettings?.hideMapFiles ?? DEFAULT_CODE_BROWSER_SETTINGS.hideMapFiles,
    };
  } catch {
    return DEFAULT_CODE_BROWSER_SETTINGS;
  }
}
