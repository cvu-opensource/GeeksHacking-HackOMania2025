from QueryManager import QueryManager
import datetime
import neo4j.time

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
        self.qm.create_user(json)
        for topic, weightage in json['interests']:
            interest_json = {
                'username': json['username'],
                'topic': topic,
                'weightage': weightage
            }
            self.qm.create_user_interested_topic(interest_json)

        for topic, weightage in json['skills']:
            skill_json = {
                'username': json['username'],
                'topic': topic,
                'weightage': weightage
            }
            self.qm.create_user_skilled_topic(skill_json)
    
    def update_user(self, json):
        '''
        Function:   Updates fields of a User Node
        Input:      JSON with username, email, region
		            about_me, linkedin_url, github_url,  interests: [(name of topic, weightage)], skills: [(<same as interests>)]
        Output:     None
        '''
        self.qm.update_user(json)
        self.qm.delete_user_interests_skills(json)
        for topic, weightage in json['interests']:
            interest_json = {
                'username': json['username'],
                'topic': topic,
                'weightage': weightage
            }
            self.qm.create_user_interested_topic(interest_json)

        for topic, weightage in json['skills']:
            skill_json = {
                'username': json['username'],
                'topic': topic,
                'weightage': weightage
            }
            self.qm.create_user_skilled_topic(skill_json)
    
    def get_user(self, json):
        '''
        Function:   Gets public user data given username
        Input:      JSON with username
        Output:     JSON with username, email, birth_date (datetime), gender, region
		            about_me, linkedin_url, github_url,  interests: [(name of topic, weightage)], skills: [(<same as interests>)] 
        '''
        user = self.qm.get_user(json)[0].data()['u']
        del user['password']
        user['birth_date'] = user['birth_date'].to_native()
        return user 
    
    def get_user_interests(self, json):
        '''
        Function:   Gets list of user interest based on a hardcoded threshold for model to recommend
        Input:      JSON with username
        Output:     JSON with list of interest
        '''
        json['threshold'] = 0.5
        data = [i.data()['topic'] for i in self.qm.get_user_interests(json)]
        return {'content': data}

    def attempt_login(self, json):
        '''
        Function:   Attempts login using a username and password
        Input:      JSON with username and password (hashed)
        Output:     JSON with success (boolean)
        '''
        res = self.qm.attempt_login(json)
        if len(res) == 0:
            return {'success': False}
        else:
            return {'success': True}
    
    def create_friendship(self, json):
        '''
        Function:   Makes two users friends
        Input:      JSON with username1 and username2
        Output:     None
        '''
        self.qm.create_friendship(json)

    def delete_friendship(self, json):
        '''
        Function:   Makes two users no longer friends
        Input:      JSON with username1 and username2
        Output:     None
        '''
        self.qm.delete_friendship(json)

    ## EVENT METHODS

    def create_or_update_event(self, json):
        '''
        Function:   Creates an event if its eventid does not yet exist, else update the event
        Input:      JSON with eventid, name, description, url, logo, starttime_local, endtime_local, is_free, 
                    is_online, category, venue_address, venue_lat, venue_long, venue_region,
                    organizer_name, organizer_website
        Output:     None
        '''
        self.qm.create_or_update_event(json)
        self.qm.create_event_to_topic(json)
        self.qm.create_event_to_type(json)

    def get_events(self):
        '''
        Function:   Get events 
        Input:      None
        Output:     JSON of events (list of dict)
        '''
        data = [i.data() for i in self.qm.get_events()]
        for i in data:
            i['e']['type'] = i['type']
            i['e']['category'] = i['topic']
        return [i['e'] for i in data]
    
    ## THREADS

    def create_thread(self, json):
        '''
        Function:   Create a new thread
        Input:      JSON with title username description code interest (list of string)
        Output:     None
        '''
        json['datetime'] = datetime.datetime.now()
        self.qm.create_thread(json)
        self.qm.create_thread_to_user(json)
        for i in json['interests']:
            th = {}
            th['title'] = json['title']
            th['topic'] = i
            self.qm.create_thread_to_topic(th)
    
    def create_comment(self, json):
        '''
        Function:   Create comments for thread
        Input:      JSON with title, username, description
        Output:     None
        '''
        json['datetime'] = datetime.datetime.now()
        self.qm.create_comment(json)

    def get_thread(self, json):
        '''
        Function:   Gets details of one thread
        Input:      JSON with title
        Output:     JSON with stuff
        '''
        th = [i.data() for i in self.qm.get_thread(json)]
        c = [i.data() for i in self.qm.get_comments_from_thread(json)]
        t = [i.data() for i in self.qm.get_topics_from_thread(json)]

        out = th[0]['th']
        out['datetime'] = out['datetime'].to_native()
        out['username'] = th[0]['username']
        out['comments'] = []
        for i in c:
            out2 = i['c']
            out2['username'] = i['username']
            out2['datetime'] = out2['datetime'].to_native()
            out['comments'].append(out2)
        
        out['interests'] = []
        for i in t:
            out['interests'].append(i['name'])

        return out

    def get_threads(self):
        '''
        Function:   Gets all threads and their creator
        Input:      None
        Output:     JSON with threads which is a list of dict with title and username
        '''
        data = [i.data() for i in self.qm.get_threads()]
        return {'threads': data}

if __name__ == "__main__":
    dbc = DBController()
    # dbc.create_user({'username': 'test', 
    #                 'password': 'abcdefg', 
    #                 'email': 'a', 
    #                 'birth_date': datetime.datetime.now(),
    #                 'gender': 'others',
    #                 'region': 'malaysia',
    #                 'about_me': 'i ',
    #                 'linkedin_url': 'abc',
    #                 'github_url': 'def',
    #                 'interests': [('SoftwareEngineering', 0.8), ('OpenSourceSoftware', 0.5)],
    #                 'skills': [('SoftwareEngineering', 0.7)]})
    
    # dbc.update_user({'username': 'test2',
    #                 'email': 'abc@gmail.com',
    #                 'about_me': 'i ',
    #                 'region': 'singapore',
    #                 'linkedin_url': 'abc',
    #                 'github_url': 'def',
    #                 'interests': [('OpenSourceSoftware', 0.9), ('SoftwareEngineering', 0.7), ("Music", 0.5)],
    #                 'skills': [('SoftwareEngineering', 0.7)]})

    # a = dbc.attempt_login({'username': 'test2',
    #                    'password': 'abcdefg'})
    # b = dbc.attempt_login({'username': 'test2',
    #                    'password': 'a'})
    # print(a)
    # print(b)

    # print(dbc.get_user({'username': 'test2'}))

    # dbc.create_or_update_event({"eventid": "ed",
    #                             "name": "Golden Mix Vol.9",
    #                             "type": "Networking",
    #                             "description": "Golden Mix Vol.9  -  Singapore’s largest Anikura (アニクラ) event",
    #                             "url": f"https://www.eventbrite.sg/e/golden-mix-vol9-tickets-1146639231809",
    #                             "logo": f"https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F932993673%2F264956113191%2F1%2Foriginal.20250111-033640?h=200&w=450&auto=format%2Ccompress&q=75&sharp=10&rect=4%2C0%2C1272%2C636&s=0c9458b04f6c325c39ab19712acf9c30",
    #                             "starttime_local": "2025-02-15T22:30:00",
    #                             "endtime_local": "2025-02-16T02:30:00",
    #                             "is_free": False,
    #                             "is_online": False,
    #                             "category": "Music",
    #                             "venue_address": "8 Grange Road #05-01, Singapore, 239695",
    #                             "venue_lat": "1.301527",
    #                             "venue_long": "103.8363441",
    #                             "venue_region": "South",
    #                             "organizer_name": "Golden Mix",
    #                             "organizer_website": "https://www.instagram.com/goldenmixsg/"
    # })
    # a = dbc.get_user_interests({'username': 'test2'})
    # print(a)
    # dbc.create_friendship({'username1': 'test', 'username2': 'test2'})
    # dbc.delete_friendship({'username1': 'test', 'username2': 'test2'})
    # print(dbc.get_events())
    # dbc.create_thread({
    #     "title": 'test',
    #     "username": 'test',
    #     "description": "i ",
    #     "code": "str",
    #     "interests": ["SoftwareEngineering"]
    # })
    # dbc.create_comment({
    #     "title": 'test',
    #     "username": "test2",
    #     "description": "aaa"
    # })
    # print(dbc.get_thread({'title': 'test'}))
    # print(dbc.get_threads())