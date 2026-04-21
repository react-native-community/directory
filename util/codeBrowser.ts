import { type CodeBrowserTreeDirectory, type UnpkgMeta } from '~/types';

export const PREVIEW_DISABLED_FILES = [
  'a',
  'aar',
  'bin',
  'caffemodel',
  'car',
  'class',
  'dex',
  'emd',
  'exe',
  'extrieve',
  'jar',
  'keystore',
  'gz',
  'mat',
  'nib',
  'otf',
  'pb',
  'pbd',
  'rc',
  'raw',
  'so',
  'strings',
  'swiftdoc',
  'swiftsourceinfo',
  'tfl',
  'tflite',
  'tgz',
  'ttf',
  'xcuserstate',
];

export const IMAGE_FILES = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico'];

export const FILE_WARNINGS = [
  {
    message: 'This file should not be part of the bundle and can be safely ignored.',
    fileNames: [
      '*.iml',
      '*.keystore',
      '.all-contributorsrc',
      '.babelrc',
      '.buckconfig',
      '.clang-format*',
      '.eslintrc.js',
      '.flowconfig',
      '.gitattributes',
      '.gitkeep',
      '.gitmodules',
      '.licence-config.yaml',
      '.prettierignore',
      '.project',
      '.swiftformat',
      '.swiftlint.yml',
      '.travis.yml',
      '.watchmanconfig',
      'babel.config.js',
      'eslint.config*.js',
      'gradle-wrapper.jar',
      'gradlew',
      'gradlew.bat',
      'jest*.config.js',
      'local.properties',
      'manifest-*makeinstall*',
      'metro.config.js',
      'nitro.json',
      'publish.gradle',
      '*prettierrc.js',
      'proguard-rules.pro',
      'react-native.config.js',
      'rollup.config.js',
      'settings.gradle',
      'spotless.gradle',
      'tsconfig*.json',
      '*.tsbuildinfo',
      'tsup.config.ts',
      'turbo.json',
      'typedoc.json',
      // LOCK FILES
      'yarn.lock',
      'pnpm-lock.yaml',
      'bun.lock',
      'bun.lockb',
      'package-lock.json',
    ],
  },
];

const FILE_WARNING_MATCHERS = FILE_WARNINGS.map(warning => ({
  ...warning,
  matchers: warning.fileNames.map(createFileWarningMatcher),
}));

const SOURCE_MAP_PARENT_EXTENSIONS = new Set([
  'cjs',
  'cts',
  'js',
  'jsx',
  'mjs',
  'mts',
  'ts',
  'tsx',
]);

const HASH_FILE_EXTENSIONS = new Set(['md5', 'sha1', 'sha3', 'sha256', 'sha512']);

export function getFileWarning(fileName?: string) {
  if (!fileName) {
    return undefined;
  }
  return FILE_WARNING_MATCHERS.find(warning => warning.matchers.some(matcher => matcher(fileName)));
}

export function getCodeBrowserFilePath(path: string, prefix?: string) {
  return prefix ? path.replace(prefix, '') : path;
}

export function getCodeBrowserNestedFileParentPath(path: string) {
  const nestedFileExtension = path.split('.').pop()?.toLowerCase();

  if (!nestedFileExtension) {
    return null;
  }

  const nestedFileParentPath = path.slice(0, -(nestedFileExtension.length + 1));

  if (nestedFileExtension === 'map') {
    const sourceMapParentExtension = nestedFileParentPath.split('.').pop()?.toLowerCase();

    if (!sourceMapParentExtension || !SOURCE_MAP_PARENT_EXTENSIONS.has(sourceMapParentExtension)) {
      return null;
    }

    return nestedFileParentPath;
  }

  if (HASH_FILE_EXTENSIONS.has(nestedFileExtension)) {
    return nestedFileParentPath;
  }

  return null;
}

export function buildCodeBrowserFileTree(
  files: UnpkgMeta['files'],
  prefix?: string
): CodeBrowserTreeDirectory {
  const root = createCodeBrowserTreeDirectory('', '');

  files.forEach(file => {
    const relativePath = getCodeBrowserFilePath(file.path, prefix);
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

  nestCodeBrowserSidecarFiles(root);

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

function nestCodeBrowserSidecarFiles(directory: CodeBrowserTreeDirectory) {
  const filesByPath = new Map(directory.files.map(file => [file.path, file]));
  const nestedFilePaths = new Set<string>();

  directory.files.forEach(file => {
    const nestedFileParentPath = getCodeBrowserNestedFileParentPath(file.path);

    if (!nestedFileParentPath) {
      return;
    }

    const nestedFileParent = filesByPath.get(nestedFileParentPath);

    if (!nestedFileParent) {
      return;
    }

    nestedFileParent.nestedFiles ??= [];
    nestedFileParent.nestedFiles.push(file);
    nestedFilePaths.add(file.path);
  });

  directory.files = directory.files.filter(file => !nestedFilePaths.has(file.path));

  Object.values(directory.directories).forEach(nestCodeBrowserSidecarFiles);
}

function createFileWarningMatcher(pattern: string) {
  if (!pattern.includes('*')) {
    return (fileName: string) => fileName === pattern;
  }

  const regex = new RegExp(
    `^${pattern
      .split('*')
      .map(pathSegment => escapeRegularExpression(pathSegment))
      .join('.*')}$`
  );

  return (fileName: string) => regex.test(fileName);
}

function escapeRegularExpression(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
