# Running Tests in Docker

This guide explains how to run tests in the Docker container.

## Prerequisites

- Docker and Docker Compose should be installed on your system
- The learn-together project should be cloned to your local machine

## Running Tests

### Option 1: Using the Script

We've created a convenient script to run tests in Docker:

```bash
# Navigate to the lt-server directory
cd lt-server

# Make the script executable (if not already)
chmod +x run-tests-in-docker.sh

# Run the script
./run-tests-in-docker.sh
```

### Option 2: Manual Steps

If you prefer running tests manually:

1. Start the Docker services:
   ```bash
   docker-compose up -d
   ```

2. Execute tests in the container:
   ```bash
   docker exec -it lt-server npm run test:docker
   ```

## Troubleshooting

If you encounter any issues:

1. Make sure all services are running:
   ```bash
   docker-compose ps
   ```

2. Check if MongoDB is accessible from the lt-server container:
   ```bash
   docker exec -it lt-server sh -c "nc -zv lt-database 27017"
   ```

3. Check logs:
   ```bash
   docker logs lt-server
   docker logs lt-database
   ```

4. If tests are still failing, try rebuilding the containers:
   ```bash
   docker-compose down
   docker-compose build
   docker-compose up -d
   ```

## Additional Notes

- When running in Docker, tests use the actual MongoDB container instead of MongoDB Memory Server
- Redis is mocked for all tests
- Tests in Docker may take longer to run due to containerization overhead
