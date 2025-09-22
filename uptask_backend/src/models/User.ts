import mongoose, { Schema, Document } from "mongoose";

// Interface de TypeScript
export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    confirmed: boolean;
}

// Schema de Mongoose (Tipo de datos que se van a guardar en la base de datos)
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true, // Para que el email se guarde en minúsculas o mayúsculas
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    confirmed: {
        type: Boolean,
        default: false, // Para que el usuario no se pueda loguear hasta que se confirme el email
    },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;