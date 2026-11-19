import {
  CodeFileIcon,
  FileIcon,
  FileMetadataIcon,
  FolderIcon,
  FolderOpenIcon,
  ImageFileIcon,
  TextFileIcon,
} from '~/components/Icons';
import { IMAGE_FILES, PREVIEW_DISABLED_FILES } from '~/util/codeBrowser';
import { cx } from '~/util/tailwind';

type Props = {
  label: string;
  isActive?: boolean;
  isDirectory?: boolean;
  isCollapsed?: boolean;
  isNested?: boolean;
};

export function CodeBrowserFileIcon({
  label,
  isActive = false,
  isDirectory = false,
  isCollapsed = false,
  isNested = false,
}: Props) {
  const fileExtension = label.includes('.') ? (label.split('.').at(-1) ?? 'file') : 'file';
  const isImageFile = IMAGE_FILES.includes(fileExtension);
  const className = cx(
    'text-icon size-4 shrink-0 opacity-80',
    isNested && 'text-palette-gray5 size-3 opacity-100',
    isActive && 'text-primary-darker dark:text-primary-dark',
    isDirectory && 'text-tertiary dark:text-accented opacity-100'
  );

  if (isDirectory) {
    if (isCollapsed) {
      return <FolderIcon className={className} />;
    }
    return <FolderOpenIcon className={className} />;
  } else if (isNested) {
    return <FileMetadataIcon className={className} />;
  } else if (isImageFile) {
    return <ImageFileIcon className={className} />;
  }
  if (['text', 'txt', 'md', 'mdx'].includes(fileExtension)) {
    return <TextFileIcon className={className} />;
  } else if (['file', ...PREVIEW_DISABLED_FILES].includes(fileExtension)) {
    return <FileIcon className={className} />;
  }

  return <CodeFileIcon className={className} />;
}
