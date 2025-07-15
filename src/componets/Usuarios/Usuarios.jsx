import React, { useState } from "react";

const Usuarios = () => {
  const [formData, setFormData] = useState({
    doc_id: "",
    nombre: "",
    usuario: "",
    clave: "",
    id_grupo: "",
    email: "",
    facilitador: false,
    admonCalidad: false,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!/^\d+$/.test(formData.doc_id)) {
      newErrors.doc_id = "El documento debe contener solo números.";
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    }

    if (!formData.usuario.trim()) {
      newErrors.usuario = "El nombre de usuario es obligatorio.";
    }

    if (!formData.clave || formData.clave.length < 8) {
      newErrors.clave = "La clave debe tener al menos 8 caracteres.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      console.log("Formulario válido. Enviando datos:", formData);
      // Aquí puedes hacer el POST con Axios


      // 🔄 Resetear el formulario
    setFormData({
      doc_id: "",
      nombre: "",
      usuario: "",
      clave: "",
      id_grupo: "",
      email: "",
      facilitador: false,
      admonCalidad: false,
    });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow-2xl rounded-2xl">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        Registro de Usuario
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Documento */}
        <div>
          <label className="block mb-1 text-sm font-semibold">Documento ID</label>
          <input
            type="text"
            name="doc_id"
            value={formData.doc_id}
            onChange={handleChange}
            className={`w-full border ${
              errors.doc_id ? "border-red-500" : "border-gray-300"
            } p-2 rounded-lg focus:ring-2 focus:ring-blue-400`}
          />
          {errors.doc_id && <p className="text-red-500 text-sm mt-1">{errors.doc_id}</p>}
        </div>

        {/* Nombre */}
        <div>
          <label className="block mb-1 text-sm font-semibold">Nombre completo</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`w-full border ${
              errors.nombre ? "border-red-500" : "border-gray-300"
            } p-2 rounded-lg focus:ring-2 focus:ring-blue-400`}
          />
          {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
        </div>

        {/* Usuario */}
        <div>
          <label className="block mb-1 text-sm font-semibold">Usuario</label>
          <input
            type="text"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            className={`w-full border ${
              errors.usuario ? "border-red-500" : "border-gray-300"
            } p-2 rounded-lg focus:ring-2 focus:ring-blue-400`}
          />
          {errors.usuario && <p className="text-red-500 text-sm mt-1">{errors.usuario}</p>}
        </div>

        {/* Clave */}
        <div>
          <label className="block mb-1 text-sm font-semibold">Clave</label>
          <input
            type="password"
            name="clave"
            value={formData.clave}
            onChange={handleChange}
            className={`w-full border ${
              errors.clave ? "border-red-500" : "border-gray-300"
            } p-2 rounded-lg focus:ring-2 focus:ring-blue-400`}
          />
          {errors.clave && <p className="text-red-500 text-sm mt-1">{errors.clave}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 text-sm font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } p-2 rounded-lg focus:ring-2 focus:ring-blue-400`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Grupo */}
        <div>
          <label className="block mb-1 text-sm font-semibold">Grupo</label>
          <input
            type="number"
            name="id_grupo"
            value={formData.id_grupo}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Facilitador */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="facilitador"
            checked={formData.facilitador}
            onChange={handleChange}
            className="accent-blue-600 w-5 h-5"
          />
          <label className="text-sm font-medium">Facilitador</label>
        </div>

        {/* Admon Calidad */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="admonCalidad"
            checked={formData.admonCalidad}
            onChange={handleChange}
            className="accent-blue-600 w-5 h-5"
          />
          <label className="text-sm font-medium">Admon Calidad</label>
        </div>

        {/* Botón de enviar */}
        <div className="md:col-span-2 text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
          >
            Registrar Usuario
          </button>
        </div>
      </form>
    </div>
  );
};

export default Usuarios;
