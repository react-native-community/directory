export function getPackagePageErrorMessage(apiStatus: number, npmStatus: number) {
  return {
    ...(apiStatus !== 200
      ? {
          errorMessage: `React Native Directory API responded with ${apiStatus} status code.`,
        }
      : {}),
    ...(npmStatus !== 200
      ? { errorMessage: `npm registry API responded with ${npmStatus} status code.` }
      : {}),
  };
}
