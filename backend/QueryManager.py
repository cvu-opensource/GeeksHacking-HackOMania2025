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
            MERGE (t:Topic {name: $topic})
            CREATE (u)-[:INTERESTED_IN {weightage: $weightage}]->(t)
        """
        self.db.execute_query(query, json)

    def create_user_skilled_topic(self, json):
        '''
        create skilled in relationship between User and Topic
        '''
        query = """
            MATCH (u:User {username: $username})    
            MERGE (t:Topic {name: $topic})
            CREATE (u)-[:SKILLED_IN {weightage: $weightage}]->(t)
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

    def get_user_interests(self, json):
        '''
        returns user interests for specified username and threshold
        '''
        query = """
            MATCH (:User {username: $username})-[r:INTERESTED_IN]->(t:Topic)
            WHERE r.weightage > $threshold
            RETURN t.name AS topic
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
    
    def get_usernames(self):
        '''
        returns all usernames in db
        '''
        query = """
            MATCH (u:User)
            RETURN u.username AS username
        """
        return self.db.execute_query(query, {})

    def create_friendship(self, json):
        '''
        creates a friend relationship between two users
        '''
        query = """
            MATCH (u1:User {username: $username1})
            MATCH (u2:User {username: $username2})
            MERGE (u1)-[:IS_FRIENDS_WITH]->(u2)
            MERGE (u1)<-[:IS_FRIENDS_WITH]-(u2)
            """
        self.db.execute_query(query, json)
    
    def delete_friendship(self, json):
        '''
        deletes a friend relationship between two users
        '''
        query = """
            MATCH (:User {username: $username1})-[r1:IS_FRIENDS_WITH]->(:User {username: $username2})
            MATCH (:User {username: $username1})<-[r2:IS_FRIENDS_WITH]-(:User {username: $username2})
            DELETE r1
            DELETE r2
            """
        self.db.execute_query(query, json)
        

    def create_or_update_event(self, json):
        '''
        creates events if they don't exist 
        '''
        query = """
            MERGE (e:Event {eventid: $eventid})
            SET e.name = $name
            SET e.description = $description 
            SET e.url = $url 
            SET e.logo = $logo
            SET e.starttime_local = $starttime_local
            SET e.endtime_local = $endtime_local 
            SET e.is_free = $is_free
            SET e.is_online = $is_online
            SET e.venue_address = $venue_address
            SET e.venue_lat = $venue_lat
            SET e.venue_long = $venue_long
            SET e.venue_region = $venue_region
            SET e.organizer_name = $organizer_name 
            SET e.organizer_website = $organizer_website
        """
        self.db.execute_query(query, json)
    
    def create_event_to_topic(self, json):
        query = """
            MATCH (e:Event {eventid: $eventid})
            MERGE (t:Topic {name: $category})
            MERGE (e)-[:CATEGORISED_AS]->(t)
        """
        self.db.execute_query(query, json)

    def create_event_to_type(self, json):
        query = """
            MATCH (e:Event {eventid: $eventid})
            MERGE (ty:Type {name: $type})
            MERGE (e)-[:IS_OF_TYPE]->(ty)
        """
        self.db.execute_query(query, json)

    def get_events(self):
        query = """
            MATCH (e:Event)
            MATCH (e)-[:CATEGORISED_AS]->(t:Topic)
            MATCH (e)-[:IS_OF_TYPE]->(ty:Type)
            RETURN e, t.name AS topic, ty.name AS type
        """
        return self.db.execute_query(query, {})
    
    def create_thread(self, json):
        query = """
            CREATE (th:Thread {
                title: $title, datetime: $datetime, description: $description,
                code: $code 
            })
        """
        self.db.execute_query(query, json)
    
    def create_thread_to_user(self, json):
        query = """
            MATCH (th:Thread {title: $title})
            MATCH (u:User {username: $username})
            CREATE (th)-[:CREATED_BY]->(u)
        """
        self.db.execute_query(query, json)

    def create_thread_to_topic(self, json):
        query = """
            MATCH (th:Thread {title: $title})
            MATCH (t:Topic {name: $topic})
            CREATE (th)-[:RELATED_TO]->(t)
        """
        self.db.execute_query(query, json)

    def create_comment(self, json):
        query = """
            MATCH (th:Thread {title: $title})
            MATCH (u:User {username: $username})
            CREATE (c:Comment {
                datetime: $datetime, description: $description
            })
            CREATE (c)-[:CREATED_BY]->(u)
            CREATE (c)-[:BELONGS_TO]->(th)
        """
        self.db.execute_query(query, json)
    
    def get_thread(self, json):
        query = """
            MATCH (th:Thread {title: $title})
            MATCH (th)-[:CREATED_BY]->(u:User)
            RETURN th, u.username AS username
        """
        return self.db.execute_query(query, json)
    
    def get_comments_from_thread(self, json):
        query = """
            MATCH (th:Thread {title: $title})
            MATCH (c:Comment)-[:BELONGS_TO]->(th)
            MATCH (c)-[:CREATED_BY]->(u:User)
            RETURN c, u.username AS username
        """
        return self.db.execute_query(query, json)
    
    def get_topics_from_thread(self, json):
        query = """
            MATCH (th:Thread {title: $title})
            MATCH (th)<-[:RELATED_TO]->(t:Topic)
            RETURN t.name AS name
        """
        return self.db.execute_query(query, json)
    
    def get_threads(self):
        query = """
            MATCH (th:Thread)
            MATCH (th)-[:CREATED_BY]->(u:User)
            RETURN th.title AS title, u.username AS username
        """
        return self.db.execute_query(query, {})