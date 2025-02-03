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

export interface MultiUserPointCollection {
  [id: string]: Point[];
}

export interface InboundMessage {
  type: 'ADD_POINT';
  payload: Point;
}

export interface OutboundMessage {
  type: 'CONNECTION_ESTABLISHED' | 'POINT_ADDED' | 'CLIENT_CONNECTED' | 'CLIENT_DISCONNECTED';
  source?: string;
  payload?: Point | MultiUserPointCollection;
}

export interface GenericError {
  error: {
    type: 'SYNTAX_ERROR';
    message: string;
  };
}
