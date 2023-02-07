# Geoharvester

NDGI Project Geoharvester

## Deployment

### A. Localhost deployment:

#### Frontend:

###### Requirements:

- Your favorite terminal
- Have node and npm installed (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

###### Run:

1. cd into frontend folder ("geoharvester_client")
2. run `npm i` to install dependencies (from package.json)
3. run `npm start` to start the fronted on localhost (`npm start` is defined in package.json)

#### Backend / Database:

###### Requirements:

- Your favorite terminal
- Have docker and docker compose installed (https://docs.docker.com/compose/install/). Windows users need to install Docker Desktop (https://docs.docker.com/desktop/install/windows-install/)

###### Run:

1. cd into server folder
2. Run `docker compose up --build` (this takes a while for the first build). Make sure to use `docker compose` not the (soon to be) depricated `docker-compose`
3. Check `localhost:8000`in your browser to verify that backend is running

#### Troubleshooting:

##### Cannot start application

- Check that you are starting the backend from the `server` folder (not server/apps). Is Docker running? You might need to start the daemon (Ubuntu: `sudo service docker start`) or Docker Desktop (Windows)

## API Documentation

### SwaggerUI

Fast API comes with Swagger UI preinstalled. If you have the backend running (see steps above), Swagger UI is available on http://localhost:8000/docs. See the wiki pages of this repo for the documentation of this project.
