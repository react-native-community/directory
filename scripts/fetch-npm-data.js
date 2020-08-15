import fetch from 'isomorphic-fetch';

import { sleep } from './build-and-score-data';

const urlForPackage = npmPkg => {
  return `https://api.npmjs.org/downloads/point/last-month/${npmPkg.toLowerCase()}`;
};

const fetchNpmData = async (data, npmPkg, githubUrl) => {
  if (!npmPkg) {
    let parts = githubUrl.split('/');
    npmPkg = parts[parts.length - 1];
    data.npmPkg = npmPkg;
  }

  try {
    const url = urlForPackage(npmPkg);
    console.log('processing:', url);
    let response = await fetch(url);
    let downloadData = await response.json();

    if (!downloadData.downloads) {
      console.log(
        `${npmPkg} doesn't exist on npm registry, add npmPkg to its entry in react-native-libraries.json to clarify it`
      );
      return { ...data, npm: {} };
    }

    return {
      ...data,
      npm: {
        downloads: downloadData.downloads,
        start: downloadData.start,
        end: downloadData.end,
        period: 'month',
      },
    };
  } catch (e) {
    console.log(`Retrying npm data fetch for ${githubUrl}`);
    await sleep(1000);
    return await fetchNpmData(data, npmPkg, githubUrl);
  }
};

export default fetchNpmData;
