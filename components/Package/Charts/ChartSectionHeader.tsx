import { kebabCase } from 'es-toolkit/string';
import { Fragment } from 'react';
import { View } from 'react-native';

import { H6Section, Label, useLayout } from '~/common/styleguide';
import tw from '~/util/tailwind';

type Props = {
  title: string;
  description?: string[];
};

export default function ChartSectionHeader({ title, description }: Props) {
  const { isSmallScreen } = useLayout();

  return (
    <View style={tw`mt-3 gap-1`}>
      <H6Section
        style={[
          tw`flex items-end justify-between text-secondary`,
          isSmallScreen && tw`flex-col items-start gap-y-0.5`,
        ]}>
        {title}
        {description && (
          <Label style={tw`font-light text-secondary`}>
            {description.map((item, index) => (
              <Fragment key={kebabCase(item)}>
                {index > 0 && <span style={tw`text-tertiary`}>&ensp;·&ensp;</span>}
                {item}
              </Fragment>
            ))}
          </Label>
        )}
      </H6Section>
    </View>
  );
}
