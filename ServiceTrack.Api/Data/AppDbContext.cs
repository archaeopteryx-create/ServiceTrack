using Microsoft.EntityFrameworkCore;
using ServiceTrack.Api.Models;

namespace ServiceTrack.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<ServiceRequest> ServiceRequests => Set<ServiceRequest>();
    public DbSet<StatusHistory> StatusHistories => Set<StatusHistory>();
}