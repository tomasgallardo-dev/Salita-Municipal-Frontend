import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';

const NavbarPrincipal = () => {
    const navigate = useNavigate();

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Navbar
            variant='dark'
            expand="lg"
            className='mb-4'
            style={{ background: "linear-gradient(135deg, #0f766e, #14b8a6)" }}
        >
            <Container>
                <NavLink to="/dashboard" className="navbar-brand">Salita Municipal</NavLink>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='me-auto'>
                        <NavLink end to="/dashboard" className="nav-link">Dashboard</NavLink>
                        <NavLink to="/dashboard/pacientes" className="nav-link">Lista de Pacientes</NavLink>
                        <NavLink to="/dashboard/nuevo-paciente" className="nav-link">Registrar Paciente</NavLink>
                        <NavLink to="/dashboard/consultorios" className="nav-link">Consultorios</NavLink>
                        <NavLink to="/dashboard/especialidades" className="nav-link">Especialidades</NavLink>
                        <NavLink to="/dashboard/medicos" className="nav-link">Médicos</NavLink>
                        <NavLink to="/dashboard/nuevo-turno" className="nav-link">Nuevo Turno</NavLink>
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