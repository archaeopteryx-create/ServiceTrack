# ServiceTrack

ServiceTrack is a small full-stack service request tracking application. It lets users create service requests, view all requests in a table, inspect request details, and move each request through a simple status workflow.

The project is split into:

- `ServiceTrack.Api`: ASP.NET Core Web API with Entity Framework Core and SQLite.
- `servicetrack.client`: React + TypeScript + Vite frontend.

## Features

- Create service requests with title, description, category, and priority.
- List requests ordered by newest first.
- Select a request to view detailed information.
- Update request status between `Open`, `Assigned`, `InProgress`, `Resolved`, and `Closed`.
- Track status changes in a `StatusHistories` table.
- Store data locally in SQLite.
- Expose OpenAPI metadata in development.

## Tech Stack

### Backend

- .NET `net10.0`
- ASP.NET Core Web API
- Entity Framework Core
- SQLite
- OpenAPI

### Frontend

- React 19
- TypeScript
- Vite
- Oxlint

## Project Structure

```text
ServiceTrack/
├── ServiceTrack.Api/
│   ├── Controllers/
│   │   └── ServiceRequestsController.cs
│   ├── Data/
│   │   └── AppDbContext.cs
│   ├── Migrations/
│   ├── Models/
│   │   ├── ServiceRequest.cs
│   │   └── StatusHistory.cs
│   ├── Program.cs
│   ├── ServiceTrack.Api.csproj
│   └── appsettings.json
└── servicetrack.client/
    ├── src/
    │   ├── App.tsx
    │   ├── App.css
    │   ├── main.tsx
    │   └── index.css
    ├── package.json
    └── vite.config.ts
```

## Prerequisites

- .NET SDK 10
- Node.js and npm
- Optional: `dotnet-ef` for applying Entity Framework migrations manually

Install `dotnet-ef` if needed:

```bash
dotnet tool install --global dotnet-ef
```

## Getting Started

### 1. Start the Backend API

```bash
cd ServiceTrack.Api
dotnet restore
dotnet ef database update
dotnet run --launch-profile http
```

The API runs at:

```text
http://localhost:5256
```

In development, OpenAPI metadata is available at:

```text
http://localhost:5256/openapi/v1.json
```

### 2. Start the Frontend

Open a second terminal:

```bash
cd servicetrack.client
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

The frontend currently calls the API at `http://localhost:5256`, which is defined in `servicetrack.client/src/App.tsx`.

## API Endpoints

Base URL:

```text
http://localhost:5256
```

### Service Requests

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/servicerequests` | Get all service requests, newest first. |
| `GET` | `/api/servicerequests/{id}` | Get one service request by ID. |
| `POST` | `/api/servicerequests` | Create a new service request. |
| `PUT` | `/api/servicerequests/{id}` | Update request fields. |
| `PATCH` | `/api/servicerequests/{id}/status` | Update only the request status. |
| `GET` | `/api/servicerequests/{id}/status-history` | Get status change history for one request. |

### Create Request Example

```json
{
  "title": "Cannot access Power BI dashboard",
  "description": "The dashboard returns an access denied error.",
  "category": "Access",
  "priority": "High",
  "status": "Open"
}
```

### Update Status Example

```json
{
  "status": "InProgress"
}
```

## Data Model

### ServiceRequest

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `int` | Primary key. |
| `title` | `string` | Required request title. |
| `description` | `string` | Required request description. |
| `category` | `string` | Defaults to `General`. |
| `priority` | `Low`, `Medium`, `High`, `Urgent` | Defaults to `Medium`. |
| `status` | `Open`, `Assigned`, `InProgress`, `Resolved`, `Closed` | Defaults to `Open`. |
| `createdAt` | `DateTime` | Set when the request is created. |
| `updatedAt` | `DateTime?` | Set when the request is updated. |
| `resolvedAt` | `DateTime?` | Set when status becomes `Resolved`. |

### StatusHistory

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `int` | Primary key. |
| `serviceRequestId` | `int` | Related service request ID. |
| `oldStatus` | `RequestStatus` | Previous status. |
| `newStatus` | `RequestStatus` | New status. |
| `changedAt` | `DateTime` | Timestamp of the status change. |

## Frontend Scripts

Run these commands inside `servicetrack.client`:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Backend Notes

- The default SQLite connection string is configured in `ServiceTrack.Api/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=servicetrack.db"
  }
}
```

- The API allows CORS requests from `http://localhost:5173`, which matches the Vite development server.
- Enum values are serialized as readable strings, such as `"High"` and `"InProgress"`.

## Common Workflow

1. Start the API with `dotnet run --launch-profile http`.
2. Start the frontend with `npm run dev`.
3. Open `http://localhost:5173`.
4. Create a request from the form.
5. Select a request from the table.
6. Change its status from the detail panel.

