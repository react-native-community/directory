export type Query = {
  ios?: string;
  expo?: string;
  android?: string;
  web?: string;
  order?: 'quality' | 'recommended' | 'issues' | 'downloads' | 'stars';
  search?: string;
  offset?: string;
};

export type Library = {
  goldstar: boolean;
  githubUrl: string;
  ios: boolean;
  android: boolean;
  web: boolean;
  expo: boolean;
  windows: boolean;
  macos: boolean;
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
      spdx_id: string;
      url: string;
      node_id: string;
    };
  };
  images: string[];
  npmPkg: string;
  npm: { downloads: number; start: string; end: string; period: string };
  score: number;
  matchingScoreModifiers: string[];
  topicSearchString: string;
  examples: string[];
};
