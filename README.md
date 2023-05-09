# NDGI Project Geoharvester

![Stack Diagram](https://user-images.githubusercontent.com/36440175/220350037-c8300e83-8d18-4962-b99a-54b75f5c886a.PNG)




## Deployment

### Frontend:

###### Requirements:

- Your favorite terminal
- Have node and npm installed (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

###### Run:

1. cd into frontend folder ("geoharvester_client")
2. run `npm i` to install dependencies (from package.json)
3. run `npm start` to start the fronted on localhost (`npm start` is defined in package.json)
---

### Backend / Database:

###### Requirements:

- Your favorite terminal
- Have docker and docker compose installed (https://docs.docker.com/compose/install/). Windows users need to install Docker Desktop (https://docs.docker.com/desktop/install/windows-install/)

###### Run:

1. cd into server folder
2. Run `docker compose up --build` (this takes a while for the first build). Make sure to use `docker compose` not the (soon to be) depricated `docker-compose`
3. Check `localhost:8000/api`in your browser to verify that backend is running

#### Troubleshooting:

##### Cannot start Docker from terminal

- Error `Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?` Start docker process with `sudo service docker start`

##### Cannot start application

- Check that you are starting the backend from the `server` folder (not server/apps). Is Docker running? You might need to start the daemon (Ubuntu: `sudo service docker start`) or Docker Desktop (Windows)

#### Development / VSCode Support:

Docker is set up to automatically copy code changes into the container. However, when it comes to the Python interpreter and the management of dependencies on your local machine both (Docker and your local environment) are not in sync by default. VSCode might flag missing dependencies on your local environment, depending on which interpreter is selected. There are two approaches to solve this issue for development:

a) You can either set up a venv and install the dependencies from requirements.txt (cd into server/app, then run `python -m venv env &&  source ./env/bin/activate && pip install -r requirements.txt`), then point the Python interpreter of VSCode to it. Make sure to rerun `pip install` if you make changes to the requirements file.

b) For a "single source of truth" approach, install the "dev containers" extension for VSCode (https://code.visualstudio.com/docs/devcontainers/containers), then attach to the container (https://code.visualstudio.com/docs/devcontainers/attach-container). Windows user: This requires Docker Desktop with WSL 2 set up.



---

## API Documentation

#### SwaggerUI

Fast API comes with Swagger UI preinstalled. If you have the backend running (see steps above), Swagger UI is available on http://localhost:8000/api/docs. See the wiki pages of this repo for the documentation of this project.