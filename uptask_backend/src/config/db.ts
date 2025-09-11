import mongoose from "mongoose";
import colors from "colors";
import { exit } from "process";

export const connectDB = async () => {
    try {
        const {connection} = await mongoose.connect(process.env.DATABASE_URL || "");
        const url = `${connection.host}:${connection.port}`;
        console.log(colors.bgMagenta.bold(`MongoDB conectado: ${url}`));
    } catch (error) {
        console.log(colors.bgRed.bold(`Error al conectar a MongoDB: ${error}`));
        // process.exit(1); // 0 Sería que el proceso se ejecuto correctamente, 1 Sería que el proceso fallo
        exit(1);
    }
};