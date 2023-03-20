import { Router } from 'express';

import auth from './auth';
import users from './users';
import address from './address';

const routes = Router();
routes.get('/', (req, res) => res.status(400).json({ message: 'Access not allowed' }));

routes.use('/auth', auth());
routes.use('/users', users());
routes.use('/address', address());

export default (): Router => routes;
