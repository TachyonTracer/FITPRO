# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /app

# Copy solution and projects
COPY FitPro.sln ./
COPY API/API.csproj API/
COPY MVC/MVC.csproj MVC/
COPY Repo/Repo.csproj Repo/

# Restore dependencies
RUN dotnet restore

# Copy everything
COPY . .

# Build and publish each project individually
RUN dotnet publish API/API.csproj -c Release -o /app/publish/API
RUN dotnet publish MVC/MVC.csproj -c Release -o /app/publish/MVC

# Runtime stage with Python and .NET
FROM python:3.11-slim AS runtime

# Install .NET Runtime
RUN apt-get update && apt-get install -y wget && \
    wget https://packages.microsoft.com/config/debian/11/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && \
    dpkg -i packages-microsoft-prod.deb && \
    apt-get update && \
    apt-get install -y aspnetcore-runtime-8.0

WORKDIR /app
COPY --from=build /app/publish .

# Copy the wwwroot directory and AI project
COPY MVC/wwwroot /app/MVC/wwwroot
COPY AI/Source /app/AI/Source
COPY AI/Models /app/AI/Models
COPY AI/main.py /app/AI/
COPY AI/requirements.txt /app/AI/

# Install Python dependencies
RUN pip install -r /app/AI/requirements.txt

# Set environment variable dynamically
ARG SERVICE
ENV SERVICE=${SERVICE}
WORKDIR /app/$SERVICE

# Create directory for DataProtection keys
RUN mkdir -p /root/.aspnet/DataProtection-Keys && \
    chmod 777 /root/.aspnet/DataProtection-Keys

# Entrypoint script to handle both Python and .NET services
ENTRYPOINT ["/bin/bash", "-c", "\
    if [ \"$SERVICE\" = \"AI\" ]; then \
        cd /app/AI && python main.py; \
    else \
        dotnet /app/$SERVICE/$SERVICE.dll; \
    fi"]
