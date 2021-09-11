import { useState, useEffect, useContext } from 'react';
import {
  SimpleGrid,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  useToast,
  Link
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
  const { loading, error, data, fetchMore } = useQuery(GET_ALL_MAPS, {
    variables: {
      first: 1000,
      skip: 0
    }
  });
  const history = useHistory();
  const toast = useToast();

  const [canvasDrawn, setCanvasDrawn] = useState(false);
  const [tokenIdInput, setTokenIdInput] = useState(10000);
  const [txInitiated, setTxInitiated] = useState(false);
  const [txHash, setTxHash] = useState('');

  if (loading) console.log('Loading...');
  if (error) console.log(`Error! ${error.message}`);

  const mint = async () => {
    if (context.ethersProvider === '') {
      setTxInitiated(true);
      await context.connectWallet();
      setTxInitiated(false);
    } else if (context.chainID === '1' || context.chainID === '0x1') {
      try {
        setTxInitiated(true);
        let tx = await mintMap(parseInt(tokenIdInput), context.ethersProvider);
        if (tx) {
          toast({
            duration: 6000,
            position: 'top',
            render: () => (
              <Box
                bg='black'
                fontFamily='jetbrains'
                color='red'
                mt='1rem'
                p='3'
              >
                View your transaction{' '}
                <Link
                  href={`https://etherscan.io/tx/${txHash}`}
                  isExternal
                  textDecoration='underline'
                >
                  here
                </Link>
              </Box>
            )
          });
          setTxHash(tx.hash);
          const { status } = await tx.wait();
          if (status === 1) {
            setTxInitiated(false);
            history.push('/dashboard');
          } else {
            toast({
              duration: 6000,
              position: 'top',
              render: () => (
                <Box
                  bg='black'
                  fontFamily='jetbrains'
                  color='red'
                  mt='1rem'
                  p='3'
                >
                  Transaction failed!
                </Box>
              )
            });
            setTxInitiated(false);
          }
        }
      } catch (err) {
        setTxInitiated(false);
      }
    } else {
      toast({
        duration: 6000,
        position: 'top',
        render: () => (
          <Box bg='black' fontFamily='jetbrains' color='red' mt='1rem' p='3'>
            Switch to Mainnet
          </Box>
        )
      });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <Flex direction='column' h='100%' w='100%' p='2rem'>
      <Heading variant='headingOne'>The world map ..</Heading>
      <Text variant='textOne' mt='1rem' mb='2rem'>
        Below is a 100x100 grid with each of them representing a map where the
        monsters hide and lurk in the dark. The red highlighted squares in the
        grid represent a map token that has been explored by a hunter while the
        dark squares are unexplored and who knows what hides in there.
      </Text>
      <canvas
        id='grid'
        style={{ background: theme.colors.blackLight }}
      ></canvas>
      <Heading variant='headingTwo' mt='5rem' mb='1rem'>
        Explored Maps
      </Heading>
      <Text variant='textOne' mt='1rem' mb='1rem'>
        Find below the map token IDs that are explored in the above world map.
        Click to re-explore a map. Or enter a token ID that is not explored to
        mint it.
      </Text>
      <Flex direction='row' mb='2rem'>
        <StyledInput
          placeholder='Enter token ID'
          onChange={(e) => setTokenIdInput(e.target.value)}
        ></StyledInput>
        <Button
          isLoading={txInitiated}
          variant='primary'
          onClick={() => mint()}
          disabled={
            tokenIdInput &&
            parseInt(tokenIdInput) <= 9750 &&
            !grids.includes(parseInt(tokenIdInput))
              ? false
              : true
          }
        >
          {context.ethersProvider === '' ? 'Connect' : 'Claim'}
        </Button>
      </Flex>
      {canvasDrawn && (
        <SimpleGrid
          columns={15}
          gap={1}
          style={{ backdropFilter: 'blur(.5rem)' }}
        >
          {grids.map((tokenId) => (
            <Box
              bg='blackLight'
              color='red'
              p={3}
              fontFamily='jetbrains'
              cursor='pointer'
              _hover={{ bg: 'black' }}
              onClick={() => history.push(`/map/${tokenId}`)}
            >
              #{tokenId}
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Flex>
  );
};

export default World;
