import fetch from 'isomorphic-fetch';
require('dotenv').config();

const API = 'https://api.github.com';

const githubLicenceInfo = async repoName => {
  const requestUrl = `${API}/repos/${repoName}/license?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`;
  let response = await fetch(requestUrl);
  let json = await response.json();
  return json.license || null;
};

const fetchLicense = async (data, repoName) => {
  try {
    let license = await githubLicenceInfo(repoName);

    return {
      ...data,
      license,
    };
  } catch (e) {
    console.log(`retrying license fetch for ${repoName}`);
    console.log(data);
    return await fetchLicense(data, repoName);
  }
};

export default fetchLicense;
