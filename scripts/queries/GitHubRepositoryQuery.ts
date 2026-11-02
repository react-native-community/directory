const GitHubRepositoryQuery = `
  query (
    $repoOwner: String!,
    $repoName: String!,
    $packagePath: String = ".",
    $packageFilesPath: String = "HEAD:.",
    $packageJsonPath: String = "HEAD:package.json",
    $packageSwiftPath: String = "HEAD:Package.swift",
    $iosPackageSwiftPath: String = "HEAD:ios/Package.swift",
    $reactNativeConfigPath: String = "HEAD:react-native.config.js",
    $fetchRoot: Boolean = false
  ) {
    rateLimit {
      limit
      cost
      remaining
      resetAt
    }
    repository(owner: $repoOwner, name: $repoName) {
      hasDiscussionsEnabled
      hasIssuesEnabled
      hasProjectsEnabled
      hasSponsorshipsEnabled
      hasWikiEnabled
      hasVulnerabilityAlertsEnabled
      issues(states: OPEN) {
        totalCount
      }
      watchers {
        totalCount
      }
      stargazerCount
      forkCount
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
      isPrivate
      licenseInfo {
        key
        name
        spdxId
        url
        id
      }
      repositoryTopics(first: 15) {
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
      packageSwift:object(expression: $packageSwiftPath) {
        ... on Blob {
          text
        }
      }
      iosPackageSwift:object(expression: $iosPackageSwiftPath) {
        ... on Blob {
          text
        }
      }
      reactNativeConfig:object(expression: $reactNativeConfigPath) {
        ... on Blob {
          text
        }
      }
      files: object(expression: $packageFilesPath) {
        ... on Tree {
          entries {
            name
            type
          }
        }
      }
      rootPackageJson: object(expression: "HEAD:package.json") @include(if: $fetchRoot) {
        ... on Blob {
          text
        }
      }
      rootFiles: object(expression: "HEAD:") @include(if: $fetchRoot) {
        ... on Tree {
          entries {
            name
            type
          }
        }
      }
    }
  }
`;

export default GitHubRepositoryQuery;
