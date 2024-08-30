import { Router } from 'express';
import { highOrderHandler } from '@the-libs/base-backend';

export const apiRouter = Router();

apiRouter.get(
  '/event/:data',
  highOrderHandler((req) => {
    const data = req.params.data;
    console.log(data);
    return { statusCode: 200 };
  }),
);
