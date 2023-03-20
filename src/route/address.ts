import { Router } from 'express';
import { validate } from 'express-validation';

import { authenticate, handleError } from '../middleware';
import { getUserAddresses, addUserAddress } from '../controller/address';

const router = Router();

const getAddresses = (): Router => router.get('/get_user_address', authenticate, handleError(getUserAddresses()));
const addAddress = (): Router => router.get('/add_address', authenticate, handleError(addUserAddress()));


export default (): Router =>
    router.use([
        getAddresses(),
    ]);
