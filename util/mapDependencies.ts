import { type ReactElement } from 'react';

export default function mapDependencies(
  dependencies: Record<string, string>,
  mapper: ([name, version]: [string, string]) => ReactElement
) {
  return Object.entries(dependencies)
    .sort((a: [string, string], b: [string, string]) => a[0].localeCompare(b[0]))
    .map(mapper);
}
