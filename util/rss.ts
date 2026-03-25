import { type LibraryType } from '~/types';

export function generateLibrariesRss(title: string, description: string, libraries: LibraryType[]) {
  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>React Native Directory - ${title}</title>
    <link>https://reactnative.directory/</link>
    <description>${description}</description>
    ${libraries
      .map(
        (lib, i) => `
      <item>
        <title>${lib.npmPkg}</title>
        <description><![CDATA[${lib.github.description}]]></description>
        <link>https://reactnative.directory/package/${lib.npmPkg}</link>
        ${
          lib.github.topics?.length
            ? lib.github.topics
                .slice(0, 5)
                .map(topic => `<category>${topic}</category>`)
                .join('')
            : ''
        }
        ${title === 'Just Updated' ? `<pubDate>${new Date(lib.github.stats.updatedAt).toUTCString()}</pubDate>` : `<guid>${`${i}-${lib.npmPkg}`}</guid>`}
      </item>`
      )
      .join('')}
  </channel>
</rss>`;
}
