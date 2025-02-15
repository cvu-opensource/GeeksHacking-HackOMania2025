import sys
import os
import uvicorn

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional, Union

from vectordb import VectorDB

# Initialize FastAPI app
app = FastAPI()

class Query(BaseModel):
    contents: List[List[str]]
    top_n: Optional[int] = None
    condition_dict: Optional[dict] = None # tel the boys about this?
    ids: list[str]

@app.on_event("startup")
async def startup():
    # Access environment variables
    DB_PATH = os.getenv("DB_PATH", "./data")
    COLLECTION_NAME = os.getenv("COLLECTION_NAME", "sequence_interest")
    EMBEDDER = os.getenv("EMBEDDER", "mxbai-embed-large")
    DISTANCE_TYPE = os.getenv("DISTANCE_TYPE", "ip")

    global VECTORDB # horrible!
    # We assume ollama is running defaultly on the host machine
    VECTORDB = VectorDB(db_path=DB_PATH, collection_name=COLLECTION_NAME, embedder=EMBEDDER, distance_type=DISTANCE_TYPE)
    
    print(f"EMBEDDER from environment: {EMBEDDER}")

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/retrieve/")
def retrieve(query: Query):
    dict = {}
    queries, top_n = query.contents, query.top_n
    assert isinstance(top_n, int), f'top_n is not an integer! Got top_n: {top_n}'
    for query in queries:
        query = " ".join(query)
        id_distances_list = VECTORDB.retrieve_distance_text_pairs(query=query, top_n=top_n)
        dict[query] = id_distances_list
    return dict

@app.post("/store/")
def store(query: Query):
    queries, ids = query.contents, query.ids # here .content returns list of list of str
    for query, id in zip(queries, ids):
        query = ' '.join(query)
        VECTORDB.add(id=id, query=query) # batch add instead? who cares lol
    return "<3" # surely gerard wont use this!

# Main entry point for running the app
if __name__ == "__main__":
    uvicorn.run("MainControllerVectorDB:app", host="0.0.0.0", port=8000, reload=True)