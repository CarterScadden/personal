import React from 'react';
import Flex from '../Flex/Flex';
import { Button, Box } from '@material-ui/core';


function Main() {
  const add = (a:number, b:number) => a + b;

  const [count, setCount] = React.useState(0);
  function incrementCountBy1() {
    setCount(add(count, 1))
  }

  return (
    <Flex>
      <Flex flex={'none'} flexDirection={'column'}>
        <Button onClick={() => incrementCountBy1()}>Increment 'Count' by 1</Button>
        <Box component="span">{count}</Box>
      </Flex>
    </Flex>
  );
}

export default Main;