import { useContext, useState } from 'react';
import {
  Box,
  Text,
  Image,
  Tooltip,
  Button,
  Link,
  useToast
} from '@chakra-ui/react';
import { useHistory, useLocation } from 'react-router-dom';

import { AppContext } from '../context/AppContext';

import { mintMap, mintMonster } from '../utils/web3';

const Mapper = ({ index, tokenId, image, route }) => {
  const context = useContext(AppContext);
  const history = useHistory();
  const location = useLocation();
  const toast = useToast();

  const [txInitiated, setTxInitiated] = useState(false);
  const [txHash, setTxHash] = useState('');

  const mint = async () => {
    if (context.ethersProvider === '') {
      setTxInitiated(true);
      await context.connectWallet();
      setTxInitiated(false);
    } else if (context.chainID === '1' || context.chainID === '0x1') {
      try {
        setTxInitiated(true);
        let mintFunc = location.pathname.includes('map')
          ? mintMonster
          : mintMap;
        let tx = await mintFunc(tokenId, context.ethersProvider);
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

  return (
    <Tooltip label={route !== null ? 'Click to explore' : null} key={index}>
      <Box
        key={index}
        onClick={() => {
          if (route !== null) history.push(route);
        }}
        cursor={route !== null ? 'pointer' : 'no-drop'}
        position='relative'
      >
        <Text variant='textOne'>#{tokenId}</Text>
        <Image src={image} alt='map' w='300px' />
        {route === null && (
          <Button
            isLoading={txInitiated}
            position='absolute'
            top='60%'
            left='50%'
            transform='translateY(-50%) translateX(-50%)'
            bg='greyLight'
            color='black'
            fontFamily='jetbrains'
            textTransform='uppercase'
            borderRadius='0px'
            _hover={{ bg: 'greyDark' }}
            onClick={() => mint()}
          >
            {context.ethersProvider === '' ? 'Connect' : 'Claim'}
          </Button>
        )}
      </Box>
    </Tooltip>
  );
};

export default Mapper;
