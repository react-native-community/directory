import { Platform, View } from 'react-native';

import { A, HoverEffect, P, useLayout } from '~/common/styleguide';
import BookmarkButton from '~/components/BookmarkButton';
import CompatibilityTags from '~/components/CompatibilityTags';
import EntryDescription from '~/components/EntryDescription';
import { GitHub } from '~/components/Icons';
import Thumbnail from '~/components/Thumbnail';
import { type TemplateType } from '~/types';
import { parseGitHubUrl } from '~/util/parseGitHubUrl';
import tw from '~/util/tailwind';

import MetaData from './MetaData';
import UnmaintainedLabel from './UnmaintainedLabel';
import UpdatedAtView from './UpdateAtView';

type Props = {
  template: TemplateType;
  skipMetadata?: boolean;
  skipSecondaryMetadata?: boolean;
  skipDate?: boolean;
};

export default function Template({
  template,
  skipMetadata,
  skipDate,
  skipSecondaryMetadata,
}: Props) {
  const { github } = template;
  const { isSmallScreen, isBelowMaxWidth } = useLayout();

  const { repoOwner, repoName, packagePath } = parseGitHubUrl(template.githubUrl);
  const libName =
    template.npmPkg ??
    `${repoOwner}/${packagePath.split('/').at(-1) !== '.' ? packagePath.split('/').at(-1) : repoName}`;

  const hasSecondaryMetadata =
    github.license || github.urls.homepage || github.newArchitecture || template.newArchitecture;

  return (
    <View
      style={[
        tw`relative mb-4 flex-row overflow-hidden rounded-md border border-palette-gray2 dark:border-default`,
        isSmallScreen && tw`flex-col`,
        skipMetadata && tw`mx-[0.75%] min-h-[206px] w-[48.5%]`,
        skipMetadata && (isSmallScreen || isBelowMaxWidth) && tw`w-[98.5%] max-w-[98.5%]`,
        skipSecondaryMetadata && tw`min-h-0`,
        template.unmaintained && tw`opacity-85`,
      ]}>
      <BookmarkButton
        bookmarkId={libName}
        style={tw`absolute right-2.5 top-2.5 z-10 rounded border border-palette-gray2 p-1.5 dark:border-palette-gray6`}
      />
      <View style={[tw`flex-1 p-4 pb-3 pl-5`, isSmallScreen && tw`px-3.5 pt-2.5`]}>
        {template.unmaintained && (
          <View
            style={
              isSmallScreen
                ? tw`mb-1.5 flex-col justify-start self-start`
                : tw`mb-1 flex-row items-start justify-between gap-6`
            }>
            <UnmaintainedLabel />
            {!skipDate && <UpdatedAtView template={template} />}
          </View>
        )}
        <View
          style={
            isSmallScreen
              ? tw`flex-col justify-start gap-2 self-start`
              : tw`flex-row items-start justify-between gap-6`
          }>
          <View style={tw`flex-row items-center gap-1.5`}>
            {/* TODO: add template page */}
            {/*<A*/}
            {/*  href={`/package/${template.npmPkg}`}*/}
            {/*  style={tw`text-[19px] font-bold`}*/}
            {/*  hoverStyle={tw`text-hover`}>*/}
            {/*  {libName}*/}
            {/*</A>*/}
            <P style={tw`text-[19px] font-bold`}>{libName}</P>
            <HoverEffect>
              <A href={template.githubUrl} style={tw`size-5`} aria-label="GitHub repository">
                <GitHub
                  width={20}
                  height={20}
                  style={tw`text-palette-gray5 dark:text-palette-gray4`}
                />
              </A>
            </HoverEffect>
          </View>
          {!skipDate && !template.unmaintained && <UpdatedAtView template={template} />}
        </View>
        <View style={tw`mt-3`}>
          <CompatibilityTags entry={template} isTemplate />
        </View>
        <View style={tw`mt-3`}>
          <EntryDescription
            github={template.github}
            maxLines={skipMetadata ? 3 : undefined}
            entryType="template"
          />
        </View>
        {!skipMetadata &&
          Platform.OS === 'web' &&
          template.images &&
          template.images.length > 0 && (
            <View style={tw`mt-2 flex-row flex-wrap items-center gap-x-0.5`}>
              {template.images.map((image, index) => (
                <Thumbnail key={`${image}-${index}`} url={image} />
              ))}
            </View>
          )}
        {!skipSecondaryMetadata && hasSecondaryMetadata ? (
          <View style={[tw`mt-auto w-full`, isSmallScreen && tw`relative mt-0 min-h-0`]}>
            <View style={[tw`mt-3 flex-row flex-wrap items-center gap-2.5 gap-y-0.5`]}>
              <MetaData template={template} secondary />
            </View>
          </View>
        ) : null}
      </View>
      {skipMetadata ? null : (
        <View
          style={[
            tw`flex-0.35 border-l border-palette-gray2 p-4 dark:border-default`,
            isSmallScreen && tw`border-l-0 border-t`,
          ]}>
          <MetaData template={template} />
        </View>
      )}
    </View>
  );
}
