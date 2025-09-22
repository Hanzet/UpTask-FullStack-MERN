import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whitelist = [process.env.FRONTEND_URL];
    if (process.argv[2] === "--api") {
      whitelist.push(undefined); // Thunderclient o postman no tienen un origen especifico, mientras que el frontend si
    }
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de CORS"));
    }
  },
};

/*
    Explicación de la regla CORS y process.argv[2]
        ¿Qué es process.argv[2]?
        process.argv es un array que contiene todos los argumentos pasados al ejecutar Node.js:
        process.argv[0]: Ruta al ejecutable de Node.js
        process.argv[1]: Ruta al script que se está ejecutando
        process.argv[2]: Primer argumento pasado al script
        process.argv[3]: Segundo argumento, etc.
    ¿Cómo funciona en tu caso?
        Mirando tu package.json, tienes estos scripts:
        Cuando ejecutas:
        npm run dev: No pasa argumentos adicionales, process.argv[2] será undefined
        npm run dev:api: Pasa --api como argumento, entonces process.argv[2] será "--api"
    ¿Por qué se agrega undefined a la whitelist?
        Cuando el servidor se ejecuta con --api, se permite el origen undefined. Esto es importante porque:
        Peticiones desde herramientas de testing: Herramientas como Postman, Insomnia, o scripts de testing no envían un header Origin, por lo que origin será undefined
        Peticiones directas: Cuando haces peticiones HTTP directas (sin navegador), no hay un origen específico
        Desarrollo y testing: Permite probar tu API sin restricciones CORS durante el desarrollo
        Comportamiento según el comando:
        Con npm run dev:
        Solo permite peticiones desde process.env.FRONTEND_URL
        Más restrictivo, ideal para desarrollo frontend
        Con npm run dev:api:
        Permite peticiones desde process.env.FRONTEND_URL
        Y también permite peticiones sin origen (undefined)
        Más flexible, ideal para testing de API con herramientas externas
        Ejemplo práctico:
        Esta configuración te da flexibilidad: puedes desarrollar normalmente con restricciones CORS estrictas, pero cuando necesites probar la API con herramientas externas, simplemente cambias al comando dev:api.
*/
