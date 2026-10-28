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
  getDiffLines,
  getFileUrl,
  getMetaUrl,
  isPreviewable,
} from '~/util/codeDiff';
import { TimeRange } from '~/util/datetime';
import { getStoredValue } from '~/util/localStorage';
import { pluralize } from '~/util/strings';
import tw from '~/util/tailwind';

import { CodeBrowserDiffLine } from './CodeBrowserDiffLine';
import CodeBrowserFileTree from './CodeBrowserFileTree';
import CodeBrowserLayout from './CodeBrowserLayout';
import CodeBrowserSettings, { type CodeBrowserSettingsType } from './CodeBrowserSettings';
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
  const [selectedPath, setSelectedPath] = useState<string | null>(
    () => getStoredValue(activeFileStorageKey) ?? preferredActiveFile ?? null
  );

  useEffect(() => {
    if (selectedPath) {
      window.localStorage.setItem(activeFileStorageKey, selectedPath);
    } else {
      window.localStorage.removeItem(activeFileStorageKey);
    }
  }, [activeFileStorageKey, selectedPath]);

  const {
    data: fromMeta,
    error: fromMetaError,
    isLoading: isFromMetaLoading,
  } = useSWR<UnpkgMeta>(
    getMetaUrl(packageName, fromVersion),
    (url: string) =>
      fetch(url).then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch package metadata: ${response.status}`);
        }
        return response.json();
      }),
    FETCH_PARAMS
  );
  const {
    data: toMeta,
    error: toMetaError,
    isLoading: isToMetaLoading,
  } = useSWR<UnpkgMeta>(
    getMetaUrl(packageName, toVersion),
    (url: string) =>
      fetch(url).then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch package metadata: ${response.status}`);
        }
        return response.json();
      }),
    FETCH_PARAMS
  );

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
    path => path && changedFiles.some(file => file.path === path)
  );

  const fromFile = changedFiles.find(file => file.path === activePath)?.fromFile;
  const toFile = changedFiles.find(file => file.path === activePath)?.toFile;
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
    (url: string) =>
      fetch(url).then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch file content: ${response.status}`);
        }
        return response.text();
      }),
    FETCH_PARAMS
  );
  const {
    data: toContent,
    error: toContentError,
    isLoading: isToContentLoading,
  } = useSWR<string>(
    canPreview && toFile ? getFileUrl(packageName, toVersion, activePath) : undefined,
    (url: string) =>
      fetch(url).then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch file content: ${response.status}`);
        }
        return response.text();
      }),
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

  const renderDiffLine = useCallback(
    ({ item }: { item: DiffLineRowData }) => (
      <CodeBrowserDiffLine
        line={item}
        lang={item.lang}
        showLineNumbers={settings.showLineNumbers}
        wordWrap={settings.wordWrap}
      />
    ),
    [settings.showLineNumbers, settings.wordWrap]
  );

  if (isFromMetaLoading || isToMetaLoading) {
    return (
      <View style={tw`h-[70vh] items-center justify-center`}>
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
              style={[
                tw`min-h-[45px] flex-row items-center border-b border-r border-palette-gray2 px-3 dark:border-default`,
                isSmallScreen && tw`border-r-0`,
              ]}>
              <Label style={tw`font-medium`}>
                {changedFiles.length} changed {pluralize('file', changedFiles.length)}
              </Label>
            </View>
          )}
          <ScrollView
            id="codeBrowserList"
            style={[
              tw`border-palette-gray2 dark:border-default`,
              !isSmallScreen && tw`flex-1 border-r`,
              isSmallScreen && tw`h-[300px] flex-grow-0 border-b`,
            ]}
            contentContainerStyle={tw`pt-2`}>
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
          <View
            style={tw`min-h-[45px] flex-row items-center justify-between gap-3 border-b border-palette-gray2 bg-default px-4 py-3 dark:border-default dark:bg-dark`}>
            <Label style={tw`font-mono text-[13px]`}>{activePath ?? ''}</Label>
            <View style={tw`flex-row gap-3`}>
              <DisplayModeButton
                isBrowserMaximized={isBrowserMaximized}
                toggleMaximized={toggleMaximized}
              />
              <CodeBrowserSettings settings={settings} onChange={onSettingsChange} />
            </View>
          </View>
          {activePath ? (
            !canPreview ? (
              <View style={tw`flex-1 items-center justify-center px-4`}>
                <P style={tw`text-center text-secondary`}>
                  This file is too large or cannot be previewed as text.
                </P>
              </View>
            ) : fromContentError || toContentError ? (
              <View style={tw`flex-1 items-center justify-center px-4`}>
                <P>Cannot fetch file contents for comparison.</P>
              </View>
            ) : isFromContentLoading || isToContentLoading ? (
              <View style={tw`flex-1 items-center justify-center`}>
                <ThreeDotsLoader />
              </View>
            ) : (
              <View
                id={settings.wordWrap ? 'code-browser-word-wrap' : undefined}
                style={tw`flex-1`}>
                <FlatList
                  id="codeBrowserDiffList"
                  data={diffLines}
                  contentContainerStyle={
                    settings.wordWrap ? tw`w-full` : [tw`min-w-full`, { width: 'max-content' }]
                  }
                  keyExtractor={line => `${line.type}:${line.oldLine ?? ''}:${line.newLine ?? ''}`}
                  style={tw`flex-1 py-4`}
                  renderItem={renderDiffLine}
                />
              </View>
            )
          ) : (
            <View style={tw`flex-1 items-center justify-center px-4`}>
              <P style={tw`text-center text-secondary`}>
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
      return <Label style={tw`font-mono text-[10px] font-medium text-success`}>Added</Label>;
    }

    if (file.status === 'removed') {
      return <Label style={tw`font-mono text-[10px] font-medium text-error`}>Removed</Label>;
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
        <View style={tw`flex-row gap-1`}>
          <Label style={tw`font-mono text-[10px] font-medium text-success`}>
            +{lineChangeCounts.added}
          </Label>
          <Label style={tw`font-mono text-[10px] font-medium text-error`}>
            −{lineChangeCounts.removed}
          </Label>
        </View>
      );
    }

    return <Label style={tw`font-mono text-[10px] text-[#f4aa34] dark:text-warning`}>⏺</Label>;
  }

  function selectFile(filePath: string) {
    setSelectedPath(filePath);
    onActiveFileChange(filePath);
  }
}
