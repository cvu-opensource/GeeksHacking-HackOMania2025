from neo4j import GraphDatabase

class Database:
    '''
    Database handles interaction with the Neo4j database
    '''
    def __init__(self):
        self.URL = 'neo4j://localhost'
        self.AUTH = ('neo4j', 'P@ssword1')
        self.driver = GraphDatabase.driver(self.URL, auth = self.AUTH)
    
    def execute_write(self, query):
        with self.driver.session(database='neo4j') as session:
            session.execute_write(query)

if __name__ == "__main__":
    db = Database()