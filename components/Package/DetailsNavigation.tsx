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
      style={[tw`pt-9 pb-3 gap-1`, isSmallScreen && tw`pt-5 gap-1.5`]}>
      <ContentContainer style={tw`gap-2 flex-row px-5`}>
        <NavigationTab title="Overview" path={`/package/${library.npmPkg}`} />
        <NavigationTab
          title="Versions"
          counter={library.npm?.versionsCount}
          path={`/package/${library.npmPkg}/versions`}
        />
        <NavigationTab title="Score" path={`/package/${library.npmPkg}/score`} />
      </ContentContainer>
    </Navigation>
  );
}
