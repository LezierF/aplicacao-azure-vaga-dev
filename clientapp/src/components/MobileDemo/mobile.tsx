// MobileDemoComponent.tsx
import React, { useEffect, useState } from "react";
import { Smartphone, Users } from "lucide-react";
import axios from "axios";
import "./MobileDemoStyles.css";

interface UserType {
    id: string;
    displayName: string;
    userPrincipalName: string;
}

export const MobileDemoComponent: React.FC = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get("http://localhost:5070/api/graph/users-by-aplication")
            .then((response) => {
                setUsers(response.data.value);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(true);
                setLoading(false);
            });
    }, []);

    return (
        <div className="section-wrapper">
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">
                        <Smartphone size={20} color="#2563eb" />
                        Simulação: App Mobile com Token de Aplicativo
                    </h3>
                    <p className="card-description">Demonstração TypeScript de como utilizo APIs com token de aplicativo em apps mobile sem a necessidade de login individual de usuários.</p>
                    <p className="card-note">Este aplicativo foi arquitetado, estudado e inteiramente desenvolvido por mim.</p>
                </div>

                <div className="card-content">
                    <div className="store-links">
                        <h4 className="text-medium">Confira o app nas lojas:</h4>
                        <ul className="store-list">
                            <li>
                                <a href="https://play.google.com/store/apps/details?id=edwin.reule.company.hywork&hl=pt_BR" target="_blank" rel="noopener noreferrer" className="store-link">
                                    Google Play
                                </a>
                            </li>
                            <li>
                                <a href="https://apps.apple.com/br/app/hylite/id6593709574" target="_blank" rel="noopener noreferrer" className="store-link">
                                    App Store
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="card-content">
                    <div className="code-box">
                        <code className="code-text">
                            {`

//Captura de token direta para aplicativo
public class GraphAuthService
{
    private readonly IConfiguration _config;

    public GraphAuthService(IConfiguration config)
    {
        _config = config;
    }

    public async Task<string> GetAccessTokenAsync()
    {
        var tenantId = _config["AzureAd:TenantId"];
        var clientId = _config["AzureAd:ClientId"];
        var clientSecret = _config["AzureAd:ClientSecret"];
        var scopes = new[] { "https://graph.microsoft.com/.default" };

        var app = ConfidentialClientApplicationBuilder.Create(clientId)
            .WithClientSecret(clientSecret)
            .WithAuthority($"https://login.microsoftonline.com/{tenantId}")
            .Build();

        var result = await app.AcquireTokenForClient(scopes).ExecuteAsync();
        return result.AccessToken;
    }
}

//Execução dentro do Controller
[HttpGet("users-by-aplication")]
public async Task<IActionResult> GetMe()
{
    var token = await _authService.GetAccessTokenAsync();
    _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

    var response = await _httpClient.GetAsync("https://graph.microsoft.com/v1.0/users");

    if (response.IsSuccessStatusCode)
    {
        var content = await response.Content.ReadAsStringAsync();
        return Ok(content);
    }

    return StatusCode((int)response.StatusCode, "Erro ao chamar Microsoft Graph");
}

`}
                        </code>
                    </div>

                    <div className="user-list">
                        <h4 className="text-medium" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Users size={16} />
                            Lista de Usuários (Tipada)
                        </h4>

                        {loading && <p>Carregando usuários...</p>}
                        {error && <p style={{ color: "#bf1e2e" }}>Erro ao carregar usuários.</p>}

                        {!loading &&
                            !error &&
                            users.map((user) => (
                                <div key={user.id} className="user-item">
                                    <div className="avatar-container">
                                        {user.displayName
                                            .split(" ")
                                            .map((n) => n.charAt(0))
                                            .join("")}
                                    </div>

                                    <div className="user-info">
                                        <p className="text-medium">{user.displayName}</p>
                                        <p className="text-small-gray">{user.userPrincipalName}</p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
