import { createHighlighter, type ThemeRegistration } from 'shiki';

import rndDark from '~/styles/shiki/rnd-dark.json';
import rndLight from '~/styles/shiki/rnd-light.json';

export const inlineHighlighterInstance = createHighlighter({
  themes: [rndDark as ThemeRegistration, rndLight as ThemeRegistration],
  langs: ['tsx'],
});

export const SHIKI_OPTS = {
  langAlias: {
    appxmanifest: 'xml',
    bat: 'sh',
    cbp: 'xml',
    cc: 'cpp',
    cfg: 'ini',
    cl: 'cpp',
    ets: 'ts',
    filters: 'xml',
    flow: 'tsx',
    gradle: 'groovy',
    h: 'objective-cpp',
    hpp: 'cpp',
    iml: 'xml',
    map: 'json',
    m: 'objective-c',
    mak: 'sh',
    mk: 'sh',
    md: 'mdx',
    mm: 'objective-cpp',
    plist: 'xml',
    podspec: 'ruby',
    pom: 'xml',
    pro: 'properties',
    proguard: 'properties',
    props: 'xml',
    sln: 'ini',
    svg: 'xml',
    workspace: 'xml',
    vcxproj: 'xml',
    targets: 'xml',
    tsbuildinfo: 'json',
    xaml: 'xml',
    xcprivacy: 'xml',
    xcworkspacedata: 'xml',
  },
} as const;
