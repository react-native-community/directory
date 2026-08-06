import { sortBy } from 'es-toolkit/array';
import { View } from 'react-native';

import { H6Section } from '~/common/styleguide';
import { type LibraryType, type NpmUser } from '~/types';
import tw from '~/util/tailwind';

import EntityCounter from '../EntityCounter';

import FundingSection from './FundingSection';
import MorePackagesBox from './MorePackagesBox';
import PackageAuthor from './PackageAuthor';
import RepositoryContributors from './RepositoryContributors';

type Props = {
  library: LibraryType;
  author?: NpmUser | string;
  maintainers?: NpmUser[];
  compact?: boolean;
};

export default function CommunitySection({ library, author, maintainers, compact = false }: Props) {
  return (
    <>
      <MorePackagesBox library={library} />
      <FundingSection fullName={library.github.fullName} />
      {!!author && (
        <>
          <H6Section style={!compact && tw`mt-3`}>Author</H6Section>
          <View style={tw`items-start`}>
            <PackageAuthor author={author} />
          </View>
        </>
      )}
      {maintainers && (
        <>
          <H6Section style={[tw`flex gap-1.5`, !compact && tw`mt-3`]}>
            {compact ? 'Maintainer' : 'Maintainers'}
            <EntityCounter count={maintainers.length} />
          </H6Section>
          <View style={tw`flex-row flex-wrap items-start gap-2`}>
            {sortBy(maintainers, ['name']).map(maintainer => (
              <PackageAuthor author={maintainer} key={maintainer.name} compact />
            ))}
          </View>
        </>
      )}
      <RepositoryContributors fullName={library.github.fullName} />
    </>
  );
}
