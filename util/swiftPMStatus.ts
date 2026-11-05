import { type LibraryType } from '~/types';

export function getSwiftPMSupport({ swiftPM, github }: LibraryType): boolean {
  return swiftPM ?? github.hasSwiftPM ?? false;
}
