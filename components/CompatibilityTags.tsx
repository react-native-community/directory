import { View } from 'react-native';

import { A } from '~/common/styleguide';
import { NewArchitectureTag } from '~/components/NewArchitectureTag';
import { type LibraryType, type TemplateType } from '~/types';
import tw from '~/util/tailwind';

import { Info } from './Icons';
import { Tag } from './Tag';
import Tooltip from './Tooltip';

type Props = {
  entry: LibraryType | TemplateType;
  isTemplate?: boolean;
};

export default function CompatibilityTags({ entry, isTemplate }: Props) {
  const platforms = [
    entry.android ? 'Android' : null,
    entry.ios ? 'iOS' : null,
    entry.macos ? 'macOS' : null,
    entry.tvos ? 'tvOS' : null,
    entry.visionos ? 'visionOS' : null,
    entry.web ? 'Web' : null,
    entry.windows ? 'Windows' : null,
  ].filter(Boolean);

  return (
    <View style={tw`flex-row flex-wrap items-center gap-1.5`}>
      {isTemplate ? (
        <Tag
          label="Template"
          tagStyle={tw`border-[#f5c6e8] bg-[#fce1f5] dark:border-[#52213e] dark:bg-[#37172e]`}
          icon={null}
        />
      ) : null}
      {entry.dev ? (
        <Tag
          label="Development Tool"
          tagStyle={tw`border-[#d9c8fa] bg-[#ece3fc] dark:border-[#3d2861] dark:bg-[#261a3d]`}
          icon={null}
        />
      ) : null}
      {!entry.dev && <NewArchitectureTag entry={entry} />}
      {platforms.map(platform =>
        platform ? (
          <Tag
            label={platform}
            key={`${platform}-platform`}
            tagStyle={tw`border-palette-gray2 bg-palette-gray1 dark:border-default dark:bg-dark`}
          />
        ) : null
      )}
      {(entry.expoGo ?? entry.fireos ?? entry.vegaos ?? entry.horizon) && (
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
            {entry.expoGo && <li>Works with Expo Go</li>}
            {entry.fireos && <li>Works with Fire OS</li>}
            {entry.horizon && <li>Works with Meta Horizon OS</li>}
            {entry.vegaos && typeof entry.vegaos === 'boolean' && <li>Works with Vega OS</li>}
            {entry.vegaos && typeof entry.vegaos === 'string' && (
              <li>
                Works with Vega OS
                <br />
                <A
                  href={`https://www.npmjs.com/package/${entry.vegaos}`}
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
