using Microsoft.EntityFrameworkCore;
using WealthPulse.API.Models;

namespace WealthPulse.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Asset> Assets { get; set; }
}