import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import styles from './FormularioPaciente.module.scss';
import JsonDebugger from '../utils/JsonDebugger';
import { validarDatos } from '../utils/validaciones';
import DatosPersonales from './components/DatosPersonales';
import DireccionPaciente from './components/DireccionPaciente';
import TelefonoPaciente from './components/TelefonoPaciente';
import ObraSocialPaciente from './components/ObraSocialPaciente';
import clientesAxios from '../../config/axios_config';

// Reglas de validación por campo
const reglasPaciente = {
    nombre: (valor) => valor.trim() === "" ? "El nombre es obligatorio" : null,
    dni: (valor) => valor.length < 8 ? "El DNI es obligatorio" : null,
    // Cambiamos "email" por "correoelectronico"
    // Y validamos solo si el usuario escribió algo (valor !== "")
    correoelectronico: (valor) => valor !== "" && !valor.includes("@") ? "El email debe contener @" : null,
};

const estadoInicial = {
    nombre: "",
    dni: "",
    fechaNacimiento: "",
    sexo: "",
    correoelectronico: "",
    direccion: { calle: "", numero: "", ciudad: "", provincia: "" },
    telefono: { codigoArea: "", numero: "" },
    historialMedico: { obraSocial: "", numAfiliado: "" },
};

const FormularioPaciente = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const esEdicion = Boolean(id);

    // Estado con todos los datos del formulario
    const [paciente, setPaciente] = useState(estadoInicial);
    const [errores, setErrores] = useState({});
    const [sinNumero, setSinNumero] = useState(false);
    const [cargando, setCargando] = useState(esEdicion);

    useEffect(() => {
        if (!esEdicion) return;

        setCargando(true);
        clientesAxios.get(`/pacientes/${id}`)
            .then((respuesta) => {
                const datos = respuesta.data.data;
                setPaciente({
                    nombre: datos.nombre || "",
                    dni: datos.dni || "",
                    fechaNacimiento: datos.fechaNacimiento ? datos.fechaNacimiento.slice(0, 10) : "",
                    sexo: datos.sexo || "",
                    correoelectronico: datos.correoelectronico || "",
                    direccion: {
                        calle: datos.direccion?.calle || "",
                        numero: datos.direccion?.numero || "",
                        ciudad: datos.direccion?.ciudad || "",
                        provincia: datos.direccion?.provincia || "",
                    },
                    telefono: {
                        codigoArea: datos.telefono?.codigoArea || "",
                        numero: datos.telefono?.numero || "",
                    },
                    historialMedico: {
                        obraSocial: datos.historialMedico?.obraSocial || "",
                        numAfiliado: datos.historialMedico?.numAfiliado || "",
                    },
                });
                setSinNumero(datos.direccion?.numero === "S/N");
            })
            .catch(() => {
                toast.error("No se pudo cargar el paciente");
                navigate("/dashboard/pacientes");
            })
            .finally(() => setCargando(false));
    }, [id, esEdicion, navigate]);

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

        try {
            if (esEdicion) {
                await clientesAxios.put(`/pacientes/${id}`, paciente);
                toast.success("Paciente actualizado con éxito");
            } else {
                await clientesAxios.post("/pacientes", paciente);
                toast.success("Paciente guardado con éxito");
            }
            navigate("/dashboard/pacientes");
        } catch (error) {
            toast.error(error.response?.data?.message || "No se pudo guardar el paciente");
        }
    };

    return (
        <div className={styles.formularioPaciente}>
            <h3>{esEdicion ? "Editar paciente" : "Ingreso de nuevo paciente"}</h3>

            {cargando ? (
                <p>Cargando datos del paciente...</p>
            ) : (
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

                    <button type="submit" className={styles.btnGuardar}>
                        {esEdicion ? "Guardar Cambios" : "Guardar Paciente"}
                    </button>
                </form>
            )}

            <JsonDebugger data={paciente} titulo="Datos del paciente" />
        </div>
    );
};

export default FormularioPaciente;