import React, { useContext } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from '@chakra-ui/react';

import { AppContext } from '../context/AppContext';

const faq_items = [
  {
    q: 'How do I mint Monsters or Monster Maps on Etherscan ?',
    a:
      'Go to the Hunt & Mint tab' +
      "\nChoose 'Claim'(Monsters) or 'discoverEncounters’ (MonsterMaps)" +
      '\nChoose a number between 1 - 9750 and try to claim!' +
      '\n<li>Connect wallet' +
      "\n'If the gas is ridiculously high(e.g. ~$15K), then that is claimed already.Try another number!"
  },
  {
    q: 'Why are there 2 Etherscan links?',
    a: 'There are 2 Etherscan links because there are 2 different NFTs you can mint. We have the Monsters - the creatures and beasts who roam the land. Next, we have the Monster Maps, which show you where each of these Monsters spawn on a Map.'
  },
  {
    q: 'Should I mint a Monster or Monster Map ?',
    a: 'You can mint either a Monster or a Monster Map. Minting a Monster Map would show you the Monsters on your map, which you can go mint new Monsters!'
  },
  {
    q: 'Do we need to overlay Maps & Monster Maps ?',
    a: "Not for now, as it is just a demo we do to show how we derived Monster Maps' spawn points from Maps."
  },
  {
    q: "I've just minted a Monster / Monster Map and it shows the 'Monster Maps' logo on Opensea. Why is this happening?",
    a: 'Be patient, young traveler. Give Opensea a while and the full image of your Monster / Monster Map will be generated'
  },
  {
    q: 'How is this related to Loot ?',
    a: "Monster Maps lives in the wider ecosystem of the Loot project. We are in the process of getting added to Loot's Derivative projects. You do not need to own a Loot to mint or buy a Monster or a Monster Map!"
  },
  {
    q: 'How is this related to Maps project ?',
    a: "Monster Map is a derivative of Maps, where we derived Monster Maps' spawn points from the locations in Maps. If you find a Map and Monster Map with a similar ID, you'll see that the locations have Monsters spawned there."
  },
  {
    q: 'Why are there Monsters beyond #9750 if we can only mint from #1 - #9750 ?',
    a: 'As this is a fair mint project, the Monsters from #9751 - #10000 are allocated for the dev fund to kickstart, build and grow this world of Monster Maps, as well as fund public goods within the Web3 ecosystem.'
  },
  {
    q: 'Who is behind this ?',
    a: 'RaidGuild. We are A Decentralized Collective of Mercenaries Ready to Slay Your Web3 Product Demons. We are deeply entrenched in the bleeding edge of DAOs, DeFi, dApps and everything else in between. Hailing from the MetaCartel network, our team consists of a diverse group of talent with over 9000 years of combined experience. Find out more at http://raidguild.org/'
  },
  {
    q: 'What are quests ?',
    a: 'As part of this emergent storytelling adventure, Quests are narrative - based missions started by Game Masters and shaped by adventurers(like yourself). Join the fight, tell a story and you will be rewarded with booty.'
  }
];

const FAQ = () => {
  const context = useContext(AppContext);
  return (
    <Modal
      onClose={() => context.updateFaqModalStatus(false)}
      isOpen={context.faqModalStatus}
      isCentered
      scrollBehavior='inside'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>FAQs</ModalHeader>
        <ModalBody>
          <Accordion defaultIndex={[0]}>
            {faq_items.map((item, index) => {
              return (
                <AccordionItem key={index}>
                  <AccordionButton>
                    <Box flex='1' textAlign='left'>
                      {item.q}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>{item.a}</AccordionPanel>
                </AccordionItem>
              );
            })}
            <AccordionItem>
              <AccordionButton>
                <Box flex='1' textAlign='left'>
                  How do I get DAI?
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <p>
                  DAI is a stablecoin pegged to the US Dollar. First, you'll
                  need a wallet like{' '}
                  <a
                    href='https://metamask.io/'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Metamask
                  </a>{' '}
                  to manage your funds.
                </p>
                <br />
                <p>
                  Second, you'll need funds. To go from fiat currencies to the
                  Ethereum ecosystem you can use a onramp like{' '}
                  <a
                    href='https://www.sendwyre.com/'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Wyre
                  </a>{' '}
                  or{' '}
                  <a
                    href='https://ramp.network/'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Ramp
                  </a>
                  .
                </p>
                <br />
                <p>
                  {' '}
                  Lastly, you can use a decentralized exchange like{' '}
                  <a
                    href='https://app.uniswap.org/#/swap'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Uniswap
                  </a>{' '}
                  to swap your ETH for DAI.
                </p>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionButton>
                <Box flex='1' textAlign='left'>
                  How can I get in touch with RaidGuild?
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <p>
                  If you have questions about RaidGuild, the submission form or
                  our consultation process, hop into our{' '}
                  <a
                    href='https://discord.gg/Sv5avwyNPX'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    #client-arena
                  </a>{' '}
                  channel in Discord.
                </p>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              context.updateFaqModalStatus(false);
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FAQ;
