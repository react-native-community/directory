import { useContext } from 'react';
import { View } from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';

import { colors, darkColors } from '../../common/styleguide';
import CustomAppearanceContext from '../../context/CustomAppearanceContext';
import Tooltip from '../Tooltip';

type Props = {
  score: number;
};

export function DirectoryScore({ score }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);

  const chunk = 100 / 6;
  const getFill = (chunkNumber = 1) =>
    score >= chunk * chunkNumber ? colors.primaryDark : isDark ? darkColors.pewter : colors.gray3;

  return (
    <Tooltip
      trigger={
        <View>
          <Svg
            width={24}
            height={22}
            viewBox="0 0 22 20"
            fill="none"
            accessibilityLabel={`Score: ${score} out of 100`}>
            <Path
              d="M16.3789 5.76173C15.121 5.48057 14.2348 5.38423 13.3789 5.29298C12.8203 4.43746 12.0547 3.58199 11.4922 2.92966C12.5273 1.88672 14.8061 0.125596 15.9998 0.932227C17.1682 1.72171 16.7109 4.50782 16.3789 5.76173Z"
              fill={getFill()}
            />
            <Path
              d="M17.0621 12.5824C16.6766 11.3525 16.3169 10.5368 15.968 9.74996C16.4296 8.83845 16.7877 7.74766 17.0713 6.93436C18.4921 7.30936 21.1567 8.40227 21.055 9.83938C20.9555 11.2459 18.314 12.243 17.0621 12.5824Z"
              fill={getFill(2)}
            />
            <Path
              d="M11.4865 16.5789C12.3589 15.6301 12.8855 14.9107 13.3924 14.2152C14.4126 14.1592 15.5363 13.9238 16.3825 13.7629C16.7681 15.1808 17.1539 18.0349 15.8585 18.6653C14.5906 19.2824 12.4064 17.4934 11.4865 16.5789Z"
              fill={getFill(3)}
            />
            <Path
              d="M5.23608 13.7592C6.49394 14.0404 7.38024 14.1367 8.23608 14.228C8.79468 15.0835 9.5603 15.9389 10.1228 16.5913C9.08765 17.6342 6.80888 19.3953 5.61515 18.5887C4.44681 17.7992 4.90405 15.0131 5.23608 13.7592Z"
              fill={getFill(4)}
            />
            <Path
              d="M4.55294 6.93852C4.93837 8.16844 5.29809 8.98416 5.64699 9.77097C5.18538 10.6825 4.82734 11.7733 4.54365 12.5866C3.12286 12.2116 0.458298 11.1187 0.559997 9.68155C0.659532 8.275 3.30101 7.27792 4.55294 6.93852Z"
              fill={getFill(5)}
            />
            <Path
              d="M10.1285 2.94207C9.25607 3.89083 8.7295 4.61021 8.22255 5.30577C7.20235 5.36177 6.07868 5.59709 5.23249 5.75806C4.84686 4.34012 4.46106 1.48608 5.75649 0.8556C7.02437 0.238523 9.2086 2.02757 10.1285 2.94207Z"
              fill={getFill(6)}
            />
            <Circle cx="10.8074" cy="9.75731" r="1.98916" fill={colors.primaryDark} />
          </Svg>
        </View>
      }>
      {score} / 100
    </Tooltip>
  );
}
