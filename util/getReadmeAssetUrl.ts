const FILE_WITH_EXTENSION_REGEX = /\/[^/?#]+\.[^/?#]+(?=(?:\?|#|$))/i;

export function getReadmeAssetURL(src: string, githubUrl: string, defaultBranch = 'main') {
  const isGitHubAssetURL =
    src.includes('github.com') && !src.endsWith('badge.svg') && !src.includes('user-attachments');

  if (src.startsWith('http') && (!isGitHubAssetURL || !FILE_WITH_EXTENSION_REGEX.test(src))) {
    return src;
  }

  if (isGitHubAssetURL) {
    return src
      .replace('https://github.com', 'https://raw.githubusercontent.com')
      .replace('/blob/', '/')
      .replace('/raw/', '/');
  }

  const url = new URL(githubUrl);
  const parts = url.pathname.split('/').filter(Boolean);

  if (parts.length < 4 || parts[2] !== 'tree') {
    const owner = parts[0];
    const repo = parts[1];
    const branch = defaultBranch;
    const basePath = '';
    const resolved = resolvePosix(basePath, src);

    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${resolved}`;
  }

  const owner = parts[0];
  const repo = parts[1];
  const branch = parts[3];
  const basePath = parts.slice(4).join('/');
  const resolved = resolvePosix(basePath, src);

  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${resolved}`;
}

function joinPosix(...parts: string[]): string {
  return normalizePosix(parts.filter(Boolean).join('/'));
}

function resolvePosix(base: string, rel: string): string {
  if (rel.startsWith('/')) {
    return normalizePosix(rel.replace(/^\/+/, ''));
  }
  return normalizePosix(joinPosix(base, rel));
}

function normalizePosix(path: string): string {
  const segments = path.split('/').filter(() => true);
  const out: string[] = [];
  for (const segment of segments) {
    if (segment === '' || segment === '.') {
      continue;
    }
    if (segment === '..') {
      if (out.length > 0) {
        out.pop();
      }
      continue;
    }
    out.push(segment);
  }
  return out.join('/');
}
