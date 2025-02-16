from neo4j import GraphDatabase

class Database:
    '''
    Database handles interaction with the Neo4j database
    '''
    def __init__(self):
        self.URL = 'neo4j://127.0.0.1'
        self.AUTH = ('neo4j', 'P@ssword1')
        self.driver = GraphDatabase.driver(self.URL, auth = self.AUTH)
    
    def execute_query(self, query, params):
        records, summary, keys = self.driver.execute_query(query, parameters_=params, database_="neo4j")
        return records

if __name__ == "__main__":
    db = Database()