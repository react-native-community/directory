import React from 'react';

import * as SVG from '../common/svg';
import { getTimeSinceToday } from '../common/datetime';

import Link from '../components/Link';
import LibraryListColumn from '../components/LibraryListColumn';

const renderListItem = (data, index) => {
  return (
    <li className="list-item" key={`list-item-${index}`}>
      <style jsx>{`
        .list-item {
          margin: 2px 0 6px 0;
          display: flex;
          align-items: center;
          font-family: 'office-code', monospace;
          font-size: 0.75rem;
        }

        .list-item-svg {
          margin: 0 8px 0 0;
        }
      `}</style>
      <span className="list-item-svg">
        {data.svg}
      </span>
      {data.content}
    </li>
  );
};

export default props => {
  const items = [
    {
      svg: SVG.calendar,
      content: `Updated ${getTimeSinceToday(
        props.library.github.stats.pushedAt
      )}`,
    },
    {
      svg: SVG.star,
      content: `${props.library.github.stats.stars} stars`,
    },
  ];

  if (props.library.npm.downloads) {
    items.push({
      svg: SVG.download,
      content: (
        <Link
          isStyled
          target="blank"
          href={`https://www.npmjs.com/package/${props.library.npmPkg}`}>
          {`${props.library.npm.downloads}`} downloads{' '}
          {props.library.npm.period}ly
        </Link>
      ),
    });
  }

  if (props.library.github.stats.issues > 0) {
    items.push({
      svg: SVG.file,
      content: (
        <Link
          isStyled
          target="blank"
          href={`${props.library.github.urls.repo}/issues`}>
          {`${props.library.github.stats.issues}`} issues
        </Link>
      ),
    });
  }

  if (props.library.github.urls.homepage) {
    items.push({
      svg: SVG.website,
      content: (
        <Link isStyled target="blank" href={props.library.github.urls.homepage}>
          Visit Website
        </Link>
      ),
    });
  }

  const elements = items.map(renderListItem);

  return (
    <LibraryListColumn>
      {elements}
    </LibraryListColumn>
  );
};
