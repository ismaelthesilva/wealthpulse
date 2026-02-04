# WealthPulse API 🚀

> **Production-grade REST API** for financial asset tracking (Stocks, ETFs, REITs) demonstrating enterprise-level .NET architecture patterns for the Fintech sector.

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-passing-success)](./WealthPulse.Tests)

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture--design-patterns)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Testing](#-testing-strategy)
- [Deployment](#-deployment)
- [Security](#-security-considerations)

## 🛠 Tech Stack

### Backend

- **.NET 8** (C# 12) - Latest LTS framework with modern language features
- **ASP.NET Core Web API** - RESTful API architecture
- **Entity Framework Core 8** - Code-First ORM with migrations
- **PostgreSQL** - Enterprise-grade relational database (Neon.tech hosted)
- **Npgsql** - High-performance PostgreSQL provider

### Frontend

- **TypeScript** - Type-safe JavaScript with strict mode enabled
- **Vanilla JS/HTML/CSS** - Zero-dependency modern web stack
- **Responsive Design** - Mobile-first approach

### Testing & Quality

- **xUnit** - Modern testing framework for .NET
- **Moq** - Mocking library for isolated unit tests
- **TDD Approach** - Test-first development methodology

### DevOps & Deployment

- **Railway/Azure** - Backend hosting options
- **Vercel** - Frontend static hosting with CDN
- **Git** - Version control with conventional commits

## 🏗 Architecture & Design Patterns

### 1. **Layered Architecture**

```
┌─────────────────────────────────────┐
│   Presentation Layer (Controllers)   │ ← HTTP Endpoints
├─────────────────────────────────────┤
│   Business Logic (Repositories)      │ ← Domain Rules
├─────────────────────────────────────┤
│   Data Access (EF Core + DbContext)  │ ← ORM
├─────────────────────────────────────┤
│   Database (PostgreSQL)              │ ← Persistence
└─────────────────────────────────────┘
```

### 2. **Repository Pattern**

**Why:** Decouples data access from business logic, enabling:

- ✅ **Testability** - Mock database operations without real DB
- ✅ **Flexibility** - Swap ORMs or databases without breaking controllers
- ✅ **Maintainability** - Single responsibility for each layer
- ✅ **Reusability** - Share repository logic across controllers

**Implementation:**

```csharp
public interface IAssetRepository
{
    Task<IEnumerable<Asset>> GetAllAsync();
    Task<Asset?> GetByIdAsync(int id);
    Task AddAsync(Asset asset);
    Task<bool> SaveChangesAsync();
}
```

### 3. **Dependency Injection (DI)**

- **Constructor Injection** - Dependencies injected via constructor
- **Scoped Lifetime** - Repository instances per HTTP request
- **Inversion of Control** - Framework manages object creation

### 4. **DTO Pattern**

- **Records for DTOs** - Immutable data transfer objects using C# records
- **Separation of Concerns** - Never expose domain entities directly
- **Security** - Prevents over-posting attacks and data leakage

### 5. **Test-Driven Development (TDD)**

**Methodology:**

1. ✅ Write failing test first
2. ✅ Implement minimal code to pass
3. ✅ Refactor with confidence

**Benefits:**

- Early bug detection
- Living documentation
- Regression prevention
- Design feedback

## 📁 Project Structure

```
WealthPulse/
├── WealthPulse.API/              # Main API project
│   ├── Controllers/              # HTTP endpoints
│   │   └── AssetsController.cs   # RESTful asset operations
│   ├── Data/                     # Database context
│   │   └── AppDbContext.cs       # EF Core configuration
│   ├── Models/                   # Domain entities & DTOs
│   │   └── Asset.cs              # Core business entity
│   ├── Repositories/             # Data access abstraction
│   │   ├── IAssetRepository.cs   # Contract
│   │   └── AssetRepository.cs    # Implementation
│   ├── Migrations/               # EF Core migrations
│   ├── wwwroot/                  # Backend-served static files
│   ├── Program.cs                # Application entry point
│   └── appsettings.json          # Configuration (excluded from git)
├── WealthPulse.Tests/            # Unit & integration tests
│   └── AssetControllerTests.cs   # Controller unit tests (Moq)
├── index.html                    # Frontend dashboard (root)
├── styles.css                    # Responsive styling
├── app.js                        # TypeScript compiled output
├── app.ts                        # TypeScript source
├── vercel.json                   # Frontend deployment config
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites

```bash
# Required
.NET 8 SDK         # https://dotnet.microsoft.com/download
PostgreSQL 14+     # Or Neon.tech cloud instance
TypeScript         # npm install -g typescript

# Optional
EF Core CLI        # dotnet tool install -g dotnet-ef
```

### Installation & Setup

**1. Clone the repository**

```bash
git clone <your-repo-url>
cd WealthPulse
```

**2. Configure database**

```bash
# Update WealthPulse.API/appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=your-host;Database=wealthpulse;Username=user;Password=pass;SSL Mode=Require"
  }
}
```

**3. Apply migrations**

```bash
cd WealthPulse.API
dotnet ef database update
```

**4. Run the API**

```bash
dotnet watch run
# API: http://localhost:5031
# Swagger: http://localhost:5031/swagger
```

**5. Compile TypeScript (optional)**

```bash
cd wwwroot
npx tsc          # Compiles app.ts to app.js
npx tsc --watch  # Watch mode
```

## 📚 API Documentation

### Endpoints

#### **GET /api/assets**

Retrieve all financial assets from portfolio

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "symbol": "QQQ",
    "name": "Invesco QQQ ETF",
    "quantity": 10,
    "pricePerShare": 450.0,
    "type": "ETF"
  }
]
```

#### **POST /api/assets**

Create a new asset in the portfolio

**Request Body:**

```json
{
  "symbol": "SPY",
  "name": "SPDR S&P 500 ETF",
  "quantity": 5,
  "pricePerShare": 500.0,
  "type": "ETF"
}
```

**Response:** `201 Created`

### Interactive Documentation

- **Swagger UI:** `http://localhost:5031/swagger`
- **OpenAPI Spec:** `http://localhost:5031/swagger/v1/swagger.json`

## 🧪 Testing Strategy

### Unit Tests

**Philosophy:** Test behavior, not implementation

**Coverage:**

- ✅ Controller logic with mocked repositories
- ✅ Repository pattern validation
- ✅ DTO mapping and validation

**Run tests:**

```bash
dotnet test                          # Run all tests
dotnet test --verbosity detailed     # Verbose output
dotnet watch test                    # Watch mode
```

**Example test (TDD approach):**

```csharp
[Fact]
public async Task Get_ShouldReturnOk_WhenAssetsExist()
{
    // Arrange
    var mockRepo = new Mock<IAssetRepository>();
    mockRepo.Setup(repo => repo.GetAllAsync())
        .ReturnsAsync(new List<Asset> { /* test data */ });

    var controller = new AssetsController(mockRepo.Object);

    // Act
    var result = await controller.GetAssets();

    // Assert
    var okResult = Assert.IsType<OkObjectResult>(result.Result);
    Assert.NotNull(okResult.Value);
}
```

**Current Status:** ✅ 1/1 tests passing

## 🚀 Deployment

### Architecture: Separated Frontend/Backend

```
┌─────────────────┐         ┌──────────────────┐
│   Vercel CDN    │ ◄─────► │   Railway.app    │
│   (Frontend)    │  CORS   │   (.NET API)     │
│  Static HTML/   │         │  + PostgreSQL    │
│   CSS/JS/TS     │         │                  │
└─────────────────┘         └──────────────────┘
```

### Backend Deployment (.NET API)

#### **Option 1: Railway (Recommended)**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway login
cd WealthPulse.API
railway init
railway up

# Get your API URL
# Example: https://wealthpulse-api.railway.app
```

#### **Option 2: Azure App Service**

1. Create Azure App Service (B1 or higher)
2. Configure .NET 8 runtime
3. Deploy via Azure CLI or GitHub Actions

```bash
az webapp up --name wealthpulse-api --runtime "DOTNET:8.0"
```

### Frontend Deployment (Vercel)

**Steps:**

1. Push to GitHub
2. Import project in Vercel dashboard
3. **Root Directory:** `/` (project root, not `/WealthPulse.API`)
4. Deploy

**Environment Variables:**

```
# None needed - API URL configured in app.js
```

### Post-Deployment Configuration

**Update API endpoint in `app.js`:**

```javascript
const API_BASE_URL = "https://wealthpulse-api.railway.app";
```

Then redeploy frontend.

## 🔒 Security Considerations

### Implemented

✅ **Error Handling Middleware** - Hides database credentials in exceptions  
✅ **DTO Pattern** - Prevents over-posting attacks  
✅ **Connection String Exclusion** - `appsettings.json` in `.gitignore`  
✅ **CORS Policy** - Configurable origin restrictions  
✅ **HTTPS Redirection** - Enforces encrypted connections  
✅ **Input Validation** - Required fields via DTOs

### Production Recommendations

🔐 **Use Environment Variables**

```bash
export ConnectionStrings__DefaultConnection="..."
```

🔐 **Update CORS Policy**

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("https://your-domain.vercel.app")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

🔐 **Enable Rate Limiting**  
🔐 **Add API Authentication** (JWT/OAuth)  
🔐 **Implement Logging** (Serilog/Application Insights)

## 📊 Performance Considerations

- **Async/Await** - Non-blocking I/O operations throughout
- **Connection Pooling** - PostgreSQL connection reuse
- **Entity Tracking** - Optimized for read-heavy operations
- **Compiled Queries** - EF Core query caching

## 🤝 Contributing

This is a portfolio project, but feedback is welcome!

## 📄 License

MIT License - Feel free to use this as a learning resource.

---

**Built with enterprise patterns in mind** | Showcasing production-ready .NET architecture
