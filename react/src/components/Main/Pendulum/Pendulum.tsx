import React, { useEffect } from 'react';
import { ThemeContextProvider } from '../../../App';

interface Props {
  upperPendAngle: number
  lowerPendAngle: number
  setUpperPendAngle: (n:number) => void
  setLowerPendAngle: (n:number) => void
  
  gravity: number
  stop: boolean

  reset: boolean
  setResetFalse: () => void
}

const concat = (a:string, b:string) => a + b;

const rad1  = 16.666666667;
const rad2  = 16.666666667;
const mass1 = 1.6666666667;
const mass2 = 1.6666666667;

/*Pendulum component for the double pendulum
*/
function Pendulum(
  {
    upperPendAngle,
    lowerPendAngle,
    setUpperPendAngle,
    setLowerPendAngle,
    gravity:g,
    stop,
    reset,
    setResetFalse,
  }: Props
) {
  const [velocity1, setVelocity1] = React.useState(0);
  const [velocity2, setVelocity2] = React.useState(0);

  const [x1, setX1] = React.useState(0);
  const [y1, setY1] = React.useState(0);
  const [x2, setX2] = React.useState(0);
  const [y2, setY2] = React.useState(0);

  const [followPath, setFollowPath] = React.useState('');
  const [firstTime, setFirstTime] = React.useState(true);

  const draw = React.useCallback(() => {
    let acceleration1 = (
      (
        (-g * (2 * mass1 + mass2) * Math.sin(upperPendAngle)) +
        (-mass2 * g * Math.sin(upperPendAngle - 2 * lowerPendAngle)) +
        (-2 * Math.sin(upperPendAngle - lowerPendAngle) * mass2) * 
        (velocity2 * velocity2 * rad2 + velocity1 * velocity1 * rad1 * Math.cos(upperPendAngle - lowerPendAngle))
      ) /
      (rad1 * (2 * mass1 + mass2 - mass2 * Math.cos(2 * upperPendAngle - 2 * lowerPendAngle)))
    );

    let acceleration2 = (
      (
        (2 * Math.sin(upperPendAngle - lowerPendAngle)) *
        (
          (velocity1 * velocity1 * rad1 * (mass1 + mass2)) +
          (g * (mass1 + mass2) * Math.cos(upperPendAngle)) +
          (velocity2 * velocity2 * rad2 * mass2 * Math.cos(upperPendAngle - lowerPendAngle))
        )
      ) /
      (rad2 * (2 * mass1 + mass2 - mass2 * Math.cos(2 * upperPendAngle - 2 * lowerPendAngle)))
    );
  
    // Assigns x1 and y1 according to the angle of the base of the pendulum
    setX1(rad1 * Math.sin(upperPendAngle));
    setY1(rad1 * Math.cos(upperPendAngle));

    //Does the above for the second pendulum but appends it to the first one
    setX2(x1 + rad2 * Math.sin(lowerPendAngle));
    setY2(y1 + rad2 * Math.cos(lowerPendAngle));
    
    //Draw the path and change the watched variable which will cause the
    //  useEffect to run again and in turn turn run draw() again repeating the cycle
    //Its on a timeout to throttle the speed
    setTimeout(() => {
      if (firstTime) {
        setFollowPath( concat( followPath, `M${x2} ${y2}`) );
        setFirstTime(false);
      } else {
        setFollowPath( concat( followPath, ` L${x2} ${y2}`) );
      }

      if (!reset) {
        if (!stop) {

          const v1 = velocity1 + acceleration1;
          const v2 = velocity2 + acceleration2;
      
          setVelocity1(v1);
          setVelocity2(v2);

          const a1 = upperPendAngle + v1;
          const a2 = lowerPendAngle + v2;

          setUpperPendAngle(a1);
          setLowerPendAngle(a2);
        }
      }
      else {
        setVelocity1(0);
        setVelocity2(0);
        
        setFollowPath('');
        setFirstTime(true);

        setX1(0);
        setY1(0);
        setX2(0);
        setY2(0);

        setResetFalse();
        setUpperPendAngle(Math.PI / 4);
        setLowerPendAngle(Math.PI / 8);
      }
    }, 33);
    // eslint-disable-next-line
  }, [lowerPendAngle, stop]);//Done to avoid lag.

  useEffect(() => {
    draw();
    // eslint-disable-next-line
  }, [lowerPendAngle, stop]);//Done to avoid lag.

  return (
    <>
      {/* base ie starting point */}
      <circle cx="0" cy="0" r="1" />

      {/* Top half */}
      <path d={`M0 0 L${x1} ${y1}`} />
      <circle cx={x1} cy={y1} r={1} />

      {/* bottom half */}
      <path d={`M${x1} ${y1} L${x2} ${y2}`} />
      <circle cx={x2} cy={y2} r={1} />

      {/* following path */}
      <ThemeContextProvider.Consumer>
        {theme => (
          <path d={followPath} style={{
            fill: 'none',
            strokeOpacity: 0.2,
            stroke: theme.palette.secondary.main
          }}/>
        )}
      </ThemeContextProvider.Consumer>
    </>
  );
}

export default Pendulum;