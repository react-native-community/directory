export type QueryOrder =
  | 'relevance'
  | 'updated'
  | 'added'
  | 'recommended'
  | 'quality'
  | 'popularity'
  | 'issues'
  | 'downloads'
  | 'stars';

export type QueryOrderDirection = 'descending' | 'ascending';

export type Query = {
  android?: string;
  expoGo?: string;
  ios?: string;
  macos?: string;
  fireos?: string;
  tvos?: string;
  visionos?: string;
  web?: string;
  windows?: string;
  order?: QueryOrder;
  direction?: QueryOrderDirection;
  search?: string;
  offset?: string | number;
  limit?: string | number;
  hasExample?: string;
  hasImage?: string;
  hasTypes?: string;
  isMaintained?: string;
  isPopular?: string;
  isRecommended?: string;
  wasRecentlyUpdated?: string;
  minPopularity?: string | number;
  minMonthlyDownloads?: string | number;
  newArchitecture?: string;
};

export type Library = LibraryDataEntry & {
  github: {
    name: string;
    isPackagePrivate: boolean;
    fullName: string;
    description: string;
    registry?: string;
    topics?: string[];
    newArchitecture?: boolean;
    hasTypes: boolean;
    isArchived: boolean;
    isPrivate: boolean;
    urls: {
      repo: string;
      homepage: string | null;
    };
    stats: {
      hasIssues: boolean;
      hasWiki: boolean;
      hasDiscussions: boolean;
      hasSponsorships: boolean;
      hasTopics?: boolean;
      updatedAt: string;
      createdAt: string;
      pushedAt: string;
      issues: number;
      subscribers: number;
      stars: number;
      forks: number;
    };
    license: {
      key: string;
      name: string;
      spdxId: string;
      url: string;
      id: string;
    };
  };
  npm: {
    downloads?: number;
    weekDownloads?: number;
  };
  npmPkg: string;
  score: number;
  matchingScoreModifiers: string[];
  topicSearchString: string;
  popularity: number;
  matchScore: number;
};

export type LibraryWithConvexData = Library & {
  _id: string;
  _creationTime: number;
};

export type LibraryDataEntry = {
  githubUrl: string;
  ios?: boolean;
  android?: boolean;
  web?: boolean;
  expoGo?: boolean;
  windows?: boolean;
  macos?: boolean;
  fireos?: boolean;
  tvos?: boolean;
  visionos?: boolean;
  unmaintained?: boolean;
  dev?: boolean;
  template?: boolean;
  newArchitecture?: boolean | 'new-arch-only';
  newArchitectureNote?: string;
  alternatives?: string[];
  npmPkg?: string;
  examples?: string[];
  images?: string[];
};

export type DataFile = {
  libraries: Library[];
  topics: Record<string, number>;
  topicsList: string[];
};
