const GitHubRepositoryQuery = `
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
      hasSponsorshipsEnabled
      hasDiscussionsEnabled
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

export default GitHubRepositoryQuery;
