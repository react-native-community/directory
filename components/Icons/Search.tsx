import React from 'react';
import { Path, Svg } from 'react-native-svg';

type Props = {
  size?: number;
  fill?: string;
};

export function Search(props: Props) {
  const { size, fill } = props;
  return (
    <Svg width={size || 18} height={size || 18} viewBox="0 0 18 18" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.073 7.188a5.118 5.118 0 015.12-5.117c2.827 0 5.12 2.291 5.12 5.117a5.118 5.118 0 01-5.12 5.117 5.118 5.118 0 01-5.12-5.117zM7.193 0A7.19 7.19 0 000 7.188a7.19 7.19 0 007.192 7.189 7.163 7.163 0 004.261-1.397L16.544 18 18 16.525l-5.071-5A7.19 7.19 0 007.193 0z"
        fill={fill}
      />
    </Svg>
  );
}
