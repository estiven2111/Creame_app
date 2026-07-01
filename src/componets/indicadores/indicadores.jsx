// import React, { useEffect, useState } from "react";
// import axios from "axios";

// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   BarElement,
//   CategoryScale,
//   LinearScale,
// } from "chart.js";

// import { Doughnut, Bar } from "react-chartjs-2";

// ChartJS.register(
//   ArcElement,
//   Tooltip,
//   Legend,
//   BarElement,
//   CategoryScale,
//   LinearScale,
// );

// const meses = [
//   "Enero","Febrero","Marzo","Abril","Mayo","Junio",
//   "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
// ];

// const Indicadores = () => {
//   const docId = localStorage.getItem("doc_empleado");

//   const [anio, setAnio] = useState(2026);
//   const [mes, setMes] = useState(1);

//   const [dataApi, setDataApi] = useState({});
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!docId) return;

//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         const res = await axios.get("/indicadores/fechas", {
//           params: { docId, anio, mes },
//         });

//         setDataApi(res.data.indicadores || {});
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [anio, mes]);

//   // =========================
//   // DATOS
//   // =========================
//   const diasA = dataApi.DiasProgramados_Acumulado || 0;
//   const diasM = dataApi.DiasProgramados_Mes || 0;

//   const dispA = dataApi.HorasDisponibles_Acumulado || 0;
//   const dispM = dataApi.HorasDisponibles_Mes || 0;

//   const progA = dataApi.HorasProgramadas_Acumulado || 0;
//   const progM = dataApi.HorasProgramadas_Mes || 0;

//   const cumpA = dataApi.HorasCumplidas_Acumulado || 0;
//   const cumpM = dataApi.HorasCumplidas_Mes || 0;

//   const pendA = dataApi.HorasPendientes_Acumulado || 0;
//   const pendM = dataApi.HorasPendientes_Mes || 0;

//   const freqA = dataApi.HorasFrecuencia_Acumulado || 0;
//   const freqM = dataApi.HorasFrecuencia_Mes || 0;

//   // 🔥 NUEVO ATRASO DESDE BACK
//   // const atraso = dataApi.Atraso_Mes * 100 || 0;
//   const atraso = dataApi.Atraso_Mes  || 0;

//   // =========================
//   // KPIs
//   // =========================
//   const productividad =
//     // progA + progM > 0 ? ((cumpA + cumpM) / (progA + progM)) * 100 : 0;
//     progA + progM > 0 ? ((cumpA + cumpM) / (progA + progM)) : 0;

//   // =========================
//   // GRAFICA 1
//   // =========================
//   const chartMain = {
//     labels: [
//       "Horas Disponibles",
//       "Horas Asignadas",
//       "Horas Cumplidas",
//       "Horas Pendientes",
//       "Frecuencia",
//     ],
//     datasets: [
//       {
//         data: [
//           dispA + dispM,
//           progA + progM,
//           cumpA + cumpM,
//           pendA,
//           freqA + freqM,
//         ],
//         backgroundColor: [
//           "#2563EB",
//           "#F59E0B",
//           "#10B981",
//           "#EF4444",
//           "#8B5CF6",
//         ],
//         borderWidth: 5,
//         borderColor: "#fff",
//         hoverOffset: 10,
//       },
//     ],
//   };

//   // =========================
//   // GRAFICA 2
//   // =========================
//   const chartCompare = {
//     labels: [
//       "Días Disponibles",
//       "Horas Disponibles",
//       "Horas Asignadas",
//       "Horas Cumplidas",
//       "Horas Pendientes",
//     ],
//     datasets: [
//       {
//         label: "Acumulado",
//         data: [diasA, dispA, progA, cumpA, pendA],
//         backgroundColor: "#2563EB",
//       },
//       {
//         label: "Mes",
//         data: [diasM, dispM, progM, cumpM, pendM],
//         backgroundColor: "#F59E0B",
//       },
//     ],
//   };

//   const optionsMain = {
//     responsive: true,
//     maintainAspectRatio: false,
//     cutout: "45%",
//     plugins: {
//       legend: {
//         position: "bottom",
//         labels: {
//           font: {
//             size: 20,
//             weight: "bold",
//           },
//         },
//       },
//     },
//   };

//   const optionsBar = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { position: "bottom" },
//     },
//   };

//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 3 }, (_, i) => currentYear - i);

//   return (
//     <div className="w-full min-h-screen bg-gray-100 flex justify-center py-8">
//       <div className="w-full max-w-6xl px-3">

//         {/* FILTROS */}
//         <div className="flex gap-3 justify-center mb-6">
//           <select value={anio} onChange={(e) => setAnio(Number(e.target.value))}>
//             {years.map((a) => (
//               <option key={a} value={a}>{a}</option>
//             ))}
//           </select>

//           <select
//             value={mes}
//             onChange={(e) => setMes(+e.target.value)}
//             className="p-2 border rounded"
//           >
//             {meses.map((m, i) => (
//               <option key={i} value={i + 1}>{m}</option>
//             ))}
//           </select>
//         </div>

//         {/* TABLA */}
//         <div className="w-full overflow-x-auto bg-white rounded-xl shadow-lg p-1 sm:p-6">
//           <table className="min-w-[420px] sm:min-w-[700px] w-full text-center text-xs sm:text-base md:text-lg lg:text-2xl">
            
//             <thead className="bg-gray-200 text-gray-700">
//               <tr>
//                 <th className="py-1 px-[2px] sm:py-3 sm:px-2">Indicador</th>
//                 <th className="py-1 px-[2px] sm:py-3 sm:px-2">Acumulado</th>
//                 <th className="py-1 px-[2px] sm:py-3 sm:px-2">Mes</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-100">
//               <tr className="hover:bg-gray-50">
//                 <td className="py-1 px-[2px] sm:py-3 sm:px-2 font-medium">
//                   Días Disponibles
//                 </td>
//                 <td>{diasA}</td>
//                 <td>{diasM}</td>
//               </tr>

//               <tr className="hover:bg-gray-50">
//                 <td className="font-medium text-blue-600">Horas Disponibles</td>
//                 <td className="text-blue-600 font-semibold">{dispA}</td>
//                 <td className="text-blue-600 font-semibold">{dispM}</td>
//               </tr>

//               <tr className="hover:bg-gray-50">
//                 <td className="font-medium text-yellow-600">Horas Asignadas</td>
//                 <td className="text-yellow-600 font-bold">{progA.toFixed(1)}</td>
//                 <td className="text-yellow-600 font-bold">{progM.toFixed(1)}</td>
//               </tr>

//               <tr className="hover:bg-gray-50">
//                 <td className="font-medium text-green-600">Horas Cumplidas</td>
//                 <td className="text-green-600 font-bold">{cumpA.toFixed(1)}</td>
//                 <td className="text-green-600 font-bold">{cumpM.toFixed(1)}</td>
//               </tr>

//               <tr className="hover:bg-gray-50">
//                 <td className="font-medium text-red-600">Horas Pendientes</td>
//                 <td className="text-red-600 font-bold">{pendA.toFixed(1)}</td>
//                 <td className="text-red-600 font-bold">{pendM.toFixed(1)}</td>
//               </tr>

//               <tr className="hover:bg-gray-50">
//                 <td className="font-medium text-purple-600">Frecuencia</td>
//                 <td className="text-purple-600 font-bold">{freqA}</td>
//                 <td className="text-purple-600 font-bold">{freqM}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* KPIs */}
//         <div className="grid md:grid-cols-2 gap-4 mt-6">
//           <div className="bg-white p-5 rounded shadow text-center">
//             <p>Atraso</p>
//             <h2 className="text-red-600 font-bold text-xl">
//               {atraso.toFixed(2)}%
//             </h2>
//           </div>

//           <div className="bg-white p-5 rounded shadow text-center">
//             <p>Cumplimiento</p>
//             <h2 className="text-green-600 font-bold text-xl">
//               {productividad.toFixed(2)}%
//             </h2>
//           </div>
//         </div>

//         {/* GRAFICA */}
//         <div className="bg-white mt-6 p-6 rounded shadow h-[620px]">
//           <Doughnut data={chartMain} options={optionsMain} />
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Indicadores;

//todo ****************************************

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   BarElement,
//   CategoryScale,
//   LinearScale,
// } from "chart.js";

// import { Doughnut, Bar } from "react-chartjs-2";

// ChartJS.register(
//   ArcElement,
//   Tooltip,
//   Legend,
//   BarElement,
//   CategoryScale,
//   LinearScale,
// );

// const meses = [
//   "Enero","Febrero","Marzo","Abril","Mayo","Junio",
//   "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
// ];

// const Indicadores = () => {
//   const docId = localStorage.getItem("doc_empleado");

//   const [anio, setAnio] = useState(2026);
//   const [mes, setMes] = useState(1);

//   const [dataApi, setDataApi] = useState({});
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!docId) return;

//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         const res = await axios.get("/indicadores/fechas", {
//           params: { docId, anio, mes },
//         });

//         setDataApi(res.data.indicadores || {});
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [anio, mes]);

//   // =========================
//   // DATOS
//   // =========================
//   const diasA = dataApi.DiasProgramados_Acumulado || 0;
//   const diasM = dataApi.DiasProgramados_Mes || 0;

//   const dispA = dataApi.HorasDisponibles_Acumulado || 0;
//   const dispM = dataApi.HorasDisponibles_Mes || 0;

//   const progA = dataApi.HorasProgramadas_Acumulado || 0;
//   const progM = dataApi.HorasProgramadas_Mes || 0;

//   const cumpA = dataApi.HorasCumplidas_Acumulado || 0;
//   const cumpM = dataApi.HorasCumplidas_Mes || 0;

//   const pendA = dataApi.HorasPendientes_Acumulado || 0;
//   const pendM = dataApi.HorasPendientes_Mes || 0;

//   const freqA = dataApi.HorasFrecuencia_Acumulado || 0;
//   const freqM = dataApi.HorasFrecuencia_Mes || 0;

//   // ✅ ATRASO (viene decimal → convertir a %)
//   const atraso = (dataApi.Atraso_Mes || 0) * 100;

//   // ✅ CUMPLIMIENTO REAL DESDE BACK
//   const cumplimiento = (dataApi.Completado_Mes || 0) * 100;

//   // =========================
//   // GRAFICA 1
//   // =========================
//   const chartMain = {
//     labels: [
//       "Horas Disponibles",
//       "Horas Asignadas",
//       "Horas Cumplidas",
//       "Horas Pendientes",
//       "Frecuencia",
//     ],
//     datasets: [
//       {
//         data: [
//           dispA + dispM,
//           progA + progM,
//           cumpA + cumpM,
//           pendA,
//           freqA + freqM,
//         ],
//         backgroundColor: [
//           "#2563EB",
//           "#F59E0B",
//           "#10B981",
//           "#EF4444",
//           "#8B5CF6",
//         ],
//         borderWidth: 5,
//         borderColor: "#fff",
//         hoverOffset: 10,
//       },
//     ],
//   };

//   // =========================
//   // GRAFICA 2
//   // =========================
//   const chartCompare = {
//     labels: [
//       "Días Disponibles",
//       "Horas Disponibles",
//       "Horas Asignadas",
//       "Horas Cumplidas",
//       "Horas Pendientes",
//     ],
//     datasets: [
//       {
//         label: "Acumulado",
//         data: [diasA, dispA, progA, cumpA, pendA],
//         backgroundColor: "#2563EB",
//       },
//       {
//         label: "Mes",
//         data: [diasM, dispM, progM, cumpM, pendM],
//         backgroundColor: "#F59E0B",
//       },
//     ],
//   };

//   const optionsMain = {
//     responsive: true,
//     maintainAspectRatio: false,
//     cutout: "45%",
//     plugins: {
//       legend: {
//         position: "bottom",
//         labels: {
//           font: {
//             size: 20,
//             weight: "bold",
//           },
//         },
//       },
//     },
//   };

//   const optionsBar = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { position: "bottom" },
//     },
//   };

//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 3 }, (_, i) => currentYear - i);

//   return (
//     <div className="w-full min-h-screen bg-gray-100 flex justify-center py-8">
//       <div className="w-full max-w-6xl px-3">

//         {/* FILTROS */}
//         <div className="flex gap-3 justify-center mb-6">
//           <select value={anio} onChange={(e) => setAnio(Number(e.target.value))}>
//             {years.map((a) => (
//               <option key={a} value={a}>{a}</option>
//             ))}
//           </select>

//           <select
//             value={mes}
//             onChange={(e) => setMes(+e.target.value)}
//             className="p-2 border rounded"
//           >
//             {meses.map((m, i) => (
//               <option key={i} value={i + 1}>{m}</option>
//             ))}
//           </select>
//         </div>

//         {/* TABLA */}
//         <div className="w-full overflow-x-auto bg-white rounded-xl shadow-lg p-1 sm:p-6">
//           <table className="min-w-[420px] sm:min-w-[700px] w-full text-center text-xs sm:text-base md:text-lg lg:text-2xl">
            
//             <thead className="bg-gray-200 text-gray-700">
//               <tr>
//                 <th className="py-1 px-[2px] sm:py-3 sm:px-2">Indicador</th>
//                 <th className="py-1 px-[2px] sm:py-3 sm:px-2">Acumulado</th>
//                 <th className="py-1 px-[2px] sm:py-3 sm:px-2">Mes</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-100">
//               <tr className="hover:bg-gray-50">
//                 <td className="py-1 px-[2px] sm:py-3 sm:px-2 font-medium">
//                   Días Disponibles
//                 </td>
//                 <td>{diasA}</td>
//                 <td>{diasM}</td>
//               </tr>

//               <tr className="hover:bg-gray-50">
//                 <td className="font-medium text-blue-600">Horas Disponibles</td>
//                 <td className="text-blue-600 font-semibold">{dispA}</td>
//                 <td className="text-blue-600 font-semibold">{dispM}</td>
//               </tr>

//               <tr className="hover:bg-gray-50">
//                 <td className="font-medium text-yellow-600">Horas Asignadas</td>
//                 <td className="text-yellow-600 font-bold">{progA.toFixed(1)}</td>
//                 <td className="text-yellow-600 font-bold">{progM.toFixed(1)}</td>
//               </tr>

//               <tr className="hover:bg-gray-50">
//                 <td className="font-medium text-green-600">Horas Cumplidas</td>
//                 <td className="text-green-600 font-bold">{cumpA.toFixed(1)}</td>
//                 <td className="text-green-600 font-bold">{cumpM.toFixed(1)}</td>
//               </tr>

//               <tr className="hover:bg-gray-50">
//                 <td className="font-medium text-red-600">Horas Pendientes</td>
//                 <td className="text-red-600 font-bold">{pendA.toFixed(1)}</td>
//                 <td className="text-red-600 font-bold">{pendM.toFixed(1)}</td>
//               </tr>

//               <tr className="hover:bg-gray-50">
//                 <td className="font-medium text-purple-600">Frecuencia</td>
//                 <td className="text-purple-600 font-bold">{freqA}</td>
//                 <td className="text-purple-600 font-bold">{freqM}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* KPIs */}
//         <div className="grid md:grid-cols-2 gap-4 mt-6">
//           <div className="bg-white p-5 rounded shadow text-center">
//             <p>Atraso</p>
//             <h2 className="text-red-600 font-bold text-xl">
//               {atraso.toFixed(2)}%
//             </h2>
//           </div>

//           <div className="bg-white p-5 rounded shadow text-center">
//             <p>Cumplimiento</p>
//             <h2 className="text-green-600 font-bold text-xl">
//               {cumplimiento.toFixed(2)}%
//             </h2>
//           </div>
//         </div>

//         {/* GRAFICA */}
//         <div className="bg-white mt-6 p-6 rounded shadow h-[620px]">
//           <Doughnut data={chartMain} options={optionsMain} />
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Indicadores;


//todo ****************************************

import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

const meses = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

const Indicadores = () => {
  const docId = localStorage.getItem("doc_empleado");

  const [anio, setAnio] = useState(2026);
  const [mes, setMes] = useState(1);

  const [dataApi, setDataApi] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!docId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get("/indicadores/fechas", {
          params: { docId, anio, mes },
        });

        setDataApi(res.data.indicadores || {});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [anio, mes]);

  const diasA = dataApi.DiasProgramados_Acumulado || 0;
  const diasM = dataApi.DiasProgramados_Mes || 0;

  const dispA = dataApi.HorasDisponibles_Acumulado || 0;
  const dispM = dataApi.HorasDisponibles_Mes || 0;

  const progA = dataApi.HorasProgramadas_Acumulado || 0;
  const progM = dataApi.HorasProgramadas_Mes || 0;

  const cumpA = dataApi.HorasCumplidas_Acumulado || 0;
  const cumpM = dataApi.HorasCumplidas_Mes || 0;

  const pendA = dataApi.HorasPendientes_Acumulado || 0;
  const pendM = dataApi.HorasPendientes_Mes || 0;

  const freqA = dataApi.HorasFrecuencia_Acumulado || 0;
  const freqM = dataApi.HorasFrecuencia_Mes || 0;

  const atraso = (dataApi.Atraso_Mes || 0) * 100;
  const cumplimiento = (dataApi.Completado_Mes || 0) * 100;

  const chartMain = {
    labels: [
      "Horas Disponibles",
      "Horas Asignadas",
      "Horas Cumplidas",
      "Horas Pendientes",
      "Frecuencia",
    ],
    datasets: [
      {
        data: [
          dispA + dispM,
          progA + progM,
          cumpA + cumpM,
          pendA,
          freqA + freqM,
        ],
        backgroundColor: [
          "#2563EB",
          "#F59E0B",
          "#10B981",
          "#EF4444",
          "#8B5CF6",
        ],
        borderWidth: 5,
        borderColor: "#fff",
        hoverOffset: 10,
      },
    ],
  };

  const optionsMain = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "45%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 20,
            weight: "bold",
          },
        },
      },
    },
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear - i);

  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center py-8">
      <div className="w-full max-w-6xl px-3">

        {/* FILTROS */}
        <div className="flex gap-3 justify-center mb-6">
          <select value={anio} onChange={(e) => setAnio(Number(e.target.value))}>
            {years.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          <select
            value={mes}
            onChange={(e) => setMes(+e.target.value)}
            className="p-2 border rounded"
          >
            {meses.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>

        {/* TABLA */}
        <div className="w-full bg-white rounded-xl shadow-lg p-1 sm:p-6">
          <table className="w-full table-fixed text-center text-[10px] sm:text-base md:text-lg lg:text-2xl">
            
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-1 px-1 sm:py-3 sm:px-2">Indicador</th>
                <th className="py-1 px-1 sm:py-3 sm:px-2">Acumulado</th>
                <th className="py-1 px-1 sm:py-3 sm:px-2">Mes</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="py-1 px-1 sm:py-3 sm:px-2 font-medium">
                  Días Disponibles
                </td>
                <td>{diasA}</td>
                <td>{diasM}</td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="font-medium text-blue-600">Horas Disponibles</td>
                <td className="text-blue-600 font-semibold">{dispA}</td>
                <td className="text-blue-600 font-semibold">{dispM}</td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="font-medium text-yellow-600">Horas Asignadas</td>
                <td className="text-yellow-600 font-bold">{progA.toFixed(1)}</td>
                <td className="text-yellow-600 font-bold">{progM.toFixed(1)}</td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="font-medium text-green-600">Horas Cumplidas</td>
                <td className="text-green-600 font-bold">{cumpA.toFixed(1)}</td>
                <td className="text-green-600 font-bold">{cumpM.toFixed(1)}</td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="font-medium text-red-600">Horas Pendientes</td>
                <td className="text-red-600 font-bold">{pendA.toFixed(1)}</td>
                <td className="text-red-600 font-bold">{pendM.toFixed(1)}</td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="font-medium text-purple-600">Frecuencia</td>
                <td className="text-purple-600 font-bold">{freqA}</td>
                <td className="text-purple-600 font-bold">{freqM}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* KPIs */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white p-5 rounded shadow text-center">
            <p>Atraso</p>
            <h2 className="text-red-600 font-bold text-xl">
              {atraso.toFixed(2)}%
            </h2>
          </div>

          <div className="bg-white p-5 rounded shadow text-center">
            <p>Cumplimiento</p>
            <h2 className="text-green-600 font-bold text-xl">
              {cumplimiento.toFixed(2)}%
            </h2>
          </div>
        </div>

        {/* GRAFICA */}
        <div className="bg-white mt-6 p-6 rounded shadow h-[620px]">
          <Doughnut data={chartMain} options={optionsMain} />
        </div>

      </div>
    </div>
  );
};

export default Indicadores;
