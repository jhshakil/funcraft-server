<div align="center">
  <h1>Project Overview</h1>
</div>

---

# Project Name

FunCraft Server

## Introduction

## Features

- Authentication system
- User management system
- Create and maintain Product
- Subscribe and UnSubscribe
- Implement aamar pay payment service

## Technology Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma
- Typescript.

## Installation Guideline

### Prerequisites

- Need to install Node.js

### Installation Steps

1. yarn
2. yarn prisma migrate dev
3. yarn dev
4. yarn build (for build)

### Configuration

1. Create a `.env` file in the root directory of the project.
2. Add necessary configuration variables in the `.env` file (example in `.env.example` file).
   Example:

   ```bash
   NODE_ENV=
   DATABASE_URL=
   PORT=5000
   JWT_SECRET=
   EXPIRES_IN=
   REFRESH_TOKEN_SECRET=
   REFRESH_TOKEN_EXPIRES_IN=
   RESET_PASS_TOKEN=
   RESET_PASS_TOKEN_EXPIRES_IN=
   RESET_PASS_LINK=
   EMAIL=
   APP_PASS=
   CLOUDINARY_API_SECRET=
   CLOUDINARY_API_KEY=
   CLOUDINARY_CLOUD_NAME=
   STORE_ID=
   SIGNETURE_KEY=
   PAYMENT_URL=
   PAYMENT_VERIFY_URL=
   FRONTEND_URL=
   BACKEND_URL=

   ```
