import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Flex, Heading, Text, Button } from '@chakra-ui/react';
import styled from '@emotion/styled';
import web3 from 'web3';

import { theme } from '../theme/index';

import { AppContext } from '../context/AppContext';

import FAQ from '../components/Faq';

const StyledInput = styled.input`
  max-width: 350px;
	width: 100%;
  height: 50px;
  outline: none;
  color: white;
  font-family: ${theme.fonts.spaceMono};
  font-size: 1rem;
  border-radius: 3px;
  background-color: ${theme.colors.blackLighter};
  padding: 10px;
  &::placeholder {
    color: #ff3864;
    opacity: 1;
  }
`;

const StyledFlex = styled(Flex)`
  gap: 1rem;
`

const Main = () => {
  const context = useContext(AppContext);
  const history = useHistory();

  const [addressInput, setAddressInput] = useState('');

  const connectAndRedirect = async (context) => {
    if (web3.utils.isAddress(addressInput)) {
      context.setTrackableAddress(addressInput);
      history.push('/dashboard');
    } else {
      let account = await context.connectWallet();
      if (account) {
        history.push('/dashboard');
      }
    }
  };

  return (
    <Flex direction='column'>
      <Heading variant='headingOne' p='1rem'>
        I see your interest is piqued, curious traveller..
      </Heading>
      <Text variant='textOne' p='1rem'>
        Ever since monsters and maps started appearing across the horizon, there
        have been murmurs in the crowd - what's the meaning behind all these?
        Well, We've overheard some rumours, stories and quests, in taverns and
        inns. Mint monsters and maps and dive right in.
      </Text>
			<StyledFlex direction='row' p='1rem' flexWrap="wrap">
        <StyledInput
          placeholder='Enter address (OR)'
          onChange={(e) => setAddressInput(e.target.value)}
        ></StyledInput>
        <Button
          variant='primary'
          onClick={() => connectAndRedirect(context)}
        >
          {web3.utils.isAddress(addressInput) ? 'Track' : 'Connect'}
        </Button>
        <Button
          variant='secondary'
          onClick={() => context.updateFaqModalStatus(true)}
          id='faq-button'
        >
          Read FAQ
        </Button>
        <Button
          variant='secondary'
          onClick={() => history.push('/world')}
          id='world-map-button'
        >
          View World Map
        </Button>
      </StyledFlex>
      <FAQ />
    </Flex>
  );
};

export default Main;
