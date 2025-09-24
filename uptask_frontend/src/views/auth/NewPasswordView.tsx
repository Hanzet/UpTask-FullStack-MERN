import { useState } from "react";
import NewPasswordToken from "@/components/auth/NewPasswordToken";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import type { ConfirmToken } from "@/types/index";

export default function NewPasswordView() {
  // Token para validar si el token es válido
  const [token, setToken] = useState<ConfirmToken["token"]>("");

  /** Validar si el token es válido, si el token es false por defecto, se muestra el componente NewPasswordToken, si el token es true, se muestra el componente NewPasswordForm **/
  const [isValidToken, setIsValidToken] = useState(false);

  return (
    <>
      <h1 className="text-5xl font-black text-white">
        Reestablecer Contraseña
      </h1>
      <p className="text-2xl font-light text-white mt-5">
        Ingresa el código que recibiste {""}
        <span className=" text-cyan-500 font-bold"> por e-mail</span>
      </p>

      {/** Si el token es false, se muestra el componente NewPasswordToken, si el token es true, se muestra el componente NewPasswordForm **/}
      {!isValidToken ? <NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken} /> : <NewPasswordForm />}
    </>
  );
}
