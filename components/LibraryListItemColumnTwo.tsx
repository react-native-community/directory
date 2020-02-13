import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { isEmptyOrNull } from '../util/strings';

import ExternalLink from './ExternalLink';
import TopicItem from './TopicItem';
import LibraryListColumn from './LibraryListColumn';

export default function LibraryListItemColumnTwo(props) {
  return (
    <LibraryListColumn isWide style={{ marginBottom: 0 }}>
      {!isEmptyOrNull(props.library.github.description) ? (
        <Text style={styles.sectionText}>{props.library.github.description}</Text>
      ) : (
        undefined
      )}

      {props.library.examples && props.library.examples.length ? (
        <View style={[styles.section, { flexDirection: 'row' }]}>
          <Text>Code Examples: </Text>
          {props.library.examples.map((each, index) => {
            return (
              <ExternalLink
                target="blank"
                key={`${props.library.name}-${each}-${index}`}
                style={{ marginRight: 5 }}
                href={each}>
                #{index + 1}
              </ExternalLink>
            );
          })}
        </View>
      ) : null}

      <Text style={[styles.section, styles.sectionCompact]}>
        {[
          props.library.ios ? '✅ iOS' : '⛔ iOS',
          props.library.android ? '✅ Android' : '⛔ Android',
          props.library.web ? '✅ Web' : '⛔ Web',
          props.library.expo && typeof props.library.expo !== 'string'
            ? '✅ Managed Expo'
            : '⛔ Managed Expo',
        ].map(each => {
          return `${each}   `;
        })}
      </Text>

      {props.library.github.topics ? (
        <View style={[styles.section, { flexDirection: 'row' }]}>
          {props.library.github.topics.map(each => (
            <View style={{ marginRight: 8 }} key={each}>
              <TopicItem>{each}</TopicItem>
            </View>
          ))}
        </View>
      ) : null}
    </LibraryListColumn>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionText: {
    lineHeight: 24,
    marginBottom: 18,
  },
  sectionCompact: {
    fontSize: 12,
    flexDirection: 'row',
    fontFamily: 'office-code',
    marginBottom: 15,
  },
});
