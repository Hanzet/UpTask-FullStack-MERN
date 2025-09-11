import type { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/Task";

// Declaramos el scope global de Express
declare global {
  namespace Express {
    // namespace Express es para declarar el scope global de Express
    interface Request {
      // interface Request es para declarar el tipo de dato de la request
      task: ITask; // project es para declarar el tipo de dato de la request
    }
  }
}

export async function taskExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      const error = new Error("Tarea no encontrada");
      return res.status(404).json({ message: error.message });
    }
    req.task = task; // Añadimos la tarea a la request, para que funcione, debemos declarar el scope global de Express y llamar task (ITask) como tipo de dato
    next();
  } catch (error) {
    res.status(500).json({ message: "Error al validar la tarea" });
  }
}

export function taskBelongsToProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.task.project.toString() !== req.project.id.toString()) {
    const error = new Error("Acción no valida");
    return res.status(400).json({ message: error.message });
  }
  next();
}