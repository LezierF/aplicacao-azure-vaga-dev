export const msalConfig = {
    auth: {
      clientId: "4d971e2b-ed22-47e3-be2a-16329bc13cdc",
      authority: "https://login.microsoftonline.com/a465de47-e2f7-4615-81ed-77c1be90f6ea",
      redirectUri: "http://localhost:3000",
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: false
    }
  };
  
  export const loginRequest = {
    scopes: ["User.Read", "Directory.Read.All", "AuditLog.Read.All"],
  };