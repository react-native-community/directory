import { type NextPageContext } from 'next';

import ErrorScene from '~/scenes/ErrorScene';
import PackageScoreScene from '~/scenes/PackageScoreScene';
import { type PackageScorePageProps } from '~/types/pages';
import { EMPTY_PACKAGE_DATA } from '~/util/Constants';
import { getPackagePageErrorProps } from '~/util/getPackagePageErrorProps';
import { parseQueryParams } from '~/util/parseQueryParams';
import { ssrFetch } from '~/util/SSRFetch';

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
    const apiResponse = await ssrFetch(`/libraries`, { search: packageName }, ctx);

    if (apiResponse.status !== 200) {
      return getPackagePageErrorProps(packageName, apiResponse.status);
    }

    return {
      props: {
        packageName,
        apiData: await apiResponse.json(),
      },
    };
  } catch {
    return EMPTY_PACKAGE_DATA;
  }
}
