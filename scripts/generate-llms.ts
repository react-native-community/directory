import fs from 'node:fs/promises';
import path from 'node:path';

import { FILTER_COMPATIBILITY, FILTER_PLATFORMS } from '~/components/Filters/helpers';
import { type DataAssetType, type LibraryType } from '~/types';
import { getNewArchSupportStatus, NewArchSupportStatus } from '~/util/newArchStatus';

type LibraryRecord = {
  library: LibraryType;
  repoUrl: string;
  description: string;
};

const OUTPUT_PATH = path.resolve('public', 'llms.txt');
const DATASET_PATH = path.resolve('assets', 'data.json');
const INTRODUCTION = [
  '# reactnative.directory',
  'Browse the full catalog at https://reactnative.directory for fresh React Native libraries.',
];

const SUPPORTED_FILTERS = [...FILTER_PLATFORMS, ...FILTER_COMPATIBILITY];
const NEW_ARCHITECTURE_STATUS_LABELS: Record<NewArchSupportStatus, string> = {
  [NewArchSupportStatus.NewArchOnly]: 'Only Supports New Architecture',
  [NewArchSupportStatus.Supported]: 'Supports New Architecture',
  [NewArchSupportStatus.Unsupported]: 'Does not support New Architecture',
  [NewArchSupportStatus.Untested]: 'Untested with New Architecture',
};

function formatRecord(library: LibraryType, repoUrl: string, rawDescription: string): string {
  const displayName = library.npmPkg;
  const platforms = getSupportedPlatforms(library);
  const supportText = platforms.length ? platforms.join(', ') : 'Not specified';
  const header = `[${displayName}](${repoUrl}): ${rawDescription}`;
  const newArchStatus = getNewArchSupportStatus(library);
  const newArch = formatNewArchitectureStatus(newArchStatus, library.newArchitectureNote);
  const downloads = formatDownloads(library);
  const lines = [`${header}`, `Supports: ${supportText}`];
  if (newArch) {
    lines.push(`New Architecture: ${newArch}`);
  }
  if (downloads) {
    lines.push(`Downloads: ${downloads}`);
  }
  return lines.join('\n');
}

function getSupportedPlatforms(library: LibraryType) {
  const platforms: string[] = [];
  SUPPORTED_FILTERS.forEach(filter => {
    const key = filter.param as keyof LibraryType;
    const value = library[key];
    const title = filter.title;

    if (typeof value === 'boolean' && value) {
      platforms.push(title);
      return;
    }

    if (typeof value === 'string' && value) {
      platforms.push(`${title} (${value})`);
    }
  });
  return platforms;
}

function formatNewArchitectureStatus(status: NewArchSupportStatus, note?: string) {
  const value = NEW_ARCHITECTURE_STATUS_LABELS[status];

  if (note) {
    return `${value} (${note})`;
  }
  return value;
}

function formatDownloads(library: LibraryType) {
  const downloads = library.npm?.downloads;
  const weekDownloads = library.npm?.weekDownloads;

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
  const assetLibraries = await loadAssetLibraries();
  const records: LibraryRecord[] = assetLibraries
    .filter(library => !library.template)
    .map(library => {
      const repoUrl = library.githubUrl;

      return {
        library,
        repoUrl,
        description: library.github?.description,
      };
    });

  const content = [
    ...INTRODUCTION,
    ...records.map(record => formatRecord(record.library, record.repoUrl, record.description)),
  ].join('\n\n---\n\n');

  await fs.writeFile(OUTPUT_PATH, `${content}\n`, 'utf8');
  console.log(
    `Generated ${records.length} entries in ${path.relative(process.cwd(), OUTPUT_PATH)}`
  );
}

async function loadAssetLibraries(): Promise<DataAssetType['libraries']> {
  try {
    const raw = await fs.readFile(DATASET_PATH, 'utf8');
    const parsed = JSON.parse(raw) as DataAssetType;
    return parsed.libraries ?? [];
  } catch (error) {
    console.warn(
      'Unable to read cached assets/data.json. Continuing without cached descriptions.',
      error
    );
    return [];
  }
}

await generateLlmsFile();
