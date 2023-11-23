using Destructurama.Attributed;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ARC.UserManagement.Core.CQRS.User.Commands.Login
{
    public record LoginCommand : IRequest<Guid>
    {
        [LogMasked(ShowFirst = 3)]
        public required string UserName { get; init; } 
        [LogMasked(Text = "***REDACTED***")]
        public required string Password { get; init; } 
    }

    public class RegisterCommandValidator : AbstractValidator<LoginCommand>
    {
        public RegisterCommandValidator()
        {
            RuleFor(x => x.UserName).NotEmpty().EmailAddress();
            RuleFor(x => x.Password).NotEmpty().WithMessage("Password is required"); 
        }
    }

    public class Handler : IRequestHandler<LoginCommand, Guid>
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

        public async Task<Guid> Handle(LoginCommand request, CancellationToken cancellationToken)
        {  
            var existingUser = await _applicationDbContext.Users
                          .Where(p => p.Username.ToLower() == request.UserName.ToLower())
                          .AsNoTracking()
                          .SingleOrDefaultAsync(cancellationToken);
            
            if(existingUser == null) throw new Infrastructure.Exceptions.NotFoundException(nameof(Persistence.Entities.User));

            var password = _dataProtector.Unprotect(existingUser.Password);

            if (request.Password != password) throw new InvalidOperationException("Password mismatch");

            return existingUser.UserId;
        }
    }
}