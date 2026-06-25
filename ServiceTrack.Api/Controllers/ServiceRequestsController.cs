using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServiceTrack.Api.Data;
using ServiceTrack.Api.Models;

namespace ServiceTrack.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServiceRequestsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ServiceRequestsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ServiceRequest>>> GetAll()
    {
        var requests = await _context.ServiceRequests
            .OrderByDescending(request => request.CreatedAt)
            .ToListAsync();

        return Ok(requests);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ServiceRequest>> GetById(int id)
    {
        var request = await _context.ServiceRequests.FindAsync(id);

        if (request is null)
        {
            return NotFound();
        }

        return Ok(request);
    }

    [HttpPost]
    public async Task<ActionResult<ServiceRequest>> Create(ServiceRequest request)
    {
        request.Id = 0;
        request.CreatedAt = DateTime.UtcNow;
        request.UpdatedAt = null;
        request.ResolvedAt = null;

        _context.ServiceRequests.Add(request);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = request.Id },
            request
        );
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ServiceRequest>> Update(int id, ServiceRequest updatedRequest)
    {
        var request = await _context.ServiceRequests.FindAsync(id);

        if (request is null)
        {
            return NotFound();
        }

        request.Title = updatedRequest.Title;
        request.Description = updatedRequest.Description;
        request.Category = updatedRequest.Category;
        request.Priority = updatedRequest.Priority;
        request.Status = updatedRequest.Status;
        request.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(request);
    }

    [HttpPatch("{id:int}/status")]
    public async Task<ActionResult<ServiceRequest>> UpdateStatus(int id, UpdateStatusRequest updateStatusRequest)
    {
        var request = await _context.ServiceRequests.FindAsync(id);

        if (request is null)
        {
            return NotFound();
        }

        var oldStatus = request.Status;

        if (oldStatus == updateStatusRequest.Status)
        {
            return Ok(request);
        }

        request.Status = updateStatusRequest.Status;
        request.UpdatedAt = DateTime.UtcNow;

        var history = new StatusHistory
        {
            ServiceRequestId = request.Id,
            OldStatus = oldStatus,
            NewStatus = updateStatusRequest.Status,
            ChangedAt = DateTime.UtcNow
        };

        _context.StatusHistories.Add(history);

        if (updateStatusRequest.Status == RequestStatus.Resolved)
        {
            request.ResolvedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return Ok(request);
    }
    [HttpGet("{id:int}/status-history")]
    public async Task<ActionResult<IEnumerable<StatusHistory>>> GetStatusHistory(int id)
    {
        var requestExists = await _context.ServiceRequests.AnyAsync(request => request.Id == id);

        if (!requestExists)
        {
            return NotFound();
        }

        var history = await _context.StatusHistories
            .Where(item => item.ServiceRequestId == id)
            .OrderByDescending(item => item.ChangedAt)
            .ToListAsync();

        return Ok(history);
    }
}

public class UpdateStatusRequest
{
    public RequestStatus Status { get; set; }
}