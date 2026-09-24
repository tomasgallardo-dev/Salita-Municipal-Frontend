import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'sonner';
import clientesAxios from '../../config/axios_config';
import type { IConsultorio } from '../../types/Consultorio.types';
import type { IMedico } from '../../types/Medico.types';
import type { IEspecialidad } from '../../types/Especialidad.types';

interface ModalFormularioConsultorioProps {
    show: boolean;
    onClose: () => void;
    consultorioSeleccionado: IConsultorio | null;
    medicos: IMedico[];
    especialidades: IEspecialidad[];
    onGuardado: () => void;
}

const formularioVacio = {
    medico: '',
    especialidad: '',
    numeroConsultorio: '',
    piso: '',
    direccion: '',
    codigoArea: '',
    numero: '',
    email: ''
};

const ModalFormularioConsultorio = ({ show, onClose, consultorioSeleccionado, medicos, especialidades, onGuardado }: ModalFormularioConsultorioProps) => {
    const [form, setForm] = useState(formularioVacio);
    const isEditing = !!consultorioSeleccionado;

    useEffect(() => {
        if (show) {
            setForm(consultorioSeleccionado ? {
                medico: consultorioSeleccionado.medico?.id || '',
                especialidad: consultorioSeleccionado.especialidad?.id || '',
                numeroConsultorio: consultorioSeleccionado.numeroConsultorio || '',
                piso: consultorioSeleccionado.piso || '',
                direccion: consultorioSeleccionado.direccion || '',
                codigoArea: consultorioSeleccionado.telefono?.codigoArea || '',
                numero: consultorioSeleccionado.telefono?.numero || '',
                email: consultorioSeleccionado.email || ''
            } : formularioVacio);
        }
    }, [show, consultorioSeleccionado]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const name = e.target.name as keyof typeof form;
        setForm((prev) => ({ ...prev, [name]: e.target.value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const consultorioData = {
            medico: form.medico,
            especialidad: form.especialidad,
            numeroConsultorio: form.numeroConsultorio,
            piso: form.piso,
            direccion: form.direccion,
            telefono: { codigoArea: form.codigoArea, numero: form.numero },
            email: form.email
        };

        try {
            if (isEditing && consultorioSeleccionado?.id) {
                await clientesAxios.put(`/consultorios/${consultorioSeleccionado.id}`, consultorioData);
                toast.success('¡Consultorio actualizado con éxito!');
            } else {
                await clientesAxios.post('/consultorios', consultorioData);
                toast.success('¡Consultorio creado con éxito!');
            }
            onClose();
            onGuardado();
        } catch (error: any) {
            const mensaje = error.response?.data?.data || error.response?.data?.message || 'Error en la operación';
            const errorFinal = Array.isArray(mensaje) ? mensaje.join(', ') : mensaje;
            toast.error(errorFinal);
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered size="lg">
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
                                        <option key={m.id} value={m.id}>{m.nombre}</option>
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
                                        <option key={esp.id} value={esp.id}>{esp.nombre}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Número de Consultorio *</Form.Label>
                                <Form.Control type="text" name="numeroConsultorio" value={form.numeroConsultorio} onChange={handleChange} required maxLength={3} placeholder="Ej: 12" />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Piso *</Form.Label>
                                <Form.Control type="text" name="piso" value={form.piso} onChange={handleChange} required maxLength={2} placeholder="Ej: 1" />
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
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button variant="success" type="submit">{isEditing ? 'Guardar Cambios' : 'Crear'}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalFormularioConsultorio;