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

import unclaimed_map from '../assets/map__unclaimed.png';

const GET_MAPS = gql`
  query GetMap($tokenId: String!) {
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

const Monster = () => {
  const { tokenId } = useParams();
  const history = useHistory();

  const { loading, error, data } = useQuery(GET_MAPS, {
    variables: { tokenId: tokenId.toString() }
  });

  const [maps, setMaps] = useState([]);
  const [monsterTokenUri, setMonsterTokenUri] = useState('');

  if (loading) console.log('Loading...');
  if (error) console.log(`Error! ${error.message}`);

  useEffect(() => {
    if (data) {
      console.log(data);
      let dataUri = data.monsters[0].tokenUri;
      let json = atob(dataUri.substring(29));
      let result = JSON.parse(json);
      setMonsterTokenUri(result.image);
      setMaps(data.monsters[0].maps);
    }
  }, [data]);

  return (
    <Flex direction='column' alignItems='center' h='100%' w='100%' p='2rem'>
      {loading && <Spinner size='xl' />}
      {data && (
        <Grid templateColumns='repeat(2, 1fr)' gap={1}>
          <Box>
            <Heading variant='headingTwo' mb='1rem'>
              Monster #${tokenId}
            </Heading>
            <Image src={monsterTokenUri} alt='map' width='300px' />
            <br />
            <Text variant='textOne'>
              minted at ${data.monsters[0].mintInfo.time}
            </Text>
            <Text variant='textOne' maxW='300px' isTruncated>
              minted by ${data.monsters[0].mintInfo.minter.address}
            </Text>
          </Box>

          <Box>
            <Heading variant='headingTwo' mb='1rem'>
              Located Maps
            </Heading>
            <Grid templateColumns='repeat(4, 1fr)' gap={6}>
              {maps.length === 0 && (
                <Text variant='textOne'>Maps not yet found!</Text>
              )}
              {maps.length !== 0 &&
                maps.map((map, index) => {
                  let result = '';
                  if (map.tokenUri !== '') {
                    let dataUri = map.tokenUri;
                    let json = atob(dataUri.substring(29));
                    result = JSON.parse(json);
                  }

                  return (
                    <Box
                      key={index}
                      onClick={() => history.push(`/monster/${map.tokenId}`)}
                    >
                      <Text variant='textOne'>#{map.tokenId}</Text>
                      <Image
                        src={result !== '' ? result.image : unclaimed_map}
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

export default Monster;
