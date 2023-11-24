using Grpc.Core;
using MediatR;

namespace ARC.UserAuthManagement.Web.Services.gRPC
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
        /// Still a work in progress. Would like to show how JWT authentication would work in this protocol.
        /// </summary>
        public override async Task<AuthenticationResponse> Authenticate(AuthenticationRequest request, ServerCallContext context)
        {
            var result = await _sender.Send(new UserManagement.Core.CQRS.User.Commands.Login.LoginCommand { UserName = request.UserName, Password = request.Password });

            //Test response
            return new AuthenticationResponse { AccessToken = "Some access token", ExpiresIn = 3 };
        }
    }
}