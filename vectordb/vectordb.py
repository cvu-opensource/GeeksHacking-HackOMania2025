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

    def __init__(self, db_path, collection_name, ollama_model, distance_type='ip'):
        """
        TODO: document this.
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

        # categories_file = "./database/categories.txt"
        # self.ollama_model = "mxbai-embed-large"
        self.ollama_model = ollama_model

    def add(self, id, query, metadatas=None):
        """
        Boilerplate embedding function.
        We choose to index embeddings by their text, instead of some numbering system.
        This is rather silly, but the plus side is if you want to replace an entry,
        the index-embedding relationship wont be affected.
        I'm too tired to think this through further soooo bye

        Params:
            - id: string to indentify embedding by.
            - query: list of strings to embed. So currently only supports one query.
            - metadatas: emtadata to store alonside the query
        """
        response = ollama.embed(model=self.ollama_model, input=query)
        embeddings = response["embeddings"] 
        self.collection.add(
            ids=id,
            embeddings=embeddings,
            documents=query,
            metadatas=metadatas,
        )

    # def add_from_dict(self, dict):
    #     """
    #     Assumes that keys are super categories and values are lists of things to embed.
    #     """
    #     for category in dict:
    #         list_to_embed = dict[category]
    #         for text in list_to_embed:
    #             self.add(text, {'category': category}) # not we index by text. This is usually stupid, but if you ever replace the record, the
    #             # id-embedding pairing should still be correct lol

    # def add_from_nested_list(self, nested_list):
    #     """
    #     Monsterously useless function to add list of lists of strings into db.
    #     """
    #     for list in nested_list:
    #         concatenated = ' '.join(list)
    #         self.add(concatenated, metadatas=None)

    def retrieve(self, queries: str, condition_dict=None, top_n=5, distance_type='cosine'):
        """
        Boilerplate code to take an un-embedded query, and search it against the db.
        """
        queries = ollama.embed(model=self.ollama_model, input=queries)

        results = self.collection.query(
            query_embeddings=queries['embeddings'],
            n_results=top_n,
            where=condition_dict,
            # distance_type=distance_type
        )
        return results
    
    def retrieve_distance_text_pairs(self, query:str, condition_dict=None, top_n=5, distance_type='cosine'):
        """
        Function to call retrieve and organise distances for you.
        TODO: UPDATE THIS DOCUMENTATION
        Params:
            - queries: list of list of strings (many queries so its flexible and we call retrieve anyways)
            - condition_dict & top_n: To pass to retrieve method
        
        Returns:
            - pairs: dict, key is query text, values are list of pairs of reponses and their distances.
        """
        results = self.retrieve(query, condition_dict, top_n, distance_type)
        nested_ids = results['ids'] # [['657', '677', etc]]
        # print(nested_ids, 'nested_ids')
        ids = nested_ids[0]
        nested_distances = results['distances'] # vice versa.
        distances = nested_distances[0]

        return [[id, distance] for id, distance in zip(ids, distances)]



