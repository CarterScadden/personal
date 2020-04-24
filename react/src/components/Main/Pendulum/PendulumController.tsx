import React from 'react';
import Flex from '../../Flex/Flex';
import { InputLabel, Input, Button, Box } from '@material-ui/core';

interface Props {
  upperPendAngle: number
  lowerPendAngle: number
  gravity: number
  stop: boolean
  useSetUpperPendAngle: (s:string) => void
  useSetLowerPendAngle: (s:string) => void
  useSetGravity: (s:string) => void
  resetValues: () => void
  toggleStop: () => void
}

const PendulumController = (
  {
    upperPendAngle,
    lowerPendAngle,
    gravity,
    stop,
    useSetUpperPendAngle:setUpperPendAngle,
    useSetLowerPendAngle:setLowerPendAngle,
    useSetGravity:setGravity,
    resetValues,
    toggleStop,
  } : Props
) => {
  
  return (
    <Flex flexDirection={'column'}>
      <InputLabel style={{color:'#fff'}}>
        Upper Pendulum Angle:
        <Input
          style={{
            marginLeft: '0.5em'
          }}
          value={upperPendAngle}
          onInput={({target}: any) => setUpperPendAngle(target.value as string)}></Input>
      </InputLabel>

      <InputLabel style={{color:'#fff'}}>
        Lower Pendulum Angle:
        <Input
          style={{
            marginLeft: '0.5em'
          }}
          value={lowerPendAngle}
          onInput={({target}: any) => setLowerPendAngle(target.value as string)}></Input>
      </InputLabel>

      <InputLabel style={{color:'#fff'}}>
        Gravity:
        <Input
          style={{
            marginLeft: '0.5em'
          }}
          value={gravity}
          onInput={({target}: any) => setGravity(target.value as string)}></Input>
      </InputLabel>

      <Box>
        <Button onClick={() => resetValues()}>Reset</Button>
        <Button onClick={() => toggleStop()}>
          {stop ? 'Resume' : 'Stop'}
        </Button>
      </Box>
    </Flex>
  );
};

export default PendulumController;