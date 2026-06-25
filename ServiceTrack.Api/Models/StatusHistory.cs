namespace ServiceTrack.Api.Models;

public class StatusHistory
{
    public int Id { get; set; }

    public int ServiceRequestId { get; set; }

    public RequestStatus OldStatus { get; set; }

    public RequestStatus NewStatus { get; set; }

    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

    public ServiceRequest? ServiceRequest { get; set; }
}