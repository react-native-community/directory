import { type NextPageContext } from 'next';

import PackageVersionsPage from '~/components/Details/PackageVersionsPage';
import { type PackageVersionsPageProps } from '~/types/pages';
import getApiUrl from '~/util/getApiUrl';
import { parseQueryParams } from '~/util/parseQueryParams';
import urlWithQuery from '~/util/urlWithQuery';

export default function VersionsPage({
  apiData,
  registryData,
  packageName,
}: PackageVersionsPageProps) {
  return (
    <PackageVersionsPage packageName={packageName} apiData={apiData} registryData={registryData} />
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const queryParams = parseQueryParams(ctx.query);
  const packageName = queryParams.name;

  if (!packageName) {
    return {
      props: {
        data: {},
        packageName,
      },
    };
  }

  const apiResponse = await fetch(
    getApiUrl(urlWithQuery(`/libraries?search=${encodeURI(packageName)}`, {}), ctx)
  );
  const apiData = await apiResponse.json();

  const npmResponse = await fetch(`https://registry.npmjs.org/${packageName}`);
  const registryData = await npmResponse.json();

  return {
    props: {
      packageName,
      apiData,
      registryData: typeof registryData === 'object' ? registryData : {},
    },
  };
}
