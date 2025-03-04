import sys
import os
import uvicorn
import ollama

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional, Union

from vectordb import VectorDB
from openai import OpenAI


# Initialize FastAPI app
app = FastAPI()

class DescriptionQuery(BaseModel):
    """
    Arbitrage structure with which to recieve requests by. Whether the thing we are querying for is a User
    or an Event or anything, all that is required is a dictionary. System-prompt the LLM to extract the
    related information as desired depending on the call; which is the beautiful thing about LLMs, that
    they can take very, very arbitrage input and give you a formatted output.
    """
    contents: List[dict]  # list of arbitrary dictionaries. Resolve iteration in the call parts.
    ids: List[str] # list of ids, for storage reasons e.g to store events.
    top_n: Optional[int] = None


@app.on_event("startup")
async def startup():
    global DescriptionDB # horrible!
    global LLM # horrible!
    global CLIENT
    # Access environment variables

    DB_PATH = "/vectordb/events_data"
    COLLECTION_NAME = "events"
    EMBEDDER = os.getenv("EMBEDDER", "mxbai-embed-large")
    DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "sk-d7df39a3927742d1bd714a7571191a69")
    DISTANCE_TYPE = os.getenv("DISTANCE_TYPE", "ip")
    CLIENT = OpenAI(api_key=DEEPSEEK_API_KEY, base_url="https://api.deepseek.com/v1")
    LLM = os.getenv('LLM', 'deepseek-r1:8b')

    # We assume ollama is running with default ports exposed on the host machine. A terrible assumption to make!
    DescriptionDB = VectorDB(db_path=DB_PATH, collection_name=COLLECTION_NAME, embedder=EMBEDDER, distance_type=DISTANCE_TYPE)
    
    print(f"EMBEDDER from environment: {EMBEDDER}")


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/get_user_related_events")
def user_query_event(query: DescriptionQuery):
    dict = {}
    user_dicts, user_ids, top_n = query.contents, query.ids, query.top_n
    sys_prompt = """
        You will recieve a python dictionary specifying the details of a person.
        Output the most likely type of event that this user would be interested in attending.
        Format your output in a short paragraph (at most 100 words) describing such an event.
    """
    for user_dict, user_id in zip(user_dicts, user_ids):
        response = ollama.chat(
            model=LLM,
            messages=[
                {"role": "system", "content": sys_prompt + str(user_dict)},
            ],
        )
        query = response.message.content.split('</think>')[-1]
        print(query)
        id_distances_list = DescriptionDB.retrieve_distance_text_pairs(
            query=query, top_n=top_n
        )
        dict[user_id] = id_distances_list

    return dict


@app.post("/store_events")
def event_embed(query: DescriptionQuery):
    event_dicts, event_ids = query.contents, query.ids
    sys_prompt = """
        You will recieve a python dictionary specifying details of an event.
        Reason what the event might be about, based on the provided context and your own 
        reasoning. Do not hallucinate properties about the event. Output
        a paragraph (at most 100 words) summarizing the event.
    """
    response = []
    for event_dict, event_id in zip(event_dicts, event_ids):
        response = ollama.chat(
            model=LLM,
            messages=[
                {"role": "system", "content": sys_prompt + str(event_dict)},
            ],
        )
        query = response.message.content.split('</think>')[-1]
        print(query)
        DescriptionDB.add(id=event_id, query=query)


# Main entry point for running the app
if __name__ == "__main__":
    uvicorn.run("MainControllerEventsDB:app", host="localhost", port=8001, reload=True)
