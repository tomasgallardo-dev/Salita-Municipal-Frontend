interface JsonDebuggerProps {
    data: unknown;
    titulo?: string;
}

const JsonDebugger = ({ data, titulo = "Estado actual del JSON" }: JsonDebuggerProps) => {
    if (!data) {
        return null;
    }

    return (
        <div style={{
            backgroundColor: "#66a3ea",
            padding: "10px",
            borderRadius: "5px",
            marginTop: "20px",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            color: "#333",
            fontSize: "14px",
            fontWeight: "normal",
            overflowX: "auto"
        }}>
            <p style={{
                margin: '0 0 10px 0',
                color: '#0d0d0d',
                fontWeight: 'bold'
            }}>
            </p>
            <h3>{titulo}</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default JsonDebugger;