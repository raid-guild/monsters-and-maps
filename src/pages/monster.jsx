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
import { GET_MONSTER_INFO } from '../graphql/queries';
import { getProfile } from '../utils/3box';

import unclaimed_map from '../assets/map__unclaimed.png';

const Monster = () => {
  const { tokenId } = useParams();

  const { loading, error, data } = useQuery(GET_MONSTER_INFO, {
    variables: { tokenId: tokenId.toString() }
  });

  const [maps, setMaps] = useState([]);
  const [monsterTokenUri, setMonsterTokenUri] = useState('');
  const [owner, setOwner] = useState('');

  if (loading) console.log('Loading...');
  if (error) console.log(`Error! ${error.message}`);

  useEffect(() => {
    if (data) {
      getProfile(data.monsters[0].mintInfo.minter.address).then((p) => {
        if (p && p.name) {
          setOwner(p.name);
        } else {
          setOwner(getAccountString(data.monsters[0].mintInfo.minter.address));
        }

        setMonsterTokenUri(getTokenImage(data.monsters[0]));
        setMaps(data.monsters[0].maps);
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
              Monster #${tokenId}
            </Heading>
            <Image src={monsterTokenUri} alt="map" width="300px" />
            <br />
            <Text variant="textOne">
              minted at {data.monsters[0].mintInfo.time}
            </Text>
            <Text variant="textOne" maxW="300px" isTruncated>
              minted by {owner}
            </Text>
          </Box>

          <Box>
            <Heading variant="headingTwo" mb="1rem">
              Located Maps
            </Heading>
            <Grid
              templateColumns={{ md: 'repeat(4, 1fr)', base: 'repeat(1, 1fr)' }}
              gap={6}
            >
              {maps.length === 0 && (
                <Text variant="textOne">Maps not yet found!</Text>
              )}
              {maps.length !== 0 &&
                maps.map((map, index) => {
                  let tokenImage = getTokenImage(map);

                  return (
                    <Mapper
                      key={index}
                      index={index}
                      tokenId={map.tokenId}
                      image={tokenImage !== '' ? tokenImage : unclaimed_map}
                      route={tokenImage !== '' ? `/map/${map.tokenId}` : null}
                      width="150px"
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

export default Monster;
