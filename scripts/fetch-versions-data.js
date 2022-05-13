import npmFetch from 'npm-registry-fetch';
import path from 'path';
import semver from 'semver';

const DEPS_IN_ORDER = ['devDependencies', 'peerDependencies', 'dependencies'];
const REGEXP_VERSION = /^\d+\.\d+\.\d+$/;

function isStableVersion(ver) {
  return REGEXP_VERSION.exec(ver) !== null;
}

function fillSupportVersions(packageManifest, dependencies) {
  if (!packageManifest) {
    return () => false;
  }

  const versionOfDeps = dependencies.reduce((acc, dep) => {
    DEPS_IN_ORDER.forEach(depType => {
      const version = packageManifest[depType]?.[dep];
      if (version) {
        acc[dep] = version;
      }
    });
    return acc;
  }, {});

  return depData => {
    const requiredVersion = versionOfDeps?.[depData.name];
    if (requiredVersion && depData.unsupported.length > 0) {
      depData.unsupported = depData.unsupported.filter(version => {
        if (semver.satisfies(version, requiredVersion)) {
          if (!depData.supports) {
            depData.supports = {};
          }
          depData.supports[version] = packageManifest.version;
          return false;
        }

        return true;
      });
    }

    return depData.unsupported.length === 0;
  };
}

export const fetchVersionsData = async (npmPackage, packages) => {
  const deps = packages.map(({ name }) => name);
  const data = packages.map(({ name, versions: unsupported }) => ({
    name,
    unsupported,
  }));

  const manifest = await npmFetch.json('/' + path.join(npmPackage, 'latest'));
  if (!data.every(fillSupportVersions(manifest, deps))) {
    // Fetch manifest for all versions processing.
    const metadata = await npmFetch.json(npmPackage);

    const versions = Object.keys(metadata.versions).filter(isStableVersion).reverse();
    for (const version of versions) {
      if (data.every(fillSupportVersions(metadata.versions[version], deps))) {
        break;
      }
    }
  }

  return data
    .filter(({ supports }) => !!supports)
    .map(({ name, supports }) => ({ name, supports }));
};
