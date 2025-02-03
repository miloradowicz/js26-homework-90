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
  type: 'CONNECTION_ESTABLISHED' | 'POINT_ADDED' | 'CLIENT_CONNECTED' | 'CLIENT_DISCONNECTED';
  source?: string;
  payload?: Point | MultiUserPointCollection;
}

export interface OutboundMessage {
  type: 'ADD_POINT';
  payload: Point;
}

export interface GenericError {
  error: {
    type: 'SYNTAX_ERROR';
    message: string;
  };
}
