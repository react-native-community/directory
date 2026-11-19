import { partition } from 'es-toolkit/array';
import { View } from 'react-native';

import { A, Caption, P } from '~/common/styleguide';
import { FILTER_MODULE_TYPE } from '~/components/Filters/helpers';
import {
  ConfigPluginIcon,
  DependencyIcon,
  DownloadIcon,
  ExamplesIcon,
  EyeIcon,
  ForkIcon,
  IssueIcon,
  LicenseIcon,
  LintToolsIcon,
  ModuleIcon,
  NativeCodeIcon,
  NightlyTestIcon,
  PackageManagerIcon,
  PackageSizeIcon,
  StarIcon,
  SwiftIcon,
  TypeScriptIcon,
  WebIcon,
} from '~/components/Icons';
import { ConfigPluginContent } from '~/components/Library/ConfigPlugin';
import { Tooltip } from '~/components/Tooltip';
import { type LibraryDataEntryType, type LibraryType, type MetadataEntryType } from '~/types';
import { formatBytes } from '~/util/formatBytes';
import { formatLintTools, formatPackageManager, pluralize } from '~/util/strings';
import { getSwiftPMSupport } from '~/util/swiftPMStatus';
import { cx } from '~/util/tailwind';

import { DirectoryScore } from './DirectoryScore';

type Props = {
  library: LibraryType;
  secondary?: boolean;
  skipExamples?: boolean;
};

const linkClassName = 'text-[15px] font-light -outline-offset-1';

function generateData({
  github,
  score,
  npm,
  npmPkg,
  matchingScoreModifiers,
}: LibraryType): MetadataEntryType[] {
  return [
    {
      id: 'score',
      icon: <DirectoryScore score={score} matchingScoreModifiers={matchingScoreModifiers} />,
      content: (
        <A target="_self" href={`/package/${npmPkg}/score`} className={linkClassName}>
          Directory Score
        </A>
      ),
    },
    npm?.downloads
      ? {
          id: 'downloads',
          icon: <DownloadIcon className="text-icon h-4.5 w-4" />,
          content: (
            <A
              href={`https://www.npmjs.com/package/${npmPkg}`}
              className={linkClassName}
              containerClassName="overflow-hidden text-ellipsis">
              {npm.downloads.toLocaleString()} monthly downloads
            </A>
          ),
        }
      : null,
    {
      id: 'star',
      icon: <StarIcon className="text-icon" />,
      content: (
        <A href={`${github.urls.repo}/stargazers`} className={linkClassName}>
          {github.stats.stars.toLocaleString()} {pluralize('star', github.stats.stars)}
        </A>
      ),
    },
    github.stats?.dependencies !== undefined
      ? {
          id: 'dependencies',
          icon: <DependencyIcon className="text-icon size-5.5" />,
          content: (
            <A
              href={`https://www.npmjs.com/package/${npmPkg}?activeTab=dependencies`}
              className={linkClassName}>
              {`${github.stats.dependencies} ${pluralize('dependency', github.stats?.dependencies ?? 0)}`}
            </A>
          ),
        }
      : null,
    npm?.size
      ? {
          id: 'size',
          icon: <PackageSizeIcon className="text-icon" />,
          content: (
            <A
              href={`https://www.npmjs.com/package/${npmPkg}?activeTab=code`}
              className={linkClassName}>
              {`${formatBytes(npm.size)} package size`}
            </A>
          ),
        }
      : null,
    github.stats.forks
      ? {
          id: 'forks',
          icon: <ForkIcon className="text-icon" />,
          content: (
            <A
              href={`${github.urls.repo}/network/members`}
              className={linkClassName}
              aria-label="Forks">
              {github.stats.forks.toLocaleString()}
            </A>
          ),
          tooltip: 'Forks',
        }
      : null,
    github.stats.subscribers
      ? {
          id: 'subscribers',
          icon: <EyeIcon className="text-icon" />,
          content: (
            <A
              href={`${github.urls.repo}/watchers`}
              className={linkClassName}
              aria-label="Watchers">
              {github.stats.subscribers.toLocaleString()}
            </A>
          ),
          tooltip: 'Watchers',
        }
      : null,
    github.stats.issues
      ? {
          id: 'issues',
          icon: <IssueIcon className="text-icon" />,
          content: (
            <A href={`${github.urls.repo}/issues`} className={linkClassName} aria-label="Issues">
              {github.stats.issues.toLocaleString()}
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

  const iconClassName = cx(
    'text-tertiary',
    skipExamples && 'text-palette-gray5',
    'dark:text-pewter'
  );
  const paragraphClassName = cx('text-[13px] font-light', !skipExamples && 'text-secondary');
  const hoverStyle = 'text-hover decoration-palette-gray4';

  return [
    github.urls.homepage
      ? {
          id: 'web',
          icon: <WebIcon className={iconClassName} />,
          content: (
            <A href={github.urls.homepage} className={paragraphClassName} hoverStyle={hoverStyle}>
              Website
            </A>
          ),
        }
      : null,
    github.license
      ? {
          id: 'license',
          icon: <LicenseIcon className={iconClassName} />,
          content:
            github.license.name === 'Other' ? (
              <P className={paragraphClassName}>Unrecognized License</P>
            ) : (
              <A href={github.license.url} className={paragraphClassName} hoverStyle={hoverStyle}>
                {github.license.name}
              </A>
            ),
        }
      : null,
    github.hasNativeCode
      ? {
          id: 'nativeCode',
          icon: <NativeCodeIcon className={iconClassName} />,
          content: <P className={paragraphClassName}>Native code</P>,
        }
      : null,
    configPlugin
      ? {
          id: 'configPlugin',
          icon: <ConfigPluginIcon className={iconClassName} />,
          content: (
            <ConfigPluginContent
              configPlugin={configPlugin}
              hoverStyle={hoverStyle}
              linkClassName={paragraphClassName}
              paragraphClassName={paragraphClassName}
            />
          ),
          tooltip: getConfigPluginText(configPlugin),
        }
      : null,
    nightlyProgram
      ? {
          id: 'nightlyProgram',
          icon: <NightlyTestIcon className={iconClassName} />,
          content: (
            <A
              href={`https://react-native-community.github.io/nightly-tests/?q=${encodeURIComponent(library.npmPkg)}`}
              className={paragraphClassName}
              hoverStyle={hoverStyle}>
              Nightly Program
            </A>
          ),
          tooltip: 'Package is tested against nightly React Native releases.',
        }
      : null,
    skipExamples && github.moduleType
      ? {
          id: 'moduleType',
          icon: <ModuleIcon className={iconClassName} />,
          content: (
            <P className={paragraphClassName}>
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
          icon: <TypeScriptIcon className={iconClassName} />,
          content: <P className={paragraphClassName}>TypeScript Types</P>,
        }
      : null,
    getSwiftPMSupport(library)
      ? {
          id: 'swiftpm',
          icon: <SwiftIcon className={iconClassName} />,
          content: <P className={paragraphClassName}>Swift Package Manager</P>,
        }
      : null,
    !skipExamples && examples?.length
      ? {
          id: 'examples',
          icon: <ExamplesIcon className={iconClassName} />,
          content: (
            <>
              <Caption className={paragraphClassName}>Examples: </Caption>
              {examples.map((example, index) => (
                <A
                  key={example}
                  href={example}
                  className={cx('ml-0.5 mr-1 text-[13px]', paragraphClassName)}
                  hoverStyle={hoverStyle}>
                  #{index + 1}
                </A>
              ))}
            </>
          ),
        }
      : null,
    skipExamples && github.packageManager
      ? {
          id: 'packageManager',
          icon: <PackageManagerIcon className={iconClassName} />,
          content: (
            <P className={paragraphClassName}>{formatPackageManager(github.packageManager)}</P>
          ),
          tooltip: 'Package manager',
        }
      : null,
    skipExamples && (github?.lintTools?.length ?? 0) > 0
      ? {
          id: 'lintTools',
          icon: <LintToolsIcon className={iconClassName} />,
          content: (
            <P className={paragraphClassName}>
              {github.lintTools?.map(formatLintTools).join(', ')}
            </P>
          ),
          tooltip: 'Lint tools',
        }
      : null,
  ];
}

function MetaData({ library, secondary, skipExamples = false }: Props) {
  if (secondary) {
    const data = generateSecondaryData(library, skipExamples).filter(
      (entry): entry is NonNullable<MetadataEntryType> => !!entry
    );
    return (
      <>
        {data.map(({ id, icon, content, tooltip }, i) => {
          const component = (
            <View
              key={id}
              className={cx(
                'mb-0 max-h-5 min-h-5 flex-row items-center pr-[3px]',
                i + 1 !== data.length && !skipExamples && 'mb-2 overflow-hidden'
              )}
              style={{ width: 'fit-content' }}>
              <View className="mr-1 min-w-[22px] items-center">{icon}</View>
              {content}
            </View>
          );

          return tooltip ? (
            <Tooltip key={id} sideOffset={-2} side="left" delayDuration={250} trigger={component}>
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
            className={cx(
              'flex-row items-center',
              cx(i + 1 !== data.length && 'mb-2 min-h-[22px] overflow-hidden')
            )}>
            <View className="mr-[7px] min-w-[22px] items-center">{icon}</View>
            {content}
          </View>
        ))}
        <View className="flex-row items-center gap-4">
          {bottomData.map(({ id, icon, content, tooltip }) => (
            <View key={id} className="flex-row items-center">
              <Tooltip
                key={id}
                sideOffset={2}
                delayDuration={250}
                trigger={<View className="mr-[7px] min-w-[22px] items-center">{icon}</View>}>
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

export default MetaData;

function getConfigPluginText(configPlugin: LibraryDataEntryType['configPlugin']) {
  if (typeof configPlugin === 'string') {
    return `Expo config plugin available as a separate package`;
  } else if (configPlugin) {
    return 'Expo config plugin included';
  }
}
