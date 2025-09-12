import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "@/api/ProjectAPI";
import EditProjectForm from "@/components/projects/EditProjectForm";

export default function EditProjectView() {
  const params = useParams(); // Nos permite obtener los parámetros de la URL
  const projectId = params.projectId!; // (!) es para decirle a TypeScript que el proyectoId existe

  const { data, isLoading, isError } = useQuery({
    queryKey: ["editProject", projectId],
    queryFn: () => getProjectById(projectId),
    retry: false, // No se reintenta la consulta si hay un error
  });

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <Navigate to="/404" />;
  if (data) return <EditProjectForm data={data} projectId={projectId} />;
}
