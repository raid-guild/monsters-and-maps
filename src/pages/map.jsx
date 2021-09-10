import { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  Grid,
  Flex,
  Heading,
  Box,
  Text,
  Image,
  Spinner
} from '@chakra-ui/react';

import { useHistory, useParams } from 'react-router-dom';

import unclaimed_monster from '../assets/monster__unclaimed.png';

const GET_MAPS = gql`
  query GetMap($tokenId: String!) {
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

const Map = () => {
  const { tokenId } = useParams();
  const history = useHistory();

  const { loading, error, data } = useQuery(GET_MAPS, {
    variables: { tokenId: tokenId.toString() }
  });

  const [monsters, setMonsters] = useState([]);
  const [mapTokenUri, setMapTokenUri] = useState('');

  if (loading) console.log('Loading...');
  if (error) console.log(`Error! ${error.message}`);

  useEffect(() => {
    if (data) {
      let dataUri = data.maps[0].tokenUri;
      let json = atob(dataUri.substring(29));
      let result = JSON.parse(json);
      setMapTokenUri(result.image);
      setMonsters(data.maps[0].monsters);
    }
  }, [data]);

  return (
    <Flex direction='column' alignItems='center' h='100%' w='100%' p='2rem'>
      {loading && <Spinner size='xl' />}
      {data && (
        <Grid templateColumns='repeat(2, 1fr)' gap={1}>
          <Box>
            <Heading variant='headingTwo' mb='1rem'>
              Map #${tokenId}
            </Heading>
            <Image src={mapTokenUri} alt='map' width='300px' />
            <br />
            <Text variant='textOne'>
              minted at ${data.maps[0].mintInfo.time}
            </Text>
            <Text variant='textOne' maxW='300px' isTruncated>
              minted by ${data.maps[0].mintInfo.minter.address}
            </Text>
          </Box>

          <Box>
            <Heading variant='headingTwo' mb='1rem'>
              Monsters Found
            </Heading>
            <Grid templateColumns='repeat(4, 1fr)' gap={6}>
              {monsters.map((monster, index) => {
                let result = '';
                if (monster.tokenUri !== '') {
                  let dataUri = monster.tokenUri;
                  let json = atob(dataUri.substring(29));
                  result = JSON.parse(json);
                }

                return (
                  <Box
                    key={index}
                    onClick={() => history.push(`/monster/${monster.tokenId}`)}
                  >
                    <Text variant='textOne'>#{monster.tokenId}</Text>
                    <Image
                      src={result !== '' ? result.image : unclaimed_monster}
                      alt='map'
                      w='150px'
                    />
                  </Box>
                );
              })}
            </Grid>
          </Box>
        </Grid>
      )}
    </Flex>
  );
};

export default Map;
