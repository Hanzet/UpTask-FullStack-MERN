import type { Request, Response } from "express";
import Task, { taskStatus } from "../models/Task";

export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body); // Creamos una nueva tarea con los datos del body
      task.project = req.project.id; // Asignamos el id del proyecto a la tarea
      req.project.tasks.push(task.id); // Añadimos la tarea al proyecto
      // await task.save(); // Guardamos la tarea
      // await req.project.save(); // Guardamos el proyecto
      await Promise.allSettled([task.save(), req.project.save()]); // Guardamos la tarea y el proyecto de forma asíncrona
      res.json(task);
    } catch (error) {
      console.error("Error al crear la tarea:", error);
      res.status(500).json({ 
        message: "Error al crear la tarea",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  };

  static getProjectTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ project: req.project.id }).populate(
        "project"
      ); // Buscamos las tareas que pertenecen al proyecto y poblamos el proyecto, es decir, nos traemos el proyecto completo, el populate es para que nos traiga el proyecto completo
      res.json(tasks);
    } catch (error) {
      console.error("Error al obtener las tareas:", error);
      res.status(500).json({ 
        message: "Error al obtener las tareas",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  };

  static getTaskById = async (req: Request, res: Response) => {
    try {
      // Ya no es necesario validar la tarea, porque ya la validamos en el middleware
      // const { taskId } = req.params;
      // const task = await Task.findById(taskId);
      // if (!task) {
      //   const error = new Error("Tarea no encontrada");
      //   return res.status(404).json({ message: error.message });
      // }

      // Ya no es necesario validar el proyecto, porque ya la validamos en el middleware
      // if (req.task.project.toString() !== req.project.id.toString()) {
      //   const error = new Error("Acción no valida");
      //   return res.status(400).json({ message: error.message });
      // }
      res.json(req.task);
    } catch (error) {
      console.error("Error al obtener la tarea:", error);
      res.status(500).json({ 
        message: "Error al obtener la tarea",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  };

  static updateTask = async (req: Request, res: Response) => {
    try {
      // Ya no es necesario validar la tarea, porque ya la validamos en el middleware
      // const { taskId } = req.params;
      // const task = await Task.findById(taskId);
      // if (!task) {
      //   const error = new Error("Tarea no encontrada");
      //   return res.status(404).json({ message: error.message });
      // }

      // Ya no es necesario validar el proyecto, porque ya la validamos en el middleware
      // if (req.task.project.toString() !== req.project.id.toString()) {
      //   const error = new Error("Acción no valida");
      //   return res.status(400).json({ message: error.message });
      // }
      req.task.name = req.body.name;
      req.task.description = req.body.description;
      await req.task.save();
      res.json("Tarea actualizada correctamente");
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
      res.status(500).json({ 
        message: "Error al actualizar la tarea",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  };

  static deleteTask = async (req: Request, res: Response) => {
    try {
      // const { taskId } = req.params;
      // const task = await Task.findById(taskId, req.body); // No utilizo findByIdAndDelete porque sólo eliminaría la tarea, no el proyecto, mientras que con findById puedo obtener tanto la tarea como el proyecto y ahí si puedo eliminar la tarea y el proyecto
      // if (!task) {
      //   const error = new Error("Tarea no encontrada");
      //   return res.status(404).json({ message: error.message });
      // }
      req.project.tasks = req.project.tasks.filter(
        task => task!.toString() !== req.task.id.toString() // (Le puse ! para dar a entender que task es de tipo Types.ObjectId)
      ); // Eliminamos la tarea del proyecto
      // await task.deleteOne(); // Eliminamos la tarea
      // await req.project.save(); // Guardamos el proyecto
      await Promise.allSettled([req.task.deleteOne(), req.project.save()]); // Eliminamos la tarea y guardamos el proyecto
      res.json("Tarea eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
      res.status(500).json({ 
        message: "Error al eliminar la tarea",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  };

  static updateStatus = async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      
      // Validar que el estado sea válido
      const validStatuses = Object.values(taskStatus);
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          message: "Estado no válido", 
          validStatuses: validStatuses 
        });
      }
      
      req.task.status = status;
      await req.task.save();
      res.json("Estado de la tarea actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar el estado de la tarea:", error);
      res.status(500).json({ 
        message: "Error al actualizar el estado de la tarea",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  };
}
