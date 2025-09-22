import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Configuración del transporte de nodemailer
const config = () => {
  return {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };
};

// Transporte de nodemailer
export const transporter = nodemailer.createTransport(config());
