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

#### Backend:

###### Requirements:

- Your favorite terminal
- Have anaconda installed (see: [Docs](https://docs.anaconda.com/anaconda/install/index.html) or [WSL specific](https://gist.github.com/kauffmanes/5e74916617f9993bc3479f401dfec7da) )
- Run `conda config --add channels conda-forge` to have conda install packages from conda-forge as default doesn`t have all packages (IMPORTANT!)
- Run `conda create --name geoharvester --file requirements.txt` to install required libraries.

###### Run:

0. Start redis first (see below)
1. cd into backend folder ("server")
2. run `conda activate geoharvester` to activate environment (replace "geoharvester" with name of your environment if it differs)
3. run `uvicorn app.main:app --reload` to start server on localhost (from `server` folder)
4. Check `localhost:8000`in your browser to verify that backend is running

#### Database:

###### Requirements:

- Install redis for your plattform (https://redis.io/docs/getting-started/installation/)
- Follow the getting-started-guide (https://redis.io/docs/getting-started/). Make sure that redis can be pinged. You might need to start the redis server first (Ubuntu: `redis-server` from your favorite terminal)
- Modify the redis config file to secure redis (Ubuntu: `sudo vi /etc/redis/redis.conf` - replace vi with nano or your cmd line editor.) Check if `bind 127.0.0.1` is set (Ubuntu: seems to be default) otherwise add it to that file to only allow connections from localhost.

###### Run:

- Ubuntu: run `redis-server` to spin up the database

#### Troubleshooting:

##### Cannot start application

- Check if conda environment is set up and running by typing `conda info --envs` (active environment with asterik \*)
- Check that you are starting the backend from the `server` folder (not server/apps) and use `uvicorn app.main:...` (NOT `uvicorn main:...`) - this is required for relative imports (see: https://fastapi.tiangolo.com/tutorial/bigger-applications/)

##### Can`t resolve dependencies

- Is the package installed? (run `conda list` in your activated conda env)
- Close and reopen VSCode, sometimes it gets stuck on changes in the terminal
- You might need to switch your Python interpreter in VS Code (bottom right corner, click on it, select anaconda version "geoharvester")
- This might happen because of the old env version still being there, delete env folder as we now rely on conda instead

## API Documentation

### SwaggerUI

Fast API comes with Swagger UI preinstalled. If you have the backend running (see steps above), Swagger UI is available on http://localhost:8000/docs. See the wiki pages of this repo for the documentation of this project.
