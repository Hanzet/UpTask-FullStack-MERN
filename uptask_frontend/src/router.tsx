import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import DashboardView from "@/views/DashboardView";
import CreateProjectView from "@/views/projects/CreateProjectView";
import EditProjectView from "@/views/projects/EditProjectView";
import ProjectDetailsView from "@/views/projects/ProjectDetailsView";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route element={<AppLayout />}>
            {/* index es para que este sea la página principal */}
            <Route path="/" element={<DashboardView />} index />
            <Route path="/project/create" element={<CreateProjectView />} />
            <Route path="/projects/:projectId" element={<ProjectDetailsView />} />
            <Route path="/projects/:projectId/edit" element={<EditProjectView />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
