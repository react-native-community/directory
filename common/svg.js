import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export const Website = props => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#555" {...props}>
    <Circle cx={12} cy={12} r={10} />
    <Path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </Svg>
);

export const Download = props => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#555" {...props}>
    <Path d="M8 17l4 4 4-4M12 12v9" />
    <Path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29" />
  </Svg>
);

export const File = props => (
  <Svg width={16} height={16} viewBox="0 0 24 24" {...props}>
    <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="none" stroke="#555" />
    <Path fill="none" stroke="#555" d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </Svg>
);

export const Star = props => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#555" {...props}>
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </Svg>
);

export const Calendar = props => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#555" {...props}>
    <Rect x={3} y={4} width={18} height={18} rx={2} ry={2} />
    <Path d="M16 2v4M8 2v4M3 10h18" />
  </Svg>
);

export const Award = props => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#555" {...props}>
    <Circle cx={12} cy={8} r={7} />
    <Path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
  </Svg>
);
