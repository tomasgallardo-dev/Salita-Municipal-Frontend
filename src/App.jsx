import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Header from './components/Header'
import DashboardRecepcion from './pages/DashboardRecepcion'
import FormularioPaciente from './components/pacientes/FormularioPaciente'
import LayoutPrincipal from './components/layout/LayoutPrincipal'

function App() {

  return (
    <>
      <Toaster position="top-right" richColors/>
      <Routes>
        <Route pach="/" element={<LayoutPrincipal/>}>
        <Route index element={<DashboardRecepcion />} />
        <Route path="nuevo-paciente" element={<FormularioPaciente />} />
        </Route>
      </Routes>
    </>
  )
}

export default App;
