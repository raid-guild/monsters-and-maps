import { useState, useEffect, useContext } from 'react';
import {
  Flex,
  Heading,
  Text,
  Button,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Spinner
} from '@chakra-ui/react';
import { useQuery } from '@apollo/client';

import { AppContext } from '../context/AppContext';

import { GET_ALL_MAPS } from '../graphql/queries';
import { mintMap } from '../utils/web3';

import MapTiles from '../components/MapTiles';

const World = () => {
  const context = useContext(AppContext);
  const { error, data, fetchMore } = useQuery(GET_ALL_MAPS, {
    variables: {
      first: 1000,
      skip: 0
    },
    notifyOnNetworkStatusChange: true
  });

  const [grids, setGrids] = useState([]);

  const [txInitiated, setTxInitiated] = useState(false);
  const [txHash, setTxhash] = useState('');
  const [modal, setModal] = useState(false);
  const [mintTokenId, setMintTokenId] = useState('');

  if (error) console.log(`Error! ${error.message}`);

  const connect = async (_tokenId) => {
    try {
      if (context.ethersProvider === '') {
        await context.connectWallet();
      }
      setMintTokenId(_tokenId);
      setModal(true);
      setModal(true);
    } catch (err) {
      console.log(err);
    }
  };

  const mint = async () => {
    try {
      setTxInitiated(true);
      let tx = await mintMap(parseInt(mintTokenId), context.ethersProvider);
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
    if (data) {
      if (data.maps.length === 1000) {
        fetchMore({
          variables: {
            skip: data.maps.length
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            console.log(fetchMoreResult);
            return Object.assign({}, prev, {
              maps: [...prev.maps, ...fetchMoreResult.maps]
            });
          }
        });
      } else {
        let claimedMapIds = [];
        let tempGrids = [];
        data.maps.forEach((map) => {
          claimedMapIds.push(parseInt(map.tokenId));
        });
        for (let i = 1; i <= 10000; i++) {
          if (claimedMapIds.includes(i)) {
            tempGrids.push({ id: i, claimed: true });
          } else {
            tempGrids.push({ id: i, claimed: false });
          }
        }

        tempGrids.sort(function (a, b) {
          return a - b;
        });

        setGrids(tempGrids);
      }
    }
  }, [data]);

  // const drawGrid = (_grids) => {
  //   let w = 4000;
  //   let h = 4000;
  //   let step = 40;
  //   var canvas = document.getElementById('grid');

  //   canvas.width = 4000;
  //   canvas.height = 4000;

  //   var ctx = canvas.getContext('2d');

  //   canvas.addEventListener('click', function (event) {
  //     const rect = canvas.getBoundingClientRect();

  //     var x = event.clientX - rect.left,
  //       y = event.clientY - rect.top;

  //     console.log(Math.ceil(y / 10), Math.ceil(x / 10));

  //     let tile = Math.ceil(x / 10) + Math.ceil(y / 10) * 117 - 117;
  //     console.log(tile);

  //     // if (_grids.indexOf(tile) !== -1) {
  //     //   window.open(`https://www.monstermaps.world/map/${tile}`, '_blank');
  //     // }
  //   });

  //   var count = 1;
  //   ctx.beginPath();

  //   for (var x = 0; x <= w; x += step) {
  //     ctx.moveTo(x, 0);
  //     ctx.lineTo(x, h);
  //   }
  //   // set the color of the line
  //   ctx.strokeStyle = theme.colors.red;
  //   ctx.lineWidth = 1;

  //   // the stroke will actually paint the current path
  //   ctx.stroke();

  //   // for the sake of the example 2nd path
  //   ctx.beginPath();
  //   for (var y = 0; y <= h; y += step) {
  //     ctx.moveTo(0, y);
  //     ctx.lineTo(w, y);
  //   }
  //   // // set the color of the line
  //   ctx.strokeStyle = 'rgb(20,20,20)';
  //   // // just for fun
  //   ctx.lineWidth = 1;
  //   // for your original question - you need to stroke only once
  //   ctx.stroke();

  //   for (var y1 = 40; y1 <= h; y1 += step) {
  //     for (var x1 = 0; x1 <= w - 40; x1 += step) {
  //       // ctx.fillText('' + count, x1, y1);

  //       if (_grids.includes(count)) {
  //         ctx.fillStyle = theme.colors.red;
  //         ctx.globalAlpha = 0.5;
  //         ctx.fillRect(x1, y1 - step, step, step);
  //         ctx.globalAlpha = 1;
  //         ctx.fillStyle = theme.colors.red;
  //       }

  //       count++;
  //     }
  //   }
  // };

  return (
    <Flex
      direction="column"
      alignItems="center"
      h="100%"
      w="100%"
      px="2rem"
      py="2rem"
      bg="blackLight"
    >
      <Heading variant="headingOne" mb="2rem" mt="2rem">
        Map Minter
      </Heading>

      <Text variant="textOne" mb="2rem">
        Below is a grid of 10000 tiles with each of them representing a map
        where the monsters hide and lurk in the dark. The red highlighted
        squares in the grid represent a map token that has been explored by a
        hunter while the dark squares are unexplored and who knows what hides in
        there.
      </Text>

      <Text variant="textOne" mb="2rem">
        Click on a explored tile to view more. Or click on a unexplored tile to
        mint it.
      </Text>

      {grids.length === 0 && <Spinner size="xl" />}
      {grids.length !== 0 && (
        <MapTiles grids={grids} connect={connect} mint={mint} />
      )}

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
                  Are you sure to mint token #{mintTokenId}?
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
