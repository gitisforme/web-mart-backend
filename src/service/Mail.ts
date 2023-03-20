import { Options as SMTPTransportOptions } from "nodemailer/lib/smtp-transport";
import nodemailer, { SentMessageInfo } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { Auth } from "googleapis";

import config from "../config";

export interface MailBody {
  to?: string | Array<string>;  
  subject?: string;
  html?: string;
}

/**
 * https://www.npmjs.com/package/googleapis
 */
export class MailService {
  private transport: Mail | undefined;
  private static instance: MailService;

  /**
   * https://googleapis.dev/nodejs/googleapis/latest/
   * https://developers.google.com/identity/openid-connect/openid-connect
   */
  private oauth2Client = new Auth.OAuth2Client({
    clientId: config.GMAIL_CLIENT_ID,
    clientSecret: config.GMAIL_CLIENT_SECRET,
    redirectUri: "https://developers.google.com/oauthplayground",
  });

  constructor() {
    if (MailService.instance instanceof MailService) {
      return MailService.instance;
    }
    this.transport = this.createTransport();
    MailService.instance = this;
  }

  /**
   * https://nodemailer.com/about/#:~:text=SMTP%20transport%0A%20%20let-,transporter,-%3D%20nodemailer.
   */
  private async createSmtpTransport() {
    if (
      config.GMAIL_CLIENT_ID &&
      config.GMAIL_CLIENT_SECRET &&
      config.GMAIL_REFRESH_TOKEN
    ) {
      try {
        this.oauth2Client.setCredentials({
          refresh_token: config.GMAIL_REFRESH_TOKEN,
        });
        const accessToken = await this.oauth2Client.getAccessToken();

        if (accessToken && accessToken.token) {
          const options: SMTPTransportOptions = {
            service: "gmail",
            auth: {
              type: "OAuth2",
              user: config.GMAIL_USER,
              clientId: config.GMAIL_CLIENT_ID,
              clientSecret: config.GMAIL_CLIENT_SECRET,
              refreshToken: config.GMAIL_REFRESH_TOKEN,
              accessToken: accessToken.token,
            },
          };

          return nodemailer.createTransport(options);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  private createTransport() {
    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: config.GMAIL_USER,
        pass: config.GMAIL_PASSWORD,
      },
    });

    return transport;
  }

  async send({ to, subject, html }: MailBody): Promise<SentMessageInfo> {
    const transport = (await this.createSmtpTransport()) || this.transport;
    if (!transport) {
      console.log(`Transport is not present to send email.`);
      throw new Error(`Transport is not present to send email.`);
    }

    return transport.sendMail({
      from: `Webmart <${config.GMAIL_USER}>`,
      to,
      subject,
      html,
    });
  }
}
