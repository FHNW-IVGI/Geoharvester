#####  
# URLS

# Scraper related URLs:
url_github_repo = "https://github.com/davidoesch/geoservice_harvester_poc/blob/main/data/"
url_github_repo_suffix = "?raw=true"

url_geodata_CH_csv = f"{url_github_repo}geodata_CH.csv{url_github_repo_suffix}"
url_geodata_simple_CH_csv = f"{url_github_repo}geodata_simple_CH.csv{url_github_repo_suffix}"
url_geoservices_CH_csv = f"{url_github_repo}geoservices_CH.csv{url_github_repo_suffix}"
url_geoservices_stats_CH_csv = f"{url_github_repo}geoservices_CH.csv{url_github_repo_suffix}"


#####  
# Variables:

# Used to create a subset of the full csv data:
fields_to_include = ["OWNER","TITLE", "KEYWORDS", "ABSTRACT", "SERVICETYPE", "SERVICELINK", "MAPGEO"]
# fields_to_output = ["OWNER","TITLE", "SERVICETYPE", "SERVICELINK", "MAPGEO"] # Needs to be subset of fields_to_include
fields_to_output = ["TITLE", "KEYWORDS", "OWNER", "SERVICETYPE", "SERVICELINK", "MAPGEO"]