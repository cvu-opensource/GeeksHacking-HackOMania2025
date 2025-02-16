# DO NOT USE THIS SCRIPT UNLESS YOU ARE ONLY TESTING DBCONTROLLER

from DBController import DBController
from QueryManager import QueryManager
from Database import Database
import datetime

if __name__ == "__main__":
    dbc = DBController()

    userA = {
        'username': 'User A', 
        'password': 'abcdefg', 
        'email': 'usera@gmail.com', 
        'birth_date': datetime.datetime(2000, 1, 1),
        'gender': 'male',
        'region': 'singapore',
        'about_me': 'i like project management',
        'linkedin_url': 'usera',
        'github_url': 'usera',
        'interests': [('Project Management', 1.0), ('Business Administration', 0.8), ('Software Engineering', 0.6)],
        'skills': [('Project Management', 1.0), ('Business Administration', 0.7)]
    }
    print("Creating User A...")
    print(dbc.create_user(userA))

    userB = {
        'username': 'User B', 
        'password': 'abcdefg', 
        'email': 'userb@gmail.com', 
        'birth_date': datetime.datetime(2003, 1, 1),
        'gender': 'male',
        'region': 'singapore',
        'about_me': 'i like ai, ai is the best',
        'linkedin_url': 'userb',
        'github_url': 'userb',
        'interests': [('Artificial Intelligence', 1.0), ('Machine Learning', 0.8), ('Software Engineering', 0.7)],
        'skills': [('Artificial Intelligence', 1.0), ('Machine Learning', 0.8), ('Software Engineering', 0.7)]
    }
    print("Creating User B...")
    print(dbc.create_user(userB))

    userC = {
        'username': 'User C', 
        'password': 'abcdefg', 
        'email': 'userc@gmail.com', 
        'birth_date': datetime.datetime(1998, 1, 1),
        'gender': 'male',
        'region': 'singapore',
        'about_me': 'i love ai',
        'linkedin_url': 'userc',
        'github_url': 'userc',
        'interests': [('Artificial Intelligence', 1.0), ('Machine Learning', 0.8), ('Machine Vision', 0.7)],
        'skills': [('Artificial Intelligence', 1.0), ('Machine Learning', 0.7), ('Machine Vision', 0.6)]
    }
    
    print("Creating User C...")
    print(dbc.create_user(userC))

    event1 = {
        "eventid": "1",
        "name": "Golden Mix Vol.9",
        "type": "Networking",
        "description": "Golden Mix Vol.9  -  Singapore’s largest Anikura (アニクラ) event",
        "url": f"https://www.eventbrite.sg/e/golden-mix-vol9-tickets-1146639231809",
        "logo": f"https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F932993673%2F264956113191%2F1%2Foriginal.20250111-033640?h=200&w=450&auto=format%2Ccompress&q=75&sharp=10&rect=4%2C0%2C1272%2C636&s=0c9458b04f6c325c39ab19712acf9c30",
        "starttime_local": "2025-02-15T22:30:00",
        "endtime_local": "2025-02-16T02:30:00",
        "is_free": False,
        "is_online": False,
        "category": "Music",
        "venue_address": "8 Grange Road #05-01, Singapore, 239695",
        "venue_lat": "1.301527",
        "venue_long": "103.8363441",
        "venue_region": "South",
        "organizer_name": "Golden Mix",
        "organizer_website": "https://www.instagram.com/goldenmixsg/"
    }
    print("Creating Event 1...")
    print(dbc.create_or_update_event(event1))

    event2 = {
        "eventid": "2",
        "name": "Golden Mix Vol.8",
        "type": "Hackathon",
        "description": "Golden Mix Vol.8  -  Singapore’s largest Software Dev event",
        "url": f"https://www.eventbrite.sg/e/golden-mix-vol9-tickets-1146639231809",
        "logo": f"https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F932993673%2F264956113191%2F1%2Foriginal.20250111-033640?h=200&w=450&auto=format%2Ccompress&q=75&sharp=10&rect=4%2C0%2C1272%2C636&s=0c9458b04f6c325c39ab19712acf9c30",
        "starttime_local": "2025-02-15T22:30:00",
        "endtime_local": "2025-02-16T02:30:00",
        "is_free": False,
        "is_online": False,
        "category": "Software Engineering",
        "venue_address": "8 Grange Road #05-01, Singapore, 239695",
        "venue_lat": "1.301527",
        "venue_long": "103.8363441",
        "venue_region": "South",
        "organizer_name": "Golden Mix",
        "organizer_website": "https://www.instagram.com/goldenmixsg/"
    }
    print("Creating Event 2...")
    print(dbc.create_or_update_event(event2))

    event3 = {
        "eventid": "3",
        "name": "Golden Mix Vol.12",
        "type": "Networking",
        "description": "Golden Mix Vol.12  -  Singapore’s smallest Software Dev event",
        "url": f"https://www.eventbrite.sg/e/golden-mix-vol9-tickets-1146639231809",
        "logo": f"https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F932993673%2F264956113191%2F1%2Foriginal.20250111-033640?h=200&w=450&auto=format%2Ccompress&q=75&sharp=10&rect=4%2C0%2C1272%2C636&s=0c9458b04f6c325c39ab19712acf9c30",
        "starttime_local": "2025-02-15T22:30:00",
        "endtime_local": "2025-02-16T02:30:00",
        "is_free": False,
        "is_online": False,
        "category": "Software Engineering",
        "venue_address": "8 Grange Road #05-01, Singapore, 239695",
        "venue_lat": "1.301527",
        "venue_long": "103.8363441",
        "venue_region": "South",
        "organizer_name": "Golden Mix",
        "organizer_website": "https://www.instagram.com/goldenmixsg/"
    }
    print("Creating Event 3...")
    print(dbc.create_or_update_event(event3))

    event4 = {
        "eventid": "4",
        "name": "Golden Mix Vol.19",
        "type": "Networking",
        "description": "Golden Mix Vol.19  -  Singapore’s largest Project Management event",
        "url": f"https://www.eventbrite.sg/e/golden-mix-vol9-tickets-1146639231809",
        "logo": f"https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F932993673%2F264956113191%2F1%2Foriginal.20250111-033640?h=200&w=450&auto=format%2Ccompress&q=75&sharp=10&rect=4%2C0%2C1272%2C636&s=0c9458b04f6c325c39ab19712acf9c30",
        "starttime_local": "2025-02-15T22:30:00",
        "endtime_local": "2025-02-16T02:30:00",
        "is_free": False,
        "is_online": False,
        "category": "Project Management",
        "venue_address": "8 Grange Road #05-01, Singapore, 239695",
        "venue_lat": "1.301527",
        "venue_long": "103.8363441",
        "venue_region": "South",
        "organizer_name": "Golden Mix",
        "organizer_website": "https://www.instagram.com/goldenmixsg/"
    }
    print("Creating Event 4...")
    print(dbc.create_or_update_event(event4))

    event5 = {
        "eventid": "5",
        "name": "Golden Mix Vol.24",
        "type": "Networking",
        "description": "Golden Mix Vol.24 -  Singapore’s largest AI event",
        "url": f"https://www.eventbrite.sg/e/golden-mix-vol9-tickets-1146639231809",
        "logo": f"https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F932993673%2F264956113191%2F1%2Foriginal.20250111-033640?h=200&w=450&auto=format%2Ccompress&q=75&sharp=10&rect=4%2C0%2C1272%2C636&s=0c9458b04f6c325c39ab19712acf9c30",
        "starttime_local": "2025-02-15T22:30:00",
        "endtime_local": "2025-02-16T02:30:00",
        "is_free": False,
        "is_online": False,
        "category": "Artificial Intelligence",
        "venue_address": "8 Grange Road #05-01, Singapore, 239695",
        "venue_lat": "1.301527",
        "venue_long": "103.8363441",
        "venue_region": "South",
        "organizer_name": "Golden Mix",
        "organizer_website": "https://www.instagram.com/goldenmixsg/"
    }
    print("Creating Event 5...")
    print(dbc.create_or_update_event(event5))

    
    # print(dbc.get_random_events())
    # print(dbc.get_random_users())
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