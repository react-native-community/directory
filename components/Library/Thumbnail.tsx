import React, { memo } from 'react';
import { Thumbnail as ThumbnailIcon } from '../Icons';

interface ThumbnailProps {
  url: string;
}

const Thumbnail = ({ url }: ThumbnailProps) => {
  return (
    <a data-tip={url} data-for="preview" className="thumbnail-link">
      <ThumbnailIcon />
    </a>
  );
};

export default memo(Thumbnail);
