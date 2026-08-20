import { useState } from 'react';
import styles from './FormularioPaciente.module.scss';
import JsonDebugger from '../utils/JsonDebugger';
import { validarDatos } from '../utils/validaciones';
import DatosPersonales from './components/DatosPersonales';
import DireccionPaciente from './components/DireccionPaciente';
import TelefonoPaciente from './components/TelefonoPaciente';
import ObraSocialPaciente from './components/ObraSocialPaciente';

// Reglas de validación por campo
const reglasPaciente = {
    nombre: (valor) => valor.trim() === "" ? "El nombre es obligatorio" : null,
    dni: (valor) => valor.length < 8 ? "El DNI es obligatorio" : null,
    // Cambiamos "email" por "correoelectronico"
    // Y validamos solo si el usuario escribió algo (valor !== "")
    correoelectronico: (valor) => valor !== "" && !valor.includes("@") ? "El email debe contener @" : null,
};

const FormularioPaciente = () => {
    // Estado con todos los datos del formulario
    const [paciente, setPaciente] = useState({
        nombre: "",
        dni: "",
        fechaNacimiento: "",
        sexo: "",
        correoelectronico: "",
        direccion: { calle: "", numero: "", ciudad: "", provincia: "" },
        telefono: { codigoArea: "", numero: "" },
        historialMedico: { obraSocial: "", numAfiliado: "" },
    });

    const [errores, setErrores] = useState({});
    const [sinNumero, setSinNumero] = useState(false);

    // Actualiza cualquier campo, simple o anidado
    const handleChange = (evento) => {
        const { name, value } = evento.target;

        if (name.includes(".")) {
            const [grupo, campo] = name.split(".");
            setPaciente({
                ...paciente,
                [grupo]: { ...paciente[grupo], [campo]: value },
            });
        } else {
            setPaciente({ ...paciente, [name]: value });
        }
    };

    // Checkbox "Sin número"
    const handleCheckSinNumero = (evento) => {
        const marcado = evento.target.checked;
        setSinNumero(marcado);
        setPaciente({
            ...paciente,
            direccion: { ...paciente.direccion, numero: marcado ? "S/N" : "" },
        });
    };

    // Calcula edad en vivo, sin guardarla
    const calcularEdad = (fechaNacimiento) => {
        if (!fechaNacimiento) return "";
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
        return edad;
    };

    const handleSubmit = async (evento) => {
        evento.preventDefault();

        // Valida antes de enviar
        const nuevosErrores = validarDatos(paciente, reglasPaciente);
        setErrores(nuevosErrores);
        if (Object.keys(nuevosErrores).length > 0) return;

        // Envía al backend
        try {
            const respuesta = await fetch("http://localhost:3000/api/v1/pacientes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paciente),
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                console.log("Detalles del rechazo del backend:", data);
                alert("Error del servidor: " + data.message);
            } else {
                alert("Paciente guardado con éxito!");
            }
        } catch (error) {
            console.error("Error al enviar los datos del paciente:", error);
            alert("No se pudo conectar con el servidor");
        }
    };

     return (
        <div className={styles.formularioPaciente}>
            <h3>Ingreso de nuevo paciente</h3>

            <form onSubmit={handleSubmit}>
                <DatosPersonales
                    paciente={paciente}
                    handleChange={handleChange}
                    errores={errores}
                    calcularEdad={calcularEdad}
                />
                <DireccionPaciente
                    paciente={paciente}
                    handleChange={handleChange}
                    sinNumero={sinNumero}
                    handleCheckSinNumero={handleCheckSinNumero}
                />
                <TelefonoPaciente
                    paciente={paciente}
                    handleChange={handleChange}
                />
                <ObraSocialPaciente
                    paciente={paciente}
                    handleChange={handleChange}
                />

                <button type="submit" className={styles.btnGuardar}>Guardar Paciente</button>
            </form>

            <JsonDebugger data={paciente} titulo="Datos del paciente" />
        </div>
    );
};

export default FormularioPaciente;