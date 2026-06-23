import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import swal from "sweetalert";
const initialState = {
  date_login: [],
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    getLogin(state, action) {
      state.date_login = action.payload;
    },
  },
});

export const loginredux = (user, password) => {
  return async (dispatch) => {
    try {
      const response = await axios.post("/login", { user, password });
      const datos = response.data;
      dispatch(getLogin(datos));
      return datos;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
           
            if (error.response.data.message === 'Completar los campos') {
              swal({
                title: "LLENAR CAMPOS",
                text: 'Debe llenar todos los campo',
                icon: "info",
                buttons: "Aceptar",
              })
            }else if (error.response.data.message === 'Clave incorrecta') {
              swal({
                title: "CLAVE INCORRECTA",
                text: 'Porfavor verifique su clave ',
                icon: "warning",
                buttons: "Aceptar",
              })
            }else if (error.response.data.message === 'Usuario no existe en la base de datos') {
              swal({
                title: "USUARIO NO EXISTE",
                text: 'Porfavor verifique su usuario no encontramos registro',
                icon: "warning",
                buttons: "Aceptar",
              })
            }
          }
    }

  };
}


export const { getLogin } = loginSlice.actions;

export default loginSlice.reducer;
