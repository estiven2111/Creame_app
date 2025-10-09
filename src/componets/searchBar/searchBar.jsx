import React, { useState, useEffect, useContext, useRef } from 'react';
import { ThemeContext } from '../context/themeContext';
import axios from 'axios';
import { FaChevronDown } from 'react-icons/fa';
import { AiFillCaretDown } from "react-icons/ai";

const SearchBar = () => {
  const {
    indice,
    setindexProject,
    finishedHandler,
    finishedUpdate,
    inputValue,
    finalValue,
    searchText,
    globalSearch,
    showOptions,
    globalOptions,
    todosAnticipos,
    tipoTransaccion,
    todasLasFechas,
    setProjectData,
    response,
    setNewResponse,
    doc,
    setDocument,
    proyectos,
    setAllProjects,
    ProyectosGastosState,
    proyectosGastos,
  } = useContext(ThemeContext);

  const wrapperRef = useRef(null);
  const [filteredOptions, setFilteredOptions] = useState([]);
    

    useEffect(() => {
    const constulta = async () => {
       const docEmpleado = localStorage.getItem('doc_empleado');
       const anticipo = await axios.post(`/proyect/anticipo`, {  doc: docEmpleado });
       const tipoTransac = await axios.get(`/proyect/tipoTransaccion`);
       const ProyectoGastos = await axios.get(`/proyect/ProyectGastos`);
       tipoTransaccion(tipoTransac.data);
       todosAnticipos(anticipo.data);
       proyectosGastos(ProyectoGastos.data);
      if (!proyectos.length) {
        if (localStorage.getItem("email")) {
          const nomproyecto = await axios.get(
            `/proyect/nomProyect?email=${localStorage.getItem("email")}`
          );
          setAllProjects(nomproyecto.data);
        }
      }
    };
    constulta();
  }, []);

  useEffect(() => {
    finalValue('');
    setFilteredOptions([]);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        globalOptions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperRef]);

  const handleSearch = (text) => {
    globalSearch(text);
    globalOptions(true);

    if (text.trim() === '') {
      setFilteredOptions(['', ...proyectos]);
    } else {
      const filtered = proyectos.filter((option) =>
        option.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredOptions(['', ...filtered]);
    }
  };

  // const handleSelectOption = (option) => {
  //   if (option === '') {
  //     finalValue('');
  //     globalSearch('');
  //     setFilteredOptions(['', ...proyectos]); // Mostrar de nuevo la lista completa
  //     globalOptions(true); // Mantener lista abierta
  //   } else {
  //     globalSearch(option);
  //     finalValue(option);
  //     globalOptions(false);
  //   }
  // };
  const handleSelectOption = (option) => {
  if (option === '') {
    window.location.reload(); // 🔄 Recarga la página completamente
  } else {
    globalSearch(option);
    finalValue(option);
    globalOptions(false);
  }
};

  const handleDropdownClick = () => {
    if (!showOptions) {
      setFilteredOptions(['', ...proyectos]);
    } else {
      setFilteredOptions([]);
    }
    globalOptions(!showOptions);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        if (inputValue !== '') {
          const docEmpleado = localStorage.getItem('doc_empleado');
          const email = localStorage.getItem('email');

          setDocument(docEmpleado.toString());

          const response = await axios.get(`/proyect?search=${inputValue}&email=${email}`);
          // const anticipo = await axios.post(`/proyect/anticipo`, {
          //   sku: response?.data[0]?.skuP,
          //   doc: docEmpleado,
          // });
         const anticipo = await axios.post(`/proyect/anticipo`, { sku: response?.data[0]?.skuP, doc: docEmpleado });
          const indicadores = await axios.get(`/indicadores/fechas?docId=${docEmpleado}`);

          setindexProject(false);
          todosAnticipos(anticipo.data);
          todasLasFechas(indicadores.data);

          setProjectData({
            SKU_Proyecto: response?.data[0]?.skuP || '',
            NitCliente: response?.data[0]?.nitCliente || '',
            idNodoProyecto: response?.data[0]?.idNodoP || '',
            idProceso: parseInt(response?.data[0]?.Codi_parteP) || 0,
          });

          setNewResponse(response?.data);
          finishedHandler(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [inputValue, finishedUpdate]);

  return (
    <div ref={wrapperRef} className="relative  w-full bg-white">
      <div className="relative">
        
        <input
          className="bg-lightGrayCreame w-full px-3 py-2 pr-10"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => {
            globalOptions(true);
            if (searchText === '') {
              setFilteredOptions(['', ...proyectos]);
            }
          }}
          placeholder="Busca el Proyecto o sin Proyecto"
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
          onClick={handleDropdownClick}
        >
          <AiFillCaretDown size={50} color='#043963'/>
        </button>
      </div>

      {showOptions && filteredOptions.length > 0 && (
        <div className="absolute z-10 bg-gray-50 mt-1 border-2 border-lightGrayCreame rounded shadow w-full">
          <ul className="max-h-60 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <li key={index}>
                <button
                  onClick={() => handleSelectOption(option)}
                  className="block w-full text-left px-4 py-2 hover:bg-lightGrayCreame"
                >
                  {option === '' ? (
                    <span className="italic text-gray-400">-- Sin selección --</span>
                  ) : (
                    option
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;



