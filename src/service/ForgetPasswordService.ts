import { getRepository, FindConditions, In } from "typeorm";

import { MailService } from "../service/Mail";
import { BadRequestError } from "../error";
import { Users } from "../model/Users";

import config from "../config";

import { signForgetPasswordToken } from "../service/token";

interface Request {
  email?: string;
  userType: string[];
  countryCode?: string;
  mobileNumber?: string;
}

interface Response {
  message: string;
  verification: string | number;
}

class ForgetPasswordService {
  private static instance: ForgetPasswordService;

  constructor() {
    if (ForgetPasswordService.instance instanceof ForgetPasswordService) {
      return ForgetPasswordService.instance;
    }
    ForgetPasswordService.instance = this;
  }

  public async execute(request: Request): Promise<Response> {
    const { email, userType } = request;
    let verification: string | number;

    let where: FindConditions<Users> = {};
    where = { ...where, email, userType: In([...userType]) as any };

    const userRepository = getRepository(Users);
    const user = await userRepository.findOne(where);

    if (!user) {
      throw new BadRequestError("Invalid credential");
    }

    try {
      const { link } = await this.getForgetPasswordLink(user.id as string);
      verification = link;

      // TODO: when credentials available then impliment using oAuth2 Currently using testing credential.
      // TODO https://developers.google.com/oauthplayground/
      this.sendMail(user, link);
    } catch (e) {
      throw new Error("Please contact admin.");
    }

    const response: Response = {
      message: "RESETPASSWORD_SEND_SUCCESS",
      verification,
    };

    return response;
  }

  private async getForgetPasswordLink(userId: string) {
    const token = await signForgetPasswordToken(userId);
    const link = `${config.FRONTEND_BASE_URL}${config.FRONTEND_CHANGE_PASSWORD_URL}?token=${token}`;
    return { link, token };
  }

  private async sendMail(user: Users, link: string) {
    const mailService = new MailService();
    const mailBody = {
      link,
      text: "forgot_password",
      subject: "Reset Password",
      to: user.email,
      fullname: `${user.firstName}${user.lastName}`,
      email: user.email,
    };
    mailService.send(mailBody);
  }
}

export default ForgetPasswordService;
