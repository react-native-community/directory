import fetch from 'isomorphic-fetch';

import { sleep } from './build-and-score-data';

require('dotenv').config();

const GRAPHQL_API = 'https://api.github.com/graphql';

const Authorization = `bearer ${process.env.GITHUB_TOKEN}`;

let licenses = {};

/**
 * Fetch licenses from github to be used later to parse licenses from npm
 */
export const loadGitHubLicenses = async () => {
  const query = `
    query {
      licenses {
        name
        url
        id
        key
        spdxId
      }
    }
  `;

  const result = await makeGraphqlQuery(query);

  result.data.licenses.forEach(license => {
    licenses[license.key] = license;
  });
};

const query = `
  query ($repoOwner: String!, $repoName: String!, $packagePath: String = ".", $packageJsonPath: String = "HEAD:package.json") {
    rateLimit {
      limit
      cost
      remaining
      resetAt
    }
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
      isArchived
      isMirror
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
      releases(first: 1, orderBy: {field: CREATED_AT, direction: DESC}) {
        nodes {
          name
          createdAt
          publishedAt
          isPrerelease
        }
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
  return await result.json();
};

export const fetchGithubRateLimit = async () => {
  // Accurately fetch query rate limit and cost by making dummy request
  // https://developer.github.com/v4/guides/resource-limitations/
  const result = await makeGraphqlQuery(query, {
    repoOwner: 'react-native-directory',
    repoName: 'website',
  });

  if (result.data) {
    const { rateLimit } = result.data;
    return {
      apiLimit: rateLimit.limit,
      apiLimitRemaining: rateLimit.remaining,
      apiLimitCost: rateLimit.cost,
    };
  }

  if (result.errors) {
    console.log('GitHub GraphQL API error:', result.errors);
  }

  return {};
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
      console.log(`Retrying fetch for ${data.githubUrl}`);
      await sleep(1000);
      return await fetchGithubData(data, retries - 1);
    }

    const github = createRepoDataWithResponse(result.data.repository, isMonorepo);
    return {
      ...data,
      github,
    };
  } catch (e) {
    console.log(`Retrying fetch for ${data.githubUrl}`, e);
    await sleep(1000);
    return await fetchGithubData(data, retries - 1);
  }
};

const getLicenseFromPackageJson = packageJson => {
  // Get the GitHub license spec from the npm string
  if (packageJson.license && typeof packageJson.license === 'string') {
    return licenses[packageJson.license.toLowerCase()];
  }
};

const createRepoDataWithResponse = (json, monorepo) => {
  if (monorepo && json.packageJson) {
    const packageJson = JSON.parse(json.packageJson.text);
    json.homepageUrl = packageJson.homepage;
    json.name = packageJson.name;
    json.topics = packageJson.keywords;
    json.description = packageJson.description;
    json.licenseInfo = getLicenseFromPackageJson(packageJson);
  }

  if (!monorepo && json.packageJson) {
    const packageJson = JSON.parse(json.packageJson.text);
    json.topics = json.repositoryTopics.nodes.map(({ topic }) => topic.name);

    if (!json.description) {
      json.description = packageJson.description;
    }

    if (json.topics.length === 0) {
      json.topics = packageJson.keywords;
    }
  }

  const lastCommitAt = json.defaultBranchRef.target.history.nodes[0].committedDate;
  const lastRelease =
    json.releases && json.releases.nodes && json.releases.nodes.length
      ? json.releases.nodes[0]
      : undefined;

  const hasTopics = json.topics && json.topics.length;
  const topics = hasTopics ? json.topics.map(topic => topic.toLowerCase()) : [];

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
      hasTopics,
      updatedAt: lastCommitAt,
      createdAt: json.createdAt,
      pushedAt: lastCommitAt,
      forks: json.forks.totalCount,
      issues: json.issues.totalCount,
      subscribers: json.watchers.totalCount,
      stars: json.stargazers.totalCount,
    },
    name: json.name,
    fullName: json.nameWithOwner,
    description: json.description,
    topics,
    license: json.licenseInfo,
    lastRelease,
  };
};
