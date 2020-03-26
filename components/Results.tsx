import React from 'react';
import { Library } from '../types';
import LibraryListEmptyState from './LibraryListEmptyState';
import LibraryListItem from './LibraryListItem';

type Props = {
  libraries: Library[];
};

export default function Results(props: Props) {
  const { libraries } = props;

  if (!libraries || !libraries.length) {
    return <LibraryListEmptyState />;
  }

  return (
    <>
      {libraries.map((item: any, index: number) => (
        <LibraryListItem
          key={`list-item-${index}-${item.github.name}`}
          library={item}
          isLastItem={index === libraries.length - 1}
        />
      ))}
    </>
  );
}
