#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["ARC.MicroServices/ARC.Product/ARC.Product/ARC.Product.Web.csproj", "ARC.MicroServices/ARC.Product/ARC.Product/"]
COPY ["ARC.MicroServices/ARC.Product/ARC.Product.Core/ARC.Product.Core.csproj", "ARC.MicroServices/ARC.Product/ARC.Product.Core/"]
COPY ["Infrastructure/ARC.Infrastructure/ARC.Infrastructure.csproj", "Infrastructure/ARC.Infrastructure/"]
COPY ["ARC.MicroServices/ARC.Product/ARC.Product.Persistence/ARC.Product.Persistence.csproj", "ARC.MicroServices/ARC.Product/ARC.Product.Persistence/"]
RUN dotnet restore "ARC.MicroServices/ARC.Product/ARC.Product/ARC.Product.Web.csproj"
COPY ./ ./
WORKDIR "/src/ARC.MicroServices/ARC.Product/ARC.Product"
RUN dotnet build "ARC.Product.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ARC.Product.Web.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ARC.Product.Web.dll"]