import type { IPaciente } from './Paciente.types';

export type EstadoTurno = 'pendiente' | 'atendido' | 'cancelado';

export interface ITurno {
    id: string;
    paciente: IPaciente | null;
    especialidad: string;
    fechaTurno: string;
    medico: string | null;
    estado: EstadoTurno;
    observaciones?: string;
    createdAt: string;
    updatedAt: string;
}

export interface IRespuestaTurnos {
    success: boolean;
    timestamp: string;
    message: string;
    total: number;
    data: ITurno[] | null;
}

export interface TurnoCardProps {
    turno: ITurno;
    onAtender: (id: string) => void;
}