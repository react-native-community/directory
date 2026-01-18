import { P } from '~/common/styleguide';
import { Button } from '~/components/Button';
import { GitHub } from '~/components/Icons';
import tw from '~/util/tailwind';

type Props = {
  href: string;
};

export default function GitHubButton({ href }: Props) {
  return (
    <Button
      openInNewTab
      href={href}
      style={tw`flex-row px-3 min-h-8 text-sm gap-1.5 bg-primary dark:bg-primary-dark`}>
      <GitHub width={16} style={tw`text-black`} />
      <P style={tw`text-sm text-black`}>GitHub</P>
    </Button>
  );
}
