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

1. cd into backend folder ("geoharvester_server")
2. run `conda activate geoharvester` to activate environment (replace "geoharvester" with name of your environment if it differs)
3. run `uvicorn main:app --reload` to start server on localhost
4. Check `localhost:8000`in your browser to verify that backend is running

#### Troubleshooting:

##### Cannot start application

- Check if conda environment is set up and running `conda info --envs` (active environment with asterik \*)

##### Can`t resolve geopanda import

- Is the package installed? (run `conda list` in your activated conda env)
- You might need to switch your Python interpreter in VS Code (bottom right corner, click on it, select anaconda version "geoharvester")
- This might happen because of the old env version still being there, delete env folder as we now use conda instead
