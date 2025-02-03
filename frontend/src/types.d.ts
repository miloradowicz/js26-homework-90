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
  type: 'NEW_POINT';
  source: string;
  payload: Point;
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
