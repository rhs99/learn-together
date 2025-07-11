# Learn Together

## Overview

Learn Together is a collaborative knowledge-sharing platform where users can ask questions and provide answers on various topics. The platform supports rich content including images and mathematical expressions, making it suitable for educational purposes.

## Technology Stack

### Frontend
- **Framework:** React.js 
- **Language:** TypeScript
- **State Management:** React Context API
- **UI Components:** Custom design library, optiaxiom, react-icons
- **Styling:** SCSS
- **Build Tool:** Vite

### Backend
- **Runtime:** Node.js
- **API Framework:** Express.js
- **Authentication:** JWT (JSON Web Tokens)
- **Real-time Communication:** WebSockets
- **Validation:** Zod

### Database
- **Primary Database:** MongoDB
- **Object Modeling:** Mongoose
- **Caching:** In-memory cache service (Redis)

### DevOps & Infrastructure
- **Containerization:** Docker
- **Container Orchestration:** Docker Compose
- **File Storage:** Minio

## Features

- **Q&A Functionality**
  - Users can ask questions and provide answers
  - Support for rich content including images and complex mathematical equations/expressions
  - Upvoting and downvoting capabilities for questions and answers

- **User Experience**
  - Favorite questions for later reference
  - Real-time notifications when questions receive answers
  - Advanced filtering options (by tags, favorites, authorship)
  - Multiple sorting methods (time, vote count, net votes)

## Project Structure

- `lt-client/`: Frontend React application
- `lt-server/`: Backend Node.js application

## Database Schema

<p align="center">
  <img src="./db-schema.png" alt="Database Schema" width="800">
</p>

The image above represents the database schema showing the relationships between different collections in our MongoDB database.

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/rhs99/learn-together.git
   cd learn-together
   ```

2. Start the application using Docker Compose:
   ```
   docker-compose up
   ```
3. Access the application:
    ```
    The application will be available at http://localhost:3000
    ```

## Roadmap

- [ ] Improve error handling
- [ ] Optimize database queries
- [ ] Implement comprehensive logging system
- [ ] Migrate from Minio to AWS S3 for file storage
- [ ] Configure Nginx/Apache as reverse proxy
- [ ] Deploy to production
- [ ] Establish CI/CD pipeline

