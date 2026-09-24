import { Col, Card, Badge, Button } from "react-bootstrap";
import type { TurnoCardProps } from "../../types/Turno.types";

const TurnoCard = ({ turno, onAtender }: TurnoCardProps) => {
    return (
        <Col md={4} className="mb-3">
            <Card>
                <Card.Body>
                    <Card.Title>{turno.paciente ? turno.paciente.nombre : "Paciente no disponible"}</Card.Title>
                    
                    <h5 className="mt-3">
                        {turno.estado === 'atendido' 
                            ? <Badge bg="success">Atendido</Badge> 
                            : <Badge bg="warning" text="dark"> En Espera</Badge>
                        }
                    </h5>
                    <Button onClick={() => onAtender(turno.id)}
                            disabled={turno.estado === 'atendido'}
                    >
                        Llamar
                    </Button>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default TurnoCard;