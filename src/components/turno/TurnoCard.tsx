// TurnoCard - Card de turno: estado, guardia, boton 'Llamar' (atendido) y acceso al detalle del paciente.
// Se conecta con: ModalDetallePaciente, DashboardRecepcion (padre) y types/Turno.types.

import { useState } from "react";
import { Col, Card, Badge, Button } from "react-bootstrap";
import ModalDetallePaciente from "../paciente/ModalDetallePaciente";
import type { TurnoCardProps, EstadoTurno } from "../../types/Turno.types";

interface EstiloEstado {
    variante: 'warning' | 'success' | 'secondary';
    texto: string;
    textoOscuro?: boolean;
}

// Badge correcto por estado (antes "en espera" aunque fuera cancelado)
const ESTADO_BADGE: Record<EstadoTurno, EstiloEstado> = {
    pendiente: { variante: 'warning', texto: 'En Espera', textoOscuro: true },
    atendido: { variante: 'success', texto: 'Atendido' },
    cancelado: { variante: 'secondary', texto: 'Cancelado' },
};

const guardiaTexto = "ingreso por guardia medica";

const capitalizar = (texto: string) => texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : texto;

const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    const dia = fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const tieneHora = fecha.getHours() !== 0 || fecha.getMinutes() !== 0;
    return tieneHora
        ? `${dia} ${fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`
        : dia;
};

const TurnoCard = ({ turno, onAtender }: TurnoCardProps) => {
    const [mostrarDetalle, setMostrarDetalle] = useState(false);
    const paciente = turno.paciente;
    const esGuardia = turno.observaciones === guardiaTexto;
    const badge = ESTADO_BADGE[turno.estado];

    return (
        <>
            <Col md={4} className="mb-3">
                <Card>
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                            <Card.Title className="mb-0">
                                {paciente ? `${paciente.apellido}, ${paciente.nombre}` : "Paciente no disponible"}
                            </Card.Title>
                            <Badge bg={badge.variante} text={badge.textoOscuro ? 'dark' : undefined}>
                                {badge.texto}
                            </Badge>
                        </div>

                        {esGuardia && <Badge bg="danger" className="mt-2">GUARDIA</Badge>}

                        <div className="mt-3 small text-muted">
                            <div>Fecha: {formatearFecha(turno.fechaTurno)}</div>
                            <div>Especialidad: {capitalizar(turno.especialidad)}</div>
                            {paciente && (
                                <>
                                    <div>DNI: {paciente.dni}</div>
                                    <div>Email: {paciente.correoelectronico || "Sin email"}</div>
                                    <div>Obra social: {paciente.historialMedico?.obraSocial || "Sin obra social"}</div>
                                </>
                            )}
                        </div>

                        <div className="d-flex gap-2 mt-3">
                            <Button
                                variant="outline-info"
                                size="sm"
                                onClick={() => setMostrarDetalle(true)}
                                disabled={!paciente}
                            >
                                Información del paciente
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => onAtender(turno.id)}
                                disabled={turno.estado !== 'pendiente'}
                            >
                                Llamar
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Col>

            <ModalDetallePaciente
                show={mostrarDetalle}
                onClose={() => setMostrarDetalle(false)}
                paciente={paciente}
            />
        </>
    );
};

export default TurnoCard;