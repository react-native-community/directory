export function getReadmeAssetURL(src: string, githubUrl: string) {
  if (!src.startsWith(`http`)) {
    const rawGitHubUrl = githubUrl
      .replace('https://github.com', 'https://raw.githubusercontent.com')
      .replace('/tree', '');
    return joinPosix(rawGitHubUrl, src).replace('https:/', 'https://');
  }
  return src;
}

function joinPosix(...parts: string[]): string {
  return normalizePosix(parts.filter(Boolean).join('/'));
}

function normalizePosix(path: string): string {
  const absolute = path.startsWith('/');
  const segments = path.split('/').filter(Boolean);
  const out: string[] = [];
  for (const segment of segments) {
    if (segment === '.') {
      continue;
    }
    if (segment === '..') {
      out.pop();
    } else {
      out.push(segment);
    }
  }
  return (absolute ? '/' : '') + out.join('/');
}
