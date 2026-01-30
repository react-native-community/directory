import { View } from 'react-native';

import { A } from '~/common/styleguide';
import { Calendar } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';
import { type TemplateType } from '~/types';
import { getTimeSinceToday } from '~/util/datetime';
import { parseGitHubUrl } from '~/util/parseGitHubUrl';
import tw from '~/util/tailwind';

type Props = {
  template: TemplateType;
};

export default function UpdatedAtView({ template }: Props) {
  const { branchName, packagePath } = parseGitHubUrl(template.githubUrl);
  const repoUrl = template.github.urls.repo;

  const tooltipContent = `Last update (based on Git activity)`;

  return (
    <Tooltip
      sideOffset={2}
      trigger={
        <View style={tw`flex-row items-start gap-2`} aria-label={tooltipContent} role="tooltip">
          <View>
            <Calendar
              style={
                template.unmaintained
                  ? tw`text-warning-dark dark:text-warning`
                  : tw`text-tertiary dark:text-pewter`
              }
              width={14}
              height={16}
            />
          </View>
          <A
            href={
              packagePath === '.'
                ? `${repoUrl}/commits`
                : `${repoUrl}/commits/${branchName}/${packagePath}`
            }
            style={[
              tw`text-[13px] font-light decoration-palette-gray3 dark:decoration-palette-gray5`,
              template.unmaintained ? tw`text-warning-dark dark:text-warning` : tw`text-secondary`,
            ]}
            hoverStyle={
              template.unmaintained
                ? tw`text-warning-dark decoration-warning-dark dark:text-warning dark:decoration-warning`
                : tw`text-hover decoration-palette-gray4`
            }>
            {getTimeSinceToday(template.github.stats.pushedAt)}
          </A>
        </View>
      }>
      {tooltipContent}
    </Tooltip>
  );
}
