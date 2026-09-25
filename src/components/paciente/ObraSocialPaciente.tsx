// ObraSocialPaciente - Bloque de obra social (desplegable + numero de afiliado obligatorio si aplica).
// Se conecta con: FormularioPaciente (padre) y FormularioPaciente.module.scss.

import { useState, type ChangeEvent } from 'react';
import styles from './FormularioPaciente.module.scss';
import type { IPacienteForm, IEventoCampo } from '../../types/Paciente.types';

// Lista sugerida de obras sociales (misma que el backend en ObraSocial.const.ts).
// A diferencia del schema, el frontend NO la impone: permite elegir una de
// acá o escribir una nueva con la opción "Escribir otra...".
const OBRAS_SOCIALES = [
    'OSDE',
    'PAMI',
    'SWISS MEDICAL',
    'GALENO',
    'MEDIFE',
    'IOSFA',
    'OTRO',
    'NINGUNA',
];

// Valor "especial" del select para saber que el usuario quiere escribir su propia obra social.
const OPCION_OTRA = '__otra__';

interface ObraSocialPacienteProps {
    paciente: IPacienteForm;
    handleChange: (e: IEventoCampo) => void;
}

const ObraSocialPaciente = ({ paciente, handleChange }: ObraSocialPacienteProps) => {
    const [otraActiva, setOtraActiva] = useState(false);
    const [otraCustom, setOtraCustom] = useState('');

    // Si la persona no tiene obra social, el nº de afiliado no aplica.
    const sinObraSocial = paciente.historialMedico?.obraSocial === 'NINGUNA';
    // Mientras está escribiendo una nueva, el select muestra "Escribir otra..."
    const valorSelect = otraActiva ? OPCION_OTRA : (paciente.historialMedico?.obraSocial || '');

    // Cambiar en el desplegable.
    const handleSelect = (evento: ChangeEvent<HTMLSelectElement>) => {
        const valor = evento.target.value;

        if (valor === OPCION_OTRA) {
            // Elegimos "escribir otra": se habilita el input libre.
            setOtraActiva(true);
            setOtraCustom('');
        } else {
            // Una opción fija: se usa directo y se apaga el modo "otra".
            setOtraActiva(false);
            setOtraCustom('');
            handleChange(evento);
        }
    };

    // Escribir la nueva obra social en el input libre.
    // Actualizamos el estado local Y el modelo (mismo name que esperaba el schema).
    const handleOtra = (evento: ChangeEvent<HTMLInputElement>) => {
        const valor = evento.target.value;
        setOtraCustom(valor);
        handleChange({ target: { name: 'historialMedico.obraSocial', value: valor } });
    };

    return (
        <fieldset>
            <legend className={styles.subtitulo}>Obra Social</legend>

            <div className={styles.formGrid}>

            <div className={styles.formGroup}>
                <label>Obra Social</label>
                <select
                    className={styles.campoInput}
                    name="historialMedico.obraSocial"
                    value={valorSelect}
                    onChange={handleSelect}
                    required
                >
                    <option value="">Seleccione una opción</option>
                    {OBRAS_SOCIALES.map((obra) => (
                        <option key={obra} value={obra}>{obra}</option>
                    ))}
                    <option value={OPCION_OTRA}>Escribir otra...</option>
                </select>
            </div>

            {otraActiva && (
                <div className={styles.formGroup}>
                    <label>Nueva obra social</label>
                    <input
                        type="text"
                        className={styles.campoInput}
                        value={otraCustom}
                        onChange={handleOtra}
                        required
                    />
                </div>
            )}

            <div className={styles.formGroup}>
                <label>N° Afiliado{sinObraSocial ? "" : " *"}</label>
                <input type="text"
                    className={styles.campoInput}
                    name="historialMedico.numAfiliado"
                    value={paciente.historialMedico.numAfiliado}
                    onChange={handleChange}
                    disabled={sinObraSocial}
                    required={!sinObraSocial}
                    placeholder={sinObraSocial ? "Sin obra social" : "Obligatorio si tiene obra social"}
                />
            </div>
            </div>
        </fieldset>
    );
};

export default ObraSocialPaciente;