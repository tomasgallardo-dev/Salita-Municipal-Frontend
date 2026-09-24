import { Modal, Card, Button } from 'react-bootstrap';
import type { IMedico } from '../../types/Medico.types';
import { getNombreEspecialidad } from './medicoUtils';

interface ModalDetalleMedicoProps {
    show: boolean;
    onClose: () => void;
    medicoSeleccionado: IMedico | null;
}

const ModalDetalleMedico = ({ show, onClose, medicoSeleccionado }: ModalDetalleMedicoProps) => {
    return (
        <Modal show={show} onHide={onClose} centered>
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
                <Button variant="secondary" onClick={onClose}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalDetalleMedico;