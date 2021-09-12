import { useContext, useState } from 'react';
import {
  Box,
  Text,
  Image,
  Tooltip,
  Button,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton
} from '@chakra-ui/react';
import { useHistory, useLocation } from 'react-router-dom';

import { AppContext } from '../context/AppContext';

import { mintMap, mintMonster } from '../utils/web3';

const Mapper = ({ index, tokenId, image, route }) => {
  const context = useContext(AppContext);
  const history = useHistory();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [txInitiated, setTxInitiated] = useState(false);
  const [txHash, setTxhash] = useState('');
  const [modal, setModal] = useState(false);

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
      let mintFunc = location.pathname.includes('map') ? mintMonster : mintMap;
      let tx = await mintFunc(tokenId, context.ethersProvider);
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

  return (
    <>
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
              isLoading={loading}
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
              onClick={() => connect()}
            >
              Claim
            </Button>
          )}
        </Box>
      </Tooltip>
      <Modal isOpen={modal} onClose={() => setModal(false)} isCentered>
        <ModalOverlay>
          <ModalContent
            p='2rem'
            maxW='40rem'
            background='blackLight'
            borderRadius='0.5rem'
            color='white'
            justifyContent='center'
            alignItems='center'
          >
            <ModalCloseButton
              _hover={{ bgColor: 'white20' }}
              top='0.5rem'
              right='0.5rem'
            />
            {context.chainID === 1 || context.chainID === '0x1' ? (
              <>
                <Text variant='textOne' mb='2rem' fontSize='lg'>
                  Are you sure to mint token #{tokenId}?
                </Text>

                <Button
                  onClick={() => mint()}
                  isDisabled={txInitiated}
                  isLoading={txInitiated}
                  textTransform='uppercase'
                  variant='primary'
                  w='50px'
                >
                  Mint
                </Button>
              </>
            ) : (
              <Text variant='textOne' color='red'>
                Switch to Mainnet
              </Text>
            )}

            {txHash && (
              <Text color='white' textAlign='center' fontSize='sm'>
                Follow your transaction{' '}
                <Link
                  href={`https://etherscan.io/tx/${txHash}`}
                  isExternal
                  color='red'
                  textDecoration='underline'
                >
                  here
                </Link>
              </Text>
            )}
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
};

export default Mapper;
