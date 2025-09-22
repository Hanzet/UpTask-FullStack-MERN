import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "@/api/ProjectAPI";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import TaskList from "@/components/tasks/TaskList";
import EditTaskData from "@/components/tasks/EditTaskData";
import TaskModalDetails from "@/components/tasks/TaskModalDetails";

export default function ProjectDetailsView() {
  const navigate = useNavigate();
  const params = useParams(); // Nos permite obtener los parámetros de la URL
  const projectId = params.projectId!; // (!) es para decirle a TypeScript que el proyectoId existe

  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId),
    retry: false, // No se reintenta la consulta si hay un error
  });

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <Navigate to="/404" />;
  if (data)
    return (
      <>
        <h1 className="text-5xl font-black">{data.projectName}</h1>
        <p className="text-2xl font-light text-gray- 500 mt-5">
          {data.description}
        </p>

        <nav className="my-5 flex gap-3">
          <button
            type="button"
            className="bg-cyan-400 hover:bg-cyan-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            onClick={() => navigate(location.pathname + '?newTask=true')} // ?newTask=true es para que se agregue la tarea al proyecto
          >
            Agregar Tarea
          </button>
        </nav>

        <TaskList tasks={data.tasks} />
        <AddTaskModal />
        <EditTaskData />
        <TaskModalDetails />
      </>
    );
}
