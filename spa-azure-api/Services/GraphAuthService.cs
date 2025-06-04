using Microsoft.Identity.Client;

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
