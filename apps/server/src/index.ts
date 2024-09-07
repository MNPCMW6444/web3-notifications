import { startMongoAndExpress } from '@the-libs/base-backend';
import { apiRouter } from './new/apiRouter';
import { xxw } from './pup';

startMongoAndExpress(apiRouter, [], [], true, true);

xxw();
