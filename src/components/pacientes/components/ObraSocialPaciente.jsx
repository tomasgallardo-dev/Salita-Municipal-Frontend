import styles from '../FormularioPaciente.module.scss';

const ObraSocialPaciente = ({ paciente, handleChange}) => {
    return(
        <fieldset className={styles.formGrid}>
            <legend className={styles.subtitulo}>Obra Social</legend>

                <div className={styles.formGroup}>
                    <label>Obra Social</label>
                    <input type="text"
                    className={styles.campoInput}
                    name="historialMedico.obraSocial"
                    value={paciente.historialMedico.obraSocial}
                    onChange={handleChange}
                    />
                </div>

                <div className={styles.formGroup}>
                <label>N° Afiliado</label>
                    <input type="text"
                    className={styles.campoInput}
                    name="historialMedico.numAfiliado"
                    value={paciente.historialMedico.numAfiliado}
                    onChange={handleChange} />
                </div>
        </fieldset>
    );
};

export default ObraSocialPaciente;