import { Table, Button } from 'react-bootstrap';

const TablaPacientes = ({ pacientes, onEditar, onEliminar }) => {
    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>DNI</th>
                    <th>Edad</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {pacientes?.length === 0 ? (
                    <tr>
                        <td colSpan="5" className="text-center py-3">
                            No se encontraron pacientes.
                        </td>
                    </tr>
                ) : (
                    pacientes?.map((paciente) => (
                        // Usamos _id porque en MongoDB suele venir así
                        <tr key={paciente._id || paciente.id}>
                            <td className="align-middle">{paciente.nombre}</td>
                            <td className="align-middle">{paciente.apellido}</td>
                            <td className="align-middle">{paciente.dni}</td>
                            <td className="align-middle">{paciente.edad}</td>
                            <td className="align-middle">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => onEditar(paciente)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => onEliminar(paciente)}
                                >
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </Table>
    );
};

export default TablaPacientes;