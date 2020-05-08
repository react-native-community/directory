import fetch from 'isomorphic-fetch';
require('dotenv').config();

const API = 'https://api.github.com';

// Authorization header as required by the GitHub API
const Authorization =
  'Basic ' +
  Buffer.from(`${process.env.GITHUB_CLIENT_ID}:${process.env.GITHUB_CLIENT_SECRET}`).toString(
    'base64'
  );

// https://github.com/expo/expo/tree/master/packages/expo-camera
const fetchPackageJson = async url => {
  try {
    let rawUrl = url.replace('github.com', 'raw.githubusercontent.com').replace('/tree', '');
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
    // sleep 1000ms
    await setTimeout(() => {}, 5000);
    return await fetchPackageJson(url);
  }
};

function isMonorepo(url) {
  return url.includes('/tree/master/');
}

export const fetchGithubRateLimit = async () => {
  let url = API;
  let result = await fetch(url, {
    method: 'GET',
    headers: { Authorization },
  });

  return {
    apiLimit: parseInt(result.headers.get('x-ratelimit-limit'), 10),
    apiLimitRemaining: parseInt(result.headers.get('x-ratelimit-remaining'), 10),
  };
};

export const fetchGithubData = async data => {
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
        Authorization,
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
      result.license = subrepoData.license;
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
    license: json.license,
  };
};

const createRequestUrl = url => {
  console.log('processing: ', url);

  const tokens = url.split('/');
  const repoName = tokens[tokens.length - 1];
  const repoCreator = tokens[tokens.length - 2];
  const requestUrl = `${API}/repos/${repoCreator}/${repoName}`;

  return requestUrl;
};
