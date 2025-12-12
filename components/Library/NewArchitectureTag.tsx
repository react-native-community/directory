import { useContext } from 'react';
import { View } from 'react-native';

import { A, colors, darkColors, Label } from '~/common/styleguide';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { type LibraryType } from '~/types';
import { getNewArchSupportStatus, NewArchSupportStatus } from '~/util/newArchStatus';
import tw from '~/util/tailwind';

import { Check, Question, XIcon } from '../Icons';
import { Tag } from '../Tag';
import Tooltip from '../Tooltip';

type Props = {
  library: LibraryType;
};

export function NewArchitectureTag({ library }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);
  const status = getNewArchSupportStatus(library);

  const icon =
    status === NewArchSupportStatus.Unsupported ? (
      <XIcon style={tw`text-warning-dark dark:text-warning`} width={11} height={11} />
    ) : status === NewArchSupportStatus.Supported || status === NewArchSupportStatus.NewArchOnly ? (
      <Check style={tw`text-primary-dark`} width={12} height={12} />
    ) : (
      <Question style={tw`text-palette-gray4`} width={11} height={11} />
    );

  const newArchitectureNote = library.newArchitectureNote && library.newArchitectureNote && (
    <Label style={tw`flex my-1 text-white`}>{library.newArchitectureNote}</Label>
  );

  // Do not show alternatives in New Arch tag for unmaintained libraries since
  // we already show the alternatives in unmaintained label
  const alternatives = library.alternatives &&
    library.alternatives.length > 0 &&
    !library.unmaintained && (
      <Label style={tw`flex my-1 text-white`}>
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
            <A href="https://reactnative.dev/architecture/overview">
              <Tag
                label={
                  status === NewArchSupportStatus.NewArchOnly
                    ? 'New Architecture Only'
                    : 'New Architecture'
                }
                icon={icon}
                tagStyle={getTagColor(status, isDark)}
              />
            </A>
          </View>
        }>
        {status === NewArchSupportStatus.NewArchOnly && 'Only Supports New Architecture'}
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

function getTagColor(status: NewArchSupportStatus, isDark: boolean) {
  switch (status) {
    case NewArchSupportStatus.NewArchOnly:
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
