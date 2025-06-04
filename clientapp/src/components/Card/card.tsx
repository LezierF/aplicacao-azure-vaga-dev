import { CheckCircle, Code } from 'lucide-react';
import './CardStyles.css'; // Este é o arquivo de estilos

export function TestCard() {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <CheckCircle className="icon green" />
          Requisitos do Teste Técnico - TypeScript
        </h2>
        <p className="card-description">
          Demonstração das funcionalidades implementadas com tipagem forte
        </p>
      </div>
      <div className="card-content">
        <div className="grid">
          <div className="section">
            <h4 className="section-title">
              <Code className="icon" /> ✅ Implementado:
            </h4>
            <ul className="section-list">
              <li>• Autenticação com Azure Entra ID</li>
              <li>• Exibição de informações do usuário</li>
              <li>• Nome e ID do Tenant</li>
              <li>• Tentativas de login recentes</li>
              <li>• Usuários do Tenant</li>
              <li>• Grupos do Tenant</li>
            </ul>
          </div>
          <div className="section">
            <h4 className="section-title">🛠️ Stack Tecnológica:</h4>
            <div className="badges">
              <span className="badge">TypeScript</span>
              <span className="badge">React</span>
              <span className="badge">.NET Core</span>
              <span className="badge">Azure Entra ID</span>
              <span className="badge">Microsoft Graph API</span>
              <span className="badge">MSAL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
