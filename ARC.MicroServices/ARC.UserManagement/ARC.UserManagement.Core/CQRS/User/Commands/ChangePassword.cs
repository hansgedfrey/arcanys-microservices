﻿using Destructurama.Attributed;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ARC.UserManagement.Core.CQRS.User.Commands.ChangePassword
{
    public record ChangePasswordCommand : IRequest<Guid>
    {
        [LogMasked(ShowFirst = 3)]
        public required string UserName { get; init; } 
        [LogMasked(Text = "***REDACTED***")]
        public required string Password { get; init; }
        [LogMasked(Text = "***REDACTED***")]
        public required string ConfirmPassword { get; init; }
    }

    public class ChangePasswordCommandValidator : AbstractValidator<ChangePasswordCommand>
    {
        public ChangePasswordCommandValidator()
        {
            RuleFor(x => x.UserName).NotEmpty().EmailAddress();
            RuleFor(x => x.Password).NotEmpty().WithMessage("Password is required");
            RuleFor(x => x.Password).NotEmpty().WithMessage("Please enter a password");
            RuleFor(x => x.Password).Equal(x => x.ConfirmPassword).WithMessage("Password mismatch");
        }
    }

    public class Handler : IRequestHandler<ChangePasswordCommand, Guid>
    {
        private readonly Persistence.Entities.ApplicationDbContext _applicationDbContext;
    
        public Handler(Persistence.Entities.ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }

        public async Task<Guid> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
        { 
            var existingUser = await _applicationDbContext.Users
                          .Where(p => p.Username.ToLower() == request.UserName.ToLower())
                          .SingleOrDefaultAsync(cancellationToken);
            
            if(existingUser == null) throw new Infrastructure.Exceptions.NotFoundException(nameof(Persistence.Entities.User));

            existingUser.Username = request.UserName;
            existingUser.Password = request.Password; //Encrypt 
            existingUser.AppendEvent(new Persistence.Events.ChangePasswordEvent { Occurred = DateTime.Now });
 
            await _applicationDbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

            return existingUser.UserId;
        }
    }
}