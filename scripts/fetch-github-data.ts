import { config } from 'dotenv';

import { type LibraryLicenseType, type LibraryType } from '~/types';
import detectModuleType from '~/util/detectModuleType';
import hasConfigPlugin from '~/util/hasConfigPlugin';
import hasNativeCode from '~/util/hasNativeCode';
import { parseGitHubUrl } from '~/util/parseGitHubUrl';

import { processTopics, sleep, REQUEST_SLEEP, makeGraphqlQuery, getUpdatedUrl } from './helpers';
import GitHubLicensesQuery from './queries/GitHubLicensesQuery';
import GitHubRepositoryQuery from './queries/GitHubRepositoryQuery';

config();

const licenses: Record<string, LibraryLicenseType> = {
  isc: {
    id: 'isc',
    name: 'ISC License',
    url: 'https://www.isc.org/licenses/',
    key: 'isc',
    spdxId: 'ISC',
  },
};

/**
 * Fetch licenses from GitHub to be used later to parse licenses from npm
 */
export async function loadGitHubLicenses() {
  const result = await makeGraphqlQuery(GitHubLicensesQuery);

  result.data.licenses.forEach((license: LibraryLicenseType) => {
    licenses[license.key] = license;
  });
}

export async function fetchGithubRateLimit() {
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
}

export async function fetchGithubData(data: LibraryType, retries = 2): Promise<LibraryType> {
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
      packageFilesPath: packagePath === '.' ? 'HEAD:' : `HEAD:${packagePath}`,
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
}

// Get the GitHub license spec from the npm string
function getLicenseFromPackageJson(packageJson: Record<string, string | object>) {
  if (packageJson.license && typeof packageJson.license === 'string') {
    return licenses[packageJson.license.toLowerCase()];
  }
}

function createRepoDataWithResponse(json: any, monorepo: boolean): LibraryType['github'] {
  if (json.packageJson) {
    try {
      const packageJson = JSON.parse(json.packageJson.text);

      json.pasedPackageJson = packageJson;
      json.newArchitecture = Boolean(packageJson.codegenConfig);
      json.name = packageJson.name;
      json.isPackagePrivate = packageJson.private ?? false;
      json.registry = packageJson?.publishConfig?.registry ?? undefined;
      json.dependenciesCount = packageJson.dependencies
        ? Object.keys(packageJson.dependencies).length
        : 0;

      if (monorepo) {
        json.homepageUrl = packageJson.homepage;
        json.topics = processTopics(packageJson.keywords);
        json.description = packageJson.description;
        json.licenseInfo = getLicenseFromPackageJson(packageJson);
      }

      if (!monorepo) {
        const rawTopics = [
          ...processTopics(packageJson.keywords),
          ...processTopics(
            json.repositoryTopics.nodes.map(({ topic }: { topic: { name: string } }) => topic.name)
          ),
        ];
        json.topics = [...new Set(rawTopics)];

        json.description ??= packageJson.description;

        if (!json.homepageUrl) {
          json.homepageUrl = packageJson.homepage;
        }

        if (!json.licenseInfo || (json.licenseInfo && json.licenseInfo.key === 'other')) {
          json.licenseInfo = getLicenseFromPackageJson(packageJson) ?? json.licenseInfo;
        }
      }

      if (packageJson.types || packageJson.typings) {
        json.types = true;
      }
    } catch (error) {
      console.error(`Unable to parse ${json.name} package.json file!`);
      console.error(error);
    }
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
      hasProjects: json.hasProjectsEnabled,
      hasVulnerabilityAlerts: json.hasVulnerabilityAlertsEnabled,
      hasTopics: json.topics && json.topics.length > 0,
      fundingLinks: json.fundingLinks,
      updatedAt: lastCommitAt,
      createdAt: json.createdAt,
      pushedAt: lastCommitAt,
      forks: json.forks.totalCount,
      issues: json.issues.totalCount,
      subscribers: json.watchers.totalCount,
      stars: json.stargazers.totalCount,
      dependencies: json.dependenciesCount,
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
    hasNativeCode: hasNativeCode(json.files),
    configPlugin: hasConfigPlugin(json.files),
    moduleType: detectModuleType(json.files, json.pasedPackageJson),
  };
}
