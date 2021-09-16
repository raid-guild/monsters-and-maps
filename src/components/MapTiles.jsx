import { useState } from 'react';
import { SimpleGrid, Box, Spinner, Tooltip } from '@chakra-ui/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory } from 'react-router-dom';

const MapTiles = ({ grids, connect, mint }) => {
  const [count, setCount] = useState({
    prev: 0,
    next: 1000
  });
  const [hasMore, setHasMore] = useState(true);
  const [current, setCurrent] = useState(grids.slice(count.prev, count.next));

  const history = useHistory();

  const getMoreData = () => {
    if (current.length === grids.length) {
      setHasMore(false);
      return;
    }
    setCurrent(
      current.concat(grids.slice(count.prev + 1000, count.next + 1000))
    );
    setCount((prevState) => ({
      prev: prevState.prev + 1000,
      next: prevState.next + 1000
    }));
  };

  const tileClickHandler = async (_id, _claimed) => {
    if (_claimed) {
      history.push(`/map/${_id}`);
    } else {
      await connect(_id);
      await mint();
    }
  };

  return (
    <InfiniteScroll
      dataLength={current.length}
      next={getMoreData}
      hasMore={hasMore}
      loader={<Spinner size="sm" />}
    >
      <SimpleGrid
        columns={100}
        gap={1}
        style={{ backdropFilter: 'blur(.5rem)' }}
      >
        {current.map((token) => (
          <Tooltip label={token.id} key={token.id}>
            <Box
              key={token.id}
              bg={token.claimed ? 'red' : 'greyDark'}
              h="8px"
              w="8px"
              color="white"
              fontFamily="jetbrains"
              cursor="pointer"
              _hover={{ bg: 'black' }}
              onClick={() => tileClickHandler(token.id, token.claimed)}
            ></Box>
          </Tooltip>
        ))}
      </SimpleGrid>
    </InfiniteScroll>
  );
};

export default MapTiles;
