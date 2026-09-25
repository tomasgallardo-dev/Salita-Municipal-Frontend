// TurnoCardSkeleton - Placeholder de carga que se muestra mientras llegan los turnos.
// Se conecta con: DashboardRecepcion (padre).

import { Col, Card, Placeholder } from 'react-bootstrap';

const TurnoCardSkeleton = () => {
    return (
        <Col md={4} className="mb-3">
            <Card>
                <Card.Body>
                    <Placeholder as={Card.Title} animation="glow">
                        <Placeholder xs={6} />
                    </Placeholder>
                    <Placeholder as="h5" animation="glow" className="mt-3">
                        <Placeholder xs={4} bg="warning" />
                    </Placeholder>
                    <Placeholder.Button variant="primary" xs={12} className="mt-2" disabled />
                </Card.Body>
            </Card>
        </Col> 
    )
}

export default TurnoCardSkeleton;