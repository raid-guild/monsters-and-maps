import { useContext, useEffect, useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Image,
  Text,
  Tag,
  Link as ChakraLink,
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@chakra-ui/react';
import styled from '@emotion/styled';

import { AppContext } from '../context/AppContext';
import { theme } from '../theme/index';

import { getProfile } from '../utils/3box';
import { getAccountString, getNetworkLabel } from '../utils/helpers';

// import Logo from '../assets/raidguild__logo.png';
import LogoText from '../assets/m&m__logo.png';

const StyledButton = styled(Button)`
  &::after {
    box-sizing: inherit;
    transition: all ease-in-out 0.2s;
    background: none repeat scroll 0 0 ${theme.colors.red};
    content: '';
    display: block;
    height: 2px;
    width: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    font-family: ${theme.fonts.rubik};
  }
  &:hover {
    text-decoration: none;
    ::after {
      width: 100%;
    }
  }
`;

export const NavButton = ({ onClick, children }) => (
  <StyledButton
    onClick={onClick}
    transition='all 0.5s ease 0.4s'
    my='1rem'
    variant='link'
    color='red'
    fontWeight='normal'
    fontSize='1.5rem'
  >
    {children}
  </StyledButton>
);

export const Header = () => {
  const { account, chainID, web3, disconnectWallet } = useContext(AppContext);
  const [isOpen, onOpen] = useState(false);
  const history = useHistory();

  const [profile, setProfile] = useState();

  useEffect(() => {
    if (account) {
      getProfile(account).then((p) => setProfile(p));
    }
  }, [account]);

  return (
    <Flex
      w='100%'
      color='white'
      fontFamily='rubik'
      justify='space-between'
      align='center'
      zIndex={5}
    >
      <Box zIndex={5}>
        <RouterLink to='/'>
          <Flex align='center' p='1rem' m='1rem'>
            {/* <Image src={Logo} alt='Raid Guild' width='50px' /> */}
            <Image src={LogoText} alt='Smart Invoice' width='200px' />
          </Flex>
        </RouterLink>
      </Box>
      <Flex
        mx={{ base: '2rem', sm: '3rem' }}
        align='center'
        height='8rem'
        transition='width 1s ease-out'
      >
        {account && web3 && (
          <Flex justify='center' align='center' zIndex={5}>
            <Popover placement='left'>
              <PopoverTrigger>
                <Button
                  h='auto'
                  fontWeight='normal'
                  colorScheme='red'
                  _hover={{ backgroundColor: 'blackLight' }}
                  p={{ base: 0, md: 2 }}
                >
                  <Flex
                    borderRadius='50%'
                    w='2.5rem'
                    h='2.5rem'
                    overflow='hidden'
                    justify='center'
                    align='center'
                    bgColor='black'
                    bgImage={profile && `url(${profile.imageUrl})`}
                    border={`1px solid ${theme.colors.white20}`}
                    bgSize='cover'
                    bgRepeat='no-repeat'
                    bgPosition='center center'
                  />

                  <Text
                    px={2}
                    display={{ base: 'none', md: 'flex' }}
                    fontFamily='jetbrains'
                    color='red'
                  >
                    {profile && profile.name
                      ? profile.name
                      : getAccountString(account)}
                  </Text>
                  <Tag
                    colorScheme='red'
                    display={{ base: 'none', md: 'flex' }}
                    size='sm'
                  >
                    {getNetworkLabel(chainID)}
                  </Tag>
                </Button>
              </PopoverTrigger>
              <PopoverContent bg='none' w='auto'>
                <Button
                  onClick={() => {
                    disconnectWallet();
                    history.push('/');
                  }}
                  variant='primary'
                  mt='0'
                >
                  Disconnect
                </Button>
              </PopoverContent>
            </Popover>
          </Flex>
        )}
        <Button
          onClick={() => onOpen((o) => !o)}
          variant='link'
          ml={{ base: '0.5rem', sm: '1rem' }}
          zIndex={7}
        >
          {!isOpen && (
            <span
              style={{
                width: '50px',
                fontSize: '2rem',
                color: theme.colors.red
              }}
            >
              <i className='fas fa-bars' />
            </span>
          )}
          {isOpen && (
            <span
              style={{
                width: '50px',
                fontSize: '2rem',
                color: theme.colors.red
              }}
            >
              <i className='fas fa-times' />
            </span>
          )}
        </Button>
      </Flex>
      <Flex
        zIndex={6}
        position='fixed'
        left='0'
        top='0'
        bg='black'
        h='100%'
        w='100%'
        direction='column'
        justify='space-evenly'
        align='center'
        transition='all .8s ease-out'
        pointerEvents={isOpen ? 'all' : 'none'}
        color='red'
        fontWeight='normal'
        fontSize='1.5rem'
        fontFamily='spaceMono'
        css={{
          clipPath: isOpen
            ? 'circle(calc(100vw + 100vh) at 90% -10%)'
            : 'circle(100px at 90% -20%)'
        }}
      >
        <ChakraLink
          href='https://etherscan.io/address/0xecb9b2ea457740fbde58c758e4c574834224413e'
          isExternal
        >
          Monsters Contract
        </ChakraLink>

        <ChakraLink
          href='https://opensea.io/collection/monsters-7vx3cc5ojl'
          isExternal
        >
          Monsters Opensea
        </ChakraLink>
        <ChakraLink
          href='https://etherscan.io/address/0x6C8715ade6361D35c941EB901408EFca8A20F65a'
          isExternal
        >
          Maps Contract
        </ChakraLink>
        <ChakraLink href='https://opensea.io/collection/monstermaps' isExternal>
          Maps Opensea
        </ChakraLink>
      </Flex>
    </Flex>
  );
};
