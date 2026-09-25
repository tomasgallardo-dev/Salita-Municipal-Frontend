// ==========================================================================
// COMPONENTE: DetalleTurno (Adaptado al backend municipal)
// ==========================================================================
import { useParams, Link } from 'react-router-dom';
import { Alert, Badge, Card, Col, Container, ListGroup, Row, Spinner, Stack } from 'react-bootstrap';
import { useFetch } from '../../hooks/useFetch';
import type { ITurno } from '../../types/Turno.types';

const DetalleTurno = () => {
    // Capturamos el ID del turno desde los parámetros de la URL
    const { id } = useParams();

    // Consultamos al endpoint de turnos con la ruta de detalle real
    const { data: turno, isLoading } = useFetch<ITurno | null>(`/turnos/${id}`);

    // 1) Estado de Carga (Spinner visual mientras responde el backend)
    if (isLoading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" role="status" />
                <p className="text-body-secondary mt-3">Cargando detalle del turno...</p>
            </Container>
        );
    }

    // 2) Estado de Error / No encontrado
    if (!turno) {
        return (
            <Container className="py-5">
                <Alert variant="warning">
                    No se encontró el turno solicitado con el ID: {id}.
                </Alert>
                <Link to="/" className="btn btn-outline-primary">Volver al dashboard</Link>
            </Container>
        );
    }

    // Extraemos datos anidados de forma segura
    const paciente = turno.paciente;
    const fecha = new Date(turno.fechaTurno);
    const historial = paciente?.historialMedico;
    const alergias = historial?.alergias;

    return (
        <Container className="pb-5 pt-4">
            {/* Cabecera con título y estado */}
            <Stack direction="horizontal" className="justify-content-between align-items-start mb-4">
                <div>
                    <p className="text-body-secondary mb-1">Detalle del turno municipal</p>
                    <h1 className="h2 mb-0">{paciente?.nombre ?? "Paciente sin asignar"}</h1>
                </div>
                <Badge 
                    bg={turno.estado === "atendido" ? "success" : "warning"} 
                    text={turno.estado === "atendido" ? undefined : "dark"} 
                    className="fs-6 px-3 py-2"
                >
                    {turno.estado === "atendido" ? "Atendido" : "En espera"}
                </Badge>
            </Stack>

            {/* Tarjeta principal con información temporal y de especialidad */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <Row className="g-4">
                        <Col xs={12} md={4}>
                            <div className="small text-body-secondary">Fecha y hora</div>
                            <div className="fw-semibold">{fecha.toLocaleDateString("es-AR")}</div>
                            <div>{fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })} hs</div>
                        </Col>
                        <Col xs={12} md={4}>
                            <div className="small text-body-secondary">Especialidad</div>
                            <div className="fw-semibold text-capitalize">{turno.especialidad}</div>
                        </Col>
                        <Col xs={12} md={4}>
                            <div className="small text-body-secondary">Identificador del Turno</div>
                            <div className="fw-semibold text-break">{turno.id}</div>
                        </Col>
                    </Row>
                    {turno.observaciones && (
                        <Card.Text className="border-top pt-3 mt-4 mb-0">
                            <strong>Observaciones:</strong> {turno.observaciones}
                        </Card.Text>
                    )}
                </Card.Body>
            </Card>

            {/* Bloque de datos del paciente e información médica */}
            {!paciente ? (
                <Alert variant="info">Este turno todavía no tiene un paciente vinculado en el sistema.</Alert>
            ) : (
                <Row className="g-4">
                    {/* Columna Izquierda: Datos personales */}
                    <Col xs={12} lg={6}>
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Header className="bg-white fw-semibold">Datos del paciente</Card.Header>
                            <ListGroup variant="flush">
                                <ListGroup.Item><span className="text-body-secondary">DNI</span><br />{paciente.dni}</ListGroup.Item>
                                <ListGroup.Item><span className="text-body-secondary">Email</span><br />{paciente.correoelectronico || "No registrado"}</ListGroup.Item>
                                <ListGroup.Item><span className="text-body-secondary">Teléfono</span><br />{paciente.telefono ? `(${paciente.telefono.codigoArea}) ${paciente.telefono.numero}` : "No registrado"}</ListGroup.Item>
                                <ListGroup.Item><span className="text-body-secondary">Dirección</span><br />{paciente.direccion ? `${paciente.direccion.calle} ${paciente.direccion.numero}, ${paciente.direccion.ciudad}` : "No registrada"}</ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>

                    {/* Columna Derecha: Información médica y obra social */}
                    <Col xs={12} lg={6}>
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Header className="bg-white fw-semibold">Información médica</Card.Header>
                            <ListGroup variant="flush">
                                <ListGroup.Item><span className="text-body-secondary">Obra Social</span><br />{historial?.obraSocial || "Particular / Ninguna"}</ListGroup.Item>
                                <ListGroup.Item><span className="text-body-secondary">Grupo Sanguíneo</span><br />{historial?.gruposSanguineos || "No especificado"}</ListGroup.Item>
                                <ListGroup.Item><span className="text-body-secondary">Alergias</span><br />{alergias && alergias.length > 0 ? alergias.join(', ') : "Ninguna registrada"}</ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Botón de retorno */}
            <Link to="/" className="btn btn-outline-secondary mt-4">
                Volver al dashboard
            </Link>
        </Container>
    );
};

export default DetalleTurno;