using Grpc.Core;

namespace ARC.UserAuthManagement.Services
{
    public class AuthenticationService : Authentication.AuthenticationBase
    {
        private readonly ILogger<GreeterService> _logger;
        public AuthenticationService(ILogger<GreeterService> logger)
        {
            _logger = logger;
        }

        public override Task<AuthenticationResponse> Authenticate(AuthenticationRequest request, ServerCallContext context)
        {
            return Task.FromResult(new AuthenticationResponse { AccessToken = "12345", ExpiresIn = 3 });
        }
    }
}