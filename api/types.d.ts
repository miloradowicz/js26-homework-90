import { WebSocket } from 'ws';

export interface Connections {
  [id: string]: WebSocket;
}
