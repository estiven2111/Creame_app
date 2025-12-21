import { ThemeContext } from "../context/themeContext";
import React, { useState, useEffect, useContext } from "react";
import Tarea from "./tarea";
import axios from "axios";

const Checklist = () => {
  // const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const spinValue = React.useRef(0);
  // const [proyectos, setProyectos] = useState([]);
  const {
    finalValue,
    globalSearch,
    globalOptions,
    showOptions,
    indice,
    setindexProject,
    response,
    doc,
    proyectos,
    setAllProjects,
    finishedHandler,
  } = useContext(ThemeContext);

  // useEffect(() => {
  //   const constulta = async () => {
  //     setIsLoading(false);
  //     if (!proyectos.length) {
  //       if (localStorage.getItem("email")) {
  //         const nomproyecto = await axios.get(
  //           `/proyect/nomProyect?email=${localStorage.getItem("email")}`
  //         );
  //         setAllProjects(nomproyecto.data);
  //         setIsLoading(true);
  //       }
  //     }
  //   };
  //   constulta();
  // }, []);
  useEffect(() => {
    const constulta = async () => {
      setIsLoading(true); // ✅ empieza la carga
      try {
        if (!proyectos.length && localStorage.getItem("email")) {
          const nomproyecto = await axios.get(
            `/proyect/nomProyect?email=${localStorage.getItem("email")}`
          );
          setAllProjects(nomproyecto.data);
        }
      } catch (error) {
        console.error("Error cargando proyectos:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false); // ✅ termina la carga siempre
        }, 1000);
      }
    };

    constulta();
  }, []);

  useEffect(() => {
    if (isLoading) {
      const spinAnimation = setInterval(() => {
        spinValue.current = (spinValue.current + 1) % 360;
      }, 16);
      return () => clearInterval(spinAnimation);
    }
  }, []);

  const [numberOfLines, setNumberOfLines] = useState(true);
  const handlePress = () => {
    setNumberOfLines(!numberOfLines);
  };

  const handleSelect = async (e) => {
    await globalSearch(e.target.innerText);
    await finalValue(e.target.innerText);
    setTimeout(() => {
      globalOptions(false);
    }, 2000);
  };


  return (
    <div className="relative">
      {isLoading ? (
        // 🌀 Loader
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-90 z-50">
          <div className="loader"></div>
        </div>
      ) : (
        // ✅ Contenido principal
        <>
          {indice ? (
            <div className="pt-4">
              <p className="py-4 text-center font-bold font-Horatio text-4xl text-darkGrayCreame">
                ÍNDICE DE PROYECTOS
              </p>

              {proyectos?.length > 0 ? (
                <ol className="list-decimal">
                  {proyectos.map((proyecto, index) => (
                    <li
                      key={index}
                      className="bg-darkGrayCreame my-2 flex flex-row rounded-lg border-turquesaCreame border-2 font-Horatio"
                    >
                      <div className="flex items-center justify-center w-20 text-3xl text-turquesaCreame font-bold">
                        {index + 1}
                      </div>
                      <div className="rounded-r-lg pt-4 bg-naranjaCreame w-full">
                        <div
                          onClick={handleSelect}
                          className="cursor-pointer bg-white p-4 rounded-br-lg"
                        >
                          {proyecto}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="text-center font-Horatio text-xl mt-5">
                  <p className="text-2xl">No hay proyectos asignados</p>
                  <p className="text-2xl">
                    o ya terminaste todas tus Actividades
                  </p>
                </div>
              )}
            </div>
          ) : (
            response?.map((pro, index) => (
              <div key={index}>
                {pro.componentes.map((compo, index) => (
                  <div key={index}>
                    {compo.actividades.some(
                      (item) => item.terminada === false
                    ) ? (
                      <div className="mb-5 bg-azulCreame rounded-lg text-white border-turquesaCreame border-2 shadow-lg">
                        <div className="flex items-center m-2">
                          <p className="mr-3 text-xs sm:text-base break-normal min-w-fit font-Horatio">
                            {compo.fecha}
                          </p>
                          <p
                            onClick={handlePress}
                            className={`text-white ${
                              numberOfLines ? "truncate" : ""
                            } cursor-pointer text-xs sm:text-base no-underline font-Horatio`}
                          >
                            {compo.componente}
                          </p>
                        </div>
                        {compo.actividades.map(
                          (act, ind) =>
                            !act.terminada && (
                              <div
                                key={ind}
                                className="bg-white m-2 p-1 rounded"
                              >
                                <Tarea
                                  proyecto={pro.proyecto}
                                  skuP={pro.skuP}
                                  componente={compo.componente}
                                  nitCliente={pro.nitCliente}
                                  documentoEmpleado={doc}
                                  idNodoProyecto={pro.idNodoP}
                                  idNodoActividad={act.idNodoA}
                                  Cod_Parte={act.Codi_parteA}
                                  actividad={act.actividad}
                                  entregable={act.entregable}
                                  listaEntregable={act.nombre_entregable}
                                  finishedUpdate={finishedHandler}
                                />
                              </div>
                            )
                        )}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default Checklist;
