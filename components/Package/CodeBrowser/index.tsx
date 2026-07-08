import { sumBy } from 'es-toolkit/math';
import { useEffect, useRef, useState } from 'react';
import {
  type ColorValue,
  type NativePointerEvent,
  type NativeSyntheticEvent,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import useSWR from 'swr';

import { Label, P, useLayout } from '~/common/styleguide';
import { FileIcon, SearchIcon } from '~/components/Icons';
import ThreeDotsLoader from '~/components/Package/ThreeDotsLoader';
import { type LibraryType, type UnpkgMeta } from '~/types';
import {
  buildCodeBrowserFileTree,
  getCodeBrowserFilePath,
  getCodeBrowserNestedFileParentPaths,
} from '~/util/codeBrowser';
import { TimeRange } from '~/util/datetime';
import { formatBytes } from '~/util/formatBytes';
import { pluralize } from '~/util/strings';
import tw from '~/util/tailwind';

import CodeBrowserContent from './CodeBrowserContent';
import CodeBrowserContentFooter from './CodeBrowserContentFooter';
import CodeBrowserFileTree from './CodeBrowserFileTree';

const FILE_TREE_WIDTH_STORAGE_KEY_PREFIX = '@ReactNativeDirectory:CodeBrowser:fileTreeWidth';
const DEFAULT_FILE_TREE_WIDTH = 340;
const MIN_FILE_TREE_WIDTH = 260;
const MAX_FILE_TREE_WIDTH = 480;

type Props = {
  library: LibraryType;
  selectedVersion: string;
  activeFile: string | null;
  onSelectFile: (filePath: string | null) => void;
  isBrowserMaximized: boolean;
  toggleMaximized: () => void;
};

export default function CodeBrowser({
  library,
  selectedVersion,
  activeFile,
  onSelectFile,
  isBrowserMaximized,
  toggleMaximized,
}: Props) {
  const { isSmallScreen } = useLayout();
  const inputRef = useRef<TextInput>(null);
  const fileTreeResizeStartRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const [search, setSearch] = useState('');
  const [isInputFocused, setInputFocused] = useState(false);
  const [fileTreeWidth, setFileTreeWidth] = useState(() =>
    getStoredFileTreeWidth(FILE_TREE_WIDTH_STORAGE_KEY_PREFIX)
  );
  const [isFileTreeResizing, setFileTreeResizing] = useState(false);

  const { data, isLoading } = useSWR<UnpkgMeta>(
    `/api/proxy/unpkg?name=${library.npmPkg}&version=${selectedVersion}&path=?meta`,
    (url: string) => fetch(url).then(res => res.json()),
    {
      dedupingInterval: TimeRange.HOUR * 1000,
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    window.localStorage.setItem(FILE_TREE_WIDTH_STORAGE_KEY_PREFIX, String(fileTreeWidth));
  }, [fileTreeWidth]);

  useEffect(() => {
    if (!isFileTreeResizing) {
      return;
    }

    function handlePointerMove(event: PointerEvent) {
      const start = fileTreeResizeStartRef.current;

      if (!start) {
        return;
      }

      setFileTreeWidth(clampFileTreeWidth(start.startWidth + (event.clientX - start.startX)));
    }

    function endResizing() {
      fileTreeResizeStartRef.current = null;
      setFileTreeResizing(false);
    }

    function clampWidthToViewport() {
      setFileTreeWidth(currentWidth => clampFileTreeWidth(currentWidth));
    }

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', endResizing);
    document.addEventListener('pointercancel', endResizing);
    window.addEventListener('resize', clampWidthToViewport);

    return () => {
      document.body.style.cursor = 'auto';
      document.body.style.userSelect = 'auto';
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', endResizing);
      document.removeEventListener('pointercancel', endResizing);
      window.removeEventListener('resize', clampWidthToViewport);
    };
  }, [isFileTreeResizing]);

  function startFileTreeResize(event: NativeSyntheticEvent<NativePointerEvent>) {
    event.preventDefault();

    fileTreeResizeStartRef.current = {
      startX: event.nativeEvent.clientX,
      startWidth: fileTreeWidth,
    };

    setFileTreeResizing(true);
  }

  const normalizedSearch = search.trim().toLowerCase();

  const files = data?.files ?? [];

  const filteredFiles = (() => {
    if (!normalizedSearch) {
      return files;
    }

    const filesByPath = new Map<string, (typeof files)[number]>();
    const relatedPaths = new Map<string, Set<string>>();
    const matchedPaths: string[] = [];
    const visiblePaths = new Set<string>();

    for (const file of files) {
      filesByPath.set(file.path, file);

      getCodeBrowserNestedFileParentPaths(file.path).forEach(nestedFileParentPath => {
        relatedPaths.set(
          file.path,
          (relatedPaths.get(file.path) ?? new Set()).add(nestedFileParentPath)
        );
        relatedPaths.set(
          nestedFileParentPath,
          (relatedPaths.get(nestedFileParentPath) ?? new Set()).add(file.path)
        );
      });

      const relativePath = getCodeBrowserFilePath(file.path, data?.prefix).toLowerCase();

      if (relativePath.includes(normalizedSearch)) {
        matchedPaths.push(file.path);
      }
    }

    const queue = [...matchedPaths];

    while (queue.length > 0) {
      const currentPath = queue.shift();

      if (!currentPath || visiblePaths.has(currentPath) || !filesByPath.has(currentPath)) {
        continue;
      }

      visiblePaths.add(currentPath);
      queue.push(...(relatedPaths.get(currentPath) ?? []));
    }

    return files.filter(file => visiblePaths.has(file.path));
  })();

  const fileTree = buildCodeBrowserFileTree(filteredFiles, data?.prefix);
  const totalFilesSize = sumBy(filteredFiles, file => file.size ?? 0);
  const activeFileData = activeFile
    ? files.find(file => file.path === `${data?.prefix}${activeFile}`)
    : undefined;
  const resolvedActiveFile = activeFileData ? activeFile : null;

  return (
    <View
      id="codeBrowser"
      style={[
        tw`mt-2 flex overflow-hidden rounded-xl border border-palette-gray2 bg-default text-black dark:border-default dark:bg-dark dark:text-white`,
        isBrowserMaximized ? tw`inset-0 mt-0 flex-1 rounded-none` : tw`h-[70vh]`,
        isBrowserMaximized && {
          position: 'fixed',
        },
      ]}>
      {isLoading && (
        <View style={tw`flex flex-1 items-center justify-center`}>
          <ThreeDotsLoader />
        </View>
      )}
      {!data && !isLoading && <P>Cannot fetch package bundle code.</P>}
      {data && !isLoading && (
        <View
          style={[
            tw`flex flex-row`,
            isBrowserMaximized ? tw`flex-1` : tw`h-[70vh]`,
            isSmallScreen && tw`flex-col`,
          ]}>
          <View
            style={[
              tw`relative z-10 flex h-full flex-shrink-0`,
              !isSmallScreen && { width: fileTreeWidth },
              isSmallScreen && tw`w-full`,
            ]}>
            <View
              style={[
                tw`relative flex min-h-[45px] flex-row justify-between gap-3 border-b border-r border-palette-gray2 bg-default dark:border-default`,
                isSmallScreen && tw`border-r-0`,
              ]}>
              <View style={tw`pointer-events-none absolute left-3.5 top-3.5`}>
                <SearchIcon
                  style={[
                    tw`size-4`,
                    isInputFocused ? tw`text-primary-darker dark:text-primary` : tw`text-icon`,
                  ]}
                />
              </View>
              <TextInput
                ref={inputRef}
                autoComplete="off"
                onKeyPress={event => {
                  if ('key' in event) {
                    if (inputRef.current && event.key === 'Escape') {
                      if (search) {
                        event.preventDefault();
                        setSearch('');
                      } else {
                        inputRef.current.blur();
                      }
                    }
                  }
                }}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                onChangeText={setSearch}
                placeholder="Search files..."
                style={[
                  tw`font-sans flex h-11 flex-1 rounded-none bg-white p-1 pl-10 text-sm text-black -outline-offset-2 dark:bg-dark dark:text-white`,
                  isSmallScreen ? tw`rounded-t-xl` : tw`rounded-tl-xl`,
                ]}
                value={search}
                placeholderTextColor={tw`text-palette-gray4`.color as ColorValue}
              />
            </View>
            <ScrollView
              id="codeBrowserList"
              style={[
                tw`border-palette-gray2 dark:border-default`,
                !isSmallScreen && tw`flex-1 border-r`,
                isSmallScreen && tw`h-[300px] flex-grow-0 border-b`,
                isFileTreeResizing && tw`pointer-events-none`,
              ]}
              contentContainerStyle={tw`pt-2`}>
              {filteredFiles.length > 0 ? (
                <>
                  <CodeBrowserFileTree
                    tree={fileTree}
                    activeFile={resolvedActiveFile}
                    onSelectFile={onSelectFile}
                    isSearchActive={Boolean(normalizedSearch)}
                  />
                  <View style={tw`h-2`} />
                </>
              ) : (
                <View style={tw`px-3 py-2`}>
                  <Label style={tw`text-center`}>No files match this search.</Label>
                </View>
              )}
            </ScrollView>
            {!isSmallScreen && (
              <View
                accessibilityRole="adjustable"
                onPointerDown={startFileTreeResize}
                style={[
                  tw`absolute -right-0.5 top-0 z-10 h-full w-1 opacity-40`,
                  { cursor: 'col-resize' },
                  isFileTreeResizing && tw`bg-palette-gray3 dark:bg-palette-gray5`,
                ]}
              />
            )}
            {filteredFiles.length > 0 && (
              <CodeBrowserContentFooter
                style={isSmallScreen ? tw`border-r-0` : tw`border-r`}
                leftSlot={
                  <Label style={tw`font-light text-secondary`}>
                    <span style={tw`font-medium`}>{filteredFiles.length}</span>{' '}
                    {pluralize('file', filteredFiles.length)}
                  </Label>
                }
                rightSlot={
                  <Label style={tw`font-light text-secondary`}>
                    <span style={tw`font-medium`}>{formatBytes(totalFilesSize)}</span>
                  </Label>
                }
              />
            )}
          </View>
          <View
            style={[
              tw`flex flex-1`,
              activeFile ? tw`bg-white dark:bg-[#0d1117]` : tw`items-center justify-center`,
              isSmallScreen && !isBrowserMaximized && tw`min-h-[50vh]`,
            ]}>
            {activeFile && activeFileData ? (
              <CodeBrowserContent
                key={activeFile}
                packageName={library.npmPkg}
                repoUrl={library.github.urls.repo}
                selectedVersion={selectedVersion}
                filePath={activeFile}
                fileData={activeFileData}
                isBrowserMaximized={isBrowserMaximized}
                toggleMaximized={toggleMaximized}
              />
            ) : (
              <View style={tw`flex flex-1 flex-col items-center justify-center gap-1 px-3`}>
                <FileIcon style={tw`mb-2 size-20 text-tertiary dark:text-accented`} />
                <P style={tw`text-center`}>Select file to preview from the list on the left.</P>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

function getStoredFileTreeWidth(storageKey: string) {
  if (typeof window === 'undefined') {
    return DEFAULT_FILE_TREE_WIDTH;
  }

  const storedWidth = Number(window.localStorage.getItem(storageKey));

  if (!Number.isFinite(storedWidth)) {
    return DEFAULT_FILE_TREE_WIDTH;
  }

  return clampFileTreeWidth(storedWidth);
}

function clampFileTreeWidth(width: number) {
  if (typeof window === 'undefined') {
    return Math.max(MIN_FILE_TREE_WIDTH, width);
  }

  const maxWidth = Math.max(MIN_FILE_TREE_WIDTH, MAX_FILE_TREE_WIDTH);

  return Math.min(Math.max(width, MIN_FILE_TREE_WIDTH), maxWidth);
}
