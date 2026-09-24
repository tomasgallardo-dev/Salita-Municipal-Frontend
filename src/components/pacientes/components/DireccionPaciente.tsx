import type { ChangeEvent } from 'react';
import styles from '../FormularioPaciente.module.scss';
import type { IPacienteForm } from '../../../types/Paciente.types';

interface DireccionPacienteProps {
    paciente: IPacienteForm;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    sinNumero: boolean;
    handleCheckSinNumero: (evento: ChangeEvent<HTMLInputElement>) => void;
}

const DireccionPaciente = ({ paciente, handleChange, sinNumero, handleCheckSinNumero }: DireccionPacienteProps) => {
    return (
        <fieldset>
            <legend className={styles.subtitulo}>Domicilio</legend>

            <div className={styles.formGrid}>
            <div className={styles.formGroup}>
                <label>Provincia</label>
                <input type="text" className={styles.campoInput} name="direccion.provincia" value={paciente.direccion.provincia} onChange={handleChange} />
            </div>
            
            <div className={styles.formGroup}>
                <label>Ciudad</label>
                <input type="text" className={styles.campoInput} name="direccion.ciudad" value={paciente.direccion.ciudad} onChange={handleChange} />
            </div>


            <div className={styles.formGroup}>
                <label>Calle</label>
                <input type="text" className={styles.campoInput} name="direccion.calle" value={paciente.direccion.calle} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
                <label>Número</label>
                <input
                    type="text"
                    className={styles.campoInput}
                    name="direccion.numero"
                    value={sinNumero ? "S/N" : paciente.direccion.numero}
                    onChange={handleChange}
                    disabled={sinNumero}
                />
                <label style={{ fontSize: "13px" }}>
                    <input type="checkbox" checked={sinNumero} onChange={handleCheckSinNumero} />
                    {" "}Sin número (S/N)
                </label>
            </div>
            </div>
        </fieldset>
    );
};

export default DireccionPaciente;