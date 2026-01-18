import { kebabCase } from 'es-toolkit/string';
import { type PropsWithChildren } from 'react';

import { Button } from '~/components/Button';
import { Link } from '~/components/Icons';
import tw from '~/util/tailwind';

type Props = PropsWithChildren<{
  tagName: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}>;

export default function ReadmeHeading({ children, tagName }: Props) {
  const Heading = tagName;
  const slug = typeof children === 'string' ? kebabCase(children) : undefined;

  if (!slug) {
    return <Heading>{children}</Heading>;
  }

  return (
    <Heading id={slug}>
      {children}
      <Button
        href={`#${slug}`}
        aria-label="Link to header"
        style={[
          tw`bg-transparent`,
          ['h1', 'h2', 'h3'].includes(tagName) ? tw`size-4 mt-px` : tw`size-3.5`,
        ]}>
        <Link style={tw`text-icon`} />
      </Button>
    </Heading>
  );
}
