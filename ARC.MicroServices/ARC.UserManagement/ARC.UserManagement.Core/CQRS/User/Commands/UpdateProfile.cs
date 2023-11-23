using Destructurama.Attributed;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ARC.UserManagement.Core.CQRS.User.Commands.UpdateProfile
{
    public record UpdateProfileCommand : IRequest<Guid>
    {
        public required Guid UserId { get; init; }
        [LogMasked(ShowFirst = 3)]
        public string? PhoneNumber { get; init; }
        public required string FirstName { get; init; }
        public required string LastName { get; init; }
    }

    public class RegisterCommandValidator : AbstractValidator<UpdateProfileCommand>
    {
        public RegisterCommandValidator()
        {
            RuleFor(x => x.UserId).NotEmpty();
            RuleFor(x => x.FirstName).NotEmpty();
            RuleFor(x => x.LastName).NotEmpty();
        }
    }

    public class Handler : IRequestHandler<UpdateProfileCommand, Guid>
    {
        private readonly Persistence.Entities.ApplicationDbContext _applicationDbContext;
    
        public Handler(Persistence.Entities.ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }

        public async Task<Guid> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
        { 
            var existingUser = await _applicationDbContext.Users
                          .Where(p => p.UserId == request.UserId)
                          .SingleOrDefaultAsync(cancellationToken);
            
            if(existingUser == null) throw new Infrastructure.Exceptions.NotFoundException(nameof(Persistence.Entities.User));

            existingUser.PhoneNumber = request.PhoneNumber;
            existingUser.LastName = request.LastName;
            existingUser.FirstName = request.FirstName;
            existingUser.AppendEvent(new Persistence.Events.UpdateProfileEvent { Occurred = DateTime.Now });

            await _applicationDbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

            return existingUser.UserId;
        }
    }
}