import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { View } from 'react-native';

import ContentContainer from '~/components/ContentContainer';
import CodeBrowser from '~/components/Package/CodeBrowser';
import DetailsNavigation from '~/components/Package/DetailsNavigation';
import NotFound from '~/components/Package/NotFound';
import PackageHeader from '~/components/Package/PackageHeader';
import PageMeta from '~/components/PageMeta';
import { type PackageCodePageProps } from '~/types/pages';
import tw from '~/util/tailwind';

const ACTIVE_FILE_STORAGE_KEY_PREFIX = '@ReactNativeDirectory:PackageCodeScene:activeFile';

export default function PackageCodeScene({ apiData, packageName }: PackageCodePageProps) {
  const router = useRouter();
  const activeFileStorageKey = `${ACTIVE_FILE_STORAGE_KEY_PREFIX}:${packageName}`;

  const [activeFile, setActiveFile] = useState<string | null>(() =>
    window.localStorage.getItem(activeFileStorageKey)
  );
  const [isBrowserMaximized, setBrowserMaximized] = useState(false);

  const library = useMemo(
    () => apiData.libraries.find(lib => lib.npmPkg === packageName),
    [apiData.libraries, packageName]
  );

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
    setActiveFile(window.localStorage.getItem(activeFileStorageKey));
  }, [activeFileStorageKey]);

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

  const browserPortalTarget = typeof document === 'undefined' ? null : document.body;

  if (!library) {
    return <NotFound />;
  }

  const codeBrowser = (
    <CodeBrowser
      library={library}
      activeFile={activeFile}
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
        <View style={tw`relative flex-1 gap-3`}>
          <PackageHeader library={library} skipDescription />
          {isBrowserMaximized && browserPortalTarget
            ? createPortal(codeBrowser, browserPortalTarget)
            : codeBrowser}
        </View>
      </ContentContainer>
    </>
  );
}
