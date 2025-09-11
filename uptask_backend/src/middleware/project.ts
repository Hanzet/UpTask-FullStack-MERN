import type { Request, Response, NextFunction } from "express";
import Project, { IProject } from "../models/Project";

// Declaramos el scope global de Express
declare global {
  namespace Express {
    // namespace Express es para declarar el scope global de Express
    interface Request {
      // interface Request es para declarar el tipo de dato de la request
      project: IProject; // project es para declarar el tipo de dato de la request
    }
  }
}

export async function projectExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      const error = new Error("Proyecto no encontrado");
      return res.status(404).json({ message: error.message });
    }
    req.project = project; // Añadimos el proyecto a la request, para que funcione, debemos declarar el scope global de Express y llamar project (IProject) como tipo de dato
    next();
  } catch (error) {
    res.status(500).json({ message: "Error al validar el proyecto" });
  }
}
