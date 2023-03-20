import { Request, Response, CookieOptions } from "express";
import { getCustomRepository, FindConditions, In } from "typeorm";
import { Joi } from "express-validation";
import randtoken from "rand-token";

import { BadRequestError } from "../error";

import { MailService } from "../service/Mail";
import { hashPassword, comparePassword } from "../service/password";

import { UsersRepository } from "../repository/Users";
import { Users } from "../model/Users";

import { WebMartUserType, Token } from "../constants";
import config from "../config";
import { registerSuccess } from "../database/seed/htmlTemplates/register";

import {
  ITokenBase,
  isRefreshToken,
  signAccessToken,
  signRefreshToken,
  verifyToken,
} from "../service/token";

const namePattern = "^[A-za-z]";
/**
 * Signup Validation
 */
export const signupValidation = {
  body: Joi.object({
    email: Joi.string().lowercase().max(255).email().required(),
    firstName: Joi.string().max(255).regex(new RegExp(namePattern)).required(),
    lastName: Joi.string().max(255).regex(new RegExp(namePattern)).required(),
    password: Joi.string().min(6).max(128).required(),
    userType: Joi.array().items(Joi.string().valid(...Object.values(WebMartUserType)).default(null))
      .required(),
  }),
};
export const signUp = () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      body: { userType, email, password, firstName, lastName },
    } = req;

    const userRepository = getCustomRepository(UsersRepository);
    const emailToken = randtoken.uid(32);

    const whereEmail: FindConditions<Users> = { email };
    const existingUserEmail = await userRepository.findOne(whereEmail);
    if (existingUserEmail) {
      throw new BadRequestError(
        "email address already exist",
        "EMAIL_ALREADY_EXIST"
      );
    }

    const hashedPassword = await hashPassword(password);

    let user = userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType: [...userType],
      token: emailToken,
    });

    user = await userRepository.save(user);

    const link = `${config.FRONTEND_BASE_URL}${config.FRONTEND_VERIFY_EMAIL_URL}?token=${emailToken}`;

    try {
      sendMail(user, link);
    } catch (error) {
      console.error("error in mail sent");
    }

    if (user && user.password) user.password = "";

    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);

    // TODO: This may defer from token expiry
    const expiresIn = config.ACCESS_TOKEN_LIFETIME_MIN * 60;

    const cookieOptions: CookieOptions = {
      maxAge: expiresIn * 1000,
      secure: req.secure,
      httpOnly: true,
      sameSite: "strict",
    };

    res
      .cookie("token", `Bearer ${accessToken}`, cookieOptions)
      .status(200)
      .json({
        token_type: "bearer",
        access_token: accessToken,
        expires_in: expiresIn,
        refresh_token: refreshToken,
        user,
      });
  };

/**
 * Mail Service
 */
const sendMail = async (user: Users, link: string) => {
  const mailService = new MailService();
  const mailBody = {
    link,
    text: "email_verify",
    to: user.email,
    subject: "Registration Success | WebMart",
    html: (registerSuccess || '').replace(new RegExp('{link}', 'g'), link || '').replace(new RegExp('{name}', 'g'), `${user.firstName || ''}${user.lastName || ''}`),
  };
  await mailService.send(mailBody);
};

export const loginValidation = {
  body: Joi.object({
    email: Joi.string().lowercase().max(255).email().optional(),
    password: Joi.string().min(6).max(128).required(),
  }),
};
export const login = () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      body: { email, password },
    } = req;

    const userRepository = getCustomRepository(UsersRepository);
    let where: FindConditions<Users> = { email };

    const user = await userRepository.findOne(where);

    if (!user) {
      throw new BadRequestError("User not found", "USER_NOT_FOUND");
    }

    const passwordMatched = await comparePassword(password, user.password);
    if (!passwordMatched) {
      throw new BadRequestError("Password missmatch", "PASSWORD_MISSMATCH");
    }

    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);

    // TODO: This may defer from token expiry
    const expiresIn = config.ACCESS_TOKEN_LIFETIME_MIN * 60;

    const cookieOptions: CookieOptions = {
      maxAge: expiresIn * 1000,
      secure: req.secure,
      httpOnly: true,
      sameSite: "strict",
    };

    res
      .cookie("token", `Bearer ${accessToken}`, cookieOptions)
      .status(200)
      .json({
        token_type: "bearer",
        access_token: accessToken,
        expires_in: expiresIn,
        refresh_token: refreshToken,
      });
  };

/**
 * Refresh token Validation
 */
export const refreshTokenValidation = {
  body: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};
export const refreshToken = () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      body: { refreshToken },
    } = req;

    let decoded: ITokenBase;
    try {
      decoded = await verifyToken(refreshToken, Token.REFRESH);
      if (!isRefreshToken(decoded)) {
        throw new BadRequestError(
          "Provided token is not valid refresh token",
          "INVALID_REFRESH_TOKEN"
        );
      }
    } catch (error: any) {
      if (error?.name === "TokenExpiredError") {
        throw new BadRequestError(
          "Refresh token expired.",
          "REFRESH_TOKEN_EXPIRED"
        );
      }
      throw new BadRequestError(
        "Provided token is not valid refresh token",
        "INVALID_REFRESH_TOKEN"
      );
    }

    const userRepository = getCustomRepository(UsersRepository);

    const user = await userRepository.findOneOrFail(decoded.sub);

    if (!user) {
      throw new BadRequestError("Incorrect credentials.");
    }

    const accessToken = await signAccessToken(user.id);
    const newRefreshToken = await signRefreshToken(user.id);

    // TODO: This may defer from token expiry
    const expiresIn = config.ACCESS_TOKEN_LIFETIME_MIN * 60;

    const cookieOptions: CookieOptions = {
      maxAge: expiresIn * 1000,
      secure: req.secure,
      httpOnly: true,
      sameSite: "strict",
    };

    res
      .cookie("token", `Bearer ${accessToken}`, cookieOptions)
      .status(200)
      .json({
        token_type: "bearer",
        access_token: accessToken,
        expires_in: expiresIn,
        refresh_token: newRefreshToken,
      });
  };
