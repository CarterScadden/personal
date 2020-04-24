import React from 'react';
import PendulumContainer from './PendulumContainer';
import PendulumController from './PendulumController';

const toNum = (s:string) => +s;

function PendulumWrapperContainer() {
  const [upperPendAngle, setUpperPendAngle] = React.useState(Math.PI / 4);
  const [lowerPendAngle, setLowerPendAngle] = React.useState(Math.PI / 8);
  const [gravity, setGravity] = React.useState(1);
  const [stop, setStop] = React.useState(false);

  //Realised react hooks does not allow this
  //const use = (cb:(n:number) => void) => (s:string) => cb(toNum(s)); 

  const useSetGravity        = (s:string) => setGravity(toNum(s));
  const useSetUpperPendAngle = (s:string) => setUpperPendAngle(toNum(s));
  const useSetLowerPendAngle = (s:string) => setLowerPendAngle(toNum(s));

  const [reset, setReset] = React.useState(false);
  const setResetFalse = () => setReset(false);

  const resetValues = () => {
    setGravity(1);


    //Turned off by a callback in Pendulum.tsx
    setReset(true);
  };

  const toggleStop = () => setStop(!stop);

  return (
    <>
      <PendulumController
        upperPendAngle={upperPendAngle}
        lowerPendAngle={lowerPendAngle}
        gravity={gravity}
        stop={stop}

        useSetGravity={useSetGravity}
        useSetLowerPendAngle={useSetLowerPendAngle}
        useSetUpperPendAngle={useSetUpperPendAngle}
        resetValues={resetValues}
        toggleStop={toggleStop}
      />

      <PendulumContainer 
        upperPendAngle={upperPendAngle}
        lowerPendAngle={lowerPendAngle}
        setUpperPendAngle={setUpperPendAngle}
        setLowerPendAngle={setLowerPendAngle}
        stop={stop}
        gravity={gravity}

        reset={reset}
        setResetFalse={setResetFalse}
      />
    </>
  );
}

export default PendulumWrapperContainer;