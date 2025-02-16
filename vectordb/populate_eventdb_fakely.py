import json
import numpy as np
import random
import requests
import pydantic
from pydantic import BaseModel
from typing import List, Optional

# Open and read the JSON file
with open('event_details.json', 'r') as file:
    events = json.load(file)


response = requests.post(
    url='http://localhost:8001/store_events',
    json={
        'contents': events,
        'ids':[str(random.getrandbits(16)) for i in range(len(events))],
    }
)
print(response.content)