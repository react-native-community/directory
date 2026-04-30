import { type NextPageContext } from 'next';

import ErrorScene from '~/scenes/ErrorScene';
import PackageVersionsScene from '~/scenes/PackageVersionsScene';
import { type PackageVersionsPageProps } from '~/types/pages';
import { EMPTY_PACKAGE_DATA, NEXT_10M_CACHE_HEADER } from '~/util/Constants';
import getApiUrl from '~/util/getApiUrl';
import { getPackagePageErrorProps } from '~/util/getPackagePageErrorProps';
import { trimPackageVersionsData } from '~/util/packageVersionsRegistryData';
import { parseQueryParams } from '~/util/queryParams';
import { ssrFetch } from '~/util/SSRFetch';
import urlWithQuery from '~/util/urlWithQuery';

export default function VersionsPage({
  apiData,
  registryData,
  packageName,
  npmDownloads,
  errorMessage,
}: PackageVersionsPageProps) {
  if (!packageName || !apiData || !registryData) {
    return <ErrorScene statusCode={500} reason={errorMessage} />;
  }

  return (
    <PackageVersionsScene
      packageName={packageName}
      apiData={apiData}
      registryData={registryData}
      npmDownloads={npmDownloads}
    />
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const queryParams = parseQueryParams(ctx.query);
  const packageName = queryParams.name;

  if (!packageName) {
    return EMPTY_PACKAGE_DATA;
  }

  try {
    const [apiResponse, npmResponse, npmDownloads] = await Promise.all([
      ssrFetch(`/libraries`, { search: packageName }, ctx),
      fetch(
        getApiUrl(urlWithQuery(`/proxy/npm-registry-versions/?name=${packageName}`), ctx),
        NEXT_10M_CACHE_HEADER
      ),
      fetch(`https://api.npmjs.org/versions/${packageName}/last-week`, NEXT_10M_CACHE_HEADER),
    ]);

    if (apiResponse.status !== 200 || npmResponse.status !== 200) {
      return getPackagePageErrorProps(packageName, apiResponse.status, npmResponse.status);
    }

    const registryData = trimPackageVersionsData(await npmResponse.json());

    return {
      props: {
        packageName,
        registryData,
        apiData: await apiResponse.json(),
        npmDownloads: await npmDownloads.json(),
      },
    };
  } catch {
    return EMPTY_PACKAGE_DATA;
  }
}
