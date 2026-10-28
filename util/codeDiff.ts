import { type ChangedFile, type DiffLine, type UnpkgMeta } from '~/types';

import { getCodeBrowserFilePath, getLanguage, PREVIEW_DISABLED_FILES } from './codeBrowser';

export function getChangedFiles(fromMeta?: UnpkgMeta, toMeta?: UnpkgMeta): ChangedFile[] {
  if (!fromMeta || !toMeta) {
    return [];
  }

  const fromFiles = new Map(
    fromMeta.files.map(file => [getCodeBrowserFilePath(file.path, fromMeta.prefix), file])
  );
  const toFiles = new Map(
    toMeta.files.map(file => [getCodeBrowserFilePath(file.path, toMeta.prefix), file])
  );

  return [...new Set([...fromFiles.keys(), ...toFiles.keys()])]
    .filter(path => fromFiles.get(path)?.integrity !== toFiles.get(path)?.integrity)
    .sort()
    .map(path => {
      const fromFile = fromFiles.get(path);
      const toFile = toFiles.get(path);

      return {
        path,
        fromFile,
        toFile,
        status: !fromFile ? 'added' : !toFile ? 'removed' : 'modified',
      } as const;
    });
}

export function getDiffLines(fromContent: string, toContent: string): DiffLine[] {
  const oldLines = fromContent ? fromContent.split('\n') : [];
  const newLines = toContent ? toContent.split('\n') : [];

  if (oldLines.length + newLines.length > 20_000 || oldLines.length * newLines.length > 1_000_000) {
    return [
      ...oldLines.map((text, index) => ({ type: 'removed' as const, oldLine: index + 1, text })),
      ...newLines.map((text, index) => ({ type: 'added' as const, newLine: index + 1, text })),
    ];
  }

  const lengths = Array.from(
    { length: oldLines.length + 1 },
    () => new Uint32Array(newLines.length + 1)
  );

  for (let oldIndex = oldLines.length - 1; oldIndex >= 0; oldIndex--) {
    for (let newIndex = newLines.length - 1; newIndex >= 0; newIndex--) {
      lengths[oldIndex][newIndex] =
        oldLines[oldIndex] === newLines[newIndex]
          ? lengths[oldIndex + 1][newIndex + 1] + 1
          : Math.max(lengths[oldIndex + 1][newIndex], lengths[oldIndex][newIndex + 1]);
    }
  }

  const lines: DiffLine[] = [];
  let oldIndex = 0;
  let newIndex = 0;

  while (oldIndex < oldLines.length || newIndex < newLines.length) {
    if (
      oldIndex < oldLines.length &&
      newIndex < newLines.length &&
      oldLines[oldIndex] === newLines[newIndex]
    ) {
      lines.push({
        type: 'unchanged',
        oldLine: oldIndex + 1,
        newLine: newIndex + 1,
        text: oldLines[oldIndex],
      });
      oldIndex++;
      newIndex++;
    } else if (
      oldIndex < oldLines.length &&
      (newIndex >= newLines.length ||
        lengths[oldIndex + 1][newIndex] >= lengths[oldIndex][newIndex + 1])
    ) {
      lines.push({ type: 'removed', oldLine: oldIndex + 1, text: oldLines[oldIndex] });
      oldIndex++;
    } else {
      lines.push({ type: 'added', newLine: newIndex + 1, text: newLines[newIndex] });
      newIndex++;
    }
  }

  return lines;
}

export function isPreviewable(path: string, size?: number) {
  return !PREVIEW_DISABLED_FILES.includes(getLanguage(path)) && (size ?? 0) <= 1024 * 1024;
}

export function getMetaUrl(packageName: string, version: string) {
  const params = new URLSearchParams({ name: packageName, version, path: '?meta' });
  return `/api/proxy/unpkg?${params}`;
}

export function getFileUrl(packageName: string, version: string, path: string) {
  const params = new URLSearchParams({ name: packageName, version, path });
  return `/api/proxy/unpkg?${params}`;
}
