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
- Have pip installed
- Have virtual environment in backend folder up and running (`python -m venv env &&  source ./env/bin/activate`)

###### Run:

1. cd into backend folder ("geoharvester_server")
2. run `pip install -r requirements.txt` to install dependencies
3. run `uvicorn main:app --reload` to start server on localhost
4. Check `localhost:8000`in your browser to verify that backend is running

#### Troubleshooting:

##### VSCode does not detect venv / installed libraries

- Run `pip -V` from server directory. It should point to the .env hidden folder ("....Geoharverster/server/env/lib/python3.9/site-packages/pip (python 3.9)"), otherwise activate the environment from your current terminal window (see above)
- In VSCode hit "CTRL + SHIFT + P" and select "Python: Select Interpreter". Select Python from .env folder (by drobdown or by using "find" to navigate to it).
- Also: https://stackoverflow.com/questions/66869413/visual-studio-code-does-not-detect-virtual-environments


## API Documentation
### SwaggerUI
Fast API comes with Swagger UI preinstalled. If you have the backend running (see steps above), Swagger UI is available on http://localhost:8000/docs. See the wiki pages of this repo for the documentation of this project.

