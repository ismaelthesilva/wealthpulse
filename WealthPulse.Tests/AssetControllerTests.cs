using Moq; // Biblioteca de Mocking
using Microsoft.AspNetCore.Mvc;
using WealthPulse.API.Controllers;
using WealthPulse.API.Models;
using WealthPulse.API.Repositories;

namespace WealthPulse.Tests;

public class AssetControllerTests
{
    // O TDD diz: Teste o comportamento, não o banco de dados.
    [Fact]
    public async Task Get_ShouldReturnOk_WhenAssetsExist()
    {
        // Arrange (Preparar o cenário falso)
        var mockRepo = new Mock<IAssetRepository>();
        mockRepo.Setup(repo => repo.GetAllAsync())
            .ReturnsAsync(new List<Asset> 
            { 
                new Asset { Symbol = "QQQ", Name = "Invesco QQQ", Quantity = 10, PricePerShare = 400 } 
            });

        var controller = new AssetsController(mockRepo.Object);

        // Act (Executar a ação)
        var result = await controller.GetAssets();

        // Assert (Validar o resultado)
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedAssets = Assert.IsAssignableFrom<IEnumerable<Asset>>(okResult.Value);
        Assert.Single(returnedAssets); // Deve retornar 1 item
    }
}