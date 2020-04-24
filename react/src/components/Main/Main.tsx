import React from 'react';
import Flex from '../Flex/Flex';
import { Box } from '@material-ui/core';
import PendulumWrapperContainer from './Pendulum/PendulumWrapperContainer';

const Main = () => (
  <Flex>
    <Flex flex={'none'} flexDirection={'column'}>
      <Box component="header">
        <h2>Double Pendulum</h2>
      </Box>
      <PendulumWrapperContainer />
      <article>
        <section>
          <p style={{textAlign: 'center'}}>This is my double pendulum</p>
          <p style={{textAlign: 'center'}}>Feel free to mess around with the values</p>
        </section>
      </article>
    </Flex>
  </Flex>
);

export default Main;