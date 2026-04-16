import {
  type APIResponseType,
  type LibraryType,
  type NpmPerVersionDownloads,
  type NpmRegistryData,
  type NpmRegistryVersionData,
  type Query,
  type StatisticResultType,
} from '~/types';

export type HomePageProps = {
  mostDownloaded: APIResponseType;
  recentlyAdded: APIResponseType;
  recentlyUpdated: APIResponseType;
  popular: APIResponseType;
  statistic: StatisticResultType;
};

export type TrendingPageProps = {
  data: APIResponseType;
  query: Query;
};

export type PopularPageProps = {
  core: APIResponseType;
  android: APIResponseType;
  ios: APIResponseType;
  web: APIResponseType;
  macos: APIResponseType;
  tvos: APIResponseType;
  visionos: APIResponseType;
  windows: APIResponseType;
  expoGo: APIResponseType;
  fireos: APIResponseType;
  horizon: APIResponseType;
  vegaos: APIResponseType;
};

export type PackageOverviewPageProps = {
  packageName: string;
  apiData: {
    libraries: LibraryType[];
  };
  registryData?: NpmRegistryVersionData;
  errorMessage?: string;
};

export type PackageVersionsPageProps = {
  packageName: string;
  apiData: {
    libraries: LibraryType[];
  };
  registryData?: NpmRegistryData;
  npmDownloads?: NpmPerVersionDownloads;
  errorMessage?: string;
};

export type PackageScorePageProps = {
  packageName: string;
  apiData: {
    libraries: LibraryType[];
  };
  errorMessage?: string;
};

export type PackageCodePageProps = {
  packageName: string;
  apiData: {
    libraries: LibraryType[];
  };
  errorMessage?: string;
};
