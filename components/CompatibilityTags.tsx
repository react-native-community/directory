import { View } from 'react-native';

import { A } from '~/common/styleguide';
import { type LibraryType } from '~/types';
import tw from '~/util/tailwind';

import { Info } from './Icons';
import { NewArchitectureTag } from './Library/NewArchitectureTag';
import { Tag } from './Tag';
import Tooltip from './Tooltip';

type Props = {
  library: LibraryType;
};

export default function CompatibilityTags({ library }: Props) {
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
    <View style={tw`flex-row flex-wrap items-center gap-1.5`}>
      {library.dev ? (
        <Tag
          label="Development Tool"
          tagStyle={tw`bg-[#ece3fc] border-[#d9c8fa] dark:bg-[#261a3d] dark:border-[#3d2861]`}
          icon={null}
        />
      ) : null}
      {library.template ? (
        <Tag
          label="Template"
          tagStyle={tw`bg-[#fce1f5] border-[#f5c6e8] dark:bg-[#37172e] dark:border-[#52213e]`}
          icon={null}
        />
      ) : null}
      {!library.dev && !library.template && <NewArchitectureTag library={library} />}
      {platforms.map(platform =>
        platform ? (
          <Tag
            label={platform}
            key={`${platform}-platform`}
            tagStyle={tw`bg-palette-gray1 border-palette-gray2 dark:bg-dark dark:border-default`}
          />
        ) : null
      )}
      {(library.expoGo ?? library.fireos ?? library.vegaos ?? library.horizon) && (
        <Tooltip
          side="bottom"
          trigger={
            <View
              style={tw`items-center justify-center cursor-pointer rounded-full`}
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
                  style={tw`text-xs text-white font-light`}>
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
