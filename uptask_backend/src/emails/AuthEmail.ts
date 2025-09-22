import { transporter } from "../config/nodemailer";

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static SendConfirmationEmail = async (user: IEmail) => {
    const info =await transporter.sendMail({
      from: "UpTask <admin@uptask.com>",
      to: user.email,
      subject: "UpTask - Confirmación de cuenta",
      text: "Confirmación de cuenta",
      html: `<p>Hola ${user.name}, bienvenido a UpTask</p>
      <p>Para confirmar tu cuenta, haz click en el siguiente enlace: <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a></p>
      <p>E ingresa el siguiente código: ${user.token}</p>
      <p>Este token expirará en 10 minutos.</p>
      <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
      <p>Saludos,</p>
      <p>UpTask</p>
      `,
    });

    console.log('Mensaje enviado: ', info.messageId);
  };

    static SendPasswordResetToken = async (user: IEmail) => {
    const info =await transporter.sendMail({
      from: "UpTask <admin@uptask.com>",
      to: user.email,
      subject: "UpTask - Restablece tu contraseña",
      text: "Restablece tu contraseña",
      html: `<p>Hola ${user.name},</p>
      <p>Para restablecer tu contraseña, haz click en el siguiente enlace: <a href="${process.env.FRONTEND_URL}/auth/new-password">Restablecer contraseña</a></p>
      <p>Ingresa el siguiente código: ${user.token}</p>
      <p>Este token expirará en 10 minutos.</p>
      <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
      <p>Saludos,</p>
      <p>UpTask</p>
      `,
    });

    console.log('Mensaje enviado: ', info.messageId);
  };
}
