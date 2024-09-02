import { highOrderHandler } from '@the-libs/base-backend';
import { createRequire } from 'module';
import {
  pushDevice,
  sendPushNotification,
} from '@the-libs/notifications-backend';
import { sendEmail } from '@the-libs/email-backend';
const require = createRequire(import.meta.url);
const { Router } = require('express');

export const apiRouter = Router();

let tmp = 'false';

const spn = async (x:string) => {
  const devices = await pushDevice().find();
  devices.forEach(({ subscription }) =>
   {sendPushNotification(
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
    sendEmail('benji5337831@gmail.com','new usdt usde alert' ,"99900 to 100025 alert");
      sendEmail('mnpcmw6444@gmail.com','new usdt usde alert' ,"99900 to 100025 alert")
 } );
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
