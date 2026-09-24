import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { Modal, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { toast } from 'sonner';
import clientesAxios from '../../config/axios_config';
import type { IMedico } from '../../types/Medico.types';
import type { IEspecialidad } from '../../types/Especialidad.types';

interface ModalFormularioMedicoProps {
    show: boolean;
    onClose: () => void;
    medicoSeleccionado: IMedico | null;
    especialidades: IEspecialidad[];
    onGuardado: () => void;
}

const formularioVacio = {
    nombre: '',
    matricula: '',
    especialidad: '',
    telefono: '',
    email: ''
};

const ModalFormularioMedico = ({ show, onClose, medicoSeleccionado, especialidades, onGuardado }: ModalFormularioMedicoProps) => {
    const [form, setForm] = useState(formularioVacio);
    const [submitting, setSubmitting] = useState(false);
    const isEditing = !!medicoSeleccionado;

    useEffect(() => {
        if (show) {
            setForm(medicoSeleccionado ? {
                nombre: medicoSeleccionado.nombre || '',
                matricula: medicoSeleccionado.matricula || '',
                especialidad: typeof medicoSeleccionado.especialidad === 'object'
                    ? medicoSeleccionado.especialidad?.id || ''
                    : medicoSeleccionado.especialidad || '',
                telefono: medicoSeleccionado.telefono || '',
                email: medicoSeleccionado.email || ''
            } : formularioVacio);
        }
    }, [show, medicoSeleccionado]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const name = e.target.name as keyof typeof form;
        setForm((prev) => ({ ...prev, [name]: e.target.value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (isEditing && medicoSeleccionado?.id) {
                await clientesAxios.put(`/medicos/${medicoSeleccionado.id}`, form);
                toast.success('¡Médico actualizado con éxito!');
            } else {
                await clientesAxios.post('/medicos', form);
                toast.success('¡Médico registrado con éxito!');
            }
            onClose();
            onGuardado();
        } catch (error: any) {
            const mensaje = error.response?.data?.data || error.response?.data?.message || 'Error en la operación';
            const errorFinal = Array.isArray(mensaje) ? mensaje.join(', ') : mensaje;
            toast.error(errorFinal);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered size="lg">
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
                                        <option key={esp.id} value={esp.id}>
                                            {esp.nombre}
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
                    <Button variant="secondary" onClick={onClose} disabled={submitting}>
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
    );
};

export default ModalFormularioMedico;