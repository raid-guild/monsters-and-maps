import { Contract, utils } from 'ethers';

const MAPS_CONTRACT = '0x6C8715ade6361D35c941EB901408EFca8A20F65a';
const MONSTERS_CONTRACT = '0xeCb9B2EA457740fBDe58c758E4C574834224413e';

export const mintMap = async (_tokenId, _ethersProvider) => {
  console.log('map');
  const abi = new utils.Interface([
    'function discoverEncounters(uint256 tokenId) public'
  ]);

  const contract = new Contract(
    MAPS_CONTRACT,
    abi,
    _ethersProvider.getSigner()
  );

  return contract.discoverEncounters(_tokenId);
};

export const mintMonster = async (_tokenId, _ethersProvider) => {
  console.log('monster');
  const abi = new utils.Interface(['function claim(uint256 tokenId) public']);

  const contract = new Contract(
    MONSTERS_CONTRACT,
    abi,
    _ethersProvider.getSigner()
  );

  return contract.claim(_tokenId);
};
