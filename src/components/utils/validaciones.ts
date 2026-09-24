export type ReglaValidacion = (valor: any) => string | null;

export interface ReglasValidacion {
    [campo: string]: ReglaValidacion;
}

export const validarDatos = (datos: any, reglas: ReglasValidacion): Record<string, string> => {
    let errores: Record<string, string> = {};

    for (let campo in reglas) {
        const mensajeError = reglas[campo](datos[campo]);
        if (mensajeError) {
            errores[campo] = mensajeError;
        }
    }
    return errores;
}