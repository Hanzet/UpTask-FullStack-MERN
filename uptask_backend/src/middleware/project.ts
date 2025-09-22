import type { Request, Response, NextFunction } from "express";
import Project from "../models/Project";

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
