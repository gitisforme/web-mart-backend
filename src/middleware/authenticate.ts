import { RequestHandler } from 'express';
import { getRepository } from 'typeorm';

import { UnauthorizedError, BadRequestError } from '../error';
import { verifyToken, isAccessToken } from '../service/token';
import { getAuthCookie } from '../utils/cookie';

import { Token, WebMartUserType } from '../constants';

import { Users } from '../model/Users';

export const authenticate: RequestHandler = async (request, response, next): Promise<void> => {
  const authHeader = request.headers.authorization;
  const authCookie = getAuthCookie(request.headers.cookie as string);

  if (!authHeader && !authCookie) {
    return next(new UnauthorizedError('JWT token is missing', 'TOKEN_MISSING'));
  }

  const [, token] = (authCookie ?? authHeader ?? '').split(' ');

  try {
    const decoded = await verifyToken(token, Token.ACCESS);

    if (!isAccessToken(decoded)) {
      throw new BadRequestError('Provided token is not valid access token', 'INVALID_ACCESS_TOKEN');
    }

    const { sub } = decoded;

    const usersRepo = getRepository(Users);
    const user = await usersRepo.findOne({ where: { id: sub } });

    if (!user) {
      return next(new UnauthorizedError('User do not exist'));
    }

    request.user = user;
    return next();
  } catch (err) {
    return next(new UnauthorizedError('Invalid JWT token', 'INVALID_TOKEN'));
  }
};
