import json
import numpy as np
import random
import requests
import pydantic
from pydantic import BaseModel
from typing import List, Optional

# Open and read the JSON file
with open('event_details_test.json', 'r') as file:
    events = json.load(file)


response = requests.post(
    url='http://localhost:8001/store_events',
    json={
        'contents': events,
        'ids':[event['eventid'] for event in events],
    }
)
print(response.content)
user = {
    'age':20,
    'interest': ['hacking', 'problem solving', 'coding', 'logic', 'extrovert', 'gym'],
    'locaation': 'Bishan'
}

response = requests.post(
    url='http://localhost:8001/user_query_event',
    json={
        'contents': [user],
        'ids':['geraldina'],
    }
)
print(response.content)