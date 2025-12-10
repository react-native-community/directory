export function getPackagePageErrorProps(
  packageName: string,
  apiStatus: number,
  npmStatus?: number
) {
  return {
    props: {
      packageName,
      ...(apiStatus !== 200
        ? {
            errorMessage: `React Native Directory API responded with ${apiStatus} status code.`,
          }
        : {}),
      ...(npmStatus && npmStatus !== 200
        ? { errorMessage: `npm registry API responded with ${npmStatus} status code.` }
        : {}),
    },
  };
}
