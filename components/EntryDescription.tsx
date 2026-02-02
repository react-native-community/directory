import * as emoji from 'node-emoji';
import { Linkify } from 'react-easy-linkify';

import { A, Caption, Headline } from '~/common/styleguide';
import { type LibraryType, type TemplateType } from '~/types';
import tw from '~/util/tailwind';

type Props = {
  github: LibraryType['github'] | TemplateType['github'];
  maxLines?: number;
  entryType?: string;
};

export default function EntryDescription({ github, maxLines, entryType = 'package' }: Props) {
  return github.description && github.description.length > 0 ? (
    <Headline numberOfLines={maxLines} style={tw`text-base font-light leading-snug`}>
      <Linkify
        options={{
          linkWrapper: ({ children, ...rest }) => <A {...rest}>{children}</A>,
        }}>
        {emoji.emojify(github.description)}
      </Linkify>
    </Headline>
  ) : (
    <Caption style={tw`text-base font-light leading-snug text-palette-gray4 dark:text-secondary`}>
      The ${entryType} does not have a description defined.
    </Caption>
  );
}
