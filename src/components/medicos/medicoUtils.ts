import type { IEspecialidad } from '../../types/Especialidad.types';

export const getNombreEspecialidad = (esp: IEspecialidad | string): string => {
    if (typeof esp === 'string') return esp;
    return esp?.nombre || 'Sin especialidad';
};