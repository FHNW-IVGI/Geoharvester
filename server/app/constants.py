#####  
# URLS

# Scraper related URLs:
url_github_repo = "https://github.com/davidoesch/geoservice_harvester_poc/blob/main/data/"
url_github_repo_suffix = "?raw=true"

url_geodata_CH_csv = "{}geodata_CH.csv{}".format(url_github_repo, url_github_repo_suffix)
url_geodata_simple_CH_csv = "{}geodata_simple_CH.csv{}".format(url_github_repo,url_github_repo_suffix)
url_geoservices_CH_csv = "{}geoservices_CH.csv{}".format(url_github_repo,url_github_repo_suffix)
url_geoservices_stats_CH_csv = "{}geoservices_CH.csv{}".format(url_github_repo,url_github_repo_suffix)


#####  
# Variables:

# Used to create a subset of the full csv data:
fields_to_include = ["OWNER","TITLE", "ABSTRACT", "SERVICETYPE", "SERVICELINK"]
fields_to_output = ["OWNER","TITLE", "SERVICETYPE", "SERVICELINK"] # Needs to be subset of fields_to_include