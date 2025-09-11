import type { ProjectFormData } from "types";
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
    console.log(error);
  }
}
