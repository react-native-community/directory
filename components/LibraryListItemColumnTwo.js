import React from 'react';

import * as SVG from '../common/svg';
import { isEmptyOrNull } from '../common/strings';

import Link from '../components/Link';
import TopicItem from '../components/TopicItem';
import ImageTooltipContainer from '../components/ImageTooltipContainer';

export default props => {
  return (
    <div>
      <style jsx>{`
        .column-two-section {
          margin: 0 0 24px 0;
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

      <div className="column-two-section">
        Compatible with{' '}
        {[
          props.library.web ? 'Web' : null,
          props.library.ios ? 'iOS' : null,
          props.library.android ? 'Android' : null,
          props.library.expo ? 'Expo' : null,
          'React Native',
        ].map((each, idx, arr) => {
          if (!each) {
            return null;
          }

          return `${each}${idx !== arr.length - 1 ? ', ' : ''}`;
        })}
      </div>

      {props.library.images.length
        ? <div className="column-two-section">
            {props.library.images.map((each, index) => {
              return (
                <ImageTooltipContainer
                  key={`${props.library.github.name}-image-${index}`}
                  src={each}
                  count={index}
                />
              );
            })}
          </div>
        : undefined}

      <div className="column-two-section">
        {props.library.github.topics.map(each =>
          <TopicItem
            key={`list-${props.library.name}-${each}`}
            count={props.topics[each]}>
            {each}
          </TopicItem>
        )}
      </div>
    </div>
  );
};
