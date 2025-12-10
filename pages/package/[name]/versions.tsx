import { type NextPageContext } from 'next';

import ErrorScene from '~/scenes/ErrorScene';
import PackageVersionsScene from '~/scenes/PackageVersionsScene';
import { type PackageVersionsPageProps } from '~/types/pages';
import { EMPTY_PACKAGE_DATA } from '~/util/Constants';
import getApiUrl from '~/util/getApiUrl';
import { getPackagePageErrorProps } from '~/util/getPackagePageErrorProps';
import { parseQueryParams } from '~/util/parseQueryParams';
import urlWithQuery from '~/util/urlWithQuery';

export default function VersionsPage({
  apiData,
  registryData,
  packageName,
  errorMessage,
}: PackageVersionsPageProps) {
  if (!packageName || !apiData || !registryData) {
    return <ErrorScene statusCode={500} reason={errorMessage} />;
  }

  return (
    <PackageVersionsScene packageName={packageName} apiData={apiData} registryData={registryData} />
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
      fetch(getApiUrl(urlWithQuery(`/libraries?search=${encodeURI(packageName)}`, {}), ctx)),
      fetch(`https://registry.npmjs.org/${packageName}`),
    ]);

    if (apiResponse.status !== 200 || npmResponse.status !== 200) {
      return getPackagePageErrorProps(packageName, apiResponse.status, npmResponse.status);
    }

    const [apiData, registryData] = await Promise.all([apiResponse.json(), npmResponse.json()]);

    return {
      props: {
        packageName,
        apiData,
        registryData,
      },
    };
  } catch {
    return EMPTY_PACKAGE_DATA;
  }
}
