// import React, { useState, useEffect, useContext } from 'react';
// import { ThemeContext } from '../context/themeContext';
// import axios from 'axios';
// // import api from '../../api/api';

// const SearchBar = () => {
//   const { indice, setindexProject, finishedHandler, finishedUpdate, inputValue, finalValue, searchText, globalSearch, showOptions, globalOptions, todosAnticipos, todasLasFechas, setProjectData, response, setNewResponse, doc, setDocument } = useContext(ThemeContext);
//   const [options, setOptions] = useState([]);
//   // const [doc, setDoc] = useState('');


//   useEffect(() => {
//     finalValue('');
//   }, []);

//   useEffect(() => {
//     const fetchOptions = async () => {
//       try {
//         const user_name = localStorage.getItem('name');
//         const email = localStorage.getItem('email');
//         const response = await axios.get(`/proyect?search=${searchText}&email=${email}`);
//         const data = await response.data;
//         setOptions(data.map(pro => pro.proyecto));
//         globalOptions(true);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     if (searchText === '') {
//       globalOptions(false);
//     } else if (!options.includes(searchText)) {
//       fetchOptions();
//     }
//   }, [searchText]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (inputValue !== '') {
//           const user_name = localStorage.getItem('name');
//           const docEmpleado = localStorage.getItem('doc_empleado');
//           setDocument(docEmpleado.toString());
//           const email = localStorage.getItem('email');
//           console.log(inputValue,inputValue)
//           const response = await axios.get(`/proyect?search=${inputValue}&email=${email}`);
//           const anticipo = await axios.post(`/proyect/anticipo`, { sku: response?.data[0]?.skuP, doc: docEmpleado });
//           console.log(anticipo.data,response?.data[0]?.skuP,docEmpleado)
//           const indicadores = await axios.get(`/indicadores/fechas?docId=${docEmpleado}`);
//           setindexProject(false)
//           todosAnticipos(anticipo.data);
//           todasLasFechas(indicadores.data);
//           setProjectData({
//             //! aquí se agregarían más datos
//             SKU_Proyecto: response?.data[0]?.skuP || '',
//             NitCliente: response?.data[0]?.nitCliente || '',
//             idNodoProyecto: response?.data[0]?.idNodoP || '',
//             idProceso: parseInt(response?.data[0]?.Codi_parteP) || 0,
//           });
//           setNewResponse(response?.data);
//           finishedHandler(false);
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchData();
//   }, [inputValue, finishedUpdate]);

//   const handleSearch = (text) => {
//     if (text !== searchText) {
//       globalSearch(text);
//       globalOptions(true);
//     } else {
//       globalOptions(false);
//     }
//   };

//   const handleSelectOption = (option) => {
//     globalSearch(option);
//     finalValue(option);
//     globalOptions(false);
//   };

//   return (
//     <div className="mx-auto md:px-24 p-2 xl:px-40 w-full bg-white">
//       <input
//         className=" mx-auto bg-lightGrayCreame   w-full px-2"
//         value={searchText}
//         onChange={(e) => handleSearch(e.target.value)}
//         placeholder="Busca el Proyecto o sin Proyecto"
//       />
//       {showOptions && (
//         <div className="modalContainer absolute bg-gray-50 p-1 m-1 border-2 border-lightGrayCreame rounded">
//           <ul>
//             {options.map((option, index) => (
//               <li key={index}>
//                 <button onClick={() => handleSelectOption(option)}>{option}</button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchBar;



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
    todasLasFechas,
    setProjectData,
    response,
    setNewResponse,
    doc,
    setDocument,
    proyectos,
    setAllProjects,
  } = useContext(ThemeContext);

  const wrapperRef = useRef(null);
  const [filteredOptions, setFilteredOptions] = useState([]);
    

    useEffect(() => {
    const constulta = async () => {
       const docEmpleado = localStorage.getItem('doc_empleado');
       const anticipo = await axios.post(`/proyect/anticipo`, {  doc: docEmpleado });
       todosAnticipos(anticipo.data);
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
    <div ref={wrapperRef} className="relative mx-auto md:px-24 p-2 xl:px-40 w-full bg-white">
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



