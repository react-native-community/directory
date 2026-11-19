import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';
import { View } from 'react-native';

import { HoverEffect } from '~/common/styleguide';
import { SettingsFillIcon, SettingsIcon } from '~/components/Icons';
import { Tooltip } from '~/components/Tooltip';

import CodeBrowserSettingsCheckbox from './CodeBrowserSettingsCheckbox';

export type CodeBrowserSettingsType = {
  wordWrap: boolean;
  showLineNumbers: boolean;
  hideMapFiles: boolean;
};

type Props = {
  settings: CodeBrowserSettingsType;
  onChange: (settings: CodeBrowserSettingsType) => void;
};

export default function CodeBrowserSettings({ settings, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const Icon = open ? SettingsFillIcon : SettingsIcon;

  function toggleSetting(setting: keyof CodeBrowserSettingsType) {
    onChange({ ...settings, [setting]: !settings[setting] });
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Tooltip
        trigger={
          <HoverEffect>
            <Popover.Trigger asChild>
              <View
                accessibilityLabel="Code browser settings"
                accessibilityRole="button"
                className="cursor-pointer">
                <Icon className="text-palette-gray4 dark:text-pewter size-5" />
              </View>
            </Popover.Trigger>
          </HoverEffect>
        }>
        Settings
      </Tooltip>
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={6} style={{ zIndex: 50 }}>
          <View className="border-palette-gray2 bg-default dark:border-border min-w-42 gap-0.5 rounded-lg border-2 px-2 py-1.5 shadow-lg">
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
            <CodeBrowserSettingsCheckbox
              label="Hide map files"
              value={settings.hideMapFiles}
              onChange={() => toggleSetting('hideMapFiles')}
            />
          </View>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
