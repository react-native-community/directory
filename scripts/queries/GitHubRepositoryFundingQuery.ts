const GitHubRepositoryFundingQuery = `
  query RepoFundingLinks($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      nameWithOwner
      fundingLinks {
        platform
        url
      }
    }
  }
`;

export default GitHubRepositoryFundingQuery;
