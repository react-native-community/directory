import { kebabCase } from 'es-toolkit/string';
import { Fragment } from 'react';
import { View } from 'react-native';

import { H6Section, Label, useLayout } from '~/common/styleguide';
import { cx } from '~/util/tailwind';

type Props = {
  title: string;
  description?: string[];
};

export default function ChartSectionHeader({ title, description }: Props) {
  const { isSmallScreen } = useLayout();

  return (
    <View className="mt-3 gap-1">
      <H6Section
        className={cx(
          'flex items-end justify-between text-secondary',
          cx(isSmallScreen && 'flex-col items-start gap-y-0.5')
        )}>
        {title}
        {description && (
          <Label className="text-secondary font-light">
            {description.map((item, index) => (
              <Fragment key={kebabCase(item)}>
                {index > 0 && <span className="text-tertiary">&ensp;·&ensp;</span>}
                {item}
              </Fragment>
            ))}
          </Label>
        )}
      </H6Section>
    </View>
  );
}
