using Grpc.Core;
using MediatR;

namespace ARC.UserAuthManagement.Services
{
    public class AuthenticationService : Authentication.AuthenticationBase
    {
        private readonly ILogger<AuthenticationService> _logger;
        private readonly ISender _sender;

        public AuthenticationService(ILogger<AuthenticationService> logger, ISender sender)
        {
            _logger = logger;
            _sender = sender;
        }

        /// <summary>
        /// Still a work in progress. Calls the login command to demonstrate.
        /// </summary>
        public override async Task<AuthenticationResponse> Authenticate(AuthenticationRequest request, ServerCallContext context)
        {
            var result = await _sender.Send(new UserManagement.Core.CQRS.User.Commands.Login.LoginCommand { UserName = request.UserName, Password = request.Password });

            //Test response
            return new AuthenticationResponse { AccessToken = "12345", ExpiresIn = 3 };
        }
    }
}