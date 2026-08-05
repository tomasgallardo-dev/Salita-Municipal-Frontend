import Header from './components/Header'
import PacienteCard from './components/PacienteCard'
import './App.css'

function App() {
  

  return (
    <>
      <Header />
      <PacienteCard nombre= "fulanito" obraSocial="PAMI" dni="12234456" direccion="lugar 123"/>
    </>
  )
}

export default App
