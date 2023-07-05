# Global Pay Frontend  

## Installation

### Using Local Node

**System Requirement**
- Node: ^18.12.1
- Pnpm: ^7.18.2
*Tips: Use [volta](https://volta.sh/) as node package manager. It will automatically adjust the environment needed* 
  
  **Installation**
  - Copy env variables by `cp .env.example .env`
  - Install dependencies by `pnpm install`
  - Run the app by `pnpm dev`   

### Using Docker

- Copy env file by executing: `cp .env.example .env`
- Start the docker container by running: `docker-composer up -d`
- The default server address is: `http://127.0.0.1:3000`

## API Integration
Currently there are two different approaches that you can use to integrate with the API:

### Use server dev backend
This is using the backend dev that is running in the server.

```
NEXT_PUBLIC_GATEWAY_HOST=https://app-dev-api.ayp-group.com
NEXT_PUBLIC_PEOPLE_API_HOST=https://app-dev-api.ayp-group.com
NEXT_PUBLIC_FINTECH_API_HOST=https://app-dev-api.ayp-group.com
```

### Use backend host locally
Follow this step when you run the backend locally.
Please clone the `global-pay-backend` and follow the instructions to start the server.
Once the backend server has been set up, please use these following environments:

```
NEXT_PUBLIC_GATEWAY_HOST=https://app-dev-api.ayp-group.com
NEXT_PUBLIC_PEOPLE_API_HOST=http://127.0.0.1:8081 (adjust the port number to your backend)
NEXT_PUBLIC_FINTECH_API_HOST=http://127.0.0.1:8082 (adjust the port number to your backend)
```


## Development Guidelines

### Folder Structure
```
/public                 -> Public assets, including locales
/src                    
  /assets               -> Mapping between /public folders 
  /components         
    /commons            -> Common/shared components
    /pages              -> Partial component to create pages
    /ui                 -> Reusable UI component that can be standalone
  /configs              -> Any configuration variables
  /pages                -> Pages to render
  /services       
    /apis               -> Api services
  /themes               -> Theme resources
  /typings              -> Custom typings
  /utils                -> Utility functions
```

### Conventions
Our rule of thumbs for this project are:

- Use all lowercase for file names.
- Parent folders will have plural names, if possible, for example: assets instead of asset.
- As we are using React 17, we do not need to write import React from ‘react’ for all TSX files.
- Use absolute paths like @assets, @configs, @utils, instead of relative paths.
