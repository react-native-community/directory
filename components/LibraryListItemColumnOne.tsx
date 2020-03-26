import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// TODO: fix ts types on this lib so it can pick up on regular CircularProgressExport
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import * as SVG from '../util/svg';
import { isEmptyOrNull } from '../util/strings';
import { A } from '../common/styleguide';

export default function LibraryListColumnOne({ library }) {
  return (
    <View style={{ alignItems: 'flex-start', flex: 1 }}>
      <View>
        <A href={library.github.urls.repo}>{library.github.name}</A>
        {library.goldstar ? (
          <View style={styles.award}>
            <SVG.Award />
            <Text style={styles.awardText}>Recommended library</Text>
          </View>
        ) : null}
      </View>

      <Text>
        {[
          library.ios ? '✅ iOS' : '⛔ iOS',
          library.android ? '✅ Android' : '⛔ Android',
          library.web ? '✅ Web' : '⛔ Web',
          library.expo && typeof library.expo !== 'string' ? '✅ Expo client' : '⛔ Expo client',
        ].map(each => {
          return `${each}   `;
        })}
      </Text>

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

      {!isEmptyOrNull(library.github.description) ? (
        <Text style={styles.sectionText}>{library.github.description}</Text>
      ) : (
        undefined
      )}

      {library.examples && library.examples.length ? (
        <View style={[{ flexDirection: 'row' }]}>
          <Text>Code Examples: </Text>
          {library.examples.map((each, index) => {
            return (
              <A
                target="blank"
                key={`${library.name}-${each}-${index}`}
                style={{ marginRight: 5 }}
                href={each}>
                #{index + 1}
              </A>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

let styles = StyleSheet.create({
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
  sectionText: {
    lineHeight: 24,
    marginBottom: 18,
  },
});
