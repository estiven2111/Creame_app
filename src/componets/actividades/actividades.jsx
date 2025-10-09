import React, { useEffect, useState } from "react";
import Checklist from "./checkList";
import SearchBar from "../searchBar/searchBar";
// import SearchBar from "../../searchBar"; //! ya no se usara aqui
import LogoSync from "../../assets/img/icon.png";
import axios from "axios"
import { useLocation } from "react-router-dom";

const Actividades = () => {
  const location = useLocation()
  localStorage.setItem("ruta", location.pathname)

  return (
    <div className="md:px-24 p-2 xl:px-40 min-h-screen">
      <div className="mt-10 mb-5">
         <SearchBar/>
       </div>
      <Checklist />
    </div>
  );
};

export default Actividades;