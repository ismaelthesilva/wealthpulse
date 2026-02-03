using WealthPulse.API.Models;

namespace WealthPulse.API.Repositories;

public interface IAssetRepository
{
    Task<IEnumerable<Asset>> GetAllAsync();
    Task<Asset?> GetByIdAsync(int id);
    Task AddAsync(Asset asset);
    Task<bool> SaveChangesAsync();
}