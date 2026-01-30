import { View } from 'react-native';

import { A, Label } from '~/common/styleguide';
import { Check, Question, XIcon } from '~/components/Icons';
import { Tag } from '~/components/Tag';
import Tooltip from '~/components/Tooltip';
import { type LibraryType, type TemplateType } from '~/types';
import { getNewArchSupportStatus, NewArchSupportStatus } from '~/util/newArchStatus';
import { pluralize } from '~/util/strings';
import tw from '~/util/tailwind';

type Props = {
  entry: LibraryType | TemplateType;
};

export function NewArchitectureTag({ entry }: Props) {
  const status = getNewArchSupportStatus(entry);
  const icon = getTagIcon(status);

  const newArchitectureNote = entry.newArchitectureNote && entry.newArchitectureNote && (
    <Label style={tw`my-1 flex text-white`}>{entry.newArchitectureNote}</Label>
  );

  // Do not show alternatives in New Arch tag for unmaintained libraries since
  // we already show the alternatives in unmaintained label
  const alternatives = 'alternatives' in entry &&
    entry.alternatives &&
    entry.alternatives.length > 0 &&
    !entry.unmaintained && (
      <Label style={tw`my-1 flex text-white`}>
        {' '}
        {pluralize('Alternative', entry.alternatives.length)}
        {': '}
        {entry.alternatives.join(', ')}{' '}
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
      return tw`border-[#d4ebfa] bg-[#edf6fc] dark:border-[#203b4d] dark:bg-[#142733]`;
    case NewArchSupportStatus.Unsupported:
      return tw`border-[#faebaf] bg-[#fffae8] dark:border-[#3d3206] dark:bg-[#292005]`;
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
