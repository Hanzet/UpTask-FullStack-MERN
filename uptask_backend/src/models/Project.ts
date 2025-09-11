import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { ITask } from "./Task";

// Interface de TypeScript
export interface IProject extends Document {
  // Hereda de Document y tiene las propiedades de ProjectType
  projectName: string;
  clientName: string;
  description: string;
  tasks: PopulatedDoc<ITask & Document>[];
}

// Schema de Mongoose (Tipo de datos que se van a guardar en la base de datos)
const projectSchema = new Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    // Un proyecto puede tener muchas tareas
    tasks: {
      type: [Types.ObjectId],
      ref: "Task",
    },
  },
  {
    timestamps: true,
  }
);

// Modelo de Mongoose (Modelo de datos que se van a guardar en la base de datos) Conecta al type de TypeScript con el schema de Mongoose
const Project = mongoose.model<IProject>("Project", projectSchema); // 'Project' es el nombre de la colección en la base de datos (<ProjectType> es para que Mongoose sepa que tipo de datos se van a guardar en la base de datos)
export default Project;
