import { Box, Text, Image, Tooltip } from '@chakra-ui/react';

import { useHistory } from 'react-router-dom';

const Mapper = ({ index, tokenId, image, route }) => {
  const history = useHistory();
  return (
    <Tooltip label={route !== null ? 'Click to explore' : 'Cannot explore'}>
      <Box
        key={index}
        onClick={() => {
          if (route !== null) history.push(route);
        }}
        cursor={route !== null ? 'pointer' : 'no-drop'}
      >
        <Text variant='textOne'>#{tokenId}</Text>
        <Image src={image} alt='map' w='300px' />
      </Box>
    </Tooltip>
  );
};

export default Mapper;
