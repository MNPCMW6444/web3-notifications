import { startMongoAndExpress } from '@the-libs/base-backend';
import { apiRouter } from './new/apiRouter';

startMongoAndExpress(apiRouter, [], [], true, true)




