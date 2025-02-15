from Database import Database
import datetime

class QueryManager:
    '''
    QueryManager stores the queries to be used for interaction with the database
    '''
    def __init__(self):
        self.db = Database()

    def create_user(self, json):
        '''
        create_user creates a new User node 
        '''
        query = """
            CREATE (:User {
                username: $username, password: $password, email: $email, 
                birth_date: $birth_date, gender: $gender, region: $region,
                about_me: $about_me, linkedin_url: $linkedin_url, github_url: $github_url
            })
            """
        self.db.execute_query(query, json)

    def create_user_interested_topic(self, json):
        '''
        create interested in relationship between User and Topic
        '''
        query = """
            MATCH (u:User {username: $username})
            MATCH (t:Topic {name: $topic})
            CREATE (u)-[:INTERESTED_IN]->(t)
        """
        self.db.execute_query(query, json)

    def create_user_skilled_topic(self, json):
        '''
        create skilled in relationship between User and Topic
        '''
        query = """
            MATCH (u:User {username: $username})
            MATCH (t:Topic {name: $topic})
            CREATE (u)-[:SKILLED_IN]->(t)
        """
        self.db.execute_query(query, json)

    def update_user(self, json):
        '''
        update_user updates a User node 
        '''
        query = """
            MATCH (u:User {username: $username})
            SET u.email = $email
            SET u.region = $region
            SET u.about_me = $about_me
            SET u.linkedin_url = $linkedin_url
            SET u.github_url = $github_url
            """
        self.db.execute_query(query, json)
    
    def delete_user_interests_skills(self, json):
        '''
        removes all relation to Topic for a User 
        '''
        query = """
            MATCH (:User {username: $username})-[r]->(:Topic)
            DETACH DELETE r
            """
        self.db.execute_query(query, json)

    def get_user(self, json):
        '''
        returns user data for specified username
        '''
        query = """
            MATCH (u:User {username: $username})
            RETURN u
        """
        return self.db.execute_query(query, json)

    def attempt_login(self, json):
        '''
        returns success if a user with specified username and password is found
        '''
        query = """
            MATCH (u:User {username: $username, password: $password})
            RETURN u.username
        """
        return self.db.execute_query(query, json)