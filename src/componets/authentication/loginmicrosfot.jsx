

// const LoginMicrosoft = () => {
//   return new Promise((resolve, reject) => {
//     const URLS = "https://appincentivos.creame.com.co/user/api/validation";

//     // Evitar múltiples popups
//     if (LoginMicrosoft.popup && !LoginMicrosoft.popup.closed) {
//       LoginMicrosoft.popup.focus();
//       return;
//     }

//     const popup = window.open(URLS, "_blank", "width=620,height=700");
//     LoginMicrosoft.popup = popup;

//     if (!popup) {
//       reject(new Error("Popup bloqueado por el navegador"));
//       return;
//     }

//     const messageHandler = (event) => {
//       if (event.origin !== "https://appincentivos.creame.com.co") return;
//       if (event.source !== popup) return;
//       if (!event.data || !event.data.token) return;

//       window.removeEventListener("message", messageHandler);
//       popup.close();
//       resolve(event.data);
//     };

//     window.addEventListener("message", messageHandler);

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


// const LoginMicrosoft = () => {
//   return new Promise((resolve, reject) => {
//     const URLS = "https://appincentivos.creame.com.co/user/api/web"; // ✅ CORRECTO
//     // const URLS = "http://localhost:5000/user/api/web"; // ✅ CORRECTO

//     if (LoginMicrosoft.popup && !LoginMicrosoft.popup.closed) {
//       LoginMicrosoft.popup.focus();
//       return;
//     }

//     const popup = window.open(URLS, "_blank", "width=620,height=700");
//     LoginMicrosoft.popup = popup;

//     if (!popup) {
//       reject(new Error("Popup bloqueado por el navegador"));
//       return;
//     }

//     const messageHandler = (event) => {
//       if (event.origin !== "https://appincentivos.creame.com.co") return;
//       // if (event.origin !== "http://localhost:5000") return;
//       if (event.source !== popup) return;
//       if (!event.data || !event.data.token) return;

//       window.removeEventListener("message", messageHandler);
//       clearInterval(timer);

//       popup.close();
//       resolve(event.data);
//     };

//     window.addEventListener("message", messageHandler);

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


// const LoginMicrosoft = () => {
//   return new Promise((resolve, reject) => {
//     const URLS = "http://localhost:5000/user/api/web"
//       // process.env.NODE_ENV === "development"
//       //   ? "http://localhost:5000/user/api/web"
//       //   : "https://appincentivos.creame.com.co/user/api/web";

//     // Evitar múltiples popups
//     if (LoginMicrosoft.popup && !LoginMicrosoft.popup.closed) {
//       LoginMicrosoft.popup.focus();
//       return;
//     }

//     const popup = window.open(
//       URLS,
//       "microsoftLogin",
//       "width=600,height=700"
//     );

//     LoginMicrosoft.popup = popup;

//     if (!popup) {
//       reject(new Error("Popup bloqueado por el navegador"));
//       return;
//     }

//     const allowedOrigins = [
//       // "https://appincentivos.creame.com.co",
//       // "https://app.creame.com.co",
//       "http://localhost:5000",
//     ];

//     const messageHandler = (event) => {
//       // ✅ Validar origen correctamente
//       if (!allowedOrigins.includes(event.origin)) return;

//       // ✅ Validar que venga del popup
//       if (event.source !== popup) return;

//       // ✅ Validar data
//       if (!event.data || !event.data.token) return;

//       cleanup();

//       resolve(event.data);
//     };

//     const cleanup = () => {
//       window.removeEventListener("message", messageHandler);
//       clearInterval(timer);

//       if (popup && !popup.closed) {
//         popup.close();
//       }
//     };

//     window.addEventListener("message", messageHandler);

//     const timer = setInterval(() => {
//       if (popup.closed) {
//         cleanup();
//         reject(new Error("Login cancelado"));
//       }
//     }, 500);
//   });
// };

// export default LoginMicrosoft;





const LoginMicrosoft = () => {
  return new Promise((resolve, reject) => {
    
    // 🌐 Detecta automáticamente la URL del backend según el entorno
    // Cambiar por process.env.REACT_APP_API_URL si usas Create React App
    // const API_URL =  "http://localhost:5000"; 
    const API_URL =  "https://appincentivos.creame.com.co"; // ✅ URL de producción
    
    const LOGIN_URL = `${API_URL}/user/api/web`;

    // Evitar múltiples popups
    if (LoginMicrosoft.popup && !LoginMicrosoft.popup.closed) {
      LoginMicrosoft.popup.focus();
      return;
    }

    const popup = window.open(
      LOGIN_URL,
      "microsoftLogin",
      "width=600,height=700"
    );

    LoginMicrosoft.popup = popup;

    if (!popup) {
      reject(new Error("Popup bloqueado por el navegador"));
      return;
    }

    const messageHandler = (event) => {
      // ✅ VALIDACIÓN CRÍTICA: El origen del evento debe ser exactamente la URL de tu backend
      if (event.origin !== API_URL) return;

      // ✅ Validar que venga del popup actual
      if (event.source !== popup) return;

      // ✅ Validar que la estructura de la data sea la correcta
      if (!event.data || !event.data.token) return;

      cleanup();
      resolve(event.data);
    };

    const cleanup = () => {
      window.removeEventListener("message", messageHandler);
      clearInterval(timer);

      if (popup && !popup.closed) {
        popup.close();
      }
    };

    window.addEventListener("message", messageHandler);

    const timer = setInterval(() => {
      if (popup.closed) {
        cleanup();
        reject(new Error("Login cancelado"));
      }
    }, 500);
  });
};

export default LoginMicrosoft;