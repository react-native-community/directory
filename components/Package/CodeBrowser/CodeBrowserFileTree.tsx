import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import { type CodeBrowserTreeDirectory, type CodeBrowserTreeFile } from '~/types';

import CodeBrowserFileRow from './CodeBrowserFileRow';

type Props = {
  tree: CodeBrowserTreeDirectory;
  activeFile: string | null;
  onSelectFile: (filePath: string) => void;
  depth?: number;
  isNested?: boolean;
  isSearchActive?: boolean;
};

export default function CodeBrowserFileTree({
  tree,
  activeFile,
  onSelectFile,
  depth = 0,
  isNested = false,
  isSearchActive = false,
}: Props) {
  const directories = useMemo(
    () => Object.values(tree.directories).sort((a, b) => a.name.localeCompare(b.name)),
    [tree.directories]
  );
  const files = [...tree.files].sort((a, b) => a.name.localeCompare(b.name));

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
};

function CodeBrowserDirectoryRow({
  directory,
  activeFile,
  onSelectFile,
  depth,
  isSearchActive,
}: CodeBrowserDirectoryRowProps) {
  const [collapsed, setCollapsed] = useState(false);

  const collapsedDirectory = useMemo(() => {
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
  }, [directory]);

  const shouldForceExpand =
    isSearchActive || directoryContainsFile(collapsedDirectory.directory, activeFile);

  useEffect(() => {
    if (shouldForceExpand) {
      setCollapsed(false);
    }
  }, [shouldForceExpand]);

  return (
    <View>
      <CodeBrowserFileRow
        label={collapsedDirectory.label}
        depth={depth}
        isDirectory
        isCollapsed={collapsed}
        onPress={() => setCollapsed(currentCollapsed => !currentCollapsed)}
      />
      {!collapsed && (
        <CodeBrowserFileTree
          tree={collapsedDirectory.directory}
          activeFile={activeFile}
          onSelectFile={onSelectFile}
          depth={depth + 1}
          isSearchActive={isSearchActive}
        />
      )}
    </View>
  );
}

function directoryContainsFile(
  directory: CodeBrowserTreeDirectory,
  activeFile: string | null
): boolean {
  if (!activeFile) {
    return false;
  }

  return (
    directory.files.some(file => fileContainsPath(file, activeFile)) ||
    Object.values(directory.directories).some(childDirectory =>
      directoryContainsFile(childDirectory, activeFile)
    )
  );
}

function fileContainsPath(file: CodeBrowserTreeFile, activeFile: string): boolean {
  return (
    file.path === activeFile ||
    file.nestedFiles?.some(nestedFile => fileContainsPath(nestedFile, activeFile)) === true
  );
}
