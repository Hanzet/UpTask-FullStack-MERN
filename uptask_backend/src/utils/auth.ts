import bcrypt from "bcrypt";

// Hashea la contraseña antes de almacenarla en la base de datos
export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10); // Un salt es un valor aletatorio y único para cada usuario, el parametro son las rondas de hashing
    return await bcrypt.hash(password, salt);
}

// Compara la contraseña ingresada con el hash almacenado
export const checkPassword = async (enteredPassword: string, storedHash: string) => {
    return await bcrypt.compare(enteredPassword, storedHash);
}