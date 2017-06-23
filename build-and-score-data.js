import 'isomorphic-fetch';
import jsonfile from 'jsonfile';
import data from './github-repos.json';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from './secrets.json';

const API = 'https://api.github.com';

const getDaysAgo = date => {
  const updateDate = new Date(date).getTime();
  const currentDate = new Date().getTime();

  return (currentDate - updateDate) / 1000 / 60 / 60 / 24;
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
      hasTopics: json.topics.length > 0,
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

const createRepoScore = repo => {
  repo.score = 0;

  const daysAgo = getDaysAgo(repo.stats.updatedAt);

  if (daysAgo <= 30) {
    repo.score += 15;
  } else if (daysAgo <= 60) {
    repo.score += 10;
  } else if (daysAgo <= 90) {
    repo.score += 5;
  }

  if (repo.stats.hasIssues) {
    repo.score += 10;
  }

  if (repo.stats.hasWiki) {
    repo.score += 10;
  }

  if (repo.stats.hasPages) {
    repo.score += 5;
  }

  if (repo.stats.hasDownloads) {
    repo.score += 10;
  }

  if (repo.stats.hasTopics) {
    repo.score += 10;
  }

  if (repo.stats.watchers > 10) {
    repo.score += 5;
  }

  if (repo.stats.forks > 5) {
    repo.score += 10;
  }

  if (repo.stats.stars >= 2500) {
    repo.score += 20;
  } else if (repo.stats.stars >= 500) {
    repo.score += 15;
  } else if (repo.stats.stars >= 100) {
    repo.score += 10;
  }

  return repo;
};

const createRequestUrl = url => {
  console.log('processing: ', url);

  const tokens = url.split('/');
  const repoName = tokens[tokens.length - 1];
  const repoCreator = tokens[tokens.length - 2];
  const requestUrl = `${API}/repos/${repoCreator}/${repoName}?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}`;

  return requestUrl;
};

const createRepoData = async url => {
  const requestUrl = createRequestUrl(url);
  const response = await fetch(requestUrl, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github.mercy-preview+json',
    },
  });
  const json = await response.json();
  const repo = createRepoDataWithResponse(json);

  return createRepoScore(repo);
};

const buildAndScoreData = async () => {
  const expo = await Promise.all(data.expo.map(createRepoData));
  const imcompatible = await Promise.all(data.imcompatible.map(createRepoData));

  const jsonData = {
    expo,
    imcompatible,
  };

  const options = {
    spaces: 2,
  };

  return jsonfile.writeFile('./build/data.json', jsonData, options, err => {
    if (err) {
      console.log(err);
    }
  });

  return console.log('done');
};

buildAndScoreData();
