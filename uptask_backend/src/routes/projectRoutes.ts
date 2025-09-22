import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { taskExists, taskBelongsToProject } from "../middleware/task";

const router = Router();

// Ponemos sólo ('/') ya que en server.ts ya tenemos (/api/projects)

// Rutas para los proyectos

router.post(
  "/",
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es requerido"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es requerido"),
  body("description").notEmpty().withMessage("La descripción es requerida"),
  handleInputErrors, // Middleware para manejar errores de validación
  ProjectController.createProject
);

router.get("/", ProjectController.getAllProjects);

router.get(
  "/:id",
  param("id").isMongoId().withMessage("El ID no es válido"),
  handleInputErrors, // Middleware para manejar errores de validación
  ProjectController.getProjectById
);

router.put(
  "/:id",
  param("id").isMongoId().withMessage("El ID no es válido"),
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es requerido"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es requerido"),
  body("description").notEmpty().withMessage("La descripción es requerida"),
  handleInputErrors, // Middleware para manejar errores de validación
  ProjectController.updateProject
);

router.delete(
  "/:id",
  param("id").isMongoId().withMessage("El ID no es válido"),
  handleInputErrors, // Middleware para manejar errores de validación
  ProjectController.deleteProject
);

// Rutas para las tareas
// Ejemplo de ruta: http://localhost:4000/api/projects/68afac477175061ede6ffb08/tasks

router.param("projectId", projectExists); // Nos permite validar el proyecto antes de ejecutar el controlador, es una forma más sencilla de hacerlo sin necesidad de repetir el middleware en cada ruta

router.post(
  "/:projectId/tasks",
  // validateProjectExists, // Middleware para validar si el proyecto existe
  body("name").notEmpty().withMessage("El nombre de la tarea es requerido"),
  body("description")
    .notEmpty()
    .withMessage("La descripción de la tarea es requerida"),
  handleInputErrors, // Middleware para manejar errores de validación
  TaskController.createTask
);

router.get(
  "/:projectId/tasks",
  // validateProjectExists, // Middleware para validar si el proyecto existe
  TaskController.getProjectTasks
);

router.param("taskId", taskExists); // Primero validar que la tarea existe
router.param("taskId", taskBelongsToProject); // Luego validar que pertenece al proyecto

router.get(
  "/:projectId/tasks/:taskId",
  // validateProjectExists, // Middleware para validar si el proyecto existe
  param("taskId").isMongoId().withMessage("ID no válido"),
  handleInputErrors, // Middleware para manejar errores de validación
  TaskController.getTaskById
);

router.put(
  "/:projectId/tasks/:taskId",
  // validateProjectExists, // Middleware para validar si el proyecto existe
  param("taskId").isMongoId().withMessage("ID no válido"),
  body("name").notEmpty().withMessage("El nombre de la tarea es requerido"),
  body("description")
    .notEmpty()
    .withMessage("La descripción de la tarea es requerida"),
  handleInputErrors, // Middleware para manejar errores de validación
  TaskController.updateTask
);

router.delete(
  "/:projectId/tasks/:taskId",
  // validateProjectExists, // Middleware para validar si el proyecto existe
  param("taskId").isMongoId().withMessage("ID no válido"),
  handleInputErrors, // Middleware para manejar errores de validación
  TaskController.deleteTask
);

router.post(
  "/:projectId/tasks/:taskId/status",
  param("taskId").isMongoId().withMessage("ID no válido"),
  body("status").notEmpty().withMessage("El estado de la tarea es requerido"),
  handleInputErrors, // Middleware para manejar errores de validación
  TaskController.updateStatus
);

export default router;
