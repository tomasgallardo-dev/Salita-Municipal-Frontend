import styles from '../FormularioPaciente.module.scss';

const DatosPersonales = ({ paciente, handleChange, errores, calcularEdad }) => {
    return (
        <fieldset>
            <legend className={styles.subtitulo}>Datos Personales</legend>

            <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                    <label>Nombre Y Apellido *</label>
                    <input type="text" className={styles.campoInput} name="nombre" value={paciente.nombre} onChange={handleChange} required />
                    {errores.nombre && <span className={styles.error}>{errores.nombre}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label>DNI *</label>
                    <input type="text" className={styles.campoInput} name="dni" value={paciente.dni} onChange={handleChange} required />
                    {errores.dni && <span className={styles.error}>{errores.dni}</span>}
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
                    <label>Email*</label>
                    <input type="email" className={styles.campoInput} name="correoelectronico" value={paciente.correoelectronico} onChange={handleChange} />
                    {errores.correoelectronico && <span className={styles.error}>{errores.correoelectronico}</span>}
                </div>
            </div>
        </fieldset>
    );
};

export default DatosPersonales;