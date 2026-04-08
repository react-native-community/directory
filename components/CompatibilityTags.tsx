import { View } from 'react-native';

import { A, useLayout } from '~/common/styleguide';
import { type LibraryType } from '~/types';
import tw from '~/util/tailwind';

import { Info } from './Icons';
import { NewArchitectureTag } from './Library/NewArchitectureTag';
import { Tag } from './Tag';
import Tooltip from './Tooltip';

type Props = {
  library: LibraryType;
  small?: boolean;
};

export default function CompatibilityTags({ library, small }: Props) {
  const { isSmallScreen } = useLayout();

  const platforms = [
    library.android ? 'Android' : null,
    library.ios ? 'iOS' : null,
    library.macos ? 'macOS' : null,
    library.tvos ? 'tvOS' : null,
    library.visionos ? 'visionOS' : null,
    library.web ? 'Web' : null,
    library.windows ? 'Windows' : null,
  ].filter(Boolean);

  return (
    <View style={tw`max-w-full flex-row flex-wrap items-center gap-1.5`}>
      {library.dev ? (
        <Tag
          label="Development Tool"
          tagStyle={tw`border-[#d9c8fa] bg-[#ece3fc] dark:border-[#3d2861] dark:bg-[#261a3d]`}
          icon={null}
          small={small}
        />
      ) : null}
      {!library.dev && <NewArchitectureTag library={library} small={small} />}
      {platforms.map(platform =>
        platform ? (
          <Tag
            label={platform}
            key={`${platform}-platform`}
            tagStyle={tw`border-palette-gray2 bg-palette-gray1 dark:border-default dark:bg-dark`}
            small={small}
          />
        ) : null
      )}
      {!(small && isSmallScreen) &&
        (library.expoGo ?? library.fireos ?? library.vegaos ?? library.horizon) && (
          <Tooltip
            side="bottom"
            trigger={
              <View
                style={tw`cursor-pointer items-center justify-center rounded-full`}
                role="button"
                aria-label="Additional information">
                <Info style={tw`text-icon`} />
              </View>
            }>
            Additional information
            <br />
            <ul style={tw`m-0 pl-3.5`}>
              {library.expoGo && <li>Works with Expo Go</li>}
              {library.fireos && <li>Works with Fire OS</li>}
              {library.horizon && <li>Works with Meta Horizon OS</li>}
              {library.vegaos && typeof library.vegaos === 'boolean' && <li>Works with Vega OS</li>}
              {library.vegaos && typeof library.vegaos === 'string' && (
                <li>
                  Works with Vega OS
                  <br />
                  <A
                    href={`https://www.npmjs.com/package/${library.vegaos}`}
                    style={tw`text-xs font-light text-white`}>
                    (via dedicated support package)
                  </A>
                </li>
              )}
            </ul>
          </Tooltip>
        )}
    </View>
  );
}
