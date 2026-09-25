// GestionMedico - CRUD de medicos: lista con modales de detalle, alta/edicion y borrado.
// Se conecta con: ModalDetalleMedico, ModalFormularioMedico, medicoUtils y API /medicos.

import { useState, useEffect } from 'react';
import { Container, Table, Button, Stack, Spinner } from 'react-bootstrap';
import { toast } from 'sonner';
import clientesAxios from '../../config/axios_config';
import ModalFormularioMedico from './ModalFormularioMedico.tsx';
import ModalDetalleMedico from './ModalDetalleMedico.tsx';
import type { IMedico } from '../../types/Medico.types';
import type { IEspecialidad } from '../../types/Especialidad.types';
import { getNombreEspecialidad } from './medicoUtils';

const GestionMedicos = () => {
    const [medicos, setMedicos] = useState<IMedico[]>([]);
    const [especialidades, setEspecialidades] = useState<IEspecialidad[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDetalle, setShowDetalle] = useState(false);
    const [medicoSeleccionado, setMedicoSeleccionado] = useState<IMedico | null>(null);

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

    const handleEliminar = async (id: string) => {
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
        setMedicoSeleccionado(null);
        setShowModal(true);
    };

    const abrirModalEditar = (m: IMedico) => {
        setMedicoSeleccionado(m);
        setShowModal(true);
    };

    const abrirModalDetalle = (m: IMedico) => {
        setMedicoSeleccionado(m);
        setShowDetalle(true);
    };

    return (
        <Container className="py-4">
            <Stack direction="horizontal" className="justify-content-between align-items-center mb-4">
                <h2>Gestión de Médicos</h2>
                <Button variant="primary" onClick={abrirModalCrear}>
                    Nuevo Médico
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
                                <td colSpan={6} className="text-center text-muted py-4">
                                    No hay médicos registrados.
                                </td>
                            </tr>
                        ) : (
                            medicos.map((m) => (
                                <tr key={m.id}>
                                    <td className="fw-semibold">{m.nombre}</td>
                                    <td>{m.matricula}</td>
                                    <td>{getNombreEspecialidad(m.especialidad)}</td>
                                    <td>{m.telefono}</td>
                                    <td>{m.email}</td>
                                    <td className="text-center">
                                        <Button variant="outline-info" size="sm" className="me-2" onClick={() => abrirModalDetalle(m)}>Ver</Button>
                                        <Button variant="primary" size="sm" className="me-2" onClick={() => abrirModalEditar(m)}>Editar</Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleEliminar(m.id)}>Eliminar</Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}

            <ModalFormularioMedico
                show={showModal}
                onClose={() => setShowModal(false)}
                medicoSeleccionado={medicoSeleccionado}
                especialidades={especialidades}
                onGuardado={cargarDatos}
            />
            <ModalDetalleMedico
                show={showDetalle}
                onClose={() => setShowDetalle(false)}
                medicoSeleccionado={medicoSeleccionado}
            />
        </Container>
    );
};

export default GestionMedicos;