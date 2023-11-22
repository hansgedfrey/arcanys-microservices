using Microsoft.EntityFrameworkCore;

namespace ARC.Product.Core
{
    public class CoreHelper
    {
        private readonly Persistence.Entities.ApplicationDbContext _applicationDbContext;
        public CoreHelper(Persistence.Entities.ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }

        public async Task<bool> ProductExistsAsync(Guid productId, CancellationToken cancellationToken) 
        {
            var product = await _applicationDbContext.Products
             .Where(p => p.ProductId == productId)
             .SingleOrDefaultAsync(cancellationToken);

            return product != null ? true : false;
        }

        public async Task<bool> ProductExistsAsync(string sku, CancellationToken cancellationToken) 
        {
            var productWithSKU = await _applicationDbContext.Products
            .Where(p => p.SKU == sku)
            .SingleOrDefaultAsync(cancellationToken);

            return productWithSKU != null ? true : false;
        }

        public async Task<bool> CategoryExistsAsync(Guid id, CancellationToken cancellationToken)
        {
            var category = await _applicationDbContext.Categories
            .Where(p => p.CategoryId == id)
            .SingleOrDefaultAsync(cancellationToken);

            return category != null ? true : false;
        }

        public async Task<bool> ProductIsInStockAsync(Guid productId, CancellationToken cancellationToken)
        {
            var inventoryItem = await _applicationDbContext.InventoryItems
                        .Include(p=>p.Events)
                        .Where(p => p.ProductId == productId)
                        .SingleOrDefaultAsync(cancellationToken);

            if (inventoryItem == null) throw new Exceptions.NotFoundException(nameof(inventoryItem), productId);
             
            return  inventoryItem.Quantity > 0;
        }
    }
}
