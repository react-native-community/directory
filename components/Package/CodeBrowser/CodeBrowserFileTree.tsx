import { type ReactNode, useState } from 'react';
import { View } from 'react-native';

import { type CodeBrowserTreeDirectory } from '~/types';

import CodeBrowserFileRow from './CodeBrowserFileRow';

type Props = {
  tree: CodeBrowserTreeDirectory;
  activeFile: string | null;
  onSelectFile: (filePath: string) => void;
  depth?: number;
  isNested?: boolean;
  isSearchActive?: boolean;
  getFileRightSlot?: (filePath: string) => ReactNode;
};

export default function CodeBrowserFileTree({
  tree,
  activeFile,
  onSelectFile,
  depth = 0,
  isNested = false,
  isSearchActive = false,
  getFileRightSlot,
}: Props) {
  const directories = Object.values(tree.directories).sort((a, b) => a.name.localeCompare(b.name));
  const files = tree.files.toSorted((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      {directories.map(directory => (
        <CodeBrowserDirectoryRow
          key={directory.path}
          directory={directory}
          activeFile={activeFile}
          onSelectFile={onSelectFile}
          depth={depth}
          isSearchActive={isSearchActive}
          getFileRightSlot={getFileRightSlot}
        />
      ))}
      {files.map(file => (
        <View key={file.path}>
          <CodeBrowserFileRow
            label={file.name}
            depth={depth}
            onPress={() => onSelectFile(file.path)}
            isActive={file.path === activeFile}
            isNested={isNested}
            rightSlot={getFileRightSlot?.(file.path)}
          />
          {file.nestedFiles && (
            <CodeBrowserFileTree
              tree={{
                name: '',
                path: file.path,
                directories: {},
                files: file.nestedFiles,
              }}
              activeFile={activeFile}
              onSelectFile={onSelectFile}
              depth={depth + 1}
              isNested
              isSearchActive={isSearchActive}
              getFileRightSlot={getFileRightSlot}
            />
          )}
        </View>
      ))}
    </>
  );
}

type CodeBrowserDirectoryRowProps = {
  directory: CodeBrowserTreeDirectory;
  activeFile: string | null;
  onSelectFile: (filePath: string) => void;
  depth: number;
  isSearchActive: boolean;
  getFileRightSlot?: (filePath: string) => ReactNode;
};

function CodeBrowserDirectoryRow({
  directory,
  activeFile,
  onSelectFile,
  depth,
  isSearchActive,
  getFileRightSlot,
}: CodeBrowserDirectoryRowProps) {
  const [userCollapsed, setUserCollapsed] = useState(false);

  const collapsedDirectory = getCollapsedDirectory(directory);
  const collapsed = userCollapsed && !isSearchActive;

  return (
    <View>
      <CodeBrowserFileRow
        label={collapsedDirectory.label}
        depth={depth}
        isDirectory
        isCollapsed={collapsed}
        onPress={() => setUserCollapsed(currentCollapsed => !currentCollapsed)}
      />
      {!collapsed && (
        <CodeBrowserFileTree
          tree={collapsedDirectory.directory}
          activeFile={activeFile}
          onSelectFile={onSelectFile}
          depth={depth + 1}
          isSearchActive={isSearchActive}
          getFileRightSlot={getFileRightSlot}
        />
      )}
    </View>
  );
}

function getCollapsedDirectory(directory: CodeBrowserTreeDirectory) {
  const pathSegments = [directory.name];
  let collapsedDirectory = directory;

  while (
    collapsedDirectory.files.length === 0 &&
    Object.keys(collapsedDirectory.directories).length === 1
  ) {
    const [nextDirectory] = Object.values(collapsedDirectory.directories);

    pathSegments.push(nextDirectory.name);
    collapsedDirectory = nextDirectory;
  }

  return {
    directory: collapsedDirectory,
    label: pathSegments.join('/'),
  };
}
