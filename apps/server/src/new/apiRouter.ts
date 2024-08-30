import { highOrderHandler } from '@the-libs/base-backend';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Router } = require('express');
{
}
export const apiRouter = Router();

apiRouter.get(
  '/event/:data',
  highOrderHandler((req) => {
    const data = req.params.data;
    console.log(data);
    /* if (data && !tmp) sendPushNotification();
    if (data !== tmp) tmp = data;*/
    return { statusCode: 200 };
  }),
);
