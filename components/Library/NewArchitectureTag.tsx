import * as HtmlElements from '@expo/html-elements';
import { useContext } from 'react';
import { View, StyleSheet } from 'react-native';

import { colors, darkColors, Label } from '~/common/styleguide';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { Library } from '~/types';
import { getNewArchSupportStatus, NewArchSupportStatus } from '~/util/newArchStatus';

import { Check, Question, XIcon } from '../Icons';
import { Tag } from '../Tag';
import Tooltip from '../Tooltip';

type Props = {
  library: Library;
};

export function NewArchitectureTag({ library }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);
  const status = getNewArchSupportStatus(library);

  const icon =
    status === NewArchSupportStatus.Unsupported ? (
      <XIcon fill={getIconColor(status, isDark)} width={11} height={11} />
    ) : status === NewArchSupportStatus.Supported ? (
      <Check fill={getIconColor(status, isDark)} width={12} height={12} />
    ) : (
      <Question fill={getIconColor(status, isDark)} width={11} height={11} />
    );

  const newArchitectureNote = library.newArchitectureNote && library.newArchitectureNote && (
    <Label style={styles.note}>{library.newArchitectureNote}</Label>
  );

  // Do not show alternatives in new arch tag for unmaintained libraries since
  // we already show the alternatives in unmaintained label
  const alternatives = library.alternatives &&
    library.alternatives.length > 0 &&
    !library.unmaintained && (
      <Label style={styles.note}>
        {' '}
        {library.alternatives.length > 1 ? 'Alternatives:' : 'Alternative:'}{' '}
        {library.alternatives.join(', ')}{' '}
      </Label>
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
        {status === NewArchSupportStatus.Supported && 'Supports New Architecture'}
        {status === NewArchSupportStatus.Unsupported && 'Does not support New Architecture'}
        {status === NewArchSupportStatus.Untested && 'Untested with New Architecture'}
        <>
          {newArchitectureNote}
          {alternatives}
        </>
      </Tooltip>
    </View>
  );
}

function getIconColor(status: NewArchSupportStatus, isDark: boolean) {
  switch (status) {
    case NewArchSupportStatus.Supported:
      return colors.primaryDark;
    case NewArchSupportStatus.Unsupported:
      return isDark ? darkColors.warning : colors.warningDark;
    default:
      return colors.gray4;
  }
}

function getTagColor(status: NewArchSupportStatus, isDark: boolean) {
  switch (status) {
    case NewArchSupportStatus.Supported:
      return {
        backgroundColor: isDark ? '#142733' : '#edf6fc',
        borderColor: isDark ? '#203b4d' : '#d4ebfa',
      };
    case NewArchSupportStatus.Unsupported:
      return {
        backgroundColor: isDark ? '#292005' : '#fffae8',
        borderColor: isDark ? '#3d3206' : '#faebaf',
      };
    default:
      return {
        borderColor: isDark ? darkColors.border : colors.gray2,
        borderStyle: 'dashed' as const,
      };
  }
}

const styles = StyleSheet.create({
  note: {
    display: 'flex',
    marginVertical: 4,
    color: '#fff',
  },
});
