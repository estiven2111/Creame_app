

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


const LoginMicrosoft = () => {
  return new Promise((resolve, reject) => {
    const URLS = "https://appincentivos.creame.com.co/user/api/web"; // ✅ CORRECTO
    // const URLS = "http://localhost:5000/user/api/web"; // ✅ CORRECTO

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
      // if (event.origin !== "http://localhost:5000") return;
      if (event.source !== popup) return;
      if (!event.data || !event.data.token) return;

      window.removeEventListener("message", messageHandler);
      clearInterval(timer);

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