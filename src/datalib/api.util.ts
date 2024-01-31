const getApiUri = (uri?: string): string =>
  `${process.env.SERVER_URL}/api/v1${uri}`;

export default getApiUri;
