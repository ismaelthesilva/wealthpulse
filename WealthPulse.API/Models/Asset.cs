namespace WealthPulse.API.Models;

public class Asset
{
    public int Id { get; set; }
    public required string Symbol { get; set; } // Ex: SPY, QQQ
    public required string Name { get; set; }
    public decimal Quantity { get; set; }
    public decimal PricePerShare { get; set; }
    public string Type { get; set; } = "ETF"; // Stock, Crypto, REIT
    
    // Regra de Negócio Simples (Domain Logic)
    public decimal TotalValue() => Quantity * PricePerShare;
}

// DTO para entrada de dados (Clean Code: Nunca exponha sua entidade direta no Controller)
public record CreateAssetRequest(string Symbol, string Name, decimal Quantity, decimal PricePerShare, string Type);