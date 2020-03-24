import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// TODO: fix ts types on this lib so it can pick up on regular CircularProgressExport
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import * as SVG from '../util/svg';
import ExternalLink from './ExternalLink';
import LibraryListColumn from '../components/LibraryListColumn';

export default function LibraryListColumnOne({ library }) {
  return (
    <LibraryListColumn style={{ alignItems: 'flex-start' }}>
      <View style={styles.titleRow}>
        <ExternalLink href={library.github.urls.repo} isColored={false}>
          {library.github.name}
        </ExternalLink>
        {library.goldstar ? (
          <View style={styles.award}>
            <SVG.Award />
            <Text style={styles.awardText}>Recommended library</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.qualityRow}>
        <AnimatedCircularProgress
          size={18}
          width={4}
          fill={library.score}
          rotation={0}
          prefill={library.score}
          tintColor="#00e0ff"
          backgroundColor="#eee"
        />
        <Text style={styles.qualityRowLabel}>{library.score} Directory Score</Text>
      </View>
    </LibraryListColumn>
  );
}

let styles = StyleSheet.create({
  titleRow: {},
  qualityRow: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
  },
  qualityRowLabel: {
    marginLeft: 7,
    fontSize: 13,
  },
  award: {
    marginTop: 14,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  awardText: {
    marginLeft: 5,
  },
});
