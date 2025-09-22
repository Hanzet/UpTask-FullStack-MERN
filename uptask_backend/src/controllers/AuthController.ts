import { Request, Response } from "express";
import User from "../models/User";
import { hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import Token from "../models/Token";
import { AuthEmail } from "../emails/AuthEmail";
import { checkPassword } from "../utils/auth";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      // Validar si el usuario ya existe
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(409).json({ message: "El usuario ya existe" });
      }

      // Crear el usuario
      const user = new User(req.body);

      // Hash de la contraseña
      user.password = await hashPassword(password);

      // Generar token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      // Enviar el email
      AuthEmail.SendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      // Guardar el usuario y el token
      await Promise.allSettled([user.save(), token.save()]);
      res.json({
        message:
          "Cuenta creada correctamente, revisa tu email para confirmar tu cuenta",
      });
    } catch (error) {
      res.json({ message: "Error al crear la cuenta" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      // Verificar si el token es válido
      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        const error = new Error("Token no válido");
        return res.status(404).json({ message: error.message });
      }

      // Confirmar la cuenta
      const user = await User.findById(tokenExists.user);
      user.confirmed = true;

      // Guardar el usuario y eliminar el token
      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
      res.json({ message: "Cuenta confirmada correctamente" });
    } catch (error) {
      res.json({ message: "Error al confirmar la cuenta" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Verificar si el usuario existe
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("El usuario no encontrado");
        return res.status(404).json({ message: error.message });
      }

      // Verificar si la cuenta está confirmada
      if (!user.confirmed) {
        // Si no está confirmada, enviar un nuevo token
        const token = new Token();
        token.user = user.id;
        token.token = generateToken();
        await token.save();

        // Enviar el email
        AuthEmail.SendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });

        const error = new Error(
          "Tu cuenta no ha sido confirmada, hemos enviado un nuevo email de confirmación"
        );
        return res.status(401).json({ message: error.message });
      }

      // Verificar la contraseña
      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error("La contraseña es incorrecta");
        return res.status(401).json({ message: error.message });
      }

      res.json({ message: "Inicio de sesión correcto" });
    } catch (error) {
      res.json({ message: "Error al iniciar sesión" });
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Usuario existe
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "El usuario no esta registrado" });
      }

      // Usuario no está confirmado
      if (user.confirmed) {
        return res
          .status(403)
          .json({ message: "El usuario ya está confirmado" });
      }

      // Generar token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      // Enviar el email
      AuthEmail.SendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      // Guardar el usuario y el token
      await Promise.allSettled([user.save(), token.save()]);
      res.json({
        message: "Se envió un nuevo token de confirmación, revisa tu email",
      });
    } catch (error) {
      res.json({ message: "Error al crear la cuenta" });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Usuario existe
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "El usuario no esta registrado" });
      }

      // Generar token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;
      await token.save();

      // Enviar el email
      AuthEmail.SendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token,
      });
      res.json({
        message: "Revisa tu email para las instrucciones de restablecimiento de contraseña",
      });
    } catch (error) {
      res.json({ message: "Error al crear la cuenta" });
    }
  };
}
