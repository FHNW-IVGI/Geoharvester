# NDGI Project Geoharvester

![Stack Diagram](https://user-images.githubusercontent.com/36440175/220350037-c8300e83-8d18-4962-b99a-54b75f5c886a.PNG)

The Geohack version of Geoharvester differs from this diagram:

- The backend is not containerized, Docker is not needed.
- Pandas dataframe instead of Redis database.

To compensate for the lower performance of pandas compared to reddit, a row limit (see main.py) is set.

## Deployment

### Frontend:

###### Requirements:

- Your favorite terminal (Recommendation for Windows: https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701?hl=de-ch&gl=ch&rtc=1)
- Have node and npm installed (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

###### Run:

1. cd into frontend folder ("geoharvester_client")
2. run `npm i` to install dependencies (from package.json)
3. run `npm start` to start the fronted on localhost (`npm start` is defined in package.json)

---

### Backend:

###### Requirements:

- Your favorite terminal (Recommendation for Windows: https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701?hl=de-ch&gl=ch&rtc=1)
- Have a venv running and dependencies installed. Cd into server/app then run `python -m venv env &&  source ./env/bin/activate && pip install -r requirements.txt`

###### Run:

1. In terminal cd into the server folder
2. Run `uvicorn app.main:app --reload` to start the API
3. Check `localhost:8000/docs`in your browser to verify that backend is running

#### Troubleshooting:

##### Cannot start the application

- Check that you are starting the backend from the `server` folder (not server/apps).
- Is the virtual environment up and running?

##### VSCode complains about missing imports

- Point the VSCode python compiler to your venv, so that it can pick up the dependencies from the virtual environment. (See/Click bottom right corner in VSCode )

## API Documentation

#### SwaggerUI

Fast API comes with Swagger UI preinstalled. If you have the backend running (see steps above), Swagger UI is available on http://localhost:8000/docs. See the wiki pages of this repo for the documentation of this project.
