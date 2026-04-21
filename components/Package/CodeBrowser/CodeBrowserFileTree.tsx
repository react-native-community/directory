import { View } from 'react-native';

import { type CodeBrowserTreeDirectory } from '~/types';

import CodeBrowserFileRow from './CodeBrowserFileRow';

type Props = {
  tree: CodeBrowserTreeDirectory;
  activeFile: string | null;
  onSelectFile: (filePath: string) => void;
  depth?: number;
};

export default function CodeBrowserFileTree({ tree, activeFile, onSelectFile, depth = 0 }: Props) {
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
          />
          {file.nestedFiles?.map(nestedFile => (
            <CodeBrowserFileRow
              isNested
              key={nestedFile.path}
              label={nestedFile.name}
              depth={depth + 1}
              onPress={() => onSelectFile(nestedFile.path)}
              isActive={nestedFile.path === activeFile}
            />
          ))}
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
