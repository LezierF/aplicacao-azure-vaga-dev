import { useState } from "react";
import { Smartphone, Server } from "lucide-react";

type DemoToggleProps = {
    showMobileDemo: boolean;
    setShowMobileDemo: (value: boolean) => void;
};

export function DemoToggle({ showMobileDemo, setShowMobileDemo }: DemoToggleProps) {
    const wrapperStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "center",
        marginBottom: "2rem",
    };

    const toggleBoxStyle: React.CSSProperties = {
        backgroundColor: "#fff",
        borderRadius: "0.5rem",
        padding: "0.25rem",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
        border: "1px solid #e5e7eb",
        display: "flex",
        gap: "0.5rem",
    };

    const buttonStyle = (active: boolean): React.CSSProperties => ({
        backgroundColor: active ? "#3b82f6" : "transparent", // azul se ativo
        color: active ? "white" : "#1f2937",
        padding: "0.375rem 0.75rem", // padding sm
        border: "none",
        borderRadius: "0.375rem",
        fontSize: "0.875rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        cursor: "pointer",
    });

    return (
        <div style={wrapperStyle}>
            <div style={toggleBoxStyle}>
                <button style={buttonStyle(!showMobileDemo)} onClick={() => setShowMobileDemo(false)}>
                    <Server size={16} />
                    Demo Azure Entra ID
                </button>
                <button style={buttonStyle(showMobileDemo)} onClick={() => setShowMobileDemo(true)}>
                    <Smartphone size={16} />
                    Demo App Mobile
                </button>
            </div>
        </div>
    );
}
