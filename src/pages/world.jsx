import { useState, useEffect, useContext } from 'react';
import {
  SimpleGrid,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Link,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton
} from '@chakra-ui/react';
import { useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import styled from '@emotion/styled';

import { AppContext } from '../context/AppContext';

import { GET_ALL_MAPS } from '../graphql/queries';
import { theme } from '../theme/index';
import { mintMap } from '../utils/web3';

const StyledInput = styled.input`
  width: 200px;
  height: 50px;
  outline: none;
  color: white;
  font-family: ${theme.fonts.spaceMono};
  font-size: 1rem;
  border-radius: 3px;
  background-color: ${theme.colors.blackLighter};
  margin-right: 1rem;
  padding: 10px;
  &::placeholder {
    color: #ff3864;
    opacity: 1;
  }
`;

let grids = [];

const World = () => {
  const context = useContext(AppContext);
  const { error, data, fetchMore } = useQuery(GET_ALL_MAPS, {
    variables: {
      first: 1000,
      skip: 0
    }
  });
  const history = useHistory();

  const [canvasDrawn, setCanvasDrawn] = useState(false);
  const [tokenIdInput, setTokenIdInput] = useState(10000);

  const [loading, setLoading] = useState(false);
  const [txInitiated, setTxInitiated] = useState(false);
  const [txHash, setTxhash] = useState('');
  const [modal, setModal] = useState(false);

  if (error) console.log(`Error! ${error.message}`);

  const connect = async () => {
    try {
      setLoading(true);
      if (context.ethersProvider === '') {
        await context.connectWallet();
      }
      setModal(true);
      setLoading(false);
      setModal(true);
    } catch (err) {
      setLoading(false);
    }
  };

  const mint = async () => {
    try {
      setTxInitiated(true);
      let tx = await mintMap(parseInt(tokenIdInput), context.ethersProvider);
      if (tx) {
        setTxhash(tx.hash);
        const { status } = await tx.wait();
        if (status === 1) {
          setTxInitiated(false);
          history.push('/dashboard');
        } else {
          setTxInitiated(false);
        }
      }
    } catch (err) {
      setTxInitiated(false);
    }
  };

  useEffect(() => {
    grids = [];
  }, []);

  useEffect(() => {
    if (data) {
      let _temp = grids;
      data.maps.forEach((map) => {
        _temp.push(parseInt(map.tokenId));
      });

      if (data.maps.length === 1000) {
        fetchMore({
          variables: {
            skip: data.maps.length
          }
        });
      } else {
        grids.sort(function (a, b) {
          return a - b;
        });
        drawGrid(grids);
        setCanvasDrawn(true);
      }
    }
  }, [data]);

  const drawGrid = (_grids) => {
    let w = 4000;
    let h = 4000;
    let step = 40;
    var canvas = document.getElementById('grid');

    canvas.width = 4000;
    canvas.height = 4000;

    var ctx = canvas.getContext('2d');

    var count = 1;
    ctx.beginPath();

    for (var x = 0; x <= w; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    // set the color of the line
    ctx.strokeStyle = theme.colors.red;
    ctx.lineWidth = 1;

    // the stroke will actually paint the current path
    ctx.stroke();

    // for the sake of the example 2nd path
    ctx.beginPath();
    for (var y = 0; y <= h; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    // set the color of the line
    ctx.strokeStyle = 'rgb(20,20,20)';
    // just for fun
    ctx.lineWidth = 1;
    // for your original question - you need to stroke only once
    ctx.stroke();

    for (var y1 = 40; y1 <= h; y1 += step) {
      for (var x1 = 0; x1 <= w - 40; x1 += step) {
        ctx.fillText('' + count, x1, y1);

        if (_grids.includes(count)) {
          ctx.fillStyle = theme.colors.red;
          ctx.globalAlpha = 0.5;
          ctx.fillRect(x1, y1 - step, step, step);
          ctx.globalAlpha = 1;
          ctx.fillStyle = theme.colors.red;
        }

        count++;
      }
    }
  };

  return (
    <Flex direction="column" h="100%" w="100%" px="2rem" my="5rem">
      <Heading variant="headingOne" mb="2rem">
        Map Minter
      </Heading>
      <Flex direction="row" mb="2rem">
        <StyledInput
          placeholder="Enter token ID"
          onChange={(e) => setTokenIdInput(e.target.value)}
        ></StyledInput>
        <Button
          isLoading={loading}
          variant="primary"
          onClick={() => connect()}
          disabled={
            tokenIdInput &&
            parseInt(tokenIdInput) <= 9750 &&
            !grids.includes(parseInt(tokenIdInput))
              ? false
              : true
          }
        >
          Claim
        </Button>
      </Flex>
      <Tabs variant="line" isFitted>
        <TabList fontFamily="rubik" fontWeight="bold">
          <Tab bg="black" color="red" _selected={{ bg: 'red', color: 'black' }}>
            World Map
          </Tab>
          <Tab bg="black" color="red" _selected={{ bg: 'red', color: 'black' }}>
            Claimed Maps
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Text variant="textOne" mt="1rem" mb="2rem" maxW="100%">
              Below is a 100x100 grid with each of them representing a map where
              the monsters hide and lurk in the dark. The red highlighted
              squares in the grid represent a map token that has been explored
              by a hunter while the dark squares are unexplored and who knows
              what hides in there.
            </Text>
            <canvas
              id="grid"
              style={{
                background: theme.colors.blackLight,
                width: '100%'
              }}
            ></canvas>
          </TabPanel>
          <TabPanel>
            <Text variant="textOne" mt="1rem" mb="1rem" maxW="100%">
              Find below the map token IDs that are explored in the above world
              map. Click to re-explore a map. Or enter a token ID that is not
              explored to mint it.
            </Text>

            {canvasDrawn && (
              <SimpleGrid
                columns={15}
                gap={1}
                style={{ backdropFilter: 'blur(.5rem)' }}
              >
                {grids.map((tokenId) => (
                  <Box
                    key={tokenId}
                    bg="blackLight"
                    color="red"
                    p={3}
                    fontFamily="jetbrains"
                    cursor="pointer"
                    _hover={{ bg: 'black' }}
                    onClick={() => history.push(`/map/${tokenId}`)}
                  >
                    #{tokenId}
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Modal isOpen={modal} onClose={() => setModal(false)} isCentered>
        <ModalOverlay>
          <ModalContent
            p="2rem"
            maxW="40rem"
            background="blackLight"
            borderRadius="0.5rem"
            color="white"
            justifyContent="center"
            alignItems="center"
          >
            <ModalCloseButton
              _hover={{ bgColor: 'white20' }}
              top="0.5rem"
              right="0.5rem"
            />
            {context.chainID === 1 || context.chainID === '0x1' ? (
              <>
                <Text variant="textOne" mb="2rem" fontSize="lg">
                  Are you sure to mint token #{tokenIdInput}?
                </Text>

                <Button
                  onClick={() => mint()}
                  isDisabled={txInitiated}
                  isLoading={txInitiated}
                  textTransform="uppercase"
                  variant="primary"
                  w="50px"
                >
                  Mint
                </Button>
              </>
            ) : (
              <Text variant="textOne" color="red">
                Switch to Mainnet
              </Text>
            )}

            {txHash && (
              <Text color="white" textAlign="center" fontSize="sm">
                Follow your transaction{' '}
                <Link
                  href={`https://etherscan.io/tx/${txHash}`}
                  isExternal
                  color="red"
                  textDecoration="underline"
                >
                  here
                </Link>
              </Text>
            )}
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Flex>
  );
};

export default World;
