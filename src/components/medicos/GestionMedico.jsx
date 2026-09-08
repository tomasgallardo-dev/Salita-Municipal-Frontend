// src/components/medicos/GestionMedicos.jsx
// CRUD COMPLETO: Listar, Crear, Editar, Eliminar, Ver Detalle
import { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Card, Stack, Row, Col, Spinner } from 'react-bootstrap';
import { toast } from 'sonner';
import clientesAxios from '../../config/axios_config';

const GestionMedicos = () => {
    const [medicos, setMedicos] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Estados para modales
    const [showModal, setShowModal] = useState(false);
    const [showDetalle, setShowDetalle] = useState(false);
    const [medicoSeleccionado, setMedicoSeleccionado] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Estado del formulario
    const [form, setForm] = useState({
        nombre: '',
        matricula: '',
        especialidad: '',
        telefono: '',
        email: ''
    });

    // Cargar datos iniciales
    const cargarDatos = async () => {
        try {
            setLoading(true);
            const [resMedicos, resEsp] = await Promise.all([
                clientesAxios.get('/medicos'),
                clientesAxios.get('/especialidades')
            ]);

            setMedicos(resMedicos.data.data || resMedicos.data);
            setEspecialidades(resEsp.data.data || resEsp.data);
        } catch (error) {
            toast.error('Error al cargar médicos y especialidades');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const id = medicoSeleccionado?.id || medicoSeleccionado?._id;

            if (isEditing && id) {
                await clientesAxios.put(`/medicos/${id}`, form);
                toast.success('¡Médico actualizado con éxito!');
            } else {
                await clientesAxios.post('/medicos', form);
                toast.success('¡Médico registrado con éxito!');
            }

            setShowModal(false);
            limpiarFormulario();
            cargarDatos();
        } catch (error) {
            const mensaje = error.response?.data?.data || error.response?.data?.message || 'Error en la operación';
            const errorFinal = Array.isArray(mensaje) ? mensaje.join(', ') : mensaje;
            toast.error(errorFinal);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Estás seguro de dar de baja a este médico?')) return;

        try {
            await clientesAxios.delete(`/medicos/${id}`);
            toast.success('Médico eliminado correctamente');
            cargarDatos();
        } catch (error) {
            toast.error('No se pudo eliminar el médico');
        }
    };

    const abrirModalCrear = () => {
        limpiarFormulario();
        setShowModal(true);
    };

    const abrirModalEditar = (medico) => {
        setIsEditing(true);
        setMedicoSeleccionado(medico);
        setForm({
            nombre: medico.nombre || '',
            matricula: medico.matricula || '',
            especialidad: medico.especialidad?.id || medico.especialidad?._id || medico.especialidad || '',
            telefono: medico.telefono || '',
            email: medico.email || ''
        });
        setShowModal(true);
    };

    const abrirModalDetalle = (medico) => {
        setMedicoSeleccionado(medico);
        setShowDetalle(true);
    };

    const limpiarFormulario = () => {
        setIsEditing(false);
        setMedicoSeleccionado(null);
        setForm({
            nombre: '',
            matricula: '',
            especialidad: '',
            telefono: '',
            email: ''
        });
    };

    // Helper para mostrar nombre de especialidad
    const getNombreEspecialidad = (esp) => {
        if (typeof esp === 'string') return esp;
        return esp?.nombre || 'Sin especialidad';
    };

    return (
        <Container className="py-4">
            <Stack direction="horizontal" className="justify-content-between align-items-center mb-4">
                <h2>Gestión de Médicos</h2>
                <Button variant="primary" onClick={abrirModalCrear}>
                    ➕ Nuevo Médico
                </Button>
            </Stack>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 text-muted">Cargando médicos...</p>
                </div>
            ) : (
                <Table striped bordered hover responsive className="shadow-sm">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Matrícula</th>
                            <th>Especialidad</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicos.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center text-muted py-4">
                                    No hay médicos registrados.
                                </td>
                            </tr>
                        ) : (
                            medicos.map((m) => (
                                <tr key={m.id || m._id}>
                                    <td className="fw-semibold">{m.nombre}</td>
                                    <td>{m.matricula}</td>
                                    <td>{getNombreEspecialidad(m.especialidad)}</td>
                                    <td>{m.telefono}</td>
                                    <td>{m.email}</td>
                                    <td className="text-center">
                                        <Button variant="info" size="sm" className="me-2 text-white" onClick={() => abrirModalDetalle(m)}>
                                            Ver
                                        </Button>
                                        <Button variant="warning" size="sm" className="me-2 text-white" onClick={() => abrirModalEditar(m)}>
                                            Editar
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => handleEliminar(m.id || m._id)}>
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}

            {/* MODAL CREAR / EDITAR */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Editar Médico' : 'Registrar Nuevo Médico'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row className="mb-3">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Nombre Completo *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nombre"
                                        value={form.nombre}
                                        onChange={handleChange}
                                        required
                                        placeholder="Dr. Juan Pérez"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Matrícula *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="matricula"
                                        value={form.matricula}
                                        onChange={handleChange}
                                        required
                                        placeholder="MP 12345"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Especialidad *</Form.Label>
                                    <Form.Select name="especialidad" value={form.especialidad} onChange={handleChange} required>
                                        <option value="">Seleccione...</option>
                                        {especialidades.map(esp => (
                                            <option key={esp.id || esp._id} value={esp.id || esp._id}>
                                                {esp.nombre || esp}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Teléfono *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="telefono"
                                        value={form.telefono}
                                        onChange={handleChange}
                                        required
                                        placeholder="3777412345"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Correo Electrónico *</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="medico@salita.com"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)} disabled={submitting}>
                            Cancelar
                        </Button>
                        <Button variant="success" type="submit" disabled={submitting}>
                            {submitting ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                                    Guardando...
                                </>
                            ) : isEditing ? 'Guardar Cambios' : 'Registrar Médico'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* MODAL VER DETALLE */}
            <Modal show={showDetalle} onHide={() => setShowDetalle(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Detalle del Médico</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {medicoSeleccionado && (
                        <Card className="border-0">
                            <Card.Body>
                                <p><strong>Nombre:</strong> {medicoSeleccionado.nombre}</p>
                                <p><strong>Matrícula:</strong> {medicoSeleccionado.matricula}</p>
                                <p><strong>Especialidad:</strong> {getNombreEspecialidad(medicoSeleccionado.especialidad)}</p>
                                <p><strong>Teléfono:</strong> {medicoSeleccionado.telefono}</p>
                                <p><strong>Email:</strong> {medicoSeleccionado.email}</p>
                            </Card.Body>
                        </Card>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetalle(false)}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default GestionMedicos;