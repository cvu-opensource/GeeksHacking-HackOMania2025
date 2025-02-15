import requests
import re
from bs4 import BeautifulSoup

def extract_eventbrite_event_ids():
    base_url = "https://www.eventbrite.com/d/singapore--singapore/events/"
    headers = {"User-Agent": "Mozilla/5.0"}
    
    try:
        response = requests.get(base_url, headers=headers, timeout=10)
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {str(e)}")
        return []
    
    if response.status_code != 200:
        print(f"Failed to fetch events page: {response.status_code}")
        return []
    
    # Extract event IDs using regex from window.__SERVER_DATA__
    event_ids = re.findall(r'"eventbrite_event_id":"(\d+)"', response.text)
    
    return event_ids
