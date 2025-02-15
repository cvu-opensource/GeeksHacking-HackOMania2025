from QueryManager import QueryManager
import datetime
import neo4j.time

class DBController:
    def __init__(self):
        self.qm = QueryManager()

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
        Functions:  Gets public user data given username
        Input:      JSON with username
        Output:     JSON with username, email, birth_date (datetime), gender, region
		            about_me, linkedin_url, github_url,  interests: [(name of topic, weightage)], skills: [(<same as interests>)] 
        '''
        user = self.qm.get_user(json)[0].data()['u']
        del user['password']
        user['birth_date'] = user['birth_date'].to_native()
        return user 

    def attempt_login(self, json):
        '''
        Functions:  Attempts login using a username and password
        Input:      JSON with username and password (hashed)
        Output:     JSON with success (boolean)
        '''
        res = self.qm.attempt_login(json)
        if len(res) == 0:
            return {'success': False}
        else:
            return {'success': True}

if __name__ == "__main__":
    dbc = DBController()
    # dbc.create_user({'username': 'test2', 
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
    #                 'interests': [('OpenSourceSoftware', 0.9)],
    #                 'skills': [('SoftwareEngineering', 0.7)]})

    # a = dbc.attempt_login({'username': 'test2',
    #                    'password': 'abcdefg'})
    # b = dbc.attempt_login({'username': 'test2',
    #                    'password': 'a'})
    # print(a)
    # print(b)

    # print(dbc.get_user({'username': 'test2'}))