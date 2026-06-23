

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




//OKKK
// const LoginMicrosoft = () => {
//   return new Promise((resolve, reject) => {
    
//     // 🌐 Detecta automáticamente la URL del backend según el entorno
//     // Cambiar por process.env.REACT_APP_API_URL si usas Create React App
//     // const API_URL =  "http://localhost:5000"; 
//     const API_URL =  "https://appincentivos.creame.com.co"; // ✅ URL de producción
    
//     const LOGIN_URL = `${API_URL}/user/api/web`;

//     // Evitar múltiples popups
//     if (LoginMicrosoft.popup && !LoginMicrosoft.popup.closed) {
//       LoginMicrosoft.popup.focus();
//       return;
//     }

//     const popup = window.open(
//       LOGIN_URL,
//       "microsoftLogin",
//       "width=600,height=700"
//     );

//     LoginMicrosoft.popup = popup;

//     if (!popup) {
//       reject(new Error("Popup bloqueado por el navegador"));
//       return;
//     }

//     const messageHandler = (event) => {
//       // ✅ VALIDACIÓN CRÍTICA: El origen del evento debe ser exactamente la URL de tu backend
//       if (event.origin !== API_URL) return;

//       // ✅ Validar que venga del popup actual
//       if (event.source !== popup) return;

//       // ✅ Validar que la estructura de la data sea la correcta
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



// 1. Esta función interna abre el popup de forma puramente sincrónica
const abrirPopupSincronico = () => {
  // Limpieza agresiva previa
  if (LoginMicrosoft.popup && !LoginMicrosoft.popup.closed) {
    LoginMicrosoft.popup.focus();
    return LoginMicrosoft.popup;
  }

  // 🍏 TRUCO DE ORO PARA SAFARI:
  // Abrimos una ventana en blanco ("about:blank") DE INMEDIATO. 
  // Safari ve esto como una acción humana directa y la aprueba siempre.
  const popup = window.open(
    "about:blank", 
    "microsoftLogin", 
    "width=600,height=700"
  );

  LoginMicrosoft.popup = popup;
  return popup;
};

// 2. Tu función principal que envuelve el proceso
const LoginMicrosoft = () => {
  // Ejecutamos la apertura síncrona en la primera línea del hilo del click
  const popup = abrirPopupSincronico();

  return new Promise((resolve, reject) => {
    const API_URL = "https://appincentivos.creame.com.co"; // ✅ URL de producción
    const LOGIN_URL = `${API_URL}/user/api/web`;

    if (!popup) {
      reject(new Error("Popup bloqueado por el navegador. Por favor, permite los popups."));
      return;
    }

    // 🍏 AHORA LE INYECTAMOS LA URL REAL
    // Como la ventana ya está abierta y aprobada por Safari, cambiarle la URL no la bloquea
    if (popup.location.href === "about:blank" || popup.location.href === "") {
      popup.location.href = LOGIN_URL;
    }

    const messageHandler = (event) => {
      if (event.origin !== API_URL) return;
      if (event.source !== popup) return;
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
      LoginMicrosoft.popup = null;
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