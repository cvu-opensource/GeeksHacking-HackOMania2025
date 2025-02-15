import numpy as np
import random
import requests
import pydantic
from pydantic import BaseModel
from typing import List, Optional

def sample_strings_from_dict(dictionary, n):
    # Get all keys from the dictionary
    keys = list(dictionary.keys())
    sampled_strings = []
    take_from_tech = int(n * 2/3)
    remaining = n - take_from_tech
    tech_list = dictionary['Technology & Innovation']
    sampled_strings.extend(random.sample(tech_list, take_from_tech))
    
    for i in range(remaining):
        random_key = random.choice(keys)
        random_interest = random.choice(dictionary[random_key])
        if random_interest not in sampled_strings:
            sampled_strings.append(random_interest)
            
    return sampled_strings

categories_file = "fake_categories.txt"
ollama_model = "mxbai-embed-large"
with open(categories_file, 'r') as f:
  contents = f.read()
  contents = eval(contents)

ai_generated_profiles = [] # legit way of making ai profiles lol
for i in range(500):
    ai_generated_profiles.append(sample_strings_from_dict(contents, 6))
    with open('im_cooked.txt', 'w') as f:
        f.write(str(ai_generated_profiles))

    contents: List[str]
    top_n: Optional[int]

# for idx, profile in enumerate(ai_generated_profiles):
#     print(profile)
# response = requests.post(
#     url='http://localhost:8000/store',
#     json={
#         'contents': ai_generated_profiles,
#         'ids':[str(random.getrandbits(16)) for i in range(len(ai_generated_profiles))]
#     }
# )
# print(response.content)

response = requests.post(
    url='http://localhost:8000/retrieve',
    json={
        'contents': [
            ['ai', 'deep learning', 'python', 'cooking', 'gym'],
            ['programming', 'games', 'birds', 'nuclear bomb', 'robotics']
        ],
        'top_n': 5,
        'ids':[str(random.getrandbits(16) ), str(random.getrandbits(16) ) ] 
    }
)
print(response.content)

# response = requests.post(
#         url='http://localhost:8000/store',
#         json={
#             'contents': profile,
#         }
#     )
# print(pairs)

