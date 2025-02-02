import express from 'express';
import cors from 'cors';

import config from './config';
import expressWs from 'express-ws';

const app = express();
expressWs(app);

app.use(cors());

(async () => {
  app.listen(config.express.port, () => {
    console.log(`Server ready on port http://localhost:${config.express.port}`);
  });
})().catch(console.error);
