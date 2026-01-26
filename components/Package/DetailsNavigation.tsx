import { Fragment } from 'react';
import { View } from 'react-native';

import { A, Label, useLayout } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import { Warning } from '~/components/Icons';
import Navigation from '~/components/Navigation';
import NavigationTab from '~/components/NavigationTab';
import { type LibraryType } from '~/types';
import { strippedBackground } from '~/util/style';
import tw from '~/util/tailwind';

type Props = {
  library: LibraryType;
};

export default function DetailsNavigation({ library }: Props) {
  const { isSmallScreen } = useLayout();
  const alternativesLength = library.alternatives?.length ?? 0;

  return (
    <Navigation
      title={`${library.template ? 'Template' : 'Package'} information`}
      style={[tw`gap-1 pb-3 pt-9`, isSmallScreen && tw`gap-1.5 pt-5`]}
      subHeader={
        library.unmaintained ? (
          <View
            style={[
              tw`border-b border-t border-palette-gray3 bg-palette-gray1 dark:border-palette-gray6 dark:bg-dark`,
              strippedBackground(tw.prefixMatch('dark') ? 'var(--background)' : 'var(--gray-2)'),
            ]}>
            <ContentContainer
              style={tw`flex-row flex-wrap items-center gap-x-0.5 gap-y-1 px-5 py-2 text-warning-dark dark:text-warning`}>
              <Warning style={tw`size-4.5 mr-1 flex-shrink-0`} />
              <Label style={tw`text-warning-dark dark:text-warning`}>
                This library is not actively maintained.
              </Label>
              {library.alternatives && alternativesLength > 0 && (
                <Label style={tw`text-warning-dark dark:text-warning`}>
                  You can use{' '}
                  {library.alternatives.map((alternative, index) => (
                    <Fragment key={alternative}>
                      <A
                        href={`/package/${alternative}`}
                        style={tw`decoration-secondary dark:decoration-palette-gray5`}
                        hoverStyle={tw`decoration-warning-dark dark:decoration-warning`}>
                        {alternative}
                      </A>
                      {index < alternativesLength - 1 && alternativesLength > 2 ? ', ' : ' '}
                      {index === alternativesLength - 2 && 'or '}
                    </Fragment>
                  ))}{' '}
                  instead.
                </Label>
              )}
            </ContentContainer>
          </View>
        ) : undefined
      }>
      <ContentContainer style={tw`flex-row gap-2 px-5`}>
        <NavigationTab title="Overview" path={`/package/${library.npmPkg}`} />
        {!library.template && (
          <NavigationTab
            title="Versions"
            counter={library.npm?.versionsCount}
            path={`/package/${library.npmPkg}/versions`}
          />
        )}
        <NavigationTab title="Score" path={`/package/${library.npmPkg}/score`} />
      </ContentContainer>
    </Navigation>
  );
}
