import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { Container, Row } from "react-bootstrap";
import { toast } from 'sonner';
import clientesAxios from "../config/axios";

import BuscadorTurnos from "../components/turnos/BuscadorTurnos";
import TurnoCard from "../components/turnos/TurnoCard";
import TurnoCardSkeleton from "../components/turnos/TurnoCardSkeleton";

const DashboardRecepcion = () => {
    const [busqueda, setBusqueda] = useState("");

    const { data: turnos, setData: setTurnos, isLoading } = useFetch('/turnos');

    const turnosFiltrados = turnos.filter(turno =>
        turno.pacientes && turno.pacientes.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase())
    );
    

    const marcarAtendido = async (idTurno) => {

        try {
            await clientesAxios.patch(`/turnos/${idTurno}/atendido`);

            const turnosActualizados = turnos.map(turno => {
            if (turno.id === idTurno) {
                return { ...turno, estado: "Atendido" };
            }
                return turno;
            });
        setTurnos(turnosActualizados);

        toast.success("Paciente llamado correctamente");

        } catch (error) {
            console.error(error);
            toast.error("No se pudo actualizar el turno");
        
        }
    };

    const obtenerIniciales = (nombre) => {
        if (!nombre || nombre === "Paciente no disponible") return "?";
        const partes = nombre.trim().split(" ");
        const primera = partes[0]?.[0] || "";
        const segunda = partes[1]?.[0] || "";
        return (primera + segunda).toUpperCase();
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Turnos del Día</h2>

            <BuscadorTurnos valor={busqueda} alCambiar={setBusqueda} />

            <Row>
                {isLoading ? (
                    [1, 2, 3, 4].map(item => <TurnoCardSkeleton key={item} />) 
                ) : turnos.length === 0 ? (
                    <p>No se encontraron turnos pendientes.</p>
                ) : 
                turnosFiltrados.map((turno) => (
                    <TurnoCard
                        key={turno.id}
                        turno={turno}
                        onAtender={marcarAtendido}
                    />
                ))}
            </Row>
        </Container>
    );
};

export default DashboardRecepcion;