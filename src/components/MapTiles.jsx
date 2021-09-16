import { useState } from 'react';
import { SimpleGrid, Box, Spinner } from '@chakra-ui/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory } from 'react-router-dom';

const MapTiles = ({ grids, connect, mint }) => {
  const [count, setCount] = useState({
    prev: 0,
    next: 100
  });
  const [hasMore, setHasMore] = useState(true);
  const [current, setCurrent] = useState(grids.slice(count.prev, count.next));

  const history = useHistory();

  const getMoreData = () => {
    if (current.length === grids.length) {
      setHasMore(false);
      return;
    }
    setTimeout(() => {
      setCurrent(current.concat(grids.slice(count.prev + 10, count.next + 10)));
    }, 2000);
    setCount((prevState) => ({
      prev: prevState.prev + 100,
      next: prevState.next + 100
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
        columns={15}
        gap={1}
        style={{ backdropFilter: 'blur(.5rem)' }}
      >
        {current.map((token) => (
          <Box
            key={token.id}
            bg={token.claimed ? 'red' : 'blackLight'}
            color="white"
            p={3}
            fontFamily="jetbrains"
            cursor="pointer"
            _hover={{ bg: 'black' }}
            onClick={() => tileClickHandler(token.id, token.claimed)}
          >
            #{token.id}
          </Box>
        ))}
      </SimpleGrid>
    </InfiniteScroll>
  );
};

export default MapTiles;
