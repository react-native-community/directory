import { type Element } from 'hast';
import { type PropsWithChildren } from 'react';

import { Button } from '~/components/Button';
import { LinkIcon } from '~/components/Icons';
import { childrenToText } from '~/util/strings';
import tw from '~/util/tailwind';

type Props = PropsWithChildren<{
  node: Element;
  slugger: (text: string) => string;
  linkableHeaders?: boolean;
}>;

type MarkdownHeadingTagName = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export default function MarkdownHeading({ children, slugger, node, linkableHeaders }: Props) {
  const Heading = node.tagName as MarkdownHeadingTagName;
  const isCentered = node.properties?.align === 'center';

  const slug = typeof children === 'string' ? slugger(children) : slugger(childrenToText(children));

  if (!slug || !linkableHeaders) {
    return (
      <Heading style={{ justifyContent: isCentered ? 'center' : undefined }}>{children}</Heading>
    );
  }

  return (
    <Heading id={slug} style={{ justifyContent: isCentered ? 'center' : undefined }}>
      {children}
      <Button
        href={`#${slug}`}
        aria-label="Link to header"
        style={[
          tw`bg-transparent`,
          isCentered && tw`absolute -top-2.5`,
          node.tagName === 'h1'
            ? tw`mt-px size-5`
            : ['h2', 'h3'].includes(node.tagName)
              ? tw`mt-px size-4`
              : tw`size-3.5`,
        ]}>
        <LinkIcon style={[tw`text-icon`, node.tagName === 'h1' && tw`size-5`]} />
      </Button>
    </Heading>
  );
}
