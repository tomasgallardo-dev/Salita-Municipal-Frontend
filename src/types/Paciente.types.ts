// Paciente.types - IPaciente (respuesta del backend), IPacienteForm e IEventoCampo (formulario).
// Se conecta con: paciente/* y backend.

export type SexoPaciente = 'Masculino' | 'Femenino' | 'Otro';

export interface IDireccion {
    calle: string;
    numero: string;
    ciudad: string;
    provincia: string;
}

export interface ITelefono {
    codigoArea: string;
    numero: string;
}

export interface IConsulta {
    _id?: string;
    fecha: string;
    diagnostico: string;
    tratamiento?: string;
    medico: string;
}

export interface IHistorialMedico {
    obraSocial: string;
    numAfiliado?: string;
    alergias?: string[];
    gruposSanguineos?: string;
    consultas: IConsulta[];
}

export interface IPaciente {
    id: string;
    nombre: string;
    apellido: string;
    dni: string;
    fechaNacimiento: string;
    sexo: SexoPaciente;
    direccion: IDireccion;
    telefono: ITelefono;
    correoelectronico: string;
    historialMedico: IHistorialMedico;
    edad: number | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IRespuestaPacientes {
    success: boolean;
    timestamp: string;
    message: string;
    total: number;
    data: IPaciente[] | null;
}

// --- Tipos del FORMULARIO de paciente (alta y edición) ---

// El formulario maneja el historial clínico incompleto (sin `consultas`),
// y `sexo` arranca en "" hasta que el usuario elige.
export interface IHistorialForm {
    obraSocial: string;
    numAfiliado?: string;
}

export interface IPacienteForm {
    nombre: string;
    apellido: string;
    dni: string;
    fechaNacimiento: string;
    sexo: string;
    correoelectronico: string;
    direccion: IDireccion;
    telefono: ITelefono;
    historialMedico: IHistorialForm;
}

// Evento "mínimo" de cambio de campo: los subcomponentes pasan eventos
// reales del DOM, y ObraSocialPaciente fabrica uno a mano con { target }.
export interface IEventoCampo {
    target: {
        name: string;
        value: string;
        checked?: boolean;
    };
}