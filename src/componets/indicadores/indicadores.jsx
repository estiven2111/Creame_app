// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { Doughnut } from "react-chartjs-2";

// ChartJS.register(ArcElement, Tooltip, Legend);

// const meses = [
//   "Enero","Febrero","Marzo","Abril","Mayo","Junio",
//   "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
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
//           params: { docId, anio, mes }
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

//   const freqA = dataApi.HorasFrecuencia_Acumulado || 0;
//   const freqM = dataApi.HorasFrecuencia_Mes || 0;

//   // =========================
//   // KPIs
//   // =========================
//   const atraso =
//     progA > 0 ? (pendA / progA) * 100 : 0;

//   const productividad =
//     (progA + progM) > 0
//       ? (cumpA + cumpM) / (progA + progM)
//       : 0;

//   // =========================
//   // CHART
//   // =========================
//   const chartData = {
//     labels: [
//       "Días Programados",
//       "Horas Disponibles",
//       "Horas Programadas",
//       "Horas Cumplidas",
//       "Horas Pendientes",
//       "Frecuencia"
//     ],
//     datasets: [
//       {
//         data: [
//           diasA + diasM,
//           dispA + dispM,
//           progA + progM,
//           cumpA + cumpM,
//           pendA,
//           freqA + freqM
//         ],
//         backgroundColor: [
//           "#1E3A8A",
//           "#2563EB",
//           "#10B981",
//           "#22C55E",
//           "#F59E0B",
//           "#EF4444"
//         ],
//         borderWidth: 3,
//         borderColor: "#fff",
//         hoverOffset: 10
//       }
//     ]
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     cutout: "40%",
//     plugins: {
//       legend: {
//         position: "bottom",
//         labels: {
//           font: {
//             size: 20
//           }
//         }
//       }
//     }
//   };

//   return (
//     <div className="w-full min-h-screen bg-gray-100 flex justify-center px-2 sm:px-4 md:px-6 lg:px-10 py-6">

//       <div className="w-full max-w-6xl">

//         {/* LOADING */}
//         {loading && (
//           <div className="text-center mb-4 text-gray-600 font-semibold text-base sm:text-lg">
//             Cargando indicadores...
//           </div>
//         )}

//         {/* FILTROS */}
//         <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">

//           <select
//             className="w-full sm:w-auto p-2 border rounded-md shadow-sm text-sm sm:text-base"
//             value={anio}
//             onChange={(e) => setAnio(Number(e.target.value))}
//           >
//             {[2024, 2025, 2026].map(a => (
//               <option key={a} value={a}>{a}</option>
//             ))}
//           </select>

//           <select
//             className="w-full sm:w-auto p-2 border rounded-md shadow-sm text-sm sm:text-base"
//             value={mes}
//             onChange={(e) => setMes(Number(e.target.value))}
//           >
//             {meses.map((m, i) => (
//               <option key={i} value={i + 1}>{m}</option>
//             ))}
//           </select>

//         </div>

//         {/* TABLA */}
//         <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 overflow-x-auto">

//           <table className="w-full min-w-[600px] text-center text-xs sm:text-sm md:text-base">

//             <thead className="bg-gray-200">
//               <tr>
//                 <th className="p-2">Indicador</th>
//                 <th>Acumulado</th>
//                 <th>Mes</th>
//               </tr>
//             </thead>

//             <tbody>

//               <tr>
//                 <td>Días Programados</td>
//                 <td>{diasA}</td>
//                 <td>{diasM}</td>
//               </tr>

//               <tr>
//                 <td>Horas Disponibles</td>
//                 <td>{dispA}</td>
//                 <td>{dispM}</td>
//               </tr>

//               <tr>
//                 <td>Horas Programadas</td>
//                 <td>{progA}</td>
//                 <td>{progM}</td>
//               </tr>

//               <tr>
//                 <td>Horas Cumplidas</td>
//                 <td>{cumpA}</td>
//                 <td>{cumpM}</td>
//               </tr>

//               <tr>
//                 <td>Horas Pendientes</td>
//                 <td>{pendA}</td>
//                 <td>0</td>
//               </tr>

//               <tr>
//                 <td>Horas Frecuencia</td>
//                 <td>{freqA}</td>
//                 <td>{freqM}</td>
//               </tr>

//             </tbody>

//           </table>
//         </div>

//         {/* KPIs */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

//           <div className="bg-white p-5 rounded-xl shadow text-center">
//             <p className="text-gray-500 text-sm sm:text-base">Atraso</p>
//             <h2 className="text-red-600 font-bold text-xl sm:text-2xl">
//               {atraso.toFixed(1)}%
//             </h2>
//           </div>

//           <div className="bg-white p-5 rounded-xl shadow text-center">
//             <p className="text-gray-500 text-sm sm:text-base">Productividad</p>
//             <h2 className="text-green-600 font-bold text-xl sm:text-2xl">
//               {productividad.toFixed(2)}
//             </h2>
//           </div>

//         </div>

//         {/* GRAFICO */}
//         <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 mt-6">

//           <h2 className="text-center font-semibold text-base sm:text-lg mb-4">
//             Indicadores de Actividad
//           </h2>

//           {loading ? (
//             <div className="text-center py-10">Cargando gráfico...</div>
//           ) : (
//             <div className="w-full h-[400px] sm:h-[3/0px] md:h-[450px] flex justify-center">
//               <Doughnut data={chartData} options={options} />
//             </div>
//           )}

//         </div>

//       </div>
//     </div>
//   );
// };

// export default Indicadores;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// import {
//   Chart as ChartJS,
//   ArcElement,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend
// } from "chart.js";

// import { Doughnut, Bar } from "react-chartjs-2";

// ChartJS.register(
//   ArcElement,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend
// );

// const Indicadores = () => {

//   const docId = localStorage.getItem("doc_empleado");

//   const [anio, setAnio] = useState(2026);
//   const [mes, setMes] = useState(1);

//   const [dataApi, setDataApi] = useState({});
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!docId) return;

//     const fetch = async () => {
//       try {
//         setLoading(true);

//         const res = await axios.get("/indicadores/fechas", {
//           params: { docId, anio, mes }
//         });

//         setDataApi(res.data.indicadores || {});
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetch();
//   }, [anio, mes]);

//   // =========================
//   // DATA BACKEND
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

//   // =========================
//   // KPIs CORRECTOS
//   // =========================
//   const atraso =
//     progA > 0 ? (pendA / progA) * 100 : 0;

//   const productividad =
//     (progA + progM) > 0
//       ? (cumpA + cumpM) / (progA + progM)
//       : 0;

//   // =========================
//   // 🔵 DONUT ORIGINAL (SIN CAMBIOS ESTRUCTURA)
//   // =========================
//   const donutData = {
//     labels: [
//       "Días Programados",
//       "Horas Disponibles",
//       "Horas Programadas",
//       "Horas Cumplidas",
//       "Horas Pendientes",
//       "Horas Frecuencia"
//     ],
//     datasets: [
//       {
//         data: [
//           diasA + diasM,
//           dispA + dispM,
//           progA + progM,
//           cumpA + cumpM,
//           pendA + pendM,
//           freqA + freqM
//         ],
//         backgroundColor: [
//           "#1E3A8A",
//           "#3B82F6",
//           "#10B981",
//           "#22C55E",
//           "#F59E0B",
//           "#EF4444"
//         ],
//         borderWidth: 2,
//         borderColor: "#fff",
//         hoverOffset: 8
//       }
//     ]
//   };

//   const donutOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     cutout: "40%", // 🔥 igual estilo original
//     plugins: {
//       legend: {
//         position: "bottom"
//       }
//     }
//   };

//   // =========================
//   // BAR CHART (PRO)
//   // =========================
//   const barData = {
//     labels: [
//       "Días",
//       "Disponibles",
//       "Programadas",
//       "Cumplidas",
//       "Pendientes",
//       "Frecuencia"
//     ],
//     datasets: [
//       {
//         label: "Acumulado",
//         data: [diasA, dispA, progA, cumpA, pendA, freqA],
//         backgroundColor: "#1E3A8A",
//         borderRadius: 6
//       },
//       {
//         label: "Mes",
//         data: [diasM, dispM, progM, cumpM, pendM, freqM],
//         backgroundColor: "#60A5FA",
//         borderRadius: 6
//       }
//     ]
//   };

//   const barOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { position: "top" }
//     },
//     scales: {
//       x: { grid: { display: false } },
//       y: { beginAtZero: true }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-6">

//       <div className="w-full max-w-6xl">

//         {/* LOADING */}
//         {loading && (
//           <div className="text-center mb-4 font-semibold">
//             Cargando indicadores...
//           </div>
//         )}

//         {/* FILTROS */}
//         <div className="flex gap-3 justify-center mb-6">

//           <select value={anio} onChange={(e) => setAnio(Number(e.target.value))}>
//             {[2024, 2025, 2026].map(a => (
//               <option key={a}>{a}</option>
//             ))}
//           </select>

//           <select value={mes} onChange={(e) => setMes(Number(e.target.value))}>
//             {[
//               "Enero","Febrero","Marzo","Abril","Mayo","Junio",
//               "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
//             ].map((m, i) => (
//               <option key={i} value={i + 1}>{m}</option>
//             ))}
//           </select>

//         </div>

//         {/* KPIs */}
//         <div className="grid grid-cols-2 gap-4 mb-6">

//           <div className="bg-white p-4 rounded-xl shadow text-center">
//             <p>Atraso</p>
//             <h2 className="text-red-600 font-bold text-xl">
//               {atraso.toFixed(1)}%
//             </h2>
//           </div>

//           <div className="bg-white p-4 rounded-xl shadow text-center">
//             <p>Productividad</p>
//             <h2 className="text-green-600 font-bold text-xl">
//               {productividad.toFixed(2)}
//             </h2>
//           </div>

//         </div>

//         {/* 🔵 DONUT ORIGINAL */}
//         <div className="bg-white p-5 rounded-xl shadow mb-6">
//           <div className="h-[350px] flex justify-center">
//             <Doughnut data={donutData} options={donutOptions} />
//           </div>
//         </div>

//         {/* 📊 BAR ABAJO */}
//         <div className="bg-white p-5 rounded-xl shadow">
//           <div className="h-[450px]">
//             <Bar data={barData} options={barOptions} />
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Indicadores;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { Doughnut } from "react-chartjs-2";

// ChartJS.register(ArcElement, Tooltip, Legend);

// const meses = [
//   "Enero","Febrero","Marzo","Abril","Mayo","Junio",
//   "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
// ];

// const Indicadores = () => {

//   const docId = localStorage.getItem("doc_empleado");

//   const [anio, setAnio] = useState(2026);
//   const [mes, setMes] = useState(1);

//   const [dataApi, setDataApi] = useState({});
//   const [loading, setLoading] = useState(false);

//   // =========================
//   // FETCH
//   // =========================
//   useEffect(() => {
//     if (!docId) return;

//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         const res = await axios.get("/indicadores/fechas", {
//           params: { docId, anio, mes }
//         });

//         setDataApi(res.data.indicadores || {});
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [anio, mes]);

//   // =========================
//   // DATA RAW
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

//   // =========================
//   // KPIs CORRECTOS
//   // =========================

//   const atraso =
//     progA > 0 ? (pendA / progA) * 100 : 0;

//   const productividad =
//     (progA + progM) > 0
//       ? (cumpA + cumpM) / (progA + progM)
//       : 0;

//   // =========================
//   // DONUT (ANILLO)
//   // =========================
//   const chartData = {
//     labels: [
//       "Días Programados",
//       "Horas Disponibles",
//       "Horas Programadas",
//       "Horas Cumplidas",
//       "Horas Pendientes",
//       "Frecuencia"
//     ],
//     datasets: [
//       {
//         data: [
//           diasA + diasM,
//           dispA + dispM,
//           progA + progM,
//           cumpA + cumpM,
//           pendA + pendM,
//           freqA + freqM
//         ],
//         backgroundColor: [
//           "#1E3A8A", // días
//           "#2563EB", // disponibles (azul fuerte)
//           "#F59E0B", // programadas (AMARILLO bien distinto)
//           "#22C55E", // cumplidas (verde)
//           "#EF4444", // pendientes (rojo)
//           "#A855F7"  // frecuencia (morado)
//         ],
//         borderWidth: 3,
//         borderColor: "#fff",
//         hoverOffset: 12
//       }
//     ]
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     cutout: "55%", // donut más visible
//     plugins: {
//       legend: {
//         position: "bottom",
//         labels: {
//           boxWidth: 14,
//           padding: 16,
//           font: {
//             size: 13
//           }
//         }
//       }
//     }
//   };

//   // =========================
//   // UI
//   // =========================
//   return (
//     <div className="min-h-screen bg-gray-100 flex justify-center py-8 px-3">

//       <div className="w-full max-w-6xl">

//         {/* LOADING */}
//         {loading && (
//           <div className="text-center mb-4 text-gray-600 font-semibold">
//             Cargando indicadores...
//           </div>
//         )}

//         {/* FILTROS */}
//         <div className="flex flex-col md:flex-row gap-3 justify-center mb-6">

//           <select
//             className="p-2 border rounded-md shadow-sm"
//             value={anio}
//             onChange={(e) => setAnio(Number(e.target.value))}
//           >
//             {[2024, 2025, 2026].map(a => (
//               <option key={a} value={a}>{a}</option>
//             ))}
//           </select>

//           <select
//             className="p-2 border rounded-md shadow-sm"
//             value={mes}
//             onChange={(e) => setMes(Number(e.target.value))}
//           >
//             {meses.map((m, i) => (
//               <option key={i} value={i + 1}>{m}</option>
//             ))}
//           </select>

//         </div>

//         {/* TABLA */}
//         <div className="bg-white shadow-lg rounded-xl p-6 overflow-x-auto max-w-4xl mx-auto">

//           <h2 className="text-center font-bold mb-4 text-gray-700">
//             Indicadores de Actividad
//           </h2>

//           <table className="w-full text-center text-sm">

//             <thead className="bg-gray-200 text-gray-700">
//               <tr>
//                 <th className="p-2">Indicador</th>
//                 <th>Acumulado</th>
//                 <th>Mes</th>
//               </tr>
//             </thead>

//             <tbody className="text-gray-700">

//               <tr className="border-b">
//                 <td>Días Programados</td>
//                 <td>{diasA.toFixed(1)}</td>
//                 <td>{diasM.toFixed(1)}</td>
//               </tr>

//               <tr className="border-b text-blue-600 font-medium">
//                 <td>Horas Disponibles</td>
//                 <td>{dispA.toFixed(1)}</td>
//                 <td>{dispM.toFixed(1)}</td>
//               </tr>

//               <tr className="border-b text-yellow-600 font-semibold">
//                 <td>Horas Programadas</td>
//                 <td>{progA.toFixed(1)}</td>
//                 <td>{progM.toFixed(1)}</td>
//               </tr>

//               <tr className="border-b text-green-600 font-semibold">
//                 <td>Horas Cumplidas</td>
//                 <td>{cumpA.toFixed(1)}</td>
//                 <td>{cumpM.toFixed(1)}</td>
//               </tr>

//               <tr className="border-b text-red-600 font-semibold">
//                 <td>Horas Pendientes</td>
//                 <td>{pendA.toFixed(1)}</td>
//                 <td>{pendM.toFixed(1)}</td>
//               </tr>

//               <tr className="text-purple-600 font-semibold">
//                 <td>Horas Frecuencia</td>
//                 <td>{freqA.toFixed(1)}</td>
//                 <td>{freqM.toFixed(1)}</td>
//               </tr>

//             </tbody>

//           </table>
//         </div>

//         {/* KPIS */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto">

//           <div className="bg-white p-5 rounded-xl shadow text-center">
//             <p className="text-gray-500">Atraso</p>
//             <h2 className="text-red-600 font-bold text-2xl">
//               {atraso.toFixed(1)}%
//             </h2>
//           </div>

//           <div className="bg-white p-5 rounded-xl shadow text-center">
//             <p className="text-gray-500">Productividad</p>
//             <h2 className="text-green-600 font-bold text-2xl">
//               {productividad.toFixed(2)}
//             </h2>
//           </div>

//         </div>

//         {/* GRAFICA */}
//         <div className="bg-white shadow-lg rounded-xl p-6 mt-6 max-w-4xl mx-auto">

//           <h2 className="text-center font-semibold mb-4">
//             Indicadores (Donut)
//           </h2>

//           <div className="h-[380px] flex justify-center">
//             <Doughnut data={chartData} options={options} />
//           </div>

//         </div>

//       </div>
//     </div>
//   );
// };

// export default Indicadores;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { Doughnut } from "react-chartjs-2";

// ChartJS.register(ArcElement, Tooltip, Legend);

// const meses = [
//   "Enero","Febrero","Marzo","Abril","Mayo","Junio",
//   "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
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
//           params: { docId, anio, mes }
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

//   const freqA = dataApi.HorasFrecuencia_Acumulado || 0;
//   const freqM = dataApi.HorasFrecuencia_Mes || 0;

//   // =========================
//   // KPIs CORRECTOS
//   // =========================
//   const atraso =
//     progA > 0 ? (pendA / progA) * 100 : 0;

//   const productividad =
//     (progA + progM) > 0
//       ? (cumpA + cumpM) / (progA + progM)
//       : 0;

//   // =========================
//   // GRAFICA 1 (ANILLO PRINCIPAL)
//   // =========================
//   const chartMain = {
//     labels: [
//       "Días Programados",
//       "Horas Disponibles",
//       "Horas Programadas",
//       "Horas Cumplidas",
//       "Horas Pendientes",
//       "Frecuencia"
//     ],
//     datasets: [
//       {
//         data: [
//           diasA + diasM,
//           dispA + dispM,
//           progA + progM,
//           cumpA + cumpM,
//           pendA,
//           freqA + freqM
//         ],
//         backgroundColor: [
//           "#1E3A8A", // azul oscuro
//           "#2563EB", // azul
//           "#F59E0B", // amarillo (disponibles)
//           "#10B981", // verde (cumplidas)
//           "#EF4444", // rojo (pendientes)
//           "#8B5CF6"  // morado (frecuencia)
//         ],
//         borderColor: "#fff",
//         borderWidth: 3,
//         hoverOffset: 10
//       }
//     ]
//   };

//   // =========================
//   // GRAFICA 2 (COMPARATIVA MES vs ACUMULADO)
//   // =========================
//   const chartCompare = {
//     labels: ["Programadas", "Cumplidas", "Pendientes"],
//     datasets: [
//       {
//         label: "Acumulado",
//         data: [progA, cumpA, pendA],
//         backgroundColor: ["#1E3A8A", "#10B981", "#EF4444"]
//       },
//       {
//         label: "Mes",
//         data: [progM, cumpM, progM - cumpM],
//         backgroundColor: ["#3B82F6", "#22C55E", "#F97316"]
//       }
//     ]
//   };

//   const optionsMain = {
//     responsive: true,
//     maintainAspectRatio: false,
//     cutout: "45%",
//     plugins: {
//       legend: {
//         position: "bottom"
//       }
//     }
//   };

//   const optionsCompare = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "bottom"
//       }
//     }
//   };

//   return (
//     <div className="w-full min-h-screen bg-gray-100 flex justify-center py-8 px-3">

//       <div className="w-full max-w-6xl">

//         {/* LOADING */}
//         {loading && (
//           <div className="text-center mb-4 font-semibold">
//             Cargando indicadores...
//           </div>
//         )}

//         {/* FILTROS */}
//         <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">

//           <select
//             className="p-2 border rounded"
//             value={anio}
//             onChange={(e) => setAnio(Number(e.target.value))}
//           >
//             {[2024, 2025, 2026].map(a => (
//               <option key={a} value={a}>{a}</option>
//             ))}
//           </select>

//           <select
//             className="p-2 border rounded"
//             value={mes}
//             onChange={(e) => setMes(Number(e.target.value))}
//           >
//             {meses.map((m, i) => (
//               <option key={i} value={i + 1}>{m}</option>
//             ))}
//           </select>

//         </div>

//         {/* TABLA */}
//         <div className="bg-white shadow rounded-xl p-6 overflow-x-auto text-sm">

//           <table className="w-full text-center">

//             <thead className="bg-gray-200">
//               <tr>
//                 <th>Indicador</th>
//                 <th>Acumulado</th>
//                 <th>Mes</th>
//               </tr>
//             </thead>

//             <tbody>

//               <tr>
//                 <td>Días Programados</td>
//                 <td>{diasA}</td>
//                 <td>{diasM}</td>
//               </tr>

//               <tr>
//                 <td>Horas Disponibles</td>
//                 <td>{dispA}</td>
//                 <td>{dispM}</td>
//               </tr>

//               <tr className="text-yellow-600 font-semibold">
//                 <td>Horas Programadas</td>
//                 <td>{progA.toFixed(1)}</td>
//                 <td>{progM.toFixed(1)}</td>
//               </tr>

//               <tr className="text-green-600 font-semibold">
//                 <td>Horas Cumplidas</td>
//                 <td>{cumpA.toFixed(1)}</td>
//                 <td>{cumpM.toFixed(1)}</td>
//               </tr>

//               <tr className="text-red-600 font-semibold">
//                 <td>Horas Pendientes</td>
//                 <td>{pendA.toFixed(1)}</td>
//                 <td>0</td>
//               </tr>

//               <tr className="text-purple-600 font-semibold">
//                 <td>Horas Frecuencia</td>
//                 <td>{freqA}</td>
//                 <td>{freqM}</td>
//               </tr>

//             </tbody>

//           </table>
//         </div>

//         {/* KPIs */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

//           <div className="bg-white p-5 rounded shadow text-center">
//             <p>Atraso</p>
//             <h2 className="text-red-600 text-xl font-bold">
//               {atraso.toFixed(1)}%
//             </h2>
//           </div>

//           <div className="bg-white p-5 rounded shadow text-center">
//             <p>Productividad</p>
//             <h2 className="text-green-600 text-xl font-bold">
//               {productividad.toFixed(2)}
//             </h2>
//           </div>

//         </div>

//         {/* GRAFICA 1 */}
//         <div className="bg-white mt-6 p-6 rounded shadow">

//           <div className="h-[420px]">
//             <Doughnut data={chartMain} options={optionsMain} />
//           </div>

//         </div>

//         {/* GRAFICA 2 */}
//         <div className="bg-white mt-6 p-6 rounded shadow">

//           <div className="h-[350px]">
//             <Doughnut data={chartCompare} options={optionsCompare} />
//           </div>

//         </div>

//       </div>
//     </div>
//   );
// };

// export default Indicadores;

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
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
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

  // =========================
  // DATOS
  // =========================
  const diasA = dataApi.DiasProgramados_Acumulado || 0;
  const diasM = dataApi.DiasProgramados_Mes || 0;

  const dispA = dataApi.HorasDisponibles_Acumulado || 0;
  const dispM = dataApi.HorasDisponibles_Mes || 0;

  const progA = dataApi.HorasProgramadas_Acumulado || 0;
  const progM = dataApi.HorasProgramadas_Mes || 0;

  const cumpA = dataApi.HorasCumplidas_Acumulado || 0;
  const cumpM = dataApi.HorasCumplidas_Mes || 0;

  const pendA = dataApi.HorasPendientes_Acumulado || 0;

  const freqA = dataApi.HorasFrecuencia_Acumulado || 0;
  const freqM = dataApi.HorasFrecuencia_Mes || 0;

  // =========================
  // KPIs
  // =========================
  const atraso = progA > 0 ? (pendA / progA) * 100 : 0;

  const productividad =
    progA + progM > 0 ? (cumpA + cumpM) / (progA + progM) : 0;

  // =========================
  // GRAFICA 1 (ANILLO GENERAL)
  // =========================
  const chartMain = {
    labels: [
      "Días Programados",
      "Horas Disponibles",
      "Horas Programadas",
      "Horas Cumplidas",
      "Horas Pendientes",
      "Frecuencia",
    ],
    datasets: [
      {
        data: [
          diasA + diasM,
          dispA + dispM,
          progA + progM,
          cumpA + cumpM,
          pendA,
          freqA + freqM,
        ],
        backgroundColor: [
          "#1E3A8A",
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

  // =========================
  // GRAFICA 2 (ACUMULADO VS MES - CORRECTA)
  // =========================
  const chartCompare = {
    labels: [
      "Días Programados",
      "Horas Disponibles",
      "Horas Programadas",
      "Horas Cumplidas",
      "Horas Pendientes",
    ],
    datasets: [
      {
        label: "Acumulado",
        data: [diasA, dispA, progA, cumpA, pendA],
        backgroundColor: "#2563EB",
      },
      {
        label: "Mes",
        data: [diasM, dispM, progM, cumpM, 0],
        backgroundColor: "#F59E0B",
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
            size: 20, // 👈 aquí aumentas el tamaño
            weight: "bold",
          },
        },
      },
    },
  };

  const optionsBar = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
    },
  };
  const currentYear = new Date().getFullYear();

  const years = Array.from({ length: 3 }, (_, i) => currentYear - i);

  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center py-8">
      <div className="w-full max-w-6xl px-3">
        {/* FILTROS */}
        <div className="flex gap-3 justify-center mb-6">
          <select
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
          >
            {years.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          <select
            value={mes}
            onChange={(e) => setMes(+e.target.value)}
            className="p-2 border rounded"
          >
            {meses.map((m, i) => (
              <option key={i} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* TABLA */}

        <div className="w-full overflow-x-auto bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <table className="min-w-[700px] w-full text-center text-sm sm:text-base md:text-lg lg:text-2xl">
            {/* HEADER */}
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-2">Indicador</th>
                <th className="py-3 px-2">Acumulado</th>
                <th className="py-3 px-2">Mes</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-2 font-medium">Días Programados</td>
                <td className="py-3 px-2">{diasA}</td>
                <td className="py-3 px-2">{diasM}</td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="py-3 px-2 font-medium">Horas Disponibles</td>
                <td className="py-3 px-2 text-blue-600 font-semibold">
                  {dispA}
                </td>
                <td className="py-3 px-2 text-blue-600 font-semibold">
                  {dispM}
                </td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="py-3 px-2 font-medium text-yellow-600">
                  Horas Programadas
                </td>
                <td className="py-3 px-2 text-yellow-600 font-bold">
                  {progA.toFixed(1)}
                </td>
                <td className="py-3 px-2 text-yellow-600 font-bold">
                  {progM.toFixed(1)}
                </td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="py-3 px-2 font-medium text-green-600">
                  Horas Cumplidas
                </td>
                <td className="py-3 px-2 text-green-600 font-bold">
                  {cumpA.toFixed(1)}
                </td>
                <td className="py-3 px-2 text-green-600 font-bold">
                  {cumpM.toFixed(1)}
                </td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="py-3 px-2 font-medium text-red-600">
                  Horas Pendientes
                </td>
                <td className="py-3 px-2 text-red-600 font-bold">
                  {pendA.toFixed(1)}
                </td>
                <td className="py-3 px-2 text-red-600 font-bold">0</td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="py-3 px-2 font-medium text-purple-600">
                  Frecuencia
                </td>
                <td className="py-3 px-2 text-purple-600 font-bold">{freqA}</td>
                <td className="py-3 px-2 text-purple-600 font-bold">{freqM}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* KPIs */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white p-5 rounded shadow text-center">
            <p>Atraso</p>
            <h2 className="text-red-600 font-bold text-xl">
              {atraso.toFixed(1)}%
            </h2>
          </div>

          <div className="bg-white p-5 rounded shadow text-center">
            <p>Productividad</p>
            <h2 className="text-green-600 font-bold text-xl">
              {productividad.toFixed(2)}
            </h2>
          </div>
        </div>

        {/* GRAFICA 1 */}
        <div className="bg-white mt-6 p-6 rounded shadow h-[620px]">
          <Doughnut data={chartMain} options={optionsMain} />
        </div>

        {/* GRAFICA 2 (CORREGIDA) */}
        {/* <div className="bg-white mt-6 p-6 rounded shadow h-[420px]">
          <Bar data={chartCompare} options={optionsBar} />
        </div> */}
      </div>
    </div>
  );
};

export default Indicadores;
