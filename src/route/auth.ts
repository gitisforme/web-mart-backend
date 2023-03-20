import { Router } from 'express';
import { validate } from 'express-validation';

import { handleError } from '../middleware';
import {
  signupValidation,
  signUp,
  loginValidation,
  login,
  refreshTokenValidation,
  refreshToken,
} from '../controller/auth';

const router = Router();

const signup = (): Router =>
  router.post(
    '/signup',
    validate(signupValidation, { context: true }),
    handleError(signUp()),
  );

const signin = (): Router =>
  router.post(
    '/signin',
    validate(loginValidation, { context: true }),
    handleError(login()),
  );

const refresh = (): Router =>
  router.post(
    '/refresh',
    validate(refreshTokenValidation),
    handleError(refreshToken()),
  );

export default (): Router => router.use([signup(), signin(), refresh()]);
