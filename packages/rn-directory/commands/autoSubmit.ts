import { cancel, intro, log, outro, spinner } from '@clack/prompts';
import { $ } from 'bun';
import { blue, bold } from 'picocolors';

import { type LibraryDataEntryType, type PackageJsonRepository } from '../types';
import { directoryExist, isValidGHUrl, parseGitHubUrl, parseRepositoryData } from '../utils';

import {
  createAndPushCommit,
  createBranchInFork,
  createPRForRND,
  fetchLibrariesFromForkBranch,
  forkRNDRepo,
  printSummaryAndConfirm,
} from './common/actions.ts';
import { checkGHCLIAvailability, checkPresenceInRegistries } from './common/checks';

export default async function autoSubmit() {
  intro(`${blue('React Native Directory CLI')} ${blue(bold('[autoSubmit]'))}`);

  await checkGHCLIAvailability();

  const packageJson = Bun.file('./package.json');

  if (!(await packageJson.exists())) {
    cancel(`You need to run the command inside the library repository, where ${bold('package.json')} file is located.`);
    process.exit(1);
  }

  const packageJsonContent = await packageJson.json();
  const packageName = packageJsonContent.name;

  log.info(`Starting process to auto-submit ${bold(packageName)} to https://reactnative.directory/`);

  if (packageJsonContent.private) {
    cancel('You cannot submit package which is marked as private.');
    process.exit(1);
  }

  await checkPresenceInRegistries(packageName);

  const repositoryData: PackageJsonRepository = packageJsonContent.repository;

  if (!repositoryData) {
    cancel(
      `You need to define the repository data inside ${bold('package.json')} file, see: https://docs.npmjs.com/cli/v11/configuring-npm/package-json#repository.`
    );
    process.exit(1);
  }

  const repositoryUrl = parseRepositoryData(repositoryData);

  if (!repositoryUrl || !isValidGHUrl(repositoryUrl)) {
    cancel(
      `Invalid repository URL (${repositoryUrl}), see: https://docs.npmjs.com/cli/v11/configuring-npm/package-json#repository.`
    );
    process.exit(1);
  }

  const { repoName, repoOwner } = parseGitHubUrl(repositoryUrl);
  try {
    await $`gh repo view ${repoOwner}/${repoName}`.quiet();
  } catch (error) {
    if (error instanceof $.ShellError) {
      log.error(error.stderr.toString().replace('GraphQL: ', '').replace('gh: ', '').trim());
      cancel('Make sure that provided URL is correct, repository exist and is publicly available.');
      process.exit(1);
    }
  }

  const hasPluginFile = await Bun.file('app.plugin.js').exists();

  // TODO: improve entry
  const packageEntry: LibraryDataEntryType = {
    githubUrl: repositoryUrl,
    examples: directoryExist('example') ? [`${repositoryUrl}/tree/HEAD/example`] : undefined,
    configPlugin: hasPluginFile ? true : undefined,
    ios: directoryExist('ios') || directoryExist('apple') ? true : undefined,
    android: directoryExist('android') ? true : undefined,
    expoGo: !directoryExist('android') && !directoryExist('ios') && !directoryExist('apple') ? true : undefined,
    macos: directoryExist('macos') || directoryExist('apple') ? true : undefined,
    tvos: directoryExist('tvos') || directoryExist('apple') ? true : undefined,
    windows: directoryExist('windows') ? true : undefined,
  };

  // TODO: maybe ask user if they want to correct entry
  await printSummaryAndConfirm(packageEntry, true);

  const forkRepo = await forkRNDRepo();

  const branchName = `add-${packageName}`;
  await createBranchInFork(forkRepo, branchName);

  const commitProgress = spinner();
  commitProgress.start('Creating commit and pushing');

  const librariesArray = await fetchLibrariesFromForkBranch(forkRepo, branchName);
  const libraryIndex = librariesArray.findIndex(({ githubUrl }) => githubUrl === repositoryUrl);

  if (libraryIndex !== -1) {
    log.warn(`Replacing already existing entry in the definitions file on the branch`);
    librariesArray[libraryIndex] = JSON.parse(JSON.stringify(packageEntry));
  } else {
    librariesArray.push(JSON.parse(JSON.stringify(packageEntry)));
  }

  const message = libraryIndex === -1 ? `Add ${packageName} to the directory` : `Update ${packageName} entry`;

  await createAndPushCommit(forkRepo, branchName, librariesArray, message);

  commitProgress.stop('Commit created and pushed');

  await createPRForRND(forkRepo, branchName, message, packageName, repositoryUrl);

  outro(blue('Thanks for contributing! 💙'));
}
