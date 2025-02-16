from QueryManager import QueryManager
import datetime
import neo4j.time
import random

class DBController:
    def __init__(self):
        self.qm = QueryManager()

    ## USER METHODS

    def create_user(self, json):
        '''
        Function:   Instantiates a User Node
        Input:      JSON with username, password (hashed), email, birth_date (datetime), gender, region
		            about_me, linkedin_url, github_url,  interests: [(name of topic, weightage)], skills: [(<same as interests>)]
        Output:     None
        '''
        try:
            self.qm.create_user(json)

            for topic, weightage in json.get("interests", []):
                self.qm.create_user_interested_topic({
                    "username": json["username"],
                    "topic": topic,
                    "weightage": weightage
                })

            for topic, weightage in json.get("skills", []):
                self.qm.create_user_skilled_topic({
                    "username": json["username"],
                    "topic": topic,
                    "weightage": weightage
                })

            return {"success": True, "message": "User created successfully"}
        except Exception as e:
            return {"success": False, "message": str(e)}

    def update_user(self, json):
        '''
        Function:   Updates fields of a User Node
        Input:      JSON with username, email, region
		            about_me, linkedin_url, github_url,  interests: [(name of topic, weightage)], skills: [(<same as interests>)]
        Output:     None
        '''
        try:
            self.qm.update_user(json)
            self.qm.delete_user_interests_skills(json)

            for topic, weightage in json.get("interests", []):
                self.qm.create_user_interested_topic({
                    "username": json["username"],
                    "topic": topic,
                    "weightage": weightage
                })

            for topic, weightage in json.get("skills", []):
                self.qm.create_user_skilled_topic({
                    "username": json["username"],
                    "topic": topic,
                    "weightage": weightage
                })

            return {"success": True, "message": "User updated successfully."}
        except Exception as e:
            return {"success": False, "message": str(e)}

    def get_user(self, json):
        '''
        Function:   Gets public user data given username
        Input:      JSON with username
        Output:     JSON with username, email, birth_date (datetime), gender, region
		            about_me, linkedin_url, github_url,  interests: [(name of topic, weightage)], skills: [(<same as interests>)] 
        '''
        try:
            user = self.qm.get_user(json)[0].data()["u"]
            user.pop("password", None)  # Safer way to remove password
            user["birth_date"] = user["birth_date"].to_native()

            return {"success": True, "message": "Successfully retrieved user data", "data": user}
        except Exception as e:
            return {"success": False, "message": str(e)}

    def get_user_interests(self, json):
        '''
        Function:   Gets list of user interest based on a hardcoded threshold for model to recommend
        Input:      JSON with username
        Output:     JSON with list of interest
        '''
        try:
            json["threshold"] = 0.5
            data = [i.data()["topic"] for i in self.qm.get_user_interests(json)]
            return {"success": True, "data": data}
        except Exception as e:
            return {"success": False, "message": str(e)}

    def attempt_login(self, json):
        '''
        Function:   Attempts login using a username and password
        Input:      JSON with username and password (hashed)
        Output:     JSON with success (boolean)
        '''
        try:
            res = self.qm.attempt_login(json)
            return {"success": len(res) > 0}
        except Exception as e:
            logger.error(f"Error attempting login: {e}")
            return {"success": False, "message": str(e)}
    
    def get_random_users(self):
        '''
        Function:   Gets 4 random users
        Input:      None
        Output:     JSON with 4 random users
        '''
        try:
            users = [i.data()['username'] for i in self.qm.get_usernames()]
            indices = set()
            max_loop = 1000
            for _ in range(max_loop):
                if len(indices) >= 4: break
                indices.add(random.randint(0, len(users) - 1))
            
            userdata = [self.qm.get_user({'username': users[i]})[0].data()['u'] for i in indices]
            
            for ud in userdata:
                ud.pop("password", None)
            return {"success": True, "data": {"users": [userdata[i] for i in indices]}}
        except Exception as e:
            return {"success": False, "message": str(e)}

    def create_friendship(self, json):
        '''
        Function:   Makes two users friends
        Input:      JSON with username1 and username2
        Output:     None
        '''
        try:
            self.qm.create_friendship(json)
            return {"success": True, "message": "Friend added successfully."}
        except Exception as e:
            return {"success": False, "message": str(e)}

    def delete_friendship(self, json: dict) -> dict:
        '''
        Function:   Makes two users no longer friends
        Input:      JSON with username1 and username2
        Output:     None
        '''
        try:
            self.qm.delete_friendship(json)
            return {"success": True, "message":"Friend removed successfully."}
        except Exception as e:
            return {"success": False, "message": str(e)}

    ## EVENT METHODS

    def create_or_update_event(self, json):
        '''
        Function:   Creates an event if its eventid does not yet exist, else update the event
        Input:      JSON with eventid, name, description, url, logo, starttime_local, endtime_local, is_free, 
                    is_online, category, venue_address, venue_lat, venue_long, venue_region,
                    organizer_name, organizer_website
        Output:     None
        '''
        try:
            self.qm.create_or_update_event(json)
            self.qm.create_event_to_topic(json)
            self.qm.create_event_to_type(json)

            return {"success": True, "message": "Event changed successfully."}
        except Exception as e:
            return {"success": False, "message": str(e)}

    def get_events(self):
        '''
        Function:   Get events 
        Input:      None
        Output:     JSON of events (list of dict)
        '''
        try:
            data = [event.data() for event in self.qm.get_events()]
            for event in data:
                event['e']['type'] = event['type']
                event['e']['category'] = event['topic']
            return {"success": True, "message": "Events retrieved successfully.", "events": [event['e'] for event in data]}
        except Exception as e:
            return {"success": False, "message": str(e)}
    
    def get_random_events(self):
        '''
        Function:   Gets 5 random events
        Input:      None
        Output:     JSON of events
        '''
        try:
            events = self.get_events()["events"]
            indices = set()
            max_loop = 1000
            for _ in range(max_loop):
                if len(indices) >= 5: break
                indices.add(random.randint(0, len(events) - 1))
            return {'success': True, 'data': {'events': [events[i] for i in indices]}}
        except Exception as e: 
            return {"success": False, "message": str(e)}

    ## THREADS

    def create_thread(self, json):
        '''
        Function:   Create a new thread
        Input:      JSON with title username description code interest (list of string)
        Output:     None
        '''
        try:
            json['datetime'] = datetime.datetime.now()
            self.qm.create_thread(json)
            self.qm.create_thread_to_user(json)
            for interest in json['interests']:
                self.qm.create_thread_to_topic({
                    'title': json['title'], 
                    'topic': interest
                })
            return {"success": True, "message": "Thread created successfully."}
        except Exception as e:
            return {"success": False, "message": str(e)}
    
    def create_comment(self, json):
        '''
        Function:   Create comments for thread
        Input:      JSON with title, username, description
        Output:     None
        '''
        try:
            json['datetime'] = datetime.datetime.now()
            self.qm.create_comment(json)
            return {"success": True, "message": "Comment created successfully."}
        except Exception as e:
            return {"success": False, "message": str(e)}

    def get_thread(self, json):
        '''
        Function:   Gets details of one thread
        Input:      JSON with title
        Output:     JSON with stuff
        '''
        try:
            threads = [thread.data() for thread in self.qm.get_thread(json)]
            comments = [comment.data() for comment in self.qm.get_comments_from_thread(json)]
            topics = [topic.data() for topic in self.qm.get_topics_from_thread(json)]

            output = threads[0]['th']
            output['datetime'] = output['datetime'].to_native()
            output['username'] = threads[0]['username']
            output['comments'] = []
            for i in comments:
                comment = i['c']
                comment['username'] = i['username']
                comment['datetime'] = comment['datetime'].to_native()
                output['comments'].append(comment)
            
            output['interests'] = []
            for i in topics:
                output['interests'].append(i['name'])

            return {'success': True, 'comment': 'Thread retrieved successfully', 'thread': output}
        except Exception as e:
            return {"success": False, "message": str(e)}
        

    def get_threads(self):
        '''
        Function:   Gets all threads and their creator
        Input:      None
        Output:     JSON with threads which is a list of dict with title and username
        '''
        try:
            data = [thread.data() for thread in self.qm.get_threads()]
            return {'success': True, 'comment': 'Threads retrieved successfully', 'threads': data}
        except Exception as e:
            return {"success": False, "message": str(e)}

if __name__ == "__main__":
    pass