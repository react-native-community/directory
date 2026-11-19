import { A, P } from '~/common/styleguide';
import { type LibraryDataEntryType } from '~/types';

type Props = {
  configPlugin?: LibraryDataEntryType['configPlugin'];
  hoverStyle?: string;
  linkClassName?: string;
  paragraphClassName?: string;
};

export function ConfigPluginContent({
  configPlugin,
  linkClassName,
  paragraphClassName,
  hoverStyle,
}: Props) {
  const url = typeof configPlugin === 'string' ? configPlugin : undefined;
  if (url) {
    return (
      <A href={url} className={linkClassName} hoverStyle={hoverStyle}>
        Config plugin
      </A>
    );
  }
  return <P className={paragraphClassName}>Config plugin</P>;
}
