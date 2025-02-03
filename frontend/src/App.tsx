import { useRef, useState, useEffect, MouseEventHandler } from 'react';
import { Card, Grid2 as Grid, hexToRgb } from '@mui/material';
import { ColorChangeHandler, ChromePicker } from 'react-color';

import { GenericError, InboundMessage, Point, MultiUserPointCollection, OutboundMessage } from './types';
import config from './config';
import { useSnackbar } from 'notistack';

const App = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>();
  const ws = useRef<WebSocket | null>();
  const { enqueueSnackbar } = useSnackbar();

  const [color, setColor] = useState<string>('rgb(255,0,0)');
  const [paint, setPaint] = useState(false);
  const [pts, setPts] = useState<MultiUserPointCollection>({});

  const addPt = (pts: MultiUserPointCollection, id: string, pt: Point) => {
    let _pts: Point[];

    if (pts[id]) {
      _pts = [...pts[id], pt];
    } else {
      _pts = [pt];
    }

    return { ...pts, [id]: _pts };
  };

  useEffect(() => {
    if (ref.current) {
      const c = ref.current;
      setContext(c.getContext('2d'));
    }

    ws.current = new WebSocket(config.url);

    ws.current.onmessage = (e) => {
      try {
        const decoded = JSON.parse(e.data);

        if ((decoded as GenericError)?.error) {
          throw new Error(decoded.error.message);
        }

        const { type, source, payload } = decoded as InboundMessage;

        switch (type) {
          case 'POINT_ADDED':
            if (payload) {
              setPts((pts) => addPt(pts, source, payload));
            }
            break;

          case 'CLIENT_CONNECTED':
            enqueueSnackbar(`Client ${source} joined`, { variant: 'info' });
            break;

          case 'CLIENT_DISCONNECTED':
            enqueueSnackbar(`Client ${source} left`, { variant: 'info' });
            break;
        }
      } catch (e) {
        if (e instanceof Error) {
          enqueueSnackbar(e.message, { variant: 'error' });
        } else {
          console.error(e);
        }
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [enqueueSnackbar]);

  useEffect(() => {
    if (!context) {
      return;
    }

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    for (const id in pts) {
      const _pts = pts[id];

      for (let i = 0; i < _pts.length; i++) {
        context.beginPath();

        if (_pts[i].drag) {
          context.moveTo(_pts[i - 1].x, _pts[i - 1].y);
        } else {
          context.moveTo(_pts[i].x + 1, _pts[i].y + 1);
        }

        context.lineTo(_pts[i].x, _pts[i].y);
        context.closePath();
        context.lineWidth = 2;
        context.strokeStyle = _pts[i].color;
        context.stroke();
      }
    }
  }, [context, pts]);

  const handleColor: ColorChangeHandler = (color) => setColor(hexToRgb(color.hex));

  const addPoint = (x: number, y: number, drag: boolean) => {
    if (ws.current) {
      ws.current.send(JSON.stringify({ type: 'ADD_POINT', payload: { x, y, drag, color } } as OutboundMessage));
    }
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
            width='960'
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
