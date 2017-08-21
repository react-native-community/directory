import React from 'react';

import * as SVG from '../common/svg';
import { isEmptyOrNull } from '../common/strings';

import Link from '../components/Link';
import TopicItem from '../components/TopicItem';
import ImageTooltipContainer from '../components/ImageTooltipContainer';
import LibraryListColumn from '../components/LibraryListColumn';
import data from '../build/data.json';

const { topics } = data;

export default props => {
  return (
    <LibraryListColumn isWide isBodyTextStyled>
      <style jsx>{`
        .column-two-section {
          margin: 0 0 24px 0;
        }

        .column-two-section--compat {
          font-family: 'office-code', monospace;
          font-size: 0.75rem;
          white-space: pre-wrap;
        }
      `}</style>
      {!isEmptyOrNull(props.library.github.description)
        ? <p className="column-two-section">
            {props.library.github.description}
          </p>
        : undefined}

      {props.library.examples && props.library.examples.length
        ? <div className="column-two-section">
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
        : undefined}

      <div className="column-two-section column-two-section--compat">
        {[
          props.library.ios ? '✅ iOS' : '⛔ iOS',
          props.library.android ? '✅ Android' : '⛔ Android',
          props.library.expo ? '✅ Expo' : '⛔ Expo',
          props.library.web ? '✅ Web' : '⛔ Web',
        ].map((each, idx, arr) => {
          return `${each}   `;
        })}
      </div>

      {props.library.images.length
        ? <div className="column-two-section">
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
        : undefined}

      {props.library.github.topics
        ? <div className="column-two-section">
            {props.library.github.topics.map(each => (
              <TopicItem
                key={`list-${props.library.name}-${each}`}
                count={topics[each]}>
                {each}
              </TopicItem>
            ))}
          </div>
        : undefined}
    </LibraryListColumn>
  );
};
