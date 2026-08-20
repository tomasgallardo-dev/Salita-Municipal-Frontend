import { useState } from "react";

const PacienteCard = ({nombre, obraSocial, dni}) => {
    const [visible, setVisible] = useState(false);

    return (
        <div className="card h-100">
            <div className="card-body">
                <h2 className="card-title mb-2">Nombre: {nombre}</h2>
                <p className="card-text mb-2">Obra Social:{obraSocial}</p>
                <p className="card-text mb-2">DNI:{dni}</p>
                {visible && <p>Acá iría la historia clínica...</p>}
                    <button onClick={() => setVisible(!visible)} className="btn btn-primary ">Ver historia clinica</button>
            </div>
            
        </div>
    );
};

export default PacienteCard;