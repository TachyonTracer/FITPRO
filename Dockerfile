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

# Next.js build stage
FROM node:18-alpine AS next-build
WORKDIR /app/marketplace
COPY marketplace/package*.json ./
RUN npm install --legacy-peer-deps
COPY marketplace/ .
RUN npm run build

# Sanity build stage
FROM node:18-alpine AS sanity-build
WORKDIR /app/sanity
COPY ./marketplace/Backend/package*.json ./
RUN npm install --legacy-peer-deps
COPY ./marketplace/Backend/ .
# Add the build step for Sanity
RUN npm run build

# Runtime stage
FROM python:3.11-slim AS runtime

# Install .NET Runtime
RUN apt-get update && apt-get install -y wget && \
    wget https://packages.microsoft.com/config/debian/11/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && \
    dpkg -i packages-microsoft-prod.deb && \
    apt-get update && \
    apt-get install -y aspnetcore-runtime-8.0

# Install Node.js
RUN apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

WORKDIR /app
COPY --from=build /app/publish .
COPY --from=next-build /app/marketplace /app/marketplace
COPY --from=sanity-build /app/sanity /app/sanity

# Copy the wwwroot directory and AI project
COPY MVC/wwwroot /app/MVC/wwwroot
COPY AI/Source /app/AI/Source
COPY AI/Models /app/AI/Models
COPY AI/main.py /app/AI/
COPY AI/requirements.txt /app/AI/
COPY API/Templates /app/API/Templates

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
    elif [ \"$SERVICE\" = \"marketplace\" ]; then \
        cd /app/marketplace && npm start; \
    elif [ \"$SERVICE\" = \"sanity\" ]; then \
        cd /app/sanity && npm run start; \
    else \
        dotnet /app/$SERVICE/$SERVICE.dll; \
    fi"]
