import fetch from 'isomorphic-fetch';

import { sleep } from './build-and-score-data';

const urlForPackage = (npmPkg, period = 'month') => {
  return `https://api.npmjs.org/downloads/point/last-${period}/${npmPkg}`;
};

const fetchNpmData = async (data, npmPkg, githubUrl) => {
  if (!npmPkg) {
    let parts = githubUrl.split('/');
    npmPkg = parts[parts.length - 1].toLowerCase();
    data.npmPkg = npmPkg;
  }

  try {
    const url = urlForPackage(npmPkg);
    console.log('processing:', url);
    let response = await fetch(url);
    let downloadData = await response.json();

    if (!downloadData.downloads) {
      console.warn(
        `${npmPkg} doesn't exist on npm registry, add npmPkg to its entry in react-native-libraries.json to clarify it`
      );
      return { ...data, npm: {} };
    }

    const weekUrl = urlForPackage(npmPkg, 'week');
    console.log('processing:', weekUrl);
    let weekResponse = await fetch(weekUrl);
    let weekDownloadData = await weekResponse.json();

    return {
      ...data,
      npm: {
        downloads: downloadData.downloads,
        weekDownloads: weekDownloadData.downloads,
        start: downloadData.start,
        end: downloadData.end,
        period: 'month',
      },
    };
  } catch (e) {
    console.log(`Retrying npm data fetch for: ${npmPkg}`);
    await sleep(1000);
    return await fetchNpmData(data, npmPkg, githubUrl);
  }
};

export default fetchNpmData;
