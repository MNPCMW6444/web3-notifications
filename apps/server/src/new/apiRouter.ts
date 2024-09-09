import { createRequire } from 'module';
import { legacy } from './legacy';
const require = createRequire(import.meta.url);
const { Router } = require('express');

export const apiRouter = Router();

apiRouter.use('/', legacy);
