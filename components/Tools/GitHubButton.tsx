import { P } from '~/common/styleguide';
import { Button } from '~/components/Button';
import { GitHubIcon } from '~/components/Icons';
import tw from '~/util/tailwind';

type Props = {
  href: string;
};

export default function GitHubButton({ href }: Props) {
  return (
    <Button
      openInNewTab
      href={href}
      style={tw`min-h-8 flex-row gap-1.5 bg-primary-dark px-3 text-sm`}>
      <GitHubIcon style={tw`text-black`} />
      <P style={tw`text-sm text-black`}>GitHub</P>
    </Button>
  );
}
