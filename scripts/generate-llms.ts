import fs from 'node:fs/promises';
import path from 'node:path';

import { FILTER_COMPATIBILITY, FILTER_PLATFORMS } from '~/components/Filters/helpers';
import libraries from '~/react-native-libraries.json';
import { type DataAssetType, type LibraryDataEntryType } from '~/types';
import { parseGitHubUrl } from '~/util/parseGitHubUrl';

type LibraryRecord = {
  library: LibraryDataEntryType;
  repoUrl: string;
  repoName: string;
  description: string;
};

const OUTPUT_PATH = path.resolve('public', 'llms.txt');
const DATASET_PATH = path.resolve('assets', 'data.json');
const INTRODUCTION = [
  '# reactnative.directory',
  'Browse the full catalog at https://reactnative.directory for fresh React Native libraries.',
];

const SUPPORTED_FILTERS = [...FILTER_PLATFORMS, ...FILTER_COMPATIBILITY];

function formatRecord(
  library: LibraryDataEntryType,
  repoUrl: string,
  repoName: string,
  rawDescription: string
): string {
  const displayName = library.npmPkg ?? repoName ?? deriveSlug(library.githubUrl);
  const platforms = getSupportedPlatforms(library);
  const supportText = platforms.length ? platforms.join(', ') : 'Not specified';
  const header = `[${displayName}](${repoUrl}): ${rawDescription}`;
  const newArch = formatNewArchitectureStatus(library.newArchitecture, library.newArchitectureNote);
  const lines = [`${header}`, `Supports: ${supportText}`];
  if (newArch) {
    lines.push(`New Architecture: ${newArch}`);
  }
  return lines.join('\n');
}

function cleanDescription(value?: string | null) {
  const sanitized = value?.replace(/\s+/g, ' ').trim();
  return sanitized || 'Description unavailable.';
}

function deriveSlug(url: string) {
  const { repoOwner, repoName } = parseGitHubUrl(url);
  return `${repoOwner}/${repoName}`;
}

function getSupportedPlatforms(library: LibraryDataEntryType) {
  const platforms: string[] = [];
  SUPPORTED_FILTERS.forEach(filter => {
    const key = filter.param as keyof LibraryDataEntryType;
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

function formatNewArchitectureStatus(
  status: LibraryDataEntryType['newArchitecture'],
  note?: string
) {
  const statusMap: Record<string, string> = {
    true: 'Supported',
    false: 'Not supported',
    'new-arch-only': 'New Architecture only',
  };
  const value = statusMap[String(status)] ?? 'Unknown';

  if (note) {
    return `${value} (${note})`;
  }
  return value;
}

async function generateLlmsFile() {
  const assetLibraries = await loadAssetLibraries();
  const cachedByUrl = new Map(assetLibraries.map(entry => [entry.githubUrl, entry]));
  const records: LibraryRecord[] = (libraries as LibraryDataEntryType[]).map(library => {
    const cached = cachedByUrl.get(library.githubUrl);
    const mergedLibrary =
      typeof library.newArchitecture === 'undefined' &&
      typeof cached?.github?.newArchitecture !== 'undefined'
        ? { ...library, newArchitecture: cached.github.newArchitecture }
        : library;

    return {
      library: mergedLibrary,
      repoUrl: cached?.github?.urls.repo ?? library.githubUrl,
      repoName: cached?.github?.name ?? parseGitHubUrl(library.githubUrl).repoName,
      description: cleanDescription(cached?.github?.description),
    };
  });

  const content = [
    ...INTRODUCTION,
    ...records.map(record =>
      formatRecord(record.library, record.repoUrl, record.repoName, record.description)
    ),
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
