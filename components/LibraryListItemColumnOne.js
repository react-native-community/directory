import React from 'react';

import * as SVG from '../common/svg';

import Link from '../components/Link';
import PercentageBar from '../components/PercentageBar';
import LibraryListColumn from '../components/LibraryListColumn';

const getPercentageValueRemaining = item => {
  let amount = 0;

  [item.ios, item.android, item.web, item.expo].forEach(v => {
    if (v) {
      amount += 1;
    }
  });

  return 100 - amount / 4 * 100;
};

export default props => {
  return (
    <LibraryListColumn>
      <style jsx>{`
        .column-one-top {
          width: 100%;
          color: #24292e;
          font-weight: 700;
          font-size: 1.3rem;
        }

        .column-one-bottom {
          margin: 24px 0 0 0;
          max-width: 180px;
          width: 100%;
        }

        .column-one-bottom-label {
          font-family: 'office-code-medium', monospace;
          font-size: 0.65rem;
          text-transform: uppercase;
          margin: 16px 0 8px 0;
        }

        .column-one-bottom-award {
          font-family: 'office-code', monospace;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          margin: 8px 0 0 0;
        }

        .column-one-bottom-award-text {
          margin: 0 0 0 8px;
        }
      `}</style>
      <div className="column-one-top">
        <Link isDarkStyled target="blank" href={props.library.github.urls.repo}>
          {props.library.github.name}
        </Link>
        {props.library.goldstar
          ? <div className="column-one-bottom-award">
              {SVG.award}
              <span className="column-one-bottom-award-text">
                Recommended library
              </span>
            </div>
          : undefined}
      </div>

      <div className="column-one-bottom">
        <div className="column-one-bottom-label">Health</div>
        <PercentageBar percentageRemaining={100 - props.library.score} />
      </div>
    </LibraryListColumn>
  );
};
