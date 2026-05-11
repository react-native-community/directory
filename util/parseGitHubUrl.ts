export function parseGitHubUrl(url: string) {
  const [, , , repoOwner, repoName, ...path] = url.split('/');

  const isMonorepo = !!(path && path.length);
  const branchName = path[1];
  const packagePath = isMonorepo ? path.slice(2).join('/').replace('%40', '@') : '.';

  return {
    repoOwner,
    repoName,
    isMonorepo,
    branchName,
    packagePath,
  };
}
