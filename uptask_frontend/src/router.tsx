import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import DashboardView from "@/views/DashboardView";
import CreateProjectView from "@/views/CreateProjectView";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route element={<AppLayout />}>
            {/* index es para que este sea la página principal */}
            <Route path="/" element={<DashboardView />} index />{" "}
            <Route path="/project/create" element={<CreateProjectView />} />{" "}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
