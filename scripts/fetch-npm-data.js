import 'isomorphic-fetch';

const urlForPackage = pkgName => {
  return `https://api.npmjs.org/downloads/point/last-month/${pkgName}`;
};

const fetchNpmData = async (data, pkgName) => {
  try {
    console.log(urlForPackage(pkgName));
    let response = await fetch(urlForPackage(pkgName));
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
