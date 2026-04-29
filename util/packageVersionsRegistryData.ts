import { type NpmRegistryData, type PackageVersionData, type PackageVersionsData } from '~/types';

export function trimPackageVersionsData(registryData: NpmRegistryData): PackageVersionsData {
  const versions = Object.entries(registryData.versions).reduce<Record<string, PackageVersionData>>(
    (acc, [versionKey, { name, version, dist, dependencies, _npmUser }]) => {
      const versionData: PackageVersionData = {
        name,
        version,
      };

      if (dist.unpackedSize) {
        versionData.dist = { unpackedSize: dist.unpackedSize };
      }

      if (dependencies) {
        versionData.dependencies = dependencies;
      }

      if (_npmUser) {
        versionData._npmUser = {
          name: _npmUser.name,
          ...(_npmUser.email && { email: _npmUser.email }),
          ...(_npmUser.url && { url: _npmUser.url }),
          ...(_npmUser.trustedPublisher && {
            trustedPublisher: _npmUser.trustedPublisher,
          }),
        };
      }

      acc[versionKey] = versionData;

      return acc;
    },
    {}
  );

  const time = Object.keys(versions).reduce<Record<string, string>>((acc, version) => {
    acc[version] = registryData.time[version];
    return acc;
  }, {});

  return {
    'dist-tags': registryData['dist-tags'],
    versions,
    time,
  };
}
