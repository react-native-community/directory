import { sortBy } from 'es-toolkit/array';
import { View } from 'react-native';

import { H6Section } from '~/common/styleguide';
import { type LibraryType, type NpmUser } from '~/types';
import { cx } from '~/util/tailwind';

import EntityCounter from '../EntityCounter';

import DependantsSection from './DependantsSection';
import FundingSection from './FundingSection';
import MorePackagesSection from './MorePackagesSection';
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
      <MorePackagesSection library={library} />
      <DependantsSection library={library} />
      <FundingSection fullName={library.github.fullName} />
      {!!author && (
        <>
          <H6Section className={cx(!compact && 'mt-3')}>Author</H6Section>
          <View className="items-start">
            <PackageAuthor author={author} />
          </View>
        </>
      )}
      {maintainers && (
        <>
          <H6Section className={cx('flex gap-1.5', cx(!compact && 'mt-3'))}>
            {compact ? 'Maintainer' : 'Maintainers'}
            <EntityCounter count={maintainers.length} />
          </H6Section>
          <View className="flex-row flex-wrap items-start gap-2">
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
