import { startMongoAndExpress } from '@the-libs/base-backend';
import { apiRouter } from './new/apiRouter';

startMongoAndExpress(apiRouter, [], [], true, true)


fetch("http://aave.w3:80/").then((x)=>console.log(x)).catch((x)=>console.log(x))


