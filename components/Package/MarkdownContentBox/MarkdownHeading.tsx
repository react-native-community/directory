import { type Element } from 'hast';
import { type PropsWithChildren } from 'react';

import { Button } from '~/components/Button';
import { LinkIcon } from '~/components/Icons';
import { childrenToText } from '~/util/strings';
import { cx } from '~/util/tailwind';

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
        className={cx(
          'bg-transparent',
          cx(isCentered && 'absolute -top-2.5'),
          cx(
            node.tagName === 'h1'
              ? 'mt-px size-5'
              : cx(['h2', 'h3'].includes(node.tagName) ? 'mt-px size-4' : 'size-3.5')
          )
        )}>
        <LinkIcon className={cx('text-icon', cx(node.tagName === 'h1' && 'size-5'))} />
      </Button>
    </Heading>
  );
}
