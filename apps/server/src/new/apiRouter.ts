/*import { highOrderHandler } from '@the-libs/base-backend';
import { createRequire } from 'module';
import {
  pushDevice,
  sendPushNotification,
} from '@the-libs/notifications-backend';
import { sendEmail } from '@the-libs/email-backend';
const require = createRequire(import.meta.url);
const { Router } = require('express');*/
/*

export const apiRouter = Router();

let tmpSWAP = 'false';
let tmpCAP = 'false';

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

const spnX = async (x:string) => {
  const devices = await pushDevice().find();
  devices.forEach(({ subscription }) =>
   {sendPushNotification(
      subscription,
      {
        title: 'new wETH cap lift',
        body: 'there is more than 2k now',
      },
      {
        domain: '',
      },
    ),
    sendEmail('benji5337831@gmail.com','new wETH cap lift' ,"there is more than 2k now");
      sendEmail('mnpcmw6444@gmail.com','new wETH cap lift' ,"there is more than 2k now")
 } );
};

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
*/
import { gql, request } from 'graphql-request';
// import {doOnce} from "@the-libs/redis-backend"

setInterval(()=> request("https://blue-api.morpho.org/graphql", gql`
  query {
    marketByUniqueKey(uniqueKey: "0x5e3e6b1e01c5708055548d82d01db741e37d03b948a7ef9f3d4b962648bcbfa7") {
      state {
        supplyAssetsUsd
        borrowAssetsUsd
        liquidityAssetsUsd
      }
    }
  }

`).then(async(x)=>{
  console.log(x)
 /* const devices = await pushDevice().find();
  devices.forEach(({ subscription }) =>
  {sendPushNotification(
    subscription,
    {
      title: 'new wETH cap lift',
      body: 'there is more than 2k now',
    },
    {
      domain: '',
    },
  ),
    sendEmail('benji5337831@gmail.com','new wETH cap lift' ,"there is more than 2k now");
    sendEmail('mnpcmw6444@gmail.com','new wETH cap lift' ,"there is more than 2k now")
  } );*/

}))

