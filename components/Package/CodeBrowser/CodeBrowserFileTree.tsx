import { View } from 'react-native';

import { type CodeBrowserTreeDirectory } from '~/types';

import CodeBrowserFileRow from './CodeBrowserFileRow';

type Props = {
  tree: CodeBrowserTreeDirectory;
  activeFile: string | null;
  onSelectFile: (filePath: string) => void;
  depth?: number;
  isNested?: boolean;
};

export default function CodeBrowserFileTree({
  tree,
  activeFile,
  onSelectFile,
  depth = 0,
  isNested = false,
}: Props) {
  const directories = Object.values(tree.directories).sort((a, b) => a.name.localeCompare(b.name));
  const files = [...tree.files].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      {directories.map(directory => {
        const collapsedDirectory = collapseDirectoryPath(directory);

        return (
          <View key={directory.path}>
            <CodeBrowserFileRow label={collapsedDirectory.label} depth={depth} isDirectory />
            <CodeBrowserFileTree
              tree={collapsedDirectory.directory}
              activeFile={activeFile}
              onSelectFile={onSelectFile}
              depth={depth + 1}
            />
          </View>
        );
      })}
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
            />
          )}
        </View>
      ))}
    </>
  );
}

function collapseDirectoryPath(directory: CodeBrowserTreeDirectory) {
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
