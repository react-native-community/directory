const GitHubLicensesQuery = `
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

export default GitHubLicensesQuery;
