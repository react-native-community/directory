import { type NextPageContext } from 'next';

import ErrorScene from '~/scenes/ErrorScene';
import PackageScoreScene from '~/scenes/PackageScoreScene';
import { type PackageScorePageProps } from '~/types/pages';
import { EMPTY_PACKAGE_DATA } from '~/util/Constants';
import getApiUrl from '~/util/getApiUrl';
import { getPackagePageErrorProps } from '~/util/getPackagePageErrorProps';
import { parseQueryParams } from '~/util/parseQueryParams';
import urlWithQuery from '~/util/urlWithQuery';

export default function ScorePage({ apiData, packageName, errorMessage }: PackageScorePageProps) {
  if (!packageName || !apiData) {
    return <ErrorScene statusCode={500} reason={errorMessage} />;
  }

  return <PackageScoreScene packageName={packageName} apiData={apiData} />;
}

export async function getServerSideProps(ctx: NextPageContext) {
  const queryParams = parseQueryParams(ctx.query);
  const packageName = [queryParams.name, queryParams.scopedName].join('/');

  if (!packageName) {
    return EMPTY_PACKAGE_DATA;
  }

  try {
    const apiResponse = await fetch(
      getApiUrl(urlWithQuery(`/libraries?search=${encodeURI(packageName)}`, {}), ctx),
      {
        next: { revalidate: 60 * 60 },
      }
    );

    if (apiResponse.status !== 200) {
      return getPackagePageErrorProps(packageName, apiResponse.status);
    }

    const apiData = await apiResponse.json();

    return {
      props: {
        packageName,
        apiData,
      },
    };
  } catch {
    return EMPTY_PACKAGE_DATA;
  }
}
