namespace ServiceTrack.Api.Models;

public class ServiceRequest
{
    public int Id { get; set; }

    public required string Title { get; set; }

    public required string Description { get; set; }

    public string Category { get; set; } = "General";

    public RequestPriority Priority { get; set; } = RequestPriority.Medium;

    public RequestStatus Status { get; set; } = RequestStatus.Open;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public DateTime? ResolvedAt { get; set; }
}

public enum RequestPriority
{
    Low,
    Medium,
    High,
    Urgent
}

public enum RequestStatus
{
    Open,
    Assigned,
    InProgress,
    Resolved,
    Closed
}