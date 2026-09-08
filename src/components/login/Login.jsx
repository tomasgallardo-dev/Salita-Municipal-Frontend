import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Container, Card, Form, Button } from 'react-bootstrap';
import clientesAxios from '../../config/axios_config.js'
import style from "./Login.module.scss";

const Login = () => {
    const [credenciales, setCredenciales] = useState({
        email: '',
        password: ''
    });

    const { email, password } = credenciales;
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredenciales({
            ...credenciales,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await clientesAxios.post('/auth/login', { email, password });
            const data = response.data;

            if (!data?.token) {
                throw new Error('Respuesta inesperada del servidor');
            }

            //guardo el token en el localStorage
            localStorage.setItem('token', data.token);
            toast.success('¡Bienvenido!');
            navigate('/dashboard');

        } catch (error) {
            const mensaje = error.response?.data?.error
                || error.response?.data?.message
                || 'Credencial Incorrecta por favor introducir bien la credencial';
            toast.error(mensaje);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{minHeight: '80vh'}}>
            <Card style={{ width: '420px' }} className="p-4 shadow">
                <h2 className="text-center mb-4">Iniciar Sesión</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            placeholder="Ingrese su email"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            placeholder="Ingrese su contraseña"
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 mt-2">
                        Ingresar
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default Login;