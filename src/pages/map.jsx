import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  Grid,
  Flex,
  Heading,
  Box,
  Text,
  Image,
  Spinner
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import Mapper from '../components/Mapper';
import { getTokenImage } from '../utils/helpers';
import { GET_MAP_INFO } from '../graphql/queries';

import unclaimed_monster from '../assets/monster__unclaimed.png';

const Map = () => {
  const { tokenId } = useParams();

  const { loading, error, data } = useQuery(GET_MAP_INFO, {
    variables: { tokenId: tokenId.toString() }
  });

  const [monsters, setMonsters] = useState([]);
  const [mapTokenUri, setMapTokenUri] = useState('');

  if (loading) console.log('Loading...');
  if (error) console.log(`Error! ${error.message}`);

  useEffect(() => {
    if (data) {
      console.log(data);
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
                let tokenImage = getTokenImage(monster);

                return (
                  <Mapper
                    index={index}
                    tokenId={monster.tokenId}
                    image={tokenImage !== '' ? tokenImage : unclaimed_monster}
                    route={
                      tokenImage !== '' ? `/monster/${monster.tokenId}` : null
                    }
                  />
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
