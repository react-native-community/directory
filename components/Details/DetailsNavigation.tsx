import { StyleSheet } from 'react-native';

import ContentContainer from '~/components/ContentContainer';
import Navigation from '~/components/Navigation';
import NavigationTab from '~/components/NavigationTab';
import { type LibraryType } from '~/types';

type Props = {
  library: LibraryType;
};

export default function DetailsNavigation({ library }: Props) {
  return (
    <Navigation
      title={`${library.template ? 'Template' : 'Package'} information`}
      style={styles.tabsNav}>
      <ContentContainer style={styles.tabsContainer}>
        <NavigationTab title="Overview" path={`/package/${library.npmPkg}`} />
        <NavigationTab
          title="Versions"
          counter={library.npm?.versionsCount}
          path={`/package/${library.npmPkg}/versions`}
        />
      </ContentContainer>
    </Navigation>
  );
}

const styles = StyleSheet.create({
  tabsNav: {
    paddingBottom: 12,
    paddingTop: 32,
    gap: 4,
  },
  tabsContainer: {
    gap: 8,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
});
