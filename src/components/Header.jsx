const Header = () => {
    const titulo = "Salita Municipal";

    return (
        <header className="cabecera bg-primary text-white text-center p-4">
            <h1>{titulo}</h1>
            <p>Sistema de gestion de turno</p>
        </header>
    );
};

export default Header;