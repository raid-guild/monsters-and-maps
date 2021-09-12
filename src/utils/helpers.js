import { NETWORK_LABELS } from './constants';

export const getTokenImage = (_token) => {
  if (_token.tokenUri === '') return '';
  let dataUri = _token.tokenUri;
  let json = atob(dataUri.substring(29));
  let result = JSON.parse(json);
  return result.image;
};

export const getAccountString = (account) => {
  const len = account.length;
  return `0x${account.substr(2, 3).toUpperCase()}...${account
    .substr(len - 3, len - 1)
    .toUpperCase()}`;
};

export const getNetworkLabel = (chainId) =>
  NETWORK_LABELS[parseInt(chainId)] || 'unknown';
