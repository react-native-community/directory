import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import useSWR from 'swr';

import { H6 } from '~/common/styleguide';
import { Button } from '~/components/Button';
import { Arrow } from '~/components/Icons';
import { TimeRange } from '~/util/datetime';
import tw from '~/util/tailwind';

import DependencyRow from './DependencyRow';
import EntityCounter from './EntityCounter';

type Props = {
  title: string;
  data?: Record<string, string> | null;
  checkExistence?: boolean;
};

export default function CollapsibleSection({ title, data, checkExistence }: Props) {
  const sectionKey = sanitizeTitle(title);
  const key = `@ReactNativeDirectory:PackageSectionCollapsed:${sectionKey}`;
  const noData = !data || Object.keys(data).length === 0;

  const [collapsed, setCollapsed] = useState<boolean>(Boolean(window.localStorage.getItem(key)));

  const { data: checkData } = useSWR(
    checkExistence && !noData
      ? `/api/library?name=${Object.keys(data).join(',')}&check=true`
      : null,
    (url: string) => fetch(url).then(res => res.json()),
    {
      dedupingInterval: TimeRange.HOUR * 1000,
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    async function refreshState() {
      const val = await AsyncStorage.getItem(key);
      setCollapsed(val === 'true');
    }

    void refreshState();
  }, [key]);

  if (noData) {
    return null;
  }

  async function toggleSection() {
    const next = !collapsed;
    setCollapsed(next);
    await AsyncStorage.setItem(key, next ? 'true' : 'false');
  }

  return (
    <>
      <View style={tw`flex-row gap-1.5 justify-between items-center`}>
        <H6 style={tw`flex items-center gap-1.5 text-[16px] text-secondary`}>
          {title}
          <EntityCounter count={Object.keys(data).length} />
        </H6>
        <Button
          onPress={toggleSection}
          style={tw`p-1 bg-palette-gray2 dark:bg-palette-gray7`}
          containerStyle={tw`mt-px`}
          aria-label={`${collapsed ? 'Expand' : 'Collapse'} section`}>
          <Arrow style={[tw`w-4 h-3 text-icon`, collapsed ? tw`rotate-90` : tw`rotate-270`]} />
        </Button>
      </View>
      {!collapsed && (
        <View>
          {Object.entries(data)
            .sort(([aName], [bName]) => aName.localeCompare(bName))
            .map(([name, version]) => (
              <DependencyRow
                key={`${sectionKey}-${name}`}
                name={name}
                version={version}
                packageExists={checkData?.[name]}
              />
            ))}
        </View>
      )}
    </>
  );
}

function sanitizeTitle(input: string) {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
