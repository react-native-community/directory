import { type CodeBrowserTreeDirectory, type UnpkgMeta } from '~/types';

function getRelativeFilePath(path: string, prefix?: string) {
  return prefix ? path.replace(prefix, '') : path;
}

export function buildCodeBrowserFileTree(
  files: UnpkgMeta['files'],
  prefix?: string
): CodeBrowserTreeDirectory {
  const root = createCodeBrowserTreeDirectory('', '');

  files.forEach(file => {
    const relativePath = getRelativeFilePath(file.path, prefix);
    const pathSegments = relativePath.split('/').filter(Boolean);

    if (pathSegments.length === 0) {
      return;
    }

    const fileName = pathSegments.pop();

    if (!fileName) {
      return;
    }

    let currentDirectory = root;

    pathSegments.forEach(segment => {
      const nextPath = currentDirectory.path ? `${currentDirectory.path}/${segment}` : segment;

      currentDirectory.directories[segment] ??= createCodeBrowserTreeDirectory(segment, nextPath);
      currentDirectory = currentDirectory.directories[segment];
    });

    currentDirectory.files.push({
      name: fileName,
      path: relativePath,
    });
  });

  return root;
}

function createCodeBrowserTreeDirectory(name: string, path: string): CodeBrowserTreeDirectory {
  return {
    name,
    path,
    directories: {},
    files: [],
  };
}
