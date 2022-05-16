import { NextApiRequest, NextApiResponse } from 'next';

import data from '../../../assets/data.json';

type RequestBody = {
  reactNativeVersion: string;
  expoSdkVersion: string;
  packages: string[];
};

type PackageInfo = {
  npmPackage: string;
  sdkVersion?: string;
  versionRange: string | null;
};
type ExpoVersionsData = {
  sdkVersions: {
    [keyof: string]: {
      facebookReactNativeVersion: string;
    };
  };
};

const EXPO_API_V2 = 'https://exp.host';

async function fetchExpoVersionsAsync(): Promise<{ data: ExpoVersionsData }> {
  const url = new URL('/--/api/v2/versions/latest', EXPO_API_V2);
  const req = await fetch(url);
  return req.json();
}

async function fetchNativeModulesAsync(sdkVersion: string): Promise<{ data: PackageInfo[] }> {
  const url = new URL(`/--/api/v2/sdks/${sdkVersion}/native-modules`, EXPO_API_V2);
  const req = await fetch(url);
  return req.json();
}

function lookupPackageForReactNative(rnVersion: string, packages: string[]) {
  return data.libraries
    .filter(lib => packages.includes(lib.npmPkg) && lib.rnVersions?.[rnVersion])
    .map(lib => ({
      npmPackage: lib.npmPkg,
      versionRange: lib.rnVersions[rnVersion],
    }));
}

async function processRequestAsync(data: RequestBody): Promise<PackageInfo[]> {
  const { expoSdkVersion, reactNativeVersion, packages } = data;
  if (expoSdkVersion) {
    const { data } = await fetchNativeModulesAsync(expoSdkVersion);
    const resolvedPackage = new Set();
    const result = data.filter(({ npmPackage }) => {
      if (packages.includes(npmPackage)) {
        resolvedPackage.add(npmPackage);
        return true;
      }
      return false;
    });

    const missingPackages = packages.filter(pkg => !resolvedPackage.has(pkg));
    if (missingPackages.length === 0) {
      // All packages are resolved by Expo Native Modules.
      return result;
    }

    // Continue looking for missing package based on RN version.
    let rnVersion = reactNativeVersion;
    if (!rnVersion) {
      const { data: versionsData } = await fetchExpoVersionsAsync();
      if (!versionsData.sdkVersions[expoSdkVersion]) {
        throw new Error(`invalid expoSdkVersion: ${expoSdkVersion}`);
      }

      ({ facebookReactNativeVersion: rnVersion } = versionsData.sdkVersions[expoSdkVersion]);
    }
    return result.concat(lookupPackageForReactNative(rnVersion, missingPackages));
  } else if (reactNativeVersion) {
    return lookupPackageForReactNative(reactNativeVersion, packages);
  }

  return [];
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body as RequestBody;
  try {
    const packages = await processRequestAsync(body);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
      ...body,
      packages: packages.map(({ npmPackage, sdkVersion, versionRange }) => ({
        npmPackage,
        sdkVersion,
        versionRange,
      })),
    });
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({ error: 'Internal server error' });
  }
}
