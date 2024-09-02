import { highOrderHandler } from '@the-libs/base-backend';
import { createRequire } from 'module';
import {
  pushDevice,
  sendPushNotification,
} from '@the-libs/notifications-backend';
const require = createRequire(import.meta.url);
const { Router } = require('express');

export const apiRouter = Router();

let tmp = 'false';

const spn = async (x:string) => {
  const devices = await pushDevice().find();
  devices.forEach(({ subscription }) =>
    sendPushNotification(
      subscription,
      {
        title: 'new usdt usde update',
        body: '99900 usdt is now' +
          (x==='true' ? '' : ' not!') +
          ' more than 100025 usde',
      },
      {
        domain: '',
      },
    ),
  );
};

apiRouter.get(
  '/event/:data',
  highOrderHandler((req) => {
    const data = req.params.data;
    console.log(data);
    if (data !== tmp) {data !== 'false' &&spn(data).then();
     tmp = data;}
    return { statusCode: 200 };
  }),
);

apiRouter.get(
  '/devices',
  highOrderHandler(async () => {
    return { statusCode: 200, body: await pushDevice().find() };
  }),
);

apiRouter.post(
  '/registerDevice',
  highOrderHandler(async (req) => {
    const { subscription } = req.body;
    const newDevice = new (pushDevice())({
      subscription,
      name: 'device ' + (await pushDevice().find()).length,
    });
    await newDevice.save();
    return { statusCode: 201 };
  }),
);
