import { useLocation, useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTaskById } from "@/api/TaskAPI";
import EditTaskModal from "./EdiTaskModal";

export default function EditTaskData() {
  const params = useParams(); // Nos permite obtener los parámetros de la URL
  const projectId = params.projectId!; // (!) es para decirle a TypeScript que el projectId existe
  // console.log(params);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // Nos permite obtener los parámetros de la URL
  const taskId = queryParams.get("editTask")!; // editTask es el nombre del parámetro que estamos obteniendo, ! es para decirle a TypeScript que el taskId existe
  // console.log(location.search); // // Nos permite obtener la ruta de la tarea que estamos editando (?taskId=68cb81f0d5eabf40e71303d4)
  // console.log(taskId); // editTask es el nombre del parámetro que estamos obteniendo

  const { data, isError } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskById({ projectId, taskId }),
    enabled: !!taskId, // !! es para decirle a TypeScript que el taskId existe
    retry: false, // No se reintenta la consulta si hay un error

    /* Explicación de enabled: !!taskId
    
      Por ejemplo, tenemos:
      const hola = "hola"
      -> Navegador: undefined
      const hola2 = ""
      -> Navegador: undefined
      
      Si ponemos !!hola, el navegador nos mostrará true, porque hola tiene un valor
      Si ponemos !!hola2, el navegador nos mostrará false, porque hola2 no tiene un valor
    */
  });

  if(isError) return <Navigate to="/404" />;

  if (data) return <EditTaskModal data={data} taskId={taskId} />;
}
