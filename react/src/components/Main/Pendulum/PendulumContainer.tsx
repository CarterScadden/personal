import React from 'react';
import Pendulum from './Pendulum';
interface Props {
  gravity: number
  stop: boolean

  upperPendAngle: number
  lowerPendAngle: number
  setUpperPendAngle: (n:number) => void
  setLowerPendAngle: (n:number) => void

  reset: boolean
  setResetFalse: () => void
}

const PendulumContainer = (
  {
    upperPendAngle,
    lowerPendAngle,
    setUpperPendAngle,
    setLowerPendAngle,
    gravity,
    stop,
    
    reset,
    setResetFalse,
  }: Props
) => (
  <div style={{
    width: '300px',
    height: '300px',
    backgroundColor: 'white',
    margin: '1em',
    padding: '1em',
  }}>
    <svg
      viewBox={'-50 -50 100 100'}
      style={{
        overflow: 'visible',
        border: '1px solid black',
        strokeWidth: '1px',
        stroke: 'black',
      }}
    >
      <Pendulum 
        upperPendAngle={upperPendAngle}
        lowerPendAngle={lowerPendAngle}
        setUpperPendAngle={setUpperPendAngle}
        setLowerPendAngle={setLowerPendAngle}
        gravity={gravity}
        stop={stop}
        setResetFalse={setResetFalse}
        reset={reset}  
      />
    </svg>
  </div>
);

export default PendulumContainer;