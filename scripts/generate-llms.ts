import fs from 'node:fs/promises';
import path from 'node:path';

import { FILTER_COMPATIBILITY, FILTER_PLATFORMS } from '~/components/Filters/helpers';
import { type DataAssetType, type FilterParamsType, type LibraryType } from '~/types';
import { getNewArchSupportStatus, NewArchSupportStatus } from '~/util/newArchStatus';

import data from '../assets/data.json';

const OUTPUT_PATH = path.resolve('public', 'llms.txt');
const INTRODUCTION = [
  '# reactnative.directory',
  'Browse the full catalog at https://reactnative.directory for fresh React Native libraries.',
];

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

  const entries = libraries.map(library => formatRecord(library));
  const content = [...INTRODUCTION, ...entries].join('\n\n---\n\n');

  await fs.writeFile(OUTPUT_PATH, `${content}\n`, 'utf8');

  console.log(
    `✅ Generated ${entries.length} entries in ${path.relative(process.cwd(), OUTPUT_PATH)}`
  );
}

await generateLlmsFile();
