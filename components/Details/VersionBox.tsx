import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { A, Caption, colors, darkColors, Label, useLayout } from '~/common/styleguide';
import TrustedBadge from '~/components/Details/TrustedBadge';
import { Dependency, PackageSize } from '~/components/Icons';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { type NpmRegistryVersionData } from '~/types';
import { getTimeSinceToday } from '~/util/datetime';
import { formatBytes } from '~/util/formatBytes';
import { pluralize } from '~/util/strings';

type Props = {
  label?: string;
  time: string;
  versionData: NpmRegistryVersionData;
};

export default function VersionBox({ label, time, versionData }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);
  const { isSmallScreen } = useLayout();

  const iconColor = isDark ? darkColors.pewter : colors.gray5;

  return (
    <View
      style={[
        styles.versionBox,
        isSmallScreen && styles.versionBoxSmall,
        {
          borderColor: isDark ? darkColors.border : colors.gray2,
        },
      ]}>
      <View>
        <View style={styles.versionLabelWrapper}>
          {label && <Caption>{label}</Caption>}
          {label && <Caption style={{ color: iconColor }}>{` • `}</Caption>}
          <Caption style={label && { color: isDark ? darkColors.secondary : colors.gray5 }}>
            {versionData.version}
          </Caption>
        </View>
        <View style={styles.versionLabelWrapper}>
          <Label
            style={[
              styles.versionLabel,
              {
                color: isDark ? darkColors.secondary : colors.gray5,
              },
            ]}>
            Released {getTimeSinceToday(time)} by {versionData._npmUser?.name}
          </Label>
          {versionData._npmUser?.trustedPublisher && <TrustedBadge />}
        </View>
      </View>
      <View style={styles.versionMetadataContainer}>
        {versionData.dependencies && (
          <View
            style={[
              styles.versionMetadata,
              !isSmallScreen && {
                minWidth: 150,
              },
            ]}>
            <Dependency fill={iconColor} />
            <A
              style={styles.versionLabel}
              href={`https://www.npmjs.com/package/${versionData.name}/v/${versionData.version}?activeTab=dependencies`}>
              {`${Object.keys(versionData.dependencies).length} ${pluralize('dependency', Object.keys(versionData.dependencies).length)}`}
            </A>
          </View>
        )}
        {versionData.dist.unpackedSize && (
          <View
            style={[
              styles.versionMetadata,
              !isSmallScreen && {
                minWidth: 180,
              },
            ]}>
            <PackageSize fill={iconColor} />
            <A
              style={styles.versionLabel}
              href={`https://www.npmjs.com/package/${versionData.name}/v/${versionData.version}?activeTab=code`}>
              {`${formatBytes(versionData.dist.unpackedSize)} package size`}
            </A>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  versionBox: {
    display: 'flex',
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 2,
    borderStyle: 'solid',
    textDecorationLine: 'none',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  versionBoxSmall: {
    gap: 8,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  versionMetadataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 16,
    rowGap: 4,
  },
  versionMetadata: {
    flexDirection: 'row',
    gap: 8,
  },
  versionLabelWrapper: {
    minHeight: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontWeight: 400,
    maxWidth: '100%',
    gap: 4,
  },
  versionLabel: {
    fontWeight: 300,
  },
});
