import type { IEspecialidad } from './Especialidad.types';

export interface IMedico {
    id: string;
    nombre: string;
    matricula: string;
    especialidad: IEspecialidad | string;
    telefono: string;
    email: string;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
}