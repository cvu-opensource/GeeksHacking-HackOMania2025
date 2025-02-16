from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Response
from pydantic import BaseModel
from typing import List, Dict
import logging
import re
from apscheduler.schedulers.background import BackgroundScheduler
from bcrypt import hashpw, gensalt, checkpw
from dotenv import load_dotenv
from typing import List, Dict

# Load environment variables
load_dotenv()

# Initialize classes
from DBController import DBController
from EventsManager import EventManager
db = DBController()
em = EventManager()

# Initialize app
app = FastAPI(debug=True)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this based on your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Initialize scheduler
scheduler = BackgroundScheduler()

# ------------------ Helper ------------------ 

def hash_password(password):
    """
    Function:   Hashes a password for storing in db
    Input:      password:str
    Output:     hashed_password:bool, salt:??
    """
    salt = gensalt()
    hashed_password = hashpw(password.encode('utf-8'), salt)
    return hashed_password

def validate_password(password):
    """
    Function:   Validates the user's inputted password and returns a response.
                Criteria:
                - At least 8 characters long
                - Includes at least one uppercase letter
                - Includes at least one lowercase letter
                - Includes at least one digit
                - Includes at least one special character (!@#$%^&* etc.)
    Input:      password (str)
    Output:     (success:bool, response:str)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."
    if not any(char.isupper() for char in password):
        return False, "Password must include at least one uppercase letter."
    if not any(char.islower() for char in password):
        return False, "Password must include at least one lowercase letter."
    if not any(char.isdigit() for char in password):
        return False, "Password must include at least one digit."
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Password must include at least one special character (e.g., !@#$%^&*)."
    
    return True, "Password is valid."

def verify_password(input_password, stored_hashed_password):
    """
    Function:   Verifies inputted text password with hashed password in db
    Input:      input_password:str, stored_hashed_password:str
    Output:     success:bool
    """
    return checkpw(input_password.encode('utf-8'), stored_hashed_password.tobytes())

def get_nearest_region(latitude, longitude):
    """
    Function:   Takes the lat long position and converts it into one of the 5 regions in SG.
    Input:      latitude:str, longitude:str
    Output:     location:str
    """
    try:
        latitude, longitude = float(latitude), float(longitude)
        min_distance = float("inf")
        nearest_region = "Unknown"
        
        for region, points in REGION_LOCATIONS.items():
            for lat, lon in points:
                distance = calculate_distance(latitude, longitude, lat, lon)
                if distance < min_distance:
                    min_distance = distance
                    nearest_region = region
        
        return nearest_region
    except (TypeError, ValueError):
        return "Unknown"

def make_recommendation_request(url, data):
    """
    Function:   Handles requests made to recommendation system (aka ben).
    Input:      data: json
    Output:     res: json
    """
    HEADERS = {
        "Authorization": f"Bearer {self.api_key}",
        "Accept": "application/json"
    }
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)

        if response.status_code == 200:
            return Response(content=response.text, status_code=200, media_type="application/json")
        elif response.status_code == 400:
            return Response(content=response.text, status_code=400, media_type="application/json")
        elif response.status_code == 500:
            return Response(content=response.text, status_code=500, media_type="application/json")
        else:
            return Response(content=f"Unexpected error: {response.text}", status_code=response.status_code, media_type="application/json")

    except requests.exceptions.RequestException as e:
        logging.error(f"Recommendation API request failed: {e}")
        return {}

def access_friends_recommendation(endpoint, data):
    return make_recommendation_request(
        f'{os.getenv("FRIEND_RECOMMENDATION_ENDPOINT")}/{endpoint}', 
        data
    )

def access_events_recommendation(endpoint, data):
    return make_recommendation_request(
        f'{os.getenv("EVENT_RECOMMENDATION_ENDPOINT")}/{endpoint}', 
        data
    )

# ------------------ Models ------------------ 

class UserDetailsRequest(BaseModel):
    username: str
    password: str
    email: str
    birth_date: str
    gender: str
    region: str
    about_me: str
    linkedin_url: str
    github_url: str
    skills: List[str]
    interests: List[str]

class LoginRequest(BaseModel):
    username: str
    password: str

class GetUserRequest(BaseModel):
    username: str

class FriendshipRequest(BaseModel):
    username1: str
    username2: str

class JoinEventsRequest(BaseModel):
    username: str
    event_id: str

class AddEventsRequest(BaseModel):
    eventid: int
    event_name: str
    event_description: str
    event_url: str
    event_logo: str
    starttime_local: str
    endtime_local: str
    is_free: str
    is_online: str
    category: str
    venue_location: str
    organizer_name: str
    organizer_website: str

class AddForumsRequest(BaseModel):
    title: str
    username: str
    datetime: str
    description: str
    code: str
    comments: List[Dict[str, str]]
    interests: List[str]

class AddPostRequest(BaseModel):
    title: str
    username: str
    description: str
    code: str
    comments: List[Dict[str, str]]
    interests: List[str]

class AddCommentRequest(BaseModel):
    title: str
    username: str
    description: str

# ------------------ Routes ------------------

@app.get("/getRandomProfiles")
def get_random_profiles():
    """
    Gets random profiles to show on the holding page.
    """
    try:
        return {'success': True, 'message': "Successfully signed up."}
    except HTTPException as e:
        raise e 
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/getRandomEvents")
def get_random_events():
    """
    Gets random events to show on the holding page.
    """
    try:
        return {'success': True, 'message': "Successfully signed up."}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/signUp")
def signup(request: UserDetailsRequest):
    """
    Creates a new account for the user in the graph and vector dbs if their username and password are valid.
    """
    try:
        password_check = validate_password(request.password)
        if not password_check[0]:
            raise HTTPException(status_code=400, detail=password_check[1])

        user_data = request.model_dump()
        user_data['password'] = hash_password(request.password)
        user_data['birth_date'] = datetime.strptime(user_data['birth_date'], '%d/%m/%y')

        res = db.create_user(user_data)
        if not res['success']:
            raise HTTPException(status_code=400, detail=res['message'])
            
        data = {
            'contents': [request.interests],
            'ids': [request.username]
        }
        res = access_friends_recommendation('store', data)
        if res.status_code != 200:
            return res
        return {'success': True, 'message': "Successfully signed up."}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.post("/login")
def login(request: LoginRequest):
    """ 
    Redirects users to Spotify's login page for authentication after verifying username and password.
    """
    try:
        res = db.attempt_login({
            'username': request.username,
            'password': hash_password(request.password)
        })
        if not res['success']:
            raise HTTPException(status_code=400, detail=res['message'])
        return {'success': True, 'message': "Login successful."}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}.")


@app.post("/getUser")
def get_user(request: GetUserRequest):
    """
    Gets user information for profile page.
    """
    try:
        print(request)
        res = db.get_user(request.model_dump())
        if not res['success']:
            raise HTTPException(status_code=400, detail=res['message'])
        return res
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}.")


@app.post("/updateUser")
def update_user(request: UserDetailsRequest):
    """
    Updates users' details in the db.
    """
    try:
        res = db.update_user(request.model_dump())
        if not res['success']:
            raise HTTPException(status_code=400, detail=res['message'])
        return res
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}.")


@app.post("/addFriend")
def add_friend(request: FriendshipRequest):
    """
    Adds a friend for a user.
    """
    try:
        res = db.create_friendship(request.model_dump())
        if not res['success']:
            raise HTTPException(status_code=400, detail=res['message'])
        return res
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}.")


@app.get("/getFriends")
def get_friends(request: GetUserRequest):
    """
    Gets all friends for a user.
    """
    try:
        user_details = db.get_user(request.model_dump())
        if not user_details['success']:
            raise HTTPException(status_code=400, detail=user_details['message'])
        friend_details = [db.get_user(friend) for friend in user_details['friends']]
        return {'success': True, 'message': 'Friends retrieved successfully', 'friends': friend_details}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}.")


@app.get("/getFriendRecommendations")
def get_friend_recommendations(request: GetUserRequest):
    """
    Gets friend recommendations for a user based on interests using similarity search algorithm.
    """
    try:
        interests = db.get_user_interests(request.model_dump())
        if not interests['success']:
            raise HTTPException(status_code=500, detail=interests['message'])
        data = {
            'contents': interests[data],
            'ids': [request.username],
            'top_n': 5
        }
        res = access_friends_recommendation('retrieve', data)
        if res.status_code != 200:
            return res
        
        recommendations = {'recommendations': []}
        for user, users in res.items():
            for username, dist in users:
                recommendations['recommendations'].append(db.get_user(username))
        recommendations['success'] = True
        recommendations['message'] = 'Retrieved friend recommendations successfully.'
        return recommendations
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.post("/removeFriend")
def remove_friend(request: FriendshipRequest):
    """
    Removes a friend for a user.
    """
    try:
        res = db.delete_friendship(request.model_dump())
        if not res['success']:
            raise HTTPException(status_code=400, detail=res['message'])
        return res
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}.")


@app.post("/addEvents")
def add_events(request: AddEventsRequest):
    """
    Creates an event from users through the UI.
    """
    try:
        res = db.create_or_update_event(request.model_dump())
        if not res['success']:
            raise HTTPException(status_code=400, detail=res['message'])
        
        data = {
            'contents': [request.model_dump()],
            'ids': [request.username]
        }
        res = access_events_recommendation('store', data)
        if res.status_code != 200:
            return res
        return {'success': True, 'message': "Events added successfully."}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/getEventRecommendations")
def get_event_recommendations(request: GetUserRequest):
    """
    Gets event recommendations for a user based on interests using similarity search algorithm.
    """
    try:
        interests = db.get_user_interests(request.model_dump())
        if not interests['success']:
            raise HTTPException(status_code=500, detail=interests['message'])
        data = {
            'contents': interests[data],
            'ids': [request.username],
            'top_n': 10
        }
        res = access_events_recommendation('retrieve', data)
        if res.status_code != 200:
            return res
        
        print(interests, "interests")
        
        recommendations = {'recommendations': []}
        for user, users in res.items():
            for username, dist in users:
                recommendations['recommendations'].append(db.get_user(username))
        recommendations['success'] = True
        return recommendations
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.post("/joinEvents")
def join_events(request: JoinEventsRequest):
    """
    Adds an event for the user.
    """
    try:
        res = db.join_events(request.model_dump())
        if not res['success']:
            raise HTTPException(status_code=400, detail=res['message'])
        return res
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.post("/addPost")
def add_post(request: AddPostRequest):
    """
    Creates a post for the forum page.
    """
    try:
        res = db.create_thread(request.model_dump())
        if not res['success']:
            raise HTTPException(status_code=400, detail=res['message'])
        return res
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.post("/addComment")
def add_comment(request: AddCommentRequest):
    """
    Adds a comment under the post on the forum page.
    """
    try:
        res = db.create_comment(request.model_dump())
        if not res['success']:
            raise HTTPException(status_code=400, detail=res['message'])
        return res
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


# @app.get("/getPosts")
# def get_posts(request: GetUserRequest):
#     """
#     Gets post recommendations for the forum page using a recommendation system?.
#     """
#     try:
#         interests = db.get_user_interests(request.model_dump())
#         if not interests['success']:
#             raise HTTPException(status_code=500, detail=interests['message'])
#         data = {
#             'contents': interests[data],
#             'ids': [request.username]
#         }
#         res = make_recommendation_request('retrieve', data)
        # if res.status_code != 200:
        #     return res
        
#         recommendations = {'recommendations': []}
#         for user, users in res.items():
#             for username, dist in users:
#                 recommendations['recommendations'].append(db.get_user(username))
#         recommendations['success'] = True
#         return recommendations
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# def update_events():
#     """
#     Function to update the database with events once a day based on scheduler
#     """
#     try:
#         events = em.get_events()
#         for idx, event in enumerate(events):
#             event['venue_region'] = get_nearest_region(event.get('venue_lat'), event.get('venue_long'))
#             event['type'] = 'Networking'  # how should we extract event type
#             db.create_or_update_event(event)
#             logging.info(f"Daily event {idx} update successful.")
#     except Exception as e:
#         logging.error(f"Error updating events: {e}")

# Schedule the update to run daily at midnight
# scheduler.add_job(update_events, 'interval', days=1, next_run_time=datetime.now())
# scheduler.start()
