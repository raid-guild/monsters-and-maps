import { Grid, Flex, Heading, Text, Spinner } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';

import { useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import { AppContext } from '../context/AppContext';

import Mapper from '../components/Mapper';

import { getTokenImage } from '../utils/helpers';
import { GET_OWNER_INFO } from '../graphql/queries';

const DashBoard = () => {
  const context = useContext(AppContext);

  const [maps, setMaps] = useState([]);
  const [monsters, setMonsters] = useState([]);

  const { loading, error, data } = useQuery(GET_OWNER_INFO, {
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
    <Flex direction="column" h="100%" w="100%" px="2rem" my="5rem">
      {loading && <Spinner size="xl" />}
      {!loading && (
        <>
          <Flex direction="column">
            <Heading variant="headingTwo" mb="1rem" textDecoration="underline">
              My Maps
            </Heading>
            <Grid templateColumns="repeat(4, 1fr)" gap={6}>
              {maps.length === 0 && (
                <Text variant="textOne">Maps not yet found!</Text>
              )}
              {maps &&
                maps.map((map, index) => {
                  return (
                    <Mapper
                      key={index}
                      index={index}
                      tokenId={map.tokenId}
                      image={getTokenImage(map)}
                      route={`/map/${map.tokenId}`}
                    />
                  );
                })}
            </Grid>
          </Flex>
          <Flex direction="column" mt="3rem">
            <Heading variant="headingTwo" mb="1rem" textDecoration="underline">
              My Monsters
            </Heading>
            <Grid templateColumns="repeat(4, 1fr)" gap={6}>
              {monsters.length === 0 && (
                <Text variant="textOne">Monsters not yet found!</Text>
              )}
              {maps &&
                monsters.map((monster, index) => {
                  return (
                    <Mapper
                      key={index}
                      index={index}
                      tokenId={monster.tokenId}
                      image={getTokenImage(monster)}
                      route={`/monster/${monster.tokenId}`}
                    />
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
