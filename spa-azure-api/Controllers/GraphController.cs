using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class GraphController : ControllerBase
{
    private readonly GraphAuthService _authService;
    private readonly HttpClient _httpClient;

    public GraphController(GraphAuthService authService, HttpClient httpClient)
    {
        _authService = authService;
        _httpClient = httpClient;
    }

   [HttpGet("me")]
    public async Task<IActionResult> GetMeSpa([FromHeader(Name = "Authorization")] string authHeader)
    {
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
        {
            return Unauthorized("Token de acesso não informado");
        }

        string token = authHeader.Substring("Bearer ".Length).Trim();

        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _httpClient.GetAsync("https://graph.microsoft.com/v1.0/me");

        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            return Ok(content);
        }

        return StatusCode((int)response.StatusCode, "Erro ao chamar Microsoft Graph");
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsersSpa([FromHeader(Name = "Authorization")] string authHeader)
    {
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
        {
            return Unauthorized("Token de acesso não informado");
        }

        string token = authHeader.Substring("Bearer ".Length).Trim();

        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _httpClient.GetAsync("https://graph.microsoft.com/v1.0/users");

        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            return Ok(content);
        }

        return StatusCode((int)response.StatusCode, "Erro ao chamar Microsoft Graph");
    }

    [HttpGet("signins")]
    public async Task<IActionResult> GetSignIns([FromHeader(Name = "Authorization")] string authHeader)
    {
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
        {
            return Unauthorized("Token de acesso não informado");
        }

        string token = authHeader.Substring("Bearer ".Length).Trim();
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _httpClient.GetAsync("https://graph.microsoft.com/v1.0/auditLogs/signIns?$filter=createdDateTime ge 2025-06-02T00:00:00Z and createdDateTime le 2025-06-04T23:59:59Z");
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            return Ok(content);
        }
        return StatusCode((int)response.StatusCode, "Erro ao chamar Microsoft Graph para signIns");
    }

    [HttpGet("groups")]
    public async Task<IActionResult> GetGroups([FromHeader(Name = "Authorization")] string authHeader)
    {
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
        {
            return Unauthorized("Token de acesso não informado");
        }

        string token = authHeader.Substring("Bearer ".Length).Trim();
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _httpClient.GetAsync("https://graph.microsoft.com/v1.0/groups");
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            return Ok(content);
        }
        return StatusCode((int)response.StatusCode, "Erro ao chamar Microsoft Graph para groups");
    }

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

    [HttpGet("token-aplicativo")]
    public async Task<IActionResult> GetAccessToken()
    {
        var token = await _authService.GetAccessTokenAsync();
        return Ok(token);
    }
}