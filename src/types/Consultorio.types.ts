import type { IMedico } from './Medico.types';
import type { IEspecialidad } from './Especialidad.types';

export interface ITelefonoConsultorio {
    codigoArea: string;
    numero: string;
}

export interface IConsultorio {
    id: string;
    medico: IMedico | null;
    especialidad: IEspecialidad | null;
    numeroConsultorio: string;
    piso: string;
    direccion: string;
    telefono: ITelefonoConsultorio;
    email: string;
    createdAt: string;
    updatedAt: string;
}