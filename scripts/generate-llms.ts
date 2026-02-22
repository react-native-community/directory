import fs from 'node:fs/promises';
import path from 'node:path';

import { FILTER_COMPATIBILITY, FILTER_PLATFORMS } from '~/components/Filters/helpers';
import { type DataAssetType, type FilterParamsType, type LibraryType } from '~/types';
import { getNewArchSupportStatus, NewArchSupportStatus } from '~/util/newArchStatus';

import data from '../assets/data.json';

const LLMS_PATH = path.resolve('public', 'llms.txt');
const LLMS_FULL_PATH = path.resolve('public', 'llms-full.txt');

const API_DOCUMENTATION = await fs.readFile('API.md', 'utf8');
const README_MARKDOWN = await fs.readFile('README.md', 'utf8');

const INTRODUCTION = `# reactnative.directory

React Native Directory is a website where you can browse through all the libraries that are compatible with React Native.`;

function normalizeNewlines(text: string) {
  return text.replace(/\r\n/g, '\n');
}

function extractReadmeSection(heading: string) {
  const md = normalizeNewlines(README_MARKDOWN);

  const headingToFind = `## ${heading}`;
  const startIndex = md.indexOf(headingToFind);

  if (startIndex === -1) {
    throw new Error(`Could not find section heading in README.md: ${headingToFind}`);
  }

  const fromStart = md.slice(startIndex);
  const nextSectionIndex = fromStart.search(/\n##\s+/);

  return (nextSectionIndex === -1 ? fromStart : fromStart.slice(0, nextSectionIndex)).trim();
}

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
    `## [${npmPkg}](${githubUrl})\n`,
    `${github.description ?? 'No description'}\n`,
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

async function generateLLMSFiles() {
  const librariesFields = extractReadmeSection('How do I add a library?');
  const llmsContent = [INTRODUCTION, librariesFields, API_DOCUMENTATION].join('\n\n');

  await fs.writeFile(LLMS_PATH, `${llmsContent}\n`, 'utf8');

  console.log(`✅ Generated ${path.relative(process.cwd(), LLMS_PATH)}`);

  const { libraries } = data as DataAssetType;

  const entries = libraries
    .filter(library => !library.template)
    .map(library => formatRecord(library));

  const llmsFullContent = [
    INTRODUCTION,
    librariesFields,
    API_DOCUMENTATION,
    '# List of available libraries',
    entries.join('\n\n'),
  ].join('\n\n');

  await fs.writeFile(LLMS_FULL_PATH, `${llmsFullContent}\n`, 'utf8');

  console.log(
    `✅ Generated ${path.relative(process.cwd(), LLMS_PATH)} with ${entries.length} libraries data`
  );
}

await generateLLMSFiles();
