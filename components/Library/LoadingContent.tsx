import { SVGAttributes, useContext } from 'react';
import ContentLoader from 'react-content-loader';

import { colors, darkColors, useLayout } from '~/common/styleguide';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';

type Props = {
  width?: string | number;
  height?: string | number;
  wrapperStyle?: SVGAttributes<SVGSVGElement>['style'];
};

const LoadingContent = ({ width = '100%', height = 204, wrapperStyle = {} }: Props) => {
  const { isDark } = useContext(CustomAppearanceContext);
  const { isSmallScreen } = useLayout();
  return (
    <ContentLoader
      speed={2}
      width={isSmallScreen ? '100%' : width}
      height={height}
      backgroundColor={isDark ? '#2a2e36' : '#f3f3f3'}
      foregroundColor={isDark ? '#383c42' : '#ecebeb'}
      style={{
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: isDark ? darkColors.border : colors.gray2,
        borderRadius: 6,
        marginBottom: 16,
        boxSizing: 'border-box',
        ...wrapperStyle,
      }}>
      <rect x="20" y="20" rx="3" ry="3" width="288" height="25" />
      <rect x="20" y="56" rx="3" ry="3" width="88" height="20" />
      <rect x="20" y="88" rx="3" ry="3" width={isSmallScreen ? '320' : '410'} height="14" />
      <rect x="20" y="110" rx="3" ry="3" width={isSmallScreen ? '250' : '380'} height="14" />
      <rect x="118" y="56" rx="3" ry="3" width="60" height="20" />
      <rect x="192" y="56" rx="3" ry="3" width="72" height="20" />
      <rect x="20" y="170" rx="3" ry="3" width={isSmallScreen ? '220' : '306'} height="14" />
    </ContentLoader>
  );
};

export default LoadingContent;
