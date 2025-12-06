import { useContext, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { A, colors, darkColors, HoverEffect, P, useLayout } from '~/common/styleguide';
import CompatibilityTags from '~/components/CompatibilityTags';
import { GitHub } from '~/components/Icons';
import LibraryDescription from '~/components/Library/LibraryDescription';
import UnmaintainedLabel from '~/components/Library/UnmaintainedLabel';
import TrustedBadge from '~/components/Package/TrustedBadge';
import UserAvatar from '~/components/Package/UserAvatar';
import Tooltip from '~/components/Tooltip';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { type LibraryType, type NpmRegistryVersionData } from '~/types';

type Props = {
  library: LibraryType;
  registryData?: NpmRegistryVersionData;
  rightSlot?: ReactNode;
};

export default function PackageHeader({ library, registryData, rightSlot }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);
  const { isSmallScreen } = useLayout();

  const ghUsername = library.github.fullName.split('/')[0];

  const headerColorStyle = {
    color: isDark ? darkColors.secondary : colors.gray5,
  };

  return (
    <>
      {library.unmaintained && <UnmaintainedLabel block />}
      <View style={[styles.nameRow, isSmallScreen && styles.nameRowMobile]}>
        <View style={styles.nameWrapper}>
          <Tooltip
            sideOffset={2}
            delayDuration={100}
            trigger={
              <UserAvatar
                src={`https://github.com/${ghUsername}.png`}
                style={{
                  ...styles.avatar,
                  borderColor: isDark ? darkColors.border : colors.gray2,
                }}
                alt={`${ghUsername} avatar`}
              />
            }>
            {ghUsername}
          </Tooltip>
          <P style={styles.name}>{library.npmPkg}</P>
          {registryData && (
            <View style={styles.versionContainer}>
              <P style={headerColorStyle}>{registryData.version}</P>
              {registryData._npmUser?.trustedPublisher && <TrustedBadge />}
            </View>
          )}
          <HoverEffect>
            <A href={library.githubUrl} style={styles.githubButton}>
              <GitHub width={20} height={20} fill={isDark ? colors.gray4 : colors.gray5} />
            </A>
          </HoverEffect>
        </View>
        {rightSlot}
      </View>
      <CompatibilityTags library={library} />
      <LibraryDescription github={library.github} />
    </>
  );
}

const styles = StyleSheet.create({
  nameRow: {
    gap: 24,
    minHeight: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameRowMobile: {
    gap: 8,
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  nameWrapper: {
    columnGap: 8,
    rowGap: 4,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  name: {
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 26,
    marginTop: -2,
  },
  versionContainer: {
    columnGap: 4,
    alignItems: 'center',
    flexDirection: 'row',
  },
  githubButton: {
    width: 20,
    height: 20,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'solid',
  },
});
