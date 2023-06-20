from datetime import datetime

import requests

if __name__ == "__main__":
    url = "https://raw.githubusercontent.com/FHNW-IVGI/Geoharvester/main/scraper/data/"
    file_name = "geoservices_CH.csv"

    r = requests.get("{}{}".format(url, file_name), allow_redirects=True)
    open('/cronjob/svc.csv', 'wb').write(r.content)

    print(f"New csv file written at {datetime.now()}")