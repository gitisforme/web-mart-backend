import { Router } from 'express';
import { validate } from 'express-validation';

import { authenticate, handleError } from '../middleware';
import { deleteUserAddress, getUserAddresses, addUserAddress, updateUserAddress } from '../controller/address';

const router = Router();

const getAddresses = (): Router => router.get('/get_user_address', authenticate, handleError(getUserAddresses()));
const addAddress = (): Router => router.post('/add_address', authenticate, handleError(addUserAddress()));
const updateAddress = (): Router => router.put('/update_address', authenticate, handleError(updateUserAddress()));
const deleteAddress = (): Router => router.delete('/delete_address', authenticate, handleError(deleteUserAddress()));

export default (): Router =>
    router.use([
        getAddresses(),
        addAddress(),
        updateAddress(),
        deleteAddress()
    ]);
