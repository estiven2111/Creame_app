import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const meses = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
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
          params: { docId, anio, mes }
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
  const atraso =
    progA > 0 ? (pendA / progA) * 100 : 0;

  const productividad =
    (progA + progM) > 0
      ? (cumpA + cumpM) / (progA + progM)
      : 0;

  // =========================
  // CHART
  // =========================
  const chartData = {
    labels: [
      "Días Programados",
      "Horas Disponibles",
      "Horas Programadas",
      "Horas Cumplidas",
      "Horas Pendientes",
      "Frecuencia"
    ],
    datasets: [
      {
        data: [
          diasA + diasM,
          dispA + dispM,
          progA + progM,
          cumpA + cumpM,
          pendA,
          freqA + freqM
        ],
        backgroundColor: [
          "#1E3A8A",
          "#2563EB",
          "#10B981",
          "#22C55E",
          "#F59E0B",
          "#EF4444"
        ],
        borderWidth: 3,
        borderColor: "#fff",
        hoverOffset: 10
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "40%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 20
          }
        }
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center px-2 sm:px-4 md:px-6 lg:px-10 py-6">

      <div className="w-full max-w-6xl">

        {/* LOADING */}
        {loading && (
          <div className="text-center mb-4 text-gray-600 font-semibold text-base sm:text-lg">
            Cargando indicadores...
          </div>
        )}

        {/* FILTROS */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">

          <select
            className="w-full sm:w-auto p-2 border rounded-md shadow-sm text-sm sm:text-base"
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
          >
            {[2024, 2025, 2026].map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          <select
            className="w-full sm:w-auto p-2 border rounded-md shadow-sm text-sm sm:text-base"
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
          >
            {meses.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>

        </div>

        {/* TABLA */}
        <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 overflow-x-auto">

          <table className="w-full min-w-[600px] text-center text-xs sm:text-sm md:text-base">

            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Indicador</th>
                <th>Acumulado</th>
                <th>Mes</th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td>Días Programados</td>
                <td>{diasA}</td>
                <td>{diasM}</td>
              </tr>

              <tr>
                <td>Horas Disponibles</td>
                <td>{dispA}</td>
                <td>{dispM}</td>
              </tr>

              <tr>
                <td>Horas Programadas</td>
                <td>{progA}</td>
                <td>{progM}</td>
              </tr>

              <tr>
                <td>Horas Cumplidas</td>
                <td>{cumpA}</td>
                <td>{cumpM}</td>
              </tr>

              <tr>
                <td>Horas Pendientes</td>
                <td>{pendA}</td>
                <td>0</td>
              </tr>

              <tr>
                <td>Horas Frecuencia</td>
                <td>{freqA}</td>
                <td>{freqM}</td>
              </tr>

            </tbody>

          </table>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

          <div className="bg-white p-5 rounded-xl shadow text-center">
            <p className="text-gray-500 text-sm sm:text-base">Atraso</p>
            <h2 className="text-red-600 font-bold text-xl sm:text-2xl">
              {atraso.toFixed(1)}%
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow text-center">
            <p className="text-gray-500 text-sm sm:text-base">Productividad</p>
            <h2 className="text-green-600 font-bold text-xl sm:text-2xl">
              {productividad.toFixed(2)}
            </h2>
          </div>

        </div>

        {/* GRAFICO */}
        <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 mt-6">

          <h2 className="text-center font-semibold text-base sm:text-lg mb-4">
            Indicadores de Actividad
          </h2>

          {loading ? (
            <div className="text-center py-10">Cargando gráfico...</div>
          ) : (
            <div className="w-full h-[400px] sm:h-[3/0px] md:h-[450px] flex justify-center">
              <Doughnut data={chartData} options={options} />
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Indicadores;