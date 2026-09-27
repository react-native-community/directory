import { type NextApiRequest, type NextApiResponse } from 'next';

import GitHubRepositoryFundingQuery from '~/scripts/queries/GitHubRepositoryFundingQuery';
import { DEFAULT_RESPONSE_CACHE_HEADER, NEXT_1H_CACHE_HEADER } from '~/util/Constants';
import { parseQueryParams } from '~/util/queryParams';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { owner, name } = parseQueryParams(req.query);

  const cleanOwner = owner ? owner.toString().toLowerCase().trim() : undefined;
  const cleanName = name ? name.toString().toLowerCase().trim() : undefined;

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', DEFAULT_RESPONSE_CACHE_HEADER);

  if (!cleanOwner || !cleanName) {
    res.statusCode = 500;
    res.json({
      error: `Invalid request. You need to specify repository owner and name via query params.`,
    });
    return;
  }

  const result = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CLIENT_GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      query: GitHubRepositoryFundingQuery,
      variables: { owner, name },
    }),
    ...NEXT_1H_CACHE_HEADER,
  });

  if ('status' in result && result.status !== 200) {
    res.statusCode = result.status;
    res.json({});
    return;
  }

  const resultJson = await result.json();

  res.statusCode = 200;
  res.json({ fundingLinks: resultJson.data.repository.fundingLinks });
}
