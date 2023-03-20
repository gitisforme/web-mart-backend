import { getRepository } from "typeorm";

import { WebMartUserType, Token } from "../constants";

import { Users } from "../model/Users";

import { BadRequestError, UnauthorizedError } from "../error";
import {
  ITokenBase,
  verifyToken,
  isForgetPasswordToken,
} from "../service/token";

interface Request {
  token: string,
  firstName: string,
  lastName: string,
  phoneNumbers: string
}

interface Response {
  message: string;
  result?: object
}

class UpdateUserData {
  private static instance: UpdateUserData;

  constructor() {
    if (UpdateUserData.instance instanceof UpdateUserData)
      return UpdateUserData.instance;
    UpdateUserData.instance = this;
  }

  public async execute(request: Request): Promise<Response> {
    const { token, firstName, lastName, phoneNumbers } = request;

    const userRepository = getRepository(Users);
    let user;
    let decoded: ITokenBase;
    decoded = await verifyToken(token || "", Token.ACCESS);
    console.log('**************************************************', decoded)

    user = await userRepository.findOne({
      where: { id: decoded.sub },
    });
    if (!user) {
      console.error(`user does not exist with this token : [${token}]`);
      throw new BadRequestError("User does not exist", "USER_DOES_NOT_EXIST");
    }
    let updateResult = await userRepository.update({ id: decoded.sub }, {
      firstName: firstName,
      lastName: lastName,
      mobileNumber: phoneNumbers
    });

    const response: Response = {
      message: "Usern name & mobile phone number   updated successfully",
      result: updateResult
    };

    return response;
  }
}

export default UpdateUserData;
