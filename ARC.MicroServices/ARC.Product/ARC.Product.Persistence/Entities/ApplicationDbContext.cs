using ARC.Product.Persistence.Events.Cart;
using Microsoft.EntityFrameworkCore;

namespace ARC.Product.Persistence.Entities
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext()
        {
                
        }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Product> Products => Set<Product>();
        public virtual DbSet<Cart> Carts => Set<Cart>();
        public virtual DbSet<CartItem> CartItems => Set<CartItem>();
        public virtual DbSet<User> Users => Set<User>();
        public virtual DbSet<Category> Categories => Set<Category>();
        public virtual DbSet<InventoryItem> InventoryItems => Set<InventoryItem>();

        #region Cart Events
        public virtual DbSet<Events.Cart.CreateCartEvent> CreateCartEvents => Set<Events.Cart.CreateCartEvent>();
        public virtual DbSet<Events.Cart.AddItemToCartEvent> AddItemToCartEvents => Set<Events.Cart.AddItemToCartEvent>();
        public virtual DbSet<Events.Cart.RemoveItemFromCartEvent> RemoveItemFromCartEvents => Set<Events.Cart.RemoveItemFromCartEvent>();
        public virtual DbSet<Events.Cart.CheckoutCartEvent> CheckoutCartEvents => Set<Events.Cart.CheckoutCartEvent>(); 
        public virtual DbSet<Events.Cart.AbstractCartEvent> CartEvents => Set<Events.Cart.AbstractCartEvent>();
        public virtual DbSet<UpdateCartItemQuantityEvent> UpdateCartItemQuantityEvents => Set<UpdateCartItemQuantityEvent>();
        #endregion

        #region Cart Item Events
        public virtual DbSet<Events.CartItem.AbstractCartItemEvent> CartItemEvents => Set<Events.CartItem.AbstractCartItemEvent>();
        public virtual DbSet<Events.CartItem.AddedToCartEvent> AddedToCartEvents => Set<Events.CartItem.AddedToCartEvent>();
        #endregion

        #region Product Events
        public virtual DbSet<Events.Product.AddProductEvent> AddProductEvents => Set<Events.Product.AddProductEvent>();
        public virtual DbSet<Events.Product.UpdateProductEvent> UpdateProductEvents => Set<Events.Product.UpdateProductEvent>();
        public virtual DbSet<Events.Product.UpdateProductPriceEvent> UpdateProductPriceEvents => Set<Events.Product.UpdateProductPriceEvent>();
        public virtual DbSet<Events.Product.AbstractProductEvent> ProductEvents => Set<Events.Product.AbstractProductEvent>();
        #endregion

        #region Inventory Item Events
        public virtual DbSet<Events.InventoryItem.UpdateInventoryItemEvent> UpdateInventoryItemEvent => Set<Events.InventoryItem.UpdateInventoryItemEvent>();
        public virtual DbSet<Events.InventoryItem.AddInventoryItemEvent> AddInventoryItemEvent => Set<Events.InventoryItem.AddInventoryItemEvent>();
        public virtual DbSet<Events.InventoryItem.AbstractInventoryItemEvent> InventoryItemEvents => Set<Events.InventoryItem.AbstractInventoryItemEvent>();
        #endregion
        public virtual DbSet<Events.AbstractEvent> Events => Set<Events.AbstractEvent>();
    }
}