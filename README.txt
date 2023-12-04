# Building Microservices with .NET

An example of how to build microservices in .NET with various forms of communication between services and an api gateway to manage external requests.

## Features

- Demonstrate running microservices deployed in Kubernetes on top of Docker.
- Demonstrate messaging and other communication options between services (Grpc, RabbitMQ, and HTTP).
- Demonstrate API gateway using Ingress.
- API documentation using Swagger. 
- Minimal API implementation.
- Mediatr and FluentValidation for handling API requests.
- Persistence layer using EntityFramework with Automapper.

Project main dependency frameworks installed:

```JSON
  "MediatR": "12.2.0",
  "Microsoft.AspNetCore.OpenApi": "7.0.13",
  "FluentValidation.AspNetCore": "11.3.0",
  "RabbitMQ.Client": "6.7.0",
  "Swashbuckle.AspNetCore": "6.5.0",
  "Grpc": "2.55.0",
  "Microsoft.EntityFrameworkCore": "7.0.13",
  "AutoMapper" : "12.0.1",
```

## Deploying the projects

The demo applications contains API endpoints to demonstrate data handling, validation and persistence. 
It also demonstrates communication between services using RabbitMQ, Grpc and HTTP.

## ARC.Product

1. Navigate to project parent dir
2. Run the following command
```
docker build -t hmaligro/arcproduct:latest -f ARC.MicroServices/ARC.Product/ARC.Product/Dockerfile .
```
