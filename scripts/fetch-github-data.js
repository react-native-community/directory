import 'isomorphic-fetch';
import { createApolloFetch } from 'apollo-fetch';

import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_OATH_TOKEN,
} from '../secrets.json';

// OLD WAY

const API = 'https://api.github.com';

const createRepoDataWithResponse = json => {
  return {
    urls: {
      repo: json.html_url, // *
      clone: json.clone_url, // *
      homepage: json.homepage, // *
    },
    stats: {
      hasIssues: json.has_issues, // *
      hasWiki: json.has_wiki, // *
      hasPages: json.has_pages, // ???
      hasDownloads: json.has_downloads, // ???
      hasTopics: json.topics ? json.topics.length > 0 : false, // *
      updatedAt: json.updated_at, // *
      createdAt: json.created_at, // *
      pushedAt: json.pushed_at, // *
      forks: json.forks, // *
      issues: json.open_issues, // *
      subscribers: json.subscribers_count, // *
      stars: json.stargazers_count, // *
    },
    name: json.name, // *
    fullName: json.full_name, // *
    description: json.description, // *
    topics: json.topics, // *
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

export const fetchGithubData = async data => {
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

// NEW GRAPHQL WAY

const GRAPHQL_API = 'https://api.github.com/graphql';

const query = `
  query { 
    repository(owner: $repoCreator, name: $repoName) {
      hasIssuesEnabled
      hasWikiEnabled
      issues(states: OPEN) {
        totalCount
      }
      watchers {
        totalCount
      }
      stargazers {
        totalCount
      }
      forks {
        totalCount
      }
      description
      createdAt
      pushedAt
      updatedAt
      homepageUrl
      url
      mirrorUrl
      name
      nameWithOwner
      ref(qualifiedName: "master") {
        target {
          ... on Commit {
            id
            committedDate
          }
        }
      }
      repositoryTopics(first: 10) {
        nodes {
          topic {
            name
          }
        }
      }
    }
  }
`;

const createRepoDataWithResponse = rawData => {
  return {
    urls: {
      repo: rawData.url,
      clone: rawData.mirrorUrl,
      homepage: rawData.homepageUrl,
    },
    stats: {
      hasIssues: rawData.hasIssuesEnabled,
      hasWiki: rawData.hasWikiEnabled,
      hasTopics: rawData.repositoryTopics.nodes
        ? repositoryTopics.nodes.length > 0
        : false,
      updatedAt: rawData.updatedAt,
      createdAt: rawData.createdAt,
      pushedAt: rawData.pushedAt,
      forks: rawData.forks.totalCount,
      issues: rawData.issues.totalCount,
      subscribers: rawData.watchers.totalCount,
      stars: rawData.stargazers.totalCount,
    },
    name: rawData.name,
    fullName: rawData.nameWithOwner,
    description: rawData.description,
    topics: rawData.repositoryTopics.nodes.map(topic => {
      return topic.name;
    }),
    lastMasterCommitData: rawData.ref.target.committedDate,
  };
};

export const fetchGithubDataViaGraphQL = async data => {
  let url = data.githubUrl;

  console.log('processing: ', url);

  const tokens = url.split('/');
  const repoName = tokens[tokens.length - 1];
  const repoCreator = tokens[tokens.length - 2];

  const variables = {
    repoName,
    repoCreator,
  };

  const apolloFetch = createApolloFetch({ GRAPHQL_API });

  apolloFetch.use(({ request, options }, next) => {
    if (!options.headers) {
      options.headers = {}; // Create the headers object if needed.
    }
    options.headers['Authorization'] = 'bearer ' + `${GITHUB_OATH_TOKEN}`;

    next();
  });

  try {
    const json = await apolloFetch({ query, variables });

    const result = createRepoDataWithResponseGraphQL(json.data.repository);

    return {
      ...data,
      github: result,
    };
  } catch (error) {
    console.log('something went wrong: ', error);
  }
};
