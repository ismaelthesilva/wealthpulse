using Microsoft.EntityFrameworkCore;
using WealthPulse.API.Data;
using WealthPulse.API.Models;

namespace WealthPulse.API.Repositories;

public class AssetRepository : IAssetRepository
{
    private readonly AppDbContext _context;

    public AssetRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Asset>> GetAllAsync() => await _context.Assets.ToListAsync();
    
    public async Task<Asset?> GetByIdAsync(int id) => await _context.Assets.FindAsync(id);

    public async Task AddAsync(Asset asset) => await _context.Assets.AddAsync(asset);

    public async Task<bool> SaveChangesAsync() => await _context.SaveChangesAsync() > 0;
}