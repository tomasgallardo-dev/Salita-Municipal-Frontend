import { useState, useEffect } from "react";
import { Button, Container, Badge, Row, Col, Card } from 'react-bootstrap';
import styles from './DashboardRecepcion.module.scss';
import clientesAxios from "../config/axios";

const DashboardRecepcion = () => {
    const [turnos, setTurnos] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        const obtenerTurnosBackend = async () => {
            try {
                const respuesta = await clientesAxios.get('/turnos');
                const turnosReales = respuesta.data.data;
                
                const turnosMapeados = turnosReales.map(turno => {
                    // Extraemos solo la hora de la fecha (Ej: "10:30")
                    const horaFormateada = turno.fechaTurno 
                        ? new Date(turno.fechaTurno).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : "Sin hora";

                    return {
                    id: turno.id,
                    pacientes: turno.paciente ? turno.paciente.nombre : "Paciente no disponible",
                    especialidad: turno.especialidad,
                    hora: horaFormateada,
                    medico: turno.medico ? turno.medico.nombre : "Médico a designar", 
                    estado: turno.estado === "atendido" ? "Atendido" : "En espera",
                    };
                });

                // Guardamos los datos ya traducidos
                setTurnos(turnosMapeados);

            } catch (error) {
                console.error("Hubo un error al sincronizar", error);
            }
        };
        
        obtenerTurnosBackend();
    }, []);

    const turnosFiltrados = turnos.filter(turno =>
        turno.pacientes && turno.pacientes.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase())
    );

    const marcarAtendido = async (idTurno) => {

        try {
            await clientesAxios.patch(`/turnos/${idTurno}/atendido`);

            const turnosActualizados = turnos.map(turno => {
            if (turno.id === idTurno) {
                return { ...turno, estado: "Atendido" };
            }
                return turno;
            });
        setTurnos(turnosActualizados);

        } catch (error) {
            console.error(error);
            alert("error")
        
        }
    };

    const obtenerIniciales = (nombre) => {
        if (!nombre || nombre === "Paciente no disponible") return "?";
        const partes = nombre.trim().split(" ");
        const primera = partes[0]?.[0] || "";
        const segunda = partes[1]?.[0] || "";
        return (primera + segunda).toUpperCase();
    };

    return (
        <Container className={`mt-4 ${styles.dashboard}`}>
            <h2 className={`mb-4 ${styles.titulo}`}>Turnos del día</h2>

            <Row className="mb-4">
                <Col md={6} className={styles.buscador}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar paciente..."
                        value={busqueda}
                        onChange={(evento) => setBusqueda(evento.target.value)}
                    />
                </Col>
            </Row>

            <Row>
                {turnosFiltrados.length === 0 ? (
                    <Col>
                        <p className={styles.noTurnos}>No hay turnos disponibles.</p>
                    </Col>
                ) : (
                    turnosFiltrados.map((turno) => (
                        <Col md={4} key={turno.id} className="mb-3">
                            <Card className={`${styles.tarjetaTurno} ${turno.estado === "Atendido" ? styles.tarjetaAtendida : ""}`}>
                                <Card.Body>
                                    {/* PISO 1: Avatar, Nombre, Especialidad y Hora */}
                                    <div className={styles.encabezadoCard}>
                                        <div className={styles.avatar}>
                                            {obtenerIniciales(turno.pacientes)}
                                        </div>
                                        
                                        <div className={styles.infoPaciente}>
                                            <Card.Title className={styles.nombrePaciente}>
                                                {turno.pacientes}
                                            </Card.Title>
                                            <p className={styles.especialidad}>
                                                {turno.especialidad} | Dr/a. {turno.medico}
                                            </p>
                                            <p style={{ margin: 0, fontSize: "14px", color: "#4361ee", fontWeight: "600" }}>
                                                🕒 {turno.hora}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* PISO 2: Estado y Botón de Llamar */}
                                    <div className={styles.accionesCard}>
                                        <h5 className="mb-0">
                                            {turno.estado === "Atendido"
                                                ? <Badge bg="success">Atendido</Badge>
                                                : <Badge bg="warning" text="dark">En espera</Badge>
                                            }
                                        </h5>
                                        <Button size="sm" onClick={() => marcarAtendido(turno.id)} disabled={turno.estado === "Atendido"}>
                                            Llamar
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )} 
            </Row>
        </Container>
    );
};

export default DashboardRecepcion;