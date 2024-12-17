import { createRequire } from 'module';
import {
  pushDevice,
  sendPushNotification,
} from '@the-libs/notifications-backend';
import { sendEmail } from '@the-libs/email-backend';
import { createDoc, findDocs } from '@the-libs/mongo-backend';
import { makeArray } from '@the-libs/base-shared';
import { highOrderHandler } from '@the-libs/express-backend';
const require = createRequire(import.meta.url);
const { Router } = require('express');

export const legacy = Router();

legacy.use('/', legacy);

let tmpSWAP = 'false';
let tmpCAP = 'false';

const spn = async (x: string) => {
  const devices = makeArray(await findDocs(await pushDevice(), (await pushDevice()).find({})));
  devices.forEach(({ subscription }) => {
    sendPushNotification(
      subscription,
      {
        title: 'new usdt usde update',
        body:
          '99900 usdt is now' +
          (x === 'true' ? '' : ' not!') +
          ' more than 100025 usde',
      },
      {
        domain: '',
      },
    ),
      sendEmail(
        'benji5337831@gmail.com',
        'new usdt usde alert',
        '99900 to 100025 alert',
      );
    sendEmail(
      'mnpcmw6444@gmail.com',
      'new usdt usde alert',
      '99900 to 100025 alert',
    );
  });
};

const spnX = async (x: string) => {
  const devices = makeArray(await findDocs(await pushDevice(), (await pushDevice()).find({})));
  devices.forEach(({ subscription }) => {
    sendPushNotification(
      subscription,
      {
        title: 'new wETH cap lift',
        body: 'there is more than 2k now',
      },
      {
        domain: '',
      },
    ),
      sendEmail(
        'benji5337831@gmail.com',
        'new wETH cap lift',
        'there is more than 2k now',
      );
    sendEmail(
      'mnpcmw6444@gmail.com',
      'new wETH cap lift',
      'there is more than 2k now',
    );
  });
};

legacy.get(
  '/event/:data',
  highOrderHandler((req) => {
    const data = req.params.data;
    console.log(data);
    if (data !== tmpSWAP) {
      data !== 'false' && spn(data).then();
      tmpSWAP = data;
    }
    return { statusCode: 200 };
  }),
);

legacy.get(
  '/eventX/:data',
  highOrderHandler((req) => {
    const data = req.params.data;
    console.log(data);
    if (data !== tmpCAP) {
      data !== 'false' && spnX(data).then();
      tmpCAP = data;
    }
    return { statusCode: 200 };
  }),
);

legacy.get(
  '/devices',
  highOrderHandler(async () => {
    return { statusCode: 200, body: makeArray(await findDocs(await pushDevice(), (await pushDevice()).find({}))) };
  }),
);

legacy.post(
  '/registerDevice',
  highOrderHandler(async (req) => {
    const { subscription } = req.body;
    const newDevice = createDoc(await pushDevice(),{
      subscription,
      name: 'device ' + (makeArray((await findDocs(await pushDevice(),(await pushDevice()).find({}))))).length,
    });
    return { statusCode: 201 };
  }),
);
