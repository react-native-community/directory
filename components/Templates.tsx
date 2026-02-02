import dynamic from 'next/dynamic';
import { View } from 'react-native';

import LoadingContent from '~/components/Library/LoadingContent';
import NotFoundContent from '~/components/NotFoundContent';
import { type TemplateType } from '~/types';
import tw from '~/util/tailwind';

type Props = {
  templates: TemplateType[];
};

const TemplateWithLoading = dynamic(() => import('~/components/Template'), {
  loading: () => <LoadingContent />,
});

export default function Libraries({ templates }: Props) {
  if (!templates || !templates.length) {
    return <NotFoundContent />;
  }

  return (
    <View style={tw`pt-3`}>
      {templates.map((item, index) => (
        <TemplateWithLoading key={`list-item-${index}-${item.github.name}`} template={item} />
      ))}
    </View>
  );
}
