import { Flex, Image, Link, HStack } from '@chakra-ui/react';
import React from 'react';

import RaidGuild from '../assets/built_by_raidguild.svg';

export const Footer = () => {
  return (
    <Flex
      w='100%'
      h='5rem'
      py='1rem'
      px='3rem'
      direction='row'
      align='center'
      justify='space-between'
    >
      <HStack fontFamily='jetbrains'>
        <Link mr='10px'>
          <HStack>
            <span style={{ width: '15px', marginRight: '1px' }}>
              <i className='fab fa-twitter'></i>
            </span>
            <Link
              href='https://twitter.com/Monstermap'
              target='_blank'
              rel='noopener noreferrer'
            >
              Twitter
            </Link>
          </HStack>
        </Link>

        <Link>
          <HStack>
            <span style={{ width: '15px', marginRight: '1px' }}>
              <i className='fab fa-discord'></i>
            </span>
            <Link
              href='https://discord.gg/rqwMK42r'
              target='_blank'
              rel='noopener noreferrer'
            >
              Discord
            </Link>
          </HStack>
        </Link>
      </HStack>

      <Link href='https://raidguild.org' isExternal zIndex={5}>
        <Image src={RaidGuild} alt='built-by-raid-guild' />
      </Link>
    </Flex>
  );
};
