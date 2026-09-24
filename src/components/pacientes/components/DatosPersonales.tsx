import type { ChangeEvent } from 'react';
import styles from '../FormularioPaciente.module.scss';
import type { IPacienteForm } from '../../../types/Paciente.types';

interface DatosPersonalesProps {
    paciente: IPacienteForm;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    errores: Record<string, string>;
    calcularEdad: (fechaNacimiento: string) => number | string;
}

const DatosPersonales = ({ paciente, handleChange, errores, calcularEdad }: DatosPersonalesProps) => {
    return (
        <fieldset>
            <legend className={styles.subtitulo}>Datos Personales</legend>

            <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                    <label>Nombre *</label>
                    <input type="text" className={styles.campoInput} name="nombre" value={paciente.nombre} onChange={handleChange} required placeholder="Nombre" />
                    {errores.nombre && <span className={styles.error}>{errores.nombre}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label>Apellido *</label>
                    <input type="text" className={styles.campoInput} name="apellido" value={paciente.apellido} onChange={handleChange} required placeholder="Apellido" />
                    {errores.apellido && <span className={styles.error}>{errores.apellido}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label>DNI *</label>
                    <input type="text" className={styles.campoInput} name="dni" value={paciente.dni} onChange={handleChange} required />
                    {errores.dni && <span className={styles.error}>{errores.dni}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label>Sexo *</label>
                    <select
                        className={styles.campoInput}
                        name="sexo"
                        value={paciente.sexo}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione una opción</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label>Fecha de Nacimiento *</label>
                    <input type="date" className={styles.campoInput} name="fechaNacimiento" value={paciente.fechaNacimiento} onChange={handleChange} required />
                </div>

                <div className={styles.formGroup}>
                    <label>Edad</label>
                    <input type="text" className={styles.campoInput} value={calcularEdad(paciente.fechaNacimiento)} disabled />
                </div>


                <div className={styles.formGroup}>
                    <label>Email*</label>
                    <input type="email" className={styles.campoInput} name="correoelectronico" value={paciente.correoelectronico} onChange={handleChange} required />
                    {errores.correoelectronico && <span className={styles.error}>{errores.correoelectronico}</span>}
                </div>
            </div>
        </fieldset>
    );
};

export default DatosPersonales;