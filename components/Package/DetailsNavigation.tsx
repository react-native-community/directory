import { useLayout } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import Navigation from '~/components/Navigation';
import NavigationTab from '~/components/NavigationTab';
import { type LibraryType } from '~/types';
import tw from '~/util/tailwind';

type Props = {
  library: LibraryType;
};

export default function DetailsNavigation({ library }: Props) {
  const { isSmallScreen } = useLayout();

  return (
    <Navigation
      title={`${library.template ? 'Template' : 'Package'} information`}
      style={[tw`gap-1 pb-3 pt-9`, isSmallScreen && tw`gap-1.5 pt-5`]}>
      <ContentContainer style={tw`flex-row gap-2 px-5`}>
        <NavigationTab title="Overview" path={`/package/${library.npmPkg}`} />
        {!library.template && (
          <NavigationTab
            title="Versions"
            counter={library.npm?.versionsCount}
            path={`/package/${library.npmPkg}/versions`}
          />
        )}
        <NavigationTab title="Score" path={`/package/${library.npmPkg}/score`} />
      </ContentContainer>
    </Navigation>
  );
}
