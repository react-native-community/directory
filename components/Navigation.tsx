import { type PropsWithChildren, useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, darkColors, H1, H2 } from '~/common/styleguide';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';

import ContentContainer from './ContentContainer';
import NavigationTab from './NavigationTab';

type NavigationProps = PropsWithChildren<{
  title?: string;
  description?: string;
  noHeader?: boolean;
}>;

const Navigation = ({ title, description, children, noHeader = false }: NavigationProps) => {
  const { isDark } = useContext(CustomAppearanceContext);
  return (
    <View
      style={{
        backgroundColor: isDark ? darkColors.veryDark : colors.gray7,
      }}>
      <ContentContainer style={styles.tabsWrapper}>
        <View style={styles.tabsContainer}>
          <NavigationTab title="Explore" path="/" />
          <NavigationTab title="Popular" />
          <NavigationTab title="Trending" />
        </View>
      </ContentContainer>
      {!noHeader ? (
        <View
          style={[
            styles.headerWrapper,
            { backgroundColor: isDark ? darkColors.dark : colors.gray6 },
          ]}>
          <H1 style={styles.header}>{title}</H1>
          <H2 style={styles.headerDescription}>{description}</H2>
          {children}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  tabsWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  headerWrapper: {
    paddingVertical: 40,
  },
  header: {
    textAlign: 'center',
    color: colors.white,
    fontSize: 42,
    paddingHorizontal: 20,
  },
  headerDescription: {
    textAlign: 'center',
    color: colors.pewter,
    fontWeight: '500',
    fontSize: 16,
    paddingTop: 4,
    paddingBottom: 6,
    paddingHorizontal: 40,
  },
});

export default Navigation;
