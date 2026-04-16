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
      {directories.map(directory => (
        <View key={directory.path}>
          <CodeBrowserFileRow label={directory.name} depth={depth} isDirectory />
          <CodeBrowserFileTree
            tree={directory}
            activeFile={activeFile}
            onSelectFile={onSelectFile}
            depth={depth + 1}
          />
        </View>
      ))}
      {files.map(file => (
        <CodeBrowserFileRow
          key={file.path}
          label={file.name}
          depth={depth}
          onPress={() => onSelectFile(file.path)}
          isActive={file.path === activeFile}
        />
      ))}
    </>
  );
}
