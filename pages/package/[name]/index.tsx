import { type NextPageContext } from 'next';

import ErrorScene from '~/scenes/ErrorScene';
import PackageOverviewScene from '~/scenes/PackageOverviewScene';
import { type PackageOverviewPageProps } from '~/types/pages';
import { EMPTY_PACKAGE_DATA, NEXT_15M_CACHE_HEADER } from '~/util/Constants';
import { ssrFetch } from '~/util/fetch';
import { getPackagePageErrorProps } from '~/util/getPackagePageErrorProps';
import { parseQueryParams } from '~/util/queryParams';

export default function OverviewPage({
  apiData,
  registryData,
  packageName,
  errorMessage,
}: PackageOverviewPageProps) {
  if (!packageName || !apiData || !registryData) {
    return <ErrorScene statusCode={500} reason={errorMessage} />;
  }

  return (
    <PackageOverviewScene packageName={packageName} apiData={apiData} registryData={registryData} />
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const queryParams = parseQueryParams(ctx.query);
  const packageName = queryParams.name;

  if (!packageName) {
    return EMPTY_PACKAGE_DATA;
  }

  try {
    const [apiResponse, npmResponse] = await Promise.all([
      ssrFetch(`/libraries`, { search: packageName }, ctx),
      fetch(`https://registry.npmjs.org/${packageName}/latest`, NEXT_15M_CACHE_HEADER),
    ]);

    if (apiResponse.status !== 200 || (npmResponse.status !== 200 && npmResponse.status !== 404)) {
      return getPackagePageErrorProps(packageName, apiResponse.status, npmResponse.status);
    }

    return {
      props: {
        packageName,
        apiData: await apiResponse.json(),
        registryData: await npmResponse.json(),
      },
    };
  } catch {
    return EMPTY_PACKAGE_DATA;
  }
}
