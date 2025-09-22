import { IProject } from "../models/Project";
import { ITask } from "../models/Task";

// Declaración global de tipos para Express
declare global {
  namespace Express {
    interface Request {
      project: IProject;
      task: ITask;
    }
  }
}

export {};
