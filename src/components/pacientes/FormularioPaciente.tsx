import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import styles from './FormularioPaciente.module.scss';
import JsonDebugger from '../utils/JsonDebugger';
import { validarDatos, type ReglasValidacion } from '../utils/validaciones';
import DatosPersonales from './components/DatosPersonales';
import DireccionPaciente from './components/DireccionPaciente';
import TelefonoPaciente from './components/TelefonoPaciente';
import ObraSocialPaciente from './components/ObraSocialPaciente';
import clientesAxios from '../../config/axios_config';
import type { IPacienteForm, IEventoCampo } from '../../types/Paciente.types';

// Reglas de validación por campo
const reglasPaciente: ReglasValidacion = {
    nombre: (valor: string) => valor.trim() === "" ? "El nombre es obligatorio" : null,
    apellido: (valor: string) => valor.trim() === "" ? "El apellido es obligatorio" : null,
    dni: (valor: string) => valor.length < 8 ? "El DNI es obligatorio" : null,
    // Cambiamos "email" por "correoelectronico"
    // Y validamos solo si el usuario escribió algo (valor !== "")
    correoelectronico: (valor: string) => valor !== "" && !valor.includes("@") ? "El email debe contener @" : null,
};

const estadoInicial: IPacienteForm = {
    nombre: "",
    apellido: "",
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
    const [paciente, setPaciente] = useState<IPacienteForm>(estadoInicial);
    const [errores, setErrores] = useState<Record<string, string>>({});
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
                    apellido: datos.apellido || "",
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
    const handleChange = (evento: IEventoCampo) => {
        const { name, value } = evento.target;

        setPaciente((prev) => {
            if (!name.includes(".")) {
                return { ...prev, [name]: value } as IPacienteForm;
            }

            const [grupo, campo] = name.split(".");
            return {
                ...prev,
                [grupo]: { ...(prev[grupo as keyof typeof prev] as unknown as Record<string, string>), [campo]: value },
            } as IPacienteForm;
        });
    };

    // Checkbox "Sin número"
    const handleCheckSinNumero = (evento: ChangeEvent<HTMLInputElement>) => {
        const marcado = evento.target.checked;
        setSinNumero(marcado);
        setPaciente((prev) => ({
            ...prev,
            direccion: { ...prev.direccion, numero: marcado ? "S/N" : "" },
        }));
    };

    // Calcula edad en vivo, sin guardarla
    const calcularEdad = (fechaNacimiento: string): number | string => {
        if (!fechaNacimiento) return "";
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
        return edad;
    };

    const handleSubmit = async (evento: FormEvent<HTMLFormElement>) => {
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
        } catch (error: any) {
            const detalle = error.response?.data?.data;
            let mensaje = error.response?.data?.message || "No se pudo guardar el paciente";

            if (Array.isArray(detalle)) {
                const textos = detalle.map((d: any) =>
                    typeof d === "string" ? d : `${d.campo?.split(".").pop()}: ${d.mensaje}`
                );
                if (textos.length > 0) mensaje = mensaje + " · " + textos.join(" · ");
            }

            toast.error(mensaje);
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