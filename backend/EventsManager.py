import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

EVENTBRITE_API_KEY = os.getenv("EVENTBRITE_API_KEY")
EVENTBRITE_API_URL = "https://www.eventbriteapi.com/v3/events/"
VENUE_API_URL = "https://www.eventbriteapi.com/v3/venues/"
ORGANIZER_API_URL = "https://www.eventbriteapi.com/v3/organizers/"
CATEGORY_API_URL = "https://www.eventbriteapi.com/v3/categories/"

def get_event_details(event_id: str):
    headers = {
        "Authorization": f"Bearer {EVENTBRITE_API_KEY}",
        "Accept": "application/json"
    }
    url = f"{EVENTBRITE_API_URL}{event_id}"

    try:
        response = requests.get(url, headers=headers, timeout=10)
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {str(e)}")
        return None

    if response.status_code != 200:
        print(f"Failed to fetch event details: {response.text}")
        return None

    event_data = response.json()
    venue_id = event_data.get("venue_id")
    organizer_id = event_data.get("organizer_id")
    category_id = event_data.get("category_id")
    
    venue_details = get_venue_details(venue_id) if venue_id else {}
    organizer_details = get_organizer_details(organizer_id) if organizer_id else {}
    category_name = get_category_name(category_id) if category_id else "N/A"
    
    output = {
        "eventname": event_data.get("name", {}).get("text", "N/A"),
        "eventdescription": event_data.get("description", {}).get("text", "N/A"),
        "eventurl": event_data.get("url", "N/A"),
        "eventlogo": event_data.get("logo", {}).get("url", "N/A"),
        "starttime_local": event_data.get("start", {}).get("local", "N/A"),
        "endtime_local": event_data.get("end", {}).get("local", "N/A"),
        "is_free": event_data.get("is_free", False),
        "is_online": event_data.get("online_event", False),
        "category": category_name,
        "venue_address": venue_details.get("address", {}).get("localized_address_display", "N/A"),
        "venue_lat": venue_details.get("latitude", "N/A"),
        "venue_long": venue_details.get("longitude", "N/A"),
        "organizer_name": organizer_details.get("name", "N/A"),
        "organizer_website": organizer_details.get("website", "N/A"),
        "organizer_logo": organizer_details.get("logo", {}).get("url", "N/A")
    }
    
    return json.dumps(output, indent=4)

def get_venue_details(venue_id: str):
    headers = {
        "Authorization": f"Bearer {EVENTBRITE_API_KEY}",
        "Accept": "application/json"
    }
    url = f"{VENUE_API_URL}{venue_id}"

    try:
        response = requests.get(url, headers=headers, timeout=10)
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {str(e)}")
        return {}

    if response.status_code != 200:
        print(f"Failed to fetch venue details: {response.text}")
        return {}

    return response.json()

def get_organizer_details(organizer_id: str):
    headers = {
        "Authorization": f"Bearer {EVENTBRITE_API_KEY}",
        "Accept": "application/json"
    }
    url = f"{ORGANIZER_API_URL}{organizer_id}"

    try:
        response = requests.get(url, headers=headers, timeout=10)
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {str(e)}")
        return {}

    if response.status_code != 200:
        print(f"Failed to fetch organizer details: {response.text}")
        return {}

    return response.json()

def get_category_name(category_id: str):
    headers = {
        "Authorization": f"Bearer {EVENTBRITE_API_KEY}",
        "Accept": "application/json"
    }
    url = f"{CATEGORY_API_URL}{category_id}"

    try:
        response = requests.get(url, headers=headers, timeout=10)
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {str(e)}")
        return "N/A"

    if response.status_code != 200:
        print(f"Failed to fetch category details: {response.text}")
        return "N/A"

    return response.json().get("name", "N/A")

if __name__ == "__main__":
    event_id = "1147838859929"  # Example event ID
    event_details = get_event_details(event_id)
    if event_details:
        print(event_details)
