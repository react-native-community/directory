import { StyleSheet } from 'react-native';

import { useLayout } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import Navigation from '~/components/Navigation';
import NavigationTab from '~/components/NavigationTab';
import { type LibraryType } from '~/types';

type Props = {
  library: LibraryType;
};

export default function DetailsNavigation({ library }: Props) {
  const { isSmallScreen } = useLayout();

  return (
    <Navigation
      title={`${library.template ? 'Template' : 'Package'} information`}
      style={{ ...styles.tabsNav, ...(isSmallScreen ? styles.tabsNavSmall : {}) }}>
      <ContentContainer style={styles.tabsContainer}>
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

const styles = StyleSheet.create({
  tabsNav: {
    paddingBottom: 12,
    paddingTop: 36,
    gap: 4,
  },
  tabsNavSmall: {
    paddingTop: 20,
    gap: 6,
  },
  tabsContainer: {
    gap: 8,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
});
