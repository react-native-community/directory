import { View } from 'react-native';

import { A, Label } from '~/common/styleguide';
import { Check, Question, XIcon } from '~/components/Icons';
import { Tag } from '~/components/Tag';
import Tooltip from '~/components/Tooltip';
import { type LibraryType } from '~/types';
import { getNewArchSupportStatus, NewArchSupportStatus } from '~/util/newArchStatus';
import { pluralize } from '~/util/strings';
import tw from '~/util/tailwind';

type Props = {
  library: LibraryType;
};

export function NewArchitectureTag({ library }: Props) {
  const status = getNewArchSupportStatus(library);
  const icon = getTagIcon(status);

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
        {pluralize('Alternative', library.alternatives.length)}
        {': '}
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
                tagStyle={getTagColor(status)}
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

function getTagColor(status: NewArchSupportStatus) {
  switch (status) {
    case NewArchSupportStatus.NewArchOnly:
    case NewArchSupportStatus.Supported:
      return tw`bg-[#edf6fc] border-[#d4ebfa] dark:bg-[#142733] dark:border-[#203b4d]`;
    case NewArchSupportStatus.Unsupported:
      return tw`bg-[#fffae8] border-[#faebaf] dark:bg-[#292005] dark:border-[#3d3206]`;
    default:
      return tw`border-dashed border-palette-gray2 dark:border-default`;
  }
}

function getTagIcon(status: NewArchSupportStatus) {
  switch (status) {
    case NewArchSupportStatus.NewArchOnly:
    case NewArchSupportStatus.Supported:
      return <Check style={tw`text-primary-dark`} width={12} height={12} />;
    case NewArchSupportStatus.Unsupported:
      return <XIcon style={tw`text-warning-dark dark:text-warning`} width={11} height={11} />;
    default:
      return <Question style={tw`text-palette-gray4`} width={11} height={11} />;
  }
}
