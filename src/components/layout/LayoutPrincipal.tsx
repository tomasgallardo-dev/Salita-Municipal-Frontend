// LayoutPrincipal - Shell de las rutas protegidas: navbar + <Outlet/>.
// Se conecta con: NavbarPrincipal y react-router (Outlet).

import NavbarPrincipal from "./NavbarPrincipal";
import { Outlet } from "react-router-dom";

const LayoutPrincipal = () => {
    return (
        <>
            <NavbarPrincipal/>
            <main>
                <Outlet/>
            </main>
        </>
    )
};

export default LayoutPrincipal;