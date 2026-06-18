import { intro, log, outro } from '@clack/prompts';
import { blue, bold, dim } from 'picocolors';

export default function help() {
  intro(`${blue('React Native Directory CLI')} ${blue(bold('[help]'))}`);
  log.info(`rn-directory <command>

Commands:
  ${bold('submit')}      ${dim('manually create a PR in React Native Directory')}
  ${bold('autoSubmit')}  ${dim('create a PR in React Native Directory for the library in current directory')}
  ${bold('help')}        ${dim('show this help')}

Examples:
  ${bold('rn-directory submit')}`);
  outro();
}
