import { config } from 'dotenv';

import {
  processTopics,
  sleep,
  REQUEST_SLEEP,
  makeGraphqlQuery,
  parseGitHubUrl,
  getUpdatedUrl,
} from './helpers';
import GitHubLicensesQuery from './queries/GitHubLicensesQuery';
import GitHubRepositoryQuery from './queries/GitHubRepositoryQuery';

config();

const licenses = {};

/**
 * Fetch licenses from GitHub to be used later to parse licenses from npm
 */
export const loadGitHubLicenses = async () => {
  const result = await makeGraphqlQuery(GitHubLicensesQuery);

  result.data.licenses.forEach(license => {
    licenses[license.key] = license;
  });
};

export const fetchGithubRateLimit = async () => {
  // Accurately fetch query rate limit and cost by making dummy request
  // https://developer.github.com/v4/guides/resource-limitations/
  const result = await makeGraphqlQuery(GitHubRepositoryQuery, {
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
    console.log('[GH] GraphQL API error:', result.errors);
  }

  return {};
};

export const fetchGithubData = async (data, retries = 2) => {
  if (retries < 0) {
    console.error(`[GH] ERROR fetching ${data.githubUrl} - OUT OF RETRIES`);
    return data;
  }
  try {
    const url = data.githubUrl;
    const { isMonorepo, repoOwner, repoName, packagePath } = parseGitHubUrl(url);
    const fullName = `${repoOwner}/${repoName}`;

    const result = await makeGraphqlQuery(GitHubRepositoryQuery, {
      repoOwner,
      repoName,
      packagePath,
      packageJsonPath: `HEAD:${packagePath === '.' ? '' : `${packagePath}/`}package.json`,
    });

    if (result.errors) {
      if (result.errors[0].type === 'NOT_FOUND') {
        const newUrl = await getUpdatedUrl(url);
        if (newUrl !== url) {
          console.warn(`[GH] Repository ${fullName} has moved to ${newUrl}`);
          data.githubUrl = newUrl;
        } else {
          console.warn(`[GH] Repository ${fullName} not found`);
        }
      } else {
        console.warn(`[GH] Data fetch error for ${fullName}`, result.errors);
      }

      console.log(`[GH] Retrying fetch for ${data.githubUrl} due to error result`);
      await sleep(REQUEST_SLEEP, REQUEST_SLEEP * 2);
      return await fetchGithubData(data, retries - 1);
    }

    if (!result?.data?.repository) {
      console.log(
        `[GH] Retrying fetch for ${data.githubUrl} due to ${result?.message?.toLowerCase() ?? 'missing data'} (status: ${result?.status ?? 'Unknown'})`
      );
      await sleep(REQUEST_SLEEP, REQUEST_SLEEP * 2);
      return await fetchGithubData(data, retries - 1);
    }

    const github = createRepoDataWithResponse(result.data.repository, isMonorepo);
    return {
      ...data,
      github,
    };
  } catch (error) {
    console.log(`[GH] Retrying fetch for ${data.githubUrl} due to an error`, error);
    await sleep(REQUEST_SLEEP, REQUEST_SLEEP * 2);
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
  if (json.packageJson) {
    try {
      const packageJson = JSON.parse(json.packageJson.text);

      json.newArchitecture = Boolean(packageJson.codegenConfig);
      json.name = packageJson.name;
      json.isPackagePrivate = packageJson.private ?? false;
      json.registry = packageJson?.publishConfig?.registry ?? undefined;

      if (monorepo) {
        json.homepageUrl = packageJson.homepage;
        json.topics = processTopics(packageJson.keywords);
        json.description = packageJson.description;
        json.licenseInfo = getLicenseFromPackageJson(packageJson);
      }

      if (!monorepo) {
        json.topics = [
          ...new Set([
            ...processTopics(packageJson.keywords),
            ...processTopics(json.repositoryTopics.nodes.map(({ topic }) => topic.name)),
          ]),
        ];

        json.description ??= packageJson.description;

        if (!json.licenseInfo || (json.licenseInfo && json.licenseInfo.key === 'other')) {
          json.licenseInfo = getLicenseFromPackageJson(packageJson) ?? json.licenseInfo;
        }
      }

      if (packageJson.types || packageJson.typings) {
        json.types = true;
      }
    } catch (e) {
      console.error(`Unable to parse ${json.name} package.json file!`);
      console.error(e);
    }
  }

  if (!monorepo) {
    json.lastRelease =
      json.releases && json.releases.nodes && json.releases.nodes.length
        ? json.releases.nodes[0]
        : undefined;
  }

  const lastCommitAt = json.defaultBranchRef.target.history.nodes[0].committedDate;

  return {
    urls: {
      repo: json.url,
      homepage: json?.homepageUrl?.length > 0 ? json.homepageUrl : null,
    },
    stats: {
      hasIssues: json.hasIssuesEnabled,
      hasWiki: json.hasWikiEnabled,
      hasSponsorships: json.hasSponsorshipsEnabled,
      hasDiscussions: json.hasDiscussionsEnabled,
      hasTopics: json.topics && json.topics.length > 0,
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
    isPrivate: json.isPackagePrivate,
    registry: json.registry,
    description: json.description,
    topics: json.topics,
    license: json.licenseInfo,
    hasTypes: json.types ?? false,
    newArchitecture: json.newArchitecture,
    isArchived: json.isArchived,
  };
};
