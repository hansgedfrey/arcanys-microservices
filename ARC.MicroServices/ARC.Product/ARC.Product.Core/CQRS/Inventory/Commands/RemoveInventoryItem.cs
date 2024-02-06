using ARC.Extension.ValidationMiddleWare.Exceptions;
using ARC.Product.Core.Models;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ARC.Product.Core.CQRS.Category.Commands.RemoveInventoryItem
{
    public record RemoveInventoryItemCommand : IRequest
    {
        public Guid InventoryItemId { get; init; }
    }

    public class UpsertCategoryCommandValidator : AbstractValidator<RemoveInventoryItemCommand>
    {
        public UpsertCategoryCommandValidator()
        {
            RuleFor(x => x.InventoryItemId).NotEmpty();
        }
    } 

    public class Handler : IRequestHandler<RemoveInventoryItemCommand>
    {
        private readonly Persistence.Entities.ApplicationDbContext _applicationDbContext;
        private readonly CoreHelper _coreHelper;

        public Handler(Persistence.Entities.ApplicationDbContext applicationDbContext, CoreHelper coreHelper)
        {
            _applicationDbContext = applicationDbContext;
            _coreHelper = coreHelper;
        }

        public async Task Handle(RemoveInventoryItemCommand request, CancellationToken cancellationToken)
        {  
            var inventoryItemToDelete = await _applicationDbContext.InventoryItems
                          .Include(i=>i.Events)
                          .Where(p => p.InventoryItemId == request.InventoryItemId)
                          .SingleOrDefaultAsync(cancellationToken) ?? throw new NotFoundException(nameof(Persistence.Entities.InventoryItem));
 
            _applicationDbContext.Remove(inventoryItemToDelete);

            await _applicationDbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false); 
        }
    }
}