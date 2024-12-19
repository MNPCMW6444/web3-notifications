import { highOrderHandler } from '@the-libs/express-backend';
import { createRequire } from 'module';
import {
  pushDevice,
  sendPushNotification,
} from '@the-libs/notifications-backend';
import { sendEmail } from '@the-libs/email-backend';
const require = createRequire(import.meta.url);
const { Router } = require('express');
import { PushDevice } from '@the-libs/notifications-shared';
import { findDocs, createDoc } from '@the-libs/mongo-backend';
require('dotenv').config();

const MILIS_IN_SEC = 1000;
const SECS_IN_MIN = 60;
const MINS_IN_H = 60;

const twilio = require('twilio');

const makeCall = async (
  to,
  url = 'https://web-3-notifications-8775.twil.io/path_1',
  cb = async () => {},
  forSeconds = 15,
) => {
  const client = twilio(process.env.T_I, process.env.T_S);

  return client.calls
    .create({
      from: process.env.S, // Your Twilio phone number
      to, // Recipient's phone number
      url, // TwiML URL to control the call behavior
      timeout: forSeconds,
    })
    .then((call) => {
      console.log(call.sid);
      cb();
    })
    .catch((error) => {
      console.error('Error initiating call:', error);
    });
};

export { makeCall };

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
    const Push: any = await pushDevice();
    return { statusCode: 200, body: await findDocs(Push, Push.find()) };
  }),
);

apiRouter.post(
  '/registerDevice',
  highOrderHandler(async (req) => {
    const { subscription } = req.body;
    const Push: any = await pushDevice();
    await createDoc<PushDevice>(Push, {
      subscription,
      name:
        'device ' +
        (await findDocs<true, PushDevice>(Push, Push.find())).length,
    });
    return { statusCode: 201 };
  }),
);

const formatNumber = (num) => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${Math.round(num / 1_000)}K`;
  return num.toString();
};

// import {doOnce} from "@the-libs/redis-backend"
/*
let tellError = false;
*/
let tellErrorNew = false;
/*

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
        const devices = await findDocs<true, PushDevice>((await pushDevice()),
          ((await pushDevice()) ).find({}),
        );
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
      if (l > 200000) {
        const devices = await findDocs<true, PushDevice>((await pushDevice()),
          ((await pushDevice()) ).find({}),
        );
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

        setTimeout(() => cc(), 4 * MINS_IN_H * SECS_IN_MIN * MILIS_IN_SEC);
      } else setTimeout(() => cc(), 30 * MILIS_IN_SEC);
    })
    .catch(async (e) => {
      console.log(e);
      if (tellError) {
        tellError = false;
        const devices = await findDocs<true, PushDevice>((await pushDevice()),
          ((await pushDevice()) ).find({}),
        );
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
cc();
*/

const newDec2024 = async () => {
  const url = 'https://api-v2.pendle.finance/bff/v2/markets/all?isActive=true'; // Replace with the actual endpoint
  try {
    const response = await fetch(url);
    const data = await response.json();

    const marketData = data;

    return marketData.results.find(
      ({ address }) => address === '0xcdd26eb5eb2ce0f203a84553853667ae69ca29ce',
    ).extendedInfo.syCurrentSupply;
  } catch (error) {
    console.error('Error fetching sUSDe data:', error);
  }
};

const newcc = () =>
  newDec2024()
    .then(async (number) => {
      const available = 1_000_000_000 - number;

      console.log(`Available sUSDe is ${formatNumber(available)}`);
      console.log('Is availability > 200K?', available > 200_000);

      if (!tellErrorNew) {
        tellErrorNew = true;
        const devices = await findDocs<true, PushDevice>(
          await pushDevice(),
          (await pushDevice()).find({}),
        );
        devices.forEach(({ subscription }) =>
          sendPushNotification(
            subscription,
            {
              title: 'Pendle is working again',
              body: `Available sUSDe is ${formatNumber(available)}, and the bot is now checking every 30 seconds again`,
            },
            {
              domain: '',
            },
          ),
        );
        await sendEmail(
          'benji5337831@gmail.com',
          'Pendle is working again',
          `Available sUSDe is ${formatNumber(available)}, and the bot is now checking every 30 seconds again`,
        );
        await sendEmail(
          'mnpcmw6444@gmail.com',
          'Pendle is working again',
          `Available sUSDe is ${formatNumber(available)}, and the bot is now checking every 30 seconds again`,
        );
      }

      if (available > 200_000) {
        const devices = await findDocs<true, PushDevice>(
          await pushDevice(),
          (await pushDevice()).find({}),
        );
        devices.forEach(({ subscription }) =>
          sendPushNotification(
            subscription,
            {
              title: 'Available sUSDe in Pendle',
              body: `It is ${formatNumber(available)} now`,
            },
            {
              domain: '',
            },
          ),
        );
        await sendEmail(
          'benji5337831@gmail.com',
          'Available sUSDe in Pendle',
          `It is ${formatNumber(available)} now`,
        );
        /* await sendEmail(
          'mnpcmw6444@gmail.com',
          'Available sUSDe in Pendle',
          `It is ${formatNumber(available)} now`,
        );*/
        try {
          makeCall('+12673996344');
        } catch (error) {
          console.log(error);
        }
        setTimeout(() => newcc(), 5 * SECS_IN_MIN * MILIS_IN_SEC);
      } else setTimeout(() => newcc(), 20 * MILIS_IN_SEC);
    })
    .catch(async (e) => {
      console.log(e);
      if (tellErrorNew) {
        tellErrorNew = false;
        const devices = await findDocs<true, PushDevice>(
          await pushDevice(),
          (await pushDevice()).find({}),
        );
        devices.forEach(({ subscription }) =>
          sendPushNotification(
            subscription,
            {
              title: 'Pendle stopped responding',
              body: 'Error',
            },
            {
              domain: '',
            },
          ),
        );
        await sendEmail(
          'benji5337831@gmail.com',
          'Pendle stopped responding',
          'Error',
        );
        await sendEmail(
          'mnpcmw6444@gmail.com',
          'Pendle stopped responding',
          'Error',
        );
      }
    });

newcc();
makeCall('+972528971871');
makeCall('+12673996344');
