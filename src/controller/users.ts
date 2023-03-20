import { getRepository, getCustomRepository } from "typeorm";
import { Request, Response } from "express";
import { Joi } from "express-validation";

import ForgetPasswordService from "../service/ForgetPasswordService";
import UpdatePasswordService from "../service/UpdatePasswordService";
import UpdateUserData from "../service/UpdateUserData";
import { hashPassword, comparePassword } from "../service/password";
import { BadRequestError, UnauthorizedError } from "../error";
import { UsersRepository } from "../repository/Users";

import { Users } from "../model/Users";
import { WebMartUserType } from "../constants";

export const changePasswordValidation = {
  body: Joi.object({
    oldPassword: Joi.string().min(6).max(128).required(),
    newPassword: Joi.string().min(6).max(128).required(),
  }),
};
export const changePassword = () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      user,
      body: { oldPassword, newPassword },
    } = req;

    const usersRepo = getRepository(Users);
    let relations: string[] = [];

    const userWithPassword = await usersRepo.findOneOrFail(user.id, {
      select: ["id", "password", "isActive"],
      relations,
    });

    if (userWithPassword.isActive === false) {
      throw new UnauthorizedError("User is deactivated", "USER_DEACTIVATED");
    }

    const result = await comparePassword(
      oldPassword,
      userWithPassword.password
    );

    if (!result) {
      res.status(201).json({message: "Password incorrect!"});
      throw new BadRequestError("Pasword is incorrect", "PASSWORD_INCORRECT");
    }

    user.password = await hashPassword(newPassword);
    await usersRepo.save(user);

    res.status(200).json({ message: "Password successfully updated" });
  };

export const forgetPasswordValidation = {
  body: Joi.object({
    userType: Joi.array()
      .valid(...Object.values(WebMartUserType))
      .required(),
    email: Joi.string().lowercase().max(255).email().optional(),
  }),
};
export const forgetPassword = () =>
  async (req: Request, res: Response): Promise<void> => {
    const service = new ForgetPasswordService();
    const result = await service.execute(req.body);

    res.json(result);
  };

export const profile = () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      user: { id },
    } = req;

    let userInfo = await getCustomRepository(UsersRepository).findOne({
      where: { id },
    });

    userInfo = Object.assign({}, userInfo, { password: undefined });
    res.json(userInfo);
  };

export const updatePasswordValidation = {
  body: Joi.object({
    token: Joi.string().optional(),
    newPassword: Joi.string().min(6).max(128).required(),
    userType: Joi.array()
      .valid(...Object.values(WebMartUserType))
      .default(null)
      .required(),
  }).custom((value, helpers) => {
    console.log('11111111111111new Password entered: ${value.newPassword}', value.newPassword)
    return value;
  }),
};

export const updatePassword = () =>
  async (req: Request, res: Response): Promise<void> => {
    console.log("11111111111111111111111111111111111111")
    const service = new UpdatePasswordService();
    const result = await service.execute(req.body);

    res.json(result);
  };

export const verifyEmailValidation = {
  body: Joi.object({
    token: Joi.string().required(),
  }),
};
export const verifyEmail = () => async (req: Request, res: Response): Promise<void> => {
  const {
    body: { token },
  } = req;

  const userRepository = getCustomRepository(UsersRepository);
  const verificationDetails = await userRepository.findOne({
    where: { token: token },
  });

  if (!verificationDetails) {
    throw new BadRequestError('Token is invalid or expired', 'INVALID_TOKEN');
  }

  await userRepository.update(verificationDetails.id, { isEmailVerify: true });

  res.sendStatus(200);
};


export const updateUserData = () => async (req: Request, res: Response): Promise<void> => {
  console.log('*****************************************************************************************************')
  const service = new UpdateUserData();
  const result = await service.execute(req.body);
  res.json(result);
};