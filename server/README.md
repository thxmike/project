# File Management API

## Purpose

Provides RESTful API CRUD operations for a file management system.

## Prerequisites

- You are required to install NodeJS version 10 or higher to run this server side component. The following web site to install the latest version for your platform or operating system. [NodeJS](https://nodejs.org/en/download/)
- You are required to install MongoDB version 3 or higher to run this server side component. The following web site will provide details on how to install the latest version for your platform or operating system. [MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)

## Dependencies

Once you have NodeJS installed execute the following command to install all of your dependencies.

```npm install```

## Startup

To start your services execute the following command:

```npm run start```

## Debugging

This project debugging works best when using Visual Studio Code. It has a Launch Configuration already setup. It is required that you open a Visual Studio Code Window exclusively on the server folder. Start under the debugger Launch Program.

## Application Routes

This is an overview of the applications routes available. For more concrete examples, please use the includes POSTMan Collection export file 'Project.postman_collection.json'

### User

- POST /users - Creates a new user
- GET /users/{user_id} - Gets a user
- PATCH /users/{user_id} - Updates a user

### File

Admin only functions

- GET /files/{file_id} - Gets a file
- GET /files - Gets all files
- POST /files - Creates a file
- POST /files/{file_id} - Downloads a file

### UserFile

- POST /users/{user_id}/files - Creates a new file for user {user_id}
- GET /users/{user_id}/files - Gets all file metadata for a user {user_id}
- GET /users/{user_id}/files/{file_id} - Gets a users file metadata
- PATCH /users/{user_id}/files/{file_id} - Updates a users file
- POST /users/{user_id}/files/{file_id} - Downloads a file

### System Related

- GET /list - Provides a list of running routes and supported verbs
- GET /health - Provides a health endpoint providing basic details about the system.

## POSTMAN Testing

This component has an included POSTMAN Collection called "Project.postman_collection.json" for testing. For details on how to use POSTMAN and import this collection see the [POSTMAN](https://www.postman.com/downloads/) web site for details. To download POSTMAN go [here](https://www.postman.com/downloads/). To import a collection go [here](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman)
