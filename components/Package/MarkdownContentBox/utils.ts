import { type MarkdownTabsType } from '~/types';

export const MARKDOWN_CONTENT_QUERY_PARAM = 'tab';
export const MARKDOWN_TABS = ['Readme', 'Changelog', 'Contributing', 'Code of Conduct'] as const;
export const DEFAULT_MARKDOWN_TAB: MarkdownTabsType = 'Readme';

export function isValidMarkdownTab(
  value?: string | string[],
  availableTabs: readonly MarkdownTabsType[] = MARKDOWN_TABS
): value is MarkdownTabsType {
  return typeof value === 'string' && availableTabs.includes(value as MarkdownTabsType);
}

export function parseMarkdownTab(
  value?: string | string[],
  availableTabs: readonly MarkdownTabsType[] = MARKDOWN_TABS
): MarkdownTabsType {
  if (isValidMarkdownTab(value, availableTabs)) {
    return value;
  }

  return availableTabs.includes(DEFAULT_MARKDOWN_TAB)
    ? DEFAULT_MARKDOWN_TAB
    : (availableTabs[0] ?? DEFAULT_MARKDOWN_TAB);
}
