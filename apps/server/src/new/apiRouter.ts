import { Router } from 'express';
import { highOrderHandler } from '@the-libs/base-backend';
import { sendPushNotification } from '@the-libs/notifications-backend';

export let tmp = false;

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
