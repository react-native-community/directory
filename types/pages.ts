import {
  type APIResponseType,
  type LibraryType,
  type NpmRegistryData,
  type NpmRegistryVersionData,
  type Query,
} from '~/types';

export type TrendingPageProps = {
  data: APIResponseType;
  query: Query;
};

export type PopularPageProps = {
  data: LibraryType[];
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
  errorMessage?: string;
};

export type PackageScorePageProps = {
  packageName: string;
  apiData: {
    libraries: LibraryType[];
  };
  errorMessage?: string;
};
