// Medico.types - Interfaz IMedico (id, nombre, especialidad ref o poblada).
// Se conecta con: medico/*, CrearTurno y backend.

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