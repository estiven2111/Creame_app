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
let imagenRUT = null;
let imagenOTRO = null;
let latitude = 0;
let longitude = 0;
let hasLogicExecuted = false;
const Gastos = () => {
  const { infoProject, anticipos, inputValue, topSecret, searchText } =
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
  const [nomProyect, setNomproyect] = useState();
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

        setNomproyect(searchText);
      }
    };
    ActulizarOptions();
  }, [anticipos]);

  // const toggleDropdown = () => {
  //   SetJustSelected(false);
  //   setIsOpen(!isOpen);
  // };
  // const handleOptionSelect = (option) => {
  //   if (!selectedOptions.includes(option)) {
  //     setSelectedOptions([option]);
  //   }
  //   setIsOpen(false);
  //   SetJustSelected(true);
  // };

  // const renderOptions = () => {
  //   return totalAnt.map((option, index) => (
  //     <button
  //       className="flex m-1 px-1 cursor-pointer bg-white rounded"
  //       key={index}
  //       onClick={() => {
  //         handleOptionSelect(
  //           option.sku + option.DetalleConcepto + option.NumeroComprobante
  //         );
  //         setPrepayment(option);
  //       }}
  //     >
  //       <span
  //         style={{
  //           overflow: "hidden",
  //           whiteSpace: "nowrap",
  //           textOverflow: "ellipsis",
  //         }}
  //       >
  //         {option.sku +
  //           " " +
  //           option.DetalleConcepto +
  //           " " +
  //           option.NumeroComprobante}
  //       </span>
  //     </button>
  //   ));
  // };

  const toggleDropdown = () => {
    SetJustSelected(false);
    setIsOpen((prev) => !prev);
  };

  const handleOptionSelect = (optionObj) => {
    const value = ` ${optionObj.Observaciones}`;
    // const value = `${totalAnt[0].IdCentroCostos}-${optionObj.sku} ${optionObj.DetalleConcepto} ${nomProyect} ${optionObj.NumeroComprobante}`;

    if (!selectedOptions.includes(value)) {
      setSelectedOptions([value]);
    } else {
      setSelectedOptions([]);
    }

    setPrepayment(optionObj);
    setIsOpen(false);
    SetJustSelected(true);
  };

  const renderOptions = () => {
    return (
      <>
        {/* Opción de limpiar selección */}
        <button
          className="flex m-1 px-1 cursor-pointer bg-white rounded hover:bg-gray-100"
          onClick={() => {
            setSelectedOptions([]);
            setPrepayment(null);
            SetJustSelected(false);
            setIsOpen(false);
          }}
        >
          <span className="truncate">Seleccionar opciones</span>
        </button>

        {/* Opciones reales */}
        {/* {totalAnt.map((option, index) => {
          const label = `${option.sku} ${option.DetalleConcepto} ${searchText} ${option.NumeroComprobante}`;
          return (
            <button
              className="flex m-1 px-1 cursor-pointer bg-white rounded hover:bg-gray-100"
              key={index}
              onClick={() => handleOptionSelect(option)}
            >
              <span
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
               
              </span>
            </button>
          );
        })} */}

        {totalAnt.map((option, index) => {
          const nonp = nomProyect; // <-- asegúrate que esto tiene valor
          const label = ` ${option.Observaciones}`;
          // const label = `${totalAnt[0].IdCentroCostos}-${option.sku} ${option.DetalleConcepto} ${nonp} ${option.NumeroComprobante}`;

          return (
            <button
              className="flex m-1 px-1 cursor-pointer bg-white rounded hover:bg-gray-100"
              key={index}
              onClick={() => handleOptionSelect(option)}
            >
              <span
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </>
    );
  };

  const renderSelectedOptions = () => {
    return selectedOptions.length > 0
      ? selectedOptions[0]
      : "Seleccionar opciones";
  };

  // const renderSelectedOptions = () => {
  //   return (
  //     <div>
  //       {selectedOptions.map((option, index) => {
  //         return <p key={index}>{option}</p>;
  //       })}
  //     </div>
  //   );
  // };

  useEffect(() => {
    initTE({ Input });
  });
  const [opencam, setOpencam] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageSrcRUT, setImageSrcRUT] = useState(null);
  const [imageSrcOTRO, setImageSrcOTRO] = useState(null);
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
    Tipo_Documento: "",
    municipio: "",
    codepostal: "",
    ipc: "",
    Descripcion: "",
    ica: "",
    NumFactura: "",
    OrdenCompra: "",
    Direccion: "",
    icui: "",
    concepto: "",
  });

  const openCamera = () => {
    setOpencam(!opencam);
  };
  const imageData = (uri) => {
    setImageSrc(uri);
    setImageSrcRUT(uri);
    setImageSrcOTRO(uri);
  };

  // const handleFileChange = (e) => {
  //   e.preventDefault();
  //   setImageLoaded(true);
  //   const files = e.target.files;
  //   if (files && files.length > 0) {
  //     const file = files[0];
  //     imagen = file;
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       if (imagen.name.split(".")[1] === "pdf") {
  //         setImageSrc(logoPDF);
  //       } else {
  //         setImageSrc(reader.result);
  //       }
  //     };
  //   }
  //   setIsLoading(false);
  // };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setImageLoaded(true);
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

  // const handleFileChange1 = (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   const files = e.target.files;
  //   if (files && files.length > 0) {
  //     const file = files[0];
  //     imagenRUT = file;
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       if (imagenRUT.name.split(".")[1] === "pdf") {
  //         setImageSrcRUT(logoPDF);
  //       } else {
  //         setImageSrcRUT(reader.result);
  //       }
  //     };
  //   }
  //   setIsLoading(false);
  // };

  const inputRUTRef = useRef(null); // input oculto

  const handleAlertAndOpenInput = () => {
    Swal({
      title: "SELECCIÓN DE RUT",
      text: "Recuerde que debe ser un Documento RUT, en formato .JPG, .JPEG, .PNG o .PDF",
      icon: "warning",
      buttons: "Aceptar",
    }).then(() => {
      // Después del Aceptar, abrimos el input oculto
      inputRUTRef.current?.click();
      handleFileChange1();
    });
  };

  const handleFileChange1 = (e) => {
    const files = e.target.files;
    setImageLoaded(true);
    if (files && files.length > 0) {
      const file = files[0];
      imagenRUT = file;

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        if (imagenRUT.name.split(".")[1] === "pdf") {
          setImageSrcRUT(logoPDF);
        } else {
          setImageSrcRUT(reader.result);
        }
      };
    }
  };

  //   const handleFileChange2 = (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   const files = e.target.files;
  //   if (files && files.length > 0) {
  //     const file = files[0];
  //     imagenOTRO = file;
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       if (imagenOTRO.name.split(".")[1] === "pdf") {
  //         setImageSrcOTRO(logoPDF);
  //       } else {
  //         setImageSrcOTRO(reader.result);
  //       }
  //     };
  //   }
  //   setIsLoading(false);
  // };

  const handleFileChange2 = (e) => {
    const files = e.target.files;
    setImageLoaded(true);
    if (files && files.length > 0) {
      const file = files[0];
      imagenOTRO = file;

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        if (imagenOTRO.name.split(".")[1] === "pdf") {
          setImageSrcOTRO(logoPDF);
        } else {
          setImageSrcOTRO(reader.result);
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
      setIsLoading(true);
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
      setIsLoading(false);
    } catch (error) {}
  };

  const peticionOcr = async () => {
    try {
      setIsLoading(true);
      const user_name = localStorage.getItem("name");
      const formData = new FormData();
      formData.append("imagen", imagen);

      formData.append("latitud", latitude);
      formData.append("longitud", longitude);

      const response = await axios.post(`/proyect/ocr`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
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
          Tipo_Documento: response.data.Tipo_Documento,
          ipc: response.data.ipc,
          municipio,
          codepostal,
          // Descripcion,
          ica: response.data.ica,
          NumFactura: response.data.NumFactura,
          Direccion: response.data.Direccion,
          OrdenCompra: response.data.OrdenCompra,
          icui: response.data.icui,
          concepto: response.data.concepto,
        });
        // console.log(responsedata);
        setFillData(true);
        setIsLoading(false);
      }

      if (response.data === "Error al procesar con IA") {
        Swal({
          title: "NO SE PUDO ANALIZAR LA INFORMACIÓN",
          text: "Por favor, vuelva a escanear el documento.",
          icon: "warning",
          buttons: "Aceptar",
        }).then((confirmed) => {
          if (confirmed) {
            setFillData(false);
            setIsLoading(false);
            handlerCancel();
            handlerCancel1();
            handlerCancel2();
          }
        });
      }
    } catch (error) {
      // console.error(error); // imprime el error completo para depuración

      // puedes leer el status con seguridad así:
      const status = error.response?.status;

      if (status === 500) {
        Swal({
          title: "NO SE PUDO ANALIZAR LA INFORMACIÓN",
          text: "Porfavor, vuelva a escanear el documento.",
          icon: "warning",
          buttons: "Aceptar",
        });
        setFillData(true);
        setIsLoading(false);
        handlerCancel();
        handlerCancel1();
        handlerCancel2();
      } else {
        Swal({
          title: "NO SE PUDO ANALIZAR LA INFORMACIÓN",
          text: "Por favor, vuelva a escanear el documento.",
          icon: "warning",
          buttons: "Aceptar",
        });
        setFillData(true);
        setIsLoading(false);
        handlerCancel();
        handlerCancel1();
        handlerCancel2();
      }
    }
  };

  const sendData = async (data) => {
    setIsLoading(true);

    const formData = new FormData();

    const user_name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const docEmpleado = localStorage.getItem("doc_empleado");

    const currentDate = new Date();
    // const day = String(currentDate.getDate()).padStart(2, "0"); // Día del mes con dos dígitos
    // const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Mes (0 - 11) con dos dígitos
    // const year = String(currentDate.getFullYear()).slice(2); // Año con dos dígitos
    // const hours = String(currentDate.getHours()).padStart(2, "0"); // Hora con dos dígitos
    // const minutes = String(currentDate.getMinutes()).padStart(2, "0"); // Minutos con dos dígitos
    // const formatDate = new Date().toISOString().split("T")[0];

    const year = currentDate.getFullYear(); // Año con 4 dígitos
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Mes con 2 dígitos
    const day = String(currentDate.getDate()).padStart(2, "0"); // Día con 2 dígitos
    const hours = String(currentDate.getHours()).padStart(2, "0"); // Hora con 2 dígitos
    const minutes = String(currentDate.getMinutes()).padStart(2, "0"); // Minutos con 2 dígitos
    const seconds = String(currentDate.getSeconds()).padStart(2, "0"); // Segundos con 2 dígitos

    const formatDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    const nom_img = `${user_name}_${day}${month}${year}_${hours}${minutes}.jpg`;

    const ActualizarEntregable = {
      ...infoProject.input,
      N_DocumentoEmpleado: docEmpleado,
      // Nombre_Empleado: "ESTIVEN"
      Nombre_Empleado: user_name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""),

      Fecha: formatDate, //
      FechaComprobante: responsedata.fecha
        ? responsedata.fecha + " 00:00:00.000"
        : formatDate
        ? responsedata.fecha.split("/").join("-")
        : "", //
      ValorComprobante: responsedata.total ? responsedata.total : 0, //
      NitComprobante: responsedata.nit ? responsedata.nit : "", //
      NombreComprobante: responsedata.concepto ? responsedata.concepto : "", //
      CiudadComprobante: responsedata.municipio ? responsedata.municipio : "", //
      DireccionComprobante: responsedata.Direccion
        ? responsedata.Direccion
        : "", //
      NumeroComprobante: prepayment ? prepayment.NumeroComprobante : "", //
      // CCostos: prepayment ? prepayment.IdCentroCostos.toString() : "", //
      idAnticipo: prepayment ? parseInt(prepayment.IdResponsable) : "", //
      ipc: responsedata.ipc ? responsedata.ipc : 0, //
      Sub_Total: responsedata.totalSinIva
        ? responsedata.totalSinIva
        : responsedata.total, //
      Descripcion: responsedata.Descripcion ? responsedata.Descripcion : "",
      iva: responsedata.iva ? responsedata.iva : 0,
      reteFuente: responsedata.rete ? responsedata.rete : 0,
      ica: responsedata.ica ? responsedata.ica : "",
      razon_social: responsedata.razon_social ? responsedata.razon_social : "",
      NumFactura: responsedata.NumFactura ? responsedata.NumFactura : "",
      Direccion: responsedata.Direccion ? responsedata.Direccion : "",
      icui: responsedata.icui ? responsedata.icui : "",
      OrdenCompra: responsedata.OrdenCompra ? responsedata.OrdenCompra : "",
      concepto: responsedata.concepto ? responsedata.concepto : "",
      CodigoPostal: responsedata.codepostal ? responsedata.codepostal : "",
    };

    formData.append(
      "ActualizarEntregable",
      JSON.stringify({
        ...ActualizarEntregable,
      })
    );

    formData.append("token", data.tokenSecret);
    formData.append("imagenOCR", imagen);
    formData.append("imagenRUT", imagenRUT);
    formData.append("imagenOTRO", imagenOTRO);
    formData.append("user", user_name);
    formData.append("tipo", "OCR");
    const send = await axios.post("/creame-dashboard", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setIsLoading(false);
    if (send.data === "archivos enviados correctamente") {
      Swal({
        title: "ENVIO CORRECTO",
        text: "Archivos enviados correctamente",
        icon: "success",
        buttons: "Aceptar",
      });
      handlerCancel();
      handlerCancel1();
      handlerCancel2();
    }
  };

  const conetionMicrosoft = async () => {
    if (imagen || imagenRUT || imagenOTRO) {
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
      Tipo_Documento: "",
      municipio: "",
      codepostal: "",
      ipc: "",
      Descripcion: "",
      ica: "",
      NumFactura: "",
      Direccion: "",
      OrdenCompra: "",
      icui: "",
      concepto: "",
    });
    imagen = "";
    setFillData(false);
    setImageSrc(null);
  };

  const handlerCancel1 = () => {
    imagenRUT = "";
    setImageSrcRUT(null);
  };
  const handlerCancel2 = () => {
    imagenOTRO = "";
    setImageSrcOTRO(null);
  };

  const handlerSend = (e) => {
    e.preventDefault();
    if (nomProyect.trim() === "" ){
    Swal({
          title: `CONFIRMACION DE ENVIO DE PROYECTO`,
          text: `Por favor, confirme que desea enviar el documento sin proyecto relacionado.`,
          icon: "info",
          buttons: ["SI", "NO"],
        }).then(async (res) => {
          if (!res) {
             conetionMicrosoft();
          }else{
            return;
          }
        })}else{
          conetionMicrosoft();
        }
  
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
    setImageSrcRUT(null);
    setImageSrcOTRO(null);
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
          <div className="w-full flex flex-row justify-between items-between">
            {/* <div className="inputIntLeftDrop">
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
            </div> */}
            <div className="inputIntLeftDrop relative">
              {/* Botón principal */}
              <div
                className={
                  justSelected
                    ? "block text-white"
                    : "blockNoSelected text-white"
                }
              >
                <button onClick={toggleDropdown} className="flex items-center">
                  {/* Flecha (opcional) */}
                  <svg
                    className="w-4 h-4 mr-2 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>

                  <span className="text-2xl">{renderSelectedOptions()}</span>
                </button>
              </div>

              {/* Opciones desplegadas */}
              {isOpen && (
                <div className="options bg-grayCreame absolute rounded z-10 shadow-md mt-1 max-h-60 overflow-y-auto text-2xl">
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

      <form className="" onSubmit={handlerSend}>
        {/* <form className="" onSubmit={sendData}> */}
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
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mx-auto mb-10">
              <div className="">
                <div className="">
                  <p className="text-sm">
                    * Para los proveedores obligados a expedir factura
                    electrónica y los no responsables de IVA no obligados a
                    facturar electrónicamente es obligatorio adjuntar el{" "}
                    <span className="font-bold text-naranjaCreame text-xl">
                      RUT
                    </span>
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

                {/** AGREGAR IMAGEN O ARCHIVO DE RUT  */}
                {imageSrcRUT ? (
                  <div className="flex flex-col items-center justify-center gap-4">
                    <img
                      className="w-full max-h-[30vh] object-contain rounded-lg"
                      src={imageSrcRUT}
                      alt="Vista previa del RUT"
                    />

                    <div className="hover:bg-slate-300 w-32 h-14 flex items-center justify-center border-2 rounded-full border-gray-300 bg-gray-50 shadow-lg transition">
                      <button
                        className="flex flex-col items-center justify-center w-full h-full"
                        type="button"
                        onClick={handlerCancel1}
                      >
                        <GiCancel size={24} />
                        <p className="text-xs sm:text-sm">Cancelar</p>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center w-full">
                    <div
                      className="flex flex-col items-center justify-center border-2 border-gray-300 rounded-lg lg:m-0 w-full h-[20vh] lg:h-[30vh] md:h-[20vh] sm:h-[50vh]"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file) {
                          handleFileChange1({ target: { files: [file] } });
                        }
                      }}
                    >
                      <div
                        className="w-36 h-36 bg-darkGrayCreame hover:bg-lightBlueCreame flex items-center justify-center border-2 rounded-full border-gray-400 border-solid cursor-pointer shadow-xl"
                        onClick={handleAlertAndOpenInput}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <p className="text-xs text-white">
                            <GoArchive size={40} />
                          </p>
                        </div>
                      </div>

                      <input
                        name="imageRUT"
                        type="file"
                        className="hidden"
                        ref={inputRUTRef}
                        onChange={handleFileChange1}
                        accept=".jpg, .jpeg, .png, .pdf"
                        onInput={handlerValidation}
                      />
                      <div className="flex flex-col items-center justify-center mt-4">
                        <p className="font-bold text-naranjaCreame text-xl">
                          RUT
                        </p>
                        <p>ARRASTRA O SELECCIONA EL RUT</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/** AGREGAR IMAGEN DE OTRO ARCHIVO  */}
              <div>
                <div className="">
                  <p className="text-sm">
                    Seleccione en esta opcion cualquier{" "}
                    <span className="font-bold text-naranjaCreame">OTRO</span>{" "}
                    archivo que desees enviar debes tener encuenta que tiene que
                    tener extencion ya sea PNG, JPG, JPEG, PDF{" "}
                    <span className="font-bold text-naranjaCreame text-xl">
                      OTRO DOCUMENTO
                    </span>
                  </p>
                </div>
                <div className="pt-16"></div>
                <div className="pt-2">
                  {imageSrcOTRO ? (
                    <div className="flex flex-col items-center justify-center gap-4">
                      <img
                        className="w-full max-h-[30vh] object-contain rounded-lg"
                        src={imageSrcOTRO}
                        alt="Vista previa del RUT"
                      />

                      <div className="hover:bg-slate-300 w-32 h-14 flex items-center justify-center border-2 rounded-full border-gray-300 bg-gray-50 shadow-lg transition">
                        <button
                          className="flex flex-col items-center justify-center w-full h-full"
                          type="button"
                          onClick={handlerCancel2}
                        >
                          <GiCancel size={24} />
                          <p className="text-xs sm:text-sm">Cancelar</p>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center w-full">
                      <div
                        className="flex flex-col items-center justify-center border-2 border-gray-300 rounded-lg lg:m-0 w-full h-[20vh] lg:h-[30vh] md:h-[20vh] sm:h-[50vh]"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files[0];
                          if (file) {
                            handleFileChange2({ target: { files: [file] } });
                          }
                        }}
                      >
                        <div className="w-36 h-36 bg-grayCreame hover:bg-lightBlueCreame flex items-center justify-center border-2 rounded-full border-gray-400 border-solid cursor-pointer shadow-xl">
                          <label>
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <p className="text-xs text-white">
                                <IoDocumentsOutline size={40} />
                              </p>
                            </div>
                            <input
                              name="imageRUT"
                              type="file"
                              className="hidden"
                              onChange={handleFileChange2}
                              accept=".jpg, .jpeg, .png, .pdf"
                              onInput={handlerValidation}
                            />
                          </label>
                        </div>
                        <div className="flex flex-col items-center justify-center mt-4">
                          <p className="font-bold text-naranjaCreame text-xl">
                            OTRO DOCUMENTO
                          </p>
                          <p>ARRASTRA O SELECCIONA UN ARCHIVO</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
                      {/* {!isChecked && (
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
                      )} */}

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
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center w-full ">
                <div
                  className="flex flex-col items-center justify-center border-2 border-gray-300 rounded-lg lg:m-0 w-full h-[40vh] lg:h-[70vh] md:h-[40vh] sm:h-[90vh]"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) {
                      handleFileChange({ target: { files: [file] } });
                    }
                  }}
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
                    <p className="font-bold text-naranjaCreame text-xl">
                      FACTURA
                    </p>
                    <p>ARRASTRA O SELECCIONA UNA FACTURA</p>
                  </div>
                </div>
              </div>
            )}

            {/* <div
              className={`grid grid-cols-2 gap-4 rounded-lg mx-auto w-full border-2 border-gray-300 p-6 bg-azulCreame   ${
                imageLoaded && !isChecked
                  ? null
                  : "pointer-events-none opacity-50 bg-darkGrayCreame"
              }`}
            > */}
            <div
              className={`grid grid-cols-2 gap-4 rounded-lg mx-auto w-full border-2 border-gray-300 p-6 bg-azulCreame   ${
                imageLoaded
                  ? null
                  : "pointer-events-none opacity-50 bg-darkGrayCreame"
              }`}
            >
              {/* Tipo_Documento */}
              <div className="col-span-1 flex items-center justify-center">
                <div
                  className="relative mb-3 w-full"
                  data-te-input-wrapper-init
                >
                  <input
                    value={responsedata.Tipo_Documento}
                    name="Tipo_Documento"
                    onChange={handleOnChange}
                    onKeyDown={(e) => {
                      validaEnter(e);
                    }}
                    type="text"
                    className={`bg-white peer  block min-h-[auto] w-full text-neutral-950 rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none shadow-lg
                    ${
                      responsedata.Tipo_Documento
                        ? "peer peer-focus:z-10 data-[te-input-state-active]:placeholder:opacity-100 focus:placeholder:opacity-100 "
                        : ""
                    }`}
                  />
                  <label
                    htmlFor="Tipo_Documento"
                    className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6]  transition-all duration-200 ease-out 
                    ${
                      responsedata.Tipo_Documento
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
                    type="number"
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
                    type="number"
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

              {/** DETALLES DE LA COMPRA Tipo_Documento */}
              {/* *****************************************/}
              <div className="col-span-2 flex items-center justify-center">
                <div
                  className="relative mb-3 w-full  "
                  data-te-input-wrapper-init
                >
                  <textarea
                    value={responsedata.concepto}
                    name="concepto"
                    onChange={handleOnChange}
                    onKeyDown={(e) => {
                      validaEnter(e);
                    }}
                    type=""
                    className={`bg-white peer  block min-h-[auto] w-full text-neutral-950 rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none shadow-lg
                    ${
                      responsedata.concepto
                        ? "peer peer-focus:z-10 data-[te-input-state-active]:placeholder:opacity-100 focus:placeholder:opacity-100"
                        : ""
                    }`}
                    id="concepto"
                  />
                  <label
                    htmlFor="concepto"
                    className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6]  transition-all duration-200 ease-out 
                      ${
                        responsedata.concepto
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
          {/* <button
            type="submit"
            className={`mt-10 w-full inline-block rounded ${
              imageLoaded || (imageLoaded && fillData && !nomProyect)
                ? "bg-naranjaCreame hover:bg-azulCreame hover:border-turquesaCreame hover:border  hover:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)] focus:bg-turquesaCreame focus:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)] focus:outline-none focus:ring-0 active:bg-info-700 active:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)]"
                : "opacity-50 bg-darkGrayCreame"
            } px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#54b4d3] transition duration-150 ease-in-out   md:w-1/2`}
            disabled={!imageLoaded && (!nomProyect || nomProyect.trim() === "")}
          >
            Enviar
          </button> */}

          <button
            type="submit"
            className={`mt-10 w-full inline-block rounded ${
              imageLoaded 
                ? "bg-naranjaCreame hover:bg-azulCreame hover:border-turquesaCreame hover:border  hover:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)] focus:bg-turquesaCreame focus:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)] focus:outline-none focus:ring-0 active:bg-info-700 active:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)]"
                : "opacity-50 bg-darkGrayCreame cursor-not-allowed"
            } px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#54b4d3] transition duration-150 ease-in-out md:w-1/2`}
            disabled={!imageLoaded}
          >
            Enviar
          </button>
        </div>
      </form>
      {isLoading ? (
        // <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50">
        //   <div className="loader"></div>
        // </div>
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-white bg-opacity-50">
          <div className="loader"></div>
        </div>
      ) : null}
    </div>
  );
};

export default Gastos;
