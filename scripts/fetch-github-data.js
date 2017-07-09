import 'isomorphic-fetch';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '../secrets.json';

const API = 'https://api.github.com';

const fetchGithubData = async data => {
  let url = data.githubUrl;

  const requestUrl = createRequestUrl(url);
  const response = await fetch(requestUrl, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github.mercy-preview+json',
    },
  });
  let json = await response.json();
  let result = createRepoDataWithResponse(json);

  return {
    ...data,
    github: result,
  };
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
      watchers: json.watchers_count,
      stars: json.stargazers_count,
    },
    name: json.name,
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
