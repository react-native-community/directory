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
          props.library.windows ? '✅ Windows' : '⛔ Windows',
          props.library.macos ? '✅ macOS' : '⛔ macOS',
          props.library.expo ? '✅ Expo client' : '⛔ Expo client',
        ].map(each => {
          return `${each}   `;
        })}
      </Text>

      {props.library.github.topics ? (
        <View style={styles.section}>
          <Text>
            {props.library.github.topics.map(each => (
              <TopicItem key={`list-${props.library.name}-${each}`}>{each}</TopicItem>
            ))}
          </Text>
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
    fontFamily: 'office-code',
    marginBottom: 15,
  },
});
