import express from 'express';
import { Connections } from '../types';

const connections: Connections = {};

const router = express.Router();

router.ws('/paint', (ws, req) => {
  const id = crypto.randomUUID();

  ws.on('message', (msg) => {});

  ws.on('close', () => {
    delete connections[id];
  });
});

export default router;
