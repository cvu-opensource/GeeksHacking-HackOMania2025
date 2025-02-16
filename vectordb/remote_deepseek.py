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

    DB_PATH = os.getenv("DB_PATH", "./data")
    COLLECTION_NAME = os.getenv("COLLECTION_NAME", "descriptions")
    EMBEDDER = os.getenv("EMBEDDER", "mxbai-embed-large")
    DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "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")
    DISTANCE_TYPE = os.getenv("DISTANCE_TYPE", "ip")
    CLIENT = OpenAI(api_key="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", base_url="https://openrouter.ai/api/v1")
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
        completion = CLIENT.chat.completions.create(
            model="deepseek/deepseek-r1:free",
            messages=[
                {
                "role": "system",
                "content": sys_prompt + str(user_dict)
                }
            ]
        )
        print('retrieving query,', query)
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
        completion = CLIENT.chat.completions.create(
            model="deepseek/deepseek-r1:free",
            messages=[
                {
                "role": "system",
                "content": sys_prompt + str(event_dict)
                }
            ]
        )
        query = completion.choices[-1].message.content
        print('before splitting', query)
        query = query.split("\n")[-1]
        # print("AHHHHHHHHHHHHHHHHHHHHHHHHH QUERY", query.split("\n")[-1])
        print("going to embed query,", query)
        DescriptionDB.add(id=event_id, query=query)


# Main entry point for running the app
if __name__ == "__main__":
    uvicorn.run("remote_deepseek:app", host="localhost", port=8002, reload=True)
