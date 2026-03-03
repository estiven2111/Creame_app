// import { useDispatch } from "react-redux";
// import { loginMicrosoft } from "../redux/reducer/login.slice";
import React, { useContext } from "react";
import { ThemeContext } from "../context/themeContext";

// const LoginMicrosoft = () => {
//   // const { getTopSecret } = useContext(ThemeContext);

//   const URLS =
//     "https://syncronizabackup-production.up.railway.app/user/api/validation";

//   const popup = window.open(
//     `${URLS}`,
//     "_blank",
//     `location=none width=620 height=700 toolbar=no status=no menubar=no scrollbars=yes resizable=yes`
//   );

//   window.addEventListener("message", async (event) => {
//     if (event.origin === `https://syncronizabackup-production.up.railway.app`) {
//       if (event.data) {
//         console.log(event.data, "datos dentro de loginmicrosoft");
//         localStorage.setItem("tokenMicrosoft", event.data.accessToken)
//         // getTopSecret(event.data);
//         popup.close();
//       }
//     }
//   });
// };

// export default LoginMicrosoft;




// const LoginMicrosoft = () => {
//   return new Promise((resolve, reject) => {
//     const URLS =
//       "http://localhost:5000/user/api/validation";
//       // "https://appincentivos.creame.com.co/user/api/validation";
//       // "https://syncronizabackup-production.up.railway.app/user/api/validation";

//     const popup = window.open(
//       `${URLS}`,
//       "_blank",
//       `location=none width=620 height=700 toolbar=no status=no menubar=no scrollbars=yes resizable=yes`
//     );

//     const messageHandler = async (event) => {
//       console.log(event.origin, "origen del mensaje");
//       if (event.origin === `http://localhost:5000`) {
//       // if (event.origin === `https://appincentivos.creame.com.co`) {
//         // if (event.origin === `https://syncronizabackup-production.up.railway.app`) {
//         if (event.data) {
//           popup.close();
//           resolve(event.data); // Resuelve la promesa con los datos que recibiste
//         }
//       }
//     };

//     // Agrega el manejador de eventos
//     window.addEventListener("message", messageHandler);

//     // Si se produce un error, puedes rechazar la promesa
//     // reject(error);
//   });
// };

// export default LoginMicrosoft;


// const LoginMicrosoft = () => {
//   return new Promise((resolve, reject) => {

//     const URLS = "https://appincentivos.creame.com.co/user/api/validation";

//     const popup = window.open(
//       URLS,
//       "_blank",
//       "width=620,height=700"
//     );

//     const messageHandler = (event) => {

//       //  Validar origen
//       if (event.origin !== "https://appincentivos.creame.com.co") return;

//       //  Validar que venga del popup
//       if (event.source !== popup) return;

//       // Validar estructura del mensaje
//       if (!event.data || !event.data.token) return;

//       window.removeEventListener("message", messageHandler);
//       popup.close();

//       resolve(event.data);
//     };

//     window.addEventListener("message", messageHandler);

//     //  Manejar cierre manual del popup
//     const timer = setInterval(() => {
//       if (popup.closed) {
//         clearInterval(timer);
//         window.removeEventListener("message", messageHandler);
//         reject(new Error("Login cancelado"));
//       }
//     }, 500);
//   });
// };

// export default LoginMicrosoft;


const LoginMicrosoft = () => {
  return new Promise((resolve, reject) => {
    const URLS = "https://appincentivos.creame.com.co/user/api/validation";

    // Evitar múltiples popups
    if (LoginMicrosoft.popup && !LoginMicrosoft.popup.closed) {
      LoginMicrosoft.popup.focus();
      return;
    }

    const popup = window.open(URLS, "_blank", "width=620,height=700");
    LoginMicrosoft.popup = popup;

    if (!popup) {
      reject(new Error("Popup bloqueado por el navegador"));
      return;
    }

    const messageHandler = (event) => {
      if (event.origin !== "https://appincentivos.creame.com.co") return;
      if (event.source !== popup) return;
      if (!event.data || !event.data.token) return;

      window.removeEventListener("message", messageHandler);
      popup.close();
      resolve(event.data);
    };

    window.addEventListener("message", messageHandler);

    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        window.removeEventListener("message", messageHandler);
        reject(new Error("Login cancelado"));
      }
    }, 500);
  });
};

export default LoginMicrosoft;