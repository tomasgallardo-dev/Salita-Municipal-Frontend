import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import Login from './components/login/Login';
import LayoutPrincipal from './components/layout/LayoutPrincipal';
import DashboardRecepcion from './pages/DashboardRecepcion';
import FormularioPaciente from './components/pacientes/FormularioPaciente';
import ListaPacientes from './components/pacientes/ListaPacientes';
import DetalleTurno from './components/turnos/DetalleTurno';
import Consultorio from './components/consultorio/Consultorio';
import Especialidades from './components/especialidades/Especialidades';
import GestionMedicos from './components/medicos/GestionMedico';
import CrearTurno from './pages/CrearTurno';
import NotFound from './components/utils/NotFound';

// Componente de protección de rutas
const ProtectedRoute = ({ children }) => {
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