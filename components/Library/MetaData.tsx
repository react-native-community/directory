import { partition } from 'es-toolkit';
import { View } from 'react-native';

import { A, Caption, P } from '~/common/styleguide';
import { FILTER_MODULE_TYPE } from '~/components/Filters/helpers';
import {
  Code,
  ConfigPlugin,
  Dependency,
  Download,
  Eye,
  Fork,
  Issue,
  License,
  Module,
  NativeCode,
  NightlyTest,
  PackageSize,
  Star,
  TypeScript,
  Web,
} from '~/components/Icons';
import { ConfigPluginContent, getConfigPluginText } from '~/components/Library/ConfigPlugin';
import Tooltip from '~/components/Tooltip';
import { type LibraryType, type MetadataEntryType } from '~/types';
import { formatBytes } from '~/util/formatBytes';
import { pluralize } from '~/util/strings';
import tw from '~/util/tailwind';

import { DirectoryScore } from './DirectoryScore';

type Props = {
  library: LibraryType;
  secondary?: boolean;
  skipExamples?: boolean;
};

const linkStyle = tw`text-[15px] font-light -outline-offset-1`;

function generateData({
  github,
  score,
  npm,
  npmPkg,
  matchingScoreModifiers,
  template,
}: LibraryType): MetadataEntryType[] {
  return [
    {
      id: 'score',
      icon: <DirectoryScore score={score} matchingScoreModifiers={matchingScoreModifiers} />,
      content: (
        <A target="_self" href={`/package/${npmPkg}/score`} style={linkStyle}>
          Directory Score
        </A>
      ),
    },
    npm?.downloads
      ? {
          id: 'downloads',
          icon: <Download style={tw`text-icon`} width={16} height={18} />,
          content: (
            <A
              href={`https://www.npmjs.com/package/${npmPkg}`}
              style={linkStyle}
              containerStyle={{ textOverflow: 'ellipsis' }}>
              {`${npm.downloads.toLocaleString()}`} monthly downloads
            </A>
          ),
        }
      : null,
    {
      id: 'star',
      icon: <Star style={tw`text-icon`} />,
      content: (
        <A href={`${github.urls.repo}/stargazers`} style={linkStyle}>
          {github.stats.stars.toLocaleString()} {pluralize('star', github.stats.stars)}
        </A>
      ),
    },
    github.stats?.dependencies !== undefined
      ? {
          id: 'dependencies',
          icon: <Dependency style={tw`text-icon`} />,
          content: template ? (
            <P style={linkStyle}>
              {`${github.stats.dependencies} ${pluralize('dependency', github.stats?.dependencies ?? 0)}`}
            </P>
          ) : (
            <A
              href={`https://www.npmjs.com/package/${npmPkg}?activeTab=dependencies`}
              style={linkStyle}>
              {`${github.stats.dependencies} ${pluralize('dependency', github.stats?.dependencies ?? 0)}`}
            </A>
          ),
        }
      : null,
    npm?.size
      ? {
          id: 'size',
          icon: <PackageSize style={tw`text-icon`} />,
          content: (
            <A href={`https://www.npmjs.com/package/${npmPkg}?activeTab=code`} style={linkStyle}>
              {`${formatBytes(npm.size)} package size`}
            </A>
          ),
        }
      : null,
    github.stats.forks
      ? {
          id: 'forks',
          icon: <Fork style={tw`text-icon`} width={16} height={17} />,
          content: (
            <A href={`${github.urls.repo}/network/members`} style={linkStyle} aria-label="Forks">
              {`${github.stats.forks.toLocaleString()}`}
            </A>
          ),
          tooltip: 'Forks',
        }
      : null,
    github.stats.subscribers
      ? {
          id: 'subscribers',
          icon: <Eye style={tw`text-icon`} />,
          content: (
            <A href={`${github.urls.repo}/watchers`} style={linkStyle} aria-label="Watchers">
              {`${github.stats.subscribers.toLocaleString()}`}
            </A>
          ),
          tooltip: 'Watchers',
        }
      : null,
    github.stats.issues
      ? {
          id: 'issues',
          icon: <Issue style={tw`text-icon`} />,
          content: (
            <A href={`${github.urls.repo}/issues`} style={linkStyle} aria-label="Issues">
              {`${github.stats.issues.toLocaleString()}`}
            </A>
          ),
          tooltip: 'Issues',
        }
      : null,
  ];
}

function generateSecondaryData(library: LibraryType, skipExamples: boolean): MetadataEntryType[] {
  const { github, examples, nightlyProgram } = library;
  const configPlugin = library.configPlugin ?? library.github.configPlugin;

  const iconColor = [
    tw`text-tertiary`,
    skipExamples && tw`text-palette-gray5`,
    tw`dark:text-pewter`,
  ];
  const paragraphStyles = [tw`text-[13px] font-light`, !skipExamples && tw`text-secondary`];
  const hoverStyle = tw`text-hover decoration-palette-gray4`;

  return [
    github.urls.homepage
      ? {
          id: 'web',
          icon: <Web style={iconColor} width={16} height={16} />,
          content: (
            <A href={github.urls.homepage} style={paragraphStyles} hoverStyle={hoverStyle}>
              Website
            </A>
          ),
        }
      : null,
    github.license
      ? {
          id: 'license',
          icon: <License style={iconColor} width={14} height={16} />,
          content:
            github.license.name === 'Other' ? (
              <P style={paragraphStyles}>Unrecognized License</P>
            ) : (
              <A href={github.license.url} style={paragraphStyles} hoverStyle={hoverStyle}>
                {github.license.name}
              </A>
            ),
        }
      : null,
    github.hasNativeCode
      ? {
          id: 'nativeCode',
          icon: <NativeCode style={iconColor} width={16} height={16} />,
          content: <P style={paragraphStyles}>Native code</P>,
        }
      : null,
    configPlugin
      ? {
          id: 'configPlugin',
          icon: <ConfigPlugin style={iconColor} width={16} height={16} />,
          content: (
            <ConfigPluginContent
              configPlugin={configPlugin}
              hoverStyle={hoverStyle}
              linkStyles={paragraphStyles}
              paragraphStyles={paragraphStyles}
            />
          ),
          tooltip: getConfigPluginText(configPlugin),
        }
      : null,
    nightlyProgram
      ? {
          id: 'nightlyProgram',
          icon: <NightlyTest style={iconColor} width={18} height={18} />,
          content: (
            <A
              href={`https://react-native-community.github.io/nightly-tests/?q=${encodeURIComponent(library.npmPkg)}`}
              style={paragraphStyles}
              hoverStyle={hoverStyle}>
              Nightly Program
            </A>
          ),
          tooltip: 'Package is tested against nightly React Native releases.',
        }
      : null,
    skipExamples && library.github.moduleType
      ? {
          id: 'moduleType',
          icon: <Module style={iconColor} width={18} height={18} />,
          content: (
            <P style={paragraphStyles}>
              {
                FILTER_MODULE_TYPE.find(
                  ({ param }) => param === `${library.github.moduleType}Module`
                )?.title
              }
            </P>
          ),
        }
      : null,
    github.hasTypes
      ? {
          id: 'types',
          icon: <TypeScript style={iconColor} width={16} height={16} />,
          content: <P style={paragraphStyles}>TypeScript Types</P>,
        }
      : null,
    !skipExamples && examples && examples.length
      ? {
          id: 'examples',
          icon: <Code style={iconColor} width={16} height={16} />,
          content: (
            <>
              <Caption style={paragraphStyles}>Examples: </Caption>
              {examples.map((example, index) => (
                <A
                  key={example}
                  href={example}
                  style={[...paragraphStyles, tw`ml-0.5 mr-1 text-[13px]`]}
                  hoverStyle={hoverStyle}>
                  #{index + 1}
                </A>
              ))}
            </>
          ),
        }
      : null,
  ];
}

export default function MetaData({ library, secondary, skipExamples = false }: Props) {
  if (secondary) {
    const data = generateSecondaryData(library, skipExamples).filter(Boolean);
    return (
      <>
        {data
          .filter(entry => !!entry)
          .map(({ id, icon, content, tooltip }, i) => {
            const component = (
              <View
                key={id}
                // @ts-expect-error RNW complains about 'fit-content'
                style={{
                  ...(i + 1 !== data.length ? tw`mb-2 min-h-[22px] overflow-hidden` : {}),
                  ...tw`mb-0 flex-row items-center pr-[3px]`,
                  width: 'fit-content',
                }}>
                <View style={tw`mr-1 min-w-[22px] items-center`}>{icon}</View>
                {content}
              </View>
            );

            return tooltip ? (
              <Tooltip key={id} sideOffset={2} delayDuration={100} trigger={component}>
                {tooltip}
              </Tooltip>
            ) : (
              component
            );
          })}
      </>
    );
  } else {
    const data = generateData(library).filter(entry => !!entry);
    const [bottomData, listData] = partition<NonNullable<MetadataEntryType>>(data, ({ id }) => {
      return ['forks', 'subscribers', 'issues'].includes(id);
    });
    return (
      <>
        {listData.map(({ id, icon, content }, i) => (
          <View
            key={id}
            style={[
              tw`flex-row items-center`,
              i + 1 !== data.length && tw`mb-2 min-h-[22px] overflow-hidden`,
            ]}>
            <View style={tw`mr-[7px] min-w-[22px] items-center`}>{icon}</View>
            {content}
          </View>
        ))}
        <View style={tw`flex-row items-center gap-4`}>
          {bottomData.map(({ id, icon, content, tooltip }) => (
            <View key={id} style={tw`flex-row items-center`}>
              <Tooltip
                key={id}
                sideOffset={2}
                delayDuration={100}
                trigger={<View style={tw`mr-[7px] min-w-[22px] items-center`}>{icon}</View>}>
                {tooltip}
              </Tooltip>
              {content}
            </View>
          ))}
        </View>
      </>
    );
  }
}
