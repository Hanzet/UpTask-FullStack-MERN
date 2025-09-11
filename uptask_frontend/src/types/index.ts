import { z } from "zod";

/** Projects **/

export const ProjectSchema = z.object({
    _id: z.string(),
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
});

export type Project = z.infer<typeof ProjectSchema>; // Genera Project con la estructura de ProjectSchema

// Pick: Selecciona solo los campos que se necesitan
export type ProjectFormData = Pick<Project, "projectName" | "clientName" | "description">;