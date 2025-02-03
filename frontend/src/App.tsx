import { useRef, useState, useEffect, MouseEventHandler } from 'react';
import { Card, Grid2 as Grid, hexToRgb } from '@mui/material';
import { ColorChangeHandler, ChromePicker } from 'react-color';

import { Coord } from './types';

const App = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>();

  const [color, setColor] = useState<string>('rgb(255,0,0)');
  const [paint, setPaint] = useState(false);
  const [coord, setCoord] = useState<Coord[]>([]);

  useEffect(() => {
    if (ref.current) {
      const c = ref.current;
      setContext(c.getContext('2d'));
    }
  }, []);

  useEffect(() => {
    if (!context) {
      return;
    }

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    for (let i = 0; i < coord.length; i++) {
      context.beginPath();

      if (coord[i].drag) {
        context.moveTo(coord[i - 1].x, coord[i - 1].y);
      } else {
        context.moveTo(coord[i].x + 1, coord[i].y + 1);
      }

      context.lineTo(coord[i].x, coord[i].y);
      context.closePath();
      context.lineWidth = 2;
      context.strokeStyle = coord[i].color;
      context.stroke();
    }
  }, [context, coord]);

  const handleColor: ColorChangeHandler = (color) => setColor(hexToRgb(color.hex));

  const addPoint = (x: number, y: number, drag: boolean) => {
    setCoord((coord) => [...coord, { x, y, drag, color }]);
  };

  const handleClick: MouseEventHandler<HTMLCanvasElement> = (e) => {
    const x = e.clientX - e.currentTarget.offsetLeft;
    const y = e.pageY - e.currentTarget.offsetTop;

    setPaint(true);
    addPoint(x, y, false);
  };

  const handleDrag: MouseEventHandler<HTMLCanvasElement> = (e) => {
    const x = e.clientX - e.currentTarget.offsetLeft;
    const y = e.pageY - e.currentTarget.offsetTop;

    if (paint) {
      addPoint(x, y, true);
    }
  };

  const handleDrop = () => {
    setPaint(false);
  };

  return (
    <>
      <Grid container direction='column-reverse' sx={{ placeContent: 'center', position: 'static' }}>
        <Grid alignSelf='end'>
          <ChromePicker color={color} onChange={handleColor} />
        </Grid>
        <Grid>
          <Card
            raised
            component='canvas'
            ref={ref}
            width='1280'
            height='720'
            onMouseDown={handleClick}
            onMouseMove={handleDrag}
            onMouseUp={handleDrop}
            onMouseLeave={handleDrop}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default App;
