import { useState, useEffect } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import { toast } from 'sonner';
import clientesAxios from '../../config/axios_config';

const ModalNuevoTurno = ({ show, onHide, paciente }) => {
    const [especialidad, setEspecialidad] = useState("");
    const [medico, setMedico] = useState("");
    const [fechaTurno, setFechaTurno] = useState("");
    const [observaciones, setObservaciones] = useState("");

    const [medicos, setMedicos] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const cargarDatos = async () => {
            if (!show) return;
            setLoading(true);
            try {
                const [resMedicos, resEsp] = await Promise.all([
                    clientesAxios.get('/medicos'),
                    clientesAxios.get('/especialidades')
                ]);
                setMedicos(resMedicos.data.data || resMedicos.data);
                setEspecialidades(resEsp.data.data || resEsp.data);
            } catch (error) {
                toast.error("No se pudieron cargar los datos");
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
        // Limpiar campos al abrir
        setEspecialidad("");
        setMedico("");
        setFechaTurno("");
        setObservaciones("");
    }, [show]);

    // Filtrar médicos por especialidad seleccionada
    const medicosFiltrados = medicos.filter(med => {
        const espMedico = typeof med.especialidad === 'object'
            ? med.especialidad?.nombre?.toLowerCase()
            : med.especialidad?.toLowerCase();
        return espMedico === especialidad.toLowerCase();
    });

    const handleSubmit = async (evento) => {
        evento.preventDefault();

        if (!especialidad || !medico || !fechaTurno) {
            toast.warning("Por favor completa los campos obligatorios");
            return;
        }

        // Validar que la fecha sea futura
        const fechaSeleccionada = new Date(fechaTurno);
        const ahora = new Date();
        if (fechaSeleccionada <= ahora) {
            toast.warning("La fecha del turno debe ser futura");
            return;
        }

        setSubmitting(true);
        try {
            const nuevoTurno = {
                paciente: paciente._id || paciente.id,
                especialidad: especialidad,
                medico: medico,
                fechaTurno: fechaSeleccionada.toISOString(),
                observaciones: observaciones
            };

            await clientesAxios.post('/turnos', nuevoTurno);
            toast.success("¡Turno agendado con éxito!");
            onHide();
        } catch (error) {
            const mensajeError = error.response?.data?.message || "No se pudo crear el turno";
            toast.error(mensajeError);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Nuevo Turno: <span className="text-primary">{paciente?.nombre}</span>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" size="sm" />
                        <p className="mt-2 text-muted">Cargando...</p>
                    </div>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Especialidad Requerida *</Form.Label>
                            <Form.Select
                                value={especialidad}
                                onChange={(e) => {
                                    setEspecialidad(e.target.value);
                                    setMedico("");
                                }}
                            >
                                <option value="" disabled>Seleccione una especialidad...</option>
                                {especialidades.map(esp => (
                                    <option key={esp.id || esp._id} value={esp.nombre}>
                                        {esp.nombre}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Médico Disponible *</Form.Label>
                            <Form.Select
                                value={medico}
                                onChange={(e) => setMedico(e.target.value)}
                                disabled={!especialidad || medicosFiltrados.length === 0}
                            >
                                <option value="" disabled>
                                    {!especialidad
                                        ? "Primero seleccione una especialidad"
                                        : medicosFiltrados.length === 0
                                            ? "No hay médicos para esta especialidad"
                                            : "Seleccione un médico..."
                                    }
                                </option>
                                {medicosFiltrados.map(med => (
                                    <option key={med._id || med.id} value={med._id || med.id}>
                                        Dr/a. {med.nombre}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Fecha y Hora *</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={fechaTurno}
                                onChange={(e) => setFechaTurno(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Observaciones (Opcional)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                maxLength={500}
                                placeholder="Ej: Trae estudios previos..."
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2 border-top pt-3">
                            <Button variant="secondary" onClick={onHide} disabled={submitting}>
                                Cancelar
                            </Button>
                            <Button variant="success" type="submit" disabled={submitting}>
                                {submitting ? 'Agendando...' : 'Agendar Turno'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default ModalNuevoTurno;