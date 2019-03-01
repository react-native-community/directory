import 'isomorphic-fetch';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '../secrets.json';

const API = 'https://api.github.com';

// https://github.com/expo/expo/tree/master/packages/expo-camera
const fetchPackageJson = async url => {
  try {
    let rawUrl = url
      .replace('github.com', 'raw.githubusercontent.com')
      .replace('/tree', '');
    let packageJsonUrl = `${rawUrl}/package.json`;
    let response = await fetch(packageJsonUrl, { method: 'GET' });
    let pkg = await response.json();

    return {
      name: pkg.name,
      description: pkg.description,
      homepage: pkg.homepage,
      topics: pkg.keywords,
    };
  } catch (e) {
    console.log(`retrying package.json fetch for ${url}`);
    return await fetchPackageJson(url);
  }
};

function isMonorepo(url) {
  return url.includes('/tree/master/');
}

const fetchGithubData = async data => {
  try {
    let url = data.githubUrl;
    let subrepoData;

    // https://github.com/expo/expo/tree/master/packages/expo-camera
    if (isMonorepo(url)) {
      // Uh oh, it's a monorepo!
      subrepoData = await fetchPackageJson(url);

      // Get data from the parent
      url = url.split('/tree/master')[0];
    }

    const requestUrl = createRequestUrl(url);
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github.mercy-preview+json',
      },
    });
    let json = await response.json();
    let result = createRepoDataWithResponse(json);

    if (subrepoData) {
      result.urls.homepage = subrepoData.homepage;
      result.name = subrepoData.name;
      result.topics = subrepoData.topics;
      result.description = subrepoData.description;
    }

    return {
      ...data,
      github: result,
    };
  } catch (e) {
    console.log(`retrying fetch for ${data.githubUrl}`);
    return await fetchGithubData(data);
  }
};

const createRepoDataWithResponse = json => {
  return {
    urls: {
      repo: json.html_url,
      clone: json.clone_url,
      homepage: json.homepage,
    },
    stats: {
      hasIssues: json.has_issues,
      hasWiki: json.has_wiki,
      hasPages: json.has_pages,
      hasDownloads: json.has_downloads,
      hasTopics: json.topics ? json.topics.length > 0 : false,
      updatedAt: json.updated_at,
      createdAt: json.created_at,
      pushedAt: json.pushed_at,
      forks: json.forks,
      issues: json.open_issues,
      subscribers: json.subscribers_count,
      stars: json.stargazers_count,
    },
    name: json.name,
    fullName: json.full_name,
    description: json.description,
    topics: json.topics,
  };
};

const createRequestUrl = url => {
  console.log('processing: ', url);

  const tokens = url.split('/');
  const repoName = tokens[tokens.length - 1];
  const repoCreator = tokens[tokens.length - 2];
  const requestUrl = `${API}/repos/${repoCreator}/${repoName}?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}`;

  return requestUrl;
};

export default fetchGithubData;
