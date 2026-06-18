#! /usr/bin/env bun

import { cancel, intro, isCancel, log, outro, select } from '@clack/prompts';
import { blue, bold, yellow } from 'picocolors';

import autoSubmit from './commands/autoSubmit.ts';
import help from './commands/help.ts';
import submit from './commands/submit.ts';
import { type Command } from './types';

const commands: Record<string, Command> = {
  help,
  submit,
  autoSubmit,
};

async function main() {
  const argv = process.argv.slice(2);
  let cmd: string | symbol | undefined = argv[0];

  if (!cmd) {
    intro(blue(`React Native Directory CLI`));

    cmd = await select({
      message: 'Select the command to run',
      options: [
        {
          value: 'submit',
          label: 'Submit',
          hint: 'Submit new entry to the directory by filling up the fields manually',
        },
        {
          value: 'autoSubmit',
          label: `Auto-submit ${yellow(bold('[Experimental]'))}`,
          hint: 'Gather information about package in the current directory and prepare entry to submit',
        },
        { value: 'help', label: 'Help and usage' },
      ],
    });

    if (isCancel(cmd)) {
      cancel('No command has been selected.');
      process.exit(0);
    }

    outro();
  }

  if (cmd === '-h' || cmd === '--help') {
    help();
    process.exit(0);
  }

  const handler = commands[cmd];

  if (!handler) {
    log.error(`Unknown command: ${bold(cmd)}\n`);
    help();
    process.exit(1);
  }

  await handler(argv.slice(1));
}

main().catch(err => {
  log.error(err);
  process.exit(1);
});
