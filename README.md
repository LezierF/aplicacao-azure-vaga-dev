# Integração React/TypeScript com .NET e Azure AD

## 🚀  Visão Geral

Este projeto demonstra uma integração completa entre:

Frontend: Aplicação React com TypeScript, utilizando autenticação via Azure AD.

Backend: API em .NET 6 com acesso seguro à Microsoft Graph API.

Token de Aplicativo: Demonstração de uso para cenários mobile com client credentials.

### 📋 Pré-requisitos

Frontend	                      Backend
React 18	                      .NET 6 (ASP.NET Core)
TypeScript	                    MSAL.NET
MSAL.js	                        HttpClient
Axios	                          CORS Policy
Lucide React                    (ícones)	
CSS Modules



### ⚙️ Configuração do Azure AD

Crie dois registros de aplicativo no portal Azure:

🔷 Frontend (SPA):
    Redirect URI: http://localhost:3000
    Permissões: User.Read, openid, profile

🔷 Backend (Web API):
Crie um segredo do cliente 
Permissões (application):

    User.Read.All
    
    Group.Read.All
    
    AuditLog.Read.All



```


▶️ Execução
Backend:

  cd spa-azure-api
  dotnet run

Frontend:
  cd clientapp
  npm install
  npm start

```
🧪 Testando a Aplicação
  Login com Entra ID
  → Login com conta Azure AD
  → Visualização de perfil
  
  Dados do Tenant
  → Carregar usuários, grupos e logs
  
  Demonstração Mobile
  → Ativar modo mobile
  → Chamada com token de aplicativo
  → Verificar retorno do backend

📱 Links de Demonstração
  [Google Play](https://play.google.com/store/apps/details?id=edwin.reule.company.hywork&pcampaignid=web_share)

  [App Store](https://apps.apple.com/br/app/hylite/id6593709574)

📚 Recursos Úteis
  [Microsoft Graph Documentation](https://learn.microsoft.com/en-us/graph/)
  
  [MSAL.js Documentation](https://learn.microsoft.com/en-us/entra/identity-platform/msal-overview)
  
  [ASP.NET Core Authentication](https://learn.microsoft.com/en-us/aspnet/core/security/?view=aspnetcore-9.0)

⚠️ Boas Práticas
  Nunca comite segredos ou credenciais!
  
  Use:
  .gitignore para arquivos sensíveis
  Variáveis de ambiente locais
  Azure Key Vault para ambientes de produção

👨‍💻 Autor
  Lezier Fernandes
  Desenvolvedor Full Stack & Azure Specialist
  [🔗 LinkedIn](https://www.linkedin.com/in/lezierf/) | [🌐 Portfólio](https://www.legendevs.com.br/)

![image](https://github.com/user-attachments/assets/f6eb7c49-d4e8-4a7d-aaa5-8bef8f03230a)
![image](https://github.com/user-attachments/assets/39ff2f06-8601-4781-a259-8e472b656fe1)
![image](https://github.com/user-attachments/assets/96d0169d-d039-4bcc-a895-94575102e2a4)




  
