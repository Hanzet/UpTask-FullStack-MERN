import { Request, Response } from "express";
import Project from "../models/Project";

// La idea es usar clases para crear los controladores

// Utilizamos métodos estáticos para crear los controladores, ya que no necesitamos crear una instancia de la clase

export class ProjectController {
  static async createProject(req: Request, res: Response) {
    try {
      const { projectName, clientName, description } = req.body;
      const project = await Project.create({
        projectName,
        clientName,
        description,
      });
      res.json(project);
    } catch (error) {
      console.error("Error al crear proyecto:", error);
      res.status(500).json({
        error: "Error interno del servidor al crear el proyecto",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  static async getAllProjects(req: Request, res: Response) {
    try {
      const projects = await Project.find({});
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los proyectos" });
    }
  }

  static async getProjectById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const project = await Project.findById(id).populate("tasks"); // Buscamos el proyecto por su id y poblamos las tareas, es decir, nos traemos las tareas completas
      if (!project) {
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({ message: error.message });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el proyecto" });
    }
  }

  static async updateProject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const project = await Project.findById(id);
      if (!project) {
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({ message: error.message });
      }
      project.clientName = req.body.clientName;
      project.projectName = req.body.projectName;
      project.description = req.body.description;
      await project.save();
      res.json({ message: "Proyecto actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el proyecto" });
    }
  }

  static async deleteProject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const project = await Project.findById(id);
      if (!project) {
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({ message: error.message });
      }
      await project.deleteOne();
      res.json({ message: "Proyecto eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el proyecto" });
    }
  }
}
