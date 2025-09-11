import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

// Middleware para manejar errores de validación
export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Si hay errores, se retorna un mensaje de error, se maneja como array porque express-validator devuelve un array de errores
    }
    next(); // Si no hay errores, se pasa al siguiente middleware
}