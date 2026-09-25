// Login - Pantalla de ingreso (email+password) que guarda el token en localStorage y navega al dashboard.
// Se conecta con: API /auth/login y Login.module.scss.

import { useState, type ChangeEvent, type FormEvent }  from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Form, Button } from 'react-bootstrap';
import clientesAxios from '../../config/axios_config'
import style from "./Login.module.scss";

const Login = () => {
    const [credenciales, setCredenciales] = useState({
        email: '',
        password: ''
    });

    const { email, password } = credenciales;
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof typeof credenciales;
        setCredenciales({
            ...credenciales,
            [name]: e.target.value
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

        } catch (error: any) {
            const mensaje = error.response?.data?.error
                || error.response?.data?.message
                || 'Credencial Incorrecta por favor introducir bien la credencial';
            toast.error(mensaje);
        }
    };

    return (
        <div className={style.fondoLogin}>
            <div className={style.cardLogin}>
                <div className={style.iconoLogin}>⚕</div>
                <h2 className={style.tituloLogin}>Salita Municipal</h2>
                <p className={style.subtituloLogin}>Ingresá a tu cuenta para acceder al sistema</p>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className={style.inputGroup}>
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
                    <Form.Group className={style.inputGroup}>
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

                    <Button variant="primary" type="submit" className={style.btnLogin}>
                        Ingresar
                    </Button>
                </Form>

                <p className={style.pieLogin}>Sistema de gestión de un centro de salud municipal</p>
            </div>
        </div>
    );
};

export default Login;