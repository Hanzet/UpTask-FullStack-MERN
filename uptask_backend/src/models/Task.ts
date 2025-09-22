import mongoose, { Schema, Document, Types } from "mongoose";

export const taskStatus = {
  PENDING: "pending",
  ON_HOLD: "onHold",
  IN_PROGRESS: "inProgress",
  UNDER_REVIEW: "underReview",
  COMPLETED: "completed",
} as const; // as const es para que el tipo de dato sea readonly, es decir, que no se pueda modificar

export type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus]; // keyof typeof taskStatus es para que el tipo de dato sea el mismo que el tipo de dato de taskStatus

// Interface de TypeScript
export interface ITask extends Document {
  // Hereda de Document y tiene las propiedades de ProjectType
  name: string;
  description: string;
  project: Types.ObjectId; // Types.ObjectId es el tipo de dato que se va a guardar en la base de datos
  status: TaskStatus;
}

// Schema de Mongoose (Tipo de datos que se van a guardar en la base de datos)
export const taskSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    // Una tarea puede pertenecer a un proyecto
    project: {
      type: Types.ObjectId,
      ref: "Project", // ref 'Project' viene de: const Project = mongoose.model<IProject>('Project', projectSchema); Justamente 'Project' es el nombre de la colección en la base de datos
    },
    status: {
      type: String,
      enum: Object.values(taskStatus), // Object.values(taskStatus) Es para que el tipo de dato sea el mismo que el tipo de dato de taskStatus
      default: taskStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

// Modelo de Mongoose (Modelo de datos que se van a guardar en la base de datos) Conecta al type de TypeScript con el schema de Mongoose
const Task = mongoose.model<ITask>("Task", taskSchema); // 'Task' es el nombre de la colección en la base de datos (<ITask> es para que Mongoose sepa que tipo de datos se van a guardar en la base de datos)
export default Task;
