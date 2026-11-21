import { View } from 'react-native';

import { A, Label } from '~/common/styleguide';
import { CheckIcon, QuestionIcon, XIcon } from '~/components/Icons';
import { Tag } from '~/components/Tag';
import { Tooltip } from '~/components/Tooltip';
import { type LibraryType } from '~/types';
import { getNewArchSupportStatus, NewArchSupportStatus } from '~/util/newArchStatus';
import { pluralize } from '~/util/strings';

type Props = {
  library: LibraryType;
  small?: boolean;
};

export function NewArchitectureTag({ library, small = false }: Props) {
  const status = getNewArchSupportStatus(library);
  const icon = getTagIcon(status);

  const newArchitectureNote = library.newArchitectureNote && (
    <Label className="my-1 flex text-white">{library.newArchitectureNote}</Label>
  );

  // Do not show alternatives in New Arch tag for unmaintained libraries since
  // we already show the alternatives in unmaintained label
  const alternatives = library.alternatives &&
    library.alternatives.length > 0 &&
    !library.unmaintained && (
      <Label className="my-1 flex text-white">
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
        sideOffset={small ? 0 : undefined}
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
                tagClassName={getTagColor(status)}
                small={small}
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

function getTagColor(status: NewArchSupportStatus): string {
  switch (status) {
    case NewArchSupportStatus.NewArchOnly:
    case NewArchSupportStatus.Supported:
      return 'border-[#c3e3f7] bg-[#edf6fc] dark:border-[#203b4d] dark:bg-[#142733]';
    case NewArchSupportStatus.Unsupported:
      return 'border-[#faebaf] bg-[#fffae8] dark:border-[#3d3206] dark:bg-[#292005]';
    default:
      return 'border-palette-gray2 dark:border-border border-dashed';
  }
}

function getTagIcon(status: NewArchSupportStatus) {
  switch (status) {
    case NewArchSupportStatus.NewArchOnly:
    case NewArchSupportStatus.Supported:
      return <CheckIcon className="text-primary-dark size-3" />;
    case NewArchSupportStatus.Unsupported:
      return <XIcon className="text-warning-dark dark:text-warning size-[11px]" />;
    default:
      return <QuestionIcon className="text-palette-gray4 size-[11px]" />;
  }
}
