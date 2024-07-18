import * as HtmlElements from '@expo/html-elements';
import { useContext } from 'react';
import { View, StyleSheet } from 'react-native';

import { colors, darkColors, Label } from '../../common/styleguide';
import CustomAppearanceContext from '../../context/CustomAppearanceContext';
import { Library } from '../../types';
import {
  getNewArchSupportStatus as getSupportStatus,
  NewArchSupportStatus as SupportStatus,
} from '../../util/newArchStatus';
import { Check, Question, XIcon } from '../Icons';
import { Tag } from '../Tag';
import Tooltip from '../Tooltip';

type Props = {
  library: Library;
};

export function NewArchitectureTag({ library }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);
  const status = getSupportStatus(library);

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
            <HtmlElements.A
              href="https://reactnative.dev/docs/new-architecture-intro"
              target="_blank">
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

function getIconColor(status: SupportStatus, isDark: boolean) {
  switch (status) {
    case SupportStatus.Supported:
      return colors.primaryDark;
    case SupportStatus.Unsupported:
      return isDark ? darkColors.warning : colors.warningDark;
    default:
      return colors.gray4;
  }
}

function getTagColor(status: SupportStatus, isDark: boolean) {
  switch (status) {
    case SupportStatus.Supported:
      return {
        backgroundColor: isDark ? '#142733' : '#edf6fc',
        borderColor: isDark ? '#203b4d' : '#d4ebfa',
      };
    case SupportStatus.Unsupported:
      return {
        backgroundColor: isDark ? '#292005' : '#fffae8',
        borderColor: isDark ? '#3d3206' : '#faebaf',
      };
    default:
      return {
        borderColor: isDark ? darkColors.border : colors.gray2,
        borderStyle: 'dashed' as 'dashed',
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
