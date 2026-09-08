// src/components/consultorio/Consultorios.jsx
import { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Card, Stack, Row, Col } from 'react-bootstrap';
import { toast } from 'sonner';
import clientesAxios from '../../config/axios_config';

const Consultorios = () => {
    const [consultorios, setConsultorios] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para modales y edición
    const [showModal, setShowModal] = useState(false);
    const [showDetalle, setShowDetalle] = useState(false);
    const [consultorioSeleccionado, setConsultorioSeleccionado] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Estado del formulario adaptado al modelo Consultorio
    const [form, setForm] = useState({
        medico: '',
        especialidad: '',
        numeroConsultorio: '',
        piso: '',
        direccion: '',
        codigoArea: '',
        numero: '',
        email: ''
    });

    const cargarDatos = async () => {
        try {
            const [resConsultorios, resMedicos, resEsp] = await Promise.all([
                clientesAxios.get('/consultorios'),
                clientesAxios.get('/medicos'),
                clientesAxios.get('/especialidades')
            ]);

            setConsultorios(resConsultorios.data.data || resConsultorios.data);
            setMedicos(resMedicos.data.data || resMedicos.data);
            setEspecialidades(resEsp.data.data || resEsp.data);
        } catch (error) {
            toast.error('Error al cargar la información de consultorios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const consultorioData = {
            medico: form.medico,
            especialidad: form.especialidad,
            numeroConsultorio: form.numeroConsultorio,
            piso: form.piso,
            direccion: form.direccion,
            telefono: {
                codigoArea: form.codigoArea,
                numero: form.numero
            },
            email: form.email
        };

        try {
            const id = consultorioSeleccionado?.id || consultorioSeleccionado?._id;
            if (isEditing && id) {
                await clientesAxios.put(`/consultorios/${id}`, consultorioData);
                toast.success('¡Consultorio actualizado con éxito!');
            } else {
                await clientesAxios.post('/consultorios', consultorioData);
                toast.success('¡Consultorio creado con éxito!');
            }

            setShowModal(false);
            limpiarFormulario();
            cargarDatos();
        } catch (error) {
            const mensaje = error.response?.data?.data || error.response?.data?.message || 'Error en la operación';
            const errorFinal = Array.isArray(mensaje) ? mensaje.join(', ') : mensaje;
            toast.error(errorFinal);
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este consultorio?')) return;
        try {
            await clientesAxios.delete(`/consultorios/${id}`);
            toast.success('Consultorio eliminado');
            cargarDatos();
        } catch (error) {
            toast.error('No se pudo eliminar el consultorio');
        }
    };

    const abrirModalEditar = (c) => {
        setIsEditing(true);
        setConsultorioSeleccionado(c);
        setForm({
            medico: c.medico?.id || c.medico?._id || '',
            especialidad: c.especialidad?.id || c.especialidad?._id || '',
            numeroConsultorio: c.numeroConsultorio || '',
            piso: c.piso || '',
            direccion: c.direccion || '',
            codigoArea: c.telefono?.codigoArea || '',
            numero: c.telefono?.numero || '',
            email: c.email || ''
        });
        setShowModal(true);
    };

    const abrirModalDetalle = (c) => {
        setConsultorioSeleccionado(c);
        setShowDetalle(true);
    };

    const limpiarFormulario = () => {
        setIsEditing(false);
        setConsultorioSeleccionado(null);
        setForm({
            medico: '',
            especialidad: '',
            numeroConsultorio: '',
            piso: '',
            direccion: '',
            codigoArea: '',
            numero: '',
            email: ''
        });
    };

    return (
        <Container className="py-4">
            <Stack direction="horizontal" className="justify-content-between align-items-center mb-4">
                <h2>Gestión de Consultorios</h2>
                <Button variant="primary" onClick={() => { limpiarFormulario(); setShowModal(true); }}>
                    ➕ Nuevo Consultorio
                </Button>
            </Stack>

            {loading ? (
                <p>Cargando consultorios...</p>
            ) : (
                <Table striped bordered hover responsive className="shadow-sm">
                    <thead>
                        <tr>
                            <th>Nº Consultorio</th>
                            <th>Piso</th>
                            <th>Médico a Cargo</th>
                            <th>Email</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {consultorios.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center text-muted">No hay consultorios registrados.</td>
                            </tr>
                        ) : (
                            consultorios.map((c) => (
                                <tr key={c.id || c._id}>
                                    <td className="fw-semibold">Consultorio {c.numeroConsultorio}</td>
                                    <td>Piso {c.piso}</td>
                                    <td>{c.medico?.nombre || 'Sin asignar'}</td>
                                    <td>{c.email}</td>
                                    <td className="text-center">
                                        <Button variant="info" size="sm" className="me-2 text-white" onClick={() => abrirModalDetalle(c)}>Ver</Button>
                                        <Button variant="warning" size="sm" className="me-2 text-white" onClick={() => abrirModalEditar(c)}>Editar</Button>
                                        <Button variant="danger" size="sm" onClick={() => handleEliminar(c.id || c._id)}>Eliminar</Button>
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
                    <Modal.Title>{isEditing ? 'Editar Consultorio' : 'Nuevo Consultorio'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Médico a Cargo *</Form.Label>
                                    <Form.Select name="medico" value={form.medico} onChange={handleChange} required>
                                        <option value="">Seleccione un médico...</option>
                                        {medicos.map(m => (
                                            <option key={m.id || m._id} value={m.id || m._id}>{m.nombre}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Especialidad *</Form.Label>
                                    <Form.Select name="especialidad" value={form.especialidad} onChange={handleChange} required>
                                        <option value="">Seleccione una especialidad...</option>
                                        {especialidades.map(esp => (
                                            <option key={esp.id || esp._id} value={esp.id || esp._id}>{esp.nombre || esp}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Número de Consultorio *</Form.Label>
                                    <Form.Control type="text" name="numeroConsultorio" value={form.numeroConsultorio} onChange={handleChange} required maxLength="3" placeholder="Ej: 12" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Piso *</Form.Label>
                                    <Form.Control type="text" name="piso" value={form.piso} onChange={handleChange} required maxLength="2" placeholder="Ej: 1" />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Dirección Física *</Form.Label>
                            <Form.Control type="text" name="direccion" value={form.direccion} onChange={handleChange} required placeholder="Calle y número" />
                        </Form.Group>

                        <Row className="mb-3">
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Cód. Área *</Form.Label>
                                    <Form.Control type="text" name="codigoArea" value={form.codigoArea} onChange={handleChange} required placeholder="3777" />
                                </Form.Group>
                            </Col>
                            <Col md={8}>
                                <Form.Group>
                                    <Form.Label>Teléfono *</Form.Label>
                                    <Form.Control type="text" name="numero" value={form.numero} onChange={handleChange} required placeholder="Número local" />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Correo Electrónico *</Form.Label>
                            <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required placeholder="consultorio@salita.com" />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                        <Button variant="success" type="submit">{isEditing ? 'Guardar Cambios' : 'Crear'}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* MODAL VER DETALLE */}
            <Modal show={showDetalle} onHide={() => setShowDetalle(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Detalle del Consultorio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {consultorioSeleccionado && (
                        <Card className="border-0">
                            <Card.Body>
                                <p><strong>Número:</strong> Consultorio {consultorioSeleccionado.numeroConsultorio}</p>
                                <p><strong>Piso:</strong> Piso {consultorioSeleccionado.piso}</p>
                                <p><strong>Médico:</strong> {consultorioSeleccionado.medico?.nombre || 'No asignado'}</p>
                                <p><strong>Dirección:</strong> {consultorioSeleccionado.direccion}</p>
                                <p><strong>Teléfono:</strong> ({consultorioSeleccionado.telefono?.codigoArea}) {consultorioSeleccionado.telefono?.numero}</p>
                                <p><strong>Email:</strong> {consultorioSeleccionado.email}</p>
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

export default Consultorios;