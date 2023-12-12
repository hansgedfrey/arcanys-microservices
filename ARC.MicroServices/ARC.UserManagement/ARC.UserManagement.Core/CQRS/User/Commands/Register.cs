using ARC.Extension.ValidationMiddleWare.Exceptions;
using Destructurama.Attributed;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ARC.UserManagement.Core.CQRS.User.Commands.Register
{
    public record RegisterCommand : IRequest<Guid>
    {
        [LogMasked(ShowFirst = 3)]
        public required string UserName { get; init; } 
        [LogMasked(Text = "***REDACTED***")]
        public required string Password { get; init; }
        [LogMasked(ShowFirst = 3)]
        public string? PhoneNumber { get; init; }
        public required string FirstName { get; init; }
        public required string LastName { get; init; }
    }

    public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
    {
        public RegisterCommandValidator()
        {
            RuleFor(x => x.UserName).NotEmpty().EmailAddress();
            RuleFor(x => x.Password).NotEmpty().WithMessage("Password is required");
            RuleFor(x => x.FirstName).NotEmpty();
            RuleFor(x => x.LastName).NotEmpty();
        }
    }

    public class Handler : IRequestHandler<RegisterCommand, Guid>
    {
        private readonly Persistence.Entities.ApplicationDbContext _applicationDbContext;
        private readonly IDataProtector _dataProtector;
        private readonly string _dataProtectPurpose;

        public Handler(Persistence.Entities.ApplicationDbContext applicationDbContext, IDataProtectionProvider dataProtectionProvider, IConfiguration configuration)
        {
            _applicationDbContext = applicationDbContext;
            _dataProtectPurpose = configuration["DataProtectionPurposeSetting"] ?? string.Empty;
            _dataProtector = dataProtectionProvider.CreateProtector(_dataProtectPurpose);
        }

        public async Task<Guid> Handle(RegisterCommand request, CancellationToken cancellationToken)
        { 
            var user = new Persistence.Entities.User();
            var existingUser = await _applicationDbContext.Users
                          .Where(p => p.Username.ToLower() == request.UserName.ToLower())
                          .SingleOrDefaultAsync(cancellationToken);
            
            if(existingUser != null) throw new AlreadyExistsException(nameof(Persistence.Entities.User));

            user.Username = request.UserName;
            user.Password = _dataProtector.Protect(request.Password);
            user.PhoneNumber = request.PhoneNumber;
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.AppendEvent(new Persistence.Events.RegisterEvent { Occurred = DateTime.Now });

            _applicationDbContext.Users.Add(user);

            await _applicationDbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

            return user.UserId;
        }
    }
}