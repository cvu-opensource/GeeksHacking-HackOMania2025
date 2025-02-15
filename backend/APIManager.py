from datetime import datetime
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import logging
import re
from apscheduler.schedulers.background import BackgroundScheduler
from bcrypt import hashpw, gensalt, checkpw

# Initialize classes
from QueryManager import QueryManager
from EventManager import EventManager
qm = QueryManager()
em = EventManager()

# Initialize app
app = FastAPI()

# Initialize scheduler
scheduler = BackgroundScheduler()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

# ------------------ Models ------------------ 

class UserDetailsRequest(BaseModel):
    username: str
    password: str
    email: str
    age: int
    gender: str
    region: str
    skills: list
    interests: list
    about_me: str
    linkedin_url: str
    github_url: str

class LoginRequest(BaseModel):
    username: str
    password: str

class GetUserRequest(BaseModel):
    username: str

class FriendRequest(BaseModel):
    username: str
    friend: str

class GetEventsRequest(BaseModel):
    None

class JoinEventsRequest(BaseModel):
    username: str
    event_id: str

class AddEventsRequest(BaseModel):
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

# ------------------ Routes ------------------

@app.post("/signUp")
def signup(request: UserDetailsRequest):
    """
    Creates a new account for the user if their username and password are valid.
    """
    try:
        password_check = validate_password(request.password)
        if password_check[0]:
            raise HTTPException(status_code=400, detail=password_check[1])

        user_data = request.dict()
        user_data['password'] = hash_password(request.password)

        res = qm.create_user(user_data)
        if res['success']:
            return {'success': True, 'message': "Successfully signed up."}
        raise HTTPException(status_code=400, detail=res['message'])
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Signup error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.post("/login")
def login(request: LoginRequest):
    """ 
    Redirects users to Spotify's login page for authentication after verifying username and password.
    """
    try:
        res = qm.attempt_login({
            'username': request.username,
            'password': hash_password(request.password)
        })
        if not res['success']:
            raise HTTPException(status_code=400, detail=res['message'])
        return {'success': True, 'message': "Login successful."}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}.")


@app.get("/getUser")
def get_user(request: GetUserRequest):
    """
    Gets user information for profile page.
    """
    try:
        res = qm.get_user(request.dict())
        if not res['success']:
            raise HTTPException(status_code=400, detail=res['message'])
        return res
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Update user error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}.")


@app.post("/updateUser")
def update_user(request: UserDetailsRequest):
    """
    Updates users' details in the db.
    """
    try:
        res = qm.update_user(request.dict())
        if not res['success']:
            raise HTTPException(status_code=400, detail=res['message'])
        return res
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Update user error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}.")


@app.get("/addFriend")
def add_friend(request: FriendRequest):
    """
    Adds a friend for a user.
    """
    try:
        res = qm.add_friend(request.dict())
        if not res['success']:
            raise HTTPException(status_code=400, detail=res['message'])
        return res
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Add friend error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}.")


@app.get("/getFriends")
def get_friends(request: GetUserRequest):
    """
    Gets all friends for a user.
    """
    try:
        user_details = qm.get_user(request.dict())
        if not user_details['success']:
            raise HTTPException(status_code=400, detail=user_details['message'])
        friend_details = [qm.get_user(friend) for friend in user_details['friends']]
        return {'success': True, 'friends': friend_details}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Update user error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}.")


@app.get("/removeFriend")
def remove_friend(request: FriendRequest):
    """
    Removes a friend for a user.
    """
    try:
        res = qm.remove_friend(request.dict())
        if not res['success']:
            raise HTTPException(status_code=400, detail=res['message'])
        return res
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Remove friend error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}.")


@app.get("/addEvents")
def add_events(request: AddEventsRequest):
    """
    Creates an event from users through the UI.
    """
    try:
        res = qm.update_events(request.dict())
        if not res['success']:
            raise HTTPException(status_code=400, detail=res['message'])
        return res
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

 
@app.get("/getEvents")
def get_events(request: GetEventsRequest):
    """
    Gets events to display on 'Events' page with event information.
    """
    try:
        res = qm.get_events({'username': request.username})  # TODO: Query recommendationn system first
        if not res['success']:
            raise HTTPException(status_code=400, detail=res['message'])
        return res
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/joinEvents")
def join_events(request: JoinEventsRequest):
    """
    Adds an event for the user.
    """
    try:
        res = qm.join_events(request.dict())
        if not res['success']:
            raise HTTPException(status_code=400, detail=res['message'])
        return res
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


def update_events():
    """
    Function to update the database with events once a day.
    """
    try:
        events = em.get_events()
        for idx, event in enumerate(events):
            event['venue_region'] = get_nearest_region(event.get('venue_lat'), event.get('venue_long'))
            event['type'] = 'Networking'  # how should we extract event type
            event['verified'] = True
            qm.update_events(event)
            logging.info(f"Daily event {idx} update successful.")
    except Exception as e:
        logging.error(f"Error updating events: {e}")

# Schedule the update to run daily at midnight
scheduler.add_job(update_events, 'interval', days=1, next_run_time=datetime.now())
scheduler.start()
