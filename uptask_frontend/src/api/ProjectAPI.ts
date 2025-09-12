import { dashboardProjectSchema, type ProjectFormData, type Project } from "../types";
import { isAxiosError } from "axios";
import api from "@/lib/axios";

/* Explicación:
    api.post("/projects", data) es una petición POST a la ruta /projects con los datos del proyecto.
    Sólo utilizamos "/projects" gracias a que en el archivo de axios.ts, en baseURL: import.meta.env.VITE_API_URL,
    este ya tiene la ruta base de la API, que es http//localhost:4000/api que es el env.local de VITE_API_URL.
*/

export async function createProject(formData: ProjectFormData) {
  try {
    // Es {data} Destructuring porque la respuesta de axios es un objeto con mucha información, y solo nos interesa la data
    const { data } = await api.post("/projects", formData); // Ruta completa: http//localhost:4000/api/projects
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
}

export async function getProjects() {
  try {
    const { data } = await api.get("/projects");
    const response = dashboardProjectSchema.safeParse(data);
    if(response.success) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
}

export async function getProjectById(id: Project['_id']) {
  try {
    const { data } = await api.get(`/projects/${id}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
}

type projectAPIType = {
  formData: ProjectFormData;
  projectId: Project['_id'];
}

export async function updateProject({formData, projectId}: projectAPIType) {
  try {
    const { data } = await api.put<string>(`/projects/${projectId}`, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
}
