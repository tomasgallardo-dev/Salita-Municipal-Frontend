// CrearTurno - Alta de turno: filtra medicos por especialidad, valida fecha futura y envia urgente.
// Se conecta con: API /turnos, /pacientes, /medicos y /especialidades.

import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Row, Col, Spinner } from 'react-bootstrap';
import { toast } from 'sonner';
import clientesAxios from '../config/axios_config';
import type { IPaciente } from '../types/Paciente.types';
import type { IMedico } from '../types/Medico.types';
import type { IEspecialidad } from '../types/Especialidad.types';

const CrearTurno = () => {
    const navigate = useNavigate();

    const [pacientes, setPacientes] = useState<IPaciente[]>([]);
    const [medicos, setMedicos] = useState<IMedico[]>([]);
    const [especialidades, setEspecialidades] = useState<IEspecialidad[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        paciente: '',
        medico: '',
        especialidad: '',
        fechaTurno: '',
        urgente: false,
        observaciones: ''
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [resP, resM, resE] = await Promise.all([
                    clientesAxios.get('/pacientes'),
                    clientesAxios.get('/medicos'),
                    clientesAxios.get('/especialidades')
                ]);

                setPacientes(resP.data.data || resP.data);
                setMedicos(resM.data.data || resM.data);
                setEspecialidades(resE.data.data || resE.data);
            } catch (error) {
                toast.error('Error al cargar datos necesarios para el turno');
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);

    // Filtrar médicos según especialidad seleccionada
    const medicosFiltrados = medicos.filter(m => {
        if (!form.especialidad) return false;
        const espMedico = typeof m.especialidad === 'object'
            ? m.especialidad?.nombre?.toLowerCase()
            : m.especialidad?.toLowerCase();
        return espMedico === form.especialidad.toLowerCase();
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const name = e.target.name as keyof typeof form;
        const nuevoValor = e.target.type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : e.target.value;

        setForm(prev => {
            const next = { ...prev, [name]: nuevoValor } as typeof prev;
            // Si cambia especialidad, resetear médico
            if (name === 'especialidad') next.medico = '';
            return next;
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validar fecha futura
        const fechaSeleccionada = new Date(form.fechaTurno);
        if (fechaSeleccionada <= new Date()) {
            toast.warning("La fecha del turno debe ser futura");
            return;
        }

        setSubmitting(true);

        const turnoData = {
            paciente: form.paciente,
            medico: form.medico || null,
            especialidad: form.especialidad
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase(),
            fechaTurno: form.fechaTurno,
            observaciones: form.observaciones,
            urgente: form.urgente
        };

        try {
            await clientesAxios.post('/turnos', turnoData);
            toast.success('¡Turno registrado exitosamente!');
            navigate('/dashboard');
        } catch (error: any) {
            const detalle = error.response?.data?.data;
            const mensaje = error.response?.data?.message || 'Error al crear el turno';
            let errorFinal = mensaje;
            if (Array.isArray(detalle)) {
                errorFinal = detalle.map((d: any) => 
                typeof d === 'string' ? d : `${d.campo}: ${d.mensaje}`)
                .join('.')
            }
            toast.error(errorFinal);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Cargando datos...</p>
            </Container>
        );
    }

    return (
        <Container className="py-5" style={{ maxWidth: '650px' }}>
            <Card className="p-4 shadow border-0">
                <h2 className="mb-4 text-center">Asignar Nuevo Turno</h2>
                <Form onSubmit={handleSubmit}>

                    <Form.Group className="mb-3">
                        <Form.Label>Seleccionar Paciente *</Form.Label>
                        <Form.Select name="paciente" value={form.paciente} onChange={handleChange} required>
                            <option value="">Seleccione un paciente...</option>
                            {pacientes.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nombre} - DNI: {p.dni}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Especialidad *</Form.Label>
                                <Form.Select name="especialidad" value={form.especialidad} onChange={handleChange} required>
                                    <option value="">Seleccione...</option>
                                    {especialidades.map((esp) => (
                                        <option key={esp.id} value={esp.nombre}>
                                            {esp.nombre}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Médico Asignado *</Form.Label>
                                <Form.Select
                                    name="medico"
                                    value={form.medico}
                                    onChange={handleChange}
                                    required
                                    disabled={!form.especialidad || medicosFiltrados.length === 0}
                                >
                                    <option value="">
                                        {!form.especialidad
                                            ? "Primero seleccione especialidad"
                                            : medicosFiltrados.length === 0
                                                ? "No hay médicos"
                                                : "Seleccione médico..."
                                        }
                                    </option>
                                    {medicosFiltrados.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.nombre}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Fecha y Hora del Turno *</Form.Label>
                        <Form.Control type="datetime-local" name="fechaTurno" value={form.fechaTurno} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Observaciones</Form.Label>
                        <Form.Control as="textarea" rows={3} name="observaciones" value={form.observaciones} onChange={handleChange} placeholder="Detalles o síntomas..." />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Check
                            type="checkbox"
                            label="Ingreso por Guardia Médica (Urgencia)"
                            name="urgente"
                            checked={form.urgente}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 py-2" disabled={submitting}>
                        {submitting ? 'Registrando...' : 'Confirmar Turno'}
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default CrearTurno;