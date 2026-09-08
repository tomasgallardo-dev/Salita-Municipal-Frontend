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
                <Navbar.Brand as={Link} to="/dashboard">Salita Municipal</Navbar.Brand>
                <Navbar.Toggle aria-controls='basic-navbar-nav'/>
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='me-auto'>
                        <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                        <Nav.Link as={Link} to="/dashboard/pacientes">Lista de Pacientes</Nav.Link>
                        <Nav.Link as={Link} to="/dashboard/nuevo-paciente">Registrar Paciente</Nav.Link>
                        <Nav.Link as={Link} to="/dashboard/consultorios">Consultorios</Nav.Link>
                        <Nav.Link as={Link} to="/dashboard/especialidades">Especialidades</Nav.Link>
                        <Nav.Link as={Link} to="/dashboard/medicos">Médicos</Nav.Link>
                        <Nav.Link as={Link} to="/dashboard/nuevo-turno">Nuevo Turno</Nav.Link>
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