import {
  Flex,
  Link,
  Image,
  SimpleGrid,
  VStack,
  HStack,
  Text
} from '@chakra-ui/react';

import builtByRaidGuild from '../assets/built_by_raidguild.svg';

export const Footer = () => {
  return (
    <Flex
      direction={{ base: 'column', md: 'row', lg: 'row' }}
      alignItems="flex-start"
      justifyContent="space-between"
      px={{ base: '2rem', lg: '5rem' }}
      py="2rem"
      w="100%"
    >
      <SimpleGrid
        columns={{ base: 1, md: 3, lg: 3 }}
        spacing={{ base: '2rem', lg: '5rem' }}
        fontFamily="spaceMono"
        fontSize="1rem"
        color="greyLight"
      >
        <VStack alignItems="flex-start">
          <Text fontWeight="bold" fontSize="1.2rem" color="red">
            Contracts
          </Text>
          <Link
            href="https://etherscan.io/address/0xecb9b2ea457740fbde58c758e4c574834224413e"
            isExternal
          >
            Monsters
          </Link>
          <Link
            href="https://etherscan.io/address/0x6C8715ade6361D35c941EB901408EFca8A20F65a"
            isExternal
          >
            Maps
          </Link>
        </VStack>
        <VStack alignItems="flex-start">
          <Text fontWeight="bold" fontSize="1.2rem" color="red">
            Opensea
          </Text>
          <Link
            href="https://opensea.io/collection/monsters-7vx3cc5ojl"
            isExternal
          >
            Monsters
          </Link>
          <Link href="https://opensea.io/collection/monstermaps" isExternal>
            Maps
          </Link>
        </VStack>
        <VStack alignItems="flex-start">
          <Text fontWeight="bold" fontSize="1.2rem" color="red">
            Social
          </Text>
          <Link>
            <HStack>
              <span style={{ width: '15px', marginRight: '5px' }}>
                <i className="fab fa-twitter"></i>
              </span>
              <Link href="https://twitter.com/Monstermap" isExternal>
                Twitter
              </Link>
            </HStack>
          </Link>

          <Link>
            <HStack>
              <span style={{ width: '15px', marginRight: '5px' }}>
                <i className="fab fa-discord"></i>
              </span>
              <Link href="https://discord.gg/rqwMK42r" isExternal>
                Discord
              </Link>
            </HStack>
          </Link>
        </VStack>
      </SimpleGrid>

      <Image
        src={builtByRaidGuild}
        alt="built by raidguild"
        width="250px"
        ml={{ base: '0px', md: 'auto' }}
        mt={{ base: '2rem' }}
      />
    </Flex>
  );
};
