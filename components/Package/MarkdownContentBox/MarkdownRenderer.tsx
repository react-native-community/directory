import { Md } from '@m2d/react-markdown/client';
import { type MdProps } from '@m2d/react-markdown/utils';
import { capitalize } from 'es-toolkit/string';
import { type Element } from 'hast';
import { Children, isValidElement, type JSX } from 'react';
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
import { createSlugger } from '~/components/Package/MarkdownContentBox/utils';
import rndDark from '~/styles/shiki/rnd-dark.json';
import rndLight from '~/styles/shiki/rnd-light.json';
import { extractAndStripBlockquoteType } from '~/util/extractAndStripBlockquoteType';
import { getReadmeAssetURL } from '~/util/getReadmeAssetUrl';
import { childrenToText } from '~/util/strings';
import { cx, useIsDark } from '~/util/tailwind';

import MarkdownCodeBlock from './MarkdownCodeBlock';
import MarkdownHeading from './MarkdownHeading';
import MarkdownInlineCode from './MarkdownInlineCode';
import MarkdownVideoPlayer from './MarkdownVideoPlayer';

type Props = {
  data?: string | null;
  repoUrl: string;
  linkableHeaders?: boolean;
};

type ComponentType<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T] & {
  node: Element;
};

export default function MarkdownRenderer({ data, repoUrl, linkableHeaders = true }: Props) {
  const isDark = useIsDark();
  const slugger = createSlugger();
  return (
    <Md
      id="markdownContentContainer"
      components={
        {
          h1: ({ children, node }: ComponentType<'h1'>) => (
            <MarkdownHeading node={node} slugger={slugger} linkableHeaders={linkableHeaders}>
              {children}
            </MarkdownHeading>
          ),
          h2: ({ children, node }: ComponentType<'h2'>) => (
            <MarkdownHeading node={node} slugger={slugger} linkableHeaders={linkableHeaders}>
              {children}
            </MarkdownHeading>
          ),
          h3: ({ children, node }: ComponentType<'h3'>) => (
            <MarkdownHeading node={node} slugger={slugger} linkableHeaders={linkableHeaders}>
              {children}
            </MarkdownHeading>
          ),
          h4: ({ children, node }: ComponentType<'h4'>) => (
            <MarkdownHeading node={node} slugger={slugger} linkableHeaders={linkableHeaders}>
              {children}
            </MarkdownHeading>
          ),
          h5: ({ children, node }: ComponentType<'h5'>) => (
            <MarkdownHeading node={node} slugger={slugger} linkableHeaders={linkableHeaders}>
              {children}
            </MarkdownHeading>
          ),
          h6: ({ children, node }: ComponentType<'h6'>) => (
            <MarkdownHeading node={node} slugger={slugger} linkableHeaders={linkableHeaders}>
              {children}
            </MarkdownHeading>
          ),
          p: ({ children, node, ...props }: ComponentType<'p'>) => {
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
            if (props.href && props.href.startsWith('#')) {
              return <A {...props} target="_self" />;
            } else if (props.href && !props.href.startsWith('//')) {
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
          video: ({ src, width }: ComponentType<'video'>) => {
            if (src) {
              return <MarkdownVideoPlayer src={src} style={width ? { width } : undefined} />;
            }
            return null;
          },
          table: ({ children, node }: ComponentType<'table'>) => {
            return (
              <View
                // @ts-expect-error dataSet is supported by React Native Web
                dataSet={{ tableWrapper: true }}
                className={node.properties.align === 'center' ? 'mx-auto' : undefined}>
                <table>{children}</table>
              </View>
            );
          },
          img: ({ src, alt, width, height }: ComponentType<'img'>) => {
            if (!src || typeof src !== 'string') {
              return null;
            }

            const baseURL = getReadmeAssetURL(src, repoUrl);
            return (
              <img
                src={baseURL}
                onError={error => {
                  const fallbackUrl = getReadmeAssetURL(src, repoUrl, 'HEAD');
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
                className={cx(
                  baseURL.endsWith('#gh-dark-mode-only') && (isDark ? 'inline' : 'hidden'),
                  baseURL.endsWith('#gh-light-mode-only') && (isDark ? 'hidden' : 'inline')
                )}
                style={{ maxHeight: height }}
              />
            );
          },
          source: ({ srcSet, node, media, ...rest }: ComponentType<'source'>) => {
            if (media?.includes('prefers-color-scheme: dark') && !isDark) {
              return null;
            }
            return (
              <source
                {...rest}
                srcSet={srcSet ? getReadmeAssetURL(srcSet, repoUrl) : undefined}
                media={media}
              />
            );
          },
          code: ({ children }: ComponentType<'code'>) => (
            <MarkdownInlineCode code={children} theme={isDark ? 'rnd-dark' : 'rnd-light'} />
          ),
          pre: ({ children }: any) => {
            const langClass = children?.props?.className;
            return (
              <MarkdownCodeBlock
                code={children?.props?.children ?? childrenToText(children)}
                theme={(isDark ? rndDark : rndLight) as Theme}
                lang={langClass ? (langClass.split('-')[1] ?? 'sh').toLowerCase() : 'sh'}
              />
            );
          },
          blockquote: ({ children }: ComponentType<'blockquote'>) => {
            const blockquoteType = extractAndStripBlockquoteType(children);
            const Icon = blockquoteType.type ? getBlockquoteIcon(blockquoteType.type) : null;
            return (
              <blockquote
                className={cx(
                  blockquoteType.type,
                  'text-secondary',
                  !blockquoteType.type && 'border-palette-gray4 dark:border-secondary-border'
                )}>
                {blockquoteType.type && Icon && (
                  <strong className="blockquote-title flex items-center gap-1.5">
                    <Icon className="-ml-0.5 size-4" />
                    {capitalize(blockquoteType.type)}
                  </strong>
                )}
                {blockquoteType.children}
              </blockquote>
            );
          },
          details: ({ children }: ComponentType<'details'>) => {
            return (
              <details className="border-palette-gray2 dark:border-border mt-3 rounded-xl border pt-1 pr-4 pb-3">
                {children}
              </details>
            );
          },
          input: ({ type, checked, ...rest }: ComponentType<'input'>) => {
            if (type === 'checkbox') {
              const isChecked = Boolean(checked);
              return (
                <div
                  className={cx(
                    'checkbox border-palette-gray3 bg-palette-gray2 dark:border-powder dark:bg-palette-gray6 m-0 box-border size-4 items-center justify-center rounded border border-solid'
                  )}>
                  {isChecked && <CheckIcon className="text-success size-3" />}
                </div>
              );
            }
            return <input type={type} {...rest} />;
          },
          sub: ({ children }: ComponentType<'sub'>) => {
            return <sub className="block">{children}</sub>;
          },
          sup: ({ children }: ComponentType<'sup'>) => {
            return <sup className="block">{children}</sup>;
          },
        } as MdProps['components']
      }
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[remarkGfm, remarkEmoji]}>
      {data ?? undefined}
    </Md>
  );
}

function getBlockquoteIcon(type: string) {
  switch (type) {
    case 'note':
      return NoteBlockquoteIcon;
    case 'tip':
      return TipBlockquoteIcon;
    case 'warning':
      return WarningBlockquoteIcon;
    case 'caution':
      return CautionBlockquoteIcon;
    case 'important':
      return ImportantBlockquoteIcon;
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
