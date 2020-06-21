import fetch from 'isomorphic-fetch';
require('dotenv').config();

const API = 'https://api.github.com';
const GRAPHQL_API = 'https://api.github.com/graphql';

const Authorization = `bearer ${process.env.GITHUB_TOKEN}`;

const query = `
  query ($repoOwner: String!, $repoName: String!, $packagePath: String = ".", $packageJsonPath: String = "HEAD:package.json") {
    repository(owner: $repoOwner, name: $repoName) {
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
      licenseInfo {
        key
        name
        spdxId
        url
        id
      }
      deployments {
        totalCount
      }
      repositoryTopics(first: 10) {
        nodes {
          topic {
            name
          }
        }
      }
      defaultBranchRef {
        target {
          ... on Commit {
            id
            history(path: $packagePath, first: 1) {
              nodes {
                committedDate
                message
              }
            }
          }
        }
      }
      packageJson:object(expression: $packageJsonPath) {
        ... on Blob {
          text
        }
      }
    }
  }
`;

const makeGraphqlQuery = async (query, variables) => {
  const result = await fetch(GRAPHQL_API, {
    method: 'POST',
    headers: {
      Authorization,
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  const json = await result.json();
  return json;
};

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

const getUpdatedUrl = async url => {
  try {
    const result = await fetch(url);
    return result.url;
  } catch {
    return url;
  }
};

const parseUrl = url => {
  const [, , , repoOwner, repoName, ...path] = url.split('/');
  const isMonorepo = !!(path && path.length);
  const packagePath = isMonorepo ? path.slice(2).join('/') : '.';

  return {
    repoOwner,
    repoName,
    isMonorepo,
    packagePath,
  };
};

export const fetchGithubData = async (data, retries = 2) => {
  if (retries < 0) {
    console.log(`ERROR fetching ${data.githubUrl} - OUT OF RETRIES`);
    return data;
  }
  try {
    const url = data.githubUrl;
    const { isMonorepo, repoOwner, repoName, packagePath } = parseUrl(url);

    const result = await makeGraphqlQuery(query, {
      repoOwner,
      repoName,
      packagePath,
      packageJsonPath: `HEAD:${packagePath === '.' ? '' : `${packagePath}/`}package.json`,
    });

    if (!result.data.repository && result.errors && result.errors[0].type === 'NOT_FOUND') {
      const newUrl = await getUpdatedUrl(url);
      if (newUrl !== url) {
        console.log(`Repository ${repoOwner}/${repoName} has moved to ${newUrl}`);
        data.githubUrl = newUrl;
      } else {
        console.log(`Repository ${repoOwner}/${repoName} not found`);
      }
      return fetchGithubData(data, retries - 1);
    }

    const github = createRepoDataWithResponse(result.data.repository, isMonorepo);
    return {
      ...data,
      github,
    };
  } catch (e) {
    console.log(`retrying fetch for ${data.githubUrl}`);
    return fetchGithubData(data, retries - 1);
  }
};

const createRepoDataWithResponse = (json, monorepo) => {
  if (monorepo && json.packageJson) {
    const packageJson = JSON.parse(json.packageJson.text);
    json.homepageUrl = packageJson.homepage;
    json.name = packageJson.name;
    json.topics = packageJson.topics;
    json.description = packageJson.description;
    json.license = packageJson.license;
  }
  const lastCommit = json.defaultBranchRef.target.history.nodes[0].committedDate;

  return {
    urls: {
      repo: json.url,
      clone: `${json.url}.git`,
      homepage: json.homepageUrl,
    },
    stats: {
      hasIssues: json.hasIssuesEnabled,
      hasWiki: json.hasWikiEnabled,
      hasPages: json.deployments.totalCount > 0,
      hasDownloads: true,
      hasTopics: json.topics ? json.repositoryTopics.nodes.length > 0 : false,
      updatedAt: lastCommit,
      createdAt: json.createdAt,
      pushedAt: lastCommit,
      forks: json.forks.totalCount,
      issues: json.issues.totalCount,
      subscribers: json.watchers.totalCount,
      stars: json.stargazers.totalCount,
    },
    name: json.name,
    fullName: json.nameWithOwner,
    description: json.description,
    topics: json.repositoryTopics.nodes.map(({ topic }) => topic.name),
    license: json.licenseInfo,
  };
};
