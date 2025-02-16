import ollama
import os
import random
import chromadb
from chromadb.config import Settings

class VectorDB:
    """
    Class to define Vector DB to use to store & queries semantics (list of words or just words?)
    Chroma is just there being chroma idk to run it as a docker yet but probably will

    During deployment, when asking for new recommendations for a user by interest, 
    embed it and do a query against the vector DB, to find closest interests.
    """

    def __init__(self, db_path, collection_name, embedder, distance_type='ip'):
        """
        TODO: document this. HAHA jk!
        """
        DIR = os.path.dirname(os.path.abspath(__file__))
        DB_PATH = os.path.join(DIR, db_path)
        self.client = chromadb.PersistentClient(path=DB_PATH, settings=Settings(allow_reset=True, anonymized_telemetry=False))
        self.collection = self.client.get_or_create_collection(
            name=collection_name, 
            metadata={
                'hnsw:space':distance_type
            }
        )
        self.distance_type = distance_type

        # categories_file = "./database/categories.txt"
        # self.embedder = "mxbai-embed-large"
        self.embedder = embedder

    def add(self, id, query: str, metadatas=None):
        """
        Boilerplate embedding function.

        Params:
            - id: string to indentify embedding by.
            - query: strings to embed.
            - metadatas: emtadata to store alonside the query
        """
        response = ollama.embed(model=self.embedder, input=query)
        embeddings = response["embeddings"] 
        self.collection.add(
            ids=id,
            embeddings=embeddings,
            documents=query,
            metadatas=metadatas,
        )

    def retrieve(self, query: str, condition_dict=None, top_n=5, distance_type=None):
        """
        Boilerplate code to take an un-embedded query, and search it against the db.
        """
        if distance_type is None:
            distance_type = self.distance_type
        query = ollama.embed(model=self.embedder, input=query)

        results = self.collection.query(
            query_embeddings=query['embeddings'],
            n_results=top_n,
            where=condition_dict,
            # distance_type=distance_type
        )
        return results
    
    def retrieve_distance_text_pairs(self, query:str, condition_dict=None, top_n=5, distance_type=None):
        """
        Wrapper function to call retrieve and organise distances for you.

        Params:
            - queries: string
            - condition_dict & top_n & distance_type: To pass to retrieve method
        
        Returns:
            - pairs: list of lists, inner list is [id, distance] since thats prolly what they care about
        """
        results = self.retrieve(query, condition_dict, top_n, distance_type)
        nested_ids = results['ids'] # [['657', '677', etc]]
        # print(nested_ids, 'nested_ids')
        ids = nested_ids[0]
        nested_distances = results['distances'] # vice versa.
        distances = nested_distances[0]

        return [[id, distance] for id, distance in zip(ids, distances)]



