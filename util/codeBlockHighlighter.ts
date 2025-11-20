import { createHighlighterCore, createOnigurumaEngine } from 'react-shiki/core';

export async function getHighlighter() {
  return await createHighlighterCore({
    themes: [
      import('@shikijs/themes/github-dark-default'),
      import('@shikijs/themes/github-light-default'),
    ],
    langs: [
      import('@shikijs/langs/javascript'),
      import('@shikijs/langs/jsx'),
      import('@shikijs/langs/shellscript'),
      import('@shikijs/langs/typescript'),
      import('@shikijs/langs/tsx'),
      import('@shikijs/langs/ruby'),
      import('@shikijs/langs/java'),
      import('@shikijs/langs/objective-c'),
      import('@shikijs/langs/diff'),
      import('@shikijs/langs/xml'),
    ],
    engine: createOnigurumaEngine(import('shiki/wasm')),
  });
}
