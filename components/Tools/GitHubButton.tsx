import { P } from '~/common/styleguide';
import { Button } from '~/components/Button';
import { GitHubIcon } from '~/components/Icons';

type Props = {
  name: string;
  href: string;
};

export default function GitHubButton({ href, name }: Props) {
  return (
    <Button
      openInNewTab
      aria-label={`${name} GitHub`}
      href={href}
      className="bg-primary-dark min-h-8 flex-row gap-1.5 px-3 text-sm">
      <GitHubIcon className="text-black" />
      <P className="text-sm text-black">GitHub</P>
    </Button>
  );
}
