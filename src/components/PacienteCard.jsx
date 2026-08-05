const PacienteCard = ({nombre, obraSocial, dni}) => {

    return (
        <div>
            <h2>
                Nombre: {nombre}
            </h2>
            <p>Obra Social:{obraSocial}</p>
            <p>DNI:{dni}</p>
            <button>Ver historia clinica</button>
        </div>
    );
};

export default PacienteCard;