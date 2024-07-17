import * as HtmlElements from '@expo/html-elements';
import { useContext } from 'react';
import { View, StyleSheet } from 'react-native';

import { colors, darkColors, Label } from '../../common/styleguide';
import CustomAppearanceContext from '../../context/CustomAppearanceContext';
import { Library } from '../../types';
import { Check, Question, XIcon } from '../Icons';
import { Tag } from '../Tag';
import Tooltip from '../Tooltip';

type Props = {
  library: Library;
};

enum SupportStatus {
  Supported = 'supported',
  Unsupported = 'unsupported',
  Untested = 'untested',
}

export function NewArchitectureTag({ library }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);

  const hasNote = typeof library.newArchitecture === 'string';
  const status = getSupportStatus(library, hasNote);

  const icon =
    status === SupportStatus.Unsupported ? (
      <XIcon fill={getIconColor(status, isDark)} width={11} height={11} />
    ) : status === SupportStatus.Supported ? (
      <Check fill={getIconColor(status, isDark)} width={12} height={12} />
    ) : (
      <Question fill={getIconColor(status, isDark)} width={11} height={11} />
    );

  return (
    <View>
      <Tooltip
        side="bottom"
        trigger={
          <View>
            <HtmlElements.A href="https://reactnative.dev/docs/new-architecture-intro">
              <Tag label="New Architecture" icon={icon} tagStyle={getTagColor(status, isDark)} />
            </HtmlElements.A>
          </View>
        }>
        {status === SupportStatus.Supported && 'Supports New Architecture'}
        {status === SupportStatus.Unsupported && 'Does not support New Architecture'}
        {status === SupportStatus.Untested && 'Untested with New Architecture'}
        {typeof library.newArchitecture === 'string' && (
          <>
            <Label style={styles.note}>{library.newArchitecture}</Label>
          </>
        )}
      </Tooltip>
    </View>
  );
}

function getSupportStatus({ newArchitecture, github }: Library, hasNote: boolean) {
  if (hasNote) {
    return SupportStatus.Supported;
  }

  const flag =
    newArchitecture !== undefined
      ? newArchitecture
      : github.newArchitecture === true
        ? true
        : undefined;

  switch (flag) {
    case true:
      return SupportStatus.Supported;
    case false:
      return SupportStatus.Unsupported;
    default:
      return SupportStatus.Untested;
  }
}

function getIconColor(status: SupportStatus, isDark: boolean) {
  switch (status) {
    case SupportStatus.Supported:
      return colors.primaryDark;
    case SupportStatus.Unsupported:
      return isDark ? darkColors.warning : colors.warningDark;
    default:
      return colors.gray5;
  }
}

function getTagColor(status: SupportStatus, isDark: boolean) {
  switch (status) {
    case SupportStatus.Supported:
      return {
        backgroundColor: isDark ? '#142933' : '#e8f6fc',
        borderColor: isDark ? '#1e4047' : '#cdedf7',
      };
    case SupportStatus.Unsupported:
      return {
        backgroundColor: isDark ? darkColors.warningLight : '#fffae0',
        borderColor: isDark ? '#3d3306' : '#fcee9d',
      };
    default:
      return {
        backgroundColor: isDark ? darkColors.dark : colors.gray1,
        borderColor: isDark ? darkColors.border : colors.gray2,
      };
  }
}

const styles = StyleSheet.create({
  note: {
    display: 'flex',
    marginTop: 4,
    color: '#fff',
  },
});
