import { type SVGAttributes } from 'react';
import ContentLoader from 'react-content-loader';

import { useLayout } from '~/common/styleguide';
import tw from '~/util/tailwind';

type Props = {
  width?: string | number;
  height?: string | number;
  wrapperStyle?: SVGAttributes<SVGSVGElement>['style'];
};

export default function LoadingContent({ width = '100%', height = 204, wrapperStyle = {} }: Props) {
  const { isSmallScreen } = useLayout();
  return (
    <ContentLoader
      speed={2}
      width={isSmallScreen ? '100%' : width}
      height={height}
      backgroundColor={tw.prefixMatch('dark') ? '#2a2e36' : '#f3f3f3'}
      foregroundColor={tw.prefixMatch('dark') ? '#383c42' : '#ecebeb'}
      style={{
        ...tw`mb-4 box-border rounded-md border border-solid border-palette-gray2 dark:border-default`,
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
}
