# File Management API

## Purpose

Provides RESTful API CRUD operations for a file management system,

## Prerequisites

- You are required to install NodeJS version 10 or higher to run this server side component. The following web site to install the latest version for your platform or operating system. [NodeJS](https://nodejs.org/en/download/)
- You are required to install MongoDB version 3 or higher to run this server side component. The following web site will provide details on how to install the latest version for your platform or operating system. [MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)

## RESTful API Setup

Once you have NodeJS installed execute the following command to install all of your dependencies.

```npm install```

## Startup

To start your services execute the following command:

```npm run start```

## Application Routes

### User

- POST /users - Creates a new user
- GET /users/{user_id} - Gets a user
- PATCH /users/{user_id} - Updates a user

### File

- GET /files/{file_id} - Gets a file
- GET /files - Gets all files

### UserFile

- POST /users/{user_id}/files - Creates a new file for user {user_id}
- GET /users/{user_id}/files - Gets all file metadata for a user {user_id}
- GET /users/{user_id}/files/{file_id} - Gets a users file metadata
- POST /users/{user_id}/files/{file_id} - Gets a users file

### List

- GET /list - Provides a list of running routes and supported verbs
- GET /health - Provides a health endpoint providing basic details about the system.

## POSTMAN Testing

This component has an included POSTMAN Collection for testing. For details on how to use POSTMAN and import this collection see the [POSTMAN](https://www.postman.com/downloads/) web site for details. To download POSTMAN go [here](https://www.postman.com/downloads/). To import a collection go [here](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman)
