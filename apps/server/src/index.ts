import { startExpressServer } from '@the-libs/express-backend';
import { apiRouter } from './new/apiRouter';
import { goSomeWhereAndWait } from './pup';

startExpressServer(apiRouter, [], []).then(() =>
  setTimeout(() => console.log('readyyy'), 7000),
);
/*
const avveURL =
  'http://aave:80/reserve-overview/?underlyingAsset=0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee&marketName=proto_mainnet_v3';

const swapURL =
  'http://swap:80/?chain=ethereum&from=0xdac17f958d2ee523a2206206994597c13d831ec7&tab=swap&to=0x4c9edd5852cd905f086c759e8383e09bff1e68b3';

setTimeout(() => {
  console.log('60 passed');
  goSomeWhereAndWait(avveURL);

  goSomeWhereAndWait(swapURL);
}, 60000);*/
