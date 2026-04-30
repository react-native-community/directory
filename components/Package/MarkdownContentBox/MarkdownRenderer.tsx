import { Md } from '@m2d/react-markdown/client';
import { capitalize } from 'es-toolkit/string';
import { Children, isValidElement } from 'react';
import { View } from 'react-native';
import { type Theme } from 'react-shiki';
import rehypeRaw from 'rehype-raw';
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';

import { A } from '~/common/styleguide';
import {
  CautionBlockquoteIcon,
  CheckIcon,
  ImportantBlockquoteIcon,
  NoteBlockquoteIcon,
  TipBlockquoteIcon,
  WarningBlockquoteIcon,
} from '~/components/Icons';
import rndDark from '~/styles/shiki/rnd-dark.json';
import rndLight from '~/styles/shiki/rnd-light.json';
import { extractAndStripBlockquoteType } from '~/util/extractAndStripBlockquoteType';
import { getReadmeAssetURL } from '~/util/getReadmeAssetUrl';
import tw from '~/util/tailwind';

import MarkdownCodeBlock from './MarkdownCodeBlock';
import MarkdownHeading from './MarkdownHeading';
import { MarkdownVideoPlayer } from './MarkdownVideoPlayer';

type Props = {
  data?: string | null;
  repoUrl: string;
  linkableHeaders?: boolean;
};

export default function MarkdownRenderer({ data, repoUrl, linkableHeaders = true }: Props) {
  return (
    <Md
      id="markdownContentContainer"
      components={{
        h1: ({ children, node }: any) => (
          <MarkdownHeading tagName={node.tagName} linkableHeaders={linkableHeaders}>
            {children}
          </MarkdownHeading>
        ),
        h2: ({ children, node }: any) => (
          <MarkdownHeading tagName={node.tagName} linkableHeaders={linkableHeaders}>
            {children}
          </MarkdownHeading>
        ),
        h3: ({ children, node }: any) => (
          <MarkdownHeading tagName={node.tagName} linkableHeaders={linkableHeaders}>
            {children}
          </MarkdownHeading>
        ),
        h4: ({ children, node }: any) => (
          <MarkdownHeading tagName={node.tagName} linkableHeaders={linkableHeaders}>
            {children}
          </MarkdownHeading>
        ),
        h5: ({ children, node }: any) => (
          <MarkdownHeading tagName={node.tagName} linkableHeaders={linkableHeaders}>
            {children}
          </MarkdownHeading>
        ),
        h6: ({ children, node }: any) => (
          <MarkdownHeading tagName={node.tagName} linkableHeaders={linkableHeaders}>
            {children}
          </MarkdownHeading>
        ),
        p: ({ children, node, ...props }: any) => {
          const childrenCount = Children.count(children);
          if (childrenCount === 1) {
            const element = Children.toArray(children).at(0);
            if (
              isValidElement<{ href?: string }>(element) &&
              isGitHubVideoAssetLink(element.props.href)
            ) {
              return children;
            }
          }

          return <p {...props}>{children}</p>;
        },
        br: () => null,
        hr: () => null,
        a: (props: any) => {
          if (props.href && !props.href.startsWith('//')) {
            if (!props.href.startsWith('http')) {
              return (
                <A
                  {...props}
                  href={`${repoUrl}/blob/HEAD/${props.href.startsWith('/') ? props.href.slice(1) : props.href}`}
                />
              );
            } else if (isGitHubVideoAssetLink(props.href)) {
              return <MarkdownVideoPlayer src={props.href} />;
            }
            return <A {...props} />;
          }
          return <span>{props.children}</span>;
        },
        video: (props: any) => {
          if (props.src) {
            return <MarkdownVideoPlayer src={props.src} />;
          }
          return null;
        },
        table: ({ children }) => {
          return (
            // @ts-expect-error dataSet is a valid RNW prop
            <View dataSet={{ tableWrapper: true }}>
              <table>{children}</table>
            </View>
          );
        },
        img: ({ src, alt, width, height }: any) => (
          <img
            src={getReadmeAssetURL(src, repoUrl)}
            onError={(error: any) => {
              const fallbackUrl = getReadmeAssetURL(src, repoUrl, 'master');
              const target = error.currentTarget;

              if (target.src !== fallbackUrl) {
                target.onerror = null;
                target.src = fallbackUrl;
              } else {
                target.style.display = 'none';
              }
            }}
            alt={alt ?? ''}
            width={width}
            height="auto"
            style={{
              maxHeight: height,
            }}
          />
        ),
        source: ({ srcSet, ...rest }: any) => (
          <source srcSet={srcSet ? getReadmeAssetURL(srcSet, repoUrl) : undefined} {...rest} />
        ),
        pre: ({ children }: any) => {
          const langClass = children?.props?.className;
          if (langClass) {
            return (
              <MarkdownCodeBlock
                code={children.props.children}
                theme={(tw.prefixMatch('dark') ? rndDark : rndLight) as Theme}
                lang={langClass ? (langClass.split('-')[1] ?? 'sh').toLowerCase() : 'sh'}
              />
            );
          }
          return (
            <div style={tw`relative my-2`} className="readme-code-block">
              <pre className="shiki">{children}</pre>
            </div>
          );
        },
        blockquote: ({ children }: any) => {
          const blockquoteType = extractAndStripBlockquoteType(children);
          return (
            <blockquote
              className={blockquoteType.type}
              style={{
                ...tw`text-secondary`,
                ...(blockquoteType.type ? {} : tw`border-palette-gray4 dark:border-secondary`),
              }}>
              {blockquoteType.type && (
                <strong className="blockquote-title" style={tw`flex items-center gap-1.5`}>
                  {getBlockquoteIcon(blockquoteType.type)}
                  {capitalize(blockquoteType.type)}
                </strong>
              )}
              {blockquoteType.children}
            </blockquote>
          );
        },
        details: ({ children }: any) => {
          return (
            <details
              style={tw`mt-3 rounded-xl border border-palette-gray2 pb-3 pr-4 pt-1 dark:border-default`}>
              {children}
            </details>
          );
        },
        input: ({ type, checked, ...rest }: any) => {
          if (type === 'checkbox') {
            const isChecked = Boolean(checked);
            return (
              <div
                className="checkbox"
                style={tw`m-0 box-border size-4 items-center justify-center rounded border border-solid border-palette-gray3 bg-palette-gray2 dark:border-powder dark:bg-palette-gray6`}>
                {isChecked && <CheckIcon style={tw`size-3 text-success`} />}
              </div>
            );
          }
          return <input type={type} {...rest} />;
        },
      }}
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[remarkGfm, remarkEmoji]}>
      {data ?? undefined}
    </Md>
  );
}

function getBlockquoteIcon(type: string) {
  switch (type) {
    case 'note':
      return <NoteBlockquoteIcon style={tw`-ml-0.5 size-4`} />;
    case 'tip':
      return <TipBlockquoteIcon style={tw`-ml-0.5 size-4`} />;
    case 'warning':
      return <WarningBlockquoteIcon style={tw`-ml-0.5 size-4`} />;
    case 'caution':
      return <CautionBlockquoteIcon style={tw`-ml-0.5 size-4`} />;
    case 'important':
      return <ImportantBlockquoteIcon style={tw`-ml-0.5 size-4`} />;
    default:
      return null;
  }
}

function isGitHubVideoAssetLink(link?: string) {
  if (!link) {
    return false;
  }
  return link.startsWith('https://github.com/user-attachments/assets/');
}
