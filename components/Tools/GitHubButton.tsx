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
      style={tw`min-h-8 flex-row gap-1.5 bg-primary px-3 text-sm dark:bg-primary-dark`}>
      <GitHub width={16} style={tw`text-black`} />
      <P style={tw`text-sm text-black`}>GitHub</P>
    </Button>
  );
}
