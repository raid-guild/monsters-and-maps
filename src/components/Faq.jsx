import { useContext } from 'react';
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

import { FAQ_ITEMS } from '../utils/constants';

const FAQ = () => {
  const context = useContext(AppContext);
  return (
    <Modal
      onClose={() => context.updateFaqModalStatus(false)}
      isOpen={context.faqModalStatus}
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontFamily="jetbrains">FAQs</ModalHeader>
        <ModalBody fontFamily="jetbrains">
          <Accordion defaultIndex={[0]}>
            <AccordionItem>
              <AccordionButton color="red">
                <Box flex="1" textAlign="left">
                  How do I mint Monsters or Monster Maps on Etherscan ?
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <p>1. Go to the Hunt & Mint tab</p>
                <br />
                <p>
                  2. Choose 'Claim'(Monsters) or 'discoverEncounters’
                  (MonsterMaps)
                </p>
                <br />
                <p>3. Choose a number between 1 - 9750 and try to claim!</p>
                <br />
                <p>4. Connect wallet</p>
                <br />
                <p>
                  5. If the gas is ridiculously high(e.g. ~$15K), then that is
                  claimed already.Try another number!
                </p>
              </AccordionPanel>
            </AccordionItem>
            {FAQ_ITEMS.map((item, index) => {
              return (
                <AccordionItem key={index}>
                  <AccordionButton color="red">
                    <Box flex="1" textAlign="left">
                      {item.q}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>{item.a}</AccordionPanel>
                </AccordionItem>
              );
            })}
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
