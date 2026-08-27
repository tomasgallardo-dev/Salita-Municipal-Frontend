//Aca se escarga de traer los datos de la API y manejar el estado de carga. Se puede reutilizar en cualquier componente que necesite hacer fetch de datos.
import { useState, useEffect } from 'react';
import clientesAxios from '../config/axios';
import { toast } from 'sonner';

export const useFetch = (endpoint) => {
    const [data, setData] = useState([]);
    const [response, setResponse] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const respuesta = await clientesAxios.get(endpoint);
                setData(respuesta.data.data);
                setResponse(respuesta.data);
            } catch (error) {
                toast.error("Error al cargar los datos");
                console.log("ERROR: ${error.message}");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [endpoint]);

    return { data, setData, response, isLoading };
}