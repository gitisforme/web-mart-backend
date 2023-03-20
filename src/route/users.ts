import { Router } from 'express';
import { validate } from 'express-validation';

import { authenticate, handleError } from '../middleware';
import {
  changePassword,
  changePasswordValidation,
  forgetPassword,
  forgetPasswordValidation,
  profile,
  updatePassword,
  updatePasswordValidation,
  verifyEmailValidation,
  verifyEmail,

  // verifyUserData,
  updateUserData,
} from '../controller/users';

const router = Router();

const patchChangePassword = (): Router =>
  router.patch(
    '/change-password',
    authenticate,
    validate(changePasswordValidation),
    handleError(changePassword()),
  );

const postForgetPassword = (): Router =>
  router.post(
    '/forget-password',
    validate(forgetPasswordValidation, { context: true }),
    handleError(forgetPassword()),
  );

const postUpdatePassword = (): Router =>
  router.post(
    '/update-password',
    validate(updatePasswordValidation, { context: true }),
    handleError(()=> {
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa");
      updatePassword();
    })
    );

const postVerifyEmail = (): Router =>
  router.post(
    '/verify-email',
    validate(verifyEmailValidation, { context: true }),
    handleError(verifyEmail()),
  );
const getProfile = (): Router => router.get('/me', authenticate, handleError(profile()));

const putUpdateUserData = (): Router =>
  router.put(
    '/profile',
    // validate(verifyUserData, { context: true }),
    handleError(updateUserData())
  )


export default (): Router =>
  router.use([
    getProfile(),
    postVerifyEmail(),
    postForgetPassword(),
    postUpdatePassword(),
    patchChangePassword(),
    putUpdateUserData()
  ]);
