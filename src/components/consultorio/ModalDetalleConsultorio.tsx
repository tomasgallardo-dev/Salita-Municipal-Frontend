import { Modal, Card, Button } from 'react-bootstrap';
import type { IConsultorio } from '../../types/Consultorio.types';

interface ModalDetalleConsultorioProps {
    show: boolean;
    onClose: () => void;
    consultorioSeleccionado: IConsultorio | null;
}

const ModalDetalleConsultorio = ({ show, onClose, consultorioSeleccionado }: ModalDetalleConsultorioProps) => {
    return (
        <Modal show={show} onHide={onClose} centered>
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
                <Button variant="secondary" onClick={onClose}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalDetalleConsultorio;