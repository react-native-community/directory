import fs from 'node:fs/promises';
import path from 'node:path';

import { FILTER_COMPATIBILITY, FILTER_PLATFORMS } from '~/components/Filters/helpers';
import { type DataAssetType, type FilterParamsType, type LibraryType } from '~/types';
import { getNewArchSupportStatus, NewArchSupportStatus } from '~/util/newArchStatus';

import data from '../assets/data.json';

const OUTPUT_PATH = path.resolve('public', 'llms.txt');
const API_DOCUMENTATION = await fs.readFile('API.md', 'utf8');

const INTRODUCTION = `# reactnative.directory

React Native Directory is a website where you can browse through all the libraries that are compatible with React Native.

## Library fields description

### ⚙️ General

- #### ❗ \`githubUrl\` **(required)**

  **(string)** - URL to the package GitHub repository (currently other Git hosts are not supported).

  > [!WARNING]
  > Package also needs to be published to the NPM registry, because it is a source of crucial data for the directory.

- #### \`npmPkg\`

  **(string)** - npm package name, by default GitHub repository name will be used. Example: \`"@expo/react-native-action-sheet"\`.

  > [!TIP]
  > Fill \`npmPkg\` only when the GitHub repository name is different from the name of package published to npm, or the package is a part of monorepo.

- #### \`examples\`
  **(array of strings)** - URLs to example projects or Snacks which demonstrates the library.
- #### \`images\`

  **(array of strings)** - URLs to static images or GIFs that shows the library functionality.

  > [!TIP]
  > Please do not add logotypes or other branding materials to the \`images\` array, and please avoid linking multiple assets which shows the same feature.

### 📱 Platforms

- #### \`android\`
  **(boolean)** - works on Android device.
- #### \`ios\`
  **(boolean)** - works on iOS device.
- #### \`web\`
  **(boolean)** - can be used with [\`react-native-web\`](https://github.com/necolas/react-native-web).

### 🖥️ Out-of-tree Platforms

> [!IMPORTANT]
> Adding out-of-tree platforms support requires an example or link to the app which uses the library on the given platform.

- #### \`windows\`
  **(boolean)** - can be used with [\`react-native-windows\`](https://github.com/microsoft/react-native-windows).
- #### \`macos\`
  **(boolean)** - can be used with [\`react-native-macos\`](https://github.com/microsoft/react-native-macos).
- #### \`tvos\`
  **(boolean)** - can be used with [\`react-native-tvos\`](https://github.com/react-native-tvos/react-native-tvos).
- #### \`visionos\`
  **(boolean)** - can be used with [\`react-native-visionos\`](https://github.com/callstack/react-native-visionos).

### ✅ Compatibility

> [!TIP]
> **Any** library can be used with Expo, if you use dev clients or prebuild.

- #### \`expoGo\`
  **(boolean)** - works with [Expo Go](https://docs.expo.dev/get-started/expo-go/) — an open-source sandbox app, without using [dev clients](https://docs.expo.dev/develop/development-builds/introduction/) or [prebuild](https://docs.expo.dev/workflow/continuous-native-generation/).
- #### \`fireos\`
  **(boolean)** - works on Amazon Fire OS.
- #### \`horizon\`
  **(boolean)** - works on Meta Horizon OS.
- #### \`vegaos\`
  **(boolean|string)** - works with [Vega OS](https://developer.amazon.com/apps-and-games/vega). It can also be a string containing npm package name, if a separate/additional package is required for full support.

### 🏷️ Tags

- #### \`unmaintained\`
  **(boolean)** - signify that a library is no longer maintained. You can provide alternative or replacement libraries with the \`alternatives\` field, if needed.
- #### \`dev\`
  **(boolean)** - signify that a library is a development tool or is only a part of development process.
- #### \`template\`
  **(boolean)** - signify that a library is a new project template.
- #### \`configPlugin\`
  **(boolean \\| string \\[URL to third-party config plugin\\])** - Indicates if the library includes an [Expo config plugin](https://docs.expo.dev/config-plugins/introduction/). If the plugin is provided by a third party, supply the URL as a string. This field is optional and will be detected automatically if omitted.
- #### \`newArchitecture\`
  **(boolean|'new-arch-only')** - signify that a library supports both, or not, the New Architecture and the Old Architecture or only the New Architecture. Skipping the field will result in "untested" status, unless automatic support detection returned a result. You can provide additional context with the \`newArchitectureNote\` field, if needed.

  > [!TIP]
  > Set \`newArchitecture\` field only when automatic architecture detection fails for your package, despite it supports the New Architecture.

### 📝 Additional context for tags

- #### \`newArchitectureNote\`
  **(string)** - provide a note for the New Architecture support status, if a boolean \`"true"\` or \`"false"\` is not sufficient to describe the state of New Architecture support.

- #### \`alternatives\`
  **(array of strings)** - provide a list of alternatives to the library. eg: \`["expo-camera", "react-native-vision-camera"]\`. This is used to provide a list of alternatives to a library if it is unmaintained or does not support the New Architecture.`;

const NEW_ARCHITECTURE_STATUS_LABELS: Record<NewArchSupportStatus, string> = {
  [NewArchSupportStatus.NewArchOnly]: 'Only Supports New Architecture',
  [NewArchSupportStatus.Supported]: 'Supports New Architecture',
  [NewArchSupportStatus.Unsupported]: 'Does not support New Architecture',
  [NewArchSupportStatus.Untested]: 'Untested with New Architecture',
};

function formatRecord(library: LibraryType): string {
  const platforms = getStringifiedFlags(FILTER_PLATFORMS, library);
  const compatibility = getStringifiedFlags(FILTER_COMPATIBILITY, library);
  const downloads = formatDownloads(library);
  const newArch = formatNewArchitectureStatus(
    getNewArchSupportStatus(library),
    library.newArchitectureNote
  );

  const { npmPkg, npm, github, githubUrl } = library;

  return [
    `[${npmPkg}](${githubUrl}): ${github.description ?? 'No description'}`,
    `Platforms: ${platforms.join(', ')}`,
    compatibility.length > 0 ? `Compatibility: ${compatibility.join(', ')}` : undefined,
    `New Architecture: ${newArch}`,
    downloads ? `Downloads: ${downloads}` : undefined,
    github?.urls.homepage ? `Website: ${github.urls.homepage}` : undefined,
    npm?.latestRelease ? `Latest Version: ${npm.latestRelease}` : undefined,
    npm?.latestReleaseDate
      ? `Latest Release Date: ${new Date(npm.latestReleaseDate).toLocaleDateString()}`
      : undefined,
  ]
    .filter(entry => entry !== undefined)
    .join('\n');
}

function getStringifiedFlags(list: FilterParamsType[], library: LibraryType) {
  return list
    .map(({ param, title }) => {
      const key = param as keyof LibraryType;
      const value = library[key];

      if (typeof value === 'boolean' && value) {
        return title;
      }

      if (typeof value === 'string' && value) {
        return `${title} (${value})`;
      }
      return undefined;
    })
    .filter(entry => entry !== undefined);
}

function formatNewArchitectureStatus(status: NewArchSupportStatus, note?: string) {
  const value = NEW_ARCHITECTURE_STATUS_LABELS[status];

  if (note) {
    return `${value} (${note})`;
  }

  return value;
}

function formatDownloads({ npm }: LibraryType) {
  const downloads = npm?.downloads;
  const weekDownloads = npm?.weekDownloads;

  if (!downloads && !weekDownloads) {
    return null;
  }

  const parts: string[] = [];

  if (typeof downloads === 'number' && downloads > 0) {
    parts.push(`${downloads} total`);
  }

  if (typeof weekDownloads === 'number' && weekDownloads > 0) {
    parts.push(`${weekDownloads} last week`);
  }

  return parts.join(', ');
}

async function generateLlmsFile() {
  const { libraries } = data as DataAssetType;

  const entries = libraries
    .filter(library => !library.template)
    .map(library => formatRecord(library));

  const content = [
    INTRODUCTION,
    API_DOCUMENTATION,
    '# List of available libraries',
    entries.join('\n\n---\n\n'),
  ].join('\n\n');

  await fs.writeFile(OUTPUT_PATH, `${content}\n`, 'utf8');

  console.log(
    `✅ Generated ${entries.length} entries in ${path.relative(process.cwd(), OUTPUT_PATH)}`
  );
}

await generateLlmsFile();
