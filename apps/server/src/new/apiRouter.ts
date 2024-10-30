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

/*let tmpSWAP = 'false';
let tmpCAP = 'false';

const spn = async (x: string) => {
  const devices = await (await pushDevice()).find();
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
  const devices = await (await pushDevice()).find();
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
};*/
/*

apiRouter.get(
  '/event/:data',
  highOrderHandler((req) => {
    const data = req.params.data;
    console.log(data);
    if (data !== tmpSWAP) {data !== 'false' &&spn(data).then();
     tmpSWAP = data;}
    return { statusCode: 200 };
  }),
);


apiRouter.get(
  '/eventX/:data',
  highOrderHandler((req) => {
    const data = req.params.data;
    console.log(data);
    if (data !== tmpCAP) {data !== 'false' &&spnX(data).then();
     tmpCAP = data;}
    return { statusCode: 200 };
  }),
);
*/

apiRouter.get(
  '/devices',
  highOrderHandler(async () => {
    return { statusCode: 200, body: await (await pushDevice()).find() };
  }),
);

apiRouter.post(
  '/registerDevice',
  highOrderHandler(async (req) => {
    const { subscription } = req.body;
    const newDevice = new (await pushDevice())({
      subscription,
      name: 'device ' + (await (await pushDevice()).find()).length,
    });
    await newDevice.save();
    return { statusCode: 201 };
  }),
);

import { gql, request } from 'graphql-request';
// import {doOnce} from "@the-libs/redis-backend"
let tellError = false;

const cc = () =>
  request(
    'https://blue-api.morpho.org/graphql',
    gql`
      query {
        marketByUniqueKey(
          uniqueKey: "0x5e3e6b1e01c5708055548d82d01db741e37d03b948a7ef9f3d4b962648bcbfa7"
        ) {
          state {
            supplyAssetsUsd
            borrowAssetsUsd
            liquidityAssetsUsd
          }
        }
      }
    `,
  )
    .then(async (x: any) => {
      console.log(x);
      const l = x.marketByUniqueKey.state.liquidityAssetsUsd;
      console.log('l is ', l);
      if (!tellError) {
        tellError = true;
        const devices = await (await pushDevice()).find();
        devices.forEach(({ subscription }) =>
          sendPushNotification(
            subscription,
            {
              title: 'morpho is working again',
              body:
                'Available Liquidity is ' +
                l +
                ', and the bot is now checking every 30 seconds again',
            },
            {
              domain: '',
            },
          ),
        );
        await sendEmail(
          'benji5337831@gmail.com',
          'morpho is working again',
          'Available Liquidity is ' +
            l +
            ', and the bot is now checking every 30 seconds again',
        );
        await sendEmail(
          'mnpcmw6444@gmail.com',
          'morpho is working again',
          'Available Liquidity is ' +
            l +
            ', and the bot is now checking every 30 seconds again',
        );
      }
      if (l > 500000) {
        const devices = await (await pushDevice()).find();
        devices.forEach(({ subscription }) =>
          sendPushNotification(
            subscription,
            {
              title: 'Available Liquidity in morpho',
              body: 'its is ' + l + ' now',
            },
            {
              domain: '',
            },
          ),
        );
        await sendEmail(
          'benji5337831@gmail.com',
          'Available Liquidity in morpho',
          'its is ' + l + ' now',
        );
        await sendEmail(
          'mnpcmw6444@gmail.com',
          'Available Liquidity in morpho',
          'its is ' + l + ' now',
        );
        setTimeout(() => cc(), 300000);
      } else setTimeout(() => cc(), 30000);
    })
    .catch(async (e) => {
      console.log(e)
      if (tellError) {
        tellError = false;
        const devices = await (await pushDevice()).find();
        devices.forEach(({ subscription }) =>
          sendPushNotification(
            subscription,
            {
              title: 'morpho stopped responding',
              body: 'error',
            },
            {
              domain: '',
            },
          ),
        );
        await sendEmail(
          'benji5337831@gmail.com',
          'morpho stopped responding',
          'error',
        );
        await sendEmail(
          'mnpcmw6444@gmail.com',
          'morpho stopped responding',
          'error',
        );
      }
    });
cc()
