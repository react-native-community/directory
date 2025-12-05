import { partition } from 'es-toolkit';
import { useContext } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { colors, A, P, Caption, darkColors } from '~/common/styleguide';
import { FILTER_MODULE_TYPE } from '~/components/Filters/helpers';
import { ConfigPluginContent, getConfigPluginText } from '~/components/Library/ConfigPlugin';
import Tooltip from '~/components/Tooltip';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { type LibraryType, type MetadataEntryType } from '~/types';
import { formatBytes } from '~/util/formatBytes';
import { pluralize } from '~/util/strings';

import { DirectoryScore } from './DirectoryScore';
import {
  Star,
  Download,
  Eye,
  Issue,
  Web,
  License,
  Fork,
  Code,
  TypeScript,
  NativeCode,
  PackageSize,
  Dependency,
  ConfigPlugin,
  Tools,
} from '../Icons';

type Props = {
  library: LibraryType;
  secondary?: boolean;
  skipExamples?: boolean;
};

function generateData(
  { github, score, npm, npmPkg, matchingScoreModifiers, template }: LibraryType,
  isDark: boolean
): MetadataEntryType[] {
  const iconColor = isDark ? darkColors.pewter : colors.gray5;
  return [
    {
      id: 'score',
      icon: <DirectoryScore score={score} matchingScoreModifiers={matchingScoreModifiers} />,
      content: (
        <A target="_self" href={`/package/${npmPkg}/score`} style={styles.link}>
          Directory Score
        </A>
      ),
    },
    npm?.downloads
      ? {
          id: 'downloads',
          icon: <Download fill={iconColor} width={16} height={18} />,
          content: (
            <A
              href={`https://www.npmjs.com/package/${npmPkg}`}
              style={styles.link}
              containerStyle={styles.linkContainer}>
              {`${npm.downloads.toLocaleString()}`} monthly downloads
            </A>
          ),
        }
      : null,
    {
      id: 'star',
      icon: <Star fill={iconColor} />,
      content: (
        <A href={`${github.urls.repo}/stargazers`} style={styles.link}>
          {github.stats.stars.toLocaleString()} stars
        </A>
      ),
    },
    {
      id: 'dependencies',
      icon: <Dependency fill={iconColor} />,
      content: template ? (
        <P style={styles.link}>
          {`${github.stats.dependencies} ${pluralize('dependency', github.stats?.dependencies ?? 0)}`}
        </P>
      ) : (
        <A
          href={`https://www.npmjs.com/package/${npmPkg}?activeTab=dependencies`}
          style={styles.link}>
          {`${github.stats.dependencies} ${pluralize('dependency', github.stats?.dependencies ?? 0)}`}
        </A>
      ),
    },
    npm?.size
      ? {
          id: 'size',
          icon: <PackageSize fill={iconColor} />,
          content: (
            <A href={`https://www.npmjs.com/package/${npmPkg}?activeTab=code`} style={styles.link}>
              {`${formatBytes(npm.size)} package size`}
            </A>
          ),
        }
      : null,
    github.stats.forks
      ? {
          id: 'forks',
          icon: <Fork fill={iconColor} width={16} height={17} />,
          content: (
            <A href={`${github.urls.repo}/network/members`} style={styles.link} aria-label="Forks">
              {`${github.stats.forks.toLocaleString()}`}
            </A>
          ),
          tooltip: 'Forks',
        }
      : null,
    github.stats.subscribers
      ? {
          id: 'subscribers',
          icon: <Eye fill={iconColor} />,
          content: (
            <A href={`${github.urls.repo}/watchers`} style={styles.link} aria-label="Watchers">
              {`${github.stats.subscribers.toLocaleString()}`}
            </A>
          ),
          tooltip: 'Watchers',
        }
      : null,
    github.stats.issues
      ? {
          id: 'issues',
          icon: <Issue fill={iconColor} />,
          content: (
            <A href={`${github.urls.repo}/issues`} style={styles.link} aria-label="Issues">
              {`${github.stats.issues.toLocaleString()}`}
            </A>
          ),
          tooltip: 'Issues',
        }
      : null,
  ];
}

function generateSecondaryData(
  library: LibraryType,
  isDark: boolean,
  skipExamples: boolean
): MetadataEntryType[] {
  const { github, examples } = library;
  const configPlugin = library.configPlugin ?? library.github.configPlugin;

  const secondaryTextColor = {
    color: isDark ? darkColors.secondary : colors.gray5,
  };
  const iconColor = isDark ? darkColors.pewter : skipExamples ? colors.gray5 : colors.secondary;
  const paragraphStyles = [styles.secondaryText, !skipExamples && secondaryTextColor];
  const linkStyles = [...paragraphStyles, !skipExamples && styles.mutedLink];
  const hoverStyle = {
    textDecorationColor: colors.gray4,
    color: isDark ? colors.gray3 : colors.gray5,
  };

  return [
    github.urls.homepage
      ? {
          id: 'web',
          icon: <Web fill={iconColor} width={16} height={16} />,
          content: (
            <A href={github.urls.homepage} style={linkStyles} hoverStyle={hoverStyle}>
              Website
            </A>
          ),
        }
      : null,
    github.license
      ? {
          id: 'license',
          icon: <License fill={iconColor} width={14} height={16} />,
          content:
            github.license.name === 'Other' ? (
              <P style={paragraphStyles}>Unrecognized License</P>
            ) : (
              <A href={github.license.url} style={linkStyles} hoverStyle={hoverStyle}>
                {github.license.name}
              </A>
            ),
        }
      : null,
    github.hasNativeCode
      ? {
          id: 'nativeCode',
          icon: <NativeCode fill={iconColor} width={16} height={16} />,
          content: <P style={paragraphStyles}>Native code</P>,
        }
      : null,
    configPlugin
      ? {
          id: 'configPlugin',
          icon: <ConfigPlugin fill={iconColor} width={16} height={16} />,
          content: (
            <ConfigPluginContent
              configPlugin={configPlugin}
              hoverStyle={hoverStyle}
              linkStyles={linkStyles}
              paragraphStyles={paragraphStyles}
            />
          ),
          tooltip: getConfigPluginText(configPlugin),
        }
      : null,
    skipExamples && library.github.moduleType
      ? {
          id: 'moduleType',
          icon: <Tools fill={iconColor} width={16} height={16} />,
          content: (
            <P style={paragraphStyles}>
              {
                FILTER_MODULE_TYPE.filter(
                  ({ param }) => param === `${library.github.moduleType}Module`
                ).at(0)?.title
              }
            </P>
          ),
        }
      : null,
    github.hasTypes
      ? {
          id: 'types',
          icon: <TypeScript fill={iconColor} width={16} height={16} />,
          content: <P style={paragraphStyles}>TypeScript Types</P>,
        }
      : null,
    !skipExamples && examples && examples.length
      ? {
          id: 'examples',
          icon: <Code fill={iconColor} width={16} height={16} />,
          content: (
            <>
              <Caption style={paragraphStyles}>Examples: </Caption>
              {examples.map((example, index) => (
                <A
                  key={example}
                  href={example}
                  style={[...linkStyles, styles.exampleLink]}
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

export function MetaData({ library, secondary, skipExamples = false }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);

  if (secondary) {
    const data = generateSecondaryData(library, isDark, skipExamples).filter(Boolean);
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
                  ...styles.displayHorizontal,
                  ...(i + 1 !== data.length ? styles.datumContainer : {}),
                  ...styles.secondaryContainer,
                  width: 'fit-content',
                }}>
                <View style={[styles.iconContainer, styles.secondaryIconContainer]}>{icon}</View>
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
    const data = generateData(library, isDark).filter(entry => !!entry);
    const [bottomData, listData] = partition<NonNullable<MetadataEntryType>>(data, ({ id }) => {
      return ['forks', 'subscribers', 'issues'].includes(id);
    });
    return (
      <>
        {listData.map(({ id, icon, content }, i) => (
          <View
            key={id}
            style={[styles.displayHorizontal, i + 1 !== data.length ? styles.datumContainer : {}]}>
            <View style={styles.iconContainer}>{icon}</View>
            {content}
          </View>
        ))}
        <View style={[styles.displayHorizontal, styles.bottomStats]}>
          {bottomData.map(({ id, icon, content, tooltip }) => (
            <View key={id} style={styles.displayHorizontal}>
              <Tooltip
                key={id}
                sideOffset={2}
                delayDuration={100}
                trigger={<View style={styles.iconContainer}>{icon}</View>}>
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

const styles = StyleSheet.create({
  datumContainer: {
    marginBottom: 8,
    minHeight: 22,
    overflow: 'hidden',
  },
  displayHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomStats: {
    gap: 16,
  },
  iconContainer: {
    marginRight: 7,
    width: 22,
    alignItems: 'center',
  },
  linkContainer: {
    display: 'contents',
    ...Platform.select({
      web: {
        textOverflow: 'ellipsis',
      },
    }),
  },
  link: {
    fontSize: 15,
    fontWeight: 300,
    outlineOffset: -1,
  },
  mutedLink: {
    backgroundColor: 'transparent',
  },
  secondaryText: {
    fontSize: 13,
    fontWeight: 300,
  },
  secondaryContainer: {
    marginBottom: 0,
    paddingRight: 3,
  },
  secondaryIconContainer: {
    marginRight: 4,
  },
  exampleLink: {
    marginLeft: 2,
    marginRight: 4,
    fontSize: 13,
  },
});
