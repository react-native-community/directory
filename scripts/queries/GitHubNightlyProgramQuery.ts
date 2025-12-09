const GitHubNightlyProgramQuery = `
  query (
    $repoOwner: String = "react-native-community",
    $repoName: String = "nightly-tests",
    $librariesDefinitionPath: String = "HEAD:libraries.json"
  ) {
    repository(owner: $repoOwner, name: $repoName) {
      librariesJson:object(expression: $librariesDefinitionPath) {
        ... on Blob {
          text
        }
      }
    }
  }
`;

export default GitHubNightlyProgramQuery;
