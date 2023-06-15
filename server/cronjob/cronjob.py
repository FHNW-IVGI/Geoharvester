from datetime import datetime

import requests

if __name__ == "__main__":
    

    url = "https://raw.githubusercontent.com/FHNW-IVGI/Geoharvester/main/scraper/data/"
    file_name = "geoservices_CH.csv"

    r = requests.get("{}{}".format(url, file_name), allow_redirects=True)
    open('/cronjob/svc.csv', 'wb').write(r.content)

    print(f"Running script at {datetime.now()}")
    print("This message is sent every 1 minutes", "<h1>Hello World from a Docker container</h1>")