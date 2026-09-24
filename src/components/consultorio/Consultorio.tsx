import { useState, useEffect } from 'react';
import { Container, Table, Button, Stack } from 'react-bootstrap';
import { toast } from 'sonner';
import clientesAxios from '../../config/axios_config';
import ModalFormularioConsultorio from './ModalFormularioConsultorio';
import ModalDetalleConsultorio from './ModalDetalleConsultorio.tsx';
import type { IConsultorio } from '../../types/Consultorio.types';
import type { IMedico } from '../../types/Medico.types';
import type { IEspecialidad } from '../../types/Especialidad.types';

const Consultorios = () => {
    const [consultorios, setConsultorios] = useState<IConsultorio[]>([]);
    const [medicos, setMedicos] = useState<IMedico[]>([]);
    const [especialidades, setEspecialidades] = useState<IEspecialidad[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDetalle, setShowDetalle] = useState(false);
    const [consultorioSeleccionado, setConsultorioSeleccionado] = useState<IConsultorio | null>(null);

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

    const handleEliminar = async (id: string) => {
        if (!window.confirm('¿Estás seguro de eliminar este consultorio?')) return;
        try {
            await clientesAxios.delete(`/consultorios/${id}`);
            toast.success('Consultorio eliminado');
            cargarDatos();
        } catch (error) {
            toast.error('No se pudo eliminar el consultorio');
        }
    };

    const abrirModalNuevo = () => {
        setConsultorioSeleccionado(null);
        setShowModal(true);
    };

    const abrirModalEditar = (c: IConsultorio) => {
        setConsultorioSeleccionado(c);
        setShowModal(true);
    };

    const abrirModalDetalle = (c: IConsultorio) => {
        setConsultorioSeleccionado(c);
        setShowDetalle(true);
    };

    return (
        <Container className="py-4">
            <Stack direction="horizontal" className="justify-content-between align-items-center mb-4">
                <h2>Gestión de Consultorios</h2>
                <Button variant="primary" onClick={abrirModalNuevo}>
                    Nuevo Consultorio
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
                                <td colSpan={5} className="text-center text-muted">No hay consultorios registrados.</td>
                            </tr>
                        ) : (
                            consultorios.map((c) => (
                                <tr key={c.id}>
                                    <td className="fw-semibold">Consultorio {c.numeroConsultorio}</td>
                                    <td>Piso {c.piso}</td>
                                    <td>{c.medico?.nombre || 'Sin asignar'}</td>
                                    <td>{c.email}</td>
                                    <td className="text-center">
                                        <Button variant="outline-info" size="sm" className="me-2" onClick={() => abrirModalDetalle(c)}>Ver</Button>
                                        <Button variant="primary" size="sm" className="me-2" onClick={() => abrirModalEditar(c)}>Editar</Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleEliminar(c.id)}>Eliminar</Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}

            <ModalFormularioConsultorio
                show={showModal}
                onClose={() => setShowModal(false)}
                consultorioSeleccionado={consultorioSeleccionado}
                medicos={medicos}
                especialidades={especialidades}
                onGuardado={cargarDatos}
            />
            <ModalDetalleConsultorio
                show={showDetalle}
                onClose={() => setShowDetalle(false)}
                consultorioSeleccionado={consultorioSeleccionado}
            />
        </Container>
    );
};

export default Consultorios;