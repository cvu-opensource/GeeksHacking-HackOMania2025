import requests
import json
import os
import logging
from dotenv import load_dotenv

from EventsScrapper import extract_eventbrite_event_ids

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

class EventManager:
    BASE_URL = "https://www.eventbriteapi.com/v3"
    
    def __init__(self):
        self.api_key = os.getenv("EVENTBRITE_API_KEY")
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json"
        }

    def _make_request(self, endpoint):
        """Generic method for making API GET requests with error handling."""
        url = f"{self.BASE_URL}/{endpoint}"
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logging.error(f"API request failed: {e}")
            return {}

    def get_event_details(self, event_id):
        event_data = self._make_request(f"events/{event_id}")
        if not event_data:
            return None
        
        venue = self.get_venue_details(event_data.get("venue_id"))
        organizer = self.get_organizer_details(event_data.get("organizer_id"))
        category = self.get_category_name(event_data.get("category_id"))
        
        return {
            "eventid": event_id,
            "name": event_data.get("name", {}).get("text"),
            "description": event_data.get("description", {}).get("text"),
            "url": event_data.get("url"),
            "logo": event_data.get("logo", {}).get("url"),
            "starttime_local": event_data.get("start", {}).get("local"),
            "endtime_local": event_data.get("end", {}).get("local"),
            "is_free": event_data.get("is_free", False),
            "is_online": event_data.get("online_event", False),
            "category": category,
            "venue_address": venue.get("address", {}).get("localized_address_display"),
            "venue_lat": venue.get("latitude"),
            "venue_long": venue.get("longitude"),
            "organizer_name": organizer.get("name"),
            "organizer_website": organizer.get("website")
        }

    def get_venue_details(self, venue_id):
        return self._make_request(f"venues/{venue_id}") if venue_id else {}

    def get_organizer_details(self, organizer_id):
        return self._make_request(f"organizers/{organizer_id}") if organizer_id else {}

    def get_category_name(self, category_id):
        category_data = self._make_request(f"categories/{category_id}")
        return category_data.get("name")

    def get_events(self):
        event_ids = extract_eventbrite_event_ids()
        
        events_data = []
        for event_id in event_ids:
            event_details = self.get_event_details(event_id)
            if event_details:  # Ensure event_details is not None
                events_data.append(event_details)
        return events_data
