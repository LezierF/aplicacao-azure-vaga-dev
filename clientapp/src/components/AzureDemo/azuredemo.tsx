// AzureDemoComponent.tsx
import React, { useEffect, useState } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import axios from "axios";
import { Shield, Clock, User as UserIcon, Building, Activity, Globe, Users as UsersIcon, Loader } from "lucide-react";
import "./AzureDemoStyles.css";
import { msalInstance } from "../../services/MsalInstances";
import { loginRequest } from "../../authConfig";
import moment from "moment";

interface AuthUser {
    name: string;
    email: string;
    jobTitle: string;
    department: string;
    id: string;
}

interface LoginAttempt {
    date: string;
    status: "Success" | "Failure";
    device: string;
    ipAddress?: string;
    location: string;
}

interface TenantUser {
    name: string;
    userPrincipalName: string;
    lastLogin: string;
    role: string;
    isActive: boolean;
}

interface Group {
    name: string;
    members: number;
    groupType: string;
    description: string;
    createdDate?: string;
}

interface TenantData {
    recentLogins: LoginAttempt[];
    tenantUsers: TenantUser[];
    groups: Group[];
}

export const AzureDemoComponent: React.FC = () => {
    const isAuthenticated = useIsAuthenticated();
    const [authUser, setAuthUser] = useState<AuthUser | null>(null);
    const [loadingLogin, setLoadingLogin] = useState(false);

    const [tenantData, setTenantData] = useState<TenantData | null>(null);
    const [loadingTenant, setLoadingTenant] = useState(false);

    // Depois de logar via MSAL, busca /me usando token do MSAL
    useEffect(() => {
        if (isAuthenticated && !authUser) {
            (async () => {
                try {
                    const accounts = msalInstance.getAllAccounts();
                    if (!accounts.length) return;
                    const response = await msalInstance.acquireTokenSilent({
                        ...loginRequest,
                        account: accounts[0],
                    });
                    const token = response.accessToken;
                    console.log(token);
                    const meRes = await axios.get("http://localhost:5070/api/graph/me", {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    const u = meRes.data;
                    setAuthUser({
                        name: u.displayName,
                        email: u.mail || u.userPrincipalName,
                        jobTitle: u.jobTitle || "",
                        department: u.department || "",
                        id: u.id || "",
                    });
                } catch (err) {
                    console.error("Erro ao buscar perfil:", err);
                }
            })();
        }
    }, [isAuthenticated, authUser]);

    const handleLogin = async () => {
        setLoadingLogin(true);
        try {
            await msalInstance.loginPopup(loginRequest);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingLogin(false);
        }
    };

    const handleFetchData = async () => {
        setLoadingTenant(true);
        try {
            const accounts = msalInstance.getAllAccounts();
            if (!accounts.length) throw new Error("Nenhuma conta autenticada.");

            const response = await msalInstance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            });
            const token = response.accessToken;
            const headers = { Authorization: `Bearer ${token}` };
            console.log(token);
            const [loginsRes, usersRes, groupsRes] = await Promise.all([axios.get("http://localhost:5070/api/graph/signins", { headers }), axios.get("http://localhost:5070/api/graph/users", { headers }), axios.get("http://localhost:5070/api/graph/groups", { headers })]);

            setTenantData({
                recentLogins: loginsRes.data.value.map((l: any) => ({
                    date: l.createdDateTime,
                    status: l.status?.errorCode === 0 ? "Success" : "Failure",
                    device: l.deviceDetail?.operatingSystem || "Desconhecido",
                    ipAddress: l.ipAddress || "",
                    location: l.location?.city || "—",
                })),
                tenantUsers: usersRes.data.value.map((u: any) => ({
                    name: u.displayName,
                    userPrincipalName: u.userPrincipalName,
                    lastLogin: u.signInActivity?.lastSignInDateTime || "—",
                    role: u.jobTitle || "—",
                    isActive: u.accountEnabled,
                })),
                groups: groupsRes.data.value.map((g: any) => ({
                    name: g.displayName,
                    members: g.memberCount || 0,
                    groupType: g.securityEnabled ? "Security" : "Office",
                    description: g.description || "",
                    createdDate: g.createdDateTime || "",
                })),
            });
        } catch (err) {
            console.error("Erro ao buscar dados do tenant:", err);
        } finally {
            setLoadingTenant(false);
        }
    };

    const getStatusBadge = (status: "Success" | "Failure") => (status === "Success" ? <span className="azure-status-badge-success">{status}</span> : <span className="azure-status-badge-failure">{status}</span>);

    const getGroupTypeBadge = (groupType: string) => (
        <span
            style={{
                padding: "0.25rem 0.5rem",
                borderRadius: "0.375rem",
                fontSize: "0.75rem",
                fontWeight: 500,
                backgroundColor: "#eef2ff",
                color: "#4338ca",
            }}
        >
            {groupType}
        </span>
    );

    return (
        <div className="azure-wrapper">
            {!isAuthenticated ? (
                <div className="azure-card">
                    <div className="azure-card-header">
                        <h3 className="azure-card-title">
                            <Shield size={20} color="#2563eb" />
                            Autenticação Azure Entra ID
                        </h3>
                        <p className="azure-card-description">Clique no botão abaixo para fazer login e demonstrar as funcionalidades TypeScript</p>
                    </div>
                    <div className="azure-card-content azure-centered">
                        <button className={`azure-button ${loadingLogin ? "azure-button-disabled" : ""}`} onClick={handleLogin} disabled={loadingLogin}>
                            {loadingLogin ? (
                                <>
                                    <Clock size={16} style={{ animation: "spin 1s linear infinite" }} />
                                    Autenticando...
                                </>
                            ) : (
                                <>
                                    <Shield size={16} />
                                    Login com Entra ID
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="azure-grid-gap-6">
                    {authUser && (
                        <div className="azure-card">
                            <div className="azure-card-header">
                                <h3 className="azure-card-title">
                                    <UserIcon size={20} color="#16a34a" />
                                    Informações do Usuário Autenticado
                                </h3>
                            </div>
                            <div className="azure-card-content">
                                <div className="azure-info-grid">
                                    <div>
                                        <div className="azure-info-block">
                                            <p className="azure-label-gray">Nome</p>
                                            <p className="azure-value-large">{authUser.name}</p>
                                        </div>
                                        <div className="azure-info-block">
                                            <p className="azure-label-gray">Email</p>
                                            <p className="azure-value-large">{authUser.email}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="azure-info-block">
                                            <p className="azure-label-gray">Cargo</p>
                                            <p className="azure-value-large">{authUser.jobTitle}</p>
                                        </div>
                                        <div className="azure-info-block">
                                            <p className="azure-label-gray">Departamento</p>
                                            <p className="azure-value-large">{authUser.department}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="azure-info-block" style={{ gridColumn: "1 / -1" }}>
                                    <p className="azure-label-gray">ID do usuário no tenant</p>
                                    <p className="azure-mono-box">{authUser.id}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="azure-card">
                        <div className="azure-card-content azure-centered">
                            <button className={`azure-button ${loadingTenant ? "azure-button-disabled" : ""}`} onClick={handleFetchData} disabled={loadingTenant}>
                                {loadingTenant ? (
                                    <>
                                        <Loader className="loader-spin" size={22} />
                                        <span style={{ marginLeft: 8 }}>Carregando dados do Tenant...</span>
                                    </>
                                ) : (
                                    <>
                                        <Building size={22} />
                                        <span style={{ marginLeft: 8 }}>Carregar Dados do Tenant</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {tenantData && (
                        <>
                            <div className="azure-card">
                                <div className="azure-card-header">
                                    <h3 className="azure-card-title">
                                        <Activity size={20} color="#f97316" />
                                        Tentativas de Login Recentes
                                    </h3>
                                </div>
                                <div className="azure-card-content">
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                        {tenantData.recentLogins.map((login, idx) => (
                                            <div key={idx} className="azure-list-item">
                                                <div style={{ flex: 1 }}>
                                                    <div className="azure-login-flex">
                                                        <p className="azure-value-large">{moment(login.date).format('DD/MM/YY HH:mm:ss')}</p>
                                                        {getStatusBadge(login.status)}
                                                    </div>
                                                    <p className="azure-label-gray">{login.device}</p>
                                                    {login.ipAddress && <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>IP: {login.ipAddress}</p>}
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                    <Globe size={16} color="#9ca3af" />
                                                    <span style={{ fontSize: "0.875rem" }}>{login.location}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="azure-card">
                                <div className="azure-card-header">
                                    <h3 className="azure-card-title">
                                        <UsersIcon size={20} color="#7c3aed" />
                                        Usuários do Tenant
                                    </h3>
                                </div>
                                <div className="azure-card-content">
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                        {tenantData.tenantUsers.map((user, idx) => (
                                            <div key={idx} className="azure-list-item">
                                                <div style={{ flex: 1 }}>
                                                    <p className="azure-value-large">{user.name}</p>
                                                    <p className="azure-label-gray">
                                                        {user.userPrincipalName} • Último login: {user.lastLogin}
                                                    </p>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                    <span className="azure-role-badge">{user.role}</span>
                                                    {user.isActive && <span className="azure-active-badge">Ativo</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="azure-card">
                                <div className="azure-card-header">
                                    <h3 className="azure-card-title">
                                        <Building size={20} color="#4f46e5" />
                                        Grupos do Tenant
                                    </h3>
                                </div>
                                <div className="azure-card-content">
                                    <div className="azure-grid-gap-4">
                                        {tenantData.groups.map((group, idx) => (
                                            <div key={idx} className="azure-group-card">
                                                <div className="azure-group-header">
                                                    <h4 style={{ margin: 0, fontWeight: 600 }}>{group.name}</h4>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                        <span className="azure-role-badge">{group.members} membros</span>
                                                        {getGroupTypeBadge(group.groupType)}
                                                    </div>
                                                </div>
                                                <p style={{ fontSize: "0.875rem", color: "#4b5563", margin: "0 0 0.5rem 0" }}>{group.description}</p>
                                                {group.createdDate && <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>Criado em: {moment(group.createdDate).format('DD/MM/YYYY HH:mm:ss')}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
