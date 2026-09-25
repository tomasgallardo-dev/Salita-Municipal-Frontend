// useFetch - Hook GET generico: devuelve { data, setData, isLoading, error } contra la API.
// Se conecta con: axios_config (clientesAxios) y sonner (toast de error).
import { useState, useEffect } from 'react';
import clientesAxios from '../config/axios_config';
import { toast } from 'sonner';

export const useFetch = <T = any>(endpoint: string) => {
    const [data, setData] = useState<T>([] as T);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            try {
                const respuesta = await clientesAxios.get(endpoint);
                setData(respuesta.data.data);
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

    return { data, setData, isLoading, error };
}