import React from 'react';
import { Box } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

function Flex(props: CSSProperties & {children: any}) {
  const base = {
    display: 'flex',
    flex: '1',
    justifyContent: 'center',
    alignItems: 'center',
  }

  const style = Object.assign(base, props);

  
  return (
    <Box style={style}>
      {props.children}
    </Box>
  );
}

export default Flex;