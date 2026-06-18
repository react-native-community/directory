import { cancel, confirm, isCancel, log } from '@clack/prompts';
import { $ } from 'bun';
import { red } from 'picocolors';

export async function checkGHCLIAvailability() {
  try {
    await $`gh auth status`.quiet();
  } catch (error) {
    if (error instanceof $.ShellError) {
      const message = error.stderr.toString();
      if (message.includes('You are not logged')) {
        log.error(red(message));

        const tryLogin = await confirm({
          message: 'Would you like to login now?',
        });

        if (isCancel(tryLogin) || !tryLogin) {
          cancel('GitHub CLI authentication skipped.');
          process.exit(0);
        }

        const loginAttempt = await $`gh auth login`;
        if (loginAttempt.exitCode !== 0) {
          process.exit(loginAttempt.exitCode);
        }
      } else {
        log.error(red('GitHub CLI need to be installed on your system, see: https://cli.github.com/.'));
        process.exit(1);
      }
    }
  }
}

export async function checkPresenceInRegistries(packageName: string) {
  const npmResult = await fetch(`https://registry.npmjs.org/${packageName}/latest`);

  if (npmResult.status !== 200) {
    cancel('You cannot submit package which is not published to npm registry.');
    process.exit(1);
  }

  const directoryResult = await fetch(`https://reactnative.directory/api/library?name=${packageName}&check=true`);
  const directoryData = (await directoryResult.json()) as Record<string, boolean>;

  if (directoryData[packageName]) {
    log.success(`The package already exist in the directory.`);
    log.info(`Visit the package page at https://reactnative.directory/package/${packageName}`);
    process.exit(0);
  }
}
