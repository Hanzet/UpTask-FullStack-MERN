import { Outlet, Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Importar los estilos de React Toastify
import NavMenu from "@/components/NavMenu";

export default function AppLayout() {
  return (
    <>
      <header className="bg-gray-800 py-5">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between items-center">
          <div className="w-64">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          <NavMenu />
        </div>
      </header>
        <section className="max-w-screen-2xl mx-auto mt-10 p-5">
          <Outlet />
        </section>
        <footer className="py-5">
          <p className="text-center">{new Date().getFullYear()} UpTask - Todos los derechos reservados - @JonaCode</p>
        </footer>
        <ToastContainer
          pauseOnHover={false}
          pauseOnFocusLoss={false}
        />
    </>
  );
}
