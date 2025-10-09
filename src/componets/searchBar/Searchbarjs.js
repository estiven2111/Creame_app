import { useEffect, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../context/themeContext';

const useLlenarListas = () => {
  const {
    todosAnticipos,
    tipoTransaccion,
    proyectos,
    setAllProjects,
    proyectosGastos,
  } = useContext(ThemeContext);

  useEffect(() => {
    const consultar = async () => {
      try {
        const docEmpleado = localStorage.getItem('doc_empleado');
        const anticipo = await axios.post(`/proyect/anticipo`, { doc: docEmpleado });
        const tipoTransac = await axios.get(`/proyect/tipoTransaccion`);
        const ProyectoGastos = await axios.get(`/proyect/ProyectGastos`);

        tipoTransaccion(tipoTransac.data);
        todosAnticipos(anticipo.data);
        proyectosGastos(ProyectoGastos.data);

        if (!proyectos.length && localStorage.getItem("email")) {
          const nomproyecto = await axios.get(
            `/proyect/nomProyect?email=${localStorage.getItem("email")}`
          );
          setAllProjects(nomproyecto.data);
        }
      } catch (error) {
        console.error("Error al llenar las listas:", error);
      }
    };

    consultar();
  }, []);
};

export default useLlenarListas;
