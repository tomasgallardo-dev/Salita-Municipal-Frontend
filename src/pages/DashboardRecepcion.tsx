import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { Container, Row, Badge } from "react-bootstrap";
import { toast } from 'sonner';
import clientesAxios from "../config/axios_config";

import BuscadorTurnos from "../components/turnos/BuscadorTurnos";
import TurnoCard from "../components/turnos/TurnoCard";
import TurnoCardSkeleton from "../components/turnos/TurnoCardSkeleton";

import type { ITurno } from "../types/Turno.types";

const DashboardRecepcion = () => {
    const [busqueda, setBusqueda] = useState("");
    const [filtroFecha, setFiltroFecha] = useState("hoy"); // "hoy" | "proximos" | "todos"

    const { data: turnos, setData: setTurnos, isLoading } = useFetch<ITurno[]>('/turnos');

    const hoyString = new Date().toISOString().split('T')[0];

    // Filtrar por nombre
    const turnosFiltradosPorNombre = turnos.filter(turno => {
        const nombrePaciente = turno.paciente?.nombre || "";
        return nombrePaciente.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase());
    });

    // Filtrar por fecha según el tab seleccionado
    const turnosFiltrados = turnosFiltradosPorNombre.filter(turno => {
        if (!turno.fechaTurno) return false;
        const fechaTurno = new Date(turno.fechaTurno).toISOString().split('T')[0];

        if (filtroFecha === "hoy") return fechaTurno === hoyString;
        if (filtroFecha === "proximos") return fechaTurno > hoyString;
        return true; // "todos"
    });

    const marcarAtendido = async (idTurno: string) => {
        try {
            await clientesAxios.patch(`/turnos/${idTurno}/atendido`);

            const turnosActualizados = turnos.map((turno): ITurno => {
                if (turno.id === idTurno) {
                    return { ...turno, estado: "atendido" }; // minúscula como el backend
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

        const limpiarAtendidos = async () => {
        const confirmado = window.confirm("¿Eliminar todos los turnos atendidos? Esta acción no se deshace.");
        if (!confirmado) return;

        try {
            const resp = await clientesAxios.delete('/turnos/atendidos');
            // Quitamos del estado local los que quedaron "apagados"
            setTurnos(turnos.filter(t => t.estado !== "atendido"));
            const eliminados = resp.data?.data?.eliminados ?? 0;
            toast.success(eliminados > 0 ? `Se eliminaron ${eliminados} turno(s) atendido(s)` : "No había turnos atendidos");
        } catch (error) {
            console.error(error);
            toast.error("No se pudo limpiar los turnos atendidos");
        }
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Turnos</h2>
                <div>
                    <button className="btn btn-outline-danger btn-sm me-2" onClick={limpiarAtendidos}>
                        Limpiar atendidos
                    </button>
                    {["hoy", "proximos", "todos"].map((tipo) => (
                        <Badge
                            key={tipo}
                            bg={filtroFecha === tipo ? "primary" : "secondary"}
                            className="me-2 px-3 py-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => setFiltroFecha(tipo)}
                        >
                            {tipo === "hoy" ? "Hoy" : tipo === "proximos" ? "Próximos" : "Todos"}
                        </Badge>
                    ))}
                </div>
            </div>

            <BuscadorTurnos valor={busqueda} alCambiar={setBusqueda} />

            <Row>
                {isLoading ? (
                    [1, 2, 3, 4].map(item => <TurnoCardSkeleton key={item} />)
                ) : turnosFiltrados.length === 0 ? (
                    <p className="text-muted text-center py-5">
                        No se encontraron turnos {filtroFecha === "hoy" ? "para hoy" : ""}.
                    </p>
                ) : (
                    turnosFiltrados.map((turno) => (
                        <TurnoCard
                            key={turno.id}
                            turno={turno}
                            onAtender={marcarAtendido}
                        />
                    ))
                )}
            </Row>
        </Container>
    );
};

export default DashboardRecepcion;