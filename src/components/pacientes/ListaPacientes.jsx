import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { toast } from 'sonner';
import { useFetch } from '../../hooks/useFetch';
import clientesAxios from '../../config/axios_config';

import TablaPacientes from './TablaPacientes';

const ListaPacientes = () => {
    const { data: pacientes, setData, isLoading, error } = useFetch('/pacientes');
    const [busqueda, setBusqueda] = useState("");
    const navigate = useNavigate();

    const manejarEditar = (paciente) => {
        const id = paciente.id || paciente._id;
        navigate(`/dashboard/editar-paciente/${id}`);
    };

    const manejarEliminar = async (paciente) => {
        const id = paciente.id || paciente._id;
        const confirmado = window.confirm(`¿Seguro que querés eliminar a ${paciente.nombre} ${paciente.apellido}?`);
        if (!confirmado) return;

        try {
            await clientesAxios.delete(`/pacientes/${id}`);
            setData((prev) => prev.filter((p) => (p.id || p._id) !== id));
            toast.success("Paciente eliminado correctamente");
        } catch (error) {
            toast.error("No se pudo eliminar el paciente");
        }
    };

    const pacientesFiltrados = pacientes?.filter(paciente => {
        const termino = busqueda.toLowerCase();
        const coincideNombre = paciente.nombre?.toLowerCase().includes(termino);
        const coincideDni = paciente.dni?.includes(termino);
        return coincideNombre || coincideDni;
    }) || [];

    return (
        <Container className="mt-4">
            <Row className="mb-4 align-items-center">
                <Col md={8}>
                    <h2>Listado de Pacientes</h2>
                </Col>
                <Col md={4}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por nombre o DNI..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </Col>
            </Row>

            {isLoading && (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Cargando pacientes...</p>
                </div>
            )}

            {error && (
                <div className="alert alert-danger">
                    Hubo un error al cargar la lista. Verifica tu conexión.
                </div>
            )}

            {!isLoading && !error && (
                <TablaPacientes
                    pacientes={pacientesFiltrados}
                    onEditar={manejarEditar}
                    onEliminar={manejarEliminar}
                />
            )}
        </Container>
    );
};

export default ListaPacientes;