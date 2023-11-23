using Destructurama.Attributed;
using FluentValidation;
using MediatR;

namespace ARC.Product.Web
{
    public record LoginCommand : IRequest<bool>
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

    public class Handler : IRequestHandler<LoginCommand, bool>
    {
        private readonly UserAuthManagement.Authentication.AuthenticationClient _authenticationClient;

        public Handler(UserAuthManagement.Authentication.AuthenticationClient authenticationClient)
        {
            _authenticationClient = authenticationClient;
        }

        public async Task<bool> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var result = await _authenticationClient.AuthenticateAsync(new UserAuthManagement.AuthenticationRequest { UserName = request.UserName, Password = request.Password });

            return result != null;
        }
    }
}