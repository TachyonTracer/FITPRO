# .NET build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /src
COPY FitPro.sln ./
COPY API/API.csproj API/
COPY MVC/MVC.csproj MVC/
COPY Repo/Repo.csproj Repo/
RUN dotnet restore

COPY . .
RUN dotnet publish API/API.csproj -c Release -o /app/API
RUN dotnet publish MVC/MVC.csproj -c Release -o /app/MVC

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
RUN npm run build

# Runtime image
FROM python:3.11-slim AS runtime

# Install .NET & Node.js in one RUN
RUN apt-get update && \
    apt-get install -y wget curl gnupg && \
    # Install Microsoft packages
    wget https://packages.microsoft.com/config/debian/11/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && \
    dpkg -i packages-microsoft-prod.deb && \
    apt-get update && \
    apt-get install -y aspnetcore-runtime-8.0 && \
    # Install Node.js and npm using NodeSource
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=build /app/API /app/API
COPY --from=build /app/MVC /app/MVC
COPY --from=next-build /app/marketplace /app/marketplace
COPY --from=sanity-build /app/sanity /app/sanity
COPY MVC/wwwroot /app/MVC/wwwroot
COPY AI/Source /app/AI/Source
COPY AI/Models /app/AI/Models
COPY AI/main.py /app/AI/
COPY AI/requirements.txt /app/AI/
COPY API/Templates /app/API/Templates

RUN pip install --no-cache-dir -r /app/AI/requirements.txt

ARG SERVICE
ENV SERVICE=${SERVICE}
ENV AI_SERVICE_URL="http://ai:5000"
WORKDIR /app/$SERVICE

RUN mkdir -p /root/.aspnet/DataProtection-Keys && chmod 777 /root/.aspnet/DataProtection-Keys

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
