export const getTokenImage = (_token) => {
  if (_token.tokenUri === '') return '';
  let dataUri = _token.tokenUri;
  let json = atob(dataUri.substring(29));
  let result = JSON.parse(json);
  return result.image;
};
