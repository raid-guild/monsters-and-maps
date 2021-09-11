import { useEffect } from 'react';
import { Flex, Heading } from '@chakra-ui/react';
import { useQuery } from '@apollo/client';

import { GET_ALL_MAPS } from '../graphql/queries';

import { theme } from '../theme/index';

let grids = [];

const World = () => {
  const { loading, error, data, fetchMore } = useQuery(GET_ALL_MAPS, {
    variables: {
      first: 1000,
      skip: 0
    }
  });

  if (loading) console.log('Loading...');
  if (error) console.log(`Error! ${error.message}`);

  useEffect(() => {
    if (data) {
      let _temp = grids;
      data.maps.forEach((map) => {
        _temp.push(map.tokenId);
      });

      if (data.maps.length === 1000) {
        fetchMore({
          variables: {
            skip: data.maps.length
          }
        });
      } else {
        drawGrid(grids);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {}, []);

  const drawGrid = (_grids) => {
    let w = 4000;
    let h = 4000;
    let step = 40;
    var canvas = document.getElementById('grid');

    canvas.width = 4000;
    canvas.height = 4000;

    var ctx = canvas.getContext('2d');

    var count = 1;
    ctx.beginPath();

    for (var x = 0; x <= w; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    // set the color of the line
    ctx.strokeStyle = theme.colors.red;
    ctx.lineWidth = 1;

    // the stroke will actually paint the current path
    ctx.stroke();

    // for the sake of the example 2nd path
    ctx.beginPath();
    for (var y = 0; y <= h; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    // set the color of the line
    ctx.strokeStyle = 'rgb(20,20,20)';
    // just for fun
    ctx.lineWidth = 1;
    // for your original question - you need to stroke only once
    ctx.stroke();

    for (var y1 = 40; y1 <= h; y1 += step) {
      for (var x1 = 0; x1 <= w - 40; x1 += step) {
        ctx.fillText('' + count, x1, y1);

        if (_grids.includes(count.toString())) {
          ctx.fillStyle = theme.colors.red;
          ctx.globalAlpha = 0.5;
          ctx.fillRect(x1, y1 - step, step, step);
          ctx.globalAlpha = 1;
          ctx.fillStyle = theme.colors.red;
        }

        count++;
      }
    }
  };

  return (
    <Flex direction='column' h='100%' w='100%' p='2rem'>
      <Heading variant='headingTwo' mb='1rem'>
        The World Map
      </Heading>
      <canvas id='grid' style={{ background: 'black' }}></canvas>
    </Flex>
  );
};

export default World;
