import requests
import json
import os
from dotenv import load_dotenv

from EventsScrapper import extract_eventbrite_event_ids

# Load environment variables
load_dotenv()

EVENTBRITE_API_KEY = os.getenv("EVENTBRITE_API_KEY")
EVENTBRITE_API_URL = "https://www.eventbriteapi.com/v3/events/"
VENUE_API_URL = "https://www.eventbriteapi.com/v3/venues/"
ORGANIZER_API_URL = "https://www.eventbriteapi.com/v3/organizers/"
CATEGORY_API_URL = "https://www.eventbriteapi.com/v3/categories/"

REGION_LOCATIONS = {
    "North": [(1.4375, 103.785), (1.45, 103.825), (1.41, 103.82), (1.42, 103.835)], 
    "South": [(1.2705, 103.817), (1.28, 103.85), (1.265, 103.82), (1.275, 103.83)], 
    "East": [(1.345, 103.933), (1.38, 103.95), (1.36, 103.94), (1.39, 103.98)], 
    "West": [(1.352, 103.695), (1.34, 103.75), (1.32, 103.70), (1.30, 103.68)], 
    "Central": [(1.3521, 103.8198), (1.36, 103.85), (1.34, 103.83), (1.35, 103.80)]  
}

def calculate_distance(lat1, lon1, lat2, lon2):
    return ((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2) ** 0.5

def get_nearest_region(latitude, longitude):
    try:
        latitude, longitude = float(latitude), float(longitude)
        min_distance = float("inf")
        nearest_region = "Unknown"
        
        for region, points in REGION_LOCATIONS.items():
            for lat, lon in points:
                distance = calculate_distance(latitude, longitude, lat, lon)
                if distance < min_distance:
                    min_distance = distance
                    nearest_region = region
        
        return nearest_region
    except (TypeError, ValueError):
        return "Unknown"

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
    category_name = get_category_name(category_id) if category_id else None
    
    venue_lat = venue_details.get("latitude", None) if venue_details else None
    venue_long = venue_details.get("longitude", None) if venue_details else None
    venue_location = get_nearest_region(venue_lat, venue_long)
    
    output = {
        "eventid": event_id,
        "eventname": (event_data.get("name") or {}).get("text", None),
        "eventdescription": (event_data.get("description") or {}).get("text", None),
        "eventurl": event_data.get("url", None),
        "eventlogo": (event_data.get("logo") or {}).get("url", None),
        "starttime_local": (event_data.get("start") or {}).get("local", None),
        "endtime_local": (event_data.get("end") or {}).get("local", None),
        "is_free": event_data.get("is_free", False),
        "is_online": event_data.get("online_event", False),
        "category": category_name if category_name else None,
        
        "venue_address": ((venue_details or {}) and venue_details.get("address", {})).get("localized_address_display", None),
        "venue_lat": venue_details.get("latitude", "N/A"),
        "venue_long": venue_details.get("longitude", "N/A"),
        "venue_location": venue_location,

        "organizer_name": organizer_details.get("name", None) if organizer_details else None,
        "organizer_website": organizer_details.get("website", None) if organizer_details else None,
    }
    
    return output

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
        return None

    if response.status_code != 200:
        print(f"Failed to fetch category details: {response.text}")
        return None

    return response.json().get("name", None)

if __name__ == "__main__":
    event_ids = extract_eventbrite_event_ids()
    
    events_data = []
    for event_id in event_ids:
        event_details = get_event_details(event_id)
        print(event_details)
        if event_details:  # Ensure event_details is not None
            events_data.append(event_details)

    # Save to a JSON file
    output_file = "event_details.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(events_data, f, indent=4, ensure_ascii=False)

    print(f"Event details saved to {output_file}")
