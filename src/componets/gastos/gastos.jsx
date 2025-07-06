import React, { useEffect, useState, useRef, useContext } from "react";
import { Input, initTE } from "tw-elements";
import Swal from "sweetalert";
import Webcam from "react-webcam";
import Modalcam from "./CameraGastos";
import { AiFillCamera } from "react-icons/ai";
import { GrGallery } from "react-icons/gr";
import { GoArchive } from "react-icons/go";
import { IoDocumentsOutline } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";
import { BiScan } from "react-icons/bi";
import axios from "axios";
// import loading from "../../assets/img/loading.gif";
import { ThemeContext } from "../context/themeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import LoginMicrosoft from "../authentication/loginmicrosfot";
import logo from "../../assets/img/icon.png";
import { setCanvas } from "chart/lib";
import { useLocation } from "react-router-dom";
import logoPDF from "../../assets/img/logoPDF.png";
// <input type="file" capture="camera" />
let imagen = null;
let latitude = 0;
let longitude = 0;
let hasLogicExecuted = false;
const Gastos = () => {
  const { infoProject, anticipos, inputValue, topSecret } =
    useContext(ThemeContext);
  const [prepayment, setPrepayment] = useState("");
  const [justSelected, SetJustSelected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [totalAnt, setTotalAnt] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const spinValue = useRef(0);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const location = useLocation();
  localStorage.setItem("ruta", location.pathname);

  useEffect(() => {
    if (isLoading) {
      const spinAnimation = setInterval(() => {
        spinValue.current = (spinValue.current + 1) % 360;
      }, 16);
      return () => clearInterval(spinAnimation);
    }
  }, [isLoading]);

  useEffect(() => {
    const ActulizarOptions = () => {
      if (anticipos) {
        setTotalAnt(anticipos);
      }
    };
    ActulizarOptions();
  }, [anticipos]);

  const toggleDropdown = () => {
    SetJustSelected(false);
    setIsOpen(!isOpen);
  };
  const handleOptionSelect = (option) => {
    if (!selectedOptions.includes(option)) {
      setSelectedOptions([option]);
    }
    setIsOpen(false);
    SetJustSelected(true);
  };

  const renderOptions = () => {
    return totalAnt.map((option, index) => (
      <button
        className="flex m-1 px-1 cursor-pointer bg-white rounded"
        key={index}
        onClick={() => {
          handleOptionSelect(option.DetalleConcepto + option.NumeroComprobante);
          setPrepayment(option);
        }}
      >
        <span
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {option.NumeroComprobante + option.DetalleConcepto}
        </span>
      </button>
    ));
  };

  const renderSelectedOptions = () => {
    return (
      <div>
        {selectedOptions.map((option, index) => {
          return <p key={index}>{option}</p>;
        })}
      </div>
    );
  };

  useEffect(() => {
    initTE({ Input });
  });
  const [opencam, setOpencam] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  // const fileInputRef = useRef(null);
  const [fillData, setFillData] = useState(false);
  const [data, setData] = useState({});
  const [responsedata, setResponsedata] = useState({
    nit: "",
    numFact: "",
    doc: "",
    total: "",
    totalSinIva: "",
    nombre: "",
    razon_social: "",
    rete: "",
    retePorc: "",
    iva: "",
    ivaPorc: "",
    fecha: "",
    concepto: "",
    municipio: "",
    codepostal: "",
    ipc: "",
    Descripcion: "",
    ica: "",
    NumFactura: "",
    OrdenCompra: "",
    Direccion: "",
    icui: "",
    detalles_compra: "",
  });

  const openCamera = () => {
    setOpencam(!opencam);
  };
  const imageData = (uri) => {
    setImageSrc(uri);
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    setImageLoaded(true);
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      imagen = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (imagen.name.split(".")[1] === "pdf") {
          setImageSrc(logoPDF);
        } else {
          setImageSrc(reader.result);
        }
      };
    }
  };

  const handlerValidation = (event) => {
    const input = event.target;
    if (input.files.length > 0) {
      const file = input.files[0];
      const Extensions = [".jpg", ".jpeg", ".png", ".pdf"];
      const fileExtension = file.name.slice(
        ((file.name.lastIndexOf(".") - 1) >>> 0) + 2
      );
      if (!Extensions.includes("." + fileExtension.toLowerCase())) {
        Swal({
          title: "ARCHIVO INCORRECTO",
          text: "Debe seleccionar un archivo .JPG, .JPEG o .PNG",
          icon: "warning",
          buttons: "Aceptar",
        });
        input.value = "";
      }
    }
  };
  const locations = () => {
    try {
      if ("geolocation" in navigator) {
        // El navegador soporta la geolocalización
        navigator.geolocation.getCurrentPosition(
          function (position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            peticionOcr();
            // Aquí puedes usar la latitud y la longitud como desees
          },
          function (error) {
            // Manejo de errores
            switch (error.code) {
              case error.PERMISSION_DENIED:
                Swal({
                  title: "UBICACION DENEGADA",
                  text: "Para poder saber el municipio y el codigo postal debe activar la geolocalización de su navegador web en configuraciones de su navegador",
                  icon: "warning",
                  buttons: "Aceptar",
                });
                peticionOcr();
                break;
              case error.POSITION_UNAVAILABLE:
                Swal({
                  title: "ERROR DE UBICACION",
                  text: "Información de ubicación no disponible",
                  icon: "warning",
                  buttons: "Aceptar",
                });
                peticionOcr();
                break;
              case error.TIMEOUT:
                Swal({
                  title: "ERROR DE UBICACION",
                  text: "Se agotó el tiempo para obtener la ubicación.",
                  icon: "warning",
                  buttons: "Aceptar",
                });
                break;
              default:
                console.error("Error desconocido: " + error.message);
            }
          }
        );
        return true;
      } else {
        // El navegador no admite geolocalización
        Swal({
          title: "ERROR DE UBICACION",
          text: "El navegador no admite geolocalización.",
          icon: "warning",
          buttons: "Aceptar",
        });
      }
    } catch (error) {}
  };

  const peticionOcr = async () => {
    try {
      const user_name = localStorage.getItem("name");
      setIsLoading(true);
      const formData = new FormData();
      formData.append("imagen", imagen);

      formData.append("latitud", latitude);
      formData.append("longitud", longitude);
      const response = await axios.post(`/proyect/ocr`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      let municipio = "";
      let codepostal = "";
      if (
        response.data.codepostal === undefined ||
        response.data.codepostal === undefined
      ) {
        codepostal = "";
      } else {
        codepostal = response.data.codepostal;
      }
      if (
        response.data.municipio === undefined ||
        response.data.municipio === undefined
      ) {
        municipio = "";
      } else {
        municipio = response.data.municipio;
      }
      const iva =
        !responsedata.ivaPorc || !responsedata.totalSinIva
          ? ""
          : `${(responsedata.totalSinIva * responsedata.ivaPorc) / 100}`;
      const rete =
        !responsedata.retePorc || !responsedata.totalSinIva
          ? ""
          : `${(responsedata.totalSinIva * responsedata.retePorc) / 100}`;
      setResponsedata({
        ...responsedata,
        retePorc: response.data.porcentaje_rete,
        ivaPorc: response.data.porcentaje_iva,
        nit: response.data.nit,
        numFact: response.data.numFact,
        doc: response.data.doc,
        total: response.data.total,
        totalSinIva: response.data.totalSinIva,
        nombre: user_name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        razon_social: response.data.razon_social, //todo revisar y poner en razon social
        iva: response.data.iva,
        rete: response.data.rete,
        fecha: response.data.fecha,
        concepto: response.data.concepto,
        ipc: response.data.ipc,
        municipio,
        codepostal,
        // Descripcion,
        ica: response.data.ica,
        NumFactura: response.data.NumFactura,
        Direccion: response.data.Direccion,
        OrdenCompra: response.data.OrdenCompra,
        icui: response.data.icui,
        detalles_compra: response.data.detalles_compra,
      });
      // console.log(responsedata);
      setFillData(true);
      setIsLoading(false);
    } catch (error) {
      console.error(error, "Error");
    }
  };

  const sendData = async (data) => {
    const formData = new FormData();

    const user_name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const docEmpleado = localStorage.getItem("doc_empleado");

    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0"); // Día del mes con dos dígitos
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Mes (0 - 11) con dos dígitos
    const year = String(currentDate.getFullYear()).slice(2); // Año con dos dígitos
    const hours = String(currentDate.getHours()).padStart(2, "0"); // Hora con dos dígitos
    const minutes = String(currentDate.getMinutes()).padStart(2, "0"); // Minutos con dos dígitos
    const formatDate = new Date().toISOString().split("T")[0];
    const nom_img = `${user_name}_${day}${month}${year}_${hours}${minutes}.jpg`;

    const ActualizarEntregable = {
      ...infoProject.input,
      N_DocumentoEmpleado: docEmpleado,
      Nombre_Empleado: user_name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""),
      NumeroComprobante: prepayment ? prepayment.NumeroComprobante : "", //
      Fecha: formatDate, //
      FechaComprobante: responsedata.fecha
        ? responsedata.fecha.split("/").join("-")
        : "", //
      ValorComprobante: responsedata.total ? parseInt(responsedata.total) : 0, //
      NitComprobante: responsedata.nit ? responsedata.nit : "", //
      NombreComprobante: responsedata.detalles_compra ? responsedata.detalles_compra : "", //
      CiudadComprobante: responsedata.municipio ? responsedata.municipio : "", //
      DireccionComprobante: responsedata.codepostal
        ? responsedata.codepostal.toString()
        : "", //
      CCostos: prepayment ? prepayment.IdCentroCostos.toString() : "", //
      idAnticipo: prepayment ? parseInt(prepayment.IdResponsable) : "", //
      ipc: responsedata.ipc ? parseInt(responsedata.ipc) : 0, //
      Sub_Total: responsedata.totalSinIva
        ? parseInt(responsedata.totalSinIva)
        : 0, //
      Descripcion: responsedata.Descripcion ? responsedata.Descripcion : "",
      iva: responsedata.iva ? responsedata.iva : 0,
      reteFuente: responsedata.rete ? responsedata.rete : 0,
      ica: responsedata.ica ? responsedata.ica : "",
      razon_social: responsedata.razon_social ? responsedata.razon_social : "",
      NumFactura: responsedata.NumFactura ? responsedata.NumFactura : "",
      Direccion: responsedata.Direccion ? responsedata.Direccion : "",
      icui: responsedata.icui ? responsedata.icui : "",
      OrdenCompra: responsedata.OrdenCompra ? responsedata.OrdenCompra : "",
      detalles_compra: responsedata.detalles_compra ? responsedata.detalles_compra : "",
      CodigoPostal: responsedata.codepostal ? responsedata.codepostal : "",
    };

    formData.append(
      "ActualizarEntregable",
      JSON.stringify({
        ...ActualizarEntregable,
      })
    );

    // formData.append("token", data.tokenSecret);
    formData.append("imagen", imagen);
    formData.append("user", user_name);
    formData.append("tipo", "OCR");
    const send = await axios.post("/creame-dashboard", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (send.data === "archivos enviados correctamente") {
      Swal({
        title: "ENVIO CORRECTO",
        text: "Archivos enviados correctamente",
        icon: "success",
        buttons: "Aceptar",
      });
      handlerCancel();
    }
  };

  const conetionMicrosoft = async () => {
    if (imagen) {
      LoginMicrosoft()
        .then((data) => {
          if (data) {
            sendData(data);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      Swal({
        title: "SUBA UNA IMAGEN",
        text: "Escane y suba una imagen",
        icon: "warning",
        buttons: "Aceptar",
      });
    }
  };

  const handlerScan = async (e) => {
    try {
      locations();
    } catch (error) {
      console.log("error", error);
    }
  };

  const handlerCancel = () => {
    setImageLoaded(false);
    setIsChecked(false);
    setResponsedata({
      nit: "",
      numFact: "",
      doc: "",
      total: "",
      totalSinIva: "",
      nombre: "",
      razon_social: "",
      rete: "",
      retePorc: "",
      iva: "",
      ivaPorc: "",
      fecha: "",
      concepto: "",
      municipio: "",
      codepostal: "",
      ipc: "",
      Descripcion: "",
      ica: "",
      NumFactura: "",
      Direccion: "",
      OrdenCompra: "",
      icui: "",
      detalles_compra: "",
    });
    setFillData(false);
    setImageSrc(null);
  };

  const handlerSend = (e) => {
    e.preventDefault();
    conetionMicrosoft();
  };

  const validaEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleOnChange = (e) => {
    let { name, value } = e.target;
    setResponsedata({
      ...responsedata,
      [name]: value,
    });
  };
  const handlerAnticipo = () => {};

  function handleDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    handlerValidation2(files);
  }

  const handleFileChange2 = (files) => {
    setImageLoaded(true);
    if (files && files.length > 0) {
      const file = files[0];
      imagen = file;
      console.log(file, "file changed");
      const reader = new FileReader();
      console.log(reader.result, "eeeeeerrrrrrdsdsdf");
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (imagen.name.split(".")[1] === "pdf") {
          setImageSrc(logoPDF);
        } else {
          setImageSrc(reader.result);
        }
      };
    }
  };

  const handlerValidation2 = (event) => {
    const input = event;
    if (input.length > 0) {
      const file = input[0];
      const Extensions = [".jpg", ".jpeg", ".png", ".pdf"];
      const fileExtension = file.name.slice(
        ((file.name.lastIndexOf(".") - 1) >>> 0) + 2
      );
      if (!Extensions.includes("." + fileExtension.toLowerCase())) {
        Swal({
          title: "ARCHIVO INCORRECTO",
          text: "Debe seleccionar un archivo .JPG, .JPEG, .PNG o .PDF",
          icon: "warning",
          buttons: "Aceptar",
        });
        input.value = "";
      } else {
        handleFileChange2(input);
      }
    }
  };

  const handleCheckboxChange = () => {
    setImageSrc(null);
    setIsChecked(!isChecked);
    if (!isChecked) {
      //
    } else {
      setImageLoaded(false);
    }
  };
  return (
    <div className="mx-auto md:px-24 p-2 xl:px-40 w-full ">
      <div className="bg-azulCreame peer block min-h-[auto] w-full text-neutral-950 rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none mb-5">
        <div className="w-full flex flex-row">
          <div className="w-full flex flex-row justify-between">
            <div className="inputIntLeftDrop">
              {justSelected ? (
                <div className="block text-white">
                  <button onClick={toggleDropdown}>
                    <span>{renderSelectedOptions()}</span>
                  </button>
                </div>
              ) : (
                <div className="blockNoSelected text-white">
                  <button onClick={toggleDropdown}>
                    <span>Seleccionar opciones</span>
                  </button>
                </div>
              )}
              {isOpen && (
                <div className="options bg-grayCreame absolute rounded">
                  {renderOptions()}
                </div>
              )}
            </div>
            <input
              className="w-3/6"
              placeholder="$000.000.00"
              value={prepayment ? prepayment.Valor.toString() : ""}
              onChange={handlerAnticipo}
            />
          </div>
        </div>
      </div>

      {/**<form className="" onSubmit={handlerSend}>*/}
      <form className="" onSubmit={sendData}>
        <div>
          <div className="flex">
            <input
              type="checkbox"
              name="rut"
              checked={isChecked}
              onChange={handleCheckboxChange}
            ></input>
            <p className="text-naranjaCreame text-xl font-Horatio">
              Desea enviar un RUT U OTRO Archivo seleccione esta opcion
            </p>
          </div>
          {isChecked ? (
            // <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mx-auto mb-10">
            <div className="">
              <div className="">
                <p className="text-sm">
                  * Para los proveedores obligados a expedir factura electrónica
                  y los no responsables de IVA no obligados a facturar
                  electrónicamente es obligatorio adjuntar el RUT
                </p>
                <input
                  type="text"
                  name="Descripcion"
                  className="w-full border rounded-md p-2 border-azulCreame my-4"
                  value={responsedata.Descripcion}
                  onChange={handleOnChange}
                  onKeyDown={(e) => {
                    validaEnter(e);
                  }}
                  placeholder="Escribe aquí la descripción del envío del RUT"
                ></input>
              </div>
            </div>
          ) : null}
        </div>
        <div className="">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mx-auto ">
            {imageSrc ? (
              <div className="  flex justify-center items-center  ">
                <div className=" text-center rounded-lg  overflow-hidden bg-slate-200">
                  <div className="rounded-lg grid grid-rows-1  bg-azulCreame p-4 h-full">
                    {/* Imagen */}
                    <div className="flex justify-center items-center overflow-hidden">
                      <img
                        className="w-full max-h-[60vh] object-contain rounded-lg"
                        src={imageSrc}
                        alt=""
                      />
                    </div>

                    {/* Botones */}
                    <div className="flex flex-wrap justify-center items-center gap-4 mt-2">
                      {/* Botón Cancelar */}
                      <div className="hover:bg-slate-300 w-32 h-14 flex items-center justify-center border-2 rounded-full border-gray-300 bg-gray-50 shadow-lg transition">
                        <button
                          className="flex flex-col items-center justify-center w-full h-full"
                          type="button"
                          onClick={handlerCancel}
                        >
                          <GiCancel size={24} />
                          <p className="text-xs sm:text-sm">Cancelar</p>
                        </button>
                      </div>

                      {/* Botón Escanear */}
                      {!isChecked && (
                        <div className="hover:bg-slate-300 w-32 h-14 flex items-center justify-center border-2 rounded-full border-gray-300 bg-gray-50 shadow-lg transition">
                          <button
                            className="flex flex-col items-center justify-center w-full h-full"
                            type="button"
                            onClick={handlerScan}
                          >
                            <BiScan size={24} />
                            <p className="text-xs sm:text-sm">Escanear</p>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center w-full ">
                <div
                  className="flex flex-col items-center justify-center border-2 border-gray-300 rounded-lg lg:m-0 w-full h-[40vh] lg:h-[70vh] md:h-[40vh] sm:h-[90vh]"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e)}
                >
                  <div className=" w-48 h-48 bg-naranjaCreame hover:bg-lightBlueCreame flex items-center justify-center border-2 rounded-full border-gray-400 border-solid cursor-pointer shadow-xl">
                    <label className="">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <p className="text-xs text-white">
                          <FontAwesomeIcon
                            icon={faCloudArrowUp}
                            className="h-12"
                          />
                        </p>
                      </div>
                      <input
                        name="image"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        // ref={fileInputRef}
                        accept={
                          isChecked
                            ? ".jpg, .jpeg, .png, .pdf"
                            : ".jpg, .jpeg, .png, .pdf"
                        }
                        onInput={handlerValidation}
                      />
                    </label>
                  </div>
                  <div className="flex flex-col items-center justify-center mt-4">
                    <p>ARRASTRA O SELECCIONA UN ARCHIVO</p>
                  </div>
                </div>
              </div>
            )}

            <div
              className={`grid grid-cols-2 gap-4 rounded-lg mx-auto w-full border-2 border-gray-300 p-6 bg-azulCreame   ${
                imageLoaded && !isChecked
                  ? null
                  : "pointer-events-none opacity-50 bg-darkGrayCreame"
              }`}
            >
              {/* CONCEPTO */}
              <div className="col-span-1 flex items-center justify-center">
                <div
                  className="relative mb-3 w-full"
                  data-te-input-wrapper-init
                >
                  <input
                    value={responsedata.concepto}
                    name="concepto"
                    onChange={handleOnChange}
                    onKeyDown={(e) => {
                      validaEnter(e);
                    }}
                    type="text"
                    className={`bg-white peer  block min-h-[auto] w-full text-neutral-950 rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none shadow-lg
                    ${
                      responsedata.concepto
                        ? "peer peer-focus:z-10 data-[te-input-state-active]:placeholder:opacity-100 focus:placeholder:opacity-100 "
                        : ""
                    }`}
                  />
                  <label
                    htmlFor="Concepto"
                    className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6]  transition-all duration-200 ease-out 
                    ${
                      responsedata.concepto
                        ? "-translate-y-6 scale-75  text-white"
                        : "text-neutral-950"
                    }`}
                  >
                    Tipo Documento
                  </label>
                </div>
              </div>

              {/* NUMERO FACTURA */}
              <div className="col-span-1 flex items-center justify-center">
                <div
                  className="relative mb-3 w-full"
                  data-te-input-wrapper-init
                >
                  <input
                    value={responsedata.NumFactura}
                    name="NumFactura"
                    onChange={handleOnChange}
                    onKeyDown={(e) => {
                      validaEnter(e);
                    }}
                    type="text"
                    className={`bg-white peer  block min-h-[auto] w-full text-neutral-950 rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none shadow-lg
                    ${
                      responsedata.NumFactura
                        ? "peer peer-focus:z-10 data-[te-input-state-active]:placeholder:opacity-100 focus:placeholder:opacity-100 "
                        : ""
                    }`}
                  />
                  <label
                    htmlFor="NumFactura"
                    className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6]  transition-all duration-200 ease-out 
                    ${
                      responsedata.NumFactura
                        ? "-translate-y-6 scale-75  text-white"
                        : "text-neutral-950"
                    }`}
                  >
                    Numero Factura
                  </label>
                </div>
              </div>

              {/** Orden de compra */}
              {/* *****************************************/}
              <div className="flex items-center justify-center col-span-1">
                <div
                  className="relative mb-3 w-full  "
                  data-te-input-wrapper-init
                >
                  <input
                    value={responsedata.OrdenCompra}
                    name="OrdenCompra"
                    onChange={handleOnChange}
                    onKeyDown={(e) => {
                      validaEnter(e);
                    }}
                    type="text"
                    className={`bg-white peer  block min-h-[auto] w-full text-neutral-950 rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none shadow-lg
                    ${
                      responsedata.OrdenCompra
                        ? "peer peer-focus:z-10 data-[te-input-state-active]:placeholder:opacity-100 focus:placeholder:opacity-100"
                        : ""
                    }`}
                    id="OrdenCompra"
                  />
                  <label
                    htmlFor="OrdenCompra"
                    className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6]  transition-all duration-200 ease-out 
                      ${
                        responsedata.OrdenCompra
                          ? "-translate-y-6 scale-75  text-white"
                          : "text-neutral-950"
                      }`}
                  >
                    Orden de compra
                  </label>
                </div>
              </div>

              {/* NIT */}
              <div className="flex items-center justify-center col-span-1  ">
                <div
                  className="relative mb-3 w-full"
                  data-te-input-wrapper-init
                >
                  <input
                    value={responsedata.nit}
                    name="nit"
                    onChange={handleOnChange}
                    onKeyDown={(e) => {
                      validaEnter(e);
                    }}
                    type="text"
                    className={`bg-white peer  block min-h-[auto] w-full text-neutral-950 rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none shadow-lg
                    ${
                      responsedata.nit
                        ? "peer peer-focus:z-10 data-[te-input-state-active]:placeholder:opacity-100 focus:placeholder:opacity-100 "
                        : ""
                    }`}
                    id="NIT/CC"
                  />
                  <label
                    htmlFor="nit"
                    className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6]  transition-all duration-200 ease-out 
                      ${
                        responsedata.nit
                          ? "-translate-y-6 scale-75  text-white"
                          : "text-neutral-950"
                      }`}
                  >
                    NIT/CC
                  </label>
                </div>
              </div>

              {/* NOMBRE */}
              <div className="flex items-center justify-center col-span-1">
                <div
                  className="relative mb-3 w-full  "
                  data-te-input-wrapper-init
                >
                  <input
                    value={responsedata.razon_social}
                    name="razon_social"
                    onChange={handleOnChange}
                    onKeyDown={(e) => {
                      validaEnter(e);
                    }}
                    type="text"
                    className={`bg-white peer  block min-h-[auto] w-full text-neutral-950 rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none shadow-lg
                    ${
                      responsedata.razon_social
                        ? "peer peer-focus:z-10 data-[te-input-state-active]:placeholder:opacity-100 focus:placeholder:opacity-100 "
                        : ""
                    }`}
                    id="Nombre"
                  />
                  <label
                    htmlFor="Nombre"
                    className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6]  transition-all duration-200 ease-out 
                ${
                  responsedata.razon_social
                    ? "-translate-y-6 scale-75  text-white"
                    : "text-neutral-950"
                }`}
                  >
                    Razon social
                  </label>
                </div>
              </div>

              {/* MUNICIPIO */}
              <div className="flex items-center justify-center col-span-1">
                <div
                  className="relative mb-3 w-full  "
                  data-te-input-wrapper-init
                >
                  <input
                    value={responsedata.municipio}
                    name="municipio"
                    onChange={handleOnChange}
                    onKeyDown={(e) => {
                      validaEnter(e);
                    }}
                    type="text"
                    className={`bg-white peer  block min-h-[auto] w-full text-neutral-950 rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none shadow-lg
                    ${
                      responsedata.municipio
                        ? "peer peer-focus:z-10 data-[te-input-state-active]:placeholder:opacity-100 focus:placeholder:opacity-100 "
                        : ""
                    }`}
                    id="municipio"
                  />
                  <label
                    htmlFor="municipio"
                    className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6]  transition-all duration-200 ease-out 
                      ${
                        responsedata.municipio
                          ? "-translate-y-6 scale-75  text-white"
                          : "text-neutral-950"
                      }`}
                  >
                    Municipio / Ciudad
                  </label>
                </div>
              </div>

              {/* Direccion */}
              <div className="flex items-center justify-center col-span-1">
                <div
                  className="relative mb-3 w-full  "
                  data-te-input-wrapper-init
                >
                  <input
                    value={responsedata.Direccion}
                    name="Direccion"
                    onChange={handleOnChange}
                    onKeyDown={(e) => {
                      validaEnter(e);
                    }}
                    type="text"
                    className={`bg-white peer  block min-h-[auto] w-full text-neutral-950 rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none shadow-lg
                    ${
                      responsedata.Direccion
                        ? "peer peer-focus:z-10 data-[te-input-state-active]:placeholder:opacity-100 focus:placeholder:opacity-100 "
                        : ""
                    }`}
                    id="Direccion"
                  />
                  <label
                    htmlFor="Direccion"
                    className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6]  transition-all duration-200 ease-out 
                      ${
                        responsedata.Direccion
                          ? "-translate-y-6 scale-75  text-white"
                          : "text-neutral-950"
                      }`}
                  >
                    Dirección
                  </label>
                </div>
              </div>

              {/* CODIGO POSTAL */}
              <div className="flex items-center justify-center col-span-1">
                <div
                  className="relative mb-3 w-full  "
                  data-te-input-wrapper-init
                >
                  <input
                    value={responsedata.codepostal}
                    name="codepostal"
                    onChange={handleOnChange}
                    onKeyDown={(e) => {
                      validaEnter(e);
                    }}
                    type="text"
                    className={`bg-white peer  block min-h-[auto] w-full text-neutral-950 rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none shadow-lg
                    ${
                      responsedata.codepostal
                        ? "peer peer-focus:z-10 data-[te-input-state-active]:placeholder:opacity-100 focus:placeholder:opacity-100 "
                        : ""
                    }`}
                    id="codepostal"
                  />
                  <label
                    htmlFor="codepostal"
                    className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6]  transition-all duration-200 ease-out 
                      ${
                        responsedata.codepostal
                          ? "-translate-y-6 scale-75  text-white"
                          : "text-neutral-950"
                      }`}
                  >
                    Cod postal
                  </label>
                </div>
              </div>

              {/* VALOR PAGADO */}
              <div className="flex items-center justify-center col-span-1 ">
                <div
                  className="relative mb-3 w-full  "
                  data-te-input-wrapper-init
                >
                  <input
                    value={responsedata.total}
                    name="total"
                    onChange={handleOnChange}
                    onKeyDown={(e) => {
                      validaEnter(e);
                    }}
                    type="number"
                    className={`bg-white peer  block min-h-[auto] w-full text-neutral-950 rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none shadow-lg
                    ${
                      responsedata.total
                        ? "peer peer-focus:z-10 data-[te-input-state-active]:placeholder:opacity-100 focus:placeholder:opacity-100 "
                        : ""
                    }`}
                    id="Valor pagado"
                  />
                  <label
                    htmlFor="total"
                    className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6]  transition-all duration-200 ease-out 
                      ${
                        responsedata.total
                          ? "-translate-y-6 scale-75  text-white"
                          : "text-neutral-950"
                      }`}
                  >
                    Total
                  </label>
                </div>
              </div>

              {/* SUBTOTAL */}
              <div className="flex items-center justify-center col-span-1">
                <div
                  className="relative mb-3 w-full  "
                  data-te-input-wrapper-init
                >
                  <input
                    value={responsedata.totalSinIva}
                    name="totalSinIva"
                    onChange={handleOnChange}
                    onKeyDown={(e) => {
                      validaEnter(e);
                    }}
                    type="number"
                    className={`bg-white peer  block min-h-[auto] w-full text-neutral-950 rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none shadow-lg
                    ${
                      responsedata.totalSinIva
                        ? "peer peer-focus:z-10 data-[te-input-state-active]:placeholder:opacity-100 focus:placeholder:opacity-100 "
                        : ""
                    }`}
                    id="subtotal"
                  />
                  <label
                    htmlFor="subtotal"
                    className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6]  transition-all duration-200 ease-out 
                      ${
                        responsedata.totalSinIva
                          ? "-translate-y-6 scale-75  text-white"
                          : "text-neutral-950"
                      }`}
                  >
                    Sub total
                  </label>
                </div>
              </div>

              {/* IVA */}
              <div className="flex items-center justify-center col-span-1">
                <div
                  className="relative mb-3 w-full  "
                  data-te-input-wrapper-init
                >
                  <input
                    value={responsedata.iva}
                    name="iva"
                    onChange={handleOnChange}
                    onKeyDown={(e) => {
                      validaEnter(e);
                    }}
                    type="number"
                    className={`bg-white peer  block min-h-[auto] w-full text-neutral-950 rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none shadow-lg
                    ${
                      responsedata.iva
                        ? "peer peer-focus:z-10 data-[te-input-state-active]:placeholder:opacity-100 focus:placeholder:opacity-100 "
                        : ""
                    }`}
                    id="Valor Iva"
                  />
                  <label
                    htmlFor="iva"
                    className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6]  transition-all duration-200 ease-out 
                      ${
                        responsedata.iva
                          ? "-translate-y-6 scale-75  text-white"
                          : "text-neutral-950"
                      }`}
                  >
                    IVA
                  </label>
                </div>
              </div>

              {/* IVA */}
              <div className="flex items-center justify-center col-span-1">
                <div
                  className="relative mb-3 w-full  "
                  data-te-input-wrapper-init
                >
                  <input
                    value={responsedata.rete}
                    name="rete"
                    onChange={handleOnChange}
                    onKeyDown={(e) => {
                      validaEnter(e);
                    }}
                    type="number"
                    className={`bg-white peer  block min-h-[auto] w-full text-neutral-950 rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none shadow-lg
                    ${
                      responsedata.rete
                        ? "peer peer-focus:z-10 data-[te-input-state-active]:placeholder:opacity-100 focus:placeholder:opacity-100 "
                        : ""
                    }`}
                    id="Valor Rete"
                  />
                  <label
                    htmlFor="Valor Rete"
                    className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6]  transition-all duration-200 ease-out 
                      ${
                        responsedata.rete
                          ? "-translate-y-6 scale-75  text-white"
                          : "text-neutral-950"
                      }`}
                  >
                    Retefuente
                  </label>
                </div>
              </div>

              {/* IPC || INC */}
              <div className="flex items-center justify-center col-span-1">
                <div
                  className="relative mb-3 w-full  "
                  data-te-input-wrapper-init
                >
                  <input
                    value={responsedata.ipc}
                    name="ipc"
                    onChange={handleOnChange}
                    onKeyDown={(e) => {
                      validaEnter(e);
                    }}
                    type="text"
                    className={`bg-white peer  block min-h-[auto] w-full text-neutral-950 rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none shadow-lg
                    ${
                      responsedata.ipc
                        ? "peer peer-focus:z-10 data-[te-input-state-active]:placeholder:opacity-100 focus:placeholder:opacity-100 "
                        : ""
                    }`}
                    id="ipc"
                  />
                  <label
                    htmlFor="ipc"
                    className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6]  transition-all duration-200 ease-out 
                      ${
                        responsedata.ipc
                          ? "-translate-y-6 scale-75  text-white"
                          : "text-neutral-950"
                      }`}
                  >
                    INC{" "}
                  </label>
                </div>
              </div>

              {/* ICA */}
              <div className="flex items-center justify-center col-span-1">
                <div
                  className="relative mb-3 w-full  "
                  data-te-input-wrapper-init
                >
                  <input
                    value={responsedata.ica}
                    name="ica"
                    onChange={handleOnChange}
                    onKeyDown={(e) => {
                      validaEnter(e);
                    }}
                    type="number"
                    className={`bg-white peer  block min-h-[auto] w-full text-neutral-950 rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none shadow-lg
                    ${
                      responsedata.ica
                        ? "peer peer-focus:z-10 data-[te-input-state-active]:placeholder:opacity-100 focus:placeholder:opacity-100"
                        : ""
                    }`}
                    id="ica"
                  />
                  <label
                    htmlFor="ica"
                    className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6]  transition-all duration-200 ease-out 
                      ${
                        responsedata.ica
                          ? "-translate-y-6 scale-75  text-white"
                          : "text-neutral-950"
                      }`}
                  >
                    ICA
                  </label>
                </div>
              </div>

              {/** ICUI Impuestos Ultra Procesados */}
              {/* *****************************************/}
              <div className="flex items-center justify-center col-span-1">
                <div
                  className="relative mb-3 w-full  "
                  data-te-input-wrapper-init
                >
                  <input
                    value={responsedata.icui}
                    name="icui"
                    onChange={handleOnChange}
                    onKeyDown={(e) => {
                      validaEnter(e);
                    }}
                    type="text"
                    className={`bg-white peer  block min-h-[auto] w-full text-neutral-950 rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none shadow-lg
                    ${
                      responsedata.icui
                        ? "peer peer-focus:z-10 data-[te-input-state-active]:placeholder:opacity-100 focus:placeholder:opacity-100"
                        : ""
                    }`}
                    id="icui"
                  />
                  <label
                    htmlFor="icui"
                    className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6]  transition-all duration-200 ease-out 
                      ${
                        responsedata.icui
                          ? "-translate-y-6 scale-75  text-white"
                          : "text-neutral-950"
                      }`}
                  >
                    ICUI
                  </label>
                </div>
              </div>

              {/* FECHA */}
              <div className="flex items-center justify-center col-span-1">
                <div
                  className="relative mb-3 w-full  "
                  data-te-input-wrapper-init
                >
                  <input
                    value={responsedata.fecha}
                    name="fecha"
                    onChange={handleOnChange}
                    onKeyDown={(e) => {
                      validaEnter(e);
                    }}
                    type="text"
                    className={`bg-white peer  block min-h-[auto] w-full text-neutral-950 rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none shadow-lg
                    ${
                      responsedata.fecha
                        ? "peer peer-focus:z-10 data-[te-input-state-active]:placeholder:opacity-100 focus:placeholder:opacity-100 "
                        : ""
                    }`}
                    id="Fecha"
                  />
                  <label
                    htmlFor="Fecha"
                    className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6]  transition-all duration-200 ease-out 
                      ${
                        responsedata.fecha
                          ? "-translate-y-6 scale-75  text-white"
                          : "text-neutral-950"
                      }`}
                  >
                    Fecha
                  </label>
                </div>
              </div>

              {/** DETALLES DE LA COMPRA CONCEPTO */}
              {/* *****************************************/}
              <div className="col-span-2 flex items-center justify-center">
                <div
                  className="relative mb-3 w-full  "
                  data-te-input-wrapper-init
                >
                  <textarea
                    value={responsedata.detalles_compra}
                    name="detalles_compra"
                    onChange={handleOnChange}
                    onKeyDown={(e) => {
                      validaEnter(e);
                    }}
                    type=""
                    className={`bg-white peer  block min-h-[auto] w-full text-neutral-950 rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none shadow-lg
                    ${
                      responsedata.detalles_compra
                        ? "peer peer-focus:z-10 data-[te-input-state-active]:placeholder:opacity-100 focus:placeholder:opacity-100"
                        : ""
                    }`}
                    id="detalles_compra"
                  />
                  <label
                    htmlFor="detalles_compra"
                    className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6]  transition-all duration-200 ease-out 
                      ${
                        responsedata.detalles_compra
                          ? "-translate-y-6 scale-75  text-white"
                          : "text-neutral-950"
                      }`}
                  >
                    Concepto
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" text-center">
          <button
            type="submit"
            className={`mt-10 w-full inline-block rounded ${
              (imageLoaded && isChecked) || (imageLoaded && fillData)
                ? "bg-naranjaCreame hover:bg-azulCreame hover:border-turquesaCreame hover:border  hover:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)] focus:bg-turquesaCreame focus:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)] focus:outline-none focus:ring-0 active:bg-info-700 active:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)]"
                : "opacity-50 bg-darkGrayCreame"
            } px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#54b4d3] transition duration-150 ease-in-out   md:w-1/2`}
            disabled={!imageLoaded && !isChecked}
          >
            Enviar
          </button>
        </div>
      </form>
      {isLoading ? (
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50">
          <div className="loader"></div>
        </div>
      ) : null}
    </div>
  );
};

export default Gastos;
