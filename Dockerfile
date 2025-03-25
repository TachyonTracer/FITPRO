# Use the .NET SDK to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /app

# Copy solution and projects
COPY EduTrackPro.sln ./
COPY API/API.csproj API/
COPY MVC/MVC.csproj MVC/
COPY Repo/Repo.csproj Repo/
COPY EduTrackPro.csproj ./

# Restore dependencies
RUN dotnet restore

# Copy everything
COPY . .

# Build and publish each project individually
RUN dotnet publish API/API.csproj -c Release -o /app/publish/API
RUN dotnet publish MVC/MVC.csproj -c Release -o /app/publish/MVC

# Use the .NET runtime for the final image
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Copy the wwwroot directory
COPY MVC/wwwroot /app/MVC/wwwroot

# Set environment variable dynamically (API or MVC)
ARG SERVICE
ENV SERVICE=${SERVICE}
WORKDIR /app/$SERVICE

# Run the specified service

ENTRYPOINT ["sh", "-c", "dotnet /app/$SERVICE/$SERVICE.dll"]
