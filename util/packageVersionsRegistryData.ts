import { mapValues, pick } from 'es-toolkit/object';

import { type NpmRegistryData, type PackageVersionData, type PackageVersionsData } from '~/types';

export function trimPackageVersionsData(registryData: NpmRegistryData): PackageVersionsData {
  const versions = mapValues(
    registryData.versions,
    ({ name, version, dist, dependencies, _npmUser }) => {
      const versionData: PackageVersionData = {
        name,
        version,
      };

      if (dist?.unpackedSize) {
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

      return versionData;
    }
  );

  return {
    'dist-tags': registryData['dist-tags'],
    versions,
    time: pick(registryData.time, Object.keys(versions)),
  };
}
