using Microsoft.AspNetCore.Mvc;
using WealthPulse.API.Models;
using WealthPulse.API.Repositories;

namespace WealthPulse.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AssetsController : ControllerBase
{
    private readonly IAssetRepository _repository;

    // Injeção de Dependência via Construtor (Padrão Ouro)
    public AssetsController(IAssetRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Asset>>> GetAssets()
    {
        var assets = await _repository.GetAllAsync();
        return Ok(assets);
    }

    [HttpPost]
    public async Task<ActionResult<Asset>> CreateAsset(CreateAssetRequest request)
    {
        var asset = new Asset
        {
            Symbol = request.Symbol,
            Name = request.Name,
            Quantity = request.Quantity,
            PricePerShare = request.PricePerShare,
            Type = request.Type
        };

        await _repository.AddAsync(asset);
        await _repository.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAssets), new { id = asset.Id }, asset);
    }
}