import {
  FileIcon,
  FileMetadataIcon,
  FolderIcon,
  FolderOpenIcon,
  ImageFileIcon,
} from '~/components/Icons';
import { IMAGE_FILES } from '~/util/codeBrowser';
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
  const fileExtension = label.split('.').at(-1) ?? 'text';
  const isImageFile = IMAGE_FILES.includes(fileExtension);
  const style = [
    tw`size-4 shrink-0 text-icon`,
    isNested && tw`size-3 text-palette-gray5`,
    isActive && tw`text-primary-darker dark:text-primary-dark`,
    isDirectory && tw`text-tertiary dark:text-accented`,
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
  return <FileIcon style={style} />;
}
