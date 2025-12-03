import { type LibraryType, type NpmRegistryData, type NpmRegistryVersionData } from '~/types';

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
