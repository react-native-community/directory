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
import tw from '~/util/tailwind';

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
  const style = [
    tw`size-4 shrink-0 text-icon opacity-80`,
    isNested && tw`size-3 text-palette-gray5 opacity-100`,
    isActive && tw`text-primary-darker dark:text-primary-dark`,
    isDirectory && tw`text-tertiary opacity-100 dark:text-accented`,
  ];

  if (isDirectory) {
    if (isCollapsed) {
      return <FolderIcon style={style} />;
    }
    return <FolderOpenIcon style={style} />;
  } else if (isNested) {
    return <FileMetadataIcon style={style} />;
  } else if (isImageFile) {
    return <ImageFileIcon style={style} />;
  }
  if (['text', 'txt', 'md', 'mdx'].includes(fileExtension)) {
    return <TextFileIcon style={style} />;
  } else if (['file', ...PREVIEW_DISABLED_FILES].includes(fileExtension)) {
    return <FileIcon style={style} />;
  }

  return <CodeFileIcon style={style} />;
}
