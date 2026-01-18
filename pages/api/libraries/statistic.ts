import { type NextApiRequest, type NextApiResponse } from 'next';

import data from '~/assets/data.json';
import { type DataAssetType, type StatisticResultType } from '~/types';
import { getNewArchSupportStatus, NewArchSupportStatus } from '~/util/newArchStatus';

const DATASET = data as DataAssetType;

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  const result: StatisticResultType = {
    total: 0,
    newArchitecture: 0,
    downloads: 0,
    weekDownloads: 0,
    unmaintained: 0,
    withTypes: 0,
    withNativeCode: 0,
    withConfigPlugin: 0,
    ios: 0,
    android: 0,
    web: 0,
    expoGo: 0,
    windows: 0,
    macos: 0,
    fireos: 0,
    horizon: 0,
    tvos: 0,
    visionos: 0,
    vegaos: 0,
  };

  DATASET.libraries.forEach(library => {
    result.total++;

    if (
      [NewArchSupportStatus.Supported, NewArchSupportStatus.NewArchOnly].includes(
        getNewArchSupportStatus(library)
      )
    ) {
      result.newArchitecture++;
    }

    if (library.npm?.downloads) {
      result.downloads += library.npm.downloads;
    }

    if (library.npm?.weekDownloads) {
      result.weekDownloads += library.npm.weekDownloads;
    }

    if (library.unmaintained === true) {
      result.unmaintained++;
    }

    if (library.github.hasTypes) {
      result.withTypes++;
    }

    if (library.github.hasNativeCode) {
      result.withNativeCode++;
    }

    if (library.configPlugin || library.github.configPlugin) {
      result.withConfigPlugin++;
    }

    if (library.ios) {
      result.ios++;
    }

    if (library.android) {
      result.android++;
    }

    if (library.web) {
      result.web++;
    }

    if (library.expoGo) {
      result.expoGo++;
    }

    if (library.windows) {
      result.windows++;
    }

    if (library.macos) {
      result.macos++;
    }

    if (library.fireos) {
      result.fireos++;
    }

    if (library.horizon) {
      result.horizon++;
    }

    if (library.tvos) {
      result.tvos++;
    }

    if (library.visionos) {
      result.visionos++;
    }

    if (library.vegaos) {
      result.vegaos++;
    }
  });

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=300');
  res.statusCode = 200;

  return res.json(result);
}
