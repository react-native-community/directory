import React from 'react';
import { StyleSheet, css } from 'glamor/aphrodite';

import * as SVG from '../common/svg';

import Link from '../components/Link';
import PercentageBar from '../components/PercentageBar';
import LibraryListColumn from '../components/LibraryListColumn';

export default props => {
  return (
    <LibraryListColumn>
      <div className={css(styles.columnTop)}>
        <Link isDarkStyled target="blank" href={props.library.github.urls.repo}>
          {props.library.github.name}
        </Link>
        {props.library.goldstar
          ? <div className={css(styles.columnBottomAward)}>
              {SVG.award}
              <span className={css(styles.columnBottomAwardText)}>
                Recommended library
              </span>
            </div>
          : undefined}
      </div>

      <div className={css(styles.columnBottom)}>
        <div className={css(styles.columnBottomLabel)}>Quality</div>
        <PercentageBar percentageRemaining={100 - props.library.score} />
      </div>
    </LibraryListColumn>
  );
};

let styles = StyleSheet.create({
  columnTop: {
    width: '100%',
    color: '#24292E',
    fontWeight: '700',
    fontSize: '1.3rem',
  },
  columnBottom: {
    margin: '24px 0 0 0',
    maxWidth: '180px',
    width: '100%',
  },
  columnBottomLabel: {
    fontFamily: `'office-code-medium', monospace`,
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    margin: '16px 0 8px 0',
  },
  columnBottomAward: {
    fontFamily: `'office-code', monospace`,
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    margin: '8px 0 0 0',
  },
  columnBottomAwardText: {
    margin: '0 0 0 8px',
  },
});
