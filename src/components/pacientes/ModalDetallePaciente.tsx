import { Modal, Card, Button } from 'react-bootstrap';
import type { IPaciente } from '../../types/Paciente.types';

interface ModalDetallePacienteProps {
    show: boolean;
    onClose: () => void;
    paciente: IPaciente | null;
}

const ModalDetallePaciente = ({ show, onClose, paciente }: ModalDetallePacienteProps) => {
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Información del Paciente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {paciente && (
                    <Card className="border-0">
                        <Card.Body>
                            <p><strong>Nombre:</strong> {paciente.nombre} {paciente.apellido}</p>
                            <p><strong>DNI:</strong> {paciente.dni}</p>
                            <p><strong>Fecha de nacimiento:</strong> {new Date(paciente.fechaNacimiento).toLocaleDateString('es-AR')} {paciente.edad !== null ? `(${paciente.edad} años)` : ''}</p>
                            <p><strong>Sexo:</strong> {paciente.sexo}</p>
                            <p><strong>Email:</strong> {paciente.correoelectronico || 'No informado'}</p>
                            <p><strong>Teléfono:</strong> {paciente.telefono.codigoArea ? `(${paciente.telefono.codigoArea}) ${paciente.telefono.numero}` : (paciente.telefono.numero || 'No informado')}</p>
                            <p><strong>Dirección:</strong> {paciente.direccion.calle} {paciente.direccion.numero}, {paciente.direccion.ciudad} ({paciente.direccion.provincia})</p>
                            <p><strong>Obra social:</strong> {paciente.historialMedico?.obraSocial || 'No informada'} {paciente.historialMedico?.numAfiliado ? `(N° ${paciente.historialMedico.numAfiliado})` : ''}</p>
                        </Card.Body>
                    </Card>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalDetallePaciente;