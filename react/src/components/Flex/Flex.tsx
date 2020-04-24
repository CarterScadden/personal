import React from 'react';
import { Box } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

const base = {
  display: 'flex',
  flex: '1',
  justifyContent: 'center',
  alignItems: 'center',
};


const Flex = (props: CSSProperties & {children: any}) => (
  <Box style={{...base, ...props}}>
    {props.children}
  </Box>
);

export default Flex;