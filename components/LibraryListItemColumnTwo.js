import React from 'react';

import * as SVG from '../common/svg';
import { isEmptyOrNull } from '../common/strings';
import { StyleSheet, css } from 'glamor/aphrodite';

import Link from '../components/Link';
import TopicItem from '../components/TopicItem';
import ImageTooltipContainer from '../components/ImageTooltipContainer';
import LibraryListColumn from '../components/LibraryListColumn';
import data from '../build/data.json';

const { topics } = data;

export default props => {
  return (
    <LibraryListColumn isWide isBodyTextStyled>
      {!isEmptyOrNull(props.library.github.description) ? (
        <p className={css(styles.section)}>{props.library.github.description}</p>
      ) : (
        undefined
      )}

      {props.library.examples && props.library.examples.length ? (
        <div className={css(styles.section)}>
          Code Examples:{' '}
          {props.library.examples.map((each, index) => {
            return (
              <Link
                isStyled
                target="blank"
                key={`${props.library.name}-${each}-${index}`}
                href={each}>
                #{index + 1}
              </Link>
            );
          })}
        </div>
      ) : (
        undefined
      )}

      <div className={css(styles.section, styles.sectionCompact)}>
        {[
          props.library.ios ? '✅ iOS' : '⛔ iOS',
          props.library.android ? '✅ Android' : '⛔ Android',
          props.library.expo && typeof props.library.expo !== 'string' ? '✅ Expo' : '⛔ Expo',
          props.library.web ? '✅ Web' : '⛔ Web',
        ].map((each, idx, arr) => {
          return `${each}   `;
        })}
      </div>

      {props.library.images.length ? (
        <div className={css(styles.section)}>
          {props.library.images.map((each, index) => {
            return (
              <ImageTooltipContainer
                isMobile={props.isMobile}
                key={`${props.library.github.name}-image-${index}`}
                src={each}
                count={index}
              />
            );
          })}
        </div>
      ) : (
        undefined
      )}

      {props.library.github.topics ? (
        <div className={css(styles.section)}>
          {props.library.github.topics.map(each => (
            <TopicItem key={`list-${props.library.name}-${each}`} count={topics[each]}>
              {each}
            </TopicItem>
          ))}
        </div>
      ) : (
        undefined
      )}
    </LibraryListColumn>
  );
};

const styles = StyleSheet.create({
  section: {
    margin: '0 0 24px 0',
  },
  sectionCompact: {
    fontFamily: `'office-code', monospace`,
    fontSize: '0.75rem',
    whiteSpace: 'pre-wrap',
  },
});
