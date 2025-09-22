import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  useLocation,
  useNavigate,
  useParams,
  Navigate,
} from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTaskById, updateStatus } from "@/api/TaskAPI";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/utils";
import { statusTranslation } from "@/locales/es";
import type { TaskStatus } from "@/types/index";

export default function TaskModalDetails() {
  const params = useParams();
  const projectId = params.projectId!; // (!) es para decirle a TypeScript que el projectId existe
  const navigate = useNavigate();
  const location = useLocation();
  //   console.log("location", location); // Me permitirá saber la ruta de la tarea que estamos viendo por ejemplo (/projects/68cb6522d5eabf40e7130374')
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewTask")!; // viewTask es el nombre del parámetro que estamos obteniendo, ! es para decirle a TypeScript que el taskId existe
  const show = taskId ? true : false; // show es para decirle a Transition que se muestre el modal

  const { data, isError, error } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskById({ projectId, taskId }),
    enabled: !!taskId, // !! es para indicar que si taskId existe, se ejecute la consulta
    retry: false, // No se reintenta la consulta si hay un error
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: updateStatus,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as TaskStatus;
    const data = {
      projectId,
      taskId,
      status
    };
    mutate(data);
    // console.log(e.target.value); // e.target.value es el valor del select, permite saber el estado actual de la tarea por consola
  };

  if (isError) {
    toast.error(error.message, { toastId: "error" });
    return <Navigate to={`/projects/${projectId}`} />;
  }

  /*
    Gracias a la validación en TaskAPI, donde el servicio tiene el type de taskSchema, automaticamente data tiene el type de taskSchema
  */

  /** Si data existe, se muestra el modal, esto es para evitar que se muestre el modal si no existe la tarea, y funcional para no utilizar (?) optional chaining **/
  if (data)
    return (
      <>
        <Transition appear show={show} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => navigate(location.pathname, { replace: true })}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/60" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                    <p className="text-sm text-slate-400">Agregada el: {formatDate(data.createdAt)}</p>
                    <p className="text-sm text-slate-400">
                      Última actualización: {formatDate(data.updatedAt)}
                    </p>
                    <Dialog.Title
                      as="h3"
                      className="font-black text-4xl text-slate-600 my-5"
                    >
                      {data.name}
                    </Dialog.Title>
                    <p className="text-lg text-slate-500 mb-2">
                      Descripción: {data.description}
                    </p>
                    <div className="my-5 space-y-3">
                      <label className="font-bold">Estado Actual: </label>

                      <select
                        className="w-full p-3 bg-white border border-gray-300"
                        defaultValue={data.status}
                        onChange={handleChange}
                      >
                        {Object.entries(statusTranslation).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}

                        {/* Ejemplo en el navador
                          const statusTranslation = {
                            pending: "Pendiente",
                            onHold: "En espera",
                            inProgress: "En progreso",
                            underReview: "En revisión",
                            completed: "Completado",
                          }
                            -> undefined
                          
                            Ingresar:
                            Object.entries(statusTranslation)
                            -> [["pending", "Pendiente"], ["onHold", "En espera"], ["inProgress", "En progreso"], ["underReview", "En revisión"], ["completed", "Completado"]]
                        */}

                      </select>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    );
}
