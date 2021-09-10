import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Flex, Heading, Text, Button } from '@chakra-ui/react';

import { AppContext } from '../context/AppContext';

import FAQ from '../components/Faq';

const Main = () => {
  const context = useContext(AppContext);
  const history = useHistory();

  const connectAndRedirect = async (context) => {
    let account = await context.connectWallet();
    if (account) {
      history.push('/dashboard');
    }
  };

  return (
    <Flex direction='column'>
      <Heading variant='headingOne'>
        I see your interest is piqued, curious traveller..
      </Heading>
      <Text variant='textOne' mt='1rem'>
        Ever since monsters and maps started appearing across the horizon, there
        have been murmurs in the crowd - what's the meaning behind all these?
        Well, We've overheard some rumours, stories and quests, in taverns and
        inns. Mint monsters and maps and dive right in.
      </Text>
      <Flex direction='row' mt='2rem'>
        <Button
          variant='primary'
          mr='1rem'
          onClick={() => connectAndRedirect(context)}
        >
          Connect Account
        </Button>
        <Button
          variant='secondary'
          onClick={() => context.updateFaqModalStatus(true)}
          id='faq-button'
        >
          Read FAQ
        </Button>
      </Flex>
      <FAQ />
    </Flex>
  );
};

export default Main;
