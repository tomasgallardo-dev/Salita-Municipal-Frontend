import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const NavbarPrincipal = () => {
    const navigate = useNavigate();

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Navbar bg='dark' variant='dark' expand="lg" className='mb-4'>
            <Container>
                <Link to="/dashboard" className="navbar-brand">Salita Municipal</Link>
                <Navbar.Toggle aria-controls='basic-navbar-nav'/>
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='me-auto'>
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        <Link to="/dashboard/pacientes" className="nav-link">Lista de Pacientes</Link>
                        <Link to="/dashboard/nuevo-paciente" className="nav-link">Registrar Paciente</Link>
                        <Link to="/dashboard/consultorios" className="nav-link">Consultorios</Link>
                        <Link to="/dashboard/especialidades" className="nav-link">Especialidades</Link>
                        <Link to="/dashboard/medicos" className="nav-link">Médicos</Link>
                        <Link to="/dashboard/nuevo-turno" className="nav-link">Nuevo Turno</Link>
                    </Nav>
                    <Button variant="outline-light" onClick={cerrarSesion}>
                        Cerrar sesión
                    </Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarPrincipal;