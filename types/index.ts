import 'expo/types/react-native-web.d.ts';

import { type ComponentType, type ReactElement, type ReactNode } from 'react';

import { type IconProps } from '~/components/Icons';
import { type NewArchSupportStatus } from '~/util/newArchStatus';

export type QueryOrder =
  | 'relevance'
  | 'updated'
  | 'added'
  | 'released'
  | 'quality'
  | 'popularity'
  | 'issues'
  | 'downloads'
  | 'stars'
  | 'dependencies'
  | 'size';

export type QueryOrderDirection = 'descending' | 'ascending';

export type Query = {
  android?: string;
  expoGo?: string;
  ios?: string;
  macos?: string;
  fireos?: string;
  tvos?: string;
  visionos?: string;
  vegaos?: string;
  horizon?: string;
  web?: string;
  windows?: string;
  order?: QueryOrder;
  direction?: QueryOrderDirection;
  search?: string;
  offset?: string | null;
  limit?: string;
  hasExample?: string;
  hasImage?: string;
  hasTypes?: string;
  hasNativeCode?: string;
  configPlugin?: string;
  isMaintained?: string;
  isPopular?: string;
  wasRecentlyUpdated?: string;
  minPopularity?: string;
  minMonthlyDownloads?: string;
  newArchitecture?: string;
  skipLibs?: string;
  skipTools?: string;
  expoModule?: string;
  nitroModule?: string;
  turboModule?: string;
  nightlyProgram?: string;
  owner?: string;
  bookmarks?: string;
};

export type QueryFilters = {
  libraries: LibraryType[];
  sortBy?: QueryOrder;
  queryTopic?: string;
  querySearch?: string;
  support: Record<string, string | undefined>;
};

export type FilterParamsType = {
  param: keyof Query;
  title: string;
};

export type SortedDataType = Record<QueryOrder, LibraryType[]>;

export type LibraryLicenseType = {
  key: string;
  name: string;
  spdxId: string;
  url: string;
  id: string;
};

export type LibraryType = LibraryDataEntryType & {
  github: {
    name: string;
    fullName: string;
    description?: string;
    registry?: string;
    topics?: string[];
    hasTypes?: boolean;
    newArchitecture?: boolean;
    isArchived?: boolean;
    isPrivate?: boolean;
    hasNativeCode: boolean;
    hasReadme?: boolean;
    hasChangelog?: boolean;
    hasContributing?: boolean;
    hasCC?: boolean;
    configPlugin?: boolean;
    moduleType?: 'expo' | 'nitro' | 'turbo';
    packageManager?: string;
    urls: {
      repo: string;
      homepage?: string | null;
    };
    stats: {
      hasIssues: boolean;
      hasWiki: boolean;
      hasProjects: boolean;
      hasSponsorships: boolean;
      hasDiscussions: boolean;
      hasVulnerabilityAlerts: boolean;
      hasTopics?: boolean;
      updatedAt: Date | string;
      createdAt: Date | string;
      pushedAt: Date | string;
      issues: number;
      subscribers: number;
      stars: number;
      forks: number;
      dependencies?: number;
    };
    license: LibraryLicenseType;
  };
  npm?: {
    downloads?: number;
    weekDownloads?: number;
    size?: number;
    versionsCount?: number;
    latestRelease?: string;
    latestReleaseDate?: string;
    hasReadme?: boolean;
  };
  npmPkg: string;
  score: number;
  matchingScoreModifiers: string[];
  topicSearchString: string;
  popularity?: number;
  matchScore?: number;
  nightlyProgram?: boolean;
};

export type LibraryDataEntryType = {
  githubUrl: string;
  ios?: boolean;
  android?: boolean;
  web?: boolean;
  expoGo?: boolean;
  windows?: boolean;
  macos?: boolean;
  fireos?: boolean;
  horizon?: boolean;
  tvos?: boolean;
  visionos?: boolean;
  vegaos?: boolean | string;
  unmaintained?: boolean;
  dev?: boolean;
  newArchitecture?: boolean | 'new-arch-only';
  newArchitectureNote?: string;
  configPlugin?: boolean | string;
  alternatives?: string[];
  npmPkg?: string;
  examples?: string[];
  images?: string[];
};

export type LibraryFundingLink = {
  platform: string;
  url: string;
};

export type APIResponseType = {
  libraries: LibraryType[];
  total: number;
};

export type DataAssetType = {
  libraries: LibraryType[];
  topics: Record<string, number>;
};

export type MetadataEntryType = {
  id: string;
  icon: ReactElement;
  content: ReactNode;
  tooltip?: ReactNode;
} | null;

export type ScoringCriterionType = {
  name: string;
  description: string;
  value: number;
  condition: (data: LibraryType) => boolean;
};

export type RepositoryTreeNode = {
  name: string;
  type: 'tree' | 'blob';
};

export type PeerDependencyData = {
  version: string;
  optional: boolean;
};

export type MarkdownTabsType = 'Readme' | 'Changelog' | 'Contributing' | 'Code of Conduct';

export type MarkdownTab = {
  title: MarkdownTabsType;
  url: string | null;
  Icon: ComponentType<IconProps>;
};

export type CheckResultsType = Record<
  string,
  {
    unmaintained?: boolean;
    newArchitecture: NewArchSupportStatus;
  }
>;

export type StatisticResultType = {
  total: number;
  newArchitecture: number;
  downloads: number;
  weekDownloads: number;
  unmaintained: number;
  withTypes: number;
  withNativeCode: number;
  withConfigPlugin: number;
  ios: number;
  android: number;
  web: number;
  expoGo: number;
  windows: number;
  macos: number;
  fireos: number;
  horizon: number;
  tvos: number;
  visionos: number;
  vegaos: number;
  packageManager: {
    bun: number;
    pnpm: number;
    npm: number;
    yarn: number;
  };
};

type NpmRegistryCommonData = {
  name: string;
  author: NpmUser | string;
  bugs: { url: string };
  description: string;
  homepage: string;
  keywords: string[];
  license: string;
  maintainers: NpmUser[];
  repository: {
    url: string;
    type: string;
    directory?: string;
  };
};

export type NpmRegistryData = NpmRegistryCommonData & {
  'dist-tags': Record<string, string>;
  versions: Record<string, NpmRegistryVersionData>;
  time: Record<string, string>;
  readme?: string;
  readmeFilename?: string;
  users?: Record<string, unknown>;
  _id?: string;
  _rev?: string;
};

export type NpmRegistryVersionData = NpmRegistryCommonData & {
  version: string;
  bin: { eslint: string };
  dist: {
    shasum: string;
    tarball: string;
    fileCount?: number;
    integrity?: string;
    signatures?: {
      sig: string;
      keyid: string;
    };
    unpackedSize?: number;
  };
  main: string;
  type: string;
  types?: string;
  engines: {
    node: string;
  };
  exports: Record<string, object | string>;
  gitHead?: string;
  scripts: Record<string, string>;
  gitHooks?: Record<string, string>;
  description: string;
  directories: Record<string, unknown>;
  dependencies?: Record<string, string>;
  typesVersions?: Record<string, object>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  peerDependenciesMeta?: Record<string, { optional?: boolean }>;
  _npmUser?: NpmUser;
  _npmVersion?: string;
  _nodeVersion?: string;
};

export type PackageVersionData = Pick<
  NpmRegistryVersionData,
  'name' | 'version' | '_npmUser' | 'dependencies'
> & {
  dist?: Pick<NpmRegistryVersionData['dist'], 'unpackedSize'>;
};

export type PackageVersionsData = Pick<NpmRegistryData, 'dist-tags'> & {
  versions: Record<string, PackageVersionData>;
  time: Record<string, string>;
};

export type PackageVersionsOnlyData = Pick<NpmRegistryData, 'dist-tags'> & {
  versions: string[];
};

export type NpmUser = {
  name: string;
  email?: string;
  url?: string;
  trustedPublisher?: {
    id: string;
    oidcConfigId: string;
  };
};

export type NpmPerVersionDownloads = {
  package: string;
  downloads: Record<string, number>;
};

export type NightlyProgramData = {
  description: string;
  installCommand: string;
  android: boolean;
  ios: boolean;
  maintainersUsernames: string[];
  notes: string;
};

export type GitHubUser = {
  avatar_url: string;
  contributions: number;
  events_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  gravatar_id: string;
  html_url: string;
  id: number;
  login: string;
  node_id: string;
  organizations_url: string;
  received_events_url: string;
  repos_url: string;
  site_admin: boolean;
  starred_url: string;
  subscriptions_url: string;
  type: string;
  url: string;
  user_view_type: string;
};

export type CodeBrowserTreeFile = {
  name: string;
  path: string;
  nestedFiles?: CodeBrowserTreeFile[];
};

export type CodeBrowserTreeDirectory = {
  name: string;
  path: string;
  directories: Record<string, CodeBrowserTreeDirectory>;
  files: CodeBrowserTreeFile[];
};

export type UnpkgMeta = {
  files: {
    integrity: string;
    path: string;
    size: number;
    type: string;
  }[];
  package: string;
  prefix: string;
  version: string;
};
