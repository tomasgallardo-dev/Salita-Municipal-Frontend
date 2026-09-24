//Aca se escarga de traer los datos de la API y manejar el estado de carga. Se puede reutilizar en cualquier componente que necesite hacer fetch de datos.
import { useState, useEffect } from 'react';
import clientesAxios from '../config/axios_config';
import { toast } from 'sonner';

export const useFetch = <T = any>(endpoint: string) => {
    const [data, setData] = useState<T>([] as T);
    const [response, setResponse] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            try {
                const respuesta = await clientesAxios.get(endpoint);
                setData(respuesta.data.data);
                setResponse(respuesta.data);
            } catch (error: any) {
                setError(error?.message || 'Error al cargar los datos');
                toast.error("Error al cargar los datos");
                console.log(`ERROR: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [endpoint]);

    return { data, setData, response, isLoading, error };
}