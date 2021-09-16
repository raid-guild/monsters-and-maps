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
import { getTokenImage, getAccountString } from '../utils/helpers';
import { GET_MAP_INFO } from '../graphql/queries';
import { getProfile } from '../utils/3box';

import unclaimed_monster from '../assets/monster__unclaimed.png';

const Map = () => {
  const { tokenId } = useParams();

  const { loading, error, data } = useQuery(GET_MAP_INFO, {
    variables: { tokenId: tokenId.toString() }
  });

  const [monsters, setMonsters] = useState([]);
  const [mapTokenUri, setMapTokenUri] = useState('');
  const [owner, setOwner] = useState('');

  if (loading) console.log('Loading...');
  if (error) console.log(`Error! ${error.message}`);

  useEffect(() => {
    if (data) {
      getProfile(data.maps[0].mintInfo.minter.address).then((p) => {
        if (p && p.name) {
          setOwner(p.name);
        } else {
          setOwner(getAccountString(data.maps[0].mintInfo.minter.address));
        }

        setMapTokenUri(getTokenImage(data.maps[0]));
        setMonsters(data.maps[0].monsters);
      });
    }
  }, [data]);

  return (
    <Flex
      direction="column"
      alignItems="center"
      h="100%"
      w="100%"
      px="2rem"
      my={{ md: '5rem', base: '2rem' }}
    >
      {loading && <Spinner size="xl" />}
      {data && (
        <Grid
          templateColumns={{ md: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }}
          gap={1}
        >
          <Box mb={{ md: '2rem', base: '2rem' }}>
            <Heading variant="headingTwo" mb="1rem">
              Map #${tokenId}
            </Heading>
            <Image src={mapTokenUri} alt="map" width="300px" />
            <br />
            <Text variant="textOne">
              minted at {data.maps[0].mintInfo.time}
            </Text>
            <Text variant="textOne" maxW="300px" isTruncated>
              minted by {owner}
            </Text>
          </Box>

          <Box>
            <Heading variant="headingTwo" mb="1rem">
              Monsters Found
            </Heading>
            <Grid
              templateColumns={{ md: 'repeat(4, 1fr)', base: 'repeat(1, 1fr)' }}
              gap={6}
            >
              {monsters.map((monster, index) => {
                let tokenImage = getTokenImage(monster);

                return (
                  <Mapper
                    key={index}
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
