import { useState } from 'react';
import { View } from 'react-native';

import { A, Label } from '~/common/styleguide';
import { Button } from '~/components/Button';
import CollapsibleSection from '~/components/Package/CollapsibleSection';
import tw from '~/util/tailwind';

type Props = {
  topics?: string[];
};

const MAX_TOPICS = 16;

export default function TopicsSection({ topics }: Props) {
  const [expanded, setExpanded] = useState<boolean>(false);

  if (!topics || !topics.length) {
    return null;
  }

  const hasManyTopics = topics.length > MAX_TOPICS;
  const trimmedTopics = hasManyTopics && !expanded ? topics.slice(0, MAX_TOPICS) : topics;

  return (
    <CollapsibleSection
      title="Topics"
      count={topics.length}
      headerStyle={tw`-mb-0.5 min-h-[25px]`}
      rightSlot={
        hasManyTopics && !expanded ? (
          <Button
            containerStyle={tw`ml-auto`}
            style={tw`border border-default bg-default px-2 py-1`}
            onPress={() => setExpanded(true)}>
            <Label style={tw`text-[10px]`}>Show All</Label>
          </Button>
        ) : undefined
      }>
      <View style={tw`flex-row flex-wrap items-start gap-x-2 gap-y-0.5`}>
        {trimmedTopics.map(topic => (
          <A key={topic} href={`/packages?search=${topic}`} style={tw`text-[12px] font-light`}>
            {topic}
          </A>
        ))}
        {hasManyTopics && !expanded && (
          <Label style={tw`font-light text-secondary`}>
            and {topics.length - MAX_TOPICS} more{' '}
          </Label>
        )}
      </View>
    </CollapsibleSection>
  );
}
