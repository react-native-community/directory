import "isomorphic-fetch";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "../secrets.json";

const API = "https://api.github.com";

const githubLicenceInfo = async repoName => {
  const requestUrl = `${API}/repos/${repoName}/license?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}`;
  let response = await fetch(requestUrl);
  let json = await response.json();
  return json.license || null;
};

const fetchLicense = async (data, repoName) => {
  let license = await githubLicenceInfo(repoName);

  return {
    ...data,
    license
  };
};

export default fetchLicense;
