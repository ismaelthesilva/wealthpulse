# WealthPulse API 🚀

WealthPulse is a high-performance REST API designed to track financial assets (Stocks, ETFs, and REITs). It demonstrates modern .NET architecture patterns suitable for Enterprise-grade applications in the Fintech sector.

## 🛠 Tech Stack

- **Core:** .NET 8 (C# 12)
- **Database:** PostgreSQL (Neon.tech)
- **ORM:** Entity Framework Core (Code-First approach)
- **Testing:** xUnit + Moq
- **Architecture:** RESTful Web API with Repository Pattern & Dependency Injection

## 🏗 Architectural Decisions

### 1. Repository Pattern

I chose to implement the Repository Pattern (`IAssetRepository`) to decouple the Business Logic layer from the Data Access layer. This abstraction allows for:

- Easier Unit Testing (Mocking the database).
- Flexibility to switch ORMs or Databases in the future without breaking the Controllers.

### 2. TDD (Test Driven Development)

The project follows a TDD mindset. The Core logic and Controllers are covered by Unit Tests (`WealthPulse.Tests`) ensuring that the API contract holds true before integrating with the actual database.

### 3. Domain Design

- **Entities:** Rich domain models representing the core business data.
- **DTOs (Data Transfer Objects):** Implemented using C# `records` to ensure immutability and prevent over-posting attacks by not exposing internal Entities directly to the API surface.

## 🚀 How to Run

### Prerequisites

- .NET 8 SDK
- PostgreSQL Connection String

### Setup

1.  Clone the repository.
2.  Update `appsettings.json` with your DB connection string.
3.  Run migrations:
    ```bash
    dotnet ef database update
    ```
4.  Start the API:
    ```bash
    dotnet run --project WealthPulse.API
    ```

## 🧪 Running Tests

To validate the architectural integrity and logic:

```bash
dotnet test
```
