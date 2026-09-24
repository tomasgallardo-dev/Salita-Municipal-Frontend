import type { ChangeEvent } from 'react';
import styles from '../FormularioPaciente.module.scss';
import type { IPacienteForm } from '../../../types/Paciente.types';

interface TelefonoPacienteProps {
    paciente: IPacienteForm;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const TelefonoPaciente = ({ paciente, handleChange }: TelefonoPacienteProps) => {
    return (
        <fieldset className={styles.formGrid}>
            <legend className={styles.subtitulo}>Teléfono</legend>

            <div className={styles.formGroup}>
                <label>Cod.Area</label>
                <input type="text"
                className={styles.campoInput}
                name="telefono.codigoArea"
                value={paciente.telefono.codigoArea}
                onChange={handleChange}
                />
            </div>

            <div className={styles.formGroup}>
                <label>Numero</label>
                <input type="text"
                className={styles.campoInput}
                name="telefono.numero"
                value={paciente.telefono.numero}
                onChange={handleChange}
                />
            </div>
        </fieldset>
    );
};

export default TelefonoPaciente;