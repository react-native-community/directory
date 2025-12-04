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

export type PackagePageProps = {
  packageName: string;
  apiData: {
    libraries: LibraryType[];
  };
  registryData?: NpmRegistryVersionData;
};

export type PackageVersionsPageProps = {
  packageName: string;
  apiData: {
    libraries: LibraryType[];
  };
  registryData?: NpmRegistryData;
};
