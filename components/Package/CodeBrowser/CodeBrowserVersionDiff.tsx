import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import useSWR from 'swr';

import { Label, P, useLayout } from '~/common/styleguide';
import ThreeDotsLoader from '~/components/Package/ThreeDotsLoader';
import { type DiffLineRowData, type UnpkgMeta } from '~/types';
import { buildCodeBrowserFileTree, getLanguage } from '~/util/codeBrowser';
import {
  getChangedFiles,
  getDiffActiveFileStorageKey,
  getDiffDisplayModeStorageKey,
  getDiffHunksWithContext,
  getDiffLines,
  getFileUrl,
  getMetaUrl,
  isPreviewable,
} from '~/util/codeDiff';
import { TimeRange } from '~/util/datetime';
import { swrJSONFetch, swrTextFetch } from '~/util/fetch';
import { getStoredValue } from '~/util/localStorage';
import { pluralize } from '~/util/strings';
import { cx } from '~/util/tailwind';

import { CodeBrowserDiffLine } from './CodeBrowserDiffLine';
import CodeBrowserFileTree from './CodeBrowserFileTree';
import CodeBrowserLayout from './CodeBrowserLayout';
import CodeBrowserSettings, { type CodeBrowserSettingsType } from './CodeBrowserSettings';
import DiffViewButton from './DiffViewButton';
import DisplayModeButton from './DisplayModeButton';

type Props = {
  packageName: string;
  fromVersion: string;
  toVersion: string;
  preferredActiveFile?: string;
  onActiveFileChange: (filePath: string) => void;
  header?: ReactNode;
  isBrowserMaximized: boolean;
  toggleMaximized: () => void;
  settings: CodeBrowserSettingsType;
  onSettingsChange: (settings: CodeBrowserSettingsType) => void;
};

const FETCH_PARAMS = { dedupingInterval: TimeRange.HOUR * 1000, revalidateOnFocus: false };

type DiffListItem =
  | {
      kind: 'hunk';
      key: string;
      oldStart: number;
      oldCount: number;
      newStart: number;
      newCount: number;
    }
  | { kind: 'line'; key: string; line: DiffLineRowData };

export default function CodeBrowserVersionDiff({
  packageName,
  fromVersion,
  toVersion,
  preferredActiveFile,
  onActiveFileChange,
  header,
  isBrowserMaximized,
  toggleMaximized,
  settings,
  onSettingsChange,
}: Props) {
  const { isSmallScreen } = useLayout();
  const activeFileStorageKey = getDiffActiveFileStorageKey(packageName, fromVersion, toVersion);
  const displayModeStorageKey = getDiffDisplayModeStorageKey(packageName, fromVersion, toVersion);
  const [selectedPath, setSelectedPath] = useState<string | null>(
    () => getStoredValue(activeFileStorageKey) ?? preferredActiveFile ?? null
  );
  const [isFullFileView, setIsFullFileView] = useState(
    () => getStoredValue(displayModeStorageKey) !== 'false'
  );

  useEffect(() => {
    if (selectedPath) {
      window.localStorage.setItem(activeFileStorageKey, selectedPath);
    } else {
      window.localStorage.removeItem(activeFileStorageKey);
    }
  }, [activeFileStorageKey, selectedPath]);

  useEffect(() => {
    window.localStorage.setItem(displayModeStorageKey, String(isFullFileView));
  }, [displayModeStorageKey, isFullFileView]);

  const {
    data: fromMeta,
    error: fromMetaError,
    isLoading: isFromMetaLoading,
  } = useSWR<UnpkgMeta>(getMetaUrl(packageName, fromVersion), swrJSONFetch, FETCH_PARAMS);
  const {
    data: toMeta,
    error: toMetaError,
    isLoading: isToMetaLoading,
  } = useSWR<UnpkgMeta>(getMetaUrl(packageName, toVersion), swrJSONFetch, FETCH_PARAMS);

  const changedFiles = useMemo(() => {
    const files = getChangedFiles(fromMeta, toMeta);
    return settings.hideMapFiles
      ? files.filter(file => !file.path.toLowerCase().endsWith('.map'))
      : files;
  }, [fromMeta, settings.hideMapFiles, toMeta]);
  const changedFilesByPath = useMemo(
    () => new Map(changedFiles.map(file => [file.path, file])),
    [changedFiles]
  );
  const activePath = [selectedPath, preferredActiveFile].find(
    path => path && changedFilesByPath.has(path)
  );
  const activeFile = activePath ? changedFilesByPath.get(activePath) : undefined;
  const fromFile = activeFile?.fromFile;
  const toFile = activeFile?.toFile;
  const canPreview =
    activePath &&
    isPreviewable(activePath, fromFile?.size) &&
    isPreviewable(activePath, toFile?.size);

  const fileTree = useMemo(
    () =>
      buildCodeBrowserFileTree(
        changedFiles.flatMap(({ path, fromFile, toFile }) => {
          const file = fromFile ?? toFile;
          return file ? [{ ...file, path }] : [];
        })
      ),
    [changedFiles]
  );

  const {
    data: fromContent,
    error: fromContentError,
    isLoading: isFromContentLoading,
  } = useSWR<string>(
    canPreview && fromFile ? getFileUrl(packageName, fromVersion, activePath) : undefined,
    swrTextFetch,
    FETCH_PARAMS
  );
  const {
    data: toContent,
    error: toContentError,
    isLoading: isToContentLoading,
  } = useSWR<string>(
    canPreview && toFile ? getFileUrl(packageName, toVersion, activePath) : undefined,
    swrTextFetch,
    FETCH_PARAMS
  );

  const diffLines = useMemo(
    () =>
      activePath
        ? getDiffLines(fromContent ?? '', toContent ?? '').map(line => ({
            ...line,
            lang: getLanguage(activePath),
          }))
        : [],
    [activePath, fromContent, toContent]
  );
  const lineChangeCounts = useMemo(
    () => ({
      added: diffLines.filter(line => line.type === 'added').length,
      removed: diffLines.filter(line => line.type === 'removed').length,
    }),
    [diffLines]
  );
  const diffListItems = useMemo(() => {
    const hunks = isFullFileView ? [] : getDiffHunksWithContext(diffLines);
    if (hunks.length === 0) {
      return diffLines.map(line => ({
        kind: 'line' as const,
        key: `line:${line.type}:${line.oldLine ?? ''}:${line.newLine ?? ''}`,
        line,
      }));
    }

    return hunks.flatMap((hunk, hunkIndex) => [
      {
        kind: 'hunk' as const,
        key: `hunk:${hunk.oldStart}:${hunk.newStart}:${hunkIndex}`,
        oldStart: hunk.oldStart,
        oldCount: hunk.oldCount,
        newStart: hunk.newStart,
        newCount: hunk.newCount,
      },
      ...hunk.lines.map(line => ({
        kind: 'line' as const,
        key: `line:${line.type}:${line.oldLine ?? ''}:${line.newLine ?? ''}`,
        line,
      })),
    ]);
  }, [diffLines, isFullFileView]);

  const renderDiffItem = useCallback(
    ({ item }: { item: DiffListItem }) =>
      item.kind === 'hunk' ? (
        <DiffHunkHeader
          oldStart={item.oldStart}
          oldCount={item.oldCount}
          newStart={item.newStart}
          newCount={item.newCount}
        />
      ) : (
        <CodeBrowserDiffLine
          line={item.line}
          lang={item.line.lang}
          showLineNumbers={settings.showLineNumbers}
          wordWrap={settings.wordWrap}
        />
      ),
    [settings.showLineNumbers, settings.wordWrap]
  );

  if (isFromMetaLoading || isToMetaLoading) {
    return (
      <View className="h-[70vh] items-center justify-center">
        <ThreeDotsLoader />
      </View>
    );
  }

  if (fromMetaError || toMetaError) {
    return <P>Cannot fetch package version files for comparison.</P>;
  }

  return (
    <CodeBrowserLayout
      header={header}
      sidebar={
        <>
          {changedFiles.length === 0 ? null : (
            <View
              className={cx(
                'min-h-[45px] flex-row items-center border-b border-r border-palette-gray2 px-3 dark:border-border',
                isSmallScreen && 'border-r-0'
              )}>
              <Label className="font-medium">
                {changedFiles.length} changed {pluralize('file', changedFiles.length)}
              </Label>
            </View>
          )}
          <ScrollView
            id="codeBrowserList"
            className={cx(
              'border-palette-gray2 dark:border-border',
              !isSmallScreen && 'flex-1 border-r',
              isSmallScreen && 'h-[25vh] flex-grow-0 border-b'
            )}
            contentContainerStyle={{ paddingTop: 8 }}>
            <CodeBrowserFileTree
              tree={fileTree}
              activeFile={activePath ?? null}
              onSelectFile={selectFile}
              getFileRightSlot={getFileRightSlot}
            />
          </ScrollView>
        </>
      }
      content={
        <>
          <View className="border-palette-gray2 bg-default dark:border-border dark:bg-dark min-h-[45px] flex-row items-center justify-between gap-3 border-b px-4 py-3">
            <Label className="font-mono text-[13px]">{activePath ?? ''}</Label>
            <View className="flex-row gap-3">
              <DisplayModeButton
                isBrowserMaximized={isBrowserMaximized}
                toggleMaximized={toggleMaximized}
              />
              <DiffViewButton
                isFullFileView={isFullFileView}
                toggleFullFileView={() => setIsFullFileView(fullFileView => !fullFileView)}
              />
              <CodeBrowserSettings settings={settings} onChange={onSettingsChange} />
            </View>
          </View>
          {activePath ? (
            !canPreview ? (
              <View className="flex-1 items-center justify-center px-4">
                <P className="text-secondary text-center">
                  This file is too large or cannot be previewed as text.
                </P>
              </View>
            ) : fromContentError || toContentError ? (
              <View className="flex-1 items-center justify-center px-4">
                <P>Cannot fetch file contents for comparison.</P>
              </View>
            ) : isFromContentLoading || isToContentLoading ? (
              <View className="flex-1 items-center justify-center">
                <ThreeDotsLoader />
              </View>
            ) : (
              <View
                id={settings.wordWrap ? 'code-browser-word-wrap' : undefined}
                className="min-h-0 flex-1">
                <FlatList
                  id="codeBrowserDiffList"
                  data={diffListItems}
                  contentContainerStyle={{ width: settings.wordWrap ? '100%' : 'max-content' }}
                  keyExtractor={item => item.key}
                  className={cx(
                    'flex-1',
                    isFullFileView ? 'py-4' : 'pb-4',
                    activeFile?.status === 'added' && 'bg-diff-added',
                    activeFile?.status === 'removed' && 'bg-diff-removed'
                  )}
                  windowSize={5}
                  renderItem={renderDiffItem}
                />
              </View>
            )
          ) : (
            <View className="flex-1 items-center justify-center px-4">
              <P className="text-secondary text-center">
                {changedFiles.length > 0
                  ? 'Select a changed file to view its diff.'
                  : 'No file changes between these versions.'}
              </P>
            </View>
          )}
        </>
      }
      hasActiveContent={Boolean(activePath)}
      isBrowserMaximized={isBrowserMaximized}
    />
  );

  function getFileRightSlot(filePath: string) {
    const file = changedFilesByPath.get(filePath);

    if (!file) {
      return null;
    }

    if (file.status === 'added') {
      return <Label className="text-success font-mono text-[10px] font-medium">Added</Label>;
    }

    if (file.status === 'removed') {
      return <Label className="text-error font-mono text-[10px] font-medium">Removed</Label>;
    }

    if (
      filePath === activePath &&
      canPreview &&
      !fromContentError &&
      !toContentError &&
      !isFromContentLoading &&
      !isToContentLoading
    ) {
      return (
        <View className="flex-row gap-1">
          <Label className="text-success font-mono text-[10px] font-medium">
            +{lineChangeCounts.added}
          </Label>
          <Label className="text-error font-mono text-[10px] font-medium">
            −{lineChangeCounts.removed}
          </Label>
        </View>
      );
    }

    return <Label className="dark:text-warning font-mono text-[10px] text-[#f4aa34]">⏺</Label>;
  }

  function selectFile(filePath: string) {
    setSelectedPath(filePath);
    onActiveFileChange(filePath);
  }
}

function DiffHunkHeader({
  oldStart,
  oldCount,
  newStart,
  newCount,
}: Omit<Extract<DiffListItem, { kind: 'hunk' }>, 'kind' | 'key'>) {
  return (
    <View className="dark:border-border min-h-7 min-w-full flex-row items-center bg-[#f6f8fa] px-3 dark:bg-[#161b22]">
      <Label className="text-tertiary font-mono text-[11px]">
        {`@@ -${oldStart},${oldCount} +${newStart},${newCount} @@`}
      </Label>
    </View>
  );
}
