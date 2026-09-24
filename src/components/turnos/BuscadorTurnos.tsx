import { Row, Col, Form } from "react-bootstrap";

interface BuscadorTurnosProps {
    valor: string;
    alCambiar: (valor: string) => void;
}

const BuscadorTurnos = ({ valor, alCambiar }: BuscadorTurnosProps) => {

    const handleChange = (evento: React.ChangeEvent<HTMLInputElement>) => {
        alCambiar(evento.target.value);
    }

    return (
        <Row className="mb-4">
            <Col md={6}>
                <Form.Control
                    type="text"
                    placeholder="Buscar paciente..."
                    value={valor}
                    onChange={handleChange}
                />
            </Col>
        </Row>
    );
};

export default BuscadorTurnos;