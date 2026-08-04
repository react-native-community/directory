import useSWR from 'swr';

import CollapsibleSection from '~/components/Package/CollapsibleSection';
import { type PeerDependencyData } from '~/types';
import { TimeRange } from '~/util/datetime';

import DependencyRow from './DependencyRow';

type Props = {
  title: string;
  data?: Record<string, string | PeerDependencyData> | null;
  checkExistence?: boolean;
  checkVersion?: boolean;
};

export default function DependenciesSection({ title, data, checkExistence, checkVersion }: Props) {
  const noData = !data || Object.keys(data).length === 0;

  const { data: checkData } = useSWR(
    checkExistence && !noData
      ? `/api/library?name=${Object.keys(data).join(',')}&check=${checkVersion ? 'version' : 'true'}`
      : null,
    (url: string) => fetch(url).then(res => res.json()),
    {
      dedupingInterval: TimeRange.HOUR * 1000,
      revalidateOnFocus: false,
    }
  );

  if (noData) {
    return null;
  }

  return (
    <CollapsibleSection title={title} count={Object.keys(data).length}>
      {Object.entries(data)
        .sort(([aName], [bName]) => aName.localeCompare(bName))
        .map(([name, depData]) => (
          <DependencyRow
            key={`${title.toLocaleLowerCase()}-${name}`}
            name={name}
            data={depData}
            packageVersion={checkData?.[name]}
          />
        ))}
    </CollapsibleSection>
  );
}
