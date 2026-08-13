import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';
import { View } from 'react-native';

import { SettingsIcon } from '~/components/Icons';
import tw from '~/util/tailwind';

import CodeBrowserSettingsCheckbox from './CodeBrowserSettingsCheckbox';

export type CodeBrowserSettingsType = {
  wordWrap: boolean;
  showLineNumbers: boolean;
};

type Props = {
  settings: CodeBrowserSettingsType;
  onChange: (settings: CodeBrowserSettingsType) => void;
};

export default function CodeBrowserSettings({ settings, onChange }: Props) {
  const [open, setOpen] = useState(false);

  function toggleSetting(setting: keyof CodeBrowserSettingsType) {
    onChange({ ...settings, [setting]: !settings[setting] });
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <View
          accessibilityLabel="Code browser settings"
          accessibilityRole="button"
          style={tw`cursor-pointer`}>
          <SettingsIcon style={tw`size-5 text-palette-gray4 dark:text-pewter`} />
        </View>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={6} style={{ zIndex: 50 }}>
          <View
            style={tw`min-w-42 gap-0.5 rounded-lg border-2 border-palette-gray2 bg-default px-2 py-1.5 shadow-lg dark:border-default`}>
            <CodeBrowserSettingsCheckbox
              label="Wrap long lines"
              value={settings.wordWrap}
              onChange={() => toggleSetting('wordWrap')}
            />
            <CodeBrowserSettingsCheckbox
              label="Show line numbers"
              value={settings.showLineNumbers}
              onChange={() => toggleSetting('showLineNumbers')}
            />
          </View>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
