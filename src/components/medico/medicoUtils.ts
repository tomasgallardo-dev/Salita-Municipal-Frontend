// medicoUtils - Helpers para armar/mapear el formulario de medico (especialidad, datos iniciales).
// Se conecta con: GestionMedico y ModalFormularioMedico.

import type { IEspecialidad } from '../../types/Especialidad.types';

export const getNombreEspecialidad = (esp: IEspecialidad | string): string => {
    if (typeof esp === 'string') return esp;
    return esp?.nombre || 'Sin especialidad';
};