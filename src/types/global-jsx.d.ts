// React 19 eliminó el namespace global `JSX` (ahora vive en `React.JSX`).
// Este shim restaura `JSX.IntrinsicElements` global para herramientas/TS
// viejos que todavía lo buscan ahí (evita TS7026 en JSX intrínseco).
import type { JSX as ReactJSX } from 'react';

declare global {
    namespace JSX {
        interface IntrinsicElements extends ReactJSX.IntrinsicElements {}
    }
}

export {};