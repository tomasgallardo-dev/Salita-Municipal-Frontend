import { Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';

import Login from './components/login/Login.tsx';
import LayoutPrincipal from './components/layout/LayoutPrincipal.tsx';
import DashboardRecepcion from './pages/DashboardRecepcion.tsx';
import FormularioPaciente from './components/pacientes/FormularioPaciente.tsx';
import ListaPacientes from './components/pacientes/ListaPacientes.tsx';
import DetalleTurno from './components/turnos/DetalleTurno';
import Consultorio from './components/consultorio/Consultorio.tsx';
import Especialidades from './components/especialidades/Especialidades.tsx';
import GestionMedicos from './components/medicos/GestionMedico.tsx';
import CrearTurno from './pages/CrearTurno.tsx';
import NotFound from './components/utils/NotFound.tsx';

// Componente de protección de rutas
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <>
            <Toaster position="top-right" richColors />
            <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Rutas protegidas */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <LayoutPrincipal />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<DashboardRecepcion />} />
                    <Route path="pacientes" element={<ListaPacientes />} />
                    <Route path="nuevo-paciente" element={<FormularioPaciente />} />
                    <Route path="editar-paciente/:id" element={<FormularioPaciente />} />
                    <Route path="turno-detalle/:id" element={<DetalleTurno />} />
                    <Route path="consultorios" element={<Consultorio />} />
                    <Route path="especialidades" element={<Especialidades />} />
                    <Route path="medicos" element={<GestionMedicos />} />
                    <Route path="nuevo-turno" element={<CrearTurno />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;