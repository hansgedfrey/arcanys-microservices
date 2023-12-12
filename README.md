# Building Microservices with .NET

An example of how to build microservices in .NET with various forms of communication between services and an api gateway to manage external requests.

## Features

- Demonstrate running microservices deployed in Kubernetes on top of Docker.
- Demonstrate messaging and other communication options between services (Grpc, RabbitMQ, and HTTP).
- Demonstrate API gateway with Ingress.
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

Make sure you have the following dependencies installed before running the project:

- Run the command below to add the Github nuget package source

```
dotnet nuget add source --username hansgedfrey --password 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 --store-password-in-clear-text --name HansGithub "https://nuget.pkg.github.com/hansgedfrey/index.json"
```

- Docker Desktop with Kubernetes enabled

![Alt text](Images/Docker_with_Kubernetes.png?raw=true)

## Deploying the projects

The demo applications contains API endpoints to demonstrate data handling, validation and persistence.
It also demonstrates communication between services using RabbitMQ, Grpc and HTTP.

## Apply the required services to run the demo projects.

1. Apply the following yaml files to start the dependencies required to run the demo projects.

```
kubectl apply -f local-pvc.yaml,mssql-plat-depl.yaml,rabbitmq-depl.yaml
```

2. Wait for a few minutes and run the following command to verify that the MSSQL and RabbitMQ services are running.

```
kubectl apply -f local-pvc.yaml,mssql-plat-depl.yaml,rabbitmq-depl.yaml
```

You should see something like the image below:

![Alt text](Images/MSSQL_RABBITMQ_PODS.png?raw=true)

## ARC.Product.Web

1. Navigate to project parent dir
2. Run the following command

```
docker build -t hmaligro/arcproduct:latest -f ARC.MicroServices/ARC.Product/ARC.Product/Dockerfile .
```

3. Verify the image has been created. Go to your Docker Desktop app and navigated Images.

![Alt text](Images/product_image_created.png?raw=true)

4. When you have verified the image has been created, copy the image ID located just below the Image name. (i.e format 779c4d5a58ec) and run the following commands.

```
docker tag 779c4d5a58ec hmaligro/arcproduct:latest
docker push hmaligro/arcproduct:latest
```

5. Applying the yaml files. Navigate to Deployment folder and run the following commands to create our Product app container and service.

```
kubectl apply -f arc-product-deployment.yaml,arc-product-node-port-service.yaml
```

6. To verify our product pod and service are already running, run `kubectl get pods` again

And you should see that it's already up and running.

![Alt text](Images/product_service_running.png?raw=true)

7. To open the API documentation, navigate to http://localhost:31425/swagger/index.html and copy the PORT from the highlighted value in the screenshot above.

Doing that, you should now have access to the API documentation and start testing the endpoints

![Alt text](Images/product_endpoints_running.png?raw=true)

## ARC.UserAuthManagement.Web

1. Navigate to project parent dir
2. Run the following command

```
docker build -t hmaligro/arcuserauthmanagement:latest -f ARC.MicroServices/ARC.UserManagement/ARC.UserAuthManagement.Web/Dockerfile .
```

3. Verify the image has been created. Go to your Docker Desktop app and navigated Images.

![Alt text](Images/user_management_image_created.png?raw=true)

4. When you have verified the image has been created, copy the image ID located just below the Image name. (i.e format 779c4d5a58ec) and run the following commands.

```
docker tag c18e9aac26cd hmaligro/arcuserauthmanagement:latest
docker push hmaligro/arcuserauthmanagement:latest
```

5. Applying the yaml files. Navigate to Deployment folder and run the following commands to create our User management app container and service.

```
kubectl apply -f arc-userauthmanagementweb-deployment.yaml,arc-userauthmanagementweb-node-port-service.yaml
```

6. To verify our user management pod and service are already running, run `kubectl get pods` again

And you should see that it's already up and running.

![Alt text](Images/user_management_service_running.png?raw=true)

7. To open the API documentation, navigate to http://localhost:31425/swagger/index.html and copy the PORT from the highlighted value in the screenshot above.

Doing that, you should now have access to the API documentation and start testing the endpoints

![Alt text](Images/user_management_endpoints_running.png?raw=true)

## Setting up the API Gateway

For the API Gateway, it was originally Ocelot but switched to Ingress for ease of setup that includes load balancing and routing.

1. To test locally, we need to add our own domain name in the host file. If you check the routing file (ingress-srv.yaml) it's defined as `arc-test.com`.

Add the following in your host file.

```
127.0.0.1 arc-test.com
```

2. Run the following command to install the nginx controller. You can find the complete guide here https://kubernetes.github.io/ingress-nginx/deploy/#quick-start.

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
```

The installation may take a few minutes. But you can run the following command (`kubectl get services --namespace=ingress-nginx`)to check if ingress nginx contoller is up and running. You should get the below result

![Alt text](Images/ingress_ngix_cluster_load_balancer.png?raw=true)

3. Finally, we can now apply our routing file.

```
kubectl apply -f ingress-srv.yaml
```

4. To verify that the gateway is working properly, navigate to one of the endpoints.

![Alt text](Images/api-gateway.png?raw=true)
