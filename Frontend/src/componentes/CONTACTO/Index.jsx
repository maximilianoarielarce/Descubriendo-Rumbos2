

import { useState } from "react";
import emailjs from "@emailjs/browser";
import './Index.css';

const Index = () => {
  const [form, setForm] = useState({
    from_name: "",
    email_id: "",
    message: ""
  });

  const [errors, setErrors] = useState({});
  const [resultado, setResultado] = useState("");

  const validar = (name, value) => {
    let msg = "";

    if (name === "from_name") {
      if (!value) msg = "El nombre es obligatorio.";
      else if (value.length < 3) msg = "Mínimo 3 caracteres.";
      else if (value.length > 50) msg = "Máximo 50 caracteres.";
      else if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(value))
        msg = "Sólo letras y espacios.";
    }

    if (name === "email_id") {
      if (!value) msg = "El email es obligatorio.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        msg = "Formato de email inválido.";
    }

    if (name === "message") {
      if (!value) msg = "El mensaje es obligatorio.";
      else if (value.length < 10) msg = "Mínimo 10 caracteres.";
      else if (value.length > 1000) msg = "Máximo 1000 caracteres.";
    }

    return msg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    // valida en tiempo real
    setErrors({
      ...errors,
      [name]: validar(name, value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validar todos los campos antes de enviar
    let valid = true;
    const nuevosErrores = {};

    Object.keys(form).forEach((field) => {
      const error = validar(field, form[field]);
      if (error) valid = false;
      nuevosErrores[field] = error;
    });

    setErrors(nuevosErrores);

    if (!valid) return;

    try {
      await emailjs.send(
        "service_sb0c7l5",
        "template_3w4fv0n",
        form,
        "_LQFeYgZDwLX3BwvC"
      );

      setResultado("✅ Mensaje enviado correctamente");
      setForm({ from_name: "", email_id: "", message: "" });
      setErrors({});
    } catch (err) {
      console.error(err);
      setResultado("❌ Error al enviar el mensaje");
    }
  };

  return (
    <div className="contacto-container">

      <h1 className="titulo-form">Formulario de Contacto</h1>
      
      <form className="form-contacto" onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input
          name="from_name"
          value={form.from_name}
          onChange={handleChange}
        />
        {errors.from_name && <div className="error-detail">{errors.from_name}</div>}

        <label>Email:</label>
        <input
          name="email_id"
          value={form.email_id}
          onChange={handleChange}
        />
        {errors.email_id && <div className="error-detail">{errors.email_id}</div>}

        <label>Mensaje:</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
        ></textarea>
        {errors.message && <div className="error-detail">{errors.message}</div>}

        <button type="submit">Enviar</button>
      </form>

      <p id="resultado">{resultado}</p>
    </div>
  );
};

export default Index;
