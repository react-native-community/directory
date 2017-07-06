import 'isomorphic-fetch';

const urlForPackage = npmPkg => {
  return `https://api.npmjs.org/downloads/point/last-month/${npmPkg}`;
};

const fetchNpmData = async (data, npmPkg, githubUrl) => {
  if (!npmPkg) {
    let parts = githubUrl.split('/');
    npmPkg = parts[parts.length - 1];
    data.npmPkg = npmPkg;
  }

  try {
    console.log(urlForPackage(npmPkg));
    let response = await fetch(urlForPackage(npmPkg));
    let downloadData = await response.json();

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
    return {
      ...data,
      npm: {
        dataFetchError: e.message,
      },
    };
  }
};

export default fetchNpmData;
