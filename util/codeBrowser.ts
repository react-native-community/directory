import { type CodeBrowserTreeDirectory, type UnpkgMeta } from '~/types';

export const PREVIEW_DISABLED_FILES = [
  'a',
  'aar',
  'bin',
  'dex',
  'jar',
  'gz',
  'mat',
  'rc',
  'raw',
  'so',
  'strings',
  'swiftdoc',
  'swiftsourceinfo',
  'tgz',
  'ttf',
  'xcuserstate',
];
export const IMAGE_FILES = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

export const FILE_WARNINGS = [
  {
    message: 'This file should not be part of the bundle and can be safely ignored.',
    fileNames: [
      '.all-contributorsrc',
      '.babelrc',
      '.clang-format-ignore',
      '.eslintrc.js',
      '.gitattributes',
      '.gitkeep',
      '.gitmodules',
      '.licence-config.yaml',
      '.prettierignore',
      '.travis.yml',
      '.watchmanconfig',
      'babel.config.js',
      'eslint.config.cjs',
      'eslint.config.mjs',
      'gradlew',
      'gradlew.bat',
      'jest.config.js',
      'jest-rsc.config.js',
      'publish.gradle',
      'prettierrc.js',
      'proguard-rules.pro',
      'rollup.config.js',
      'settings.gradle',
      'tsconfig.json',
      'tsconfig.build.json',
      'tsconfig.tsbuildinfo',
      'tsup.config.ts',
      'typedoc.json',
    ],
  },
];

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
