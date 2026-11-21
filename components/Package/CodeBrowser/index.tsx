import { sumBy } from 'es-toolkit/math';
import { type ReactNode, useRef, useState } from 'react';
import {
  type ColorValue,
  Pressable,
  ScrollView,
  TextInput,
  type TextInputInstance,
  View,
} from 'react-native';
import useSWR from 'swr';

import { Label, P, useLayout } from '~/common/styleguide';
import { FileIcon, SearchIcon, XIcon } from '~/components/Icons';
import ThreeDotsLoader from '~/components/Package/ThreeDotsLoader';
import { Tooltip } from '~/components/Tooltip';
import { type LibraryType, type UnpkgMeta } from '~/types';
import {
  buildCodeBrowserFileTree,
  getCodeBrowserFilePath,
  getCodeBrowserNestedFileParentPaths,
} from '~/util/codeBrowser';
import { TimeRange } from '~/util/datetime';
import { formatBytes } from '~/util/formatBytes';
import { pluralize } from '~/util/strings';
import { cx } from '~/util/tailwind';

import CodeBrowserContent from './CodeBrowserContent';
import CodeBrowserContentFooter from './CodeBrowserContentFooter';
import CodeBrowserFileTree from './CodeBrowserFileTree';
import CodeBrowserLayout from './CodeBrowserLayout';
import CodeBrowserSettings, { type CodeBrowserSettingsType } from './CodeBrowserSettings';
import DisplayModeButton from './DisplayModeButton';

type Props = {
  library: LibraryType;
  selectedVersion: string;
  activeFile: string | null;
  header?: ReactNode;
  settings: CodeBrowserSettingsType;
  onSettingsChange: (settings: CodeBrowserSettingsType) => void;
  onSelectFile: (filePath: string | null) => void;
  isBrowserMaximized: boolean;
  toggleMaximized: () => void;
};

export default function CodeBrowser({
  library,
  selectedVersion,
  activeFile,
  header,
  settings,
  onSettingsChange,
  onSelectFile,
  isBrowserMaximized,
  toggleMaximized,
}: Props) {
  const { isSmallScreen } = useLayout();
  const inputRef = useRef<TextInputInstance>(null);

  const [search, setSearch] = useState('');
  const [isInputFocused, setInputFocused] = useState(false);

  const { data, isLoading } = useSWR<UnpkgMeta>(
    `/api/proxy/unpkg?name=${library.npmPkg}&version=${selectedVersion}&path=?meta`,
    (url: string) => fetch(url).then(res => res.json()),
    {
      dedupingInterval: TimeRange.HOUR * 1000,
      revalidateOnFocus: false,
    }
  );

  const normalizedSearch = search.trim().toLowerCase();

  const files = data?.files ?? [];
  const treeFiles = settings.hideMapFiles
    ? files.filter(file => !file.path.toLowerCase().endsWith('.map'))
    : files;

  const filteredFiles = (() => {
    if (!normalizedSearch) {
      return treeFiles;
    }

    const filesByPath = new Map<string, (typeof treeFiles)[number]>();
    const relatedPaths = new Map<string, Set<string>>();
    const matchedPaths: string[] = [];
    const visiblePaths = new Set<string>();

    for (const file of treeFiles) {
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

    return treeFiles.filter(file => visiblePaths.has(file.path));
  })();

  const fileTree = buildCodeBrowserFileTree(filteredFiles, data?.prefix);
  const totalFilesSize = sumBy(files, file => file.size ?? 0);
  const filteredFilesSize = sumBy(filteredFiles, file => file.size ?? 0);
  const activeFileData = activeFile
    ? files.find(file => file.path === `${data?.prefix}${activeFile}`)
    : undefined;
  const resolvedActiveFile = activeFileData ? activeFile : null;

  return (
    <CodeBrowserLayout
      header={header}
      sidebar={
        data && !isLoading ? (
          <>
            <View
              className={cx(
                'relative flex min-h-[45px] flex-row justify-between gap-3 border-b border-r border-palette-gray2 bg-default dark:border-border',
                isSmallScreen && 'border-r-0'
              )}>
              <View className="pointer-events-none absolute top-3.5 left-3.5">
                <SearchIcon
                  className={cx(
                    'size-4',
                    isInputFocused ? 'text-primary-darker dark:text-primary' : 'text-icon'
                  )}
                />
              </View>
              {search.length > 0 && (
                <Tooltip
                  trigger={
                    <Pressable
                      className="absolute top-3.5 right-3.5 p-0.5"
                      onPress={() => setSearch('')}>
                      <XIcon className="text-tertiary size-3" />
                    </Pressable>
                  }>
                  Clear search value
                </Tooltip>
              )}
              <TextInput
                ref={inputRef}
                autoComplete="off"
                onKeyPress={event => {
                  if ('key' in event && inputRef.current && event.key === 'Escape') {
                    if (search) {
                      event.preventDefault();
                      setSearch('');
                    } else {
                      inputRef.current.blur();
                    }
                  }
                }}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                onChangeText={setSearch}
                placeholder="Search files…"
                className={cx(
                  'font-sans flex h-11 flex-1 rounded-none bg-white p-1 px-10 text-sm text-black -outline-offset-2 dark:bg-dark dark:text-white',
                  isSmallScreen ? 'rounded-t-xl' : 'rounded-tl-xl',
                  isBrowserMaximized && 'rounded-tl-none'
                )}
                value={search}
                placeholderTextColor={'var(--gray-4)' as ColorValue}
              />
            </View>
            <ScrollView
              id="codeBrowserList"
              className={cx(
                'border-palette-gray2 dark:border-border',
                !isSmallScreen && 'flex-1 border-r',
                isSmallScreen && 'h-[25vh] flex-grow-0 border-b'
              )}
              contentContainerStyle={{ paddingTop: 8 }}>
              {filteredFiles.length > 0 ? (
                <>
                  <CodeBrowserFileTree
                    tree={fileTree}
                    activeFile={resolvedActiveFile}
                    onSelectFile={onSelectFile}
                    isSearchActive={Boolean(normalizedSearch)}
                  />
                  <View className="h-2" />
                </>
              ) : (
                <View className="px-3 py-2">
                  <Label className="text-center">No files match this search.</Label>
                </View>
              )}
            </ScrollView>
          </>
        ) : null
      }
      sidebarFooter={
        data && !isLoading && filteredFiles.length > 0 ? (
          <CodeBrowserContentFooter
            isBrowserMaximized={isBrowserMaximized}
            className={isSmallScreen ? 'border-r-0' : 'border-r'}
            leftSlot={
              <Label className="text-secondary font-light">
                <span className="font-medium">{filteredFiles.length}</span>{' '}
                {pluralize('file', filteredFiles.length)}
                {files.length !== filteredFiles.length && (
                  <span className="opacity-80">
                    &ensp;
                    <span className="text-tertiary">&bull;</span>
                    &ensp;
                    <span className="font-medium">{files.length - filteredFiles.length}</span>{' '}
                    hidden
                  </span>
                )}
              </Label>
            }
            rightSlot={
              <Label className="text-secondary font-light">
                <span className="font-medium">{formatBytes(filteredFilesSize)}</span>
                {filteredFilesSize !== totalFilesSize && (
                  <span className="opacity-80">
                    &ensp;
                    <span className="text-tertiary">&bull;</span>
                    &ensp;
                    <span className="font-medium">{formatBytes(totalFilesSize)}</span> total
                  </span>
                )}
              </Label>
            }
          />
        ) : null
      }
      content={
        isLoading ? (
          <View className="flex flex-1 items-center justify-center">
            <ThreeDotsLoader />
          </View>
        ) : !data ? (
          <P>Cannot fetch package bundle code.</P>
        ) : activeFile && activeFileData ? (
          <CodeBrowserContent
            key={activeFile}
            packageName={library.npmPkg}
            repoUrl={library.github.urls.repo}
            selectedVersion={selectedVersion}
            filePath={activeFile}
            fileData={activeFileData}
            settings={settings}
            onSettingsChange={onSettingsChange}
            isBrowserMaximized={isBrowserMaximized}
            toggleMaximized={toggleMaximized}
          />
        ) : (
          <>
            <View className="border-palette-gray2 bg-default dark:border-border flex min-h-[45px] flex-row items-center justify-end gap-3 border-b px-4 py-3">
              <DisplayModeButton
                isBrowserMaximized={isBrowserMaximized}
                toggleMaximized={toggleMaximized}
              />
              <CodeBrowserSettings settings={settings} onChange={onSettingsChange} />
            </View>
            <View className="flex flex-1 flex-col items-center justify-center gap-1 px-3">
              <FileIcon className="text-tertiary dark:text-accented mb-2 size-20" />
              <P className="text-secondary text-center">
                Select file to preview from the list on the left.
              </P>
            </View>
          </>
        )
      }
      hasActiveContent={Boolean(activeFile)}
      isBrowserMaximized={isBrowserMaximized}
    />
  );
}
