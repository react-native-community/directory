import fetch from 'isomorphic-fetch';
import { NextPageContext } from 'next';
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { H1, H3, darkColors, colors } from '../common/styleguide';
import ContentContainer from '../components/ContentContainer';
import {
  PlatformAndroid,
  PlatformIOS,
  PlatformMacOS,
  PlatformWeb,
  PlatformWindows,
} from '../components/Icons';
import Library from '../components/Library';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import getApiUrl from '../util/getApiUrl';
import urlWithQuery from '../util/urlWithQuery';

const UPDATED_IN = 1000 * 60 * 60 * 24 * 90; // 90 days

const renderLibs = (list, count = 4) => {
  return (
    <View style={styles.librariesContainer}>
      {list
        .filter(
          lib =>
            !lib.unmaintained &&
            !lib.dev &&
            lib.npm.downloads > 100 &&
            new Date().getTime() - new Date(lib.github.stats.updatedAt).getTime() < UPDATED_IN
        )
        .sort((a, b) => b.popularity - a.popularity)
        .splice(0, count)
        .map((item: any, index: number) => (
          <Library key={`list-item-${index}-${item.github.name}`} library={item} skipMeta />
        ))}
    </View>
  );
};

const ExploreSection = ({ data, title, filter, icon = undefined, count = 4 }) => {
  const { isDark } = useContext(CustomAppearanceContext);
  const iconColor = isDark ? darkColors.pewter : colors.gray5;

  return (
    <>
      <H3 style={styles.subHeader}>
        <View style={styles.subHeaderIcon}>
          {icon ? React.createElement(icon, { fill: iconColor, width: 28, height: 28 }) : null}
        </View>
        {title}
      </H3>
      <View style={styles.librariesContainer}>{renderLibs(data.filter(filter), count)}</View>
    </>
  );
};

const Explore = ({ data }) => {
  const { isDark } = useContext(CustomAppearanceContext);

  return (
    <>
      <View
        style={[
          styles.headerWrapper,
          { backgroundColor: isDark ? darkColors.subHeader : colors.gray1 },
        ]}>
        <H1 style={styles.header}>Explore trending libraries</H1>
      </View>
      <ContentContainer style={styles.container}>
        <ExploreSection
          title="Core platforms"
          data={data}
          filter={lib => lib.android === true && lib.ios === true}
          count={8}
        />
        <ExploreSection
          title="Android"
          icon={PlatformAndroid}
          data={data}
          filter={lib => lib.android === true && !lib.ios}
        />
        <ExploreSection
          title="iOS"
          icon={PlatformIOS}
          data={data}
          filter={lib => lib.ios === true && !lib.android}
        />
        <ExploreSection title="Expo" data={data} filter={lib => lib.expo === true} />
        <ExploreSection
          title="macOS"
          icon={PlatformMacOS}
          data={data}
          filter={lib => lib.macos === true}
        />
        <ExploreSection
          title="Web"
          icon={PlatformWeb}
          data={data}
          filter={lib => lib.web === true}
        />
        <ExploreSection
          title="Windows"
          icon={PlatformWindows}
          data={data}
          filter={lib => lib.windows === true}
        />
      </ContentContainer>
    </>
  );
};

const calcPopularity = npm =>
  ((npm.weekDownloads - Math.floor(npm.downloads / 4)) / npm.downloads).toFixed(3);

Explore.getInitialProps = async (ctx: NextPageContext) => {
  let url = getApiUrl(urlWithQuery('/libraries', { limit: 9999 }), ctx);
  let response = await fetch(url);
  let result = await response.json();

  return {
    data: result.libraries
      .map(lib => ({
        ...lib,
        popularity: calcPopularity(lib.npm),
      }))
      .sort((a, b) => b.popularity - a.popularity),
    query: ctx.query,
  };
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  librariesContainer: {
    paddingTop: 6,
    paddingBottom: 4,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  headerWrapper: {
    paddingTop: 28,
    paddingBottom: 32,
    marginBottom: 12,
  },
  header: {
    textAlign: 'center',
  },
  subHeader: {
    marginTop: 16,
    marginBottom: 8,
  },
  subHeaderIcon: {
    marginTop: 4,
    marginRight: 12,
    float: 'left',
  },
});

export default Explore;
