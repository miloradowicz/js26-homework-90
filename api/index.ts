import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';

import { Connections, GenericError, InboundMessage, MultiUserPointCollection, OutboundMessage } from './types';
import config from './config';

const app = express();
expressWs(app);

const pts: MultiUserPointCollection = {};

const connections: Connections = {};

const router = express.Router();

router.ws('/paint', (ws) => {
  const id = crypto.randomUUID();
  connections[id] = ws;

  ws.send(
    JSON.stringify({
      type: 'CONNECTION_ESTABLISHED',
      payload: pts,
    } as OutboundMessage)
  );

  for (const connId in connections) {
    if (connId === id) {
      continue;
    }

    const conn = connections[connId];

    conn.send(
      JSON.stringify({
        type: 'CLIENT_CONNECTED',
        source: id,
      } as OutboundMessage)
    );
  }

  ws.on('message', (msg) => {
    try {
      const decoded = JSON.parse(msg.toString()) as InboundMessage;

      switch (decoded.type) {
        case 'ADD_POINT':
          if (!pts[id]) {
            pts[id] = [];
          }

          pts[id].push(decoded.payload);

          for (const connId in connections) {
            const conn = connections[connId];

            conn.send(
              JSON.stringify({
                type: 'POINT_ADDED',
                source: id,
                payload: decoded.payload,
              } as OutboundMessage)
            );
          }
          break;
      }
    } catch (e) {
      if (e instanceof SyntaxError) {
        ws.send(
          JSON.stringify({
            error: {
              type: 'SYNTAX_ERROR',
              message: 'Could not parse message',
            },
          } as GenericError)
        );
        console.error(e);
      }
    }
  });

  ws.on('close', () => {
    delete connections[id];

    for (const connId in connections) {
      const conn = connections[connId];

      conn.send(
        JSON.stringify({
          type: 'CLIENT_DISCONNECTED',
          source: id,
        } as OutboundMessage)
      );
    }
  });
});

app.use(cors());
app.use(router);

(async () => {
  app.listen(config.express.port, () => {
    console.log(`Server ready on port http://localhost:${config.express.port}`);
  });
})().catch(console.error);
