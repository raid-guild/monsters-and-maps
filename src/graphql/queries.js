import { gql } from '@apollo/client';

export const GET_MAP_INFO = gql`
  query GetMapInfo($tokenId: String!) {
    maps(where: { tokenId: $tokenId }) {
      tokenUri
      mintInfo {
        minter {
          address
        }
        time
      }
      monsters {
        tokenId
        tokenUri
        owner {
          address
        }
      }
    }
  }
`;

export const GET_MONSTER_INFO = gql`
  query GetMonsterInfo($tokenId: String!) {
    monsters(where: { tokenId: $tokenId }) {
      tokenUri
      mintInfo {
        minter {
          address
        }
        time
      }
      maps {
        tokenId
        tokenUri
        owner {
          address
        }
      }
    }
  }
`;

export const GET_OWNER_INFO = gql`
  query GetOwnerInfo($account: String!) {
    owners(where: { address: $account }) {
      maps {
        tokenId
        tokenUri
      }
      monsters {
        tokenId
        tokenUri
      }
    }
  }
`;
