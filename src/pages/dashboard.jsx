import {
  Grid,
  Flex,
  Heading,
  Box,
  Text,
  Image,
  Spinner
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

import { AppContext } from '../context/AppContext';

const GET_MAPS = gql`
  query GetOwner($account: String!) {
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

const DashBoard = () => {
  const context = useContext(AppContext);

  const [maps, setMaps] = useState([]);
  const [monsters, setMonsters] = useState([]);

  const { loading, error, data } = useQuery(GET_MAPS, {
    variables: { account: context.account }
  });

  const history = useHistory();

  if (loading) console.log('Loading...');
  if (error) console.log(`Error! ${error.message}`);

  useEffect(() => {
    if (data && data.owners.length) {
      let maps = [];
      let monsters = [];
      data.owners[0].maps.map((map) => {
        return maps.push(map);
      });
      data.owners[0].monsters.map((monster) => {
        return monsters.push(monster);
      });

      setMaps(maps);
      setMonsters(monsters);
    }
  }, [data]);

  useEffect(() => {
    if (context.account === '') {
      history.push('/');
    }
  }, [context.account, history]);

  return (
    <Flex direction='column' h='100%' w='100%' p='2rem'>
      {loading && <Spinner size='xl' />}
      {!loading && (
        <>
          <Flex direction='column'>
            <Heading variant='headingTwo' mb='1rem' textDecoration='underline'>
              My Maps
            </Heading>
            <Grid templateColumns='repeat(4, 1fr)' gap={6}>
              {maps.length === 0 && (
                <Text variant='textOne'>Maps not yet found!</Text>
              )}
              {maps &&
                maps.map((map, index) => {
                  let dataUri = map.tokenUri;
                  let json = atob(dataUri.substring(29));
                  let result = JSON.parse(json);
                  return (
                    <Box
                      key={index}
                      onClick={() => history.push(`/map/${map.tokenId}`)}
                    >
                      <Text variant='textOne'>#{map.tokenId}</Text>
                      <Image src={result.image} alt='map' w='300px' />
                    </Box>
                  );
                })}
            </Grid>
          </Flex>
          <Flex direction='column' mt='3rem'>
            <Heading variant='headingTwo' mb='1rem' textDecoration='underline'>
              My Monsters
            </Heading>
            <Grid templateColumns='repeat(4, 1fr)' gap={6}>
              {monsters.length === 0 && (
                <Text variant='textOne'>Monsters not yet found!</Text>
              )}
              {maps &&
                monsters.map((monster, index) => {
                  let dataUri = monster.tokenUri;
                  let json = atob(dataUri.substring(29));
                  let result = JSON.parse(json);
                  return (
                    <Box
                      key={index}
                      onClick={() =>
                        history.push(`/monster/${monster.tokenId}`)
                      }
                    >
                      <Text variant='textOne'>#{monster.tokenId}</Text>
                      <Image src={result.image} alt='map' w='300px' />
                    </Box>
                  );
                })}
            </Grid>
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default DashBoard;
