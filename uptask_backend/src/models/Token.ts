import mongoose, { Schema, Document, Types } from "mongoose";

// Interface de TypeScript
export interface IToken extends Document {
    token: string;
    user: Types.ObjectId;
    createdAt: Date;
}

// Schema de Mongoose (Tipo de datos que se van a guardar en la base de datos)
const tokenSchema : Schema = new Schema({
    token: {
        type: String,
        required: true,
    },
    user: {
        type: Types.ObjectId, // Types.ObjectId es el tipo de dato que se va a guardar en la base de datos
        ref: "User", // ref 'User' viene de: const User = mongoose.model<IUser>("User", userSchema); Justamente 'User' es el nombre de la colección en la base de datos
    },
    createdAt: {
        type: Date,
        default: Date.now, // Date.now es la fecha actual
        expires: "10m", // 10m es el tiempo de expiración del token, en este caso 10 minutos
    },
});

const Token = mongoose.model<IToken>("Token", tokenSchema);
export default Token;