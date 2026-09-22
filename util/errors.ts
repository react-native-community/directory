export class MissingPackageJsonError extends Error {
  constructor(public readonly githubUrl: string) {
    super(`GitHub repository directory ${githubUrl} does not contain a 'package.json' file`);
    this.name = 'MissingPackageJsonError';
  }
}

export function isMissingPackageJsonError(error: Error): error is MissingPackageJsonError {
  return error instanceof MissingPackageJsonError;
}
