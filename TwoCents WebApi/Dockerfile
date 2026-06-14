# =========================
# Build stage
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore first (better caching)
COPY *.csproj ./
RUN dotnet restore

# Copy everything else
COPY . ./

# Publish the app
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false


# =========================
# Runtime stage
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy published output
COPY --from=build /app/publish .

# Render requires binding to 0.0.0.0 and dynamic port
ENV ASPNETCORE_URLS=http://0.0.0.0:10000
EXPOSE 10000

# Start the app
ENTRYPOINT ["dotnet", "TwoCents WebApi.dll"]