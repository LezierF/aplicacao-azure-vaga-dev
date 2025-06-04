import { useMsal, MsalProvider, useIsAuthenticated } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, loginRequest } from "./authConfig";
import { msalInstance } from "./services/MsalInstances";
import { Shield } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { TestCard } from "./components/Card/card";
import { DemoToggle } from "./components/ToggleDemo/toggle";
import { MobileDemoComponent } from "./components/MobileDemo/mobile";
import { AzureDemoComponent } from "./components/AzureDemo/azuredemo";

const containerStyle = {
    maxWidth: "80rem",
    margin: "0 auto",
    padding: "2rem 1rem",
};

const headerStyle = {
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
    border: "1px solid #ddd",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "1rem",
};

const titleGroupStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: "1rem",
};

function MainApp() {
    const [isMsalReady, setIsMsalReady] = useState(false);
    const [showMobileDemo, setShowMobileDemo] = useState(false);

    useEffect(() => {
        const initMsal = async () => {
            try {
                await msalInstance.initialize();
                setIsMsalReady(true);
            } catch (err) {
                console.error("Erro ao inicializar MSAL", err);
            }
        };
        initMsal();
    }, []);

    if (!isMsalReady) {
        return <div>Carregando autenticação...</div>;
    }

    return (
        <div style={{ backgroundColor: "#E7EEFF", minHeight: "100vh" }}>
            <header style={headerStyle}>
                <Shield color="blue" size={46} />
                <div style={titleGroupStyle}>
                    <h1 style={{ fontSize: 24, margin: 0 }}>Azure Entra ID (Simulado)</h1>
                    <p style={{ fontSize: 16, color: "GrayText", margin: 0 }}>Teste Técnico - Integração React/TypeScript + .NET</p>
                </div>
            </header>

            <main style={containerStyle}>
                <TestCard />
                <DemoToggle setShowMobileDemo={setShowMobileDemo} showMobileDemo={showMobileDemo} />
                {showMobileDemo ? <MobileDemoComponent /> : <AzureDemoComponent/>}
            </main>
        </div>
    );
}

function App() {
    return (
        <MsalProvider instance={msalInstance}>
            <MainApp />
        </MsalProvider>
    );
}

export default App;
