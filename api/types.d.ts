import { WebSocket } from 'ws';

export interface Connections {
  [id: string]: WebSocket;
}

export interface Point {
  x: number;
  y: number;
  drag: boolean;
  color: string;
}

export interface InboundMessage {
  type: 'ADD_POINT';
  payload: Point;
}

export interface OutboundMessage {
  type: 'POINT_ADDED' | 'CLIENT_CONNECTED' | 'CLIENT_DISCONNECTED';
  source: string;
  payload?: Point;
}

export interface GenericError {
  error: {
    type: 'SYNTAX_ERROR';
    message: string;
  };
}
