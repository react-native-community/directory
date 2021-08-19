export type QueryOrder =
  | 'updated'
  | 'added'
  | 'recommended'
  | 'quality'
  | 'popularity'
  | 'issues'
  | 'downloads'
  | 'stars';

export type Query = {
  android?: string;
  expo?: string;
  ios?: string;
  macos?: string;
  tvos?: string;
  web?: string;
  windows?: string;
  order?: QueryOrder;
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
};

export type Library = {
  goldstar: boolean;
  githubUrl: string;
  ios?: boolean;
  android?: boolean;
  web?: boolean;
  expo?: boolean;
  windows?: boolean;
  macos?: boolean;
  tvos?: boolean;
  unmaintained?: boolean;
  dev?: boolean;
  template?: boolean;
  github: {
    urls: {
      repo: string;
      clone: string;
      homepage: string | null;
    };
    stats: {
      hasIssues: boolean;
      hasWiki: boolean;
      hasPages: boolean;
      hasDownloads: boolean;
      hasTopics: boolean;
      updatedAt: Date;
      createdAt: Date;
      pushedAt: Date;
      forks: number;
      issues: number;
      subscribers: number;
      stars: number;
    };
    name: string;
    fullName: string;
    description: string;
    topics: [];
    license: {
      key: string;
      name: string;
      spdxId: string;
      url: string;
      id: string;
    };
    lastRelease: {
      name: string;
      tagName: string;
      createdAt: Date;
      publishedAt: Date;
      isPrerelease: boolean;
    };
    hasTypes: boolean;
  };
  npm: {
    downloads: number;
    weekDownloads: number;
    start: string;
    end: string;
    period: string;
  };
  score: number;
  matchingScoreModifiers: string[];
  topicSearchString: string;
  examples?: string[];
  images?: string[];
  npmPkg?: string;
  nameOverride?: string;
  popularity: number;
  matchScore?: number;
};
